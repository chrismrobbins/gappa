import type { Course, Progress } from '../../types'

export function isLessonDone(p: Progress, id: string): boolean {
  return id in p.lessons
}

/** Two independent tracks, each unlocked in order: the script, then intro lessons followed by unit lessons. */
function tracks(course: Course): string[][] {
  const intro = course.intro.map((l) => l.id)
  return [course.script.map((s) => s.id), [...intro, ...course.units.flatMap((u) => u.lessons.map((l) => l.id))]]
}

export const checkpointId = (unitId: string): string => `${unitId}-cp`

export function isUnlocked(p: Progress, course: Course, lessonId: string): boolean {
  const unit = course.units.find((u) => checkpointId(u.id) === lessonId)
  if (unit) return unit.lessons.every((l) => isLessonDone(p, l.id))
  const seq = tracks(course).find((t) => t.includes(lessonId))
  if (!seq) return false
  const i = seq.indexOf(lessonId)
  return isLessonDone(p, lessonId) || i === 0 || isLessonDone(p, seq[i - 1])
}
