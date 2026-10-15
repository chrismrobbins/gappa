import type { Item, TeachCard as TeachCardData } from '../../../types'
import { Native } from '../../common/Native'
import { SoundButtons } from '../../common/SoundButtons'
import { CardFrame } from './CardFrame'

function Chips({ item }: { item: Item }) {
  return (
    <>
      {item.register && <span className="tag">{item.register === 'polite' ? 'Polite' : 'Casual'}</span>}
      {item.note && <span className="tag tag-note">{item.note}</span>}
    </>
  )
}

function TeachRow({ item }: { item: Item }) {
  return (
    <li className="teach-item card">
      <div className="teach-main">
        <Native text={item.target} rom={item.rom} className="native-big" />
        <p className="teach-en">{item.en}</p>
        <Chips item={item} />
      </div>
      <SoundButtons text={item.target} />
    </li>
  )
}

export function TeachCard({ card }: { card: TeachCardData }) {
  return (
    <CardFrame title={card.title}>
      <ul className="teach-list">{card.items.map((item) => <TeachRow key={item.target} item={item} />)}</ul>
    </CardFrame>
  )
}
