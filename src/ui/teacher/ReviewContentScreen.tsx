import { useMemo, useState } from 'react'
import { progressLabel, reviewItems, reviewProgress, reviewSections } from '../../lib/reviewItems'
import { ChipGroup } from '../common/ChipGroup'
import { useProgress } from '../state/ProgressProvider'
import { BackBar } from './BackBar'
import { ReviewRow } from './ReviewRow'
import { useMyReviews } from './useMyReviews'

export function ReviewContentScreen({ onBack }: { onBack(): void }) {
  const { course } = useProgress()
  const sections = useMemo(() => reviewSections(course), [course])
  const items = useMemo(() => reviewItems(course), [course])
  const { byKey, reviews, error, save } = useMyReviews()
  const [sectionId, setSectionId] = useState(sections[0]?.id ?? '')
  const section = sections.find((s) => s.id === sectionId)
  return (
    <div className="screen">
      <BackBar title="Review content" onBack={onBack} />
      <p className="muted" role="status" aria-live="polite">{progressLabel(reviewProgress(items, reviews))}</p>
      {error && <p className="form-error" role="alert">{error}</p>}
      <ChipGroup<string> label="Section" value={sectionId} onChange={setSectionId}
        options={sections.map((s) => ({ value: s.id, label: s.title }))} />
      {section?.lessons.map((lesson) => (
        <section key={lesson.id} className="stack" aria-label={lesson.title}>
          <h2 className="section-title">{lesson.title}</h2>
          <ul className="review-list">
            {lesson.items.map((item) => <ReviewRow key={item.key} item={item} review={byKey.get(item.key)} onSave={save} />)}
          </ul>
        </section>
      ))}
    </div>
  )
}
