import { useEffect, useRef, useState } from 'react'

import { useMachine } from '@/machines/context'
import { usePressable } from '@/interact/micro'
import { Btn, Microlabel } from '@/shell/ui'
import { SCENES, VERDICT, outcomeFor, replayAnnotations } from './machine'
import './again.css'

type Phase = 'life' | 'verdict' | 'replay' | 'refused'

interface RecordedChoice {
  sceneId: string
  choiceId: string
}

export default function Machine() {
  const api = useMachine()
  const [phase, setPhase] = useState<Phase>('life')
  const [sceneIndex, setSceneIndex] = useState(0)
  const [outcome, setOutcome] = useState<string | null>(null)
  const [record, setRecord] = useState<RecordedChoice[]>([])
  const [replayIndex, setReplayIndex] = useState(0)
  const [annotations, setAnnotations] = useState<string[]>([])
  const [replayCount, setReplayCount] = useState(0)
  const [secretFired, setSecretFired] = useState(false)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  const scene = SCENES[sceneIndex]

  const choose = (choiceId: string) => {
    if (!scene || outcome) return
    const line = outcomeFor(scene.id, choiceId)
    setRecord((prev) => [...prev, { sceneId: scene.id, choiceId }])
    setOutcome(line)
    api.play('key', 0.6)
    const t = window.setTimeout(() => {
      setOutcome(null)
      if (sceneIndex + 1 >= SCENES.length) {
        setPhase('verdict')
        api.play('complete', 0.5)
      } else {
        setSceneIndex((i) => i + 1)
      }
    }, 1150)
    timers.current.push(t)
  }

  const doAgain = () => {
    api.complete('again:recurrence-accepted')
    api.counter('recurrencesAccepted')
    const nextCount = replayCount + 1
    setReplayCount(nextCount)
    setAnnotations(replayAnnotations(nextCount))
    setReplayIndex(0)
    setPhase('replay')
    api.play('recurrence')
  }

  const doRefuse = () => {
    api.complete('again:recurrence-refused')
    api.counter('recurrencesRefused')
    setPhase('refused')
    api.play('invalid', 0.5)
  }

  /* replay engine: exact, input-free, accelerating */
  useEffect(() => {
    if (phase !== 'replay') return
    if (replayIndex >= record.length) {
      const t = window.setTimeout(() => setPhase('verdict'), 1600)
      timers.current.push(t)
      return
    }
    const speed = Math.max(500, 1100 - replayCount * 260)
    const t = window.setTimeout(() => {
      setReplayIndex((i) => i + 1)
      api.play('recurrence', 0.5)
    }, speed)
    timers.current.push(t)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- replay pacing
  }, [phase, replayIndex])

  const nestedAgain = () => {
    if (!secretFired) {
      setSecretFired(true)
      api.secret('nested-recurrence', 'UR-007', 'RECURRENCE WITHIN RECURRENCE')
    }
  }

  if (phase === 'refused') {
    return (
      <div className="again again--verdict">
        {VERDICT.refused.map((line, i) => (
          <p key={line} className="again__verdictline" style={{ animationDelay: `${i * 600}ms` }}>
            {line}
          </p>
        ))}
      </div>
    )
  }

  if (phase === 'verdict') {
    return (
      <div className="again again--verdict">
        <Microlabel>APPARATUS CM-006 — SESSION RECORD</Microlabel>
        <h2 className="again__title">{VERDICT.completed}</h2>
        <ol className="again__record">
          {record.map((entry, i) => {
            const scene = SCENES.find((s) => s.id === entry.sceneId)
            const choice = scene?.choices.find((c) => c.id === entry.choiceId)
            return (
              <li key={`${entry.sceneId}-${i}`}>
                <span className="again__recordmoment">{scene?.moment}</span>
                <span className="again__recordchoice">{choice?.label}</span>
              </li>
            )
          })}
        </ol>
        <p className="again__question">{VERDICT.question}</p>
        <div className="again__verdictactions">
          <Btn variant="primary" onClick={doAgain}>
            AGAIN
          </Btn>
          <Btn variant="ghost" onClick={doRefuse}>
            REFUSE
          </Btn>
        </div>
      </div>
    )
  }

  if (phase === 'replay') {
    const visible = record.slice(0, replayIndex + 1)
    const annotation = annotations[Math.min(replayIndex, annotations.length - 1)]
    return (
      <div className="again again--replay">
        <Microlabel signal>RECURRENCE {replayCount} — INPUT SUSPENDED</Microlabel>
        <div className="again__replaylog">
          {visible.map((entry, i) => {
            const scene = SCENES.find((s) => s.id === entry.sceneId)
            return (
              <p key={`${entry.sceneId}-${i}`} className="again__replayline">
                <span className="again__recordmoment">{scene?.moment}</span>
                {outcomeFor(entry.sceneId, entry.choiceId)}
              </p>
            )
          })}
        </div>
        {replayIndex >= 3 && annotation && <p className="again__annotation">{annotation}</p>}
        {!secretFired && replayIndex > 4 && (
          <button className="again__nested" onClick={nestedAgain}>
            AGAIN?
          </button>
        )}
      </div>
    )
  }

  /* life phase */
  return (
    <div className="again">
      <header className="again__head">
        <Microlabel>
          MOMENT {sceneIndex + 1} / {SCENES.length}
        </Microlabel>
        <div className="again__timeline">
          {SCENES.map((s, i) => (
            <span
              key={s.id}
              className={`again__tick${i < sceneIndex ? ' is-past' : ''}${i === sceneIndex ? ' is-now' : ''}`}
            />
          ))}
        </div>
      </header>
      {scene && (
        <div className="again__scene" key={scene.id}>
          <h2 className="again__moment">{scene.moment}</h2>
          <p className="again__detail">{scene.detail}</p>
          <div className="again__choices">
            {scene.choices.map((choice) => (
              <ChoiceButton key={choice.id} label={choice.label} onChoose={() => choose(choice.id)} />
            ))}
          </div>
          {outcome && <p className="again__outcome">{outcome}</p>}
        </div>
      )}
    </div>
  )
}

function ChoiceButton({ label, onChoose }: { label: string; onChoose: () => void }) {
  const props = usePressable({ sfx: false })
  return (
    <button className="again__choice" {...props} onClick={onChoose}>
      {label}
    </button>
  )
}
