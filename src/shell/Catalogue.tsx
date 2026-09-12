import { useEffect, useMemo, useRef, useState } from 'react'

import {
  cataloguedMachines,
  machinesInZone,
  ZONES,
  type MachineMeta,
  type ZoneId,
} from '@/machines/registry'
import { useRecord } from '@/state/record'
import { advanceSearchStage, bumpMetric, useLab } from '@/state/lab'
import { audio } from '@/audio/engine'
import { usePressable } from '@/interact/micro'
import { navigate } from '@/router/router'
import { Microlabel } from './ui'
import './catalogue.css'

const SEARCH_CHAIN = [
  'SEARCH THE CATALOGUE',
  'WHAT ARE YOU LOOKING FOR?',
  'WHAT DO YOU EXPECT TO FIND?',
  'WHO DO YOU EXPECT TO FIND IT FOR?',
]

type ZoneFilter = ZoneId | 'all'

export function Catalogue() {
  const record = useRecord()
  const lab = useLab()
  const [zoneFilter, setZoneFilter] = useState<ZoneFilter>('all')
  const [query, setQuery] = useState('')
  const [flickerId, setFlickerId] = useState<string | null>(null)

  const searchInterrogation = lab.contamination.some((e) => e.effectId === 'search-interrogation')
  const remoteActivation = lab.contamination.some((e) => e.effectId === 'remote-activation')

  useEffect(() => {
    if (searchInterrogation) advanceSearchStage()
  }, [searchInterrogation])

  useEffect(() => {
    if (!remoteActivation) return
    const visible = cataloguedMachines()
    const target = visible[Math.floor(Math.random() * visible.length)]
    setFlickerId(target.id)
    audio.play('power-on', { gain: 0.5 })
    const t = window.setTimeout(() => setFlickerId(null), 6000)
    return () => window.clearTimeout(t)
  }, [remoteActivation])

  const machines = zoneFilter === 'all' ? cataloguedMachines() : machinesInZone(zoneFilter).filter((m) => !m.hidden)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return machines
    return machines.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.thinker.toLowerCase().includes(q) ||
        m.concepts.some((c) => c.toLowerCase().includes(q)) ||
        m.code.toLowerCase().includes(q),
    )
  }, [machines, query])

  return (
    <div className="page catalogue">
      <header className="page-head">
        <Microlabel>Apparatus directory — research equipment, not content</Microlabel>
        <h1>MACHINE CATALOGUE</h1>
        <div className="catalogue__controls">
          <div className="catalogue__zones" role="group" aria-label="Filter by wing">
            <ZoneChip label="ALL ZONES" active={zoneFilter === 'all'} onClick={() => setZoneFilter('all')} />
            {ZONES.filter((z) => z.id !== 'restricted').map((zone) => (
              <ZoneChip
                key={zone.id}
                label={zone.code}
                active={zoneFilter === zone.id}
                onClick={() => setZoneFilter(zone.id)}
              />
            ))}
          </div>
          <input
            className="catalogue__search"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              audio.play('tick', { gain: 0.5 })
            }}
            placeholder={SEARCH_CHAIN[Math.min(lab.searchStage, SEARCH_CHAIN.length - 1)]}
            aria-label="Search the machine catalogue"
          />
        </div>
      </header>

      {zoneFilter === 'all' ? (
        ZONES.filter((z) => z.id !== 'restricted').map((zone) => (
          <ZoneSection
            key={zone.id}
            zoneId={zone.id}
            machines={filtered.filter((m) => m.zone === zone.id)}
            record={record}
            flickerId={flickerId}
          />
        ))
      ) : (
        <ZoneSection
          zoneId={zoneFilter}
          machines={filtered}
          record={record}
          flickerId={flickerId}
        />
      )}

      {filtered.length === 0 && (
        <p className="catalogue__empty">NO APPARATUS MATCHES. THE INSTITUTE SUGGESTS WANTING LESS SPECIFICALLY.</p>
      )}
    </div>
  )
}

function ZoneSection({
  zoneId,
  machines,
  record,
  flickerId,
}: {
  zoneId: ZoneId
  machines: MachineMeta[]
  record: ReturnType<typeof useRecord>
  flickerId: string | null
}) {
  const zone = ZONES.find((z) => z.id === zoneId)
  if (!zone || machines.length === 0) return null
  return (
    <section className="catalogue__zone">
      <header className="catalogue__zonehead">
        <span className="catalogue__zonecode">{zone.code}</span>
        <h2>{zone.title}</h2>
        <span className="catalogue__zonesub">{zone.subtitle}</span>
      </header>
      <div className="catalogue__headrow" aria-hidden="true">
        <span>UNIT</span>
        <span>APPARATUS</span>
        <span>SOURCE</span>
        <span>SYSTEM</span>
        <span>STATUS</span>
        <span>SESSION</span>
        <span>RECORD</span>
      </div>
      {machines.map((machine) => (
        <CatalogueRow
          key={machine.id}
          machine={machine}
          machineRecord={record.machines[machine.id]}
          flicker={flickerId === machine.id}
        />
      ))}
    </section>
  )
}

function CatalogueRow({
  machine,
  machineRecord,
  flicker,
}: {
  machine: MachineMeta
  machineRecord?: { enteredCount: number; completions: number }
  flicker: boolean
}) {
  const rowProps = usePressable({ sfx: 'toggle' })
  const rowRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (flicker && rowRef.current) {
      rowRef.current.classList.add('is-powering')
      const t = window.setTimeout(() => rowRef.current?.classList.remove('is-powering'), 5500)
      return () => window.clearTimeout(t)
    }
  }, [flicker])

  const recordLabel =
    !machineRecord || machineRecord.enteredCount === 0
      ? '—'
      : machineRecord.completions > 0
        ? `COMPLETED ×${machineRecord.completions}`
        : 'VISITED'

  return (
    <div
      ref={rowRef}
      className="catalogue__row"
      {...rowProps}
      role="link"
      tabIndex={0}
      onClick={() => navigate({ name: 'machine', id: machine.id })}
      onKeyDown={(e) => {
        if (e.key === 'Enter') navigate({ name: 'machine', id: machine.id })
      }}
      onMouseEnter={() => {
        audio.play('hover')
        bumpMetric('shellHovers')
      }}
    >
      <span className="catalogue__code">{machine.code}</span>
      <span className="catalogue__title">{machine.title}</span>
      <span className="catalogue__thinker">{machine.thinker}</span>
      <span className="catalogue__system">{machine.system}</span>
      <span className={`catalogue__status catalogue__status--${machine.status.toLowerCase().replace(/[^a-z]+/g, '-')}`}>
        {machine.status}
      </span>
      <span className="catalogue__duration">{machine.duration}</span>
      <span className="catalogue__record">{recordLabel}</span>
    </div>
  )
}

function ZoneChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const props = usePressable({ sfx: 'tick' })
  return (
    <button className={`catalogue__chip${active ? ' is-active' : ''}`} {...props} onClick={onClick}>
      {label}
    </button>
  )
}
