import { useEffect, useRef, useState } from 'react'

import { useMachine } from '@/machines/context'
import { Btn, Microlabel } from '@/shell/ui'
import {
  CHAIN_QUESTIONS,
  CRITERION_CHALLENGES,
  EPISODES,
  LINES,
  SIGN,
  USE_EXERCISES,
} from './machine'
import './private.css'

type Phase = 'ostension' | 'recurrence' | 'criteria' | 'practice' | 'chains' | 'complete'

export default function Machine() {
  const api = useMachine()
  const [phase, setPhase] = useState<Phase>('ostension')
  const [episodeIndex, setEpisodeIndex] = useState(0)
  const [fixed, setFixed] = useState(false)
  const [judgements, setJudgements] = useState<{ episode: string; same: boolean }[]>([])
  const [challengeResponse, setChallengeResponse] = useState<string | null>(null)
  const [useIndex, setUseIndex] = useState(0)
  const [refusals, setRefusals] = useState(0)
  const [note, setNote] = useState<string | null>(null)
  const holdTimer = useRef<number | null>(null)
  const [holding, setHolding] = useState(false)

  const episode = EPISODES[Math.min(episodeIndex, EPISODES.length - 1)]

  /* ostension: press and hold to concentrate */
  const startHold = () => {
    if (fixed) return
    setHolding(true)
    api.play('tick', 0.4)
    holdTimer.current = window.setTimeout(() => {
      setFixed(true)
      setHolding(false)
      api.play('unlock', 0.6)
      setNote(LINES.fixed)
    }, 1600)
  }
  const endHold = () => {
    setHolding(false)
    if (holdTimer.current !== null && !fixed) {
      window.clearTimeout(holdTimer.current)
      holdTimer.current = null
    }
  }
  useEffect(() => () => {
    if (holdTimer.current !== null) window.clearTimeout(holdTimer.current)
  }, [])

  const judge = (same: boolean) => {
    setJudgements((prev) => [...prev, { episode: episode.id, same }])
    api.play('toggle', 0.5)
    if (judgements.length === 0) {
      setPhase('criteria')
    } else if (episodeIndex + 1 < EPISODES.length && phase === 'recurrence') {
      setEpisodeIndex((i) => i + 1)
    } else if (phase === 'recurrence') {
      setPhase('criteria')
    }
  }

  const answerCriterion = (option: (typeof CRITERION_CHALLENGES)[number]['options'][number]) => {
    setChallengeResponse(option.response)
    api.play(option.accepted ? 'unlock' : 'invalid', 0.6)
    if (!option.accepted) {
      api.failure()
      return
    }
    window.setTimeout(() => setPhase('practice'), 1800)
  }

  const answerUse = (option: { id: string; response: string }) => {
    setChallengeResponse(option.response)
    api.play('semantic-shift', 0.6)
    if (useIndex + 1 >= USE_EXERCISES.length) {
      window.setTimeout(() => {
        if (api.contaminantId === 'cm-011-terms') {
          setPhase('chains')
        } else {
          setPhase('complete')
          api.play('complete', 0.6)
          api.complete('private:criteria-established')
        }
      }, 1800)
    } else {
      setUseIndex((i) => i + 1)
    }
  }

  /* WITTGENSTEIN × DERRIDA: every settlement opens further distinctions */
  const [chainIndex, setChainIndex] = useState(0)
  const chain = CHAIN_QUESTIONS[Math.min(chainIndex, CHAIN_QUESTIONS.length - 1)]
  const answerChain = () => {
    api.play('semantic-shift', 0.5)
    if (chainIndex + 1 >= CHAIN_QUESTIONS.length) {
      setPhase('complete')
      api.play('complete', 0.6)
      api.complete('private:contaminated-session')
    } else {
      setChainIndex((i) => i + 1)
    }
  }

  const refusePublic = () => {
    const next = refusals + 1
    setRefusals(next)
    api.failure()
    api.play('invalid', 0.5)
    setNote(LINES.refusal)
    if (next === 2) {
      api.secret('absolute-privacy', 'UR-009', 'ABSOLUTE PRIVACY')
    }
  }

  const exercise = USE_EXERCISES[Math.min(useIndex, USE_EXERCISES.length - 1)]

  return (
    <div className="private">
      <header className="private__head">
        <Microlabel>INNER SENSATION DIARY — SINGLE OCCUPANT</Microlabel>
        <span className="private__phase">{phase.toUpperCase()}</span>
      </header>

      <div className="private__body">
        <div className="private__sensation">
          <Microlabel>{LINES.intro}</Microlabel>
          <span className="private__sign">{SIGN}</span>
          {phase !== 'ostension' && (
            <span className="private__context">EPISODE {episodeIndex + 1}: {episode.context}</span>
          )}
        </div>

        {phase === 'ostension' && (
          <div className="private__phasebox">
            <p className="private__instruction">{LINES.fixInstruction}</p>
            <button
              className={`private__hold${holding ? ' is-holding' : ''}`}
              onPointerDown={startHold}
              onPointerUp={endHold}
              onPointerLeave={endHold}
              onKeyDown={(e) => e.key === 'Enter' && startHold()}
              onKeyUp={endHold}
            >
              {fixed ? 'SIGN FIXED' : holding ? 'CONCENTRATING…' : 'HOLD TO FIX △Q7'}
            </button>
            {fixed && (
              <Btn variant="primary" onClick={() => setPhase('recurrence')}>
                CONTINUE THE DIARY
              </Btn>
            )}
            <p className="private__note">{note ?? LINES.privateAttempt}</p>
          </div>
        )}

        {phase === 'recurrence' && (
          <div className="private__phasebox">
            <p className="private__instruction">DOES THE SENSATION RECUR? YOU ALONE CAN SAY.</p>
            <div className="private__row">
              <Btn onClick={() => judge(true)}>SAME SENSATION: YES</Btn>
              <Btn onClick={() => judge(false)}>SAME SENSATION: NO</Btn>
            </div>
            <p className="private__note">SO FAR, ONLY YOU COULD CHECK. NOTE THE WORD “COULD”.</p>
          </div>
        )}

        {phase === 'criteria' && (
          <div className="private__phasebox">
            <p className="private__instruction">{CRITERION_CHALLENGES[0].prompt}</p>
            <div className="private__row">
              {CRITERION_CHALLENGES[0].options.map((option) => (
                <Btn key={option.id} onClick={() => answerCriterion(option)}>
                  {option.label}
                </Btn>
              ))}
            </div>
            {challengeResponse && <p className="private__response">{challengeResponse}</p>}
            <Btn variant="ghost" onClick={refusePublic}>
              REFUSE PUBLIC CRITERIA
            </Btn>
            {refusals > 0 && <p className="private__note">{note}</p>}
          </div>
        )}

        {phase === 'practice' && (
          <div className="private__phasebox">
            <p className="private__instruction">{exercise.prompt}</p>
            <div className="private__row">
              {exercise.options.map((option) => (
                <Btn key={option.id} onClick={() => answerUse(option)}>
                  {option.label}
                </Btn>
              ))}
            </div>
            {challengeResponse && <p className="private__response">{challengeResponse}</p>}
          </div>
        )}

        {phase === 'chains' && (
          <div className="private__phasebox">
            <p className="private__instruction">{chain.question}</p>
            <div className="private__row">
              {chain.options.map((option) => (
                <Btn key={option} onClick={answerChain}>
                  {option}
                </Btn>
              ))}
            </div>
            <p className="private__note">
              DISTINCTION {chainIndex + 1} OF {CHAIN_QUESTIONS.length}. EACH ANSWER IS WORKABLE AND EACH OPENS ANOTHER.
            </p>
            {phase === 'chains' && chainIndex === CHAIN_QUESTIONS.length - 1 && (
              <p className="private__response">{LINES.chainDone}</p>
            )}
          </div>
        )}

        {phase === 'complete' && (
          <div className="private__phasebox">
            <p className="private__response">
              {api.contaminantId === 'cm-011-terms'
                ? LINES.chainDone
                : LINES.criteriaEstablished}
            </p>
            <p className="private__note">
              THE DIARY REMAINS OPEN. IT IS NO LONGER PRIVATE IN THE SENSE THAT FAILED.
            </p>
          </div>
        )}
      </div>

      <aside className="private__diary" aria-label="Diary record">
        <Microlabel>NOTEBOOK</Microlabel>
        <div className="private__diarylines">
          {fixed && <p>· {SIGN} — FIXED TO A SENSATION. OSTENSIVELY. BY NO ONE CHECKABLE.</p>}
          {judgements.map((j, i) => (
            <p key={`${j.episode}-${i}`}>· EPISODE {j.episode.toUpperCase()} — JUDGED {j.same ? 'SAME' : 'DIFFERENT'}. GROUND: WITHHELD.</p>
          ))}
          {refusals > 0 && <p>· PUBLIC CRITERIA REFUSED ({refusals}×). SEEMINGS FILED.</p>}
          {phase === 'complete' && <p>· CRITERIA: PUBLIC. USE: SHARED. “PRIVATE” REMAINS AS A WORD AMONG WORDS.</p>}
        </div>
      </aside>
    </div>
  )
}
