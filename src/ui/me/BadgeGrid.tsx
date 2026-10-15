import { BADGES } from '../../config'
import { StarIcon } from '../common/Icons'

export function BadgeGrid({ earned }: { earned: Record<string, number> }) {
  return (
    <ul className="badge-grid">
      {BADGES.map((b) => (
        <li key={b.id} className={`badge${b.id in earned ? ' is-earned' : ''}`} title={b.description}>
          <StarIcon size={28} />
          <strong>{b.name}</strong>
          <span>{b.description}</span>
        </li>
      ))}
    </ul>
  )
}
