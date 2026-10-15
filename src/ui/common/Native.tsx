import { useState } from 'react'
import { showsRomanization } from '../../lib/progress'
import { useProgress } from '../state/ProgressProvider'

interface NativeProps {
  text: string
  rom?: string
  /** Buttons cannot nest, so option tiles pass false and simply hide hidden romanization. */
  tappable?: boolean
  className?: string
}

/** Target-language text with its romanization, shown or tap-to-reveal per the learner's setting. */
export function Native({ text, rom, tappable = true, className = '' }: NativeProps) {
  const { progress } = useProgress()
  const [open, setOpen] = useState(false)
  const visible = showsRomanization(progress) || open
  return (
    <span className={`native-wrap ${className}`}>
      <span className="native" lang="mr">{text}</span>
      {rom && visible && <span className="rom">{rom}</span>}
      {rom && !visible && tappable && (
        <button type="button" className="rom-reveal" aria-label="Show romanization"
          onClick={() => setOpen(true)}>abc</button>
      )}
    </span>
  )
}
