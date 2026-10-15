import { useState } from 'react'
import { gradeSpeech } from '../../../engine'
import type { SpeakCard as Data } from '../../../types'
import { MicIcon } from '../../common/Icons'
import { useProgress } from '../../state/ProgressProvider'
import type { Attempt } from '../attempt'
import { useSpeech } from '../useSpeech'
import { CardFrame, Prompt } from './CardFrame'

interface Props {
  card: Data
  locked: boolean
  mode: 'browser' | 'server'
  onAttempt(a: Attempt | null): void
  onSkipSpeaking(): void
}

const LABELS = { idle: 'Tap to speak', listening: 'Listening… tap when done', processing: 'Checking…' } as const

function toAttempt(card: Data, transcript: string): Attempt {
  const correct = gradeSpeech(card.item.target, transcript)
  const reveal = { text: card.item.target, rom: card.item.rom }
  return { results: [{ key: card.key, correct }], correct, auto: true, reveal }
}

export function SpeakCard({ card, locked, mode, onAttempt, onSkipSpeaking }: Props) {
  const { course } = useProgress()
  const [heard, setHeard] = useState<string | null>(null)
  const speech = useSpeech(course.lang, mode, (text) => {
    setHeard(text)
    onAttempt(toAttempt(card, text))
  })
  const label = LABELS[speech.phase]
  return (
    <CardFrame title="Say this out loud">
      <Prompt prompt={{ text: card.item.target, rom: card.item.rom }} say={card.item.target} big />
      <p className="muted center">{card.item.en}</p>
      <button type="button" className={`mic${speech.phase === 'listening' ? ' is-live' : ''}`} disabled={locked}
        aria-label={label} onClick={speech.toggle}><MicIcon size={40} /></button>
      <p className="center" aria-live="polite">{label}</p>
      {heard !== null && <p className="center">We heard: <span className="native-inline" lang={course.lang}>{heard}</span></p>}
      {speech.error && <p className="form-error center" role="alert">{speech.error}</p>}
      {!locked && <button type="button" className="btn btn-ghost" onClick={onSkipSpeaking}>Can't speak now</button>}
    </CardFrame>
  )
}
