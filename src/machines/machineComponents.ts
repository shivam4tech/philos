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
  'cm-007-windows': lazy(() => import('./cm-007-windows/Machine')),
  'cm-008-private': lazy(() => import('./cm-008-private/Machine')),
  'cm-009-difference': lazy(() => import('./cm-009-difference/Machine')),
  'cm-010-expenditure': lazy(() => import('./cm-010-expenditure/Machine')),
  'cm-011-terms': lazy(() => import('./cm-011-terms/Machine')),
  'cm-012-observation': lazy(() => import('./cm-012-observation/Machine')),
}

const OFFLINE = lazy(() => import('./OfflineApparatus'))

export function getMachineComponent(key: string): LazyExoticComponent<ComponentType> {
  return COMPONENTS[key] ?? OFFLINE
}

export function isComponentImplemented(key: string): boolean {
  return key in COMPONENTS
}
