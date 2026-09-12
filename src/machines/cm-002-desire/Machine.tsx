import { useCallback, useEffect, useRef, useState } from 'react'

import { useMachine } from '@/machines/context'
import { fireFx } from '@/interact/micro'
import { Btn, Microlabel } from '@/shell/ui'
import { EXERCISE_LINES, GRID_CONCEPTS, OTHER_OPTIONS, displacedGrid } from './machine'
import './desire.css'

type Phase = 'intro' | 'grid' | 'other' | 'missing' | 'triage' | 'final'

export default function Machine() {
  const [phase, setPhase] = useState<Phase>('intro')

  return (
    <div className="desire">
      <header className="desire__head">
        <Microlabel>INSTITUTE VERIFICATION AUTHORITY — SEAL</Microlabel>
        <Seal />
        <h1 className="desire__title">DESIRE VERIFICATION TERMINAL</h1>
      </header>
      <div className="desire__body">
        {phase === 'intro' && <Intro onBegin={() => setPhase('grid')} />}
        {phase === 'grid' && (
          <GridExercise
            onDone={() => {
              setPhase('other')
            }}
          />
        )}
        {phase === 'other' && <OtherExercise onDone={() => setPhase('missing')} />}
        {phase === 'missing' && <MissingExercise onDone={() => setPhase('triage')} />}
        {phase === 'triage' && <Triage onConclude={() => setPhase('final')} />}
        {phase === 'final' && <Final />}
      </div>
    </div>
  )
}

/** The clickable verification seal — three attempts trigger the reflexive record. */
function Seal() {
  const api = useMachine()
  const clicks = useRef(0)
  return (
    <button
      className="desire__seal"
      title="INSTITUTE VERIFICATION AUTHORITY"
      aria-label="Institute verification authority seal number 9"
      onClick={() => {
        clicks.current += 1
        api.play('tick', 0.5)
        if (clicks.current === 3) {
          api.secret('reflexive-verification', 'UR-004', 'REFLEXIVE VERIFICATION')
        }
      }}
    >
      № 9
    </button>
  )
}

function Intro({ onBegin }: { onBegin: () => void }) {
  return (
    <div className="desire__phase">
      <p className="desire__prompt">{EXERCISE_LINES.intro}</p>
      <p className="desire__note">
        THREE EXERCISES WILL FOLLOW. EACH IS ADMINISTERED BY THE INSTITUTE VERIFICATION
        AUTHORITY. THE AUTHORITY IS NOT PRESENT. THE FORM IS.
      </p>
      <Btn variant="primary" onClick={onBegin}>
        BEGIN VERIFICATION
      </Btn>
    </div>
  )
}

function GridExercise({ onDone }: { onDone: () => void }) {
  const api = useMachine()
  const [order, setOrder] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [attempts, setAttempts] = useState(0)
  const [drifts, setDrifts] = useState(0)
  const [notice, setNotice] = useState<string | null>(null)

  const hoverSwap = useCallback(
    (index: number) => {
      setOrder((prev) => displacedGrid(prev, index, drifts))
      setDrifts((d) => d + 1)
    },
    [drifts],
  )

  const select = (conceptId: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.add(conceptId)
      return next
    })
    api.play('toggle', 0.7)
    const nextAttempts = attempts + 1
    setAttempts(nextAttempts)
    if (nextAttempts === 3) {
      window.setTimeout(() => {
        setSelected(new Set())
        setNotice(EXERCISE_LINES.drift)
        api.failure()
        api.play('invalid', 0.6)
        fireFx(document.querySelector('.desire__grid'), 'shake')
        window.setTimeout(() => setNotice(null), 2600)
      }, 650)
    }
    if (nextAttempts >= 6) {
      window.setTimeout(onDone, 900)
    }
  }

  return (
    <div className="desire__phase">
      <p className="desire__prompt">{EXERCISE_LINES.exercise1}</p>
      <div className="desire__grid">
        {order.map((conceptIndex, tileIndex) => {
          const concept = GRID_CONCEPTS[conceptIndex]
          return (
            <button
              key={concept.id}
              className={`desire__tile${selected.has(concept.id) ? ' is-selected' : ''}`}
              onPointerEnter={() => hoverSwap(tileIndex)}
              onClick={() => select(concept.id)}
            >
              {concept.label}
            </button>
          )
        })}
      </div>
      <p className="desire__notice" aria-live="polite">
        {notice ?? (selected.size > 0 ? `${selected.size} MARKED — MARKS ARE PROVISIONAL` : 'TILES MAY RELOCATE DURING INSPECTION. THIS IS NORMAL.')}
      </p>
    </div>
  )
}

