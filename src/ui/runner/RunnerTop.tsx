import { useState } from 'react'
import { ConfirmDialog } from '../common/ConfirmDialog'
import { CloseIcon } from '../common/Icons'

export function RunnerTop({ fraction, onExit }: { fraction: number; onExit(): void }) {
  const [asking, setAsking] = useState(false)
  return (
    <header className="runner-top">
      <button type="button" className="icon-btn" aria-label="Close lesson" onClick={() => setAsking(true)}>
        <CloseIcon />
      </button>
      <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(fraction * 100)}>
        <div className="bar-fill" style={{ width: `${fraction * 100}%` }} />
      </div>
      {asking && (
        <ConfirmDialog title="Leave this lesson?" body="Your progress in this lesson will be lost."
          confirmLabel="Leave" cancelLabel="Keep going" onConfirm={onExit} onCancel={() => setAsking(false)} />
      )}
    </header>
  )
}
