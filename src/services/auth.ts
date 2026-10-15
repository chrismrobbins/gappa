import type { Session } from '@supabase/supabase-js'
import { normalizeUsername, usernameToEmail } from '../lib/username'
import { requireSupabase } from './supabase'

export { usernameToEmail }

export async function signIn(username: string, password: string): Promise<void> {
  const { error } = await requireSupabase().auth.signInWithPassword({
    email: usernameToEmail(username),
    password,
  })
  if (!error) return
  const wrongDetails = error.status === 400
  throw new Error(wrongDetails
    ? 'That username and password do not match. Please try again.'
    : 'We could not reach the server. Check your connection and try again.')
}

async function readError(res: Response): Promise<string> {
  const body = (await res.json().catch(() => ({}))) as { error?: string }
  return body.error ?? 'We could not create your account. Please try again.'
}

export async function signUp(username: string, password: string, invite: string): Promise<void> {
  const res = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: normalizeUsername(username), password, invite: invite.trim() }),
  })
  if (!res.ok) throw new Error(await readError(res))
  await signIn(username, password)
}

export async function signOut(): Promise<void> {
  await requireSupabase().auth.signOut()
}

function usernameOf(session: Session | null): string | null {
  const name = session?.user.user_metadata?.username
  return typeof name === 'string' ? name : null
}

export async function currentUsername(): Promise<string | null> {
  const { data } = await requireSupabase().auth.getSession()
  return usernameOf(data.session)
}

export function onAuthChange(cb: (username: string | null) => void): () => void {
  const { data } = requireSupabase().auth.onAuthStateChange((_event, session) => cb(usernameOf(session)))
  return () => data.subscription.unsubscribe()
}
