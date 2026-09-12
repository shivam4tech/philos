import { describe, expect, it } from 'vitest'

import { CONTAMINATION_EFFECTS, effectsForSource } from '@/contamination/definitions'
import { INSTITUTION_MESSAGES, type InstitutionEvent } from '@/institution/messages'
import { APPARATUS_CONTENT } from '@/archive/content'

describe('contamination definitions', () => {
  it('has unique effect ids', () => {
    const ids = CONTAMINATION_EFFECTS.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('keeps probabilities in range and cooldowns positive', () => {
    for (const e of CONTAMINATION_EFFECTS) {
      expect(e.probability, e.id).toBeGreaterThan(0)
      expect(e.probability, e.id).toBeLessThanOrEqual(1)
      expect(e.cooldownMs, e.id).toBeGreaterThan(30_000)
      expect(e.applicableRoutes.length, e.id).toBeGreaterThan(0)
    }
  })

  it('uses route scopes that exist', () => {
    const allowed = new Set([
      'entrance',
      'catalogue',
      'facility',
      'archive',
      'record',
      'settings',
      'machine',
      'any',
    ])
    for (const e of CONTAMINATION_EFFECTS) {
      for (const route of e.applicableRoutes) {
        expect(allowed.has(route), `${e.id}: ${route}`).toBe(true)
      }
    }
  })

  it('each implemented shell effect maps back to its machine', () => {
    const fromWill = effectsForSource('cm-001-will')
    expect(fromWill.map((e) => e.id)).toEqual(
      expect.arrayContaining(['additional-request', 'remote-activation']),
    )
  })
})

describe('institution messages', () => {
  const categories = Object.keys(INSTITUTION_MESSAGES) as InstitutionEvent[]

  it('covers all event categories', () => {
    const required: InstitutionEvent[] = [
      'startup',
      'first-machine',
      'reset',
      'contradiction',
      'idle',
      'repeat-visitor',
      'many-failed-attempts',
      'secret',
      'late-progression',
      'archive-obsession',
      'audio-muted',
      'reduced-motion',
      'cross-contamination',
      'all-machines-complete',
    ]
    for (const category of required) {
      expect(categories).toContain(category)
    }
  })

  it('has substantive pools with no placeholder text', () => {
    for (const category of categories) {
      const pool = INSTITUTION_MESSAGES[category]
      expect(pool.length, category).toBeGreaterThanOrEqual(1)
      for (const message of pool) {
        expect(message.length, `${category}: "${message}"`).toBeGreaterThan(20)
        expect(message, category).not.toMatch(/TODO|FIXME|lorem|placeholder/i)
      }
    }
  })
})

describe('textual apparatus drafts', () => {
  it('covers every registered machine', () => {
    // registry import kept loose to avoid circular test deps
    const expected = 17
    expect(APPARATUS_CONTENT.size).toBe(expected)
  })

  it('carries citations, a conceptual problem, and take-back questions', () => {
    for (const [machineId, content] of APPARATUS_CONTENT) {
      expect(content.primarySource.length, machineId).toBeGreaterThan(0)
      for (const citation of content.primarySource) {
        expect(citation.length, machineId).toBeGreaterThan(10)
      }
      expect(content.conceptualProblem.length, machineId).toBeGreaterThan(120)
      expect(content.questionsForTheText.length, machineId).toBeGreaterThan(0)
    }
  })
})
