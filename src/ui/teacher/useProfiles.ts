import { useCallback, useEffect, useState } from 'react'
import { listProfiles, setRole } from '../../services/reviews'
import type { ProfileRow, Role } from '../../types'

export function useProfiles() {
  const [profiles, setProfiles] = useState<ProfileRow[]>([])
  const [error, setError] = useState('')
  const load = useCallback(() => listProfiles().then(setProfiles), [])
  useEffect(() => { void load() }, [load])

  const change = async (username: string, role: Role) => {
    setError('')
    try {
      await setRole(username, role)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'We could not save that. Please try again.')
    }
  }
  return { profiles, error, change }
}
