import type { Course, LangId } from '../types'
import { script } from './mr/script'
import { unit1 } from './mr/unit1'

const marathi: Course = {
  lang: 'mr',
  name: 'Marathi',
  nativeName: 'मराठी',
  locale: 'mr-IN',
  script,
  units: [unit1],
}

/** Hindi joins in phase 2 with the same structure. */
export const COURSES: Partial<Record<LangId, Course>> = { mr: marathi }

export const DEFAULT_LANG: LangId = 'mr'

/** The course for a language; throws for one that is not written yet (a programming error). */
export function getCourse(lang: LangId): Course {
  const course = COURSES[lang]
  if (!course) throw new Error(`No course for "${lang}".`)
  return course
}
