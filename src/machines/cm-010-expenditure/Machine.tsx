import { useEffect, useRef, useState } from 'react'

import { useMachine } from '@/machines/context'
import { usePressable } from '@/interact/micro'
import { Btn, Microlabel } from '@/shell/ui'
import {
  CAPACITY_STEP,
  FORMS,
  FORMS_FOR_COMPLETION,
  INITIAL_STATE,
  INVEST_STEP,
  LINES,
  PRESSURE_FOR_COMPLETION,
  SATURATION_WARNING,
  type ExpenditureForm,
} from './machine'
import './expenditure.css'

interface EconomyState {
  surplus: number
  capacity: number
  production: number
  pressure: number
  glory: number
}

export default function Machine() {
  const api = useMachine()
  const [state, setState] = useState<EconomyState>({ ...INITIAL_STATE })
  const [log, setLog] = useState<string[]>([])
  const [performedForms, setPerformedForms] = useState<Set<string>>(new Set())
  const [completed, setCompleted] = useState(false)
  const [saturatingNoted, setSaturatingNoted] = useState(false)
  const expansions = useRef(0)

  /* production ticks */
  useEffect(() => {
    if (completed) return
    const interval = window.setInterval(() => {
      setState((prev) => {
        const surplus = Math.min(prev.capacity, prev.surplus + prev.production)
        const pressure = prev.pressure + prev.production * 0.05
        return { ...prev, surplus, pressure }
      })
    }, 900)
    return () => window.clearInterval(interval)
  }, [completed])

  const ratio = state.surplus / state.capacity

  useEffect(() => {
    if (ratio >= SATURATION_WARNING && !saturatingNoted) {
      setSaturatingNoted(true)
      setLog((l) => [LINES.saturating, ...l].slice(0, 8))
      api.play('warning', 0.5)
    }
    if (state.surplus >= state.capacity && ratio >= 1) {
      setLog((l) => [LINES.saturated, ...l].slice(0, 8))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- threshold notices
  }, [ratio, state.surplus])

  useEffect(() => {
    if (completed) return
    if (performedForms.size >= FORMS_FOR_COMPLETION && state.pressure >= PRESSURE_FOR_COMPLETION) {
      setCompleted(true)
      api.play('complete', 0.6)
      api.complete('expenditure:consumption-performed')
      setLog((l) => [LINES.complete, ...l].slice(0, 8))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- completion check
  }, [performedForms, state.pressure])

  const invest = () => {
    if (state.surplus < 10) {
      api.failure()
      return
    }
    setState((prev) => ({
      ...prev,
      surplus: prev.surplus - 10,
      production: prev.production * INVEST_STEP,
    }))
    api.play('activate', 0.5)
    setLog((l) => [LINES.invest, ...l].slice(0, 8))
  }

  const expand = () => {
    if (state.surplus < 15) {
      api.failure()
      return
    }
    expansions.current += 1
    setState((prev) => ({ ...prev, surplus: prev.surplus - 15, capacity: prev.capacity + CAPACITY_STEP }))
    api.play('toggle', 0.6)
    setLog((l) => [LINES.expand, ...l].slice(0, 8))
    if (expansions.current === 6) {
      api.secret('hoarding-pathology', 'UR-011', 'HOARDING PATHOLOGY')
    }
  }

  const spend = (form: ExpenditureForm) => {
    if (state.surplus < form.cost) {
      api.failure()
      return
    }
    setState((prev) => ({
      ...prev,
      surplus: prev.surplus - form.cost,
      production: Math.max(1, prev.production * (1 + form.productionDelta)),
      pressure: prev.pressure + form.pressureDelta,
      glory: prev.glory + form.glory,
    }))
    setPerformedForms((prev) => new Set(prev).add(form.id))
    api.play(form.id === 'war' ? 'invalid' : 'complete', 0.5)
    setLog((l) => [`${form.label} — ${form.consequence}`, ...l].slice(0, 8))
  }

  const saturation = ratio >= SATURATION_WARNING
  const pressurePct = Math.min(100, state.pressure)

  return (
    <div className={`expenditure${saturation ? ' is-saturated' : ''}`}>
      <header className="expenditure__head">
        <Microlabel>HOUSEHOLD OF RESTRICTED MEANS — GENERAL ACCOUNTING BENEATH</Microlabel>
      </header>

      <div className="expenditure__gauges">
        <Gauge label="SURPLUS" value={`${state.surplus.toFixed(0)} / ${state.capacity}`} pct={(ratio * 100).toFixed(0)} alert={saturation} />
        <Gauge label="PRODUCTION" value={`${state.production.toFixed(1)}/tick`} pct={String(Math.min(100, state.production * 8))} alert={false} />
        <Gauge label="GLORY" value={state.glory.toFixed(0)} pct={String(Math.min(100, state.glory / 2))} alert={false} />
        <Gauge label="PRESSURE (GENERAL)" value={`${state.pressure.toFixed(0)}`} pct={String(pressurePct)} alert={state.pressure > 50} />
      </div>

      <div className="expenditure__actions">
        <div className="expenditure__restricted">
          <Microlabel>RESTRICTED ECONOMY (WHAT WORKS, WORKS)</Microlabel>
          <div className="expenditure__row">
            <Btn onClick={invest} disabled={completed}>
              INVEST (−10)
            </Btn>
            <Btn onClick={expand} disabled={completed}>
              EXPAND STORAGE (−15)
            </Btn>
          </div>
        </div>

        <div className={`expenditure__general${saturation ? ' is-open' : ''}`}>
          <Microlabel signal>GENERAL ECONOMY (WHAT MUST BE CONSUMED)</Microlabel>
          <div className="expenditure__forms">
            {FORMS.map((form) => (
              <SpendButton key={form.id} form={form} disabled={completed} onSpend={() => spend(form)} />
            ))}
          </div>
        </div>
      </div>

      <div className="expenditure__log" aria-live="polite">
        {log.map((line, i) => (
          <p key={`${line}-${i}`} className="expenditure__logline">
            {line}
          </p>
        ))}
      </div>
    </div>
  )
}

function SpendButton({ form, disabled, onSpend }: { form: ExpenditureForm; disabled: boolean; onSpend: () => void }) {
  const props = usePressable({ sfx: false, disabled })
  return (
    <button className={`expenditure__form expenditure__form--${form.id}`} {...props} onClick={onSpend} disabled={disabled}>
      <span className="expenditure__formlabel">{form.label}</span>
      <span className="expenditure__formcost">−{form.cost}</span>
      <span className="expenditure__formeffect">{form.consequence}</span>
    </button>
  )
}

function Gauge({ label, value, pct, alert }: { label: string; value: string; pct: string; alert: boolean }) {
  return (
    <div className={`expenditure__gauge${alert ? ' is-alert' : ''}`}>
      <Microlabel>{label}</Microlabel>
      <span className="expenditure__gaugevalue">{value}</span>
      <div className="expenditure__gaugebar">
        <div className="expenditure__gaugefill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
