import { navigate, useRoute, type Route } from '@/router/router'
import { useSettings, setMuted } from '@/state/settings'
import { useLab, dismissTicker } from '@/state/lab'
import { audio } from '@/audio/engine'
import { Btn } from './ui'
import { InstitutionMark } from './InstitutionMark'
import { usePressable } from '@/interact/micro'

const NAV: { label: string; route: Route }[] = [
  { label: 'CATALOGUE', route: { name: 'catalogue' } },
  { label: 'FACILITY', route: { name: 'facility' } },
  { label: 'ARCHIVE', route: { name: 'archive' } },
  { label: 'RECORD', route: { name: 'record' } },
  { label: 'SETTINGS', route: { name: 'settings' } },
]

const ROUTE_LABELS: Record<Route['name'], string> = {
  entrance: 'ENTRANCE',
  facility: 'FACILITY MAP',
  catalogue: 'MACHINE CATALOGUE',
  record: 'RESEARCH RECORD',
  archive: 'ARCHIVE',
  'archive-machine': 'ARCHIVE / APPARATUS',
  machine: 'APPARATUS CHAMBER',
  settings: 'SETTINGS',
  chamber: 'COMPOSITION CHAMBER',
}

export function StatusBar() {
  const route = useRoute()
  const settings = useSettings()
  const lab = useLab()

  const muteProps = usePressable({ sfx: false })

  const facilityTime = (() => {
    const now = new Date()
    return now.toISOString().slice(11, 19)
  })()

  return (
    <>
      <header className="statusbar">
        <a
          className="statusbar__brand"
          href="#/facility"
          onClick={(e) => {
            e.preventDefault()
            navigate({ name: 'facility' })
          }}
        >
          <InstitutionMark />
          <span className="statusbar__title">
            INSTITUTE FOR APPLIED METAPHYSICS
            <br />
            CONCEPTUAL MACHINES LAB
          </span>
        </a>

        <nav className="statusbar__nav" aria-label="Facility navigation">
          {NAV.map(({ label, route: target }) => (
            <Btn
              key={label}
              variant="ghost"
              className={route.name === target.name ? 'is-active' : undefined}
              onClick={() => navigate(target)}
            >
              {label}
            </Btn>
          ))}
        </nav>

        <div className="statusbar__spacer" />

        <span className="statusbar__crumb" aria-live="polite">
          {ROUTE_LABELS[route.name]} · T+{facilityTime}
        </span>

        <div className={`statusbar__audio${settings.muted ? ' statusbar__audio--muted' : ''}`}>
          <Btn
            variant="ghost"
            {...muteProps}
            aria-pressed={settings.muted}
            title={settings.muted ? 'Audio is muted' : 'Audio is on'}
            onClick={() => {
              setMuted(!settings.muted)
              if (!settings.muted) audio.play('toggle')
            }}
          >
            {settings.muted ? 'AUDIO OFF' : 'AUDIO ON'}
          </Btn>
        </div>
      </header>
      {/* fixed-position ticker must live outside the header: backdrop-filter
          on the bar would otherwise become its containing block */}
      {lab.ticker.length > 0 && <Ticker messages={lab.ticker} />}
    </>
  )
}

function Ticker({ messages }: { messages: ReturnType<typeof useLab>['ticker'] }) {
  // rendered outside the bar flow via fixed positioning
  return (
    <div className="ticker" role="status" aria-live="polite">
      {messages.slice(-3).map((message) => (
        <p
          key={message.id}
          className={`ticker__msg ticker__msg--${message.kind}`}
          onClick={() => dismissTicker(message.id)}
        >
          {message.text}
        </p>
      ))}
    </div>
  )
}
