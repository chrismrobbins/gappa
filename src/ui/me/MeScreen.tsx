import { levelInfo, streakInfo, totalXp } from '../../lib/progress'
import { STREAK_FREEZE } from '../../config'
import { SnowflakeIcon } from '../common/Icons'
import { useProgress } from '../state/ProgressProvider'
import { todayKey } from '../state/today'
import { BadgeGrid } from './BadgeGrid'
import { SettingsPanel } from './SettingsPanel'

function Freezes({ count }: { count: number }) {
  return (
    <span className="freezes" aria-label={`${count} streak freezes`}>
      {Array.from({ length: STREAK_FREEZE.max }, (_, i) => (
        <SnowflakeIcon key={i} size={22} className={i < count ? 'is-on' : 'is-off'} />
      ))}
    </span>
  )
}

function Summary() {
  const { progress, username } = useProgress()
  const xp = totalXp(progress)
  const lvl = levelInfo(xp)
  const streak = streakInfo(progress, todayKey())
  return (
    <section className="card">
      <h1>{username ?? 'Learner'}</h1>
      <p>Level {lvl.level} · {xp} XP</p>
      <div className="bar" role="progressbar" aria-label="Progress to next level" aria-valuemin={0}
        aria-valuemax={lvl.xpForNext} aria-valuenow={lvl.xpIntoLevel}>
        <div className="bar-fill" style={{ width: `${(lvl.xpIntoLevel / lvl.xpForNext) * 100}%` }} />
      </div>
      <p className="muted">{lvl.xpIntoLevel} / {lvl.xpForNext} XP to level {lvl.level + 1}</p>
      <p>Streak {streak.current} days · longest {streak.longest}</p>
      <p>Streak freezes <Freezes count={streak.freezes} /></p>
    </section>
  )
}

export function MeScreen() {
  const { progress, cloud, signOut } = useProgress()
  return (
    <div className="screen">
      <Summary />
      <h2>Badges</h2>
      <BadgeGrid earned={progress.badges} />
      <SettingsPanel />
      {cloud
        ? <button type="button" className="btn btn-ghost" onClick={() => void signOut()}>Sign out</button>
        : <p className="muted center">Local mode — progress stays on this device</p>}
    </div>
  )
}
