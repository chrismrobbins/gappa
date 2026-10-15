import { createClient } from '@supabase/supabase-js'
import { bearerToken, errorJson, json, requireEnv, serverError } from './_lib.js'

const MAX_AUDIO_BYTES = 2 * 1024 * 1024
/** Room for the multipart envelope around the audio. */
const MAX_BODY_BYTES = MAX_AUDIO_BYTES + 64 * 1024
const TOO_LONG = 'That recording is too long. Please keep it short.'
const STT_URL = 'https://api.elevenlabs.io/v1/speech-to-text'

async function isSignedIn(token: string): Promise<boolean> {
  const supabase = createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_ANON_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data, error } = await supabase.auth.getUser(token)
  return !error && data.user !== null
}

async function scribe(audio: Blob, lang: string): Promise<string> {
  const form = new FormData()
  form.append('file', audio, 'speech')
  form.append('model_id', process.env.ELEVENLABS_STT_MODEL || 'scribe_v1')
  form.append('language_code', lang)
  const res = await fetch(STT_URL, {
    method: 'POST',
    headers: { 'xi-api-key': requireEnv('ELEVENLABS_API_KEY') },
    body: form,
  })
  if (!res.ok) throw new Error(`speech-to-text failed (${res.status})`)
  const result = (await res.json()) as { text?: string }
  return (result.text ?? '').trim()
}

/** Pulls a valid audio file and language out of the form, or returns a friendly error. */
function readForm(form: FormData): { audio: Blob; lang: string } | string {
  const audio = form.get('audio')
  const lang = form.get('lang')
  if (!(audio instanceof Blob) || audio.size === 0) return 'No audio came through. Please try again.'
  if (audio.size > MAX_AUDIO_BYTES) return TOO_LONG
  if (lang !== 'mr' && lang !== 'hi') return 'Unknown language.'
  return { audio, lang }
}

/** Rejects oversized uploads from the header, before the body is read into memory. */
function declaredTooLarge(req: Request): boolean {
  return Number(req.headers.get('content-length') ?? 0) > MAX_BODY_BYTES
}

async function transcribe(req: Request): Promise<Response> {
  const token = bearerToken(req)
  if (!token || !(await isSignedIn(token))) return errorJson('Please sign in to use speaking practice.', 401)
  if (declaredTooLarge(req)) return errorJson(TOO_LONG, 413)
  const form = await req.formData().catch(() => null)
  const input = form ? readForm(form) : 'Expected an audio upload.'
  if (typeof input === 'string') return errorJson(input, 400)
  return json({ text: await scribe(input.audio, input.lang) })
}

export async function POST(req: Request): Promise<Response> {
  return transcribe(req).catch(serverError)
}
