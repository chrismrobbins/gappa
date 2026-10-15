import { useMemo } from 'react'
import { progressLabel, reviewItems, reviewProgress } from '../../lib/reviewItems'
import { useProgress } from '../state/ProgressProvider'
import type { TeacherScreen } from './screens'
import { useMyReviews } from './useMyReviews'

function NavCard(props: { title: string; sub: string; onClick(): void }) {
  return (
    <button type="button" className="card teacher-card" onClick={props.onClick}>
      <strong>{props.title}</strong>
      <span className="muted">{props.sub}</span>
    </button>
  )
}

function ReviewCard({ onOpen }: { onOpen(s: TeacherScreen): void }) {
  const { course } = useProgress()
  const items = useMemo(() => reviewItems(course), [course])
  const { reviews } = useMyReviews()
  return <NavCard title="Review content" sub={progressLabel(reviewProgress(items, reviews))} onClick={() => onOpen('review')} />
}

/** Teacher tools on the Me screen; renders nothing for learners. */
export function TeacherCards({ onOpen }: { onOpen(s: TeacherScreen): void }) {
  const { role } = useProgress()
  if (role === 'learner') return null
  return (
    <section className="stack">
      <h2 className="section-title">Teacher tools</h2>
      <ReviewCard onOpen={onOpen} />
      {role === 'admin' && (
        <>
          <NavCard title="Teachers" sub="Choose who can review the course" onClick={() => onOpen('teachers')} />
          <NavCard title="Open fixes" sub="See what teachers flagged" onClick={() => onOpen('fixes')} />
        </>
      )}
    </section>
  )
}
