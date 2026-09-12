import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useMachine } from '@/machines/context'
import { Btn, Microlabel } from '@/shell/ui'
import {
  GENERATIONS_FOR_COMPLETION,
  INITIAL_PARAMS,
  LINES,
  identityScore,
  lineageName,
  transform,
  type GenealogyNode,
} from './machine'
import './difference.css'

export default function Machine() {
  const api = useMachine()
  const [nodes, setNodes] = useState<GenealogyNode[]>([
    { id: 0, parentId: null, generation: 0, params: INITIAL_PARAMS },
  ])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [completed, setCompleted] = useState(false)
  const idRef = useRef(0)
  const repeatCounts = useRef(new Map<number, number>())

  const total = nodes.length
  const selected = nodes.find((n) => n.id === selectedId) ?? nodes[nodes.length - 1]
  const latest = nodes[nodes.length - 1]
  const identity = useMemo(
    () => identityScore(nodes.filter((n) => n.generation >= Math.max(0, latest.generation - 6))),
    [nodes, latest],
  )
  const name = useMemo(() => lineageName(nodes), [nodes])

  const repeat = useCallback(() => {
    const source = nodes.find((n) => n.id === (selectedId ?? latest.id)) ?? latest
    const child: GenealogyNode = {
      id: ++idRef.current,
      parentId: source.id,
      generation: source.generation + 1,
      params: transform(source.params, source.id * 2654435761 + idRef.current * 40503),
    }
    setNodes((prev) => [...prev, child])
    setSelectedId(child.id)
    /* asking for the same repetition repeatedly is itself recorded */
    const count = (repeatCounts.current.get(source.id) ?? 0) + 1
    repeatCounts.current.set(source.id, count)
    if (count === 3) {
      api.secret('reproduction-impossible', 'UR-010', 'REPRODUCTION IMPOSSIBLE')
    }
    api.play('key', 0.6)
  }, [nodes, selectedId, latest, api])

  useEffect(() => {
    if (total >= GENERATIONS_FOR_COMPLETION && !completed) {
      const t = window.setTimeout(() => {
        setCompleted(true)
        api.play('complete', 0.6)
        api.complete('difference:genealogy-emerged')
      }, 1200)
      return () => window.clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- completion once
  }, [total])

  const generations = latest.generation
  const branches = new Set(nodes.filter((n) => n.parentId !== null).map((n) => n.parentId)).size

  return (
    <div className="difference">
      <header className="difference__head">
        <Microlabel>SPECIMEN BENCH — REPETITION WITHOUT REPRODUCTION</Microlabel>
        <div className="difference__stats">
          <span>GENERATIONS: {generations}</span>
          <span>SPECIMENS: {total}</span>
          <span>BRANCHES: {branches}</span>
          <span>LINEAGE: {name}</span>
          <span className={identity < 0.35 ? 'is-low' : undefined}>
            IDENTITY: {(identity * 100).toFixed(0)}%{identity < 0.35 ? ' (PROVISIONAL)' : ''}
          </span>
        </div>
      </header>

      <div className="difference__main">
        <div className="difference__bench">
          <SpecimenView params={selected.params} label={`SPECIMEN #${selected.id}`} />
          <p className="difference__sourceline">
            SOURCE: {selected.parentId === null ? 'THE FIRST OBJECT (GIVEN)' : `SPECIMEN #${selected.parentId} — GENERATION ${selected.generation}`}
          </p>
          <Btn variant="primary" onClick={repeat}>
            [ REPEAT ]
          </Btn>
          <p className="difference__note">
            {generations >= 6 ? LINES.noReproduction : 'THE ACTION IS CALLED REPETITION. NOTHING ELSE IS PROMISED.'}
          </p>
        </div>

        <div className="difference__genealogy">
          <Microlabel>GENEALOGY — SELECT A NODE TO REPEAT FROM THERE</Microlabel>
          <div className="difference__tree">
            {nodes.slice(-24).map((node) => (
              <button
                key={node.id}
                className={`difference__node${node.id === selected.id ? ' is-selected' : ''}`}
                onClick={() => setSelectedId(node.id)}
                title={`Generation ${node.generation}`}
                style={{
                  marginLeft: node.generation * 8,
                }}
              >
                <SpecimenGlyph params={node.params} />
                <span className="difference__nodeid">#{node.id}</span>
              </button>
            ))}
          </div>
          {total >= 8 && <p className="difference__resemblance">{LINES.resemblance}</p>}
          {identity < 0.35 && <p className="difference__resemblance">{LINES.identityProvisional}</p>}
        </div>
      </div>

      {completed && (
        <div className="difference__verdict" role="status">
          <p>{LINES.genealogyEmerged}</p>
        </div>
      )}
    </div>
  )
}

export function SpecimenView({
  params,
  label,
}: {
  params: { sides: number; radius: number; irregularity: number; rotation: number; hue: number; thickness: number }
  label: string
}) {
  return (
    <div className="difference__specimen">
      <SpecimenGlyph params={params} large />
      <span className="difference__speclabel">{label}</span>
    </div>
  )
}

function SpecimenGlyph({ params, large }: { params: { sides: number; radius: number; irregularity: number; rotation: number; hue: number; thickness: number }; large?: boolean }) {
  const points: string[] = []
  const count = params.sides
  const size = large ? 88 : 16
  for (let i = 0; i < count; i++) {
    const baseAngle = (i / count) * Math.PI * 2 + (params.rotation * Math.PI) / 180
    const wobble = Math.sin(i * 7.13 + params.rotation * 0.11) * params.irregularity
    const r = size * (0.82 + wobble) * (params.radius / 40)
    const x = Math.cos(baseAngle) * r
    const y = Math.sin(baseAngle) * r
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`)
  }
  return (
    <svg
      viewBox="-70 -70 140 140"
      className={`difference__glyph${large ? ' difference__glyph--large' : ''}`}
      role="img"
      aria-label="Specimen"
    >
      <polygon
        points={points.join(' ')}
        fill="none"
        stroke={`hsl(${params.hue.toFixed(0)}, 42%, 62%)`}
        strokeWidth={params.thickness}
      />
    </svg>
  )
}
