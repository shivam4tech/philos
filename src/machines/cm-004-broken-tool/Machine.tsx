import { useCallback, useEffect, useRef, useState } from 'react'

import { useMachine } from '@/machines/context'
import { Microlabel } from '@/shell/ui'
import {
  BREAKDOWN_STAGES,
  COMPONENT_LABELS,
  STAGE_LABELS,
  TOTAL_CRATES,
  breakdownLevelFor,
  dragResistance,
} from './machine'
import './brokentool.css'

interface CrateState {
  id: number
  code: string
  x: number
  y: number
  placedZone: number | null
}

const INITIAL_CRATES: CrateState[] = [
  { id: 0, code: 'C-01', x: 12, y: 68, placedZone: null },
  { id: 1, code: 'C-02', x: 30, y: 74, placedZone: null },
  { id: 2, code: 'C-03', x: 48, y: 66, placedZone: null },
  { id: 3, code: 'C-04', x: 66, y: 75, placedZone: null },
  { id: 4, code: 'C-05', x: 82, y: 67, placedZone: null },
  { id: 5, code: 'C-06', x: 22, y: 86, placedZone: null },
]

const ZONES = [
  { id: 0, x: 6, y: 10, label: 'SHELF A' },
  { id: 1, x: 38, y: 10, label: 'SHELF B' },
  { id: 2, x: 70, y: 10, label: 'SHELF C' },
]

