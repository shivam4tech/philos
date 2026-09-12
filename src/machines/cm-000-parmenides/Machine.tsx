import { useEffect, useRef, useState } from 'react'

import { useMachine } from '@/machines/context'
import { usePressable } from '@/interact/micro'
import { Microlabel } from '@/shell/ui'
import {
  INITIAL_WORLD,
  LINES,
  STEPS_BEFORE_THE_DOOR_RETREATS,
  avatarCoordinates,
  exitDistance,
  stepWorld,
  type WorldState,
} from './machine'
import './parmenides.css'

type Phase = 'instructed' | 'moving' | 'door-retreats' | 'verdict'

export default function Machine() {
  const api = useMachine()
  const [world, setWorld] = useState<WorldState>(INITIAL_WORLD)
  const [phase, setPhase] = useState<Phase>('instructed')
  const [zeno, setZeno] = useState(false)
  const [, setReadouts] = useState(0)
  const steps = useRef(0)
  const readoutsRef = useRef(0)

  const move = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (phase === 'verdict') return
    setWorld((w) => stepWorld(w, direction))
    steps.current += 1
    if (phase === 'instructed') setPhase('moving')
    api.play('key', 0.4)
    if (steps.current === Math.floor(STEPS_BEFORE_THE_DOOR_RETREATS / 2)) {
      setZeno(true)
      api.play('recurrence', 0.4)
      window.setTimeout(() => setZeno(false), 2600)
    }
    if (steps.current >= STEPS_BEFORE_THE_DOOR_RETREATS && phase !== 'door-retreats') {
      setPhase('door-retreats')
      api.play('invalid', 0.6)
      window.setTimeout(() => {
        setPhase('verdict')
        api.play('complete', 0.6)
        api.complete('motion:exit-refused')
      }, 2600)
    }
  }

  /* keyboard movement */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, 'up' | 'down' | 'left' | 'right'> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        s: 'down',
        a: 'left',
        d: 'right',
      }
      const direction = map[e.key]
      if (direction) {
        e.preventDefault()
        move(direction)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- move reads current phase via closure
  }, [phase])

  const coords = avatarCoordinates(world)
  const distance = exitDistance(world)

  const consultCoordinates = () => {
    readoutsRef.current += 1
    setReadouts(readoutsRef.current)
    api.play('tick', 0.4)
    if (readoutsRef.current === 3) {
      api.secret('coordinate-piety', 'UR-014', 'COORDINATE PIETY')
    }
  }

  return (
    <div className="parmenides">
      <header className="parmenides__head">
        <Microlabel>RESTRICTED APPARATUS — ONTOLOGICAL LOCOMOTION TEST</Microlabel>
        <button className="parmenides__readout" onClick={consultCoordinates}>
          {LINES.readout}: X {coords.x.toFixed(2)} — Y {coords.y.toFixed(2)}
        </button>
      </header>

      <div className="parmenides__stage">
        <div
          className="parmenides__world"
          style={{ transform: `translate(${world.offsetX}px, ${world.offsetY}px)` }}
        >
          {/* the world is drawn as a grid of posts; the avatar is not among them */}
          {Array.from({ length: 60 }).map((_, i) => {
            const x = (i % 10) * 90
            const y = Math.floor(i / 10) * 90
            return (
              <span
                key={i}
                className="parmenides__post"
                style={{ left: x, top: y }}
              />
            )
          })}
          <span className="parmenides__door" style={{ left: 460, top: 140 }}>
            EXIT
          </span>
        </div>
        <span className="parmenides__avatar" aria-label="Subject position (fixed)" />
        {zeno && <div className="parmenides__zeno">{LINES.halfway}</div>}
        {phase === 'door-retreats' && <div className="parmenides__retreat">{LINES.doorRetreats}</div>}
        {phase === 'instructed' && <div className="parmenides__instruction">{LINES.instruction}</div>}
      </div>

      <footer className="parmenides__footer">
        <span className="parmenides__distance">
          DISTANCE TO EXIT: {distance.toFixed(1)} — ARROWS / WASD / TOUCH
        </span>
        <div className="parmenides__pad">
          {(['up', 'left', 'down', 'right'] as const).map((dir) => (
            <MoveButton key={dir} dir={dir} onMove={() => move(dir)} />
          ))}
        </div>
      </footer>

      {phase === 'verdict' && (
        <div className="parmenides__verdict" role="status">
          {LINES.verdict.map((line, i) => (
            <p key={line} style={{ animationDelay: `${i * 650}ms` }}>
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

function MoveButton({ dir, onMove }: { dir: 'up' | 'down' | 'left' | 'right'; onMove: () => void }) {
  const props = usePressable({ sfx: false })
  const glyph = { up: '↑', down: '↓', left: '←', right: '→' }[dir]
  return (
    <button className={`parmenides__move parmenides__move--${dir}`} {...props} onClick={onMove} aria-label={`Move ${dir}`}>
      {glyph}
    </button>
  )
}
