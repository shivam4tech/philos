import type { ReducedMotionSetting } from '@/state/persistence'
import {
  useSettings,
  patchSettings,
  setReducedMotion,
  setReducedSensory,
  setMuted,
} from '@/state/settings'
import { audio } from '@/audio/engine'
import { institution } from '@/institution/engine'
import { pushTicker } from '@/state/lab'
import { Microlabel } from './ui'
import { RecordDataControls } from './RecordDataControls'
import { usePressable } from '@/interact/micro'
import './settingspage.css'

export function SettingsPanel() {
  const settings = useSettings()

  const onVolume = (key: 'master' | 'ambience' | 'interaction') => (value: number) => {
    patchSettings({ [key]: value })
  }

  return (
    <div className="page settings">
      <header className="page-head">
        <Microlabel>Facility configuration — applied immediately, persisted locally</Microlabel>
        <h1>SETTINGS</h1>
      </header>

      <section className="settings__section">
        <h2 className="settings__title">AUDIO</h2>
        <div className="settings__rows">
          <Slider
            label="MASTER VOLUME"
            value={settings.master}
            onChange={onVolume('master')}
          />
          <Slider
            label="AMBIENCE"
            value={settings.ambience}
            onChange={onVolume('ambience')}
          />
          <Slider
            label="INTERACTION"
            value={settings.interaction}
            onChange={onVolume('interaction')}
          />
          <ToggleRow
            label="MUTE"
            hint="Instant. The apparatus will continue to make noise conceptually."
            checked={settings.muted}
            onChange={(checked) => {
              setMuted(checked)
              if (!checked) audio.play('toggle')
              const message = institution.emit('audio-muted')
              if (message && checked) pushTicker(message)
            }}
          />
        </div>
      </section>

      <section className="settings__section">
        <h2 className="settings__title">SENSORY</h2>
        <div className="settings__rows">
          <RadioRow
            label="REDUCED MOTION"
            value={settings.reducedMotion}
            options={[
              { value: 'auto', label: 'FOLLOW SYSTEM' },
              { value: 'on', label: 'ALWAYS ON' },
              { value: 'off', label: 'OFF' },
            ]}
            onChange={(value) => {
              setReducedMotion(value as ReducedMotionSetting)
              const message = institution.emit('reduced-motion')
              if (message && value === 'on') pushTicker(message)
            }}
          />
          <ToggleRow
            label="REDUCED SENSORY"
            hint="Softens volume, suppresses rare loud events. Interactions stay tactile."
            checked={settings.reducedSensory}
            onChange={setReducedSensory}
          />
        </div>
        <p className="settings__note">
          ACCESSIBILITY CONTROLS ARE NEVER PART OF AN EXPERIMENT. THEY WILL NOT FAIL,
          HIDE, OR MISLEAD, REGARDLESS OF WHAT ELSE IN THIS FACILITY DOES.
        </p>
      </section>

      <section className="settings__section">
        <h2 className="settings__title">RESEARCH RECORD DATA</h2>
        <RecordDataControls />
      </section>
    </div>
  )
}

function Slider({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <label className="settings__slider">
      <span className="settings__label">{label}</span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className="settings__value">{Math.round(value * 100)}%</span>
    </label>
  )
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  const props = usePressable({ sfx: false })
  return (
    <div className="settings__row">
      <div className="settings__rowtext">
        <span className="settings__label">{label}</span>
        <span className="settings__hint">{hint}</span>
      </div>
      <button
        className={`settings__toggle${checked ? ' is-on' : ''}`}
        role="switch"
        aria-checked={checked}
        {...props}
        onClick={() => {
          onChange(!checked)
          audio.play('toggle')
        }}
      >
        {checked ? 'ON' : 'OFF'}
      </button>
    </div>
  )
}

function RadioRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  return (
    <div className="settings__row">
      <div className="settings__rowtext">
        <span className="settings__label">{label}</span>
      </div>
      <div className="settings__radios" role="radiogroup" aria-label={label}>
        {options.map((option) => (
          <button
            key={option.value}
            role="radio"
            aria-checked={value === option.value}
            className={`settings__radio${value === option.value ? ' is-active' : ''}`}
            onClick={() => {
              onChange(option.value)
              audio.play('tick')
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
