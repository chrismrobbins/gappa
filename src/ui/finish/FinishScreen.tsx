import { BADGES, CHECKPOINT_PASS } from '../../config'
import { streakInfo } from '../../lib/progress'
import type { SessionKind, SessionOutcome } from '../../types'
import { FlameIcon } from '../common/Icons'
import { todayKey } from '../state/today'
import { Confetti } from './Confetti'
import { useCountUp } from './useCountUp'

export interface FinishInfo {
  outcome: SessionOutcome
  kind: SessionKind
  /** Whether today already counted toward the streak before this session. */
  wasActiveToday: boolean
}

function headline(info: FinishInfo): string {
  if (info.kind === 'review') return 'Review complete!'
  if (info.kind !== 'checkpoint') return 'Lesson complete!'
  return info.outcome.passed ? 'Checkpoint passed!' : 'Not quite yet'
}

function CheckpointNote({ info }: { info: FinishInfo }) {
  if (info.kind !== 'checkpoint') return null
  const need = Math.round(CHECKPOINT_PASS * 100)
  return (
    <p className="muted center">
      {info.outcome.passed ? 'You know this unit well. Bonus XP earned.' : `You need ${need}% to pass. Have another go, you can do it.`}
    </p>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="finish-stat card"><strong>{value}</strong><span>{label}</span></div>
}

function Badges({ ids }: { ids: string[] }) {
  if (ids.length === 0) return null
  return (
    <div className="card">
      <h2>New badges</h2>
      <ul className="badge-list">
        {ids.map((id) => <li key={id} className="badge is-earned">{BADGES.find((b) => b.id === id)?.name ?? id}</li>)}
      </ul>
    </div>
  )
}

export function FinishScreen({ info, onDone }: { info: FinishInfo; onDone(): void }) {
  const { outcome } = info
  const xp = useCountUp(outcome.xpEarned)
  const streak = streakInfo(outcome.progress, todayKey())
  return (
    <main className="finish">
      {outcome.passed && <Confetti />}
      <h1>{headline(info)}</h1>
      <CheckpointNote info={info} />
      <div className="finish-stats">
        <Stat label="XP earned" value={`+${xp}`} />
        <Stat label="Accuracy" value={`${Math.round(outcome.accuracy * 100)}%`} />
      </div>
      <p className="finish-streak"><FlameIcon size={24} />
        {info.wasActiveToday ? `${streak.current} day streak` : `Day ${streak.current}!`}
      </p>
      <Badges ids={outcome.newBadges} />
      <button type="button" className="btn btn-primary" onClick={onDone}>Continue</button>
    </main>
  )
}
