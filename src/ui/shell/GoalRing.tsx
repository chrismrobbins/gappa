const RADIUS = 16
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function GoalRing({ value, goal }: { value: number; goal: number }) {
  const fraction = Math.min(1, value / goal)
  return (
    <span className="goal" role="img" aria-label={`Daily goal: ${value} of ${goal} XP`}>
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle className="goal-track" cx="20" cy="20" r={RADIUS} />
        <circle className="goal-fill" cx="20" cy="20" r={RADIUS} strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - fraction)} transform="rotate(-90 20 20)" />
      </svg>
      <span className="goal-text">{value}</span>
    </span>
  )
}
