import type { Course, Progress, SessionInput, SessionOutcome } from '../../types'
import { dateKey } from '../dates'
import { evaluateBadges } from './badges'
import { updateCard } from './cards'
import { isLessonDone } from './unlock'
import { accuracyOf, isPassed, sessionXp } from './xp'

function withCards(p: Progress, input: SessionInput): Progress {
  const cards = { ...p.cards }
  for (const r of input.results) cards[r.key] = updateCard(cards[r.key], r.correct, input.now)
  return { ...p, cards }
}

function withDay(p: Progress, xp: number, now: number): Progress {
  const key = dateKey(now)
  const day = p.days[key] ?? { xp: 0, sessions: 0 }
  return { ...p, days: { ...p.days, [key]: { xp: day.xp + xp, sessions: day.sessions + 1 } } }
}

function withLesson(p: Progress, input: SessionInput, accuracy: number): Progress {
  const prev = p.lessons[input.id]
  const record = {
    completedAt: prev?.completedAt ?? input.now,
    bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, accuracy),
    count: (prev?.count ?? 0) + 1,
  }
  return { ...p, lessons: { ...p.lessons, [input.id]: record } }
}

function withBadges(p: Progress, ids: string[], now: number): Progress {
  const earned = Object.fromEntries(ids.map((id) => [id, now]))
  return { ...p, badges: { ...p.badges, ...earned } }
}

export function recordSession(p: Progress, input: SessionInput, course: Course): SessionOutcome {
  const accuracy = accuracyOf(input.results)
  const passed = isPassed(input.kind, accuracy)
  const tracked = passed && input.kind !== 'review'
  const xpEarned = sessionXp(input, accuracy, tracked && isLessonDone(p, input.id))

  let next = withDay(withCards(p, input), xpEarned, input.now)
  if (tracked) next = withLesson(next, input, accuracy)
  const newBadges = evaluateBadges(next, course, dateKey(input.now))
  return { progress: withBadges(next, newBadges, input.now), xpEarned, accuracy, passed, newBadges }
}
