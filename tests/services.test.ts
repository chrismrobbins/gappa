import { describe, expect, it } from 'vitest'
import { COURSES } from '../src/content'
import { audioKey } from '../src/lib/audioKey'
import { resolveMode, type SpeechEnv } from '../src/lib/speechMode'
import { passwordError, signInError, signUpError, usernameError, usernameToEmail } from '../src/lib/username'
import { charCount, collectLines } from '../scripts/lines'

const chrome: SpeechEnv = {
  userAgent: 'Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/120.0 Safari/537.36',
  brands: ['Chromium', 'Google Chrome'],
  hasWebkitRecognition: true,
  cloudEnabled: true,
}
const iphone: SpeechEnv = {
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit/605 Version/17 Mobile Safari/604',
  brands: [],
  hasWebkitRecognition: true,
  cloudEnabled: true,
}

describe('usernameToEmail', () => {
  it('lowercases and uses the synthetic domain', () => {
    expect(usernameToEmail(' Chris_1 ')).toBe('chris_1@users.gappa.example')
  })
})

describe('collectLines', () => {
  const course = COURSES.mr!
  const lines = collectLines(course)
  it('has no duplicate audio keys', () => {
    expect(new Set(lines.map(audioKey)).size).toBe(lines.length)
  })
  it('includes letters and words', () => {
    expect(lines).toContain(course.script[0].letters[0].char)
    expect(lines).toContain(course.units[0].lessons[0].words[0].target.trim())
  })
  it('counts code points', () => {
    expect(charCount('कसे')).toBe(3)
  })
})

describe('resolveMode', () => {
  it('uses the browser on desktop Chrome', () => expect(resolveMode('auto', chrome)).toBe('browser'))
  it('uses the server on iPhone', () => expect(resolveMode('auto', iphone)).toBe('server'))
  it('excludes Edge', () => {
    const edge = { ...chrome, userAgent: chrome.userAgent + ' Edg/120', brands: ['Microsoft Edge'] }
    expect(resolveMode('auto', edge)).toBe('server')
  })
  it('is off without cloud on unsupported browsers', () => {
    expect(resolveMode('auto', { ...iphone, cloudEnabled: false })).toBe('off')
  })
  it('respects off', () => expect(resolveMode('off', chrome)).toBe('off'))
})

describe('resolveMode on other Chromium browsers', () => {
  it('sends Brave (no Google Chrome brand) to the server', () => {
    expect(resolveMode('auto', { ...chrome, brands: ['Chromium', 'Brave'] })).toBe('server')
  })
})

describe('account rules (shared by the form and /api/signup)', () => {
  const ok = { username: 'Chris_1', password: 'longenough', invite: 'GAPPA-ABCDEFGH' }
  it('accepts good details', () => expect(signUpError(ok)).toBeNull())
  it('rejects bad usernames and short passwords', () => {
    expect(usernameError('a b')).not.toBeNull()
    expect(passwordError('short')).not.toBeNull()
    expect(signUpError({ ...ok, invite: ' ' })).toBe('Please enter your invite code.')
  })
  it('only needs a password to sign in', () => expect(signInError({ ...ok, password: 'x' })).toBeNull())
})
