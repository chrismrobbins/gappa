import type { ReactNode } from 'react'
import type { Shown } from '../../../types'
import { Native } from '../../common/Native'
import { SoundButtons } from '../../common/SoundButtons'

/** The shared layout of every card: a heading, then the card's own content. */
export function CardFrame({ title, eyebrow, children }: { title: string; eyebrow?: string; children: ReactNode }) {
  return (
    <div className="card-body">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="instruction">{title}</h2>
      {children}
    </div>
  )
}

interface PromptProps {
  prompt: Shown
  say?: string
  /** Listening exercise: only the (large) audio buttons show. */
  hidePrompt?: boolean
  big?: boolean
}

/** The question line of an exercise: text with its romanization, plus replay buttons. */
export function Prompt({ prompt, say, hidePrompt = false, big = false }: PromptProps) {
  return (
    <div className="prompt">
      {!hidePrompt && <Native text={prompt.text} rom={prompt.rom} className={big ? 'native-big' : ''} />}
      {say && <SoundButtons text={say} large={hidePrompt} />}
    </div>
  )
}
