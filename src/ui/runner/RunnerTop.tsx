import { useState } from 'react'
import { ConfirmDialog } from '../common/ConfirmDialog'
import { CloseIcon } from '../common/Icons'
import { ProgressBar } from '../common/ProgressBar'

export function RunnerTop({ fraction, onExit }: { fraction: number; onExit(): void }) {
  const [asking, setAsking] = useState(false)
  return (
    <header className="runner-top">
      <div className="container runner-top-row">
        <button type="button" className="icon-btn" aria-label="Close lesson" onClick={() => setAsking(true)}>
          <CloseIcon size={26} />
        </button>
        <ProgressBar value={Math.round(fraction * 100)} max={100} label="Lesson progress" />
      </div>
      {asking && (
        <ConfirmDialog title="Leave this lesson?" body="Your progress in this lesson will be lost."
          confirmLabel="Leave" cancelLabel="Keep going" onConfirm={onExit} onCancel={() => setAsking(false)} />
      )}
    </header>
  )
}
