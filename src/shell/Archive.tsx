import { useMemo, useState } from 'react'

import { cataloguedMachines, MACHINE_BY_ID, type MachineMeta } from '@/machines/registry'
import { getApparatusContent } from '@/archive/content'
import { useRecord } from '@/state/record'
import { bumpMetric } from '@/state/lab'
import { navigate } from '@/router/router'
import { Btn, Microlabel } from './ui'
import { TextualApparatusView } from './TextualApparatusView'
import { usePressable } from '@/interact/micro'
import './archive.css'

type CompletionFilter = 'all' | 'completed' | 'uncompleted'

export function Archive() {
  const record = useRecord()
  const [thinker, setThinker] = useState<string>('all')
  const [completion, setCompletion] = useState<CompletionFilter>('all')
  const [concept, setConcept] = useState('')

  const thinkers = useMemo(
    () => [...new Set(cataloguedMachines().map((m) => m.thinker))].sort(),
    [],
  )

  const machines = cataloguedMachines().filter((m) => {
    if (thinker !== 'all' && m.thinker !== thinker) return false
    if (concept && !m.concepts.some((c) => c.toLowerCase().includes(concept.toLowerCase()))) return false
    const completions = record.machines[m.id]?.completions ?? 0
    if (completion === 'completed' && completions === 0) return false
    if (completion === 'uncompleted' && completions > 0) return false
    return true
  })

  return (
    <div className="page archive">
      <header className="page-head">
        <Microlabel>Institutional archive — interpretation follows operation</Microlabel>
        <h1>ARCHIVE</h1>
        <div className="archive__filters">
          <label className="archive__filter">
            <span>THINKER</span>
            <select value={thinker} onChange={(e) => setThinker(e.target.value)}>
              <option value="all">ALL</option>
              {thinkers.map((t) => (
                <option key={t} value={t}>
                  {t.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
          <label className="archive__filter">
            <span>CONCEPT</span>
            <input
              type="search"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="e.g. recurrence"
            />
          </label>
          <div className="archive__filter" role="group" aria-label="Completion filter">
            {(['all', 'completed', 'uncompleted'] as const).map((value) => (
              <ArchiveChip
                key={value}
                label={value.toUpperCase()}
                active={completion === value}
                onClick={() => setCompletion(value)}
              />
            ))}
          </div>
        </div>
      </header>

      <ul className="archive__list">
        {machines.map((machine) => (
          <ArchiveRow key={machine.id} machine={machine} completed={(record.machines[machine.id]?.completions ?? 0) > 0} />
        ))}
      </ul>
      {machines.length === 0 && (
        <p className="archive__empty">NO ENTRIES MATCH. THE ARCHIVE IS COMPLETE REGARDLESS.</p>
      )}
    </div>
  )
}

function ArchiveRow({ machine, completed }: { machine: MachineMeta; completed: boolean }) {
  const rowProps = usePressable({ sfx: 'tick' })
  return (
    <li
      className={`archive__row${completed ? ' is-completed' : ''}`}
      {...rowProps}
      role="link"
      tabIndex={0}
      onClick={() => {
        bumpMetric('archiveVisits')
        navigate({ name: 'archive-machine', id: machine.id })
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') navigate({ name: 'archive-machine', id: machine.id })
      }}
    >
      <span className="archive__code">{machine.code}</span>
      <span className="archive__title">{machine.title}</span>
      <span className="archive__thinker">{machine.thinker}</span>
      <span className="archive__concepts">{machine.concepts.slice(0, 3).join(' · ')}</span>
      <span className="archive__state">{completed ? 'DOCUMENTED' : 'MINIMAL RECORD'}</span>
    </li>
  )
}

function ArchiveChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const props = usePressable({ sfx: 'tick' })
  return (
    <button className={`archive__chip${active ? ' is-active' : ''}`} {...props} onClick={onClick}>
      {label}
    </button>
  )
}

export function ArchiveDetail({ machineId }: { machineId: string }) {
  const record = useRecord()
  const machine = MACHINE_BY_ID.get(machineId)
  if (!machine) return null
  const content = getApparatusContent(machineId)
  const completed = (record.machines[machineId]?.completions ?? 0) > 0

  return (
    <div className="page archive-detail">
      <header className="page-head">
        <div className="archive-detail__top">
          <Btn variant="ghost" onClick={() => navigate({ name: 'archive' })}>
            ← ARCHIVE
          </Btn>
          <Btn variant="ghost" onClick={() => navigate({ name: 'machine', id: machineId })}>
            OPEN APPARATUS
          </Btn>
        </div>
        <Microlabel>
          {machine.code} · {machine.zone.replace(/-/g, ' ')} · {machine.duration}
        </Microlabel>
        <h1>{machine.title}</h1>
        <div className="archive-detail__meta">
          <span>SOURCE: {machine.thinker.toUpperCase()}</span>
          <span>SYSTEM: {machine.system.toUpperCase()}</span>
          <span>STATUS: {machine.status}</span>
        </div>
      </header>

      {content ? (
        <TextualApparatusView content={content} sealed={!completed} title={machine.title} />
      ) : (
        <p className="archive__empty">NO DOCUMENTATION ON FILE.</p>
      )}
    </div>
  )
}
