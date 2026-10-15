import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { normalizeUsername, signUpError, usernameToEmail, type Credentials } from '../src/lib/username.js'
import { errorJson, json, requireEnv, serverError } from './_lib.js'

function adminClient(): SupabaseClient {
  return createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

function str(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

/** Returns the cleaned input, or a friendly message when something is off. */
function parseInput(body: unknown): Credentials | string {
  const raw = (body ?? {}) as Record<string, unknown>
  const input = {
    username: normalizeUsername(str(raw.username)),
    password: str(raw.password),
    invite: str(raw.invite).trim().toUpperCase(),
  }
  return signUpError(input) ?? input
}

async function claimInvite(admin: SupabaseClient, code: string): Promise<boolean> {
  const { data, error } = await admin.rpc('claim_invite', { p_code: code })
  if (error) throw new Error('invite check failed')
  return data === true
}

async function createUser(admin: SupabaseClient, { username, password }: Credentials) {
  return admin.auth.admin.createUser({
    email: usernameToEmail(username),
    password,
    email_confirm: true,
    user_metadata: { username },
  })
}

function isTaken(error: { status?: number; message: string }): boolean {
  return error.status === 422 || /already|registered|exists/i.test(error.message)
}

async function register(input: Credentials): Promise<Response> {
  const admin = adminClient()
  if (!(await claimInvite(admin, input.invite))) {
    return errorJson('That invite code is not valid, or has already been used.', 403)
  }
  const { error } = await createUser(admin, input)
  if (!error) return json({ ok: true })
  await admin.rpc('release_invite', { p_code: input.invite })
  if (isTaken(error)) return errorJson('That username is taken. Please pick another.', 409)
  return serverError()
}

export async function POST(req: Request): Promise<Response> {
  const input = parseInput(await req.json().catch(() => null))
  if (typeof input === 'string') return errorJson(input, 400)
  return register(input).catch(serverError)
}
