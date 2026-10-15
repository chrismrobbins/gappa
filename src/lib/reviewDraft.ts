// The fix form's draft -> what gets saved. Pure so the rules are testable.

import type { ReviewInput } from '../types'
import type { ReviewItem } from './reviewItems'

export interface FixDraft { correction: string; comment: string; voice: string }

export const VOICE_ALL = 'all'

const blankToNull = (s: string): string | null => s.trim() || null

export function initialDraft(item: Pick<ReviewItem, 'target'>, saved?: Pick<ReviewInput, 'correction' | 'comment' | 'voice'>): FixDraft {
  return { correction: saved?.correction ?? item.target, comment: saved?.comment ?? '', voice: saved?.voice ?? '' }
}

/** A fix needs something to act on: a changed text, a comment, or a voice that sounded wrong. */
export function fixError(item: Pick<ReviewItem, 'target'>, d: FixDraft): string | null {
  const changed = d.correction.trim() !== '' && d.correction.trim() !== item.target
  if (changed || d.comment.trim() || d.voice) return null
  return 'Change the text, add a comment, or pick the voice that sounded wrong.'
}

function base(item: ReviewItem): Pick<ReviewInput, 'itemKey' | 'lessonId' | 'target'> {
  return { itemKey: item.key, lessonId: item.lessonId, target: item.target }
}

export function okInput(item: ReviewItem): ReviewInput {
  return { ...base(item), verdict: 'ok', correction: null, comment: null, voice: null }
}

export function fixInput(item: ReviewItem, d: FixDraft): ReviewInput {
  const correction = blankToNull(d.correction)
  return {
    ...base(item), verdict: 'fix', correction: correction === item.target ? null : correction,
    comment: blankToNull(d.comment), voice: d.voice || null,
  }
}
