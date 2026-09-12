import { cataloguedMachines } from '@/machines/registry'
import { useRecord } from '@/state/record'
import { useLab } from '@/state/lab'
import { Microlabel } from './ui'
import { RecordDataControls } from './RecordDataControls'
import './recordpage.css'

const COUNTER_LABELS: Array<[keyof ReturnType<typeof useRecord>['counters'], string]> = [
  ['sessions', 'Sessions'],
  ['contradictionsProduced', 'Contradictions generated'],
  ['failedVerifications', 'Failed verifications'],
  ['recurrencesAccepted', 'Recurrences accepted'],
  ['recurrencesRefused', 'Recurrences refused'],
  ['semanticLoops', 'Unauthorized semantic loops'],
  ['unauthorizedProcedures', 'Unauthorized procedures'],
  ['satisfactions', 'Satisfactions recorded'],
  ['expenditures', 'Expenditures performed'],
  ['idleEvents', 'Idle events'],
  ['resets', 'Record resets'],
  ['chamberRuns', 'Chamber runs'],
]

export function ResearchRecordPage() {
  const record = useRecord()
  const lab = useLab()

  const observedMachines = cataloguedMachines().map((machine) => ({
    machine,
    entry: record.machines[machine.id],
  }))

  return (
    <div className="page record">
      <header className="page-head">
        <Microlabel>Institutional document — not a profile, not a score</Microlabel>
        <h1>RESEARCH RECORD</h1>
        <div className="record__subject">
          <span className="record__subjectlabel">
            {record.designation === 'APPARATUS' ? 'APPARATUS: CM-???' : 'RESEARCH SUBJECT:'}{' '}
            {record.designation === 'APPARATUS' ? 'OBSERVING' : record.designation}
          </span>
          <span className="record__statusline">
            STATUS: {record.designation === 'UNREGISTERED' ? 'UNREGISTERED' : 'UNDER OBSERVATION'}
          </span>
        </div>
      </header>

      <div className="record__grid">
        <section className="record__panel">
          <h2 className="record__paneltitle">STATISTICS</h2>
          <dl className="record__counters">
            {COUNTER_LABELS.map(([key, label]) => (
              <div key={key} className="record__counter">
                <dt>{label}</dt>
                <dd>{record.counters[key]}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="record__panel">
          <h2 className="record__paneltitle">APPARATUSES</h2>
          <ul className="record__machines">
            {observedMachines.map(({ machine, entry }) => {
              const visited = (entry?.enteredCount ?? 0) > 0
              return (
                <li key={machine.id} className={visited ? 'is-visited' : undefined}>
                  <span className="record__machinecode">{machine.code}</span>
                  <span className="record__machinetitle">{visited ? machine.title : '— — —'}</span>
                  <span className="record__machinestat">
                    {visited ? `×${entry?.completions ?? 0} completed` : 'NOT OBSERVED'}
                  </span>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="record__panel">
          <h2 className="record__paneltitle">UNAUTHORIZED PROCEDURES</h2>
          {record.secrets.length === 0 ? (
            <p className="record__empty">NONE ON RECORD. THIS IS NOT AN INVITATION.</p>
          ) : (
            <ul className="record__secrets">
              {record.secrets.map((secret) => (
                <li key={secret.id}>
                  <span className="record__secretcode">{secret.code}</span>
                  <span className="record__secretclass">{secret.classification}</span>
                </li>
              ))}
            </ul>
          )}

          <h2 className="record__paneltitle record__paneltitle--spaced">CONTAMINATION LEDGER</h2>
          {record.contamination.unlocked.length === 0 ? (
            <p className="record__empty">NO CONTAMINANTS DETECTED. THE FACILITY REMAINS CONVENTIONALLY REAL.</p>
          ) : (
            <ul className="record__secrets">
              {record.contamination.unlocked.map((id) => (
                <li key={id}>
                  <span className="record__secretcode">VEC-{String(id.length).padStart(2, '0')}</span>
                  <span className="record__secretclass">{id.toUpperCase().replace(/-/g, ' ')}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="record__panel">
          <h2 className="record__paneltitle">SESSION NOTES</h2>
          <dl className="record__counters">
            <div className="record__counter">
              <dt>Routes traversed (session)</dt>
              <dd>{lab.metrics.navCount}</dd>
            </div>
            <div className="record__counter">
              <dt>Apparatus exits (session)</dt>
              <dd>{lab.metrics.machineExits}</dd>
            </div>
            <div className="record__counter">
              <dt>Idle events (session)</dt>
              <dd>{lab.metrics.idleEvents}</dd>
            </div>
          </dl>
          <p className="record__note">
            THE INSTITUTE DOES NOT SCORE PERFORMANCE. THE INSTITUTE DOES, HOWEVER, KEEP EVERYTHING.
          </p>
        </section>
      </div>

      <section className="record__data">
        <h2 className="record__paneltitle">RECORD DATA</h2>
        <RecordDataControls />
      </section>
    </div>
  )
}
