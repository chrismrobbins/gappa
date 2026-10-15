import { useState } from 'react'
import { VOICES } from '../../config'
import { sayWithVoice } from '../../services/audio'
import { SpeakerIcon } from '../common/Icons'

/** One play button per recorded voice, so a teacher can hear each one. */
export function VoiceButtons({ text }: { text: string }) {
  const [missing, setMissing] = useState('')
  const play = (id: string, name: string) => setMissing(sayWithVoice(text, id) ? '' : `${name} has not recorded this line yet.`)
  return (
    <div className="voice-buttons">
      {VOICES.map((v) => (
        <button key={v.id} type="button" className="chip voice-btn" aria-label={`Play ${v.name}`} onClick={() => play(v.id, v.name)}>
          <SpeakerIcon size={18} /> {v.name}
        </button>
      ))}
      <span className="muted" role="status" aria-live="polite">{missing}</span>
    </div>
  )
}
