import { beforeEach, describe, expect, it } from 'vitest'

import { parseHash, routeToHash, type Route } from '@/router/router'
import { InstitutionEngine } from '@/institution/engine'
import { isEligible, selectEffect, routeInScope } from '@/contamination/engine'
import { CONTAMINATION_BY_ID } from '@/contamination/definitions'
import { emptyRecord, type ResearchRecord } from '@/state/persistence'
import {
  completeMachine,
  discoverSecret,
  enterMachine,
  leaveMachine,
  resetResearchRecord,
  getRecord,
} from '@/state/record'

/* ------------------------------------------------------------------ */
/* router                                                              */
/* ------------------------------------------------------------------ */

describe('router', () => {
  it('parses all shell routes', () => {
    expect(parseHash('#/').name).toBe('entrance')
    expect(parseHash('').name).toBe('entrance')
    expect(parseHash('#/facility').name).toBe('facility')
    expect(parseHash('#/catalogue').name).toBe('catalogue')
    expect(parseHash('#/record').name).toBe('record')
    expect(parseHash('#/archive').name).toBe('archive')
    expect(parseHash('#/settings').name).toBe('settings')
    expect(parseHash('#/chamber').name).toBe('chamber')
  })

  it('validates machine ids against the registry', () => {
    expect(parseHash('#/machine/cm-001-will')).toEqual({
      name: 'machine',
      id: 'cm-001-will',
    })
    expect(parseHash('#/machine/not-a-machine')).toEqual({ name: 'catalogue' })
    expect(parseHash('#/archive/cm-004-broken-tool')).toEqual({
      name: 'archive-machine',
      id: 'cm-004-broken-tool',
    })
    expect(parseHash('#/archive/junk')).toEqual({ name: 'archive' })
  })

  it('falls back to the catalogue for unknown routes', () => {
    expect(parseHash('#/wherever')).toEqual({ name: 'catalogue' })
  })

  it('round-trips routes through hashes', () => {
    const routes: Route[] = [
      { name: 'entrance' },
      { name: 'facility' },
      { name: 'machine', id: 'cm-001-will' },
      { name: 'archive-machine', id: 'cm-006-again' },
      { name: 'chamber' },
    ]
    for (const route of routes) {
      expect(parseHash(routeToHash(route))).toEqual(route)
    }
  })
})

/* ------------------------------------------------------------------ */
/* institution engine                                                  */
/* ------------------------------------------------------------------ */

describe('institution engine', () => {
  it('emits immediately the first time', () => {
    const engine = new InstitutionEngine()
    const message = engine.emit('contradiction', 1_000)
    expect(message).toBeTruthy()
    expect(message).toMatch(/CONTRADICTION|RESOLVE THE CONTRADICTION/)
  })

  it('blocks repeat emissions within the cooldown', () => {
    const engine = new InstitutionEngine()
    expect(engine.emit('contradiction', 1_000)).toBeTruthy()
    expect(engine.emit('contradiction', 2_000)).toBeNull()
    expect(engine.emit('contradiction', 1_000 + 120_000 - 1)).toBeNull()
    expect(engine.emit('contradiction', 1_000 + 120_000)).toBeTruthy()
  })

  it('startup has no cooldown but audio-muted does', () => {
    const engine = new InstitutionEngine()
    expect(engine.emit('startup', 0)).toBeTruthy()
    expect(engine.emit('startup', 1)).toBeTruthy()
    expect(engine.emit('audio-muted', 0)).toBeTruthy()
    expect(engine.emit('audio-muted', 1_000)).toBeNull()
  })

  it('reports remaining cooldown', () => {
    const engine = new InstitutionEngine()
    engine.emit('idle', 0)
    const remaining = engine.cooldownRemaining('idle', 60_000)
    expect(remaining).toBe(4 * 60_000)
  })
})

/* ------------------------------------------------------------------ */
/* contamination engine                                                */
/* ------------------------------------------------------------------ */

