import { DEFAULT_VOICE } from '../../config'
import type { Progress } from '../../types'

export function emptyProgress(now: number): Progress {
  return {
    schema: 1,
    settings: { dailyGoal: 20, romanization: 'auto', sound: true, speech: 'auto', voice: DEFAULT_VOICE, updatedAt: now },
    days: {},
    lessons: {},
    cards: {},
    badges: {},
  }
}

const isRecord = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null

/** Fills settings added after a copy was saved (e.g. `voice`). */
function withDefaults(p: Progress): Progress {
  const voice = typeof p.settings.voice === 'string' ? p.settings.voice : DEFAULT_VOICE
  return { ...p, settings: { ...p.settings, voice } }
}

/** Saved data (local or cloud) if it has the current shape, else null. Guards against stale or corrupt copies. */
export function asProgress(data: unknown): Progress | null {
  if (!isRecord(data) || data.schema !== 1) return null
  const parts = [data.settings, data.days, data.lessons, data.cards, data.badges]
  return parts.every(isRecord) ? withDefaults(data as unknown as Progress) : null
}
