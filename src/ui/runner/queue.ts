// Pure lesson-queue logic: which card is next, what gets repeated, which results are recorded.
import type { Card, ExerciseResult } from '../../types'

export interface QueueState {
  queue: Card[]
  index: number
  results: ExerciseResult[]
  /** Cards already given a second chance (each is repeated at most once). */
  retried: Card[]
  skipSpeak: boolean
}

export type QueueAction =
  | { type: 'answer'; results: ExerciseResult[] }
  | { type: 'next' }
  | { type: 'skipSpeaking' }

const isSkipped = (card: Card | undefined, skipSpeak: boolean): boolean => skipSpeak && card?.kind === 'speak'

/** Moves past any speaking cards when speaking is switched off. */
function settle(state: QueueState): QueueState {
  let index = state.index
  while (index < state.queue.length && isSkipped(state.queue[index], state.skipSpeak)) index++
  return index === state.index ? state : { ...state, index }
}

export function initQueue(cards: Card[], skipSpeak: boolean): QueueState {
  return settle({ queue: cards, index: 0, results: [], retried: [], skipSpeak })
}

export const currentCard = (s: QueueState): Card | undefined => s.queue[s.index]
export const isDone = (s: QueueState): boolean => s.index >= s.queue.length

/** Share of the queue finished, for the progress bar. */
export function progressFraction(s: QueueState): number {
  return s.queue.length === 0 ? 1 : Math.min(1, s.index / s.queue.length)
}

function answer(state: QueueState, results: ExerciseResult[]): QueueState {
  const card = currentCard(state)
  const missed = results.some((r) => !r.correct)
  const next = { ...state, results: [...state.results, ...results] }
  if (!card || !missed || card.kind === 'match' || state.retried.includes(card)) return next
  return { ...next, queue: [...state.queue, card], retried: [...state.retried, card] }
}

export function queueReducer(state: QueueState, action: QueueAction): QueueState {
  switch (action.type) {
    case 'answer':
      return answer(state, action.results)
    case 'next':
      return settle({ ...state, index: state.index + 1 })
    case 'skipSpeaking':
      return settle({ ...state, skipSpeak: true })
  }
}
