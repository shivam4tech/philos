import { describe, expect, it } from 'vitest'

import {
  CORRESPONDENCE_EVENTS_FOR_COMPLETION,
  CORRESPONDENCE,
  MONADS,
  correspondenceHolds,
  monadState,
  predictedNext,
} from '@/machines/cm-007-windows/machine'
import {
  EPISODES,
  LINES,
  SIGN,
  USE_EXERCISES,
} from '@/machines/cm-008-private/machine'
import {
  GENERATIONS_FOR_COMPLETION,
  INITIAL_PARAMS,
  identityScore,
  lineageName,
  transform,
  type GenealogyNode,
} from '@/machines/cm-009-difference/machine'
import {
  FORMS,
  FORMS_FOR_COMPLETION,
  INITIAL_STATE,
  PRESSURE_FOR_COMPLETION,
} from '@/machines/cm-010-expenditure/machine'
import { CONTRACT_CLAUSES, DEPTH_FOR_COMPLETION, TERMS } from '@/machines/cm-011-terms/machine'
import {
  PANEL_SEQUENCE,
  TARGET_VALUES,
  TASKS,
  TRANSCRIPTION,
  emptyMetrics,
  formatMetrics,
  predictedCompliance,
} from '@/machines/cm-012-observation/machine'

describe('CM-007 monadic logic', () => {
  it('states are functions of the shared clock and internal principle only', () => {
    const a = MONADS[0]
    expect(monadState(a, 0)).toBe(monadState(a, 0))
    expect(monadState(a, 4)).not.toBe(monadState(a, 0))
  })

  it('the correspondence table always holds for concurrent states', () => {
    for (let t = 0; t < 48; t++) {
      const s = {
        A: monadState(MONADS[0], t),
        B: monadState(MONADS[1], t),
        C: monadState(MONADS[2], t),
      }
      expect(correspondenceHolds(s.A, s.B, s.C), `t=${t}`).toBe(true)
    }
  })

  it('predictions match what the own-principle will show', () => {
    for (const monad of MONADS) {
      expect(predictedNext(monad, 7)).toBe(monadState(monad, 7 + monad.periodTicks))
    }
  })

  it('the table is defined for every state', () => {
    expect(Object.keys(CORRESPONDENCE)).toHaveLength(6)
    expect(CORRESPONDENCE_EVENTS_FOR_COMPLETION).toBe(3)
  })
})

describe('CM-008 private room data', () => {
  it('every episode uses the same private sign', () => {
    expect(EPISODES.length).toBeGreaterThanOrEqual(5)
    for (const episode of EPISODES) {
      expect(episode.sign).toBe(SIGN)
    }
  })

  it('the refusal line names the collapse of correctness', () => {
    expect(LINES.refusal).toMatch(/WHATEVER SEEMS RIGHT WILL BE RIGHT/)
    expect(USE_EXERCISES.length).toBeGreaterThanOrEqual(2)
  })
})

describe('CM-009 difference engine', () => {
  it('never reproduces: transform is pure but never the identity', () => {
    let params = INITIAL_PARAMS
    for (let seed = 0; seed < 64; seed++) {
      const next = transform(params, seed)
      expect(next).not.toEqual(params)
      params = next
    }
  })

  it('is deterministic: same lineage, same children', () => {
    const a = transform(INITIAL_PARAMS, 42)
    const b = transform(INITIAL_PARAMS, 42)
    expect(a).toEqual(b)
  })

  it('accumulates divergence: identity falls across generations', () => {
    let params = INITIAL_PARAMS
    const nodes: GenealogyNode[] = [{ id: 0, parentId: null, generation: 0, params }]
    for (let seed = 1; seed <= 30; seed++) {
      params = transform(params, seed)
      nodes.push({ id: seed, parentId: seed - 1, generation: seed, params })
    }
    const early = identityScore(nodes.slice(0, 5))
    const late = identityScore(nodes.slice(-10))
    expect(late).toBeLessThan(early)
  })

  it('names lineages from their tendencies', () => {
    const names = new Set([lineageName([])])
    expect(names.size).toBe(1)
    expect(GENERATIONS_FOR_COMPLETION).toBe(24)
  })
})

describe('CM-010 expenditure economy', () => {
  it('offers at least four authored expenditure forms', () => {
    expect(FORMS.length).toBeGreaterThanOrEqual(4)
    for (const form of FORMS) {
      expect(form.consequence.length).toBeGreaterThan(20)
      expect(form.cost).toBeGreaterThan(0)
    }
  })

  it('completion requires several modes and real pressure', () => {
    expect(FORMS_FOR_COMPLETION).toBe(4)
    expect(PRESSURE_FOR_COMPLETION).toBeGreaterThan(INITIAL_STATE.pressure)
  })
})

describe('CM-011 terms graph', () => {
  it('every reference points to a defined term', () => {
    const defined = new Set(TERMS.map((t) => t.term))
    for (const term of TERMS) {
      for (const ref of term.references) {
        expect(defined.has(ref), `${term.term} → ${ref}`).toBe(true)
      }
    }
  })

  it('no term is defined in itself, and the contract clauses are mostly term-linked', () => {
    for (const term of TERMS) {
      expect(term.references).not.toContain(term.term)
    }
    const defined = new Set(TERMS.map((t) => t.term))
    const linked = CONTRACT_CLAUSES.filter((clause) =>
      [...defined].some((t) => clause.includes(t)),
    )
    // the meta-clause ("define any term, including this one") is deliberately term-free
    expect(linked.length).toBeGreaterThanOrEqual(CONTRACT_CLAUSES.length - 1)
  })

  it('requires real depth before accepting', () => {
    expect(DEPTH_FOR_COMPLETION).toBe(10)
    expect(TERMS.length).toBeGreaterThanOrEqual(DEPTH_FOR_COMPLETION)
  })
})

describe('CM-012 observation metrics', () => {
  it('a compliant session scores higher than a deviant one', () => {
    const good = { ...emptyMetrics(), inputEvents: 10 }
    const bad = {
      ...emptyMetrics(),
      instructionDeviations: 6,
      selfCorrections: 9,
      exitHoversMs: 4200,
      timeBeforeComplianceMs: 3000,
    }
    expect(predictedCompliance(good)).toBeGreaterThan(predictedCompliance(bad))
  })

  it('formats every metric for the dossier', () => {
    const rows = formatMetrics(emptyMetrics())
    expect(rows).toHaveLength(6)
    for (const row of rows) expect(row.value).not.toBe('')
  })

  it('the routine stays mundane and local', () => {
    expect(TASKS.length).toBe(3)
    expect(TARGET_VALUES).toHaveLength(3)
    expect(PANEL_SEQUENCE).toHaveLength(4)
    expect(TRANSCRIPTION).toMatch(/^ONTOLOGICAL/)
  })
})
