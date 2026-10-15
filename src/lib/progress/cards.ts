import { BOX_INTERVAL_DAYS } from '../../config'
import type { CardState, ItemKey, Progress } from '../../types'
import { DAY_MS } from '../dates'

const TOP_BOX = BOX_INTERVAL_DAYS.length - 1

/** Leitner: right moves up a box, wrong drops to box 0 and counts a miss. */
export function updateCard(prev: CardState | undefined, correct: boolean, now: number): CardState {
  const box = correct ? Math.min((prev?.box ?? 0) + 1, TOP_BOX) : 0
  return {
    box,
    due: now + BOX_INTERVAL_DAYS[box] * DAY_MS,
    misses: (prev?.misses ?? 0) + (correct ? 0 : 1),
    updatedAt: now,
  }
}

/** Cards due now, most overdue first. */
export function dueKeys(p: Progress, now: number, limit: number): ItemKey[] {
  return Object.entries(p.cards)
    .filter(([, c]) => c.due <= now)
    .sort(([, a], [, b]) => a.due - b.due)
    .slice(0, limit)
    .map(([key]) => key)
}

/** Still-shaky cards the learner has missed, most missed first. */
export function mistakeKeys(p: Progress, limit: number): ItemKey[] {
  return Object.entries(p.cards)
    .filter(([, c]) => c.misses > 0 && c.box <= 1)
    .sort(([, a], [, b]) => b.misses - a.misses)
    .slice(0, limit)
    .map(([key]) => key)
}
