import { say } from '../../services/audio'
import { SpeakerIcon, TurtleIcon } from './Icons'

/** Replay and slow-replay buttons for a line of target text. */
export function SoundButtons({ text, large = false }: { text: string; large?: boolean }) {
  const cls = large ? 'icon-btn icon-btn-lg' : 'icon-btn'
  return (
    <span className="sound-buttons">
      <button type="button" className={cls} aria-label="Play audio" onClick={() => say(text)}>
        <SpeakerIcon size={large ? 32 : 22} />
      </button>
      <button type="button" className={cls} aria-label="Play slowly" onClick={() => say(text, { slow: true })}>
        <TurtleIcon size={large ? 32 : 22} />
      </button>
    </span>
  )
}
