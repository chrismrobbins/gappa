import { buildCheckpoint, buildLesson, buildReview, buildScriptLesson } from '../../engine'
import { checkpointId } from '../../lib/progress'
import type { Card, Course, ItemKey, SessionKind } from '../../types'

export interface Session {
  kind: SessionKind
  id: string
  cards: Card[]
}

function checkpointUnit(course: Course, id: string): string {
  return course.units.find((u) => checkpointId(u.id) === id)?.id ?? id
}

export function startSession(course: Course, kind: SessionKind, id: string): Session {
  const cards =
    kind === 'script' ? buildScriptLesson(course, id)
    : kind === 'checkpoint' ? buildCheckpoint(course, checkpointUnit(course, id))
    : buildLesson(course, id)
  return { kind, id, cards }
}

export function reviewSession(course: Course, keys: ItemKey[]): Session {
  return { kind: 'review', id: 'review', cards: buildReview(course, keys) }
}
