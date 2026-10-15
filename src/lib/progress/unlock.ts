import type { Course, Progress } from '../../types'

export function isLessonDone(p: Progress, id: string): boolean {
  return id in p.lessons
}

/** Two independent tracks, each unlocked in order: the script, then unit lessons across units. */
function tracks(course: Course): string[][] {
  return [course.script.map((s) => s.id), course.units.flatMap((u) => u.lessons.map((l) => l.id))]
}

export const checkpointId = (unitId: string): string => `${unitId}-cp`

export function isUnlocked(p: Progress, course: Course, lessonId: string): boolean {
  const unit = course.units.find((u) => checkpointId(u.id) === lessonId)
  if (unit) return unit.lessons.every((l) => isLessonDone(p, l.id))
  const seq = tracks(course).find((t) => t.includes(lessonId))
  if (!seq) return false
  const i = seq.indexOf(lessonId)
  return i === 0 || isLessonDone(p, seq[i - 1])
}
