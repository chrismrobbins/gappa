// Script (letters) lessons.

import type { Card, Course, Letter } from '../types'
import { MATCH_SIZE } from '../config'
import { sample, type Rng } from '../lib/random'
import { letterPools } from './distractors'
import { letterChoice, letterMatch, letterSoundChoice, type LetterEnv } from './exercises'
import { chunk } from './lesson'
import { findScript, itemKey } from './keys'

function letterExercises(env: LetterEnv, scriptId: string, letter: Letter): Card[] {
  const key = itemKey(scriptId, 'l', letter.char)
  return [letterSoundChoice(env, key, letter), letterChoice(env, key, letter)]
}

export function buildScriptLesson(course: Course, scriptId: string, rng: Rng = Math.random): Card[] {
  const lesson = findScript(course, scriptId)
  if (!lesson) return []
  const env: LetterEnv = { pools: letterPools(course, scriptId, lesson.letters), rng }
  const groups = chunk(lesson.letters).flatMap((letters): Card[] => [
    { kind: 'teach-letters', letters },
    ...letters.flatMap((l) => letterExercises(env, scriptId, l)),
  ])
  const picked = sample(lesson.letters, MATCH_SIZE, rng)
  const match = letterMatch(picked.map((letter) => ({ key: itemKey(scriptId, 'l', letter.char), letter })))
  return [...groups, match]
}
