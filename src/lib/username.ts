// Account rules shared by the browser and the signup API function (so: no browser-only imports).
import { PASSWORD_MIN, USERNAME_EMAIL_DOMAIN, USERNAME_PATTERN } from '../config.js'

export interface Credentials {
  username: string
  password: string
  invite: string
}

export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase()
}

/** Supabase Auth wants an email; usernames map to a synthetic one (no mail is sent). */
export function usernameToEmail(username: string): string {
  return `${normalizeUsername(username)}@${USERNAME_EMAIL_DOMAIN}`
}

export function usernameError(username: string): string | null {
  const ok = USERNAME_PATTERN.test(normalizeUsername(username))
  return ok ? null : 'Usernames are 3 to 20 letters, numbers or underscores.'
}

export function passwordError(password: string): string | null {
  return password.length >= PASSWORD_MIN ? null : `Passwords need at least ${PASSWORD_MIN} characters.`
}

/** A friendly message when sign-in details are not ready to send, else null. */
export function signInError(c: Credentials): string | null {
  return usernameError(c.username) ?? (c.password ? null : 'Please enter your password.')
}

/** A friendly message when sign-up details are not ready to send, else null. */
export function signUpError(c: Credentials): string | null {
  const invite = c.invite.trim() ? null : 'Please enter your invite code.'
  return usernameError(c.username) ?? passwordError(c.password) ?? invite
}
