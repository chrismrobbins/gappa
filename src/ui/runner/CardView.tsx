import type { Card } from '../../types'
import type { Attempt } from './attempt'
import { ChoiceCard } from './cards/ChoiceCard'
import { MatchCard } from './cards/MatchCard'
import { SpeakCard } from './cards/SpeakCard'
import { TeachCard } from './cards/TeachCard'
import { TeachLettersCard } from './cards/TeachLettersCard'
import { TilesCard } from './cards/TilesCard'
import { TipCard } from './cards/TipCard'

interface CardViewProps {
  card: Card
  locked: boolean
  speechMode: 'browser' | 'server'
  onAttempt(a: Attempt | null): void
  onSkipSpeaking(): void
}

/** Picks the component for a card kind. */
export function CardView({ card, locked, speechMode, onAttempt, onSkipSpeaking }: CardViewProps) {
  switch (card.kind) {
    case 'teach': return <TeachCard card={card} />
    case 'teach-letters': return <TeachLettersCard card={card} />
    case 'tip': return <TipCard card={card} />
    case 'choice': return <ChoiceCard card={card} locked={locked} onAttempt={onAttempt} />
    case 'match': return <MatchCard card={card} locked={locked} onAttempt={onAttempt} />
    case 'tiles': return <TilesCard card={card} locked={locked} onAttempt={onAttempt} />
    case 'speak':
      return <SpeakCard card={card} locked={locked} mode={speechMode} onAttempt={onAttempt} onSkipSpeaking={onSkipSpeaking} />
  }
}
