import type { ReactNode } from 'react'
import { REVIEW_SIZE } from '../../config'
import { dueKeys, mistakeKeys } from '../../lib/progress'
import type { ItemKey } from '../../types'
import { CycleIcon, FlowerIcon, XCircleIcon } from '../common/Icons'
import { useProgress } from '../state/ProgressProvider'

interface ReviewProps { onStart(keys: ItemKey[]): void }

interface FeatureProps { tone: 'due' | 'mistakes'; icon: ReactNode; title: string; count: number; label: string; onStart(): void }

function FeatureCard(props: FeatureProps) {
  return (
    <section className={`card feature feature-${props.tone}`}>
      <div className="feature-head">
        <span className="feature-icon" aria-hidden="true">{props.icon}</span>
        <div className="feature-text">
          <h2>{props.title}</h2>
          <p className="muted">{props.count === 0 ? 'Nothing waiting' : `${props.count} waiting`}</p>
        </div>
        <span className="feature-count" aria-hidden="true">{props.count}</span>
      </div>
      <button type="button" className="btn btn-primary" disabled={props.count === 0} onClick={props.onStart}>{props.label}</button>
    </section>
  )
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="card empty">
      <FlowerIcon size={72} />
      <h2>{title}</h2>
      <p className="muted">{body}</p>
    </div>
  )
}

function emptyMessage(noCards: boolean, waiting: number): { title: string; body: string } | null {
  if (noCards) return { title: 'Nothing to review yet', body: 'Finish a lesson and your words will show up here.' }
  if (waiting === 0) return { title: 'All caught up!', body: 'Come back tomorrow, or learn something new.' }
  return null
}

export function ReviewScreen({ onStart }: ReviewProps) {
  const { progress } = useProgress()
  const due = dueKeys(progress, Date.now(), REVIEW_SIZE)
  const mistakes = mistakeKeys(progress, REVIEW_SIZE)
  const empty = emptyMessage(Object.keys(progress.cards).length === 0, due.length + mistakes.length)
  return (
    <div className="screen">
      <h1>Review</h1>
      {empty && <EmptyState {...empty} />}
      <FeatureCard tone="due" icon={<CycleIcon size={32} />} title="Due words" count={due.length}
        label="Practice due words" onStart={() => onStart(due)} />
      <FeatureCard tone="mistakes" icon={<XCircleIcon size={32} />} title="Mistakes" count={mistakes.length}
        label="Fix my mistakes" onStart={() => onStart(mistakes)} />
    </div>
  )
}
