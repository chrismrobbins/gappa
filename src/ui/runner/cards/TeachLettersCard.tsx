import type { Letter, TeachLettersCard as Data } from '../../../types'
import { Native } from '../../common/Native'
import { SoundButtons } from '../../common/SoundButtons'
import { CardFrame } from './CardFrame'

function LetterRow({ letter }: { letter: Letter }) {
  return (
    <li className="letter card">
      <span className="letter-glyph" lang="mr">{letter.char}</span>
      <div className="letter-info">
        <span className="letter-rom">{letter.rom}</span>
        <span className="letter-example">
          <Native text={letter.example.target} rom={letter.example.rom} />
          <SoundButtons text={letter.example.target} />
        </span>
        <span className="muted">{letter.example.en}</span>
      </div>
      <SoundButtons text={letter.char} />
    </li>
  )
}

export function TeachLettersCard({ card }: { card: Data }) {
  return (
    <CardFrame title="New letters">
      <ul className="teach-list">{card.letters.map((l) => <LetterRow key={l.char} letter={l} />)}</ul>
    </CardFrame>
  )
}
