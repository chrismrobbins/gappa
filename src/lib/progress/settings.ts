import { ROMANIZATION_FADE_LEVEL } from '../../config'
import type { Progress, Settings } from '../../types'
import { levelInfo, totalXp } from './xp'

export function updateSettings(p: Progress, patch: Partial<Settings>, now: number): Progress {
  return { ...p, settings: { ...p.settings, ...patch, updatedAt: now } }
}

/** Whether romanization shows without a tap: always, or in 'auto' mode until the fade level. */
export function showsRomanization(p: Progress): boolean {
  const mode = p.settings.romanization
  if (mode === 'always') return true
  return mode === 'auto' && levelInfo(totalXp(p)).level < ROMANIZATION_FADE_LEVEL
}
