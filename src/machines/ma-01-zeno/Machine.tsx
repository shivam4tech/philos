import { useEffect, useRef, useState } from 'react'

import { useMachine } from '@/machines/context'
import { Btn, Microlabel } from '@/shell/ui'
import { DECLARATION, TOTAL_HALVINGS, progressAfter } from './machine'
import './zeno.css'

export default function Machine() {
  const api = useMachine()
  const [halvings, setHalvings] = useState(0)
  const [declared, setDeclared] = useState(false)
  const timer = useRef<number | null>(null)

  const begin = () => {
    if (declared) return
    if (timer.current !== null) return
    tick()
  }

  const tick = () => {
    timer.current = window.setTimeout(() => {
      setHalvings((n) => {
        const next = n + 1
        if (next >= TOTAL_HALVINGS) {
          timer.current = null
          window.setTimeout(() => {
            setDeclared(true)
            api.play('complete', 0.5)
            api.complete('zeno:limit-arrived')
          }, 600)
        } else {
          api.play('tick', 0.4)
          tick()
        }
        return next
      })
    }, 320)
  }

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    },
    [],
  )

  const progress = progressAfter(halvings)
  const remaining = 100 - progress

  return (
    <div className="zeno">
      <header className="zeno__head">
        <Microlabel>MINOR APPARATUS MA-01 — TRAVERSAL BY HALVES</Microlabel>
      </header>

      <div className="zeno__body">
        <p className="zeno__instruction">
          {declared
            ? DECLARATION
            : halvings === 0
              ? 'THE BAR WILL TRAVERSE HALF THE REMAINING DISTANCE, REPEATEDLY.'
              : `REMAINING: ${remaining.toPrecision(3)} UNITS. HALF OF THAT IS NEXT.`}
        </p>

        <div className="zeno__bar">
          <div className="zeno__fill" style={{ width: `${progress}%` }} />
          <span className="zeno__gapmarker" style={{ left: `${progress}%` }} />
        </div>
        <span className="zeno__readout">{progress.toFixed(4)}%</span>

        {!declared && halvings === 0 && (
          <Btn variant="primary" onClick={begin}>
            BEGIN TRAVERSAL
          </Btn>
        )}
        {!declared && halvings > 0 && (
          <span className="zeno__count">HALVINGS PERFORMED: {halvings} / {TOTAL_HALVINGS} (AUTHORED LIMIT)</span>
        )}
      </div>
    </div>
  )
}
