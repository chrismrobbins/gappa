import { REVIEW_SIZE } from '../../config'
import { dueKeys, mistakeKeys } from '../../lib/progress'
import type { ItemKey } from '../../types'
import { useProgress } from '../state/ProgressProvider'

interface ReviewProps { onStart(keys: ItemKey[]): void }

function Option(props: { title: string; count: number; label: string; onStart(): void }) {
  return (
    <div className="card review-option">
      <h2>{props.title}</h2>
      <p className="muted">{props.count} waiting</p>
      <button type="button" className="btn btn-primary" disabled={props.count === 0} onClick={props.onStart}>
        {props.label}
      </button>
    </div>
  )
}

export function ReviewScreen({ onStart }: ReviewProps) {
  const { progress } = useProgress()
  const due = dueKeys(progress, Date.now(), REVIEW_SIZE)
  const mistakes = mistakeKeys(progress, REVIEW_SIZE)
  const empty = Object.keys(progress.cards).length === 0
  return (
    <div className="screen">
      <h1>Review</h1>
      {empty && <p className="card muted">Nothing to review yet. Finish a lesson and your words will show up here.</p>}
      {!empty && due.length === 0 && mistakes.length === 0 && (
        <p className="card muted">All caught up! Come back tomorrow, or learn something new.</p>
      )}
      <Option title="Due words" count={due.length} label="Practice due words" onStart={() => onStart(due)} />
      <Option title="Mistakes" count={mistakes.length} label="Fix my mistakes" onStart={() => onStart(mistakes)} />
    </div>
  )
}
