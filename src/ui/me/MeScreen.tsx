import type { ReactNode } from 'react'
import { STREAK_FREEZE } from '../../config'
import { levelInfo } from '../../lib/progress'
import { FlameIcon, SnowflakeIcon, StarIcon, TrophyIcon } from '../common/Icons'
import { ProgressBar } from '../common/ProgressBar'
import { useProgress } from '../state/ProgressProvider'
import { useDayStats } from '../state/useDayStats'
import { BadgeGrid } from './BadgeGrid'
import { SettingsPanel } from './SettingsPanel'

function ProfileCard() {
  const { username } = useProgress()
  const { totalXp } = useDayStats()
  const lvl = levelInfo(totalXp)
  const name = username ?? 'Learner'
  return (
    <section className="card profile">
      <div className="profile-head">
        <span className="avatar" aria-hidden="true">{name.charAt(0)}</span>
        <div>
          <h1>{name}</h1>
          <span className="level-badge">Level {lvl.level}</span>
        </div>
      </div>
      <ProgressBar value={lvl.xpIntoLevel} max={lvl.xpForNext} label="Progress to next level" />
      <p className="muted profile-hint">{lvl.xpIntoLevel} / {lvl.xpForNext} XP to level {lvl.level + 1}</p>
    </section>
  )
}

function Freezes({ count }: { count: number }) {
  return (
    <span className="freezes" aria-label={`${count} streak freezes`}>
      {Array.from({ length: STREAK_FREEZE.max }, (_, i) => (
        <SnowflakeIcon key={i} size={26} className={i < count ? 'is-on' : 'is-off'} />
      ))}
    </span>
  )
}

function StatCard(props: { tone: string; icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className={`card stat-card tone-${props.tone}`}>
      {props.icon}
      <strong>{props.children}</strong>
      <span>{props.label}</span>
    </li>
  )
}

function StatsGrid() {
  const { streak, totalXp } = useDayStats()
  return (
    <ul className="stats-grid">
      <StatCard tone="flame" icon={<FlameIcon size={28} />} label={`Day streak · best ${streak.longest}`}>{streak.current}</StatCard>
      <StatCard tone="star" icon={<StarIcon size={28} />} label="Total XP">{totalXp}</StatCard>
      <StatCard tone="level" icon={<TrophyIcon size={28} />} label="Level">{levelInfo(totalXp).level}</StatCard>
      <StatCard tone="ice" icon={<SnowflakeIcon size={28} />} label="Streak freezes"><Freezes count={streak.freezes} /></StatCard>
    </ul>
  )
}

export function MeScreen() {
  const { progress, cloud, signOut } = useProgress()
  return (
    <div className="screen">
      <ProfileCard />
      <StatsGrid />
      <section className="stack">
        <h2 className="section-title">Badges</h2>
        <div className="card"><BadgeGrid earned={progress.badges} /></div>
      </section>
      <SettingsPanel />
      {cloud
        ? <button type="button" className="btn btn-ghost" onClick={() => void signOut()}>Sign out</button>
        : <p className="muted center">Local mode — progress stays on this device</p>}
    </div>
  )
}
