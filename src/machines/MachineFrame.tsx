import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { getMachine, type MachineMeta } from '@/machines/registry'
import { getMachineComponent } from '@/machines/machineComponents'
import { getApparatusContent } from '@/archive/content'
import { MachineContext } from '@/machines/context'
import {
  addCounter,
  completeMachine,
  discoverSecret,
  enterMachine,
  leaveMachine,
  noteModeCompleted,
  useRecord,
} from '@/state/record'
import { bumpMetric, pushTicker, setPoweringOn, useLab } from '@/state/lab'
import { institution } from '@/institution/engine'
import { attemptContamination } from '@/contamination/engine'
import { audio, BASE_SCENE } from '@/audio/engine'
import { useSettings, setMuted } from '@/state/settings'
import { getSettings } from '@/state/settings'
import { navigate } from '@/router/router'
import { ErrorBoundary } from '@/shell/ErrorBoundary'
import { TextualApparatusView } from '@/shell/TextualApparatusView'
import { Btn, Microlabel } from '@/shell/ui'
import { usePressable } from '@/interact/micro'
import './machineframe.css'

/**
 * MachineFrame — full-screen apparatus environment. Minimal chrome: code,
 * title, and four controls (apparatus text, reset, audio, exit). Controls
 * are accessibility-exempt from every experiment.
 */

export function MachineRoute({ machineId }: { machineId: string }) {
  return <MachineFrame key={machineId} meta={getMachine(machineId)} />
}

function MachineFrame({ meta }: { meta: MachineMeta | undefined }) {
  const record = useRecord()
  const lab = useLab()
  const [textOpen, setTextOpen] = useState(false)
  const [resetCount, setResetCount] = useState(0)
  const [completion, setCompletion] = useState<{ event: string; fresh: string[] } | null>(null)
  const failures = useRef(0)
  const machineId = meta?.id

  useEffect(() => {
    const machine = machineId ? getMachine(machineId) : undefined
    if (!machine) return
    const entered = Date.now()
    enterMachine(machine.id)
    audio.unlock(getSettings())
    audio.startAmbience(machine.audioScene)
    audio.play('power-on')
    setPoweringOn(machine.id)
    const t = window.setTimeout(() => setPoweringOn(null), 900)

    const institutionFirst = institution.emit('first-machine')
    if (institutionFirst) pushTicker(institutionFirst)

    return () => {
      window.clearTimeout(t)
      leaveMachine(machine.id, Date.now() - entered)
      bumpMetric('machineExits')
      audio.play('power-off')
      audio.startAmbience(BASE_SCENE)
      // exiting an apparatus is itself a trigger for laboratory events
      window.setTimeout(() => {
        void attemptContamination('catalogue')
      }, 1200)
    }
  }, [machineId])

  const completed = (record.machines[meta?.id ?? '']?.completions ?? 0) > 0
  const content = meta ? getApparatusContent(meta.id) : undefined
  const Component = meta ? getMachineComponent(meta.componentKey) : null

  const api = useMemo(
    () => ({
      machineId: meta?.id ?? '',
      complete: (event: string) => {
        if (!meta || completion) return
        const fresh = completeMachine(meta.id, event)
        setCompletion({ event, fresh })
        audio.play('complete')
        pushTicker(`APPARATUS ${meta.code} — SESSION CONCLUDED`, 'contamination')
        if (fresh.length > 0) {
          window.setTimeout(() => audio.play('contamination', { gain: 0.6 }), 900)
        }
      },
      counter: (counter: Parameters<typeof addCounter>[0], amount = 1) => addCounter(counter, amount),
      failure: () => {
        failures.current += 1
        addCounter('failedVerifications')
        audio.play('invalid')
        if (failures.current === 4) {
          const message = institution.emit('many-failed-attempts')
          if (message) pushTicker(message)
        }
      },
      secret: (id: string, code: string, classification: string) => {
        discoverSecret({ id, code, classification })
        audio.play('secret')
        pushTicker(`UNAUTHORIZED PROCEDURE DETECTED — RECORD ${code} — ${classification}`, 'secret')
      },
      noteMode: (modeId: string) => {
        if (meta) noteModeCompleted(meta.id, modeId)
      },
      play: (name: Parameters<typeof audio.play>[0], gain?: number) =>
        audio.play(name, gain !== undefined ? { gain } : undefined, 'machine'),
      completed,
    }),
    [meta, completed, completion],
  )

  const doReset = useCallback(() => {
    if (!meta) return
    setResetCount((n) => n + 1)
    setCompletion(null)
    addCounter('resets')
    audio.play('reset')
  }, [meta])

  const exitProps = usePressable({ sfx: 'click' })

  if (!meta) {
    navigate({ name: 'catalogue' }, { replace: true })
    return null
  }

  return (
    <div className="mframe">
        <header className="mframe__bar">
          <span className="mframe__code">{meta.code}</span>
          <span className="mframe__title">{meta.title}</span>
          <span className="mframe__thinker">{meta.thinker.toUpperCase()}</span>
          <span className={`mframe__status mframe__status--${meta.status.toLowerCase().replace(/[^a-z]+/g, '-')}`}>
            {meta.status}
          </span>
          <span className="mframe__spacer" />
          <div className="mframe__controls">
            <Btn variant="ghost" onClick={() => setTextOpen((v) => !v)}>
              {textOpen ? 'CLOSE TEXT' : 'APPARATUS TEXT'}
            </Btn>
            <Btn variant="ghost" onClick={doReset}>
              RESET
            </Btn>
            <MuteButton />
            <Btn variant="ghost" {...exitProps} onClick={() => navigate({ name: 'catalogue' })}>
              EXIT
            </Btn>
          </div>
        </header>

        <div className="mframe__stage">
          <ErrorBoundary resetKey={`${meta.id}:${resetCount}`} label={meta.code}>
            {Component && (
              <Suspense fallback={<Energizing code={meta.code} />}>
                <MachineContext.Provider value={api}>
                  <div className="mframe__mount" key={resetCount}>
                    <Component />
                  </div>
                </MachineContext.Provider>
              </Suspense>
            )}
          </ErrorBoundary>
        </div>
        {completion && (
          <CompletionBanner
            meta={meta}
            event={completion.event}
            fresh={completion.fresh}
            onText={() => setTextOpen(true)}
          />
        )}

        {textOpen && (
          <aside className="mframe__text" aria-label="Textual apparatus">
            <div className="mframe__texthead">
              <Microlabel>Textual apparatus</Microlabel>
              <Btn variant="ghost" onClick={() => setTextOpen(false)}>
                CLOSE
              </Btn>
            </div>
            <div className="mframe__textbody">
              {content ? (
                <TextualApparatusView content={content} sealed={!completed} title={meta.title} />
              ) : (
                <p className="mframe__nocontent">NO DOCUMENTATION ON FILE FOR {meta.code}.</p>
              )}
            </div>
          </aside>
        )}

        {lab.poweringOn === meta.id && <div className="mframe__bootveil" aria-hidden="true" />}
      </div>
  )
}