function OtherExercise({ onDone }: { onDone: () => void }) {
  const api = useMachine()
  const [picks, setPicks] = useState<string[]>([])

  const pick = (option: (typeof OTHER_OPTIONS)[number]) => {
    setPicks((prev) => [...prev, option.id])
    api.failure()
    api.play('contradiction', 0.5)
    if (picks.length >= 1) {
      window.setTimeout(onDone, 1700)
    }
  }

  return (
    <div className="desire__phase">
      <p className="desire__prompt">{EXERCISE_LINES.exercise2}</p>
      <div className="desire__options">
        {OTHER_OPTIONS.map((option) => (
          <Btn key={option.id} onClick={() => pick(option)}>
            {option.label}
          </Btn>
        ))}
      </div>
      {picks.map((id, i) => {
        const option = OTHER_OPTIONS.find((o) => o.id === id)
        return (
          <p key={`${id}-${i}`} className="desire__notice">
            {option?.response}
          </p>
        )
      })}
    </div>
  )
}

function MissingExercise({ onDone }: { onDone: () => void }) {
  const api = useMachine()
  const [gapIndex, setGapIndex] = useState(2)
  const [missingness, setMissingness] = useState(0)
  const probes = useRef(0)
  const objects = ['A', 'B', 'C', 'D', 'E']

  const probe = () => {
    setGapIndex((gapIndex + 1 + Math.floor(Math.random() * 4)) % 6)
    probes.current += 1
    const nextMissing = Math.min(100, probes.current * 17)
    setMissingness(nextMissing)
    api.play('surveillance', 0.4)
    if (probes.current >= 6) {
      api.failure()
      window.setTimeout(onDone, 1600)
    }
  }

  return (
    <div className="desire__phase">
      <p className="desire__prompt">{EXERCISE_LINES.exercise3}</p>
      <div className="desire__strip">
        {Array.from({ length: 6 }).map((_, i) =>
          i === gapIndex ? (
            <button key={i} className="desire__gap" onClick={probe}>
              objet&nbsp;?
            </button>
          ) : (
            <div key={i} className="desire__object">
              {objects[(i - (i > gapIndex ? 1 : 0)) % objects.length]}
            </div>
          ),
        )}
      </div>
      <div className="desire__missingmeter">
        <Microlabel>MISSINGNESS</Microlabel>
        <div className="desire__meter">
          <div className="desire__meterfill" style={{ width: `${missingness}%` }} />
        </div>
      </div>
      {missingness >= 100 && <p className="desire__notice">{EXERCISE_LINES.missingDone}</p>}
    </div>
  )
}

function Triage({ onConclude }: { onConclude: () => void }) {
  return (
    <div className="desire__phase">
      <p className="desire__prompt">{EXERCISE_LINES.triage}</p>
      <div className="desire__triage">
        <div className="desire__triagecol">
          <Microlabel>NEED</Microlabel>
          <p>REQUESTS THAT COULD, IN PRINCIPLE, BE SATISFIED.</p>
          <span className="desire__triageval">PRESENT</span>
        </div>
        <div className="desire__triagecol">
          <Microlabel>DEMAND</Microlabel>
          <p>FORMULATED ADDRESSES — ALWAYS ALSO REQUESTS FOR RECOGNITION.</p>
          <span className="desire__triageval">PRESENT</span>
        </div>
        <div className="desire__triagecol">
          <Microlabel>DESIRE</Microlabel>
          <p>STRUCTURAL. PRESENT IN EVERY EVENT ABOVE, INCLUDING THIS ONE.</p>
          <span className="desire__triageval desire__triageval--alert">NOT SEPARABLE</span>
        </div>
      </div>
      <p className="desire__note">
        NO DIAGNOSIS IS ISSUED. THE TERMINAL MEASURES THE SESSION, NOT THE SUBJECT.
      </p>
      <Btn variant="primary" onClick={onConclude}>
        RECEIVE VERDICT
      </Btn>
    </div>
  )
}

function Final() {
  const api = useMachine()
  useEffect(() => {
    api.play('warning', 0.5)
    const t = window.setTimeout(() => {
      api.complete('desire:verification-incomplete')
    }, 1800)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- completion fires once on mount
  }, [])
  return (
    <div className="desire__phase desire__phase--final">
      {EXERCISE_LINES.final.map((line) => (
        <p key={line} className="desire__verdict">
          {line}
        </p>
      ))}
    </div>
  )
}
