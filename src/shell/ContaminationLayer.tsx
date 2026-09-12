import { useEffect, useMemo, useState } from 'react'

import { getLab, removeActiveEffect, useLab } from '@/state/lab'
import { navigate, type Route } from '@/router/router'
import { audio } from '@/audio/engine'
import { useFx, fireFx } from '@/interact/micro'
import './contamination.css'

function dismissEffect(effectId: string): void {
  const instance = getLab().contamination.find((e) => e.effectId === effectId)
  if (instance) removeActiveEffect(instance.instanceId)
}

/**
 * ContaminationLayer — renders the shell-level manifestations of active
 * contamination effects. Each effect owns its expiry.
 */

export function ContaminationLayer() {
  const lab = useLab()

  useEffect(() => {
    const timers = lab.contamination
      .filter((e) => e.expiresAt !== null)
      .map((e) =>
        window.setTimeout(
          () => removeActiveEffect(e.instanceId),
          Math.max(0, (e.expiresAt ?? Date.now()) - Date.now()),
        ),
      )
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [lab.contamination])

  const rendered = useMemo(() => {
    const byId = new Map(lab.contamination.map((e) => [e.effectId, e]))
    const nodes = []
    if (byId.has('conspicuous-tool')) nodes.push(<ConspicuousTool key="ct" />)
    if (byId.has('semantic-linkage')) nodes.push(<SemanticLinkage key="sl" />)
    if (byId.has('behavioral-summary')) nodes.push(<BehavioralSummary key="bs" />)
    if (byId.has('additional-request')) nodes.push(<AdditionalRequest key="ar" />)
    if (byId.has('contradictory-signage')) nodes.push(<ContradictorySignage key="cs" />)
    if (byId.has('institutional-drift')) nodes.push(<InstitutionalDrift key="id" />)
    if (byId.has('sequence-replay')) nodes.push(<SequenceReplay key="sr" />)
    return nodes
  }, [lab.contamination])

  return <div className="contamination-layer" aria-live="off">{rendered}</div>
}

/**
 * The visitor's recent route sequence repeats exactly. Input is suspended;
 * the laboratory walks itself back through where you have been.
 */
function SequenceReplay() {
  const history = getLab().routeHistory
  const [step, setStep] = useState(0)
  const path = useMemo(
    () => [...new Set(history.filter((name) => name !== 'machine' && name !== 'entrance'))].slice(-4),
    [history],
  )

  useEffect(() => {
    const timers: number[] = []
    path.forEach((name, index) => {
      timers.push(
        window.setTimeout(() => {
          setStep(index + 1)
          navigate(routeFromName(name))
          audio.play('recurrence', { gain: 0.5 })
        }, 900 * (index + 1)),
      )
    })
    timers.push(
      window.setTimeout(
        () => {
          dismissEffect('sequence-replay')
          navigate({ name: 'catalogue' })
        },
        900 * (path.length + 1),
      ),
    )
    return () => timers.forEach((t) => window.clearTimeout(t))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- walk the sequence once
  }, [])

  if (path.length === 0) return null
  return (
    <div className="cont-tag cont-tag--replay" role="status">
      IDENTICAL SEQUENCE REPLAY — {Math.min(step, path.length)}/{path.length} — INPUT SUSPENDED
    </div>
  )
}

function routeFromName(name: Route['name']): Route {
  switch (name) {
    case 'facility':
      return { name: 'facility' }
    case 'record':
      return { name: 'record' }
    case 'archive':
      return { name: 'archive' }
    case 'settings':
      return { name: 'settings' }
    default:
      return { name: 'catalogue' }
  }
}

/** A routine control stops working and becomes conspicuous. */
function ConspicuousTool() {
  const [attempts, setAttempts] = useState(0)
  const [ref] = useFx<HTMLDivElement>()

  const handleDismiss = () => {
    if (attempts < 1) {
      setAttempts(1)
      audio.play('invalid')
      fireFx(ref.current, 'shake')
      return
    }
    audio.play('click')
    dismissEffect('conspicuous-tool')
  }

  return (
    <div className="cont-card cont-card--tool" ref={ref}>
      <p className="cont-card__path">interface.pointer_controller</p>
      <p className="cont-card__line">
        STATUS: <span className="cont-card__alert">CONSPICUOUS</span>
      </p>
      <p className="cont-card__note">
        {attempts === 0
          ? 'THIS CONTROL HAS BECOME AN OBJECT. TRANSPARENCY IS PENDING.'
          : 'THE CONTROL ACKNOWLEDGES YOUR ATTEMPT. IT DECLINES TO BECOME EQUIPMENT AGAIN SO QUICKLY.'}
      </p>
      <button className="cont-card__btn" onClick={handleDismiss}>
        {attempts === 0 ? 'REGAIN TRANSPARENCY' : 'ACKNOWLEDGE OBJECTHOOD'}
      </button>
    </div>
  )
}

/** A definition chain with no ground floor. */
const CHAIN: Record<string, { text: string; next: string[] }> = {
  OPERATIONAL: {
    text: 'FUNCTIONING ACCORDING TO SPECIFICATION. SEE: FUNCTIONING.',
    next: ['FUNCTIONING'],
  },
  FUNCTIONING: {
    text: 'PERFORMING THE ACTIVITY FOR WHICH AN ITEM IS EMPLOYED. SEE: EMPLOYED.',
    next: ['EMPLOYED'],
  },
  EMPLOYED: {
    text: 'PUT TO USE WITHIN A PRACTICE THAT ALREADY UNDERSTANDS SUCH USE. SEE: UNDERSTANDS.',
    next: ['UNDERSTANDS'],
  },
  UNDERSTANDS: {
    text: 'TO GRASP WHAT AN ITEM IS FOR. SEE: FOR.',
    next: ['FOR'],
  },
  FOR: {
    text: 'THE TOWARD-WHICH OF AN OPERATION. SEE: OPERATION.',
    next: ['OPERATIONAL'],
  },
}

function SemanticLinkage() {
  const [term, setTerm] = useState('OPERATIONAL')
  const entry = CHAIN[term]
  return (
    <div className="cont-card cont-card--chain">
      <p className="cont-card__path">SEMANTIC LINKAGE ACTIVE</p>
      <p className="cont-card__term">{term}</p>
      <p className="cont-card__note">{entry.text}</p>
      <div className="cont-card__row">
        {entry.next.map((nextTerm) => (
          <button
            key={nextTerm}
            className="cont-card__btn"
            onClick={() => {
              setTerm(nextTerm)
              audio.play('semantic-shift')
            }}
          >
            → {nextTerm}
          </button>
        ))}
        <button className="cont-card__btn cont-card__btn--ghost" onClick={() => dismissEffect('semantic-linkage')}>
          STOP READING
        </button>
      </div>
      {term === 'FOR' && (
        <p className="cont-card__footnote">THE CHAIN HAS NOT GROUNDED. THIS IS NORMAL.</p>
      )}
    </div>
  )
}

/** The institute releases a dossier of the subject's own conduct. */
function BehavioralSummary() {
  const lab = useLab()
  const elapsedMin = Math.max(1, Math.round((Date.now() - lab.metrics.startedAt) / 60_000))
  return (
    <div className="cont-card cont-card--dossier">
      <p className="cont-card__path">BEHAVIORAL SUMMARY — RELEASED WITHOUT REQUEST</p>
      <dl className="cont-card__stats">
        <div>
          <dt>TIME IN FACILITY</dt>
          <dd>{elapsedMin} MIN</dd>
        </div>
        <div>
          <dt>ROUTES TRAVERSED</dt>
          <dd>{lab.metrics.navCount}</dd>
        </div>
        <div>
          <dt>APPARATUS EXITS</dt>
          <dd>{lab.metrics.machineExits}</dd>
        </div>
        <div>
          <dt>HOVER SAMPLES</dt>
          <dd>{lab.metrics.shellHovers}</dd>
        </div>
        <div>
          <dt>RECORD RESETS</dt>
          <dd>{lab.metrics.resets}</dd>
        </div>
      </dl>
      <p className="cont-card__footnote">
        SOURCE: LOCAL SESSION ONLY. NO EXTERNAL OBSERVER IS CLAIMED, WHICH IS NOT THE SAME AS DENIED.
      </p>
      <button className="cont-card__btn" onClick={() => dismissEffect('behavioral-summary')}>
        CLOSE DOSSIER
      </button>
    </div>
  )
}

function AdditionalRequest() {
  return (
    <div className="cont-card cont-card--request">
      <p className="cont-card__path">ADDITIONAL REQUEST GENERATED</p>
      <p className="cont-card__note">
        COMPLETION OF THE PREVIOUS TASK HAS PRODUCED A FURTHER TASK. PLEASE OPERATE AN
        UNOPERATED APPARATUS. SATISFACTION IS NOT EXPECTED.
      </p>
      <div className="cont-card__row">
        <button className="cont-card__btn" onClick={() => dismissEffect('additional-request')}>
          ACKNOWLEDGE
        </button>
        <button
          className="cont-card__btn cont-card__btn--ghost"
          onClick={() => {
            audio.play('tick')
            dismissEffect('additional-request')
          }}
        >
          DECLINE (FILED ANYWAY)
        </button>
      </div>
    </div>
  )
}

function ContradictorySignage() {
  return (
    <div className="cont-tag" role="presentation">
      THIS ZONE IS SIMULTANEOUSLY THE ZONE IT IS NOT. BOTH SIGNAGES ARE CORRECT.
    </div>
  )
}

const DRIFT_NOTICES = [
  'FACILITY NOTICE: THE BUILDING HAS SHIFTED 2MM WESTWARD. MEASUREMENTS UNAVAILABLE.',
  'NOTICE: A DOOR IN THIS FACILITY NOW OPENS ONLY ONTO ITSELF. IT IS NOT LOCKED.',
  'NOTICE: THE CORRIDOR LABELS HAVE BEEN RE-ALPHABETIZED BY MEANING.',
  'NOTICE: THE VENDING MACHINES REQUEST YOU REMAIN CALM.',
  'NOTICE: AIR QUALITY REPORT DESCRIBES THE AIR AS “MOSTLY PRESENT”.',
]

function InstitutionalDrift() {
  const notice = useMemo(() => DRIFT_NOTICES[Math.floor(Math.random() * DRIFT_NOTICES.length)], [])
  return <div className="cont-tag">{notice}</div>
}
