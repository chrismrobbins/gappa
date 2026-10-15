import type { Course, LangId } from '../types'
import { intro } from './mr/intro'
import { script } from './mr/script'
import { unit1 } from './mr/unit1'
import { unit2 } from './mr/unit2'
import { unit3 } from './mr/unit3'
import { unit4 } from './mr/unit4'
import { unit5 } from './mr/unit5'

const marathi: Course = {
  lang: 'mr',
  name: 'Marathi',
  nativeName: 'मराठी',
  locale: 'mr-IN',
  intro,
  script,
  units: [unit1, unit2, unit3, unit4, unit5],
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
