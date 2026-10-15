import type { ProfileRow, Role } from '../../types'
import { useProgress } from '../state/ProgressProvider'
import { BackBar } from './BackBar'
import { useProfiles } from './useProfiles'

const CHANGE: Record<Role, { to: Role; label: string } | null> = {
  learner: { to: 'teacher', label: 'Make teacher' },
  teacher: { to: 'learner', label: 'Make learner' },
  admin: null,
}

function PersonRow({ person, isMe, onChange }: { person: ProfileRow; isMe: boolean; onChange(role: Role): void }) {
  const action = isMe ? null : CHANGE[person.role]
  return (
    <li className="card person-row">
      <strong>{person.username}</strong>
      <span className={`role-chip role-${person.role}`}>{person.role}</span>
      {action && (
        <button type="button" className="chip" aria-label={`${action.label}: ${person.username}`}
          onClick={() => onChange(action.to)}>{action.label}</button>
      )}
    </li>
  )
}

export function TeachersScreen({ onBack }: { onBack(): void }) {
  const { username } = useProgress()
  const { profiles, error, change } = useProfiles()
  return (
    <div className="screen">
      <BackBar title="Teachers" onBack={onBack} />
      <p className="muted">Teachers can review every lesson line and flag fixes.</p>
      {error && <p className="form-error" role="alert">{error}</p>}
      <ul className="review-list">
        {profiles.map((p) => (
          <PersonRow key={p.id} person={p} isMe={p.username === username} onChange={(role) => void change(p.username, role)} />
        ))}
      </ul>
    </div>
  )
}
