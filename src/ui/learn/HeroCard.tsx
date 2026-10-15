import { FlameIcon } from '../common/Icons'
import { ProgressBar } from '../common/ProgressBar'
import { useProgress } from '../state/ProgressProvider'
import { useDayStats } from '../state/useDayStats'
import { streakNudge } from './hero'
import type { NodeInfo } from './sections'

function GoalLine({ xp, goal }: { xp: number; goal: number }) {
  return (
    <div className="hero-goal">
      <div className="hero-goal-row"><span>Today</span><strong>{xp} / {goal} XP</strong></div>
      <ProgressBar value={Math.min(xp, goal)} max={goal} label="Daily goal" />
    </div>
  )
}

/** The top of Learn: greeting, today's goal, a streak nudge and the one big Continue button. */
export function HeroCard({ next, onContinue }: { next: NodeInfo | null; onContinue(): void }) {
  const { username } = useProgress()
  const { streak, todayXp, goal } = useDayStats()
  return (
    <section className="card hero" aria-label="Today">
      <h1><span lang="mr">नमस्कार</span>{username ? `, ${username}!` : '!'}</h1>
      <GoalLine xp={todayXp} goal={goal} />
      <p className="hero-nudge"><FlameIcon size={20} />{streakNudge(streak.current, streak.doneToday)}</p>
      {next
        ? <button type="button" className="btn btn-primary" onClick={onContinue}>Continue · {next.title}</button>
        : <p className="muted">You have finished everything here. Review keeps your words fresh.</p>}
    </section>
  )
}
