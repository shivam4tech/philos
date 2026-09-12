import { useEffect, useRef, useState } from 'react'

import { useMachine } from '@/machines/context'
import { Microlabel } from '@/shell/ui'
import { PENALTY_MS, REVEAL_INTERVAL_MS, REVELATIONS, RESUME_AFTER_IDLE_MS } from './machine'
import './attention.css'

export default function Machine() {
  const api = useMachine()
  const [revealed, setRevealed] = useState(0)
  const [interrupted, setInterrupted] = useState(0)
  const [completed, setCompleted] = useState(false)
  const penaltyUntil = useRef(0)
  const resumedAt = useRef(0)

  /* revelation loop: only while unmanipulated */
  useEffect(() => {
    if (completed) return
    const interval = window.setInterval(() => {
      const now = Date.now()
      if (penaltyUntil.current > now) return
      if (now - resumedAt.current < RESUME_AFTER_IDLE_MS) return
      setRevealed((n) => {
        if (n >= REVELATIONS.length) return n
        api.play('tick', 0.25)
        return n + 1
      })
    }, REVEAL_INTERVAL_MS)
    return () => window.clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- revelations once
  }, [completed])

  useEffect(() => {
    if (revealed >= REVELATIONS.length && !completed) {
      setCompleted(true)
      api.play('complete', 0.5)
      api.complete('attention:stillness-held')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- completion once
  }, [revealed])

  const interrupt = () => {
    penaltyUntil.current = Date.now() + PENALTY_MS
    setInterrupted((n) => n + 1)
    api.play('invalid', 0.25)
  }

  return (
    <div
      className="attention"
      onPointerDown={interrupt}
      onWheel={interrupt}
      role="presentation"
    >
      <header className="attention__head">
        <Microlabel>MINOR APPARATUS MA-04 — STILL ROOM</Microlabel>
        <span className="attention__meta">REVELATIONS: {revealed}/{REVELATIONS.length} · INTERRUPTIONS: {interrupted}</span>
      </header>

      <div className="attention__body">
        <svg viewBox="0 0 200 200" className={`attention__object${revealed > 0 ? ' is-turning' : ''}`} role="img" aria-label="The object under attention">
          <circle cx="100" cy="100" r="58" fill="none" stroke="var(--line-strong)" />
          <circle cx="100" cy="100" r="34" fill="none" stroke="var(--amber-dim)" strokeDasharray="4 8" />
          <polygon
            points="100,58 138,124 62,124"
            fill="none"
            stroke="var(--text-dim)"
            strokeWidth="1"
          />
          <circle cx="100" cy="100" r="3" fill="var(--amber)" />
        </svg>

        <div className="attention__lines" aria-live="polite">
          {REVELATIONS.slice(0, revealed).map((line, i) => (
            <p key={line} className={`attention__line${i === revealed - 1 ? ' is-current' : ''}`}>
              {line}
            </p>
          ))}
          {revealed === 0 && (
            <p className="attention__line is-current">
              DO NOTHING. HOLD STILL. ATTEND. THE APPARATUS REVEALS ITSELF ONLY TO THE UNMANIPULATING.
            </p>
          )}
        </div>

        {revealed < REVELATIONS.length && interrupted > 0 && (
          <p className="attention__penalty">MANIPULATION DETECTED. THE OBJECT WITHDRAWS FOR A MOMENT.</p>
        )}
      </div>
    </div>
  )
}
