import { describe, expect, it } from 'vitest'

import {
  MACHINES,
  MACHINE_BY_ID,
  ZONES,
  cataloguedMachines,
  getMachine,
  machinesInZone,
} from '@/machines/registry'
import { isComponentImplemented, getMachineComponent } from '@/machines/machineComponents'
import { CONTAMINATION_EFFECTS } from '@/contamination/definitions'

describe('machine registry integrity', () => {
  it('contains the full catalogue (12 apparatuses + secret + 4 micro)', () => {
    expect(MACHINES).toHaveLength(17)
  })

  it('has unique ids, codes, and component keys', () => {
    const ids = new Set(MACHINES.map((m) => m.id))
    const codes = new Set(MACHINES.map((m) => m.code))
    const keys = new Set(MACHINES.map((m) => m.componentKey))
    expect(ids.size).toBe(MACHINES.length)
    expect(codes.size).toBe(MACHINES.length)
    expect(keys.size).toBe(MACHINES.length)
  })

  it('every machine carries metadata required by the catalogue', () => {
    for (const m of MACHINES) {
      expect(m.title, m.id).not.toBe('')
      expect(m.thinker, m.id).not.toBe('')
      expect(m.duration, m.id).toMatch(/min|s$/)
      expect(m.system, m.id).not.toBe('')
      expect(m.concepts.length, m.id).toBeGreaterThan(0)
      expect(m.primaryWorks.length, m.id).toBeGreaterThan(0)
      expect(m.completionEvents.length, m.id).toBeGreaterThan(0)
      expect(m.audioScene, m.id).not.toBe('')
      expect(ZONES.some((z) => z.id === m.zone), `zone of ${m.id}`).toBe(true)
    }
  })

  it('the secret machine is hidden and restricted', () => {
    const secret = getMachine('cm-000-parmenides')
    expect(secret).toBeDefined()
    expect(secret?.hidden).toBe(true)
    expect(secret?.zone).toBe('restricted')
    expect(cataloguedMachines().some((m) => m.id === 'cm-000-parmenides')).toBe(false)
  })

  it('machine lookups resolve', () => {
    expect(MACHINE_BY_ID.size).toBe(MACHINES.length)
    expect(getMachine('cm-004-broken-tool')?.thinker).toBe('Heidegger')
  })

  it('zones group machines sensibly', () => {
    expect(machinesInZone('east-wing').map((m) => m.id)).toEqual(
      expect.arrayContaining(['cm-001-will', 'cm-002-desire']),
    )
    expect(machinesInZone('restricted')).toHaveLength(1)
  })

  it('all twelve apparatuses are implemented; secret + micros resolve via fallback', () => {
    const implemented = new Set([
      'cm-001-will', 'cm-002-desire', 'cm-003-vending', 'cm-004-broken-tool',
      'cm-005-bracket', 'cm-006-again', 'cm-007-windows', 'cm-008-private',
      'cm-009-difference', 'cm-010-expenditure', 'cm-011-terms', 'cm-012-observation',
    ])
    for (const m of MACHINES) {
      expect(isComponentImplemented(m.componentKey)).toBe(implemented.has(m.componentKey))
      // resolution must never fail — fallback = offline apparatus
      expect(() => getMachineComponent(m.componentKey)).not.toThrow()
    }
  })

  it('contamination sources reference real machines or the lab itself', () => {
    for (const effect of CONTAMINATION_EFFECTS) {
      if (effect.sourceMachineId === 'lab') continue
      expect(MACHINE_BY_ID.has(effect.sourceMachineId), effect.id).toBe(true)
    }
  })
})
