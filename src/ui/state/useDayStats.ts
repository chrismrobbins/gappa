import { streakInfo, totalXp } from '../../lib/progress'
import { useProgress } from './ProgressProvider'
import { todayKey } from './today'

/** Streak, XP and daily-goal numbers shared by the top bar and the Learn hero card. */
export function useDayStats() {
  const { progress } = useProgress()
  const today = todayKey()
  return {
    streak: streakInfo(progress, today),
    todayXp: progress.days[today]?.xp ?? 0,
    totalXp: totalXp(progress),
    goal: progress.settings.dailyGoal,
  }
}
