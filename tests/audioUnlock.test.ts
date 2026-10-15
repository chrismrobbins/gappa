import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('unlockAudio', () => {
  const play = vi.fn(() => Promise.resolve())
  const pause = vi.fn()
  const speak = vi.fn()

  beforeEach(() => {
    vi.resetModules()
    play.mockClear(); pause.mockClear(); speak.mockClear()
    vi.stubGlobal('Audio', vi.fn(() => ({ play, pause })))
    vi.stubGlobal('SpeechSynthesisUtterance', vi.fn(() => ({})))
    vi.stubGlobal('window', { speechSynthesis: { speak } })
  })
  afterEach(() => vi.unstubAllGlobals())

  it('plays a silent clip and primes speech once', async () => {
    const { unlockAudio } = await import('../src/services/audio')
    unlockAudio(); unlockAudio()
    await Promise.resolve()
    expect(play).toHaveBeenCalledTimes(1)
    expect(speak).toHaveBeenCalledTimes(1)
  })

  it('never throws when play rejects or APIs throw', async () => {
    play.mockImplementationOnce(() => Promise.reject(new Error('blocked')))
    const { unlockAudio } = await import('../src/services/audio')
    expect(() => unlockAudio()).not.toThrow()
    vi.resetModules()
    vi.stubGlobal('Audio', vi.fn(() => { throw new Error('no audio') }))
    speak.mockImplementation(() => { throw new Error('no speech') })
    const fresh = await import('../src/services/audio')
    expect(() => fresh.unlockAudio()).not.toThrow()
  })
})
