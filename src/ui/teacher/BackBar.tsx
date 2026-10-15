import type { ReactNode } from 'react'
import { ArrowLeftIcon } from '../common/Icons'

/** Top of a teacher screen: a way back to Me and the screen's title. */
export function BackBar({ title, onBack, children }: { title: string; onBack(): void; children?: ReactNode }) {
  return (
    <header className="back-bar">
      <button type="button" className="icon-btn" aria-label="Back to Me" onClick={onBack}>
        <ArrowLeftIcon size={24} />
      </button>
      <h1>{title}</h1>
      {children}
    </header>
  )
}
