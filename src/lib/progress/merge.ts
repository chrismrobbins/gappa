import type { Progress } from '../../types'

/** Union of two keyed records; `pick` resolves keys present in both. */
function mergeRecords<T>(a: Record<string, T>, b: Record<string, T>, pick: (x: T, y: T) => T): Record<string, T> {
  const out: Record<string, T> = { ...a }
  for (const [key, value] of Object.entries(b)) {
    out[key] = key in a ? pick(a[key], value) : value
  }
  return out
}

const newer = <T extends { updatedAt: number }>(x: T, y: T): T => (y.updatedAt > x.updatedAt ? y : x)

export function mergeProgress(a: Progress, b: Progress): Progress {
  return {
    schema: 1,
    settings: newer(a.settings, b.settings),
    days: mergeRecords(a.days, b.days, (x, y) => ({
      xp: Math.max(x.xp, y.xp),
      sessions: Math.max(x.sessions, y.sessions),
    })),
    lessons: mergeRecords(a.lessons, b.lessons, (x, y) => ({
      count: Math.max(x.count, y.count),
      bestAccuracy: Math.max(x.bestAccuracy, y.bestAccuracy),
      completedAt: Math.min(x.completedAt, y.completedAt),
    })),
    cards: mergeRecords(a.cards, b.cards, newer),
    badges: mergeRecords(a.badges, b.badges, Math.min),
  }
}
