import type { Course, Progress } from '../../types'
import { BADGES } from '../../config'
import { streakInfo } from './streak'
import { isLessonDone } from './unlock'
import { totalXp } from './xp'

interface Ctx {
  p: Progress
  course: Course
  today: string
}

const hasXp = (n: number) => (c: Ctx) => totalXp(c.p) >= n
const hasStreak = (n: number) => (c: Ctx) => streakInfo(c.p, c.today).longest >= n

const RULES: Record<string, (c: Ctx) => boolean> = {
  'first-lesson': (c) => Object.keys(c.p.lessons).length > 0,
  perfect: (c) => Object.values(c.p.lessons).some((l) => l.bestAccuracy >= 1),
  'streak-3': hasStreak(3),
  'streak-7': hasStreak(7),
  'streak-30': hasStreak(30),
  'xp-100': hasXp(100),
  'xp-500': hasXp(500),
  'xp-1000': hasXp(1000),
  letters: (c) => c.course.script.every((s) => isLessonDone(c.p, s.id)),
  unit: (c) => c.course.units.some((u) => u.lessons.every((l) => isLessonDone(c.p, l.id))),
  checkpoint: (c) => Object.keys(c.p.lessons).some((id) => id.endsWith('-cp')),
}

/** Ids earned now but not yet stored in `p.badges`. */
export function evaluateBadges(p: Progress, course: Course, today: string): string[] {
  const ctx: Ctx = { p, course, today }
  return BADGES.map((b) => b.id).filter((id) => !(id in p.badges) && RULES[id]?.(ctx))
}
