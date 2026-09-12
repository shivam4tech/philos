import { useEffect, useState } from 'react'

import { audio } from '@/audio/engine'
import { enterFacility, useRecord } from '@/state/record'
import { getSettings } from '@/state/settings'
import { navigate } from '@/router/router'
import { institution } from '@/institution/engine'
import { pushTicker, setBooted } from '@/state/lab'
import { Btn } from './ui'
import { InstitutionMark } from './InstitutionMark'
import { usePressable } from '@/interact/micro'
import './entrance.css'

const BOOT_LINES = [
  'INSTITUTE FOR APPLIED METAPHYSICS',
  'FACILITY STATUS: .......... PRESENT',
  'ONTOLOGICAL CONTAINMENT: .. NOMINAL',
  'APPARATUS INVENTORY: ...... 12 UNITS + MINOR',
  'RESTRICTED WING: .......... SEALED',
]

export function Entrance() {
  const record = useRecord()
  const [stage, setStage] = useState<'dark' | 'booting' | 'ready'>('dark')
  const [visibleLines, setVisibleLines] = useState(0)

  useEffect(() => {
    if (stage !== 'booting') return
    if (visibleLines >= BOOT_LINES.length) {
      const t = window.setTimeout(() => setStage('ready'), 420)
      return () => window.clearTimeout(t)
    }
    const t = window.setTimeout(() => setVisibleLines((n) => n + 1), 130)
    return () => window.clearTimeout(t)
  }, [stage, visibleLines])

  const enter = () => {
    const returning = record.counters.sessions > 0
    audio.unlock(getSettings())
    audio.startAmbience('entrance')
    window.setTimeout(() => audio.setScene('shell'), 2400)
    enterFacility()
    setBooted(true)
    audio.play('activate')
    if (returning) {
      const message = institution.emit('repeat-visitor')
      if (message) pushTicker(message)
    }
    navigate({ name: 'facility' })
  }

  const enterProps = usePressable({ sfx: false, keySfx: false })

  return (
    <div className={`entrance entrance--${stage}`}>
      <div className="entrance__mark">
        <InstitutionMark />
      </div>
      <h1 className="entrance__title">CONCEPTUAL MACHINES LAB</h1>
      <p className="entrance__subtitle">
        EXPERIMENTAL APPARATUS FOR THE INSTANTIATION OF PHILOSOPHICAL PROBLEMS
      </p>

      <div className="entrance__boot" aria-hidden={stage !== 'booting' && stage !== 'ready'}>
        {BOOT_LINES.slice(0, stage === 'dark' ? 1 : visibleLines).map((line) => (
          <p key={line} className="entrance__bootline">
            {line}
          </p>
        ))}
      </div>

      {stage === 'dark' && (
        <button
          className="entrance__enter"
          {...enterProps}
          onClick={() => {
            audio.play('tick')
            setStage('booting')
          }}
        >
          [ ENTER FACILITY ]
        </button>
      )}

      {stage === 'ready' && (
        <div className="entrance__ready">
          <Btn variant="primary" onClick={enter}>
            ENTER FACILITY
          </Btn>
          <p className="entrance__hint">
            AUDIO WILL BEGIN. THIS IS NORMAL. MUTING IS AVAILABLE ONCE INSIDE.
          </p>
        </div>
      )}
    </div>
  )
}
