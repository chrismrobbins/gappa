import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** Null in local mode (no env vars): the app then keeps progress on this device only. */
export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null
export const cloudEnabled: boolean = supabase !== null

/** For callers that only run when cloud is on. */
export function requireSupabase(): SupabaseClient {
  if (!supabase) throw new Error('Cloud sync is not set up.')
  return supabase
}
