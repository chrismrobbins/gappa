import { itemKey } from '../engine/keys'
import type { Card } from '../types'

/** Candidate review keys for a card, best first; the caller picks the first one that is a real line. */
export function cardReviewKeys(card: Card, sessionId: string): string[] {
  switch (card.kind) {
    case 'choice': case 'tiles': case 'speak': return [card.key]
    case 'match': return card.keys.slice(0, 1)
    case 'teach': return card.items.slice(0, 1).flatMap((i) => [itemKey(sessionId, 'w', i.target), itemKey(sessionId, 'p', i.target)])
    case 'teach-letters': return card.letters.slice(0, 1).map((l) => itemKey(sessionId, 'l', l.char))
    case 'tip': return (card.tip.examples ?? []).slice(0, 1).map((e) => itemKey(sessionId, 't', e.target))
    case 'slide': return (card.slide.examples ?? []).slice(0, 1).map((e) => itemKey(sessionId, 'i', e.text))
  }
}
