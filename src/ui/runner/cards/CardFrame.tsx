import type { ReactNode } from 'react'
import type { Shown } from '../../../types'
import { Native } from '../../common/Native'
import { nativeSize } from '../../common/nativeSize'
import { SoundButtons } from '../../common/SoundButtons'

interface FrameProps { title: string; eyebrow?: string; icon?: ReactNode; className?: string; children: ReactNode }

/** The shared layout of every card: an optional eyebrow chip, a heading, then the card's own content. */
export function CardFrame({ title, eyebrow, icon, className = '', children }: FrameProps) {
  return (
    <div className={`card-body ${className}`}>
      {eyebrow && <p className="eyebrow">{icon}{eyebrow}</p>}
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
}

/** The question line of an exercise: a speech bubble with the text, its romanization and replay buttons. */
export function Prompt({ prompt, say, hidePrompt = false }: PromptProps) {
  return (
    <div className={`prompt${hidePrompt ? ' prompt-listen' : ''}`}>
      {!hidePrompt && <Native text={prompt.text} rom={prompt.rom} className={nativeSize(prompt.text)} />}
      {say && <SoundButtons text={say} size={hidePrompt ? 'lg' : 'md'} />}
    </div>
  )
}
