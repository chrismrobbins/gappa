import { useMemo } from 'react'
import { VOICES } from '../../config'
import { groupFixes, voiceLabel } from '../../lib/fixes'
import { lessonTitles, reviewItems } from '../../lib/reviewItems'
import type { OpenFix } from '../../types'
import { useProgress } from '../state/ProgressProvider'
import { BackBar } from './BackBar'
import { useOpenFixes } from './useOpenFixes'

const VOICE_NAMES = new Map(VOICES.map((v) => [v.id, v.name]))

function FixCard({ fix, onResolve }: { fix: OpenFix; onResolve(): void }) {
  const voice = voiceLabel(fix.voice, VOICE_NAMES)
  return (
    <li className="card fix-card">
      <span className="native" lang="mr">{fix.target}</span>
      {fix.correction && <p>Should be: <strong className="native-inline" lang="mr">{fix.correction}</strong></p>}
      {fix.comment && <p>{fix.comment}</p>}
      {voice && <p className="muted">Voice that sounded wrong: {voice}</p>}
      <p className="muted">{fix.reviewer} · {new Date(fix.createdAt).toLocaleDateString()}</p>
      <button type="button" className="chip" onClick={onResolve}>Mark resolved</button>
    </li>
  )
}

export function OpenFixesScreen({ onBack }: { onBack(): void }) {
  const { course } = useProgress()
  const { fixes, loaded, error, resolve } = useOpenFixes()
  const groups = useMemo(() => {
    const titles = lessonTitles(reviewItems(course))
    return groupFixes(fixes, titles, [...titles.keys()])
  }, [fixes, course])
  return (
    <div className="screen">
      <BackBar title="Open fixes" onBack={onBack} />
      {error && <p className="form-error" role="alert">{error}</p>}
      {loaded && groups.length === 0 && <p className="muted">Nothing to fix right now.</p>}
      {groups.map((g) => (
        <section key={g.lessonId} className="stack" aria-label={g.lessonTitle}>
          <h2 className="section-title">{g.lessonTitle}</h2>
          <ul className="review-list">
            {g.fixes.map((f) => <FixCard key={f.id} fix={f} onResolve={() => void resolve(f.id)} />)}
          </ul>
        </section>
      ))}
    </div>
  )
}
