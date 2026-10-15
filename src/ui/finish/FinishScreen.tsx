import type { ReactNode } from 'react'
import { BADGES, CHECKPOINT_PASS } from '../../config'
import { streakInfo } from '../../lib/progress'
import type { SessionKind, SessionOutcome } from '../../types'
import { CheckCircleIcon, FlameIcon, StarIcon } from '../common/Icons'
import { BadgeItem } from '../me/BadgeGrid'
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

function Stat(props: { tone: string; icon: ReactNode; value: string; label: string }) {
  return (
    <div className={`fstat fstat-${props.tone}`}>
      {props.icon}
      <strong>{props.value}</strong>
      <span>{props.label}</span>
    </div>
  )
}

function Stats({ outcome }: { outcome: SessionOutcome }) {
  const xp = useCountUp(outcome.xpEarned)
  const accuracy = useCountUp(Math.round(outcome.accuracy * 100))
  const streak = useCountUp(streakInfo(outcome.progress, todayKey()).current)
  return (
    <div className="finish-stats">
      <Stat tone="xp" icon={<StarIcon size={28} />} value={`+${xp}`} label="XP earned" />
      <Stat tone="acc" icon={<CheckCircleIcon size={28} />} value={`${accuracy}%`} label="Accuracy" />
      <Stat tone="streak" icon={<FlameIcon size={28} />} value={String(streak)} label="Day streak" />
    </div>
  )
}

function NewBadges({ ids }: { ids: string[] }) {
  const earned = BADGES.filter((b) => ids.includes(b.id))
  if (earned.length === 0) return null
  return (
    <section className="stack">
      <h2>New badges</h2>
      <ul className="badge-grid">{earned.map((b) => <BadgeItem key={b.id} badge={b} earned />)}</ul>
    </section>
  )
}

export function FinishScreen({ info, onDone }: { info: FinishInfo; onDone(): void }) {
  const { outcome } = info
  return (
    <main className="finish">
      {outcome.passed && <Confetti />}
      <div className="container finish-body">
        <h1>{headline(info)}</h1>
        <CheckpointNote info={info} />
        <Stats outcome={outcome} />
        <NewBadges ids={outcome.newBadges} />
        <button type="button" className="btn btn-primary" onClick={onDone}>Continue</button>
      </div>
    </main>
  )
}
