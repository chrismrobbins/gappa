import { pickOne, type Rng } from './random'

/** The preferred voice if it has the clip, else a random one that does ('mix' always lands here). */
export function pickVoice(pref: string, available: readonly string[], rng: Rng = Math.random): string | undefined {
  return available.includes(pref) ? pref : pickOne(available, rng)
}