function recordWithUnlock(effectId: string, completions = 3): ResearchRecord {
  const record = emptyRecord()
  record.contamination.unlocked.push(effectId)
  record.machines['cm-001-will'] = {
    enteredCount: 1,
    completions,
    modesCompleted: [],
    secretsFound: [],
    totalInteractionMs: 0,
    lastEnteredAt: null,
  }
  return record
}

describe('contamination eligibility', () => {
  it('rejects effects the record has not unlocked', () => {
    const def = CONTAMINATION_BY_ID.get('conspicuous-tool')
    expect(def).toBeDefined()
    if (!def) return
    const eligible = isEligible(def, {
      route: 'catalogue',
      now: 1_000,
      record: emptyRecord(),
    })
    expect(eligible).toBe(false)
  })

  it('rejects effects out of route scope', () => {
    const def = CONTAMINATION_BY_ID.get('search-interrogation')
    expect(def).toBeDefined()
    if (!def) return
    expect(routeInScope('catalogue', 'catalogue')).toBe(true)
    expect(routeInScope('catalogue', 'facility')).toBe(false)
    const eligible = isEligible(def, {
      route: 'facility',
      now: 1_000,
      record: recordWithUnlock(def.id),
    })
    expect(eligible).toBe(false)
  })

  it('respects cooldowns from the record', () => {
    const def = CONTAMINATION_BY_ID.get('conspicuous-tool')
    if (!def) return
    const record = recordWithUnlock(def.id)
    record.contamination.cooldownUntil[def.id] = 5_000
    expect(isEligible(def, { route: 'catalogue', now: 4_999, record })).toBe(false)
    expect(isEligible(def, { route: 'catalogue', now: 5_000, record })).toBe(true)
  })

  it('selectEffect only returns eligible candidates', () => {
    const candidates = [...CONTAMINATION_BY_ID.values()]
    const empty = selectEffect(candidates, { route: 'catalogue', now: 0, record: emptyRecord() })
    expect(empty).toBeNull()
    const def = CONTAMINATION_BY_ID.get('conspicuous-tool')
    if (!def) return
    const record = recordWithUnlock(def.id)
    const chosen = selectEffect([def], { route: 'catalogue', now: 0, record }, () => 0.99)
    expect(chosen?.id).toBe(def.id)
  })
})

/* ------------------------------------------------------------------ */
/* record actions                                                      */
/* ------------------------------------------------------------------ */

beforeEach(() => {
  resetResearchRecord()
})

describe('record actions', () => {
  it('completing a machine increments its counter and unlocks its vectors', () => {
    enterMachine('cm-004-broken-tool')
    const fresh = completeMachine('cm-004-broken-tool', 'tool:equipment-objectified')
    expect(fresh).toContain('conspicuous-tool')
    expect(getRecord().machines['cm-004-broken-tool'].completions).toBe(1)
    expect(getRecord().contamination.unlocked).toContain('conspicuous-tool')

    const second = completeMachine('cm-004-broken-tool', 'tool:equipment-objectified')
    expect(second).toEqual([])
    expect(getRecord().machines['cm-004-broken-tool'].completions).toBe(2)
  })

  it('entering/leaving tracks interaction time', () => {
    enterMachine('cm-006-again')
    leaveMachine('cm-006-again', 42_000)
    leaveMachine('cm-006-again', 8_000)
    expect(getRecord().machines['cm-006-again'].enteredCount).toBe(1)
    expect(getRecord().machines['cm-006-again'].totalInteractionMs).toBe(50_000)
  })

  it('secrets are recorded once', () => {
    discoverSecret({ id: 'stillness-protocol', code: 'UR-001', classification: 'SUSPENDED STRIVING' })
    discoverSecret({ id: 'stillness-protocol', code: 'UR-001', classification: 'SUSPENDED STRIVING' })
    expect(getRecord().secrets).toHaveLength(1)
    expect(getRecord().counters.unauthorizedProcedures).toBe(1)
  })

  it('designation follows completions', () => {
    expect(getRecord().designation).toBe('UNREGISTERED')
    for (let i = 0; i < 3; i++) {
      enterMachine('cm-006-again')
      completeMachine('cm-006-again', 'again:recurrence-accepted')
    }
    expect(getRecord().designation).toBe('OBSERVED')
  })
})
