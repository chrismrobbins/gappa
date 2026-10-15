import { isLessonDone, isUnlocked } from '../../lib/progress'
import type { Course, Progress } from '../../types'
import { sectionsFor, type NodeInfo, type Track } from './sections'

/** The first unlocked, unfinished node of a track: what the Continue button starts. */
export function nextNode(course: Course, progress: Progress, track: Track): NodeInfo | null {
  const nodes = sectionsFor(course, track).flatMap((s) => s.nodes)
  return nodes.find((n) => !isLessonDone(progress, n.id) && isUnlocked(progress, course, n.id)) ?? null
}

/** One warm line about the streak under the daily-goal bar. */
export function streakNudge(current: number, doneToday: boolean): string {
  if (doneToday) return current > 1 ? `${current}-day streak. Nice work today!` : 'Streak started. Nice work today!'
  return current > 0 ? `Keep your ${current}-day streak alive!` : 'Start a streak today'
}
