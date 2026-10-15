import type { ReactNode } from 'react'
import { BookIcon, CycleIcon, UserIcon } from '../common/Icons'

export type Tab = 'learn' | 'review' | 'me'

const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: 'learn', label: 'Learn', icon: <BookIcon /> },
  { id: 'review', label: 'Review', icon: <CycleIcon /> },
  { id: 'me', label: 'Me', icon: <UserIcon /> },
]

export function TabBar({ tab, onChange }: { tab: Tab; onChange(t: Tab): void }) {
  return (
    <nav className="tabbar" aria-label="Main">
      {TABS.map((t) => (
        <button key={t.id} type="button" className="tabbar-item" aria-current={t.id === tab ? 'page' : undefined}
          onClick={() => onChange(t.id)}>
          {t.icon}<span>{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
