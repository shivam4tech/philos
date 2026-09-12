import { effectsForSource } from '@/contamination/definitions'

import {
  designationFor,
  emptyMachineRecord,
  exportRecord,
  importRecord,
  loadRecord,
  resetRecord,
  saveRecord,
  totalCompletions,
  type ResearchCounters,
  type ResearchRecord,
} from './persistence'
import { createStore, useStore } from './store'

function initialRecord(): ResearchRecord {
  return loadRecord().record
}

const recordStore = createStore<ResearchRecord>(initialRecord())

recordStore.subscribe((record) => {
  saveRecord(record)
})

export function useRecord(): ResearchRecord {
  return useStore(recordStore)
}

export function getRecord(): ResearchRecord {
  return recordStore.get()
}

function update(mutate: (record: ResearchRecord) => ResearchRecord): void {
  recordStore.set((prev) => {
    const next = mutate(prev)
    return { ...next, designation: designationFor(totalCompletions(next)) }
  })
}

function machineEntry(record: ResearchRecord, machineId: string) {
  return record.machines[machineId] ?? emptyMachineRecord()
}

/* ------------------------------------------------------------------ */
/* Actions                                                             */
/* ------------------------------------------------------------------ */

export function enterFacility(): void {
  update((record) => ({
    ...record,
    entered: true,
    counters: { ...record.counters, sessions: record.counters.sessions + 1 },
  }))
}

export function enterMachine(machineId: string): void {
  update((record) => {
    const entry = machineEntry(record, machineId)
    return {
      ...record,
      machines: {
        ...record.machines,
        [machineId]: {
          ...entry,
          enteredCount: entry.enteredCount + 1,
          lastEnteredAt: Date.now(),
        },
      },
    }
  })
}

export function leaveMachine(machineId: string, interactionMs: number): void {
  update((record) => {
    const entry = machineEntry(record, machineId)
    return {
      ...record,
      machines: {
        ...record.machines,
        [machineId]: {
          ...entry,
          totalInteractionMs: entry.totalInteractionMs + Math.max(0, Math.round(interactionMs)),
        },
      },
    }
  })
}

/**
 * Records a canonical completion event. Returns contamination effect ids
 * newly unlocked by this completion (for the shell to acknowledge).
 */
export function completeMachine(machineId: string, _event: string): string[] {
  const unlockedBefore = new Set(getRecord().contamination.unlocked)
  const unlockedNow = effectsForSource(machineId).map((e) => e.id)
  const fresh = unlockedNow.filter((id) => !unlockedBefore.has(id))

  update((record) => {
    const entry = machineEntry(record, machineId)
    return {
      ...record,
      machines: {
        ...record.machines,
        [machineId]: { ...entry, completions: entry.completions + 1 },
      },
      contamination: {
        ...record.contamination,
        unlocked: [...record.contamination.unlocked, ...fresh],
      },
    }
  })
  return fresh
}

export function noteModeCompleted(machineId: string, modeId: string): void {
  update((record) => {
    const entry = machineEntry(record, machineId)
    if (entry.modesCompleted.includes(modeId)) return record
    return {
      ...record,
      machines: {
        ...record.machines,
        [machineId]: { ...entry, modesCompleted: [...entry.modesCompleted, modeId] },
      },
    }
  })
}

export function addCounter(counter: keyof ResearchCounters, amount = 1): void {
  update((record) => ({
    ...record,
    counters: { ...record.counters, [counter]: record.counters[counter] + amount },
  }))
}

export function discoverSecret(secret: { id: string; code: string; classification: string }): void {
  const existing = getRecord().secrets.some((s) => s.id === secret.id)
  if (existing) return
  update((record) => ({
    ...record,
    secrets: [
      ...record.secrets,
      { ...secret, discoveredAt: Date.now() },
    ],
    counters: {
      ...record.counters,
      unauthorizedProcedures: record.counters.unauthorizedProcedures + 1,
    },
  }))
}

export function markEffectWitnessed(effectId: string): void {
  const { contamination } = getRecord()
  if (contamination.witnessed.includes(effectId)) return
  update((record) => ({
    ...record,
    contamination: {
      ...record.contamination,
      witnessed: [...record.contamination.witnessed, effectId],
    },
  }))
}

export function setEffectCooldown(effectId: string, until: number): void {
  update((record) => ({
    ...record,
    contamination: {
      ...record.contamination,
      cooldownUntil: { ...record.contamination.cooldownUntil, [effectId]: until },
    },
  }))
}

export function resetResearchRecord(): void {
  const fresh = resetRecord()
  recordStore.set(() => fresh)
}

/* ------------------------------------------------------------------ */
/* Export / import                                                     */
/* ------------------------------------------------------------------ */

export function exportResearchRecord(): string {
  return exportRecord(getRecord())
}

export type RecordImportOutcome = { ok: true } | { ok: false; reason: string }

export function importResearchRecord(text: string): RecordImportOutcome {
  const result = importRecord(text)
  if (!result.ok) return { ok: false, reason: result.reason }
  recordStore.set(() => result.record)
  return { ok: true }
}
