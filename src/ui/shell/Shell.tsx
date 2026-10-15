import type { ReactNode } from 'react'
import { TabBar, type Tab } from './TabBar'
import { TopBar } from './TopBar'

export function Shell(props: { tab: Tab; onTab(t: Tab): void; children: ReactNode }) {
  return (
    <div className="shell">
      <TopBar />
      <main className="shell-main">{props.children}</main>
      <TabBar tab={props.tab} onChange={props.onTab} />
    </div>
  )
}
