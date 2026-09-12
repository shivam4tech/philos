import { createContext, useContext } from 'react'
import type { ResearchCounters } from '@/state/persistence'
import type { SfxName } from '@/audio/sfx'

/**
 * Machine context — the API every apparatus receives from the frame.
 * Machines never touch persistence, audio plumbing, or routing directly.
 */

export interface MachineApi {
  machineId: string
  /** fires the canonical completion event for this apparatus */
  complete: (event: string) => void
  /** records an institutional counter */
  counter: (counter: keyof ResearchCounters, amount?: number) => void
  /** records a failed verification and may provoke the institution */
  failure: () => void
  /** records an unauthorized procedure (secret) */
  secret: (id: string, code: string, classification: string) => void
  /** marks an interpretation mode as completed (Sprint 4) */
  noteMode: (modeId: string) => void
  /** machine-routed sound effect */
  play: (name: SfxName, gain?: number) => void
  /** whether this machine has a recorded completion (record state) */
  completed: boolean
  /** active interpretation mode id (from the frame's mode selector) */
  modeId: string | null
  /** active cross-contamination id (from the Composition Chamber) */
  contaminantId: string | null
}

export const MachineContext = createContext<MachineApi | null>(null)

export function useMachine(): MachineApi {
  const ctx = useContext(MachineContext)
  if (!ctx) {
    throw new Error('useMachine used outside a MachineFrame — apparatus misconfigured')
  }
  return ctx
}
