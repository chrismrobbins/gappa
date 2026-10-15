import { useEffect, useState } from 'react'
import { fetchAllOpenFixes, resolveReview } from '../../services/reviews'
import type { OpenFix } from '../../types'

export function useOpenFixes() {
  const [fixes, setFixes] = useState<OpenFix[]>([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    let alive = true
    fetchAllOpenFixes().then((list) => { if (alive) { setFixes(list); setLoaded(true) } }).catch(() => alive && setLoaded(true))
    return () => { alive = false }
  }, [])

  const resolve = async (id: string) => {
    setError('')
    try {
      await resolveReview(id)
      setFixes((list) => list.filter((f) => f.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'We could not save that. Please try again.')
    }
  }
  return { fixes, loaded, error, resolve }
}
