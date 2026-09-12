import { useEffect, useRef, useState } from 'react'

import { useMachine } from '@/machines/context'
import { Btn, Microlabel } from '@/shell/ui'
import {
  CORRESPONDENCE_EVENTS_FOR_COMPLETION,
  FEED_LINES,
  LINES,
  MONADS,
  correspondenceHolds,
  monadState,
  predictedNext,
  type MonadSpec,
} from './machine'
import './windows.css'

interface FeedEntry {
  id: number
  monad: 'A' | 'B' | 'C'
  text: string
  echoed: boolean
}

export default function Machine() {
  const api = useMachine()
  const [tick, setTick] = useState(0)
  const [perturbations, setPerturbations] = useState(0)
  const [events, setEvents] = useState(0)
  const [feed, setFeed] = useState<FeedEntry[]>([])
  const [note, setNote] = useState<string | null>(null)
  const [declared, setDeclared] = useState(false)
  const [transmitAttempts, setTransmitAttempts] = useState(0)
  const [transmitText, setTransmitText] = useState('')
  const [burst, setBurst] = useState(false)
  const feedId = useRef(0)

  /* the shared clock — each monad reads it privately */
  useEffect(() => {
    const interval = window.setInterval(() => setTick((t) => t + 1), 1600)
    return () => window.clearInterval(interval)
  }, [])

  /* ambient social feed — coordinated without any channel */
  useEffect(() => {
    if (declared) return
    const interval = window.setInterval(
      () => {
        const monad = (['A', 'B', 'C'] as const)[Math.floor(Math.random() * 3)]
        const pool = FEED_LINES[monad]
        const echoed = perturbations > 0 && monad === 'B' && Math.random() < 0.5
        const text = echoed ? FEED_LINES.B[0] : pool[Math.floor(Math.random() * pool.length)]
        setFeed((prev) =>
          [...prev, { id: ++feedId.current, monad, text, echoed }].slice(-6),
        )
        api.play('tick', 0.25)
      },
      5200,
    )
    return () => window.clearInterval(interval)
  }, [perturbations, declared, api])

  const states = {
    A: monadState(MONADS[0], tick),
    B: monadState(MONADS[1], tick),
    C: monadState(MONADS[2], tick),
  }
  const holds = correspondenceHolds(states.A, states.B, states.C)

  const perturb = (spec: MonadSpec) => {
    if (declared) return
    setPerturbations((p) => p + 1)
    setBurst(true)
    api.play('surveillance', 0.5)
    window.setTimeout(() => setBurst(false), 900)
    setNote(LINES.perturbed.replace('{X}', spec.id))
    setFeed((prev) =>
      [...prev, { id: ++feedId.current, monad: spec.id, text: '// INTERNAL DISBURBANCE // NO OUTBOUND SIGNAL //', echoed: false }].slice(-6),
    )
    /* the others enter their corresponding states on their next internal step */
    const nextEvents = events + 1
    setEvents(nextEvents)
    const t = window.setTimeout(() => {
      setNote(LINES.responded)
      api.play('recurrence', 0.4)
    }, 1800)
    if (nextEvents >= CORRESPONDENCE_EVENTS_FOR_COMPLETION) {
      window.setTimeout(() => setNote(LINES.declareAvailable.replace('{N}', String(nextEvents))), 3600)
    }
    return () => window.clearTimeout(t)
  }

  const declare = () => {
    setDeclared(true)
    api.play('complete', 0.6)
    api.complete('windows:harmony-observed')
  }

  const transmit = () => {
    const attempts = transmitAttempts + 1
    setTransmitAttempts(attempts)
    setTransmitText('')
    api.play('invalid', 0.6)
    setNote(LINES.transmissionFailed)
    if (attempts === 3) {
      api.secret('window-attempt', 'UR-008', 'WINDOW ATTEMPT')
    }
  }

  return (
    <div className="windows">
      <header className="windows__head">
        <Microlabel>MONADIC CONCORDANCE CHAMBER — READINGS ONLY</Microlabel>
        <span className={`windows__channels${holds ? '' : ' is-violated'}`}>
          CAUSAL CHANNELS: 0 · TRANSMITTED INFLUENCE EVENTS: 0
        </span>
      </header>

      <div className="windows__room">
        {MONADS.map((spec, index) => {
          const state = states[spec.id]
          const prediction = predictedNext(spec, tick)
          return (
            <section key={spec.id} className={`windows__monad${burst && spec.id === 'A' ? ' is-perturbed' : ''}`}>
              <header className="windows__monadhead">
                <Microlabel>MONAD {spec.id}</Microlabel>
                <span className="windows__principle">INTERNAL PRINCIPLE: ACTIVE</span>
              </header>
              <div className="windows__state">
                <span className="windows__statename">{state}</span>
                <span className="windows__predicted">
                  PREDICTED (OWN PRINCIPLE): {prediction}
                </span>
              </div>
              <button
                className="windows__perturb"
                onClick={() => perturb(spec)}
                disabled={declared}
              >
                PERTURB {spec.id}
              </button>
              {index === 0 && burst && <span className="windows__burst" aria-hidden="true" />}
            </section>
          )
        })}
      </div>

      <div className="windows__lower">
        <div className="windows__feed">
          <Microlabel>APPARENT CONVERSATION — TRANSMISSION CHANNELS: 0</Microlabel>
          <div className="windows__feedlist" aria-live="off">
            {feed.map((entry) => (
              <p key={entry.id} className={`windows__feedline windows__feedline--${entry.monad.toLowerCase()}`}>
                <b>{entry.monad}:</b> {entry.text}
                {entry.echoed && <em className="windows__echo"> ·ECHO·</em>}
              </p>
            ))}
            {feed.length === 0 && <p className="windows__feedline">THE MONADS HAVE NOT YET SPOKEN. THEY DO NOT NEED EACH OTHER TO.</p>}
          </div>
        </div>

        <div className="windows__direct">
          <Microlabel>DIRECT CHANNEL (EXPERIMENTAL — MONAD A → MONAD B)</Microlabel>
          <div className="windows__transmit">
            <input
              value={transmitText}
              onChange={(e) => setTransmitText(e.target.value)}
              placeholder="COMPOSE MESSAGE FOR MONAD B…"
              aria-label="Message for Monad B"
            />
            <Btn onClick={transmit} disabled={transmitText.trim() === ''}>
              TRANSMIT
            </Btn>
          </div>
          {declared ? (
            <p className="windows__note">{LINES.declared} {LINES.windowless}</p>
          ) : (
            <p className="windows__note">{note ?? 'THE INSTITUTE ADVISES AGAINST ATTEMPTING CONTACT.'}</p>
          )}
          {events >= CORRESPONDENCE_EVENTS_FOR_COMPLETION && !declared && (
            <Btn variant="primary" onClick={declare}>
              DECLARE CORRESPONDENCE PERFECT
            </Btn>
          )}
        </div>
      </div>
    </div>
  )
}
