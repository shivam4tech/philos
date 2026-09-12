import { useEffect, useState } from 'react'

import { MACHINE_BY_ID } from '@/machines/registry'
import { HYBRIDS, chamberAvailable } from '@/machines/chamber'
import { useRecord } from '@/state/record'
import { totalCompletions } from '@/state/persistence'
import { navigate } from '@/router/router'
import { pushTicker } from '@/state/lab'
import { institution } from '@/institution/engine'
import { audio } from '@/audio/engine'
import { Btn, Microlabel } from './ui'
import './chamberpage.css'

/**
 * Experimental Composition Chamber — base apparatus × contaminant, all six
 * combinations hand-authored (see machines/chamber.ts). Nothing generated.
 */
export function ChamberPage() {
  const record = useRecord()
  const completions = totalCompletions(record)
  const [selected, setSelected] = useState<string | null>(null)

  const available = chamberAvailable(completions)
  const hybrid = HYBRIDS.find((h) => h.id === selected)
  const baseDone = hybrid ? (record.machines[hybrid.baseId]?.completions ?? 0) > 0 : false

  useEffect(() => {
    if (available) {
      const message = institution.emit('cross-contamination')
      if (message) pushTicker(message)
    }
  }, [available])

  const initiate = () => {
    if (!hybrid || !baseDone) {
      audio.play('invalid', { gain: 0.5 })
      return
    }
    audio.play('contamination', { gain: 0.4 })
    navigate({ name: 'machine', id: hybrid.baseId, contaminant: hybrid.contaminantId })
  }

  return (
    <div className="page chamber">
      <header className="page-head">
        <Microlabel signal>
          THE INSTITUTE ACCEPTS NO RESPONSIBILITY FOR INTER-PHILOSOPHICAL REACTIONS.
        </Microlabel>
        <h1>EXPERIMENTAL COMPOSITION CHAMBER</h1>
        <p className="chamber__lead">
          SELECT A BASE APPARATUS. THE CONTAMINANT IS FIXED BY THE REACTION REGISTER.
          MECHANICS ARE ALTERED, NOT QUOTED. {available ? '' : 'THE CHAMBER OPENS AFTER TWO APPARATUS COMPLETIONS.'}
        </p>
      </header>

      {!available ? (
        <p className="chamber__sealed">REACTION REGISTER INSUFFICIENT — {completions} COMPLETION{completions === 1 ? '' : 'S'} ON FILE.</p>
      ) : (
        <div className="chamber__grid">
          <section className="chamber__col" aria-label="Reaction register">
            <Microlabel>REACTION REGISTER — AUTHORED CONFRONTATIONS</Microlabel>
            {HYBRIDS.map((h) => {
              const base = MACHINE_BY_ID.get(h.baseId)
              const done = (record.machines[h.baseId]?.completions ?? 0) > 0
              return (
                <button
                  key={h.id}
                  className={`chamber__entry${selected === h.id ? ' is-selected' : ''}${done ? '' : ' is-locked'}`}
                  onClick={() => {
                    setSelected(h.id)
                    audio.play('tick', { gain: 0.4 })
                  }}
                >
                  <span className="chamber__entrytitle">{h.title}</span>
                  <span className="chamber__entrypair">
                    {base ? `${base.code} ${base.title}` : h.baseId} × {h.contaminantId.toUpperCase()}
                  </span>
                  <span className="chamber__entrystate">{done ? 'BASE QUALIFIED' : 'BASE NOT COMPLETED'}</span>
                </button>
              )
            })}
          </section>

          <section className="chamber__detail" aria-label="Reaction detail">
            {hybrid ? (
              <>
                <Microlabel signal>REACTION SPECIFICATION</Microlabel>
                <h2 className="chamber__hybridtitle">{hybrid.title}</h2>
                <p className="chamber__mechanism">{hybrid.mechanism}</p>
                <div className="chamber__pairing">
                  <div>
                    <Microlabel>BASE APPARATUS</Microlabel>
                    <span>{MACHINE_BY_ID.get(hybrid.baseId)?.title}</span>
                  </div>
                  <div>
                    <Microlabel>CONTAMINANT</Microlabel>
                    <span>{hybrid.contaminantId === 'marx' ? 'MARX (CONCEPTUAL CONTAMINANT)' : MACHINE_BY_ID.get(hybrid.contaminantId)?.title}</span>
                  </div>
                </div>
                <Btn variant="primary" onClick={initiate} disabled={!baseDone}>
                  {baseDone ? 'INITIATE REACTION' : 'COMPLETE THE BASE APPARATUS FIRST'}
                </Btn>
              </>
            ) : (
              <p className="chamber__hint">SELECT A REACTION FROM THE REGISTER.</p>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
