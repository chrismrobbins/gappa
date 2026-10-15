import type { ExerciseResult, Shown, TilesCard } from '../../types'
import { normalize } from '../../lib/text'

/** What an exercise card reports: how it was answered and what to show as the right answer. */
export interface Attempt {
  results: ExerciseResult[]
  correct: boolean
  reveal?: Shown
  /** True for cards that finish themselves (match, speak) without a Check button. */
  auto?: boolean
  /** Message used instead of the standard wrong-answer text. */
  note?: string
}

/** The first accepted answer, rebuilt from tiles so it carries romanization. */
export function tilesAnswer(card: TilesCard): Shown {
  const pool = [...card.tiles]
  const parts = (card.answers[0] ?? []).map((token) => {
    const at = pool.findIndex((t) => normalize(t.text) === token)
    return at >= 0 ? pool.splice(at, 1)[0] : { text: token }
  })
  const rom = parts.map((p) => p.rom).filter(Boolean).join(' ')
  return { text: parts.map((p) => p.text).join(' '), rom: rom || undefined }
}

/** Text played automatically when a card appears. */
export function autoplayText(card: { kind: string; say?: string }): string | undefined {
  return card.kind === 'choice' || card.kind === 'tiles' ? card.say : undefined
}
