import { BADGES } from '../../config'
import { BadgeIcon } from './BadgeIcon'

interface Badge { id: string; name: string; description: string }

/** A round medallion with the badge name under it: marigold when earned, cream when not. */
export function BadgeItem({ badge, earned }: { badge: Badge; earned: boolean }) {
  return (
    <li className={`badge${earned ? ' is-earned' : ''}`}>
      <span className={`medal${earned ? ' is-earned' : ''}`}><BadgeIcon id={badge.id} /></span>
      <strong>{badge.name}</strong>
      <span>{badge.description}</span>
    </li>
  )
}

export function BadgeGrid({ earned }: { earned: Record<string, number> }) {
  return (
    <ul className="badge-grid">
      {BADGES.map((b) => <BadgeItem key={b.id} badge={b} earned={b.id in earned} />)}
    </ul>
  )
}
