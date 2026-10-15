import type { ReactNode } from 'react'
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

function Row(props: { label: string; help?: string; children: ReactNode }) {
  return (
    <div className="setting-row">
      <h3>{props.label}</h3>
      {props.children}
      {props.help && <p className="muted setting-help">{props.help}</p>}
    </div>
  )
}

export function SettingsPanel() {
  const { progress, changeSettings } = useProgress()
  const s = progress.settings
  return (
    <section className="stack">
      <h2 className="section-title">Settings</h2>
      <div className="card settings">
        <Row label="Daily goal (XP)">
          <ChipGroup label="Daily goal" value={s.dailyGoal} onChange={(dailyGoal) => changeSettings({ dailyGoal })}
            options={DAILY_GOALS.map((g) => ({ value: g, label: String(g) }))} />
        </Row>
        <Row label="Romanization" help={ROMAN_HELP[s.romanization]}>
          <ChipGroup label="Romanization" value={s.romanization} options={ROMAN} onChange={(romanization) => changeSettings({ romanization })} />
        </Row>
        <Row label="Sound">
          <ChipGroup label="Sound effects" value={s.sound ? 'on' : 'off'} onChange={(v) => changeSettings({ sound: v === 'on' })}
            options={[{ value: 'on', label: 'On' }, { value: 'off', label: 'Off' }]} />
        </Row>
        <Row label="Speaking practice" help={SPEECH_HELP[s.speech]}>
          <ChipGroup label="Speaking practice" value={s.speech} options={SPEECH} onChange={(speech) => changeSettings({ speech })} />
        </Row>
      </div>
    </section>
  )
}
