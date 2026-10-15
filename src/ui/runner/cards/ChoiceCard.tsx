import { useState } from 'react'
import { gradeChoice } from '../../../engine'
import type { ChoiceCard as Data } from '../../../types'
import { Native } from '../../common/Native'
import type { Attempt } from '../attempt'
import { CardFrame, Prompt } from './CardFrame'

interface Props { card: Data; locked: boolean; onAttempt(a: Attempt | null): void }

function optionClass(i: number, picked: number | null, card: Data, locked: boolean): string {
  if (locked && i === card.answer) return 'option is-right'
  if (locked && i === picked) return 'option is-wrong'
  return i === picked ? 'option is-picked' : 'option'
}

export function ChoiceCard({ card, locked, onAttempt }: Props) {
  const [picked, setPicked] = useState<number | null>(null)
  const pick = (i: number) => {
    setPicked(i)
    const correct = gradeChoice(card, i)
    onAttempt({ results: [{ key: card.key, correct }], correct, reveal: card.options[card.answer] })
  }
  return (
    <CardFrame title={card.instruction}>
      <Prompt prompt={card.prompt} say={card.say} hidePrompt={card.hidePrompt} />
      <div className="options" role="group" aria-label="Answers">
        {card.options.map((o, i) => (
          <button key={`${o.text}-${i}`} type="button" className={optionClass(i, picked, card, locked)}
            disabled={locked} aria-pressed={picked === i} onClick={() => pick(i)}>
            <Native text={o.text} rom={o.rom} tappable={false} />
          </button>
        ))}
      </div>
    </CardFrame>
  )
}
