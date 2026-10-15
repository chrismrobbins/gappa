import { useMemo } from 'react'
import { cardReviewKeys } from '../../lib/cardKey'
import { reviewItems, type ReviewItem } from '../../lib/reviewItems'
import type { Card } from '../../types'
import { useProgress } from '../state/ProgressProvider'

/** The reviewable line behind the current card, for teachers only (undefined for learners or unmapped cards). */
export function useFlagItem(card: Card | undefined, sessionId: string): ReviewItem | undefined {
  const { role, course } = useProgress()
  const byKey = useMemo(
    () => (role === 'learner' ? null : new Map(reviewItems(course).map((i) => [i.key, i]))),
    [role, course],
  )
  if (!byKey || !card) return undefined
  return cardReviewKeys(card, sessionId).flatMap((k) => byKey.get(k) ?? [])[0]
}
