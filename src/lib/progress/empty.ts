import type { Progress } from '../../types'

export function emptyProgress(now: number): Progress {
  return {
    schema: 1,
    settings: { dailyGoal: 20, romanization: 'auto', sound: true, speech: 'auto', updatedAt: now },
    days: {},
    lessons: {},
    cards: {},
    badges: {},
  }
}

const isRecord = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null

/** Saved data (local or cloud) if it has the current shape, else null. Guards against stale or corrupt copies. */
export function asProgress(data: unknown): Progress | null {
  if (!isRecord(data) || data.schema !== 1) return null
  const parts = [data.settings, data.days, data.lessons, data.cards, data.badges]
  return parts.every(isRecord) ? (data as unknown as Progress) : null
}
