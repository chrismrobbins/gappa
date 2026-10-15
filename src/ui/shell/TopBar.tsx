import { totalXp, streakInfo } from '../../lib/progress'
import { FlameIcon, StarIcon } from '../common/Icons'
import { useProgress } from '../state/ProgressProvider'
import { todayKey } from '../state/today'
import { GoalRing } from './GoalRing'

export function TopBar() {
  const { progress } = useProgress()
  const today = todayKey()
  const streak = streakInfo(progress, today)
  const todayXp = progress.days[today]?.xp ?? 0
  const xp = totalXp(progress)
  return (
    <header className="topbar">
      <span className={`stat stat-streak${streak.doneToday ? ' is-lit' : ''}`} aria-label={`${streak.current} day streak`}>
        <FlameIcon size={22} />{streak.current}
      </span>
      <span className="stat stat-xp" aria-label={`${xp} total XP`}>
        <StarIcon size={20} />{xp}
      </span>
      <GoalRing value={todayXp} goal={progress.settings.dailyGoal} />
    </header>
  )
}
