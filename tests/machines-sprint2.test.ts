import { describe, expect, it } from 'vitest'

import {
  NEED_CATALOG,
  SATISFACTION_CEILING,
  nextNeed,
  spawnIntervalMs,
  stageFor,
} from '@/machines/cm-001-will/machine'
import { GRID_CONCEPTS, OTHER_OPTIONS, displacedGrid } from '@/machines/cm-002-desire/machine'
import { DISPLAY_LINES, MEDIATIONS, SECRET_DEMAND_THRESHOLD } from '@/machines/cm-003-vending/machine'
import {
  BREAKDOWN_STAGES,
  TOTAL_CRATES,
  breakdownLevelFor,
  dragResistance,
} from '@/machines/cm-004-broken-tool/machine'
import { LAYERS, VIEW_BUCKETS, bucketForAngle } from '@/machines/cm-005-bracket/machine'
import { SCENES, OUTCOMES, outcomeFor, replayAnnotations } from '@/machines/cm-006-again/machine'

describe('CM-001 will engine logic', () => {
  it('escalates need abstraction through stages', () => {
    expect(stageFor(0)).toBe(1)
    expect(stageFor(4)).toBe(2)
    expect(stageFor(10)).toBe(3)
    expect(stageFor(20)).toBe(4)
  })

  it('draws needs from the stage pool without immediate repetition', () => {
    for (let i = 0; i < 50; i++) {
      const need = nextNeed(20, 'meaning')
      expect(need.id).not.toBe('meaning')
      expect(NEED_CATALOG.some((n) => n.id === need.id)).toBe(true)
    }
  })

  it('generates wants spontaneously only at stage 3+, faster over time', () => {
    expect(spawnIntervalMs(1, 0)).toBeNull()
    expect(spawnIntervalMs(2, 5)).toBeNull()
    expect(spawnIntervalMs(3, 10)).toBeGreaterThan(0)
    expect(spawnIntervalMs(4, 30)).toBeLessThan(spawnIntervalMs(4, 20)!)
  })

  it('keeps the satisfaction index under its structural ceiling', () => {
    expect(SATISFACTION_CEILING).toBeLessThan(50)
  })
})

describe('CM-002 desire verification logic', () => {
  it('displaces tiles deterministically for identical inputs', () => {
    const order = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    const a = displacedGrid(order, 4, 2)
    const b = displacedGrid(order, 4, 2)
    expect(a).toEqual(b)
    expect(a).not.toEqual(order)
  })

  it('keeps the displacement a permutation', () => {
    const order = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    const displaced = displacedGrid(order, 0, 1)
    expect([...displaced].sort((x, y) => x - y)).toEqual(order)
  })

  it('has nine selectable concepts and four Other-options', () => {
    expect(GRID_CONCEPTS).toHaveLength(9)
    expect(OTHER_OPTIONS).toHaveLength(4)
    for (const option of OTHER_OPTIONS) {
      expect(option.response).toMatch(/^INCORRECT/)
    }
  })
})

describe('CM-003 vending logic', () => {
  it('exposes seven mediations, the request being the last', () => {
    expect(MEDIATIONS).toHaveLength(7)
    expect(MEDIATIONS[MEDIATIONS.length - 1].term).toBe('THE REQUEST ITSELF')
  })

  it('never mentions the prohibited schema', () => {
    for (const mediation of MEDIATIONS) {
      const text = `${mediation.term} ${mediation.line}`.toLowerCase()
      expect(text).not.toContain('thesis')
      expect(text).not.toContain('synthesis')
      expect(text).not.toContain('antithesis')
    }
  })

  it('records immediacy demanded after five presses', () => {
    expect(SECRET_DEMAND_THRESHOLD).toBe(5)
    expect(DISPLAY_LINES.immediate('COKE')).toContain('IMMEDIATE REQUEST DETECTED')
  })
})

describe('CM-004 breakdown staging', () => {
  it('activates stages in the authored order', () => {
    expect(breakdownLevelFor(0)).toBe(0)
    expect(breakdownLevelFor(1)).toBe(1)
    expect(breakdownLevelFor(2)).toBe(2)
    expect(breakdownLevelFor(3)).toBe(3)
    expect(breakdownLevelFor(6)).toBe(3)
  })

  it('increases drag resistance through breakdown', () => {
    expect(dragResistance(0)).toBe(1)
    expect(dragResistance(1)).toBeLessThan(1)
    expect(dragResistance(3)).toBeLessThan(dragResistance(1))
  })

  it('thresholds stay within the crate count', () => {
    for (const stage of BREAKDOWN_STAGES) {
      expect(stage.threshold).toBeLessThanOrEqual(TOTAL_CRATES)
    }
  })
})

describe('CM-005 bracket logic', () => {
  it('maps angles to canonical profile buckets', () => {
    expect(bucketForAngle(0)).toBe('front')
    expect(bucketForAngle(90)).toBe('side')
    expect(bucketForAngle(180)).toBe('back')
    expect(bucketForAngle(360)).toBe('front')
    expect(bucketForAngle(-90)).toBe('side-r')
  })

  it('brackets six layers of givenness', () => {
    expect(LAYERS.map((l) => l.id)).toEqual([
      'existence-thesis',
      'profile',
      'unseen-sides',
      'temporal-flow',
      'embodied-here',
      'identity',
    ])
  })

  it('buckets never contain an undefined view', () => {
    for (const bucket of VIEW_BUCKETS) {
      expect(typeof bucket).toBe('string')
    }
  })
})

describe('CM-006 again logic', () => {
  it('has a deterministic outcome for every scene choice', () => {
    for (const scene of SCENES) {
      for (const choice of scene.choices) {
        const line = outcomeFor(scene.id, choice.id)
        expect(line, `${scene.id}:${choice.id}`).not.toBe('THE MOMENT PASSES.')
        expect(OUTCOMES[`${scene.id}:${choice.id}`]).toBe(line)
      }
    }
  })

  it('the recorded life is twelve moments long', () => {
    expect(SCENES).toHaveLength(12)
  })

  it('replay annotations are deterministic per count', () => {
    expect(replayAnnotations(1)).toEqual(replayAnnotations(1))
    expect(replayAnnotations(1)).not.toEqual(replayAnnotations(3))
  })
})
