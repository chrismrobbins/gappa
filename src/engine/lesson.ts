// Unit lessons: teach first, then test.

import type { Card, Course, ExerciseCard, Item } from '../types'
import { MATCH_SIZE } from '../config'
import { sample, shuffle, type Rng } from '../lib/random'
import type { LessonContext } from './context'
import { lessonContext } from './context'
import { itemMatch, listenChoice, meaningChoice, speakFor, tilesFor, wordChoice } from './exercises'
import { findLesson, itemKey } from './keys'

/** Groups of 2–3 (a lone leftover joins the previous group's size choice). */
export function chunk<T>(items: readonly T[]): T[][] {
  const out: T[][] = []
  for (let at = 0; at < items.length; ) {
    const left = items.length - at
    const size = left > 1 && left % 3 === 1 ? 2 : Math.min(3, left)
    out.push(items.slice(at, at + size))
    at += size
  }
  return out
}

const wordKey = (ctx: LessonContext, item: Item) => itemKey(ctx.lesson.id, 'w', item.target)
const phraseKey = (ctx: LessonContext, item: Item) => itemKey(ctx.lesson.id, 'p', item.target)

/** Cycles target->English, English->target, listening. */
export function wordExercise(ctx: LessonContext, item: Item, variant: number): ExerciseCard {
  const make = [meaningChoice, wordChoice, listenChoice][variant % 3]
  return make(ctx.words, wordKey(ctx, item), item)
}

function matchOf(ctx: LessonContext, group: Item[], earlier: Item[]): ExerciseCard {
  const items = [...group, ...sample(earlier, MATCH_SIZE - group.length, ctx.rng)]
  return itemMatch(items.map((item) => ({ key: wordKey(ctx, item), item })))
}

function wordCards(ctx: LessonContext): Card[] {
  const seen: Item[] = []
  return chunk(ctx.lesson.words).flatMap((group, g) => {
    const earlier = [...seen]
    seen.push(...group)
    const cards: Card[] = [{ kind: 'teach', title: 'New words', items: group }]
    group.forEach((item, i) => cards.push(wordExercise(ctx, item, seen.length - group.length + i)))
    if (g > 0) cards.push(matchOf(ctx, group, earlier))
    return cards
  })
}

function phraseCards(ctx: LessonContext, item: Item): Card[] {
  const key = phraseKey(ctx, item)
  return [
    { kind: 'teach', title: 'A new phrase', items: [item] },
    meaningChoice(ctx.phrases, key, item),
    tilesFor(key, item, ctx.tileSource, ctx.rng),
  ]
}

function closingCards(ctx: LessonContext): Card[] {
  const [listen, speak = listen] = shuffle(ctx.lesson.phrases, ctx.rng)
  if (!listen) return []
  return [
    tilesFor(phraseKey(ctx, listen), listen, ctx.tileSource, ctx.rng, { listen: true }),
    speakFor(phraseKey(ctx, speak), speak),
  ]
}

export function buildLesson(course: Course, lessonId: string, rng: Rng = Math.random): Card[] {
  const lesson = findLesson(course, lessonId)
  if (!lesson) return []
  const ctx = lessonContext(course, lesson, rng)
  const tip: Card[] = lesson.tip ? [{ kind: 'tip', tip: lesson.tip }] : []
  return [...tip, ...wordCards(ctx), ...lesson.phrases.flatMap((p) => phraseCards(ctx, p)), ...closingCards(ctx)]
}
