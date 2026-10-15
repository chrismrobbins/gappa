import type { ExerciseResult } from '../../types'
import { useProgress } from '../state/ProgressProvider'
import { CardView } from './CardView'
import { FeedbackPanel } from './FeedbackPanel'
import { progressFraction } from './queue'
import { useFlagItem } from '../teacher/useFlagItem'
import { RunnerTop } from './RunnerTop'
import type { Session } from './session'
import { useRunner } from './useRunner'

interface RunnerProps {
  session: Session
  onFinish(results: ExerciseResult[]): void
  onExit(): void
}

const isExercise = (kind: string): boolean => ['choice', 'tiles'].includes(kind)

function FooterButton(props: { label: string; disabled?: boolean; onClick(): void }) {
  return (
    <div className="footer">
      <div className="container">
        <button type="button" className="btn btn-primary" disabled={props.disabled} onClick={props.onClick}>{props.label}</button>
      </div>
    </div>
  )
}

function Footer(props: { r: ReturnType<typeof useRunner> }) {
  const { r } = props
  if (r.committed && r.attempt) return <FeedbackPanel attempt={r.attempt} onContinue={r.next} />
  if (r.card && isExercise(r.card.kind)) return <FooterButton label="Check" disabled={!r.attempt} onClick={r.check} />
  if (r.card && ['match', 'speak'].includes(r.card.kind)) return null
  return <FooterButton label="Continue" onClick={r.next} />
}

export function Runner({ session, onFinish, onExit }: RunnerProps) {
  const { progress } = useProgress()
  const r = useRunner(session, progress.settings, onFinish)
  const flag = useFlagItem(r.card, session.id)
  if (!r.card) return null
  return (
    <div className="runner">
      <RunnerTop fraction={progressFraction(r.state)} onExit={onExit} flag={flag} />
      <div className="container runner-body">
        <CardView key={r.state.index} card={r.card} locked={r.committed}
          speechMode={r.speechMode === 'server' ? 'server' : 'browser'}
          onAttempt={r.onAttempt} onSkipSpeaking={r.skipSpeaking} />
      </div>
      <Footer r={r} />
    </div>
  )
}
