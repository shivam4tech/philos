import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useMachine } from '@/machines/context'
import { usePressable, useFx, fireFx } from '@/interact/micro'
import { Btn, Microlabel } from '@/shell/ui'
import {
  EARLY_IDLE_NOTE_MS,
  LOG_LINES,
  NEED_CATALOG,
  RELIEF_DECAY_PER_TICK,
  RELIEF_PER_SATISFY,
  SATISFACTION_CEILING,
  STILLNESS_THRESHOLD_MS,
  nextNeed,
  spawnIntervalMs,
  stageFor,
  type NeedDef,
} from './machine'
import './will.css'

interface NeedInstance {
  key: number
  def: NeedDef
  bornAt: number
}

export default function Machine() {
  const api = useMachine()
  const [needs, setNeeds] = useState<NeedInstance[]>([])
  const [relief, setRelief] = useState(0)
  const [satisfied, setSatisfied] = useState(0)
  const [log, setLog] = useState<string[]>([])
  const [endSessionPressed, setEndSessionPressed] = useState(0)
  const [stillness, setStillness] = useState(false)
  const [cessationDone, setCessationDone] = useState(false)
  const [idleNoted, setIdleNoted] = useState(false)

  const lastSatisfyAt = useRef(Date.now())
  const stage = stageFor(satisfied)
  const keyRef = useRef(0)
  const [meterRef] = useFx<HTMLDivElement>()

  /* DESIRE CONTAMINATION (Schopenhauer × Lacan): need / demand / desire */
  const contaminated = api.contaminantId === 'cm-002-desire'
  const [demandMeter, setDemandMeter] = useState(0)
  const [received, setReceived] = useState(0)

  /* initial need */
  useEffect(() => {
    setNeeds([{ key: ++keyRef.current, def: NEED_CATALOG[0], bornAt: Date.now() }])
    setLog(['THE ENGINE PRESENTS ITS FIRST DEFICIENCY.'])
  }, [])

  /* decay + stillness + idle observation */
  useEffect(() => {
    const interval = window.setInterval(() => {
      setRelief((r) => Math.max(0, r - RELIEF_DECAY_PER_TICK))
      const now = Date.now()
      if (!cessationDone && !stillness && satisfied >= 8 && now - lastSatisfyAt.current > STILLNESS_THRESHOLD_MS) {
        setStillness(true)
        api.play('power-off', 0.8)
      }
      if (!idleNoted && !stillness && satisfied < 4 && now - lastSatisfyAt.current > EARLY_IDLE_NOTE_MS) {
        setIdleNoted(true)
        setLog((l) => [LOG_LINES.idleNote, ...l].slice(0, 7))
      }
    }, 180)
    return () => window.clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- satisfied/stillness gates read via closure per render
  }, [satisfied, stillness, cessationDone, idleNoted])

  /* stillness sequence: needs close themselves, meter empties */
  useEffect(() => {
    if (!stillness || cessationDone) return
    const timers: number[] = []
    for (let i = 0; i < LOG_LINES.stillness.length; i++) {
      timers.push(
        window.setTimeout(() => {
          setLog((l) => [LOG_LINES.stillness[i], ...l].slice(0, 7))
          api.play('tick', 0.5)
        }, 1600 * (i + 1)),
      )
    }
    timers.push(
      window.setTimeout(
        () => {
          setNeeds((prev) => prev.slice(0, Math.max(0, prev.length - 2)))
        },
        1700,
      ),
      window.setTimeout(() => setNeeds([]), 3400),
      window.setTimeout(() => setRelief(0), 4200),
      window.setTimeout(() => {
        setCessationDone(true)
        api.play('complete', 0.7)
        api.complete('will:cessation')
        api.counter('satisfactions', Math.max(0, satisfied))
      }, 5600),
    )
    return () => timers.forEach((t) => window.clearTimeout(t))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire the sequence once
  }, [stillness])

  const satisfy = useCallback(
    (need: NeedInstance) => {
      if (stillness) return
      lastSatisfyAt.current = Date.now()
      const kind = needKind(need.key)

      if (contaminated) {
        /* DESIRE: the object is received; the variable does not decrease */
        if (kind === 'desire') {
          setReceived((r) => {
            const next = r + 1
            if (next === 3) {
              setLog((l) => ['YOU RECEIVED THE OBJECT. WHY HAS THE VARIABLE NOT DECREASED?', ...l].slice(0, 7))
            }
            if (next >= 5 && !completionFired.current) {
              completionFired.current = true
              api.complete('will:contaminated-session')
            }
            return next
          })
          setLog((l) => [`OBJECT RECEIVED (${need.def.label}). DISPLACEMENT PERSISTS.`, ...l].slice(0, 7))
          api.play('contradiction', 0.5)
          return
        }
        if (kind === 'demand') {
          setDemandMeter((d) => Math.min(100, d + 30))
          setLog((l) => ['THE DEMAND WAS SATISFIED. THE DEMAND HAS RISEN.', ...l].slice(0, 7))
          api.play('invalid', 0.4)
        }
      }

      setNeeds((prev) => (kind === 'desire' && contaminated ? prev : prev.filter((n) => n.key !== need.key)))
      setSatisfied((s) => {
        const next = s + 1
        const nextStage = stageFor(next)
        if (nextStage > stage) {
          setLog((l) => [LOG_LINES.stage[Math.min(nextStage - 2, LOG_LINES.stage.length - 1)], ...l].slice(0, 7))
          api.play('contradiction', 0.4)
        }
        return next
      })
      setRelief((r) => {
        const target = Math.min(100, r + (contaminated && kind === 'demand' ? 8 : RELIEF_PER_SATISFY))
        fireFx(meterRef.current, 'pulse')
        return target
      })
      setLog((l) => [`${need.def.label} — ${LOG_LINES.satisfy[Math.floor(Math.random() * LOG_LINES.satisfy.length)]}`, ...l].slice(0, 7))
      api.play('click', 0.9)
      api.counter('satisfactions')
      window.setTimeout(
        () => {
          setNeeds((prev) => {
            if (stillness || prev.length > 0) return prev
            const def = nextNeed(satisfiedRef.current, need.def.id)
            return [...prev, { key: ++keyRef.current, def, bornAt: Date.now() }]
          })
        },
        Math.max(350, 1400 - stage * 260),
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- stage/satisfied read live via refs
    [stage, stillness, contaminated],
  )

  const satisfiedRef = useRef(satisfied)
  const completionFired = useRef(false)
  useEffect(() => {
    satisfiedRef.current = satisfied
  }, [satisfied])

  /* contamination: needs cycle through NEED / DEMAND / DESIRE by key */
  function needKind(key: number): 'need' | 'demand' | 'desire' {
    if (!contaminated) return 'need'
    return (['need', 'demand', 'desire'] as const)[key % 3]
  }

  /* spontaneous want generation at the top end */
  useEffect(() => {
    const interval = spawnIntervalMs(stage, satisfied)
    if (!interval || stillness) return
    const id = window.setInterval(() => {
      setNeeds((prev) => {
        if (prev.length >= 5) return prev
        const def = nextNeed(satisfiedRef.current, prev[prev.length - 1]?.def.id ?? null)
        api.play('tick', 0.35)
        return [...prev, { key: ++keyRef.current, def, bornAt: Date.now() }]
      })
    }, interval)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- interval follows stage
  }, [stage, satisfied, stillness])

  const endSession = () => {
    const press = endSessionPressed + 1
    setEndSessionPressed(press)
    setLog((l) => [LOG_LINES.endSession, ...l].slice(0, 7))
    api.play('warning')
    if (press === 3) {
      api.secret('will-exit-loop', 'UR-003', 'THE EXIT THAT WASN’T')
    }
  }

  const satisfactionIndex = useMemo(
    () => Math.min(SATISFACTION_CEILING, Math.round((relief / 100) * SATISFACTION_CEILING * 3)),
    [relief],
  )

  if (cessationDone) {
    return (
      <div className="will will--still">
        <div className="will__stillness">
          <Microlabel>APPARATUS CM-001 — SESSION RECORD</Microlabel>
          <h2>THE WILL IS STILL.</h2>
          <p className="will__stillline">
            {satisfied} NEEDS WERE SATISFIED. NONE OF THE SATISFACTIONS REMAIN.
            <br />
            THE STRIVING CEASED WHEN NOTHING OPPOSED IT.
          </p>
          <p className="will__stillline will__stillline--dim">
            THE ENGINE REMAINS OPERATIONAL. IT WAITS, WHICH IS ALL AN ENGINE CAN DO.
          </p>
        </div>
      </div>
    )
  }

  if (stillness) {
    return (
      <div className="will will--stillness">
        <div className="will__grid will__grid--fading" aria-hidden="true">
          {needs.map((n) => (
            <div key={n.key} className="will__need will__need--fading">
              <span className="will__needlabel">{n.def.label}</span>
            </div>
          ))}
        </div>
        <div className="will__stillnesslive">
          <Microlabel signal>REFRAINING DETECTED</Microlabel>
          <div className="will__log">
            {log.map((line, i) => (
              <p key={`${line}-${i}`} className="will__logline">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`will will--stage${stage}`}>
      <div className="will__hud">
        <div className="will__meterblock" ref={meterRef}>
          <Microlabel>RELIEF</Microlabel>
          <div className="will__meter">
            <div className="will__meterfill" style={{ width: `${relief}%` }} />
          </div>
        </div>
        <div className="will__meterblock">
          <Microlabel>SATISFACTION INDEX</Microlabel>
          <span className="will__bigvalue">
            {satisfactionIndex}%
            {satisfactionIndex >= SATISFACTION_CEILING && <em className="will__ceiling"> CEILING</em>}
          </span>
        </div>
        <div className="will__meterblock">
          <Microlabel>NEEDS SATISFIED</Microlabel>
          <span className="will__bigvalue">{satisfied}</span>
        </div>
        {stage >= 4 && (
          <div className="will__meterblock">
            <Microlabel>WANT GENERATOR</Microlabel>
            <span className="will__bigvalue">
              {(1000 / (spawnIntervalMs(stage, satisfied) ?? 4500)).toFixed(2)} wants/s
            </span>
          </div>
        )}
      </div>

      <div className={`will__grid will__grid--stage${stage}`}>
        {needs.map((need) => (
          <NeedPanel
            key={need.key}
            need={need}
            kind={contaminated ? needKind(need.key) : undefined}
            onSatisfy={() => satisfy(need)}
          />
        ))}
        {needs.length === 0 && <p className="will__empty">GENERATING DEFICIENCY…</p>}
      </div>

      {contaminated && (
        <div className="will__lacan">
          <div className="will__meterblock">
            <Microlabel>NEED</Microlabel>
            <span className="will__bigvalue">FLUCTUATING</span>
          </div>
          <div className="will__meterblock">
            <Microlabel>DEMAND</Microlabel>
            <span className="will__bigvalue will__bigvalue--alert">{demandMeter}%</span>
          </div>
          <div className="will__meterblock">
            <Microlabel>DESIRE</Microlabel>
            <span className="will__bigvalue">STRUCTURAL</span>
          </div>
          <div className="will__meterblock">
            <Microlabel>OBJECTS RECEIVED</Microlabel>
            <span className="will__bigvalue">{received}</span>
          </div>
        </div>
      )}

      <div className="will__footer">
        <div className="will__log" aria-live="polite">
          {log.map((line, i) => (
            <p key={`${line}-${i}`} className="will__logline">
              {line}
            </p>
          ))}
        </div>
        <Btn variant={endSessionPressed === 0 ? 'default' : 'ghost'} onClick={endSession}>
          END SESSION
        </Btn>
      </div>
    </div>
  )
}

function NeedPanel({
  need,
  kind,
  onSatisfy,
}: {
  need: NeedInstance
  kind?: 'need' | 'demand' | 'desire'
  onSatisfy: () => void
}) {
  const props = usePressable({ sfx: false })
  const age = (Date.now() - need.bornAt) / 1000
  const intensity = Math.min(1, 0.4 + age * 0.12)
  return (
    <button
      className={`will__need${kind === 'desire' ? ' will__need--desire' : ''}`}
      style={{ opacity: 0.55 + intensity * 0.45 }}
      {...props}
      onClick={onSatisfy}
    >
      <span className="will__needlabel">{need.def.label}</span>
      <span className="will__needsatisfy">
        {kind === 'desire' ? '[ RECEIVE OBJECT ]' : '[ SATISFY ]'}
      </span>
    </button>
  )
}
