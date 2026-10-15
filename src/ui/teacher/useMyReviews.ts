import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchMyReviews, saveReview } from '../../services/reviews'
import type { Review, ReviewInput } from '../../types'

/** What the list shows while the save is in flight. */
function pending(input: ReviewInput, prev?: Review): Review {
  return { ...input, id: prev?.id ?? 'pending', status: 'open', createdAt: prev?.createdAt ?? '', reviewerId: prev?.reviewerId ?? '' }
}

/** The teacher's own reviews by line key, with optimistic saves that roll back on failure. */
export function useMyReviews() {
  const [byKey, setByKey] = useState<ReadonlyMap<string, Review>>(new Map())
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')
  const latest = useRef(byKey)
  latest.current = byKey

  useEffect(() => {
    let alive = true
    fetchMyReviews().then((list) => {
      if (!alive) return
      setByKey(new Map(list.map((r) => [r.itemKey, r])))
      setLoaded(true)
    }).catch(() => alive && setLoaded(true))
    return () => { alive = false }
  }, [])

  const put = (key: string, review: Review | undefined) =>
    setByKey((m) => { const next = new Map(m); if (review) next.set(key, review); else next.delete(key); return next })

  const save = useCallback(async (input: ReviewInput): Promise<boolean> => {
    const prev = latest.current.get(input.itemKey)
    setError('')
    put(input.itemKey, pending(input, prev))
    try {
      put(input.itemKey, await saveReview(input))
      return true
    } catch (e) {
      put(input.itemKey, prev)
      setError(e instanceof Error ? e.message : 'We could not save that. Please try again.')
      return false
    }
  }, [])

  return { byKey, reviews: [...byKey.values()], loaded, error, save }
}
