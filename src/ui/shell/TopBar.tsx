import { FlameIcon, StarIcon } from '../common/Icons'
import { Wordmark } from '../common/Wordmark'
import { useOnline } from '../state/useOnline'
import { useDayStats } from '../state/useDayStats'
import { GoalRing } from './GoalRing'

export function TopBar() {
  const online = useOnline()
  const { streak, todayXp, totalXp, goal } = useDayStats()
  return (
    <header className="topbar">
      <div className="container topbar-row">
        <Wordmark size="sm" />
        <div className="topbar-stats">
          <span className={`stat stat-streak${streak.doneToday ? ' is-lit' : ''}`} aria-label={`${streak.current} day streak`}>
            <FlameIcon size={22} />{streak.current}
          </span>
          <span className="stat stat-xp" aria-label={`${totalXp} total XP`}>
            <StarIcon size={20} />{totalXp}
          </span>
          <GoalRing value={todayXp} goal={goal} />
        </div>
      </div>
      {!online && <p className="offline-pill" role="status">Offline — progress will sync later</p>}
    </header>
  )
}
