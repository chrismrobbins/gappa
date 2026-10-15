import { DAILY_GOALS } from '../../config'
import type { RomanizationMode, SpeechMode } from '../../types'
import { ChipGroup } from '../common/ChipGroup'
import { useProgress } from '../state/ProgressProvider'

const ROMAN: { value: RomanizationMode; label: string }[] = [
  { value: 'auto', label: 'Auto' }, { value: 'always', label: 'Always' }, { value: 'tap', label: 'Tap to show' },
]
const SPEECH: { value: SpeechMode; label: string }[] = [
  { value: 'auto', label: 'Auto' }, { value: 'browser', label: 'Browser' },
  { value: 'server', label: 'Server' }, { value: 'off', label: 'Off' },
]
const SPEECH_HELP: Record<SpeechMode, string> = {
  auto: 'Picks the best way to hear you on this device.',
  browser: 'Uses your browser to listen. Works best in desktop Chrome.',
  server: 'Records you and checks it online. Needs an account.',
  off: 'Skips speaking practice.',
}
const ROMAN_HELP: Record<RomanizationMode, string> = {
  auto: 'Shows the Latin spelling while you are new, then fades it out.',
  always: 'Always shows the Latin spelling.',
  tap: 'Hides it until you tap "abc".',
}

export function SettingsPanel() {
  const { progress, changeSettings } = useProgress()
  const s = progress.settings
  return (
    <section className="card settings">
      <h2>Settings</h2>
      <h3>Daily goal (XP)</h3>
      <ChipGroup label="Daily goal" value={s.dailyGoal} onChange={(dailyGoal) => changeSettings({ dailyGoal })}
        options={DAILY_GOALS.map((g) => ({ value: g, label: String(g) }))} />
      <h3>Romanization</h3>
      <ChipGroup label="Romanization" value={s.romanization} options={ROMAN} onChange={(romanization) => changeSettings({ romanization })} />
      <p className="muted">{ROMAN_HELP[s.romanization]}</p>
      <h3>Sound</h3>
      <ChipGroup label="Sound effects" value={s.sound ? 'on' : 'off'} onChange={(v) => changeSettings({ sound: v === 'on' })}
        options={[{ value: 'on', label: 'On' }, { value: 'off', label: 'Off' }]} />
      <h3>Speaking practice</h3>
      <ChipGroup label="Speaking practice" value={s.speech} options={SPEECH} onChange={(speech) => changeSettings({ speech })} />
      <p className="muted">{SPEECH_HELP[s.speech]}</p>
    </section>
  )
}
