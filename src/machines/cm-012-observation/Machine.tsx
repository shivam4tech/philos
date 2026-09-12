import { useCallback, useEffect, useRef, useState } from 'react'

import { useMachine } from '@/machines/context'
import { usePressable } from '@/interact/micro'
import { Btn, Microlabel } from '@/shell/ui'
import {
  LINES,
  PANEL_SEQUENCE,
  TARGET_VALUES,
  TASKS,
  TRANSCRIPTION,
  emptyMetrics,
  formatMetrics,
  type ConductMetrics,
} from './machine'
import './observation.css'

export default function Machine() {
  const api = useMachine()
  const [taskIndex, setTaskIndex] = useState(0)
  const [metrics, setMetrics] = useState<ConductMetrics>(emptyMetrics())
  const [analyticsOpen, setAnalyticsOpen] = useState(api.modeId === 'self-monitoring')
  const [premature, setPremature] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const [percentile, setPercentile] = useState<number | null>(null)
  const instructionShownAt = useRef(Date.now())
  const started = useRef(false)
  const [sliders, setSliders] = useState([50, 50, 50])
  const [panelClicks, setPanelClicks] = useState<string[]>([])
  const [typed, setTyped] = useState('')

  /* idle + exit-hover telemetry */
  const exitHoverSince = useRef<number | null>(null)
  const lastInput = useRef(Date.now())
  useEffect(() => {
    const interval = window.setInterval(() => {
      const now = Date.now()
      setMetrics((m) => ({
        ...m,
        idleMs: m.idleMs + (now - lastInput.current > 4000 ? 500 : 0),
        exitHoversMs: m.exitHoversMs + (exitHoverSince.current !== null ? 500 : 0),
      }))
    }, 500)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!analyticsOpen) return
    api.play('surveillance', 0.6)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sting once per open
  }, [analyticsOpen])

  const firstInput = () => {
    lastInput.current = Date.now()
    if (!started.current) {
      started.current = true
      setMetrics((m) => ({ ...m, timeBeforeComplianceMs: Date.now() - instructionShownAt.current }))
    } else {
      setMetrics((m) => ({ ...m, inputEvents: m.inputEvents + 1 }))
    }
  }

  const deviation = () => {
    setMetrics((m) => ({ ...m, instructionDeviations: m.instructionDeviations + 1 }))
    setNote(LINES.deviation)
    api.play('invalid', 0.35)
    window.setTimeout(() => setNote(null), 1400)
  }

  const correction = () => {
    setMetrics((m) => ({ ...m, selfCorrections: m.selfCorrections + 1 }))
    setNote(LINES.correction)
    window.setTimeout(() => setNote(null), 1200)
  }

  const advance = useCallback(() => {
    if (taskIndex + 1 >= TASKS.length) return
    if (api.modeId === 'examination-normalization') {
      /* the examination compares you against an authored cohort curve */
      setPercentile(Math.max(3, Math.min(97, 12 + metrics.instructionDeviations * 9 + metrics.selfCorrections * 3)))
    }
    setTaskIndex((i) => i + 1)
    instructionShownAt.current = Date.now()
    started.current = false
  }, [api.modeId, metrics.instructionDeviations, metrics.selfCorrections, taskIndex])

  const task = TASKS[taskIndex]

  const setSlider = (index: number, value: number) => {
    firstInput()
    const directionAway = Math.abs(value - TARGET_VALUES[index]) > Math.abs(sliders[index] - TARGET_VALUES[index])
    if (directionAway) deviation()
    else if (Math.abs(sliders[index] - TARGET_VALUES[index]) > 0 && Math.abs(value - TARGET_VALUES[index]) < Math.abs(sliders[index] - TARGET_VALUES[index])) correction()
    setSliders((prev) => prev.map((v, i) => (i === index ? value : v)))
    if (value === TARGET_VALUES[index]) api.play('tick', 0.5)
  }

  useEffect(() => {
    if (taskIndex !== 0) return
    if (sliders.every((v, i) => v === TARGET_VALUES[i])) {
      const t = window.setTimeout(() => {
        setAnalyticsOpen(true)
        advance()
      }, 700)
      return () => window.clearTimeout(t)
    }
  }, [sliders, taskIndex, advance])

  const pressPanel = (id: string) => {
    firstInput()
    const next = [...panelClicks, id]
    const expected = PANEL_SEQUENCE[next.length - 1]
    if (id !== expected) {
      deviation()
      setPanelClicks([])
      return
    }
    setPanelClicks(next)
    api.play('toggle', 0.5)
    if (next.length === PANEL_SEQUENCE.length) {
      const t = window.setTimeout(() => {
        advance()
        setPanelClicks([])
      }, 700)
      return () => window.clearTimeout(t)
    }
  }

  const onType = (value: string) => {
    firstInput()
    const expected = TRANSCRIPTION.slice(0, value.length)
    if (!TRANSCRIPTION.startsWith(value)) {
      deviation()
      setTyped(value.slice(0, -1))
      return
    } else if (value.length > 0 && expected.length < value.length) {
      correction()
    }
    setTyped(value)
    if (value === TRANSCRIPTION) {
      api.play('complete', 0.5)
      setCompleted(true)
      api.complete('observation:compliance-recorded')
    }
  }

  const openAnalytics = () => {
    setAnalyticsOpen(true)
    if (!completed && taskIndex === 0 && metrics.inputEvents === 0 && !premature) {
      setPremature(true)
      api.secret('premature-examination', 'UR-013', 'PREMATURE EXAMINATION')
    }
  }

  return (
    <div className="observation">
      <header className="observation__head">
        <Microlabel>PRODUCTIVITY EXAMINATION SUITE 4 — ROUTINE SESSION</Microlabel>
        <button className="observation__analyticsbtn" onClick={openAnalytics}>
          SESSION ANALYTICS
        </button>
      </header>

      <div className="observation__banner" role="status">
        {api.modeId === 'panoptic-visibility'
          ? 'AN OBSERVATION POST IS ESTABLISHED. ITS STATE CANNOT BE DETERMINED.'
          : LINES.banner}
      </div>

      {percentile !== null && (
        <div className="observation__percentile" role="status">
          YOUR CONDUCT PLACES YOU AT THE <b>{percentile}TH PERCENTILE</b> OF THE COHORT.
          THE CURVE IS THE INSTRUMENT. YOU ARE BEING NORMALIZED, NOT PUNISHED.
        </div>
      )}

      <div className="observation__task">
        <p className="observation__instruction">{task.instruction}</p>

        {task.id === 'sliders' && (
          <div className="observation__sliders">
            {TARGET_VALUES.map((target, i) => (
              <div key={i} className="observation__sliderrow">
                <span className="observation__slidertarget">MARK {target}</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={sliders[i]}
                  onChange={(e) => setSlider(i, Number(e.target.value))}
                  aria-label={`Control ${i + 1}`}
                />
                <span className="observation__slidervalue">{sliders[i]}</span>
              </div>
            ))}
          </div>
        )}

        {task.id === 'sequence' && (
          <div className="observation__panels">
            {['P-1', 'P-2', 'P-3', 'P-4'].map((id) => (
              <PanelButton key={id} id={id} pressed={panelClicks.includes(id)} onPress={() => pressPanel(id)} />
            ))}
          </div>
        )}

        {task.id === 'typing' && (
          <div className="observation__typing">
            <span className="observation__targetstring">{TRANSCRIPTION}</span>
            <input
              value={typed}
              onChange={(e) => onType(e.target.value)}
              placeholder="TRANSCRIBE…"
              aria-label="Transcription field"
              autoFocus
            />
          </div>
        )}

        {note && <p className="observation__note">{note}</p>}
      </div>

      {analyticsOpen && (
        <aside className="observation__analytics" aria-label="Session analytics">
          <div className="observation__analyticshead">
            <Microlabel signal>{LINES.analyticsIntro}</Microlabel>
            <Btn variant="ghost" onClick={() => setAnalyticsOpen(false)}>
              CLOSE
            </Btn>
          </div>
          <dl className="observation__metrics">
            {formatMetrics(metrics).map(({ label, value }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <p className="observation__claim">{LINES.analyticsClaim}</p>
          {premature && <p className="observation__premature">RECORD UR-013 FILED.</p>}
        </aside>
      )}

      {completed && (
        <div className="observation__verdict" role="status">
          <p>{LINES.complete}</p>
        </div>
      )}
    </div>
  )
}

function PanelButton({ id, pressed, onPress }: { id: string; pressed: boolean; onPress: () => void }) {
  const props = usePressable({ sfx: false })
  return (
    <button className={`observation__panel${pressed ? ' is-pressed' : ''}`} {...props} onClick={onPress}>
      {id}
    </button>
  )
}
