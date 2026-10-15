import { asProgress } from '../lib/progress'
import type { Progress } from '../types'
import { requireSupabase } from './supabase'

async function currentUserId(): Promise<string | null> {
  const { data } = await requireSupabase().auth.getSession()
  return data.session?.user.id ?? null
}

/** The signed-in user's saved progress, or null if signed out or nothing saved yet. */
export async function pullProgress(): Promise<Progress | null> {
  const userId = await currentUserId()
  if (!userId) return null
  const { data, error } = await requireSupabase()
    .from('progress')
    .select('data')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw new Error('We could not load your saved progress.')
  return asProgress(data?.data)
}

export async function pushProgress(p: Progress): Promise<void> {
  const userId = await currentUserId()
  if (!userId) return
  const { error } = await requireSupabase()
    .from('progress')
    .upsert({ user_id: userId, data: p, updated_at: new Date().toISOString() })
  if (error) throw new Error('We could not save your progress. It is still stored on this device.')
}
