import { describe, expect, it } from 'vitest'
import { pickVoice } from '../src/lib/voicePick'

describe('pickVoice', () => {
  const both = ['prajakta', 'vinayak']
  it('uses the preferred voice when it has the clip', () => {
    expect(pickVoice('vinayak', both, () => 0)).toBe('vinayak')
  })
  it('mix picks randomly among voices that have the clip', () => {
    expect(pickVoice('mix', both, () => 0)).toBe('prajakta')
    expect(pickVoice('mix', both, () => 0.99)).toBe('vinayak')
    expect(pickVoice('mix', ['vinayak'], () => 0)).toBe('vinayak')
  })
  it('falls back to any voice that has it, including for unknown ids', () => {
    expect(pickVoice('prajakta', ['vinayak'], () => 0)).toBe('vinayak')
    expect(pickVoice('nobody', both, () => 0.99)).toBe('vinayak')
  })
  it('returns undefined when nothing is recorded', () => {
    expect(pickVoice('mix', [])).toBeUndefined()
  })
})
