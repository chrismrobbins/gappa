import { useId, useState, type FormEvent } from 'react'
import { VOICES } from '../../config'
import { VOICE_ALL, fixError, initialDraft, type FixDraft } from '../../lib/reviewDraft'
import type { Review } from '../../types'
import { ChipGroup } from '../common/ChipGroup'

const VOICE_OPTIONS = [
  { value: '', label: 'None' },
  ...VOICES.map((v) => ({ value: v.id, label: v.name })),
  { value: VOICE_ALL, label: 'All' },
]

interface FixFormProps {
  target: string
  saved?: Review
  onSave(draft: FixDraft): Promise<boolean>
  onCancel(): void
}

/** Correction, comment and the voice that sounded wrong, for one line. */
export function FixForm({ target, saved, onSave, onCancel }: FixFormProps) {
  const id = useId()
  const [draft, setDraft] = useState(() => initialDraft({ target }, saved?.verdict === 'fix' ? saved : undefined))
  const [message, setMessage] = useState('')
  const set = (patch: Partial<FixDraft>) => setDraft((d) => ({ ...d, ...patch }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const problem = fixError({ target }, draft)
    if (problem) return setMessage(problem)
    setMessage('Saving…')
    if (!(await onSave(draft))) setMessage('We could not save that. Please try again.')
  }

  return (
    <form className="fix-form" onSubmit={(e) => void submit(e)}>
      <label className="field" htmlFor={`${id}-fix`}>
        Correct text
        <input id={`${id}-fix`} lang="mr" value={draft.correction} onChange={(e) => set({ correction: e.target.value })} />
      </label>
      <label className="field" htmlFor={`${id}-note`}>
        Comment
        <textarea id={`${id}-note`} rows={2} maxLength={1000} value={draft.comment} onChange={(e) => set({ comment: e.target.value })} />
      </label>
      <p className="fix-label" aria-hidden="true">Which voice sounded wrong?</p>
      <ChipGroup label="Which voice sounded wrong?" value={draft.voice} options={VOICE_OPTIONS} onChange={(voice) => set({ voice })} />
      <p className="muted" role="status" aria-live="polite">{message}</p>
      <button type="submit" className="btn btn-primary">Save fix</button>
      <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
    </form>
  )
}
