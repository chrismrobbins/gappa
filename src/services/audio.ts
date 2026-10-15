import { DEFAULT_LANG, getCourse } from '../content'
import { audioKey } from '../lib/audioKey'
import type { LangId } from '../types'

const SLOW_CLIP_RATE = 0.7
const SPEECH_RATE = 0.9
const SLOW_SPEECH_RATE = 0.6

const recorded = new Map<LangId, Set<string>>()
let player: HTMLAudioElement | null = null

export async function loadVoiceIndex(lang: LangId): Promise<void> {
  try {
    const res = await fetch(`/audio/${lang}/index.json`)
    const keys: unknown = res.ok ? await res.json() : []
    recorded.set(lang, new Set(Array.isArray(keys) ? keys.filter((k) => typeof k === 'string') : []))
  } catch {
    recorded.set(lang, new Set())
  }
}

function stopAll(): void {
  player?.pause()
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}

function playClip(lang: LangId, key: string, slow: boolean): void {
  player ??= new Audio()
  player.src = `/audio/${lang}/${key}.mp3`
  player.preservesPitch = true
  player.playbackRate = slow ? SLOW_CLIP_RATE : 1
  void player.play().catch(() => undefined)
}

/** Prefer the course locale ('mr'), then Hindi, then the device default. */
function pickVoice(locale: string): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices()
  const prefix = (code: string) => code.split('-')[0].toLowerCase()
  const byPrefix = (p: string) => voices.find((v) => v.lang.toLowerCase().startsWith(p))
  return byPrefix(prefix(locale)) ?? byPrefix('hi')
}

function speakWithDevice(text: string, locale: string, slow: boolean): void {
  if (!('speechSynthesis' in window)) return
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = locale
  utterance.rate = slow ? SLOW_SPEECH_RATE : SPEECH_RATE
  const voice = pickVoice(locale)
  if (voice) utterance.voice = voice
  window.speechSynthesis.speak(utterance)
}

/** Plays the recorded clip for `text` (same audioKey as the recorder), else the device voice. */
export function say(text: string, opts: { slow?: boolean; lang?: LangId } = {}): void {
  const lang = opts.lang ?? DEFAULT_LANG
  const slow = opts.slow === true
  const key = audioKey(text)
  stopAll()
  if (recorded.get(lang)?.has(key)) playClip(lang, key, slow)
  else speakWithDevice(text, getCourse(lang).locale, slow)
}
