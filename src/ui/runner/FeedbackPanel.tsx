import { CheckCircleIcon, XCircleIcon } from '../common/Icons'
import { Native } from '../common/Native'
import type { Attempt } from './attempt'

function Verdict({ attempt }: { attempt: Attempt }) {
  const { correct, reveal, note } = attempt
  return (
    <div className="feedback-head">
      {correct ? <CheckCircleIcon size={52} /> : <XCircleIcon size={52} />}
      <div className="feedback-text">
        <strong>{correct ? 'Nice!' : note ?? 'Not quite'}</strong>
        {!correct && reveal && (
          <>
            <span className="muted">Correct answer</span>
            <Native text={reveal.text} rom={reveal.rom} tappable={false} />
          </>
        )}
      </div>
    </div>
  )
}

/** Bottom sheet after an answer: peacock when right, kumkum with the correct answer when wrong. */
export function FeedbackPanel({ attempt, onContinue }: { attempt: Attempt; onContinue(): void }) {
  return (
    <div className={`feedback ${attempt.correct ? 'feedback-right' : 'feedback-wrong'}`} role="status" aria-live="polite">
      <div className="container feedback-row">
        <Verdict attempt={attempt} />
        <button type="button" className={`btn ${attempt.correct ? 'btn-right' : 'btn-wrong'}`} onClick={onContinue} autoFocus>
          Continue
        </button>
      </div>
    </div>
  )
}
