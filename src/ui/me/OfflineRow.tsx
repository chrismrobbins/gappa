import { estimateMb } from '../../lib/offlineClips'
import { offlineSupported } from '../../services/offline'
import { useOfflineDownload } from './useOfflineDownload'

function statusLine(d: ReturnType<typeof useOfflineDownload>): string {
  const p = d.progress
  if (d.state === 'done') return p && p.failed > 0 ? `Saved ${p.total - p.failed} of ${p.total} clips. Try again online.` : 'All lessons are saved for offline use.'
  if (d.state === 'running') return `${p?.done ?? 0} / ${p?.total ?? d.clipCount ?? 0} clips`
  return 'Clips you have already played are saved automatically.'
}

export function OfflineRow(props: { voicePref: string }) {
  const d = useOfflineDownload(props.voicePref)
  const ready = offlineSupported() && d.clipCount !== null && d.clipCount > 0
  const label = d.clipCount ? `Download all lessons (≈ ${estimateMb(d.clipCount)} MB)` : 'Download all lessons'
  return (
    <>
      <button type="button" className="btn btn-ghost setting-btn" disabled={!ready || d.state === 'running'} onClick={d.start}>
        {d.state === 'done' ? 'Download again' : label}
      </button>
      <p className="muted setting-help" role="status" aria-live="polite">
        {offlineSupported() ? statusLine(d) : 'Available in the installed app.'}
      </p>
    </>
  )
}
