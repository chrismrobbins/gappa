import type { ExerciseResult } from '../../types'
import { useProgress } from '../state/ProgressProvider'
import { CardView } from './CardView'
import { FeedbackPanel } from './FeedbackPanel'
import { progressFraction } from './queue'
import { RunnerTop } from './RunnerTop'
import type { Session } from './session'
import { useRunner } from './useRunner'

interface RunnerProps {
  session: Session
  onFinish(results: ExerciseResult[]): void
  onExit(): void
}

const isExercise = (kind: string): boolean => ['choice', 'tiles'].includes(kind)

function Footer(props: { r: ReturnType<typeof useRunner> }) {
  const { r } = props
  if (r.committed && r.attempt) return <FeedbackPanel attempt={r.attempt} onContinue={r.next} />
  if (r.card && isExercise(r.card.kind)) {
    return (
      <div className="footer">
        <button type="button" className="btn btn-primary" disabled={!r.attempt} onClick={r.check}>Check</button>
      </div>
    )
  }
  if (r.card && ['match', 'speak'].includes(r.card.kind)) return null
  return (
    <div className="footer">
      <button type="button" className="btn btn-primary" onClick={r.next}>Continue</button>
    </div>
  )
}

export function Runner({ session, onFinish, onExit }: RunnerProps) {
  const { progress } = useProgress()
  const r = useRunner(session, progress.settings, onFinish)
  if (!r.card) return null
  return (
    <div className="runner">
      <RunnerTop fraction={progressFraction(r.state)} onExit={onExit} />
      <div className="runner-body">
        <CardView key={r.state.index} card={r.card} locked={r.committed}
          speechMode={r.speechMode === 'server' ? 'server' : 'browser'}
          onAttempt={r.onAttempt} onSkipSpeaking={r.skipSpeaking} />
      </div>
      <Footer r={r} />
    </div>
  )
}
