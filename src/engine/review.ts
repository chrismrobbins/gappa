// Review and checkpoint: one exercise per key (items are already learned, so no teach cards).

import type { Card, Course, ExerciseCard, Item, ItemKey, Letter } from '../types'
import { CHECKPOINT_SIZE } from '../config'
import { pickOne, sample, type Rng } from '../lib/random'
import { lessonContext } from './context'
import { letterPools } from './distractors'
import { letterChoice, letterSoundChoice, meaningChoice, tilesFor } from './exercises'
import { findEntry, findLesson, findScript, itemKey, parseKey } from './keys'
import { wordExercise } from './lesson'

const LETTER_EXERCISES = [letterSoundChoice, letterChoice] as const

function letterReview(course: Course, key: ItemKey, scriptId: string, letter: Letter | undefined, rng: Rng): ExerciseCard | undefined {
  if (!letter) return undefined
  const own = findScript(course, scriptId)?.letters ?? []
  const make = pickOne(LETTER_EXERCISES, rng) ?? letterSoundChoice
  return make({ pools: letterPools(course, scriptId, own), rng }, key, letter)
}

function itemReview(course: Course, key: ItemKey, lessonId: string, item: Item, isPhrase: boolean, rng: Rng): ExerciseCard | undefined {
  const lesson = findLesson(course, lessonId)
  if (!lesson) return undefined
  const ctx = lessonContext(course, lesson, rng)
  if (!isPhrase) return wordExercise(ctx, item, Math.floor(rng() * 3))
  return rng() < 0.5 ? meaningChoice(ctx.phrases, key, item) : tilesFor(key, item, ctx.tileSource, rng)
}

function exerciseFor(course: Course, key: ItemKey, rng: Rng): ExerciseCard | undefined {
  const entry = findEntry(course, key)
  const kind = parseKey(key)?.kind
  if (!entry || !kind) return undefined
  if (kind === 'l') return letterReview(course, key, entry.lessonId, entry.letter, rng)
  return itemReview(course, key, entry.lessonId, entry.item, kind === 'p', rng)
}

/** Unknown keys are skipped. */
export function buildReview(course: Course, keys: ItemKey[], rng: Rng = Math.random): Card[] {
  return keys.flatMap((key) => exerciseFor(course, key, rng) ?? [])
}

function unitKeys(course: Course, unitId: string): ItemKey[] {
  const unit = course.units.find((u) => u.id === unitId)
  return (unit?.lessons ?? []).flatMap((l) => [
    ...l.words.map((w) => itemKey(l.id, 'w', w.target)),
    ...l.phrases.map((p) => itemKey(l.id, 'p', p.target)),
  ])
}

export function buildCheckpoint(course: Course, unitId: string, rng: Rng = Math.random): Card[] {
  return buildReview(course, sample(unitKeys(course, unitId), CHECKPOINT_SIZE, rng), rng)
}
