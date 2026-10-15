import { DEFAULT_LANG, getCourse } from '../content'
import { VOICES, VOICE_PREVIEW_LINE, DEFAULT_VOICE } from '../config'
import { audioKey } from '../lib/audioKey'
import { pickVoice } from '../lib/voicePick'
import type { LangId, VoicePref } from '../types'

const SLOW_CLIP_RATE = 0.7
const SPEECH_RATE = 0.9
const SLOW_SPEECH_RATE = 0.6

/** lang -> voice id -> audio keys recorded in that voice. */
const recorded = new Map<LangId, Map<string, Set<string>>>()
let player: HTMLAudioElement | null = null
let preference: VoicePref = DEFAULT_VOICE

export function setVoicePreference(pref: VoicePref): void {
  preference = pref
}

async function fetchKeys(lang: LangId, voiceId: string): Promise<Set<string>> {
  try {
    const res = await fetch(`/audio/${lang}/${voiceId}/index.json`)
    const keys: unknown = res.ok ? await res.json() : []
    return new Set(Array.isArray(keys) ? keys.filter((k) => typeof k === 'string') : [])
  } catch {
    return new Set()
  }
}

export async function loadVoiceIndex(lang: LangId): Promise<void> {
  const sets = await Promise.all(VOICES.map((v) => fetchKeys(lang, v.id)))
  recorded.set(lang, new Map(VOICES.map((v, i) => [v.id, sets[i]])))
}

/** Ids of the voices that recorded `key`. */
function voicesWith(lang: LangId, key: string): string[] {
  const byVoice = recorded.get(lang)
  return VOICES.filter((v) => byVoice?.get(v.id)?.has(key)).map((v) => v.id)
}

function stopAll(): void {
  player?.pause()
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}

function playClip(lang: LangId, voiceId: string, key: string, slow: boolean): void {
  player ??= new Audio()
  player.src = `/audio/${lang}/${voiceId}/${key}.mp3`
  player.preservesPitch = true
  player.playbackRate = slow ? SLOW_CLIP_RATE : 1
  void player.play().catch(() => undefined)
}

/** Prefer the course locale ('mr'), then Hindi, then the device default. */
function pickDeviceVoice(locale: string): SpeechSynthesisVoice | undefined {
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
  const voice = pickDeviceVoice(locale)
  if (voice) utterance.voice = voice
  window.speechSynthesis.speak(utterance)
}

function play(text: string, lang: LangId, slow: boolean, pref: VoicePref): void {
  const key = audioKey(text)
  const voiceId = pickVoice(pref, voicesWith(lang, key))
  stopAll()
  if (voiceId) playClip(lang, voiceId, key, slow)
  else speakWithDevice(text, getCourse(lang).locale, slow)
}

/** Plays a recorded clip for `text` in the chosen voice (same audioKey as the recorder), else the device voice. */
export function say(text: string, opts: { slow?: boolean; lang?: LangId } = {}): void {
  play(text, opts.lang ?? DEFAULT_LANG, opts.slow === true, preference)
}

/** Settings preview: the sample line in `pref` (for 'mix', a random voice). */
export function previewVoice(pref: VoicePref): void {
  play(VOICE_PREVIEW_LINE, DEFAULT_LANG, false, pref)
}

/**
 * Plays one specific voice's recording of `text` (for teachers checking each voice).
 * Returns false when that voice has no clip yet, so the UI can say so instead of playing another voice.
 */
export function sayWithVoice(text: string, voiceId: string, lang: LangId = DEFAULT_LANG): boolean {
  const key = audioKey(text)
  if (!voicesWith(lang, key).includes(voiceId)) return false
  stopAll()
  playClip(lang, voiceId, key, false)
  return true
}
