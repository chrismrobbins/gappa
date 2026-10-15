import { useEffect, useReducer, useRef, useState } from 'react'
import { say } from '../../services/audio'
import { sfx } from '../../services/sfx'
import { resolveSpeechMode } from '../../services/speech'
import type { ExerciseResult, Settings } from '../../types'
import { autoplayText, type Attempt } from './attempt'
import { currentCard, initQueue, isDone, queueReducer, type QueueAction, type QueueState } from './queue'
import type { Session } from './session'

/** Plays a card's audio once each time a new queue position appears. */
function useAutoplay(state: QueueState, sound: boolean): void {
  const card = currentCard(state)
  const text = card && autoplayText(card)
  // Keyed on the index alone: a retried card can follow itself, and toggling sound must not replay.
  useEffect(() => {
    if (sound && text) say(text)
  }, [state.index])
}

/** Wraps a callback so it runs at most once (a double tap on the last Continue must not record twice). */
function useOnce<T>(fn: (value: T) => void): (value: T) => void {
  const done = useRef(false)
  return (value) => {
    if (done.current) return
    done.current = true
    fn(value)
  }
}

/** The current card's answer: picked (awaiting Check) or committed (feedback showing). */
function useAnswer(sound: boolean, record: (a: Attempt) => void) {
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [committed, setCommitted] = useState(false)
  const commit = (a: Attempt) => {
    record(a)
    setAttempt(a)
    setCommitted(true)
    if (sound) sfx(a.correct ? 'correct' : 'wrong')
  }
  const clear = () => {
    setAttempt(null)
    setCommitted(false)
  }
  return { attempt, committed, commit, clear, pick: setAttempt }
}

/** Owns the queue plus the current answer; calls onFinish exactly once when the queue empties. */
export function useRunner(session: Session, settings: Settings, onFinish: (results: ExerciseResult[]) => void) {
  const speechMode = resolveSpeechMode(settings.speech)
  const [state, dispatch] = useReducer(queueReducer, undefined, () => initQueue(session.cards, speechMode === 'off'))
  const answer = useAnswer(settings.sound, (a) => dispatch({ type: 'answer', results: a.results }))
  const finish = useOnce(onFinish)
  useAutoplay(state, settings.sound)

  const move = (action: QueueAction) => {
    const next = queueReducer(state, action)
    dispatch(action)
    answer.clear()
    if (isDone(next)) finish(next.results)
  }
  return {
    state, card: currentCard(state), attempt: answer.attempt, committed: answer.committed, speechMode,
    onAttempt: (a: Attempt | null) => (a?.auto ? answer.commit(a) : answer.pick(a)),
    check: () => answer.attempt && answer.commit(answer.attempt),
    next: () => move({ type: 'next' }),
    skipSpeaking: () => move({ type: 'skipSpeaking' }),
  }
}
