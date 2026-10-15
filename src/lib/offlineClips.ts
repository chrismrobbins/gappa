import type { LangId } from '../types'

/** Rough size of one recorded line; only used for the "≈ N MB" estimate. */
const APPROX_CLIP_KB = 20

export function voiceIndexUrl(lang: LangId, voiceId: string): string {
  return `/audio/${lang}/${voiceId}/index.json`
}

export function clipUrl(lang: LangId, voiceId: string, key: string): string {
  return `/audio/${lang}/${voiceId}/${key}.mp3`
}

/** Voices that the current preference can play: all of them for Mix. */
export function voicesToDownload(pref: string, allVoiceIds: string[]): string[] {
  return pref === 'mix' ? allVoiceIds : allVoiceIds.filter((id) => id === pref)
}

/** Every clip url named by the given voice indexes (voice id -> audio keys). */
export function clipUrls(lang: LangId, indexes: Record<string, string[]>): string[] {
  return Object.entries(indexes).flatMap(([voiceId, keys]) => keys.map((k) => clipUrl(lang, voiceId, k)))
}

export function estimateMb(clipCount: number): number {
  return Math.max(1, Math.round((clipCount * APPROX_CLIP_KB) / 1024))
}
