import type { ReactNode } from 'react'

import './offline.css'

/**
 * Minimal full-screen frame used by the offline fallback.
 * The real MachineFrame (Sprint 1) supersedes this.
 */
export function MachineFrameBackOnly({ children }: { children: ReactNode }) {
  return (
    <div className="offline-frame">
      <div className="offline-frame__body">{children}</div>
      <a className="offline-frame__back" href="#/catalogue">
        ← RETURN TO CATALOGUE
      </a>
    </div>
  )
}
