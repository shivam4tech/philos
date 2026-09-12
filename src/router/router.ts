import { useSyncExternalStore } from 'react'

import { MACHINE_BY_ID } from '@/machines/registry'

/**
 * Hash router — tiny, typed, transition-friendly. The laboratory lives at
 * hash routes so a static host needs no rewrites.
 */

export type Route =
  | { name: 'entrance' }
  | { name: 'facility' }
  | { name: 'catalogue' }
  | { name: 'record' }
  | { name: 'archive' }
  | { name: 'archive-machine'; id: string }
  | { name: 'machine'; id: string }
  | { name: 'settings' }
  | { name: 'chamber' }

export function routeToHash(route: Route): string {
  switch (route.name) {
    case 'entrance':
      return '#/'
    case 'machine':
      return `#/machine/${route.id}`
    case 'archive-machine':
      return `#/archive/${route.id}`
    default:
      return `#/${route.name}`
  }
}

export function parseHash(hash: string): Route {
  const segments = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  const [head, tail] = segments
  switch (head) {
    case undefined:
      return { name: 'entrance' }
    case 'facility':
      return { name: 'facility' }
    case 'catalogue':
      return { name: 'catalogue' }
    case 'record':
      return { name: 'record' }
    case 'archive':
      if (tail && MACHINE_BY_ID.has(tail)) return { name: 'archive-machine', id: tail }
      return { name: 'archive' }
    case 'machine':
      if (tail && MACHINE_BY_ID.has(tail)) return { name: 'machine', id: tail }
      return { name: 'catalogue' }
    case 'settings':
      return { name: 'settings' }
    case 'chamber':
      return { name: 'chamber' }
    default:
      return { name: 'catalogue' }
  }
}

export function currentRoute(): Route {
  return parseHash(window.location.hash)
}

export function navigate(route: Route, opts?: { replace?: boolean }): void {
  const hash = routeToHash(route)
  if (window.location.hash === hash) return
  if (opts?.replace) {
    window.history.replaceState(null, '', hash)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  } else {
    window.location.hash = hash
  }
}

const routeListeners = new Set<() => void>()

let routeState: Route = typeof window === 'undefined' ? { name: 'entrance' } : currentRoute()

function onHashChange(): void {
  routeState = currentRoute()
  for (const listener of routeListeners) listener()
}

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', onHashChange)
}

export function useRoute(): Route {
  return useSyncExternalStore(
    (listener) => {
      routeListeners.add(listener)
      return () => routeListeners.delete(listener)
    },
    () => routeState,
    () => routeState,
  )
}

export function isMachineRoute(route: Route): route is { name: 'machine'; id: string } {
  return route.name === 'machine'
}