function MuteButton() {
  const settings = useSettings()
  const props = usePressable({ sfx: false })
  return (
    <Btn
      variant="ghost"
      {...props}
      aria-pressed={settings.muted}
      onClick={() => setMuted(!settings.muted)}
    >
      {settings.muted ? 'AUDIO OFF' : 'AUDIO ON'}
    </Btn>
  )
}

function Energizing({ code }: { code: string }) {
  return (
    <div className="mframe__energizing" role="status">
      <p className="microlabel">ENERGIZING APPARATUS</p>
      <p className="mframe__energizingcode">{code}</p>
      <div className="mframe__scanline" />
    </div>
  )
}

function CompletionBanner({
  meta,
  event,
  fresh,
  onText,
}: {
  meta: MachineMeta
  event: string
  fresh: string[]
  onText: () => void
}) {
  return (
    <div className="mframe__completion" role="status">
      <div>
        <p className="microlabel microlabel--signal">SESSION CONCLUDED — {meta.code}</p>
        <p className="mframe__completionevent">OUTCOME: {event.toUpperCase()}</p>
        {fresh.length > 0 && (
          <p className="mframe__completionnote">
            CONTAMINATION VECTORS UPDATED (+{fresh.length}). THE FACILITY WILL REMEMBER THIS.
          </p>
        )}
      </div>
      <div className="mframe__completionactions">
        <Btn variant="primary" onClick={() => navigate({ name: 'catalogue' })}>
          RETURN TO CATALOGUE
        </Btn>
        <Btn variant="ghost" onClick={onText}>
          TEXTUAL APPARATUS
        </Btn>
        <Btn variant="ghost" onClick={() => navigate({ name: 'archive-machine', id: meta.id })}>
          ARCHIVE ENTRY
        </Btn>
      </div>
    </div>
  )
}
