import { useEffect, useState } from 'react'
import { fetchMyRole } from '../../services/reviews'
import type { Role } from '../../types'

/** The signed-in user's role, loaded once. Everyone is a learner until the server says otherwise. */
export function useRole(): Role {
  const [role, setRole] = useState<Role>('learner')
  useEffect(() => {
    let alive = true
    fetchMyRole().then((r) => alive && setRole(r)).catch(() => undefined)
    return () => { alive = false }
  }, [])
  return role
}
