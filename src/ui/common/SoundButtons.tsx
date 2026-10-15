import { say } from '../../services/audio'
import { SpeakerIcon, TurtleIcon } from './Icons'

type Size = 'sm' | 'md' | 'lg'
const ICON_SIZE: Record<Size, number> = { sm: 22, md: 26, lg: 44 }

/** Replay and slow-replay buttons for a line of target text. */
export function SoundButtons({ text, size = 'sm' }: { text: string; size?: Size }) {
  const icon = ICON_SIZE[size]
  return (
    <span className={`sound-buttons size-${size}`}>
      <button type="button" className="sound-btn" aria-label="Play audio" onClick={() => say(text)}>
        <SpeakerIcon size={icon} />
      </button>
      <button type="button" className="sound-btn sound-btn-slow" aria-label="Play slowly" onClick={() => say(text, { slow: true })}>
        <TurtleIcon size={Math.round(icon * 0.8)} />
      </button>
    </span>
  )
}
