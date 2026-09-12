import {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  type ReducedMotionSetting,
  type Settings,
} from './persistence'
import { createStore, useStore } from './store'

const settingsStore = createStore<Settings>(loadSettings())

settingsStore.subscribe((settings) => {
  saveSettings(settings)
  applySettingsToDocument(settings)
})

function applySettingsToDocument(settings: Settings): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.dataset.reducedMotion =
    settings.reducedMotion === 'on' ||
    (settings.reducedMotion === 'auto' && prefersReducedMotion())
      ? 'on'
      : 'off'
  root.dataset.reducedSensory = settings.reducedSensory ? 'on' : 'off'
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

applySettingsToDocument(settingsStore.get())

export function useSettings(): Settings {
  return useStore(settingsStore)
}

export function getSettings(): Settings {
  return settingsStore.get()
}

export function patchSettings(patch: Partial<Settings>): void {
  settingsStore.set((prev) => ({ ...prev, ...patch }))
}

export function setMuted(muted: boolean): void {
  patchSettings({ muted })
}

export function setReducedMotion(value: ReducedMotionSetting): void {
  patchSettings({ reducedMotion: value })
}

export function setReducedSensory(value: boolean): void {
  patchSettings({ reducedSensory: value })
}

export function resetAudioSettings(): void {
  patchSettings({
    master: DEFAULT_SETTINGS.master,
    ambience: DEFAULT_SETTINGS.ambience,
    interaction: DEFAULT_SETTINGS.interaction,
    muted: false,
  })
}
