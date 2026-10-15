// Usage: tsx scripts/record-voices.ts [--dry] [--lang mr] [--audition "<text>" --voices id1,id2]
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { getCourse } from '../src/content'
import { audioKey } from '../src/lib/audioKey'
import type { LangId } from '../src/types'
import { loadEnv, requireEnv, runScript } from './_admin'
import { charCount, collectLines } from './lines'

const USAGE_FILE = 'scripts/voice-usage.json'
const AUDITION_DIR = 'scripts/auditions'
const TTS_URL = 'https://api.elevenlabs.io/v1/text-to-speech'

interface Args { dry: boolean; lang: LangId; audition?: string; voices: string[] }
type Usage = Record<string, number>

function option(argv: string[], name: string): string | undefined {
  const i = argv.indexOf(name)
  return i >= 0 ? argv[i + 1] : undefined
}

function parseArgs(argv: string[]): Args {
  return {
    dry: argv.includes('--dry'),
    lang: option(argv, '--lang') === 'hi' ? 'hi' : 'mr',
    audition: option(argv, '--audition'),
    voices: (option(argv, '--voices') ?? '').split(',').filter(Boolean),
  }
}

function readJson<T>(file: string, fallback: T): T {
  return existsSync(file) ? (JSON.parse(readFileSync(file, 'utf8')) as T) : fallback
}

const monthKey = (): string => new Date().toISOString().slice(0, 7)
const loadUsage = (): Usage => readJson<Usage>(USAGE_FILE, {})
const saveUsage = (u: Usage): void => writeFileSync(USAGE_FILE, JSON.stringify(u, null, 2) + '\n')
const monthlyCap = (): number => Number(process.env.ELEVENLABS_MONTHLY_CAP) || 28000

function recordedKeys(dir: string): Set<string> {
  if (!existsSync(dir)) return new Set()
  return new Set(readdirSync(dir).filter((f) => f.endsWith('.mp3')).map((f) => f.slice(0, -4)))
}

function writeIndex(dir: string): void {
  const keys = [...recordedKeys(dir)].sort()
  writeFileSync(join(dir, 'index.json'), JSON.stringify(keys) + '\n')
}

async function synthesize(text: string, voiceId: string): Promise<Buffer> {
  const res = await fetch(`${TTS_URL}/${voiceId}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': requireEnv('ELEVENLABS_API_KEY'), 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, model_id: process.env.ELEVENLABS_TTS_MODEL || 'eleven_v3' }),
  })
  if (!res.ok) throw new Error(`ElevenLabs refused the request (${res.status}).`)
  return Buffer.from(await res.arrayBuffer())
}

async function audition(text: string, voices: string[]): Promise<void> {
  if (voices.length === 0) throw new Error('Pass --voices id1,id2 with --audition.')
  mkdirSync(AUDITION_DIR, { recursive: true })
  for (const voice of voices) {
    writeFileSync(join(AUDITION_DIR, `${voice}.mp3`), await synthesize(text, voice))
    console.log(`Saved ${AUDITION_DIR}/${voice}.mp3`)
  }
}

function plan(lang: LangId, dir: string) {
  const lines = collectLines(getCourse(lang))
  const have = recordedKeys(dir)
  const missing = lines.filter((l) => !have.has(audioKey(l)))
  return { lines, missing, chars: missing.reduce((n, l) => n + charCount(l), 0) }
}

async function recordMissing(missing: string[], dir: string): Promise<void> {
  const voiceId = requireEnv('ELEVENLABS_VOICE_ID')
  const usage = loadUsage()
  const month = monthKey()
  for (const line of missing) {
    const used = usage[month] ?? 0
    if (used + charCount(line) > monthlyCap()) {
      console.log(`Monthly cap of ${monthlyCap()} characters reached; stopping. Run again next month.`)
      return
    }
    writeFileSync(join(dir, `${audioKey(line)}.mp3`), await synthesize(line, voiceId))
    usage[month] = used + charCount(line)
    saveUsage(usage)
    console.log(`Recorded ${line}`)
  }
}

async function main(): Promise<void> {
  loadEnv()
  const args = parseArgs(process.argv.slice(2))
  if (args.audition) return audition(args.audition, args.voices)
  const dir = join('public/audio', args.lang)
  mkdirSync(dir, { recursive: true })
  const { lines, missing, chars } = plan(args.lang, dir)
  const remaining = monthlyCap() - (loadUsage()[monthKey()] ?? 0)
  console.log(`${lines.length} lines, ${missing.length} to record, ${chars} characters.`)
  console.log(`Budget left this month: ${remaining} of ${monthlyCap()} characters.`)
  if (args.dry) return
  // Index whatever got recorded, even if a request fails part way.
  await recordMissing(missing, dir).finally(() => writeIndex(dir))
}

runScript(main)
