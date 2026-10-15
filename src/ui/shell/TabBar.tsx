import type { ReactNode } from 'react'
import { BookIcon, CycleIcon, UserIcon } from '../common/Icons'
import { Wordmark } from '../common/Wordmark'

export type Tab = 'learn' | 'review' | 'me'

const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: 'learn', label: 'Learn', icon: <BookIcon /> },
  { id: 'review', label: 'Review', icon: <CycleIcon /> },
  { id: 'me', label: 'Me', icon: <UserIcon /> },
]

/** A bottom tab bar on phones; a left sidebar with the wordmark on wide screens. */
export function TabBar({ tab, onChange }: { tab: Tab; onChange(t: Tab): void }) {
  return (
    <nav className="tabbar" aria-label="Main">
      <span className="tabbar-brand"><Wordmark size="md" /></span>
      {TABS.map((t) => (
        <button key={t.id} type="button" className="tabbar-item" aria-current={t.id === tab ? 'page' : undefined}
          onClick={() => onChange(t.id)}>
          <span className="tabbar-icon">{t.icon}</span><span>{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
