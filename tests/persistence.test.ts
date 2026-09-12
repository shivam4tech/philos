import { beforeEach, describe, expect, it } from 'vitest'

import {
  DEFAULT_SETTINGS,
  SCHEMA_VERSION,
  designationFor,
  emptyMachineRecord,
  emptyRecord,
  exportRecord,
  importRecord,
  loadRecord,
  loadSettings,
  migrate,
  repairRecord,
  repairSettings,
  saveRecord,
  saveSettings,
  totalCompletions,
} from '@/state/persistence'

beforeEach(() => {
  localStorage.clear()
})

describe('research record persistence', () => {
  it('returns a fresh record when nothing is stored', () => {
    const { record, source, corrupted } = loadRecord()
    expect(source).toBe('fresh')
    expect(corrupted).toBe(false)
    expect(record.schemaVersion).toBe(SCHEMA_VERSION)
    expect(record.entered).toBe(false)
    expect(record.designation).toBe('UNREGISTERED')
  })

  it('round-trips a record through save/load', () => {
    const record = emptyRecord()
    record.entered = true
    record.counters.sessions = 14
    record.machines['cm-001-will'] = {
      enteredCount: 3,
      completions: 1,
      modesCompleted: ['existential-test'],
      secretsFound: ['stillness-protocol'],
      totalInteractionMs: 254_000,
      lastEnteredAt: 1_000,
    }
    saveRecord(record)
    const { record: loaded, source } = loadRecord()
    expect(source).toBe('stored')
    expect(loaded.entered).toBe(true)
    expect(loaded.counters.sessions).toBe(14)
    expect(loaded.machines['cm-001-will'].completions).toBe(1)
    expect(loaded.machines['cm-001-will'].modesCompleted).toEqual(['existential-test'])
  })

  it('recovers from corrupt JSON without bricking', () => {
    localStorage.setItem('cml.research-record', '{not valid json,,,')
    const { record, source, corrupted } = loadRecord()
    expect(source).toBe('fresh')
    expect(corrupted).toBe(true)
    expect(record.machines).toEqual({})
    expect(localStorage.getItem('cml.corrupt-backup')).toContain('not valid json')
  })

  it('recovers from a structurally wrong payload', () => {
    localStorage.setItem('cml.research-record', JSON.stringify({ hello: 'world' }))
    const { record, corrupted } = loadRecord()
    expect(corrupted).toBe(true)
    expect(record.schemaVersion).toBe(SCHEMA_VERSION)
  })

  it('repairs partial payloads with defaults instead of failing', () => {
    const repaired = repairRecord({
      schemaVersion: 1,
      machines: { 'cm-006-again': { completions: 2, enteredCount: 'corrupt' } },
      counters: { sessions: 'garbage', recurrencesAccepted: 3 },
      designation: 'MARGINAL',
    })
    expect(repaired.machines['cm-006-again'].enteredCount).toBe(0)
    expect(repaired.machines['cm-006-again'].completions).toBe(2)
    expect(repaired.counters.sessions).toBe(0)
    expect(repaired.counters.recurrencesAccepted).toBe(3)
    expect(repaired.designation).toBe('UNREGISTERED')
  })

  it('treats the v1 migration chain as a passthrough', () => {
    const raw = { schemaVersion: SCHEMA_VERSION, machines: {}, counters: {} }
    expect(migrate(raw)).toEqual(raw)
  })

  it('export/import round-trips', () => {
    const record = emptyRecord()
    record.counters.contradictionsProduced = 41
    const text = exportRecord(record)
    const result = importRecord(text)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.record.counters.contradictionsProduced).toBe(41)
    }
  })

  it('rejects import of garbage with an institutional reason', () => {
    const bad = importRecord('this is not a record')
    expect(bad.ok).toBe(false)
    if (!bad.ok) expect(bad.reason).toMatch(/RESEARCH RECORD|JSON/)
  })
})

describe('designation thresholds', () => {
  it('tracks the endgame progression', () => {
    expect(designationFor(0)).toBe('UNREGISTERED')
    expect(designationFor(2)).toBe('UNREGISTERED')
    expect(designationFor(3)).toBe('OBSERVED')
    expect(designationFor(8)).toBe('OBSERVED')
    expect(designationFor(9)).toBe('APPARATUS')
  })

  it('counts completions from machine records', () => {
    const record = emptyRecord()
    record.machines['a'] = { ...emptyMachineRecord(), completions: 2 }
    record.machines['b'] = { ...emptyMachineRecord(), completions: 3 }
    expect(totalCompletions(record)).toBe(5)
  })
})

describe('settings persistence', () => {
  it('clamps out-of-range values to defaults', () => {
    const repaired = repairSettings({ master: 5, muted: 'yes' })
    expect(repaired.master).toBe(1)
    expect(repaired.muted).toBe(false)
    expect(repaired.ambience).toBe(DEFAULT_SETTINGS.ambience)
  })

  it('round-trips', () => {
    const settings = repairSettings({ ...DEFAULT_SETTINGS, master: 0.25, muted: true })
    saveSettings(settings)
    expect(loadSettings()).toEqual(settings)
  })

  it('falls back to defaults on unreadable data', () => {
    localStorage.setItem('cml.settings', '{{{')
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS)
  })
})
