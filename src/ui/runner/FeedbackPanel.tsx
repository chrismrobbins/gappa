import { Native } from '../common/Native'
import type { Attempt } from './attempt'

/** Bottom panel after an answer: green when right, red with the correct answer when wrong. */
export function FeedbackPanel({ attempt, onContinue }: { attempt: Attempt; onContinue(): void }) {
  const { correct, reveal, note } = attempt
  return (
    <div className={`feedback ${correct ? 'feedback-right' : 'feedback-wrong'}`} aria-live="polite">
      <div className="feedback-text">
        <strong>{correct ? 'Nice!' : note ?? 'Correct answer:'}</strong>
        {!correct && reveal && <Native text={reveal.text} rom={reveal.rom} tappable={false} />}
      </div>
      <button type="button" className={`btn ${correct ? 'btn-right' : 'btn-wrong'}`} onClick={onContinue} autoFocus>
        Continue
      </button>
    </div>
  )
}
