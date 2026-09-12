import { lazy } from 'react'
import type { ComponentType, LazyExoticComponent } from 'react'

/**
 * Maps registry componentKeys to lazily-loaded machine components.
 * Adding a new apparatus adds exactly one line here.
 */
const COMPONENTS: Record<string, LazyExoticComponent<ComponentType>> = {
  'cm-001-will': lazy(() => import('./cm-001-will/Machine')),
  'cm-002-desire': lazy(() => import('./cm-002-desire/Machine')),
  'cm-003-vending': lazy(() => import('./cm-003-vending/Machine')),
  'cm-004-broken-tool': lazy(() => import('./cm-004-broken-tool/Machine')),
  'cm-005-bracket': lazy(() => import('./cm-005-bracket/Machine')),
  'cm-006-again': lazy(() => import('./cm-006-again/Machine')),
}

const OFFLINE = lazy(() => import('./OfflineApparatus'))

export function getMachineComponent(key: string): LazyExoticComponent<ComponentType> {
  return COMPONENTS[key] ?? OFFLINE
}

export function isComponentImplemented(key: string): boolean {
  return key in COMPONENTS
}
