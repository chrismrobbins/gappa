interface ProgressBarProps { value: number; max: number; label: string }

/** Thick rounded progress bar with a screen-reader value. */
export function ProgressBar({ value, max, label }: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div className="bar" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
      <div className="bar-fill" style={{ width: `${percent}%` }} />
    </div>
  )
}
