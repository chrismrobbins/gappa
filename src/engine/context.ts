// Everything the exercise factories need for one lesson.

import type { Course, Item, Lesson } from '../types'
import type { Rng } from '../lib/random'
import { itemPools } from './distractors'
import type { ItemEnv } from './exercises'
import { earlierLessons } from './keys'

export interface LessonContext {
  lesson: Lesson
  words: ItemEnv
  phrases: ItemEnv
  /** Items whose words may appear as extra tiles. */
  tileSource: Item[]
  rng: Rng
}

export function lessonContext(course: Course, lesson: Lesson, rng: Rng): LessonContext {
  const env = (pick: (l: Lesson) => Item[]): ItemEnv => ({
    name: course.name,
    pools: itemPools(course, lesson, pick),
    rng,
  })
  const own = [...lesson.words, ...lesson.phrases]
  const earlier = earlierLessons(course, lesson.id).flatMap((l) => [...l.words, ...l.phrases])
  return {
    lesson,
    words: env((l) => l.words),
    phrases: env((l) => l.phrases),
    tileSource: [...own, ...earlier],
    rng,
  }
}
