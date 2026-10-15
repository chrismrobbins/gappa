import { describe, expect, it } from 'vitest'
import { currentCard, initQueue, isDone, progressFraction, queueReducer } from '../src/ui/runner/queue'
import { parseRich } from '../src/ui/common/parseRich'
import type { Card, ChoiceCard, SpeakCard, TeachCard } from '../src/types'

const teach: TeachCard = { kind: 'teach', title: 't', items: [] }
const choice = (key: string): ChoiceCard => ({
  kind: 'choice', key, instruction: '', prompt: { text: 'a' }, options: [{ text: 'x' }], answer: 0,
})
const speak: SpeakCard = { kind: 'speak', key: 's', item: { target: 'अ', rom: 'a', en: 'a' } }

describe('queue reducer', () => {
  it('requeues a wrong exercise once at the end', () => {
    const c = choice('k')
    let s = initQueue([teach, c], false)
    s = queueReducer(s, { type: 'next' })
    s = queueReducer(s, { type: 'answer', results: [{ key: 'k', correct: false }] })
    expect(s.queue).toHaveLength(3)
    s = queueReducer(queueReducer(s, { type: 'next' }), { type: 'answer', results: [{ key: 'k', correct: false }] })
    expect(s.queue).toHaveLength(3)
    expect(s.results).toHaveLength(2)
  })

  it('does not requeue correct answers and finishes', () => {
    let s = initQueue([choice('k')], false)
    s = queueReducer(s, { type: 'answer', results: [{ key: 'k', correct: true }] })
    expect(isDone(queueReducer(s, { type: 'next' }))).toBe(true)
    expect(progressFraction(s)).toBe(0)
  })

  it('skips speak cards up front and after skipSpeaking, recording nothing', () => {
    const cards: Card[] = [speak, choice('k'), speak]
    let s = initQueue(cards, true)
    expect(currentCard(s)?.kind).toBe('choice')
    s = initQueue(cards, false)
    expect(currentCard(s)?.kind).toBe('speak')
    s = queueReducer(s, { type: 'skipSpeaking' })
    expect(currentCard(s)?.kind).toBe('choice')
    s = queueReducer(s, { type: 'next' })
    expect(isDone(s)).toBe(true)
    expect(s.results).toHaveLength(0)
  })
})

describe('parseRich', () => {
  it('marks bold parts and never produces HTML', () => {
    expect(parseRich('Say **नमस्कार** now <b>')).toEqual([
      { text: 'Say ', bold: false }, { text: 'नमस्कार', bold: true }, { text: ' now <b>', bold: false },
    ])
  })
})
