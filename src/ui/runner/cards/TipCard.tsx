import type { Item, TipCard as Data } from '../../../types'
import { BulbIcon } from '../../common/Icons'
import { Native } from '../../common/Native'
import { Rich } from '../../common/Rich'
import { SoundButtons } from '../../common/SoundButtons'
import { CardFrame } from './CardFrame'

function Example({ item }: { item: Item }) {
  return (
    <div className="card tip-example">
      <Native text={item.target} rom={item.rom} />
      <span className="muted">{item.en}</span>
      <SoundButtons text={item.target} />
    </div>
  )
}

export function TipCard({ card }: { card: Data }) {
  const { tip } = card
  return (
    <CardFrame title={tip.title} eyebrow="Tip" icon={<BulbIcon size={16} />} className="is-tip">
      {tip.body.map((para) => <p key={para} className="tip-para"><Rich text={para} /></p>)}
      {tip.examples?.map((ex) => <Example key={ex.target} item={ex} />)}
    </CardFrame>
  )
}
