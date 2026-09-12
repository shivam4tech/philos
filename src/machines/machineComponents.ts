import { lazy } from 'react'
import type { ComponentType, LazyExoticComponent } from 'react'

/**
 * Maps registry componentKeys to lazily-loaded machine components.
 * Adding a new apparatus adds exactly one line here.
 */
const COMPONENTS: Record<string, LazyExoticComponent<ComponentType>> = {
  // 'cm-001-will': lazy(() => import('./cm-001-will/Machine')),
}

const OFFLINE = lazy(() => import('./OfflineApparatus'))

export function getMachineComponent(key: string): LazyExoticComponent<ComponentType> {
  return COMPONENTS[key] ?? OFFLINE
}

export function isComponentImplemented(key: string): boolean {
  return key in COMPONENTS
}
