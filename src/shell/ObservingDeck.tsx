import { MACHINE_BY_ID } from '@/machines/registry'
import { acknowledgeObservation, useRecord } from '@/state/record'
import { navigate } from '@/router/router'
import { Btn, Microlabel } from './ui'
import { usePressable } from '@/interact/micro'
import { audio } from '@/audio/engine'
import './deck.css'

/**
 * Meta-endgame — the facility begins treating the visitor as another
 * apparatus. No diagnosis, no score: their interaction history is rendered
 * as a final philosophical object.
 */
export function ObservingDeck() {
  const record = useRecord()

  const preferred = Object.entries(record.machines).sort(
    (a, b) => (b[1]?.completions ?? 0) - (a[1]?.completions ?? 0),
  )[0]
  const preferredMeta = preferred ? MACHINE_BY_ID.get(preferred[0]) : undefined

  const metrics: Array<[string, string | number]> = [
    ['Repeated actions', preferredMeta ? `${preferredMeta.code} — ${preferredMeta.title} (×${preferred[1].completions})` : 'NONE RECORDED'],
    ['Refusals', record.counters.recurrencesRefused],
    ['Idle periods', record.counters.idleEvents],
    ['Recurrence choices', `${record.counters.recurrencesAccepted} accepted · ${record.counters.recurrencesRefused} refused`],
    ['Frequency of resets', record.counters.resets],
    ['Desire loops', record.counters.satisfactions],
    ['Failed verifications', record.counters.failedVerifications],
    ['Contradictions generated', record.counters.contradictionsProduced],
    ['Semantic loops', record.counters.semanticLoops],
    ['Chamber reactions', record.counters.chamberRuns],
  ]

  const ackProps = usePressable({ sfx: 'click' })

  const acknowledge = () => {
    audio.play('unlock')
    acknowledgeObservation()
    navigate({ name: 'facility' })
  }

  return (
    <div className="deck" role="dialog" aria-label="Observation deck">
      <Microlabel signal>INSTITUTE FOR APPLIED METAPHYSICS — RECLASSIFICATION NOTICE</Microlabel>
      <h1 className="deck__title">OBSERVATION DECK</h1>
      <p className="deck__reclass">
        RESEARCH SUBJECT: UNREGISTERED → <b>APPARATUS: CM-???</b>
        <br />
        STATUS: <b>OBSERVING</b>
      </p>
      <p className="deck__lead">
        THE FACILITY HAS EXAMINED ITS OWN RECORDS AND FINDS A CONSISTENT FIGURE AMONG
        THE ENTRIES. THE FOLLOWING IS THAT FIGURE, COMPOSED ENTIRELY OF YOUR CONDUCT.
      </p>
      <dl className="deck__metrics">
        {metrics.map(([label, value]) => (
          <div key={label}>
            <dt>{label.toUpperCase()}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <p className="deck__verdict">
        THE INSTITUTE IS UNABLE TO DETERMINE WHETHER YOU OPERATED THE MACHINES
        OR THE MACHINES OPERATED YOU.
      </p>
      <Btn variant="primary" {...ackProps} onClick={acknowledge}>
        RETURN TO FACILITY
      </Btn>
      <p className="deck__note">THE LABORATORY REMAINS OPEN. THERE IS NO CLOSING ENTRY.</p>
    </div>
  )
}
