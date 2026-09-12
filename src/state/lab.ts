import type { Route } from '@/router/router'

import { createStore, useStore } from './store'

export interface ActiveContaminationEffect {
  /** runtime instance id */
  instanceId: string
  /** effect definition id */
  effectId: string
  designation: string
  firedAt: number
  expiresAt: number | null
  /** effect-specific payload for the UI layer */
  payload?: Record<string, string | number | boolean>
}

export interface TickerMessage {
  id: number
  text: string
  at: number
  kind: 'institution' | 'contamination' | 'secret'
}

export interface SessionMetrics {
  startedAt: number
  navCount: number
  machineExits: number
  shellHovers: number
  settingsVisits: number
  archiveVisits: number
  resets: number
  idleEvents: number
  lastInteractionAt: number
}

export interface LabState {
  booted: boolean
  route: Route
  ticker: TickerMessage[]
  contamination: ActiveContaminationEffect[]
  /** catalogue search placeholder stage (Lacan chain) */
  searchStage: number
  metrics: SessionMetrics
  /** machine currently powering on, for the entry transition */
  poweringOn: string | null
}

const initial: LabState = {
  booted: false,
  route: { name: 'entrance' },
  ticker: [],
  contamination: [],
  searchStage: 0,
  metrics: {
    startedAt: Date.now(),
    navCount: 0,
    machineExits: 0,
    shellHovers: 0,
    settingsVisits: 0,
    archiveVisits: 0,
    resets: 0,
    idleEvents: 0,
    lastInteractionAt: Date.now(),
  },
  poweringOn: null,
}

const labStore = createStore<LabState>(initial)

export function useLab(): LabState {
  return useStore(labStore)
}

export function getLab(): LabState {
  return labStore.get()
}

let tickerSeq = 0
let effectSeq = 0

export function setBooted(booted: boolean): void {
  labStore.set((prev) => ({ ...prev, booted }))
}

export function setLabRoute(route: Route): void {
  labStore.set((prev) => ({
    ...prev,
    route,
    metrics: { ...prev.metrics, navCount: prev.metrics.navCount + 1, lastInteractionAt: Date.now() },
  }))
}

export function pushTicker(text: string, kind: TickerMessage['kind'] = 'institution'): void {
  labStore.set((prev) => {
    const next = [...prev.ticker, { id: ++tickerSeq, text, at: Date.now(), kind }]
    return { ...prev, ticker: next.slice(-6) }
  })
  if (kind === 'institution') {
    window.setTimeout(() => dismissTicker(tickerSeq), 9000)
  }
}

export function dismissTicker(id: number): void {
  labStore.set((prev) => ({ ...prev, ticker: prev.ticker.filter((t) => t.id !== id) }))
}

export function addActiveEffect(effect: Omit<ActiveContaminationEffect, 'instanceId'>): string {
  const instanceId = `fx-${++effectSeq}`
  labStore.set((prev) => ({
    ...prev,
    contamination: [...prev.contamination, { ...effect, instanceId }],
  }))
  return instanceId
}

export function removeActiveEffect(instanceId: string): void {
  labStore.set((prev) => ({
    ...prev,
    contamination: prev.contamination.filter((e) => e.instanceId !== instanceId),
  }))
}

export function advanceSearchStage(): number {
  labStore.set((prev) => ({ ...prev, searchStage: prev.searchStage + 1 }))
  return labStore.get().searchStage
}

export function bumpMetric<K extends keyof Omit<SessionMetrics, 'startedAt' | 'lastInteractionAt'>>(
  key: K,
  amount = 1,
): void {
  labStore.set((prev) => ({
    ...prev,
    metrics: { ...prev.metrics, [key]: prev.metrics[key] + amount, lastInteractionAt: Date.now() },
  }))
}

export function noteInteraction(): void {
  labStore.set((prev) =>
    prev.metrics.lastInteractionAt === Date.now()
      ? prev
      : { ...prev, metrics: { ...prev.metrics, lastInteractionAt: Date.now() } },
  )
}

export function setPoweringOn(machineId: string | null): void {
  labStore.set((prev) => ({ ...prev, poweringOn: machineId }))
}

export function markIdleEvent(): void {
  labStore.set((prev) => ({
    ...prev,
    metrics: { ...prev.metrics, idleEvents: prev.metrics.idleEvents + 1 },
  }))
}
