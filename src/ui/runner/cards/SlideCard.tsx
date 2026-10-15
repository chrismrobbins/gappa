import { Fragment } from 'react'
import type { IntroExample, SlideCard as Data } from '../../../types'
import { Native } from '../../common/Native'
import { nativeSize } from '../../common/nativeSize'
import { Rich } from '../../common/Rich'
import { SoundButtons } from '../../common/SoundButtons'
import { CardFrame } from './CardFrame'

/** "न + म + स्का + र →" : the pieces that build the word. */
function BuildUp({ parts }: { parts: string[] }) {
  return (
    <div className="slide-build" aria-hidden="true">
      {parts.map((part, i) => (
        <Fragment key={`${part}-${i}`}>
          {i > 0 && <span className="slide-plus">+</span>}
          <span className="slide-part" lang="mr">{part}</span>
        </Fragment>
      ))}
      <span className="slide-arrow">→</span>
    </div>
  )
}

function Example({ example }: { example: IntroExample }) {
  return (
    <div className="card slide-example">
      {example.parts && <BuildUp parts={example.parts} />}
      <Native text={example.text} rom={example.rom} className={nativeSize(example.text)} />
      <div className="slide-foot">
        {example.en ? <p className="slide-en">{example.en}</p> : <span />}
        <SoundButtons text={example.text} />
      </div>
    </div>
  )
}

/** A teaching slide: title, short paragraphs, worked examples. Nothing plays by itself. */
export function SlideCard({ card }: { card: Data }) {
  const { slide } = card
  return (
    <CardFrame title={slide.title} eyebrow="How it works">
      {slide.body.map((para) => <p key={para} className="tip-para"><Rich text={para} /></p>)}
      {slide.examples?.map((ex) => <Example key={ex.text} example={ex} />)}
    </CardFrame>
  )
}
