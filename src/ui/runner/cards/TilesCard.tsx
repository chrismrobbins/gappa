import { useState } from 'react'
import { gradeTiles } from '../../../engine'
import type { TilesCard as Data } from '../../../types'
import { Native } from '../../common/Native'
import { tilesAnswer, type Attempt } from '../attempt'
import { CardFrame, Prompt } from './CardFrame'

interface Props { card: Data; locked: boolean; onAttempt(a: Attempt | null): void }

function toAttempt(card: Data, picked: number[]): Attempt | null {
  if (picked.length === 0) return null
  const correct = gradeTiles(card, picked.map((i) => card.tiles[i].text))
  return { results: [{ key: card.key, correct }], correct, reveal: tilesAnswer(card) }
}

export function TilesCard({ card, locked, onAttempt }: Props) {
  const [picked, setPicked] = useState<number[]>([])
  const update = (next: number[]) => { setPicked(next); onAttempt(toAttempt(card, next)) }
  const add = (i: number) => update([...picked, i])
  const remove = (i: number) => update(picked.filter((p) => p !== i))
  return (
    <CardFrame title={card.instruction}>
      <Prompt prompt={card.prompt} say={card.say} hidePrompt={card.hidePrompt} />
      <div className="answer-area" aria-label="Your answer">
        {picked.map((i) => (
          <button key={i} type="button" className="tile" disabled={locked} onClick={() => remove(i)}>
            <Native text={card.tiles[i].text} rom={card.tiles[i].rom} tappable={false} />
          </button>
        ))}
      </div>
      <div className="tile-bank">
        {card.tiles.map((t, i) => (
          <button key={i} type="button" className="tile" disabled={locked || picked.includes(i)}
            hidden={picked.includes(i)} onClick={() => add(i)}>
            <Native text={t.text} rom={t.rom} tappable={false} />
          </button>
        ))}
      </div>
    </CardFrame>
  )
}
