import { useState } from 'react'
import { ConfirmDialog } from '../common/ConfirmDialog'
import { CloseIcon } from '../common/Icons'
import { ProgressBar } from '../common/ProgressBar'
import { FlagButton } from '../teacher/FlagButton'
import type { ReviewItem } from '../../lib/reviewItems'

interface TopProps { fraction: number; onExit(): void; flag?: ReviewItem }

export function RunnerTop({ fraction, onExit, flag }: TopProps) {
  const [asking, setAsking] = useState(false)
  return (
    <header className="runner-top">
      <div className="container runner-top-row">
        <button type="button" className="icon-btn" aria-label="Close lesson" onClick={() => setAsking(true)}>
          <CloseIcon size={26} />
        </button>
        <ProgressBar value={Math.round(fraction * 100)} max={100} label="Lesson progress" />
        {flag && <FlagButton item={flag} />}
      </div>
      {asking && (
        <ConfirmDialog title="Leave this lesson?" body="Your progress in this lesson will be lost."
          confirmLabel="Leave" cancelLabel="Keep going" onConfirm={onExit} onCancel={() => setAsking(false)} />
      )}
    </header>
  )
}
