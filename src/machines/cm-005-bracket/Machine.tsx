import { useEffect, useRef, useState } from 'react'

import { useMachine } from '@/machines/context'
import { Btn, Microlabel } from '@/shell/ui'
import { LAYERS, VERDICT, bucketForAngle, type ViewBucket } from './machine'
import './bracket.css'

export default function Machine() {
  const api = useMachine()
  const [bracketed, setBracketed] = useState(0)
  const [angle, setAngle] = useState(0)
  const [elevated, setElevated] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [secretFired, setSecretFired] = useState(false)
  const dragging = useRef<{ x: number; angle: number } | null>(null)

  const view = bucketForAngle(angle)
  const allBracketed = bracketed >= LAYERS.length

  /* completion once every layer is bracketed */
  useEffect(() => {
    if (allBracketed && !completed) {
      const t = window.setTimeout(() => {
        setCompleted(true)
        api.complete('bracket:constitution-complete')
      }, 1400)
      return () => window.clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- completion once
  }, [allBracketed])

  const bracket = () => {
    if (allBracketed) {
      // reflexive bracketing: bracket the BRACKET button
      if (!secretFired) {
        setSecretFired(true)
        api.secret('reflexive-bracketing', 'UR-017', 'REFLEXIVE BRACKETING')
      }
      return
    }
    setBracketed((b) => Math.min(LAYERS.length, b + 1))
    api.play('semantic-shift', 0.7)
  }

  /* rotation drag */
  const onDown = (e: React.PointerEvent) => {
    if (bracketed < 2) return
    dragging.current = { x: e.clientX, angle }
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  }
  const onMove = (e: React.PointerEvent) => {
    const drag = dragging.current
    if (!drag) return
    setAngle(drag.angle + (e.clientX - drag.x) * 0.6)
  }
  const onUp = () => {
    dragging.current = null
  }

  return (
    <div className="bracket">
      <header className="bracket__head">
        <Microlabel>PHENOMENOLOGICAL DEBUGGING CONSOLE — OBJECT: CHAIR</Microlabel>
        <span className="bracket__count">
          LAYER {bracketed}/{LAYERS.length}
        </span>
      </header>

      <div className="bracket__main">
        <div
          className={`bracket__viewport${bracketed >= 2 ? ' is-rotatable' : ''}`}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
        >
          <ChairView view={view} elevated={elevated && bracketed >= 5} bracketed={bracketed} />
          {bracketed === 0 && <p className="bracket__objectname">CHAIR</p>}
          {bracketed >= 4 && <span className="bracket__here">HERE</span>}
        </div>

        <div className="bracket__console">
          <div className="bracket__log" aria-live="polite">
            {LAYERS.slice(0, bracketed).map((layer, i) => (
              <p
                key={layer.id}
                className={`bracket__logline${i === bracketed - 1 ? ' is-current' : ''}`}
              >
                <span className="bracket__logtitle">{layer.title}</span>
                {layer.line}
              </p>
            ))}
            {bracketed === 0 && (
              <p className="bracket__logline is-current">
                <span className="bracket__logtitle">NATURAL ATTITUDE</span>
                THIS IS A CHAIR. IT EXISTS IN THE ROOM. IT IS SIMPLY HERE.
              </p>
            )}
          </div>

          {bracketed >= 2 && (
            <div className="bracket__angleui">
              <Microlabel>ANGLE {((angle % 360) + 360) % 360 | 0}° — VIEW: {view.toUpperCase()}</Microlabel>
              <input
                type="range"
                min={0}
                max={360}
                value={((angle % 360) + 360) % 360 | 0}
                onChange={(e) => setAngle(Number(e.target.value))}
                aria-label="Rotation angle"
              />
            </div>
          )}
          {bracketed >= 5 && (
            <label className="bracket__elev">
              <input
                type="checkbox"
                checked={elevated}
                onChange={(e) => setElevated(e.target.checked)}
              />
              <span>VIEW FROM ABOVE (BODILY REORIENTATION)</span>
            </label>
          )}

          <Btn variant={allBracketed ? 'ghost' : 'primary'} onClick={bracket} className="bracket__btn">
            [ BRACKET ]
          </Btn>
        </div>
      </div>

      {completed && (
        <div className="bracket__verdict" role="status">
          <p>{VERDICT}</p>
        </div>
      )}
    </div>
  )
}

/** The chair, drawn once per canonical profile. Not a 3-D model: profiles. */
function ChairView({
  view,
  elevated,
  bracketed,
}: {
  view: ViewBucket
  elevated: boolean
  bracketed: number
}) {
  const effective: ViewBucket = elevated ? 'top' : view
  return (
    <svg viewBox="0 0 200 200" className="bracket__chair" role="img" aria-label={`Chair profile: ${effective}`}>
      <defs>
        <linearGradient id="chairFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2f2a" />
          <stop offset="100%" stopColor="#1a1e1a" />
        </linearGradient>
      </defs>
      <g stroke="var(--line-strong)" fill="url(#chairFill)" strokeWidth="1.2">
        {effective === 'front' && (
          <>
            <rect x="60" y="40" width="80" height="70" />
            <rect x="55" y="108" width="90" height="12" />
            <rect x="60" y="120" width="8" height="52" />
            <rect x="132" y="120" width="8" height="52" />
            <rect x="80" y="120" width="6" height="44" />
            <rect x="114" y="120" width="6" height="44" />
          </>
        )}
        {effective === 'side' && (
          <>
            <rect x="70" y="30" width="14" height="80" />
            <rect x="70" y="105" width="86" height="12" />
            <rect x="74" y="117" width="8" height="55" />
            <rect x="146" y="117" width="8" height="55" />
          </>
        )}
        {effective === 'side-r' && (
          <g transform="translate(200,0) scale(-1,1)">
            <rect x="70" y="30" width="14" height="80" />
            <rect x="70" y="105" width="86" height="12" />
            <rect x="74" y="117" width="8" height="55" />
            <rect x="146" y="117" width="8" height="55" />
          </g>
        )}
        {effective === 'back' && (
          <>
            <rect x="60" y="34" width="80" height="80" />
            <rect x="55" y="112" width="90" height="10" />
            <rect x="60" y="122" width="8" height="50" />
            <rect x="132" y="122" width="8" height="50" />
          </>
        )}
        {effective === 'three-quarter' && (
          <>
            <polygon points="64,44 128,36 136,96 72,106" />
            <polygon points="55,110 128,100 145,112 66,124" />
            <polygon points="66,124 74,122 76,168 68,170" />
            <polygon points="134,118 143,114 146,158 138,160" />
            <polygon points="100,122 108,120 110,162 102,164" />
          </>
        )}
        {effective === 'top' && (
          <>
            <rect x="55" y="70" width="90" height="60" />
            <rect x="55" y="55" width="90" height="14" />
            <line x1="55" y1="130" x2="145" y2="130" strokeDasharray="3 4" />
          </>
        )}
      </g>
      {bracketed >= 3 && (
        <g className="bracket__horizon">
          <circle cx="100" cy="100" r="86" fill="none" stroke="var(--line)" strokeDasharray="4 6" />
          <text x="100" y="26" textAnchor="middle" className="bracket__horizontext">
            HORIZON OF CO-GIVEN PROFILES
          </text>
        </g>
      )}
    </svg>
  )
}
