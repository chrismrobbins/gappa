// Picking wrong answers: same lesson first, then earlier lessons, then anywhere in the course.

import type { Course, Item, Lesson, Letter, Shown } from '../types'
import { displayTokens, normalize } from '../lib/text'
import { shuffle, type Rng } from '../lib/random'
import { earlierLessons, earlierScripts, lessonsOf } from './keys'

/** Items with any of these ids are never offered together (same text or same meaning). */
function itemIds(item: Item): string[] {
  return [item.target, item.en, ...(item.alsoEn ?? [])].map(normalize)
}

function letterIds(letter: Letter): string[] {
  return [letter.char, letter.rom]
}

/** 2 or 3 wrong answers, giving 3–4 options in total. */
function wrongCount(rng: Rng): number {
  return 2 + Math.floor(rng() * 2)
}

/** Up to `count` candidates, pool by pool, never sharing an id with the answer or each other. */
function pickDistractors<T>(
  exclude: string[],
  pools: readonly (readonly T[])[],
  count: number,
  rng: Rng,
  idsOf: (t: T) => string[],
): T[] {
  const used = new Set(exclude)
  const out: T[] = []
  for (const candidate of pools.flatMap((pool) => shuffle(pool, rng))) {
    if (out.length >= count) break
    const ids = idsOf(candidate)
    if (ids.some((id) => used.has(id))) continue
    ids.forEach((id) => used.add(id))
    out.push(candidate)
  }
  return out
}

export function wrongItems(answer: Item, pools: readonly (readonly Item[])[], rng: Rng): Item[] {
  return pickDistractors(itemIds(answer), pools, wrongCount(rng), rng, itemIds)
}

export function wrongLetters(answer: Letter, pools: readonly (readonly Letter[])[], rng: Rng): Letter[] {
  return pickDistractors(letterIds(answer), pools, wrongCount(rng), rng, letterIds)
}

/** Item pools: the lesson, then earlier lessons (nearest first), then the whole course. */
export function itemPools(course: Course, lesson: Lesson, pick: (l: Lesson) => Item[]): Item[][] {
  return [pick(lesson), earlierLessons(course, lesson.id).flatMap(pick), lessonsOf(course).flatMap(pick)]
}

export function letterPools(course: Course, scriptId: string, own: Letter[]): Letter[][] {
  const earlier = earlierScripts(course, scriptId).flatMap((s) => s.letters)
  return [own, earlier, course.script.flatMap((s) => s.letters)]
}

/** A phrase's display tokens (punctuation stripped), each paired with its romanization token. */
export function pairTokens(item: Item): Shown[] {
  const rom = displayTokens(item.rom)
  return displayTokens(item.target)
    .map((word, i) => ({ text: normalize(word), rom: normalize(rom[i] ?? '') }))
    .filter((t) => t.text !== '')
}

/** Extra tiles drawn from other words, never a word the phrase already needs. */
export function wrongTiles(item: Item, source: readonly Item[], rng: Rng): Shown[] {
  const own = pairTokens(item).map((t) => t.text)
  const pool = source.flatMap(pairTokens)
  return pickDistractors(own, [pool], wrongCount(rng), rng, (t) => [t.text])
}
