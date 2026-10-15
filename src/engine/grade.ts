import type { ChoiceCard, TilesCard } from '../types'
import { SPEECH_PASS } from '../config'
import { normalize, similarity } from '../lib/text'

export function gradeChoice(card: ChoiceCard, index: number): boolean {
  return index === card.answer
}

/** `picked` = tile texts in order. */
export function gradeTiles(card: TilesCard, picked: string[]): boolean {
  const attempt = picked.map(normalize).join(' ')
  return card.answers.some((answer) => answer.join(' ') === attempt)
}

export function gradeSpeech(target: string, transcript: string): boolean {
  return similarity(target, transcript) >= SPEECH_PASS
}
