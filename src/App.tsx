import { useEffect } from 'react'

import { useRoute, navigate } from '@/router/router'
import { useRecord, getRecord } from '@/state/record'
import { totalCompletions } from '@/state/persistence'
import {
  bumpMetric,
  getLab,
  markIdleEvent,
  noteInteraction,
  pushTicker,
  setLabRoute,
} from '@/state/lab'
import { useAudioUnlock } from '@/interact/micro'
import { audio } from '@/audio/engine'
import { institution } from '@/institution/engine'
import { attemptContamination } from '@/contamination/engine'

import { Entrance } from './shell/Entrance'
import { StatusBar } from './shell/StatusBar'
import { Catalogue } from './shell/Catalogue'
import { FacilityMap } from './shell/FacilityMap'
import { ResearchRecordPage } from './shell/ResearchRecordPage'
import { Archive, ArchiveDetail } from './shell/Archive'
import { SettingsPanel } from './shell/SettingsPanel'
import { ContaminationLayer } from './shell/ContaminationLayer'
import { ErrorBoundary } from './shell/ErrorBoundary'
import { ChamberPage } from './shell/ChamberPage'
import { ObservingDeck } from './shell/ObservingDeck'
import { MachineRoute } from './machines/MachineFrame'

export function App() {
  useAudioUnlock()
  const route = useRoute()
  const record = useRecord()

  if (!record.entered) {
    return (
      <ErrorBoundary>
        <Entrance />
      </ErrorBoundary>
    )
  }

  if (route.name === 'machine') {
    return (
      <ErrorBoundary resetKey={`${route.id}:${route.contaminant ?? ''}`}>
        <MachineRoute machineId={route.id} />
      </ErrorBoundary>
    )
  }

  return <Shell route={route} />
}

function Shell({ route }: { route: ReturnType<typeof useRoute> }) {
  const record = useRecord()

  /* route-change side effects: scene, metrics, contamination, institution */
  useEffect(() => {
    audio.startAmbience('shell')
    setLabRoute(route)
    if (route.name === 'archive') bumpMetric('archiveVisits')
    if (route.name === 'settings') bumpMetric('settingsVisits')

    window.setTimeout(() => {
      void attemptContamination(route.name === 'machine' ? 'catalogue' : route.name)
    }, 2200)

    const completions = totalCompletions(getRecord())
    if (completions >= 8 && Math.random() < 0.3) {
      const message = institution.emit('late-progression')
      if (message) pushTicker(message)
    }
    if (getLab().metrics.archiveVisits > 5 && Math.random() < 0.4) {
      const message = institution.emit('archive-obsession')
      if (message) pushTicker(message)
    }
  }, [route.name, route])

  /* startup message, once per mount of the shell */
  useEffect(() => {
    const message = institution.emit('startup')
    if (message) pushTicker(message)
  }, [])

  /* interaction tracking + idle + slow ambient contamination checks */
  useEffect(() => {
    const onInteraction = () => noteInteraction()
    window.addEventListener('pointerdown', onInteraction, { passive: true })
    window.addEventListener('keydown', onInteraction, { passive: true })

    const interval = window.setInterval(() => {
      const idleMs = Date.now() - getLab().metrics.lastInteractionAt
      if (idleMs > 90_000) {
        markIdleEvent()
        const message = institution.emit('idle')
        if (message) pushTicker(message)
        noteInteraction() // re-arm the idle detector
        window.setTimeout(() => void attemptContamination('catalogue'), 1500)
      }
      if (Math.random() < 0.06) {
        void attemptContamination('catalogue')
      }
    }, 20_000)

    return () => {
      window.removeEventListener('pointerdown', onInteraction)
      window.removeEventListener('keydown', onInteraction)
      window.clearInterval(interval)
    }
  }, [])

  return (
    <div className="lab-shell">
      <StatusBar />
      <main className="route-view" key={routeKey(route)}>
        {route.name === 'facility' && <FacilityMap />}
        {route.name === 'catalogue' && <Catalogue />}
        {route.name === 'record' && <ResearchRecordPage />}
        {route.name === 'archive' && <Archive />}
        {route.name === 'archive-machine' && <ArchiveDetail machineId={route.id} />}
        {route.name === 'settings' && <SettingsPanel />}
        {route.name === 'chamber' && <ChamberPage />}
        {route.name === 'entrance' && <RedirectToFacility />}
      </main>
      <ContaminationLayer />
      {record.designation === 'APPARATUS' && !record.observingAcknowledged && (
        <ObservingDeck />
      )}
    </div>
  )
}

function routeKey(route: ReturnType<typeof useRoute>): string {
  return route.name === 'archive-machine' ? `archive-${route.id}` : route.name
}

function RedirectToFacility() {
  useEffect(() => {
    navigate({ name: 'facility' }, { replace: true })
  }, [])
  return null
}
