import { describe, expect, it } from 'vitest'
import { clipUrls, estimateMb, voiceIndexUrl, voicesToDownload } from '../src/lib/offlineClips'

describe('offlineClips', () => {
  it('builds index urls', () => {
    expect(voiceIndexUrl('mr', 'prajakta')).toBe('/audio/mr/prajakta/index.json')
  })
  it('lists every clip of every voice', () => {
    expect(clipUrls('mr', { a: ['x', 'y'], b: ['x'] })).toEqual([
      '/audio/mr/a/x.mp3', '/audio/mr/a/y.mp3', '/audio/mr/b/x.mp3',
    ])
  })
  it('picks voices from the preference', () => {
    expect(voicesToDownload('mix', ['a', 'b'])).toEqual(['a', 'b'])
    expect(voicesToDownload('b', ['a', 'b'])).toEqual(['b'])
  })
  it('estimates at least 1 MB', () => {
    expect(estimateMb(1)).toBe(1)
    expect(estimateMb(770)).toBe(15)
  })
})
