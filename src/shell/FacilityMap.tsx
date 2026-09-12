import { machinesInZone, ZONES, type ZoneId } from '@/machines/registry'
import { useRecord } from '@/state/record'
import { navigate } from '@/router/router'
import { audio } from '@/audio/engine'
import { Microlabel } from './ui'
import './facilitymap.css'

/**
 * Schematic floor plan. Spatial model without a 3D engine: zones are
 * outlines, apparatuses are squares, the restricted wing stays sealed.
 */

const LAYOUT: Record<ZoneId, { x: number; y: number; w: number; h: number }> = {
  'west-wing': { x: 40, y: 50, w: 250, h: 210 },
  'central-hall': { x: 320, y: 50, w: 260, h: 210 },
  'east-wing': { x: 610, y: 50, w: 250, h: 210 },
  'lower-archive': { x: 40, y: 310, w: 250, h: 210 },
  'still-room': { x: 320, y: 310, w: 115, h: 100 },
  restricted: { x: 465, y: 310, w: 115, h: 100 },
  'service-corridor': { x: 610, y: 310, w: 250, h: 210 },
}

/** deterministic dot placement inside each zone */
const DOT_GRID: Array<[number, number]> = [
  [0.22, 0.3],
  [0.52, 0.3],
  [0.8, 0.3],
  [0.22, 0.62],
  [0.52, 0.62],
  [0.8, 0.62],
]

export function FacilityMap() {
  const record = useRecord()

  return (
    <div className="page facilitymap">
      <header className="page-head">
        <Microlabel>Schematic level 0 — not to scale, to scale being a policy decision</Microlabel>
        <h1>FACILITY MAP</h1>
        <p className="facilitymap__hint">
          SELECT A SQUARE TO ENTER AN APPARATUS. SELECT A ZONE LABEL TO FILTER THE CATALOGUE.
        </p>
      </header>

      <svg
        viewBox="0 0 900 570"
        className="facilitymap__svg"
        role="group"
        aria-label="Schematic floor plan of the facility"
      >
        {/* outer boundary */}
        <rect x="16" y="16" width="868" height="538" fill="none" stroke="var(--line-strong)" strokeWidth="1" />
        {/* corridor connectors */}
        <line x1="290" y1="155" x2="320" y2="155" stroke="var(--line)" />
        <line x1="580" y1="155" x2="610" y2="155" stroke="var(--line)" />
        <line x1="450" y1="260" x2="450" y2="310" stroke="var(--line)" />
        <line x1="165" y1="260" x2="165" y2="310" stroke="var(--line)" />
        <line x1="735" y1="260" x2="735" y2="310" stroke="var(--line)" />
        <line x1="377" y1="360" x2="465" y2="360" stroke="var(--line)" strokeDasharray="3 4" />

        {ZONES.map((zone) => {
          const layout = LAYOUT[zone.id]
          const machines = machinesInZone(zone.id)
          const restricted = zone.id === 'restricted'
          return (
            <g key={zone.id} className={`facilitymap__zone${restricted ? ' facilitymap__zone--restricted' : ''}`}>
              <rect
                x={layout.x}
                y={layout.y}
                width={layout.w}
                height={layout.h}
                fill="var(--ink-2)"
                stroke={restricted ? 'var(--alert-dim)' : 'var(--line-strong)'}
                strokeDasharray={restricted ? '5 5' : undefined}
              />
              <text
                x={layout.x + 10}
                y={layout.y + 20}
                className="facilitymap__zonetitle"
                onClick={() => !restricted && navigate({ name: 'catalogue' })}
              >
                {zone.title}
              </text>
              <text x={layout.x + 10} y={layout.y + 34} className="facilitymap__zonesub">
                {restricted ? 'ACCESS NOT PREAUTHORIZED' : zone.subtitle}
              </text>

              {restricted ? (
                <text
                  x={layout.x + layout.w / 2}
                  y={layout.y + layout.h / 2 + 4}
                  textAnchor="middle"
                  className="facilitymap__sealed"
                >
                  SEALED
                </text>
              ) : (
                machines.map((machine, index) => {
                  const [fx, fy] = DOT_GRID[index % DOT_GRID.length]
                  const x = layout.x + layout.w * fx
                  const y = layout.y + layout.h * fy + 14
                  const visited = (record.machines[machine.id]?.enteredCount ?? 0) > 0
                  return (
                    <g
                      key={machine.id}
                      className={`facilitymap__dot${visited ? ' is-visited' : ''}`}
                      tabIndex={0}
                      role="link"
                      aria-label={`${machine.code} ${machine.title}`}
                      onClick={() => navigate({ name: 'machine', id: machine.id })}
                      onKeyDown={(e) => e.key === 'Enter' && navigate({ name: 'machine', id: machine.id })}
                      onMouseEnter={() => audio.play('hover')}
                    >
                      <rect x={x - 7} y={y - 7} width={26} height={14} className="facilitymap__dotbox" />
                      <text x={x + 6} y={y + 3} textAnchor="middle" className="facilitymap__dotcode">
                        {machine.code.replace('CM-', '')}
                      </text>
                      <title>{`${machine.code} — ${machine.title}`}</title>
                    </g>
                  )
                })
              )}
            </g>
          )
        })}

        <text x="28" y="548" className="facilitymap__legend">
          INSTITUTIONAL FOOTPRINT: 1,124 m² — VERIFIED ONLY IN PLAN VIEW
        </text>
      </svg>
    </div>
  )
}
