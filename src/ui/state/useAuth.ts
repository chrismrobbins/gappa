import { useEffect, useState } from 'react'
import { cloudEnabled } from '../../services/supabase'
import { currentUsername, onAuthChange } from '../../services/auth'

type AuthState =
  | { status: 'loading' }
  | { status: 'signedOut' }
  | { status: 'ready'; username: string | null }

const LOCAL: AuthState = { status: 'ready', username: null }
const fromName = (name: string | null): AuthState =>
  name ? { status: 'ready', username: name } : { status: 'signedOut' }

/** Local mode has no accounts; cloud mode follows the Supabase session. */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>(cloudEnabled ? { status: 'loading' } : LOCAL)
  useEffect(() => {
    if (!cloudEnabled) return undefined
    let alive = true
    const update = (state: AuthState) => { if (alive) setState(state) }
    currentUsername().then((n) => update(fromName(n))).catch(() => update({ status: 'signedOut' }))
    const unsubscribe = onAuthChange((n) => update(fromName(n)))
    return () => { alive = false; unsubscribe() }
  }, [])
  return state
}
