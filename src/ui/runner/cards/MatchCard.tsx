import { useEffect, useMemo, useState } from 'react'
import { shuffle } from '../../../lib/random'
import type { MatchCard as Data, Shown } from '../../../types'
import { Native } from '../../common/Native'
import type { Attempt } from '../attempt'
import { CardFrame } from './CardFrame'

interface Props { card: Data; locked: boolean; onAttempt(a: Attempt | null): void }
const FLASH_MS = 450

function toAttempt(card: Data, missed: Set<number>): Attempt {
  const results = card.keys.map((key, i) => ({ key, correct: !missed.has(i) }))
  const correct = missed.size === 0
  return { results, correct, auto: true, note: correct ? undefined : 'Good effort. We will bring these back.' }
}

/** Clears a wrong-pick flash after a moment (and on unmount). */
function useFlash(): [number | null, (i: number) => void] {
  const [flash, setFlash] = useState<number | null>(null)
  useEffect(() => {
    if (flash === null) return undefined
    const timer = window.setTimeout(() => setFlash(null), FLASH_MS)
    return () => window.clearTimeout(timer)
  }, [flash])
  return [flash, setFlash]
}

function useMatch(card: Data, onAttempt: Props['onAttempt']) {
  const [left, setLeft] = useState<number | null>(null)
  const [done, setDone] = useState<number[]>([])
  const [missed, setMissed] = useState<Set<number>>(new Set())
  const [flash, setFlash] = useFlash()

  const chooseRight = (r: number) => {
    if (left === null) return
    setLeft(null)
    if (left !== r) {
      setMissed(new Set(missed).add(left))
      return setFlash(r)
    }
    const next = [...done, r]
    setDone(next)
    if (next.length === card.pairs.length) onAttempt(toAttempt(card, missed))
  }
  return { left, setLeft, done, flash, chooseRight }
}

function cls(selected: boolean, matched: boolean, wrong = false): string {
  return `option${selected ? ' is-picked' : ''}${matched ? ' is-matched' : ''}${wrong ? ' is-wrong' : ''}`
}

function PairButton(props: { shown: Shown; className: string; disabled: boolean; onClick(): void }) {
  return (
    <button type="button" className={props.className} disabled={props.disabled} onClick={props.onClick}>
      <Native text={props.shown.text} rom={props.shown.rom} tappable={false} />
    </button>
  )
}

export function MatchCard({ card, locked, onAttempt }: Props) {
  const m = useMatch(card, onAttempt)
  const rightOrder = useMemo(() => shuffle(card.pairs.map((_, i) => i)), [card])
  const isDone = (i: number) => m.done.includes(i)
  return (
    <CardFrame title="Tap the matching pairs">
      <div className="match">
        <div className="match-col">
          {card.pairs.map((p, i) => (
            <PairButton key={i} shown={p.left} className={cls(m.left === i, isDone(i))}
              disabled={locked || isDone(i)} onClick={() => m.setLeft(i)} />
          ))}
        </div>
        <div className="match-col">
          {rightOrder.map((i) => (
            <PairButton key={i} shown={card.pairs[i].right} className={cls(false, isDone(i), m.flash === i)}
              disabled={locked || isDone(i)} onClick={() => m.chooseRight(i)} />
          ))}
        </div>
      </div>
    </CardFrame>
  )
}
