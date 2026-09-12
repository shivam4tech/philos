import { beforeEach, describe, expect, it } from 'vitest'

import { HYBRIDS, chamberAvailable, hybridFor } from '@/machines/chamber'
import { MACHINE_BY_ID } from '@/machines/registry'
import { DECLARATION, TOTAL_HALVINGS, progressAfter, remainingAfter } from '@/machines/ma-01-zeno/machine'
import { REPRESENTATIONS, MAX_INSPECTIONS } from '@/machines/ma-02-noumenal/machine'
import { REVELATIONS, PENALTY_MS } from '@/machines/ma-04-attention/machine'
import { divergeLine, divergenceReport } from '@/machines/cm-006-again/machine'
import {
  SCHEMA_VERSION,
  designationFor,
  emptyRecord,
  migrate,
  repairRecord,
} from '@/state/persistence'
import { resetResearchRecord } from '@/state/record'

beforeEach(() => {
  resetResearchRecord()
})

describe('composition chamber', () => {
  it('authors exactly six confrontations with unique ids', () => {
    expect(HYBRIDS).toHaveLength(6)
    expect(new Set(HYBRIDS.map((h) => h.id)).size).toBe(6)
  })

  it('pairs reference real machines (or the Marx contaminant)', () => {
    for (const h of HYBRIDS) {
      expect(MACHINE_BY_ID.has(h.baseId), h.id).toBe(true)
      if (h.contaminantId !== 'marx') {
        expect(MACHINE_BY_ID.has(h.contaminantId), h.id).toBe(true)
      }
      expect(h.completionEvent.endsWith('contaminated-session'), h.id).toBe(true)
      expect(h.note).toMatch(/EXPERIMENTAL CONFRONTATION/i)
    }
  })

  it('resolves hybrids by base + contaminant pair', () => {
    expect(hybridFor('cm-001-will', 'cm-002-desire')?.id).toBe('schopenhauer-lacan')
    expect(hybridFor('cm-001-will', 'marx')).toBeUndefined()
  })

  it('opens after two completions', () => {
    expect(chamberAvailable(1)).toBe(false)
    expect(chamberAvailable(2)).toBe(true)
  })
})

describe('micro-apparatus logic', () => {
  it('MA-01 halves the remaining distance exactly', () => {
    expect(remainingAfter(0)).toBe(100)
    expect(remainingAfter(1)).toBe(50)
    expect(remainingAfter(3)).toBe(12.5)
    expect(progressAfter(TOTAL_HALVINGS)).toBeCloseTo(99.9756, 3)
    expect(DECLARATION).toMatch(/DECIDED/)
  })

  it('MA-02 withholds the noumenon after six representations', () => {
    expect(REPRESENTATIONS).toHaveLength(6)
    expect(MAX_INSPECTIONS).toBe(REPRESENTATIONS.length)
    expect(REPRESENTATIONS[MAX_INSPECTIONS - 1]).toMatch(/NULL/)
  })

  it('MA-04 penalizes manipulation and reveals nothing for free', () => {
    expect(REVELATIONS.length).toBeGreaterThanOrEqual(5)
    expect(PENALTY_MS).toBeGreaterThan(1000)
  })
})

describe('Nietzsche × Deleuze divergence', () => {
  it('diverges lines deterministically', () => {
    const line = 'YOU RISE. THE ROOM IS EXACTLY AS LEFT.'
    expect(divergeLine(line, 1)).toBe(divergeLine(line, 1))
    expect(divergeLine(line, 1)).not.toBe(line)
  })

  it('reports identity falling as divergence accumulates', () => {
    const atZero = divergenceReport(12, 0)
    const atSix = divergenceReport(12, 6)
    expect(atZero.identity).toBe(1)
    expect(atSix.identity).toBeLessThan(atZero.identity)
    expect(atSix.difference).toBeGreaterThan(atZero.difference)
  })
})

describe('save schema v2', () => {
  it('migrates a v1 record, adding the endgame flag', () => {
    const v1 = { schemaVersion: 1, machines: {}, counters: {}, entered: true }
    const migrated = migrate(v1)
    expect(migrated['schemaVersion']).toBe(SCHEMA_VERSION)
    expect(migrated['observingAcknowledged']).toBe(false)
  })

  it('repairs missing endgame flag in partial payloads', () => {
    const repaired = repairRecord({ schemaVersion: 2, machines: {}, counters: {} })
    expect(repaired.observingAcknowledged).toBe(false)
    expect(repaired.schemaVersion).toBe(SCHEMA_VERSION)
  })

  it('fresh records are v2 with the flag unset', () => {
    const record = emptyRecord()
    expect(record.schemaVersion).toBe(SCHEMA_VERSION)
    expect(record.observingAcknowledged).toBe(false)
  })

  it('designation for the endgame stays at nine completions', () => {
    expect(designationFor(8)).toBe('OBSERVED')
    expect(designationFor(9)).toBe('APPARATUS')
  })
})
