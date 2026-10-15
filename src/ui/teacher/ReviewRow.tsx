import { useState } from 'react'
import { fixInput, okInput, type FixDraft } from '../../lib/reviewDraft'
import type { ReviewItem } from '../../lib/reviewItems'
import type { Review, ReviewInput } from '../../types'
import { CheckIcon, PencilIcon } from '../common/Icons'
import { FixForm } from './FixForm'
import { VoiceButtons } from './VoiceButtons'

interface RowProps {
  item: ReviewItem
  review?: Review
  onSave(input: ReviewInput): Promise<boolean>
}

function SavedState({ review }: { review?: Review }) {
  const text = review?.verdict === 'ok' ? 'Marked right' : review?.verdict === 'fix' ? 'Fix noted' : ''
  return (
    <span className={`saved-state is-${review?.verdict ?? 'none'}`} role="status" aria-live="polite">
      {review?.verdict === 'ok' && <CheckIcon size={18} />}
      {review?.verdict === 'fix' && <PencilIcon size={18} />}
      {text}
    </span>
  )
}

/** One reviewable line: the text, its voices, and the two verdict actions. */
export function ReviewRow({ item, review, onSave }: RowProps) {
  const [editing, setEditing] = useState(false)
  const saveFix = async (d: FixDraft) => {
    const ok = await onSave(fixInput(item, d))
    if (ok) setEditing(false)
    return ok
  }
  return (
    <li className="card review-row">
      <span className="native" lang="mr">{item.target}</span>
      <span className="rom">{item.rom}</span>
      {item.en && <p className="review-en">{item.en}</p>}
      {item.note && <span className="tag tag-note">{item.note}</span>}
      <div className="review-actions">
        <VoiceButtons text={item.target} />
        <button type="button" className="chip chip-ok" aria-pressed={review?.verdict === 'ok'}
          onClick={() => void onSave(okInput(item))}>✓ Looks right</button>
        <button type="button" className="chip chip-fix" aria-pressed={editing || review?.verdict === 'fix'}
          onClick={() => setEditing(true)}>✎ Needs a fix</button>
        <SavedState review={review} />
      </div>
      {editing && <FixForm target={item.target} saved={review} onSave={saveFix} onCancel={() => setEditing(false)} />}
    </li>
  )
}
