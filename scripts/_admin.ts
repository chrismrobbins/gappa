import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { existsSync } from 'node:fs'

export function loadEnv(): void {
  if (existsSync('.env')) process.loadEnvFile()
}

/** Reads a required setting from the environment / .env; the message names it, never its value. */
export function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Set ${name} in .env first.`)
  return value
}

export function adminClient(): SupabaseClient {
  loadEnv()
  const url = requireEnv('SUPABASE_URL')
  const key = requireEnv('SUPABASE_SERVICE_ROLE_KEY')
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

/** Runs a script body and prints a friendly error instead of a stack trace. */
export function runScript(body: () => Promise<void>): void {
  body().catch((err: unknown) => {
    console.error(err instanceof Error ? err.message : 'Something went wrong.')
    process.exit(1)
  })
}
