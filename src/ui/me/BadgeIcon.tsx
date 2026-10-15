import { CheckCircleIcon, FlameIcon, FlowerIcon, StarIcon, TrophyIcon, type IconProps } from '../common/Icons'

type Icon = (p: IconProps) => JSX.Element

/** First matching id prefix wins; anything else gets the marigold flower. */
const BY_PREFIX: [string, Icon][] = [
  ['streak', FlameIcon], ['xp', StarIcon], ['checkpoint', TrophyIcon], ['unit', TrophyIcon], ['perfect', CheckCircleIcon],
]

export function BadgeIcon({ id, size = 34 }: { id: string; size?: number }) {
  const Icon = BY_PREFIX.find(([prefix]) => id.startsWith(prefix))?.[1] ?? FlowerIcon
  return <Icon size={size} />
}
