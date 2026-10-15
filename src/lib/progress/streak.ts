import { STREAK_FREEZE } from '../../config'
import type { Progress, StreakInfo } from '../../types'
import { addDays } from '../dates'

const isActive = (p: Progress, key: string): boolean => (p.days[key]?.sessions ?? 0) > 0

function activeDay(s: StreakInfo): StreakInfo {
  const current = s.current + 1
  const earned = current % STREAK_FREEZE.earnEveryDays === 0
  return {
    ...s,
    current,
    longest: Math.max(s.longest, current),
    freezes: earned ? Math.min(s.freezes + 1, STREAK_FREEZE.max) : s.freezes,
  }
}

function missedDay(s: StreakInfo, key: string): StreakInfo {
  if (s.freezes > 0) return { ...s, freezes: s.freezes - 1, frozenDays: [...s.frozenDays, key] }
  return { ...s, current: 0 }
}

/** Derived purely from `days`; an inactive today never breaks the streak. */
export function streakInfo(p: Progress, today: string): StreakInfo {
  let s: StreakInfo = { current: 0, longest: 0, freezes: 0, frozenDays: [], doneToday: isActive(p, today) }
  const first = Object.keys(p.days).filter((k) => k <= today && isActive(p, k)).sort()[0]
  if (first === undefined) return s
  for (let key = first; key <= today; key = addDays(key, 1)) {
    if (isActive(p, key)) s = activeDay(s)
    else if (key !== today) s = missedDay(s, key)
  }
  return s
}