export default function Machine() {
  const api = useMachine()
  const [crates, setCrates] = useState<CrateState[]>(INITIAL_CRATES)
  const [level, setLevel] = useState(0)
  const [stageNote, setStageNote] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)
  const [cursorDrift, setCursorDrift] = useState({ x: 0, y: 0 })
  const [labelsVisible, setLabelsVisible] = useState(false)

  const stageRef = useRef<HTMLDivElement | null>(null)
  const dragRef = useRef<{ id: number; px0: number; py0: number; originX: number; originY: number } | null>(null)
  const zoneRefs = useRef<Array<HTMLDivElement | null>>([])
  const brokenClicks = useRef(0)
  const completedRef = useRef(false)

  const placed = crates.filter((c) => c.placedZone !== null).length

  useEffect(() => {
    const nextLevel = breakdownLevelFor(placed)
    if (nextLevel > level) {
      setLevel(nextLevel)
      const stage = BREAKDOWN_STAGES.find((s) => s.level === nextLevel)
      if (stage) {
        setStageNote(stage.note)
        api.play('warning', 0.5)
        window.setTimeout(() => setStageNote(null), 4200)
      }
    }
    if (nextLevel >= 2) setLabelsVisible(true)
    if (placed >= TOTAL_CRATES && !completedRef.current) {
      completedRef.current = true
      window.setTimeout(() => {
        setCompleted(true)
        api.complete('tool:equipment-objectified')
      }, 1100)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- level read per placement
  }, [placed])

  /* cursor drift at level 2+ — the pointer stops pointing where it points */
  useEffect(() => {
    if (level < 2) return
    const onMove = (e: PointerEvent) => {
      setCursorDrift({
        x: e.clientX + Math.sin(e.clientX / 40) * 12,
        y: e.clientY + Math.cos(e.clientY / 36) * 9,
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [level])

  const onCrateDown = useCallback(
    (event: React.PointerEvent, crate: CrateState) => {
      if (crate.placedZone !== null || completed) return
      const stage = stageRef.current
      if (!stage) return
      const rect = stage.getBoundingClientRect()
      const px = ((event.clientX - rect.left) / rect.width) * 100
      const py = ((event.clientY - rect.top) / rect.height) * 100
      dragRef.current = { id: crate.id, px0: px, py0: py, originX: crate.x, originY: crate.y }
      ;(event.target as HTMLElement).setPointerCapture?.(event.pointerId)
      api.play('key', 0.5)
    },
    [completed, api],
  )

  const onCrateMove = useCallback(
    (event: React.PointerEvent) => {
      const drag = dragRef.current
      const stage = stageRef.current
      if (!drag || !stage) return
      const rect = stage.getBoundingClientRect()
      const resistance = dragResistance(level)
      const px = ((event.clientX - rect.left) / rect.width) * 100
      const py = ((event.clientY - rect.top) / rect.height) * 100
      const jitter = level >= 2 ? (Math.random() - 0.5) * 1.4 : 0
      const nx = Math.max(3, Math.min(94, drag.originX + (px - drag.px0) * resistance + jitter))
      const ny = Math.max(4, Math.min(92, drag.originY + (py - drag.py0) * resistance + jitter))
      setCrates((prev) => prev.map((c) => (c.id === drag.id ? { ...c, x: nx, y: ny } : c)))
    },
    [level],
  )

  const onCrateUp = useCallback(
    (event: React.PointerEvent) => {
      const drag = dragRef.current
      dragRef.current = null
      if (!drag) return
      const targetZones = zoneRefs.current
      const dropZone = targetZones.findIndex((zone) => {
        if (!zone) return false
        const rect = zone.getBoundingClientRect()
        return (
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom
        )
      })
      if (dropZone >= 0) {
        const zone = ZONES[dropZone]
        const zoneCrates = crates.filter((c) => c.placedZone === dropZone).length
        const slotIndex = zoneCrates
        setCrates((prev) =>
          prev.map((c) =>
            c.id === drag.id
              ? { ...c, placedZone: dropZone, x: zone.x + slotIndex * 11 + 2, y: zone.y + 14 }
              : c,
          ),
        )
        api.play('toggle', 0.8)
      } else {
        api.play('tick', 0.5)
      }
    },
    [crates, api],
  )

  /* keyboard path — exempt from breakdown, always functional */
  const keyboardPlace = (crateId: number, zoneId: number) => {
    if (completed) return
    const zone = ZONES[zoneId]
    const zoneCrates = crates.filter((c) => c.placedZone === zoneId).length
    if (zoneCrates >= 2) {
      api.failure()
      return
    }
    setCrates((prev) =>
      prev.map((c) =>
        c.id === crateId && c.placedZone === null
          ? { ...c, placedZone: zoneId, x: zone.x + zoneCrates * 11 + 2, y: zone.y + 14 }
          : c,
      ),
    )
    api.play('toggle', 0.8)
  }

  const brokenSlotClick = () => {
    brokenClicks.current += 1
    api.play('invalid', 0.6)
    if (brokenClicks.current === 3) {
      api.secret('obstinate-instrument', 'UR-006', 'OBSTINATE INSTRUMENT')
    }
  }

  const unplaced = crates.filter((c) => c.placedZone === null)

  return (
    <div className={`btool btool--level${level}`}>
      <header className="btool__head">
        <Microlabel>MATERIAL HANDLING — ROUTINE TASK</Microlabel>
        <span className="btool__progress">{STAGE_LABELS.placed(placed)}</span>
        {stageNote && (
          <span className="btool__note" role="status">
            {stageNote}
          </span>
        )}
      </header>

      <div
        ref={stageRef}
        className={`btool__stage${labelsVisible ? ' btool__stage--conspicuous' : ''}`}
        onPointerMove={onCrateMove}
        onPointerUp={onCrateUp}
      >
        {ZONES.map((zone, index) => (
          <div
            key={zone.id}
            ref={(el) => {
              zoneRefs.current[index] = el
            }}
            className={`btool__zone${level >= 3 && index === 2 ? ' is-broken' : ''}`}
            style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
            onClick={level >= 3 && index === 2 ? brokenSlotClick : undefined}
            data-component="div.zone__drop_target"
          >
            <span className="btool__zonelabel">{zone.label}</span>
            {level >= 3 && index === 2 && (
              <span className="btool__zonedefect">{STAGE_LABELS.unhandled}</span>
            )}
          </div>
        ))}

        {crates.map((crate) => (
          <button
            key={crate.id}
            className={`btool__crate${crate.placedZone !== null ? ' is-placed' : ''}`}
            style={{ left: `${crate.x}%`, top: `${crate.y}%` }}
            data-component="div.crate_manifest"
            onPointerDown={(e) => onCrateDown(e, crate)}
            aria-label={`Crate ${crate.code}${crate.placedZone !== null ? ', shelved' : ''}`}
          >
            {crate.code}
          </button>
        ))}

        {labelsVisible &&
          COMPONENT_LABELS.slice(0, 2 + level).map((label, i) => (
            <span
              key={label}
              className="btool__tag"
              style={{ left: `${10 + i * 15}%`, top: `${38 + (i % 3) * 9}%` }}
            >
              {label}
            </span>
          ))}

        {level >= 2 && cursorDrift.x !== 0 && (
          <div
            className="btool__driftcursor"
            style={{ left: cursorDrift.x, top: cursorDrift.y }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* keyboard operation — exempt from breakdown, always functional */}
      <div className="btool__keys">
        <Microlabel>KEYBOARD OPERATION (EXEMPT FROM BREAKDOWN)</Microlabel>
        <div className="btool__keysrow">
          {ZONES.map((zone, zoneId) => (
            <select
              key={zone.id}
              aria-label={`Place crate on ${zone.label}`}
              onChange={(e) => {
                if (e.target.value !== '') keyboardPlace(Number(e.target.value), zoneId)
              }}
              value=""
            >
              <option value="" disabled>
                PLACE CRATE ON {zone.label}…
              </option>
              {unplaced.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>

      {completed && (
        <div className="btool__verdict" role="status">
          <p className="btool__verdictline">{STAGE_LABELS.objectified}</p>
        </div>
      )}
    </div>
  )
}
