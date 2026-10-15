import { SPEECH_MAX_SECONDS } from '../config'
import { getCourse } from '../content'
import { resolveMode, type SpeechEnv } from '../lib/speechMode'
import type { LangId, SpeechMode } from '../types'
import { cloudEnabled, requireSupabase } from './supabase'

export interface Listener {
  stop(): Promise<string>
  cancel(): void
}

// Minimal shapes for the prefixed Web Speech API (not in lib.dom).
interface RecognitionResult { 0: { transcript: string } }
interface RecognitionEvent { results: ArrayLike<RecognitionResult> }
interface Recognition {
  lang: string
  interimResults: boolean
  onresult: ((e: RecognitionEvent) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}
type RecognitionCtor = new () => Recognition
type WithRecognition = Window & { webkitSpeechRecognition?: RecognitionCtor }
interface BrandedNavigator { userAgentData?: { brands: { brand: string }[] } }

/** Chrome records webm; iPhone/iPad Safari records mp4 (AAC). Both are accepted by Scribe. */
const RECORDING_TYPES = ['audio/webm', 'audio/mp4']

function readEnv(): SpeechEnv {
  const brands = (navigator as BrandedNavigator).userAgentData?.brands ?? []
  return {
    userAgent: navigator.userAgent,
    brands: brands.map((b) => b.brand),
    hasWebkitRecognition: Boolean((window as WithRecognition).webkitSpeechRecognition),
    cloudEnabled,
  }
}

export function resolveSpeechMode(setting: SpeechMode): 'browser' | 'server' | 'off' {
  return resolveMode(setting, readEnv())
}

function listenInBrowser(lang: LangId): Listener {
  const Ctor = (window as WithRecognition).webkitSpeechRecognition
  if (!Ctor) throw new Error('Speaking practice is not available in this browser.')
  const rec = new Ctor()
  let text = ''
  let finish: (t: string) => void = () => undefined
  const done = new Promise<string>((resolve) => (finish = resolve))
  rec.lang = getCourse(lang).locale
  rec.interimResults = false
  rec.onresult = (e) => { text = Array.from(e.results, (r) => r[0].transcript).join(' ') }
  rec.onend = () => finish(text)
  rec.onerror = () => finish('')
  rec.start()
  return { stop: () => { rec.stop(); return done }, cancel: () => rec.abort() }
}

function pickRecordingType(): string | undefined {
  if (typeof MediaRecorder.isTypeSupported !== 'function') return undefined
  return RECORDING_TYPES.find((t) => MediaRecorder.isTypeSupported(t))
}

/** File name with an extension matching the recording, so the server can tell the format. */
function fileNameFor(blob: Blob): string {
  return blob.type.includes('mp4') ? 'speech.mp4' : 'speech.webm'
}

async function transcribeOnServer(blob: Blob, lang: LangId): Promise<string> {
  const { data } = await requireSupabase().auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error('Please sign in to use speaking practice.')
  const form = new FormData()
  form.append('audio', blob, fileNameFor(blob))
  form.append('lang', lang)
  const res = await fetch('/api/transcribe', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form })
  const body = (await res.json().catch(() => ({}))) as { text?: string; error?: string }
  if (!res.ok) throw new Error(body.error ?? 'We could not hear that. Please try again.')
  return body.text ?? ''
}

/** Starts the mic; stops by itself after SPEECH_MAX_SECONDS. */
async function startRecorder(chunks: Blob[]): Promise<MediaRecorder> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => {
    throw new Error('Please allow the microphone to practise speaking.')
  })
  const mimeType = pickRecordingType()
  const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
  recorder.ondataavailable = (e) => chunks.push(e.data)
  recorder.start()
  window.setTimeout(() => { if (recorder.state === 'recording') recorder.stop() }, SPEECH_MAX_SECONDS * 1000)
  return recorder
}

/** Stops recording, releases the mic and returns everything recorded. */
function stopRecorder(recorder: MediaRecorder, chunks: Blob[]): Promise<Blob> {
  return new Promise((resolve) => {
    const finish = () => {
      recorder.stream.getTracks().forEach((t) => t.stop())
      resolve(new Blob(chunks, { type: recorder.mimeType }))
    }
    if (recorder.state === 'inactive') return finish()
    recorder.onstop = finish
    recorder.stop()
  })
}

function listenOnServer(lang: LangId): Listener {
  const chunks: Blob[] = []
  const ready = startRecorder(chunks)
  ready.catch(() => undefined) // The error surfaces from stop(); this only marks it as handled.
  let cancelled = false
  return {
    async stop() {
      const blob = await stopRecorder(await ready, chunks)
      return cancelled ? '' : transcribeOnServer(blob, lang)
    },
    cancel() {
      cancelled = true
      ready.then((recorder) => stopRecorder(recorder, chunks)).catch(() => undefined)
    },
  }
}

export function startListening(lang: LangId, mode: 'browser' | 'server'): Listener {
  return mode === 'browser' ? listenInBrowser(lang) : listenOnServer(lang)
}
