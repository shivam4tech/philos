/**
 * CM-001 — pure need-escalation logic (unit-tested). The component applies
 * these functions; the loop itself is authored here.
 */

export interface NeedDef {
  id: string
  label: string
  stage: number
}

export const NEED_CATALOG: NeedDef[] = [
  { id: 'hunger', label: 'HUNGER', stage: 1 },
  { id: 'thirst', label: 'THIRST', stage: 1 },
  { id: 'fatigue', label: 'FATIGUE', stage: 1 },
  { id: 'comfort', label: 'COMFORT', stage: 2 },
  { id: 'warmth', label: 'WARMTH', stage: 2 },
  { id: 'rest', label: 'REST', stage: 2 },
  { id: 'recognition', label: 'RECOGNITION', stage: 3 },
  { id: 'security', label: 'SECURITY', stage: 3 },
  { id: 'attention', label: 'ATTENTION', stage: 3 },
  { id: 'possession', label: 'POSSESSION', stage: 3 },
  { id: 'novelty', label: 'NOVELTY', stage: 4 },
  { id: 'meaning', label: 'MEANING', stage: 4 },
  { id: 'understanding', label: 'UNDERSTANDING', stage: 4 },
  { id: 'escape', label: 'ESCAPE', stage: 4 },
  { id: 'significance', label: 'SIGNIFICANCE', stage: 4 },
  { id: 'closure', label: 'CLOSURE', stage: 4 },
  { id: 'transcendence', label: 'TRANSCENDENCE', stage: 4 },
]

/** Stage progression: the wants become abstract as satisfaction accumulates. */
export function stageFor(satisfiedCount: number): number {
  if (satisfiedCount < 4) return 1
  if (satisfiedCount < 10) return 2
  if (satisfiedCount < 20) return 3
  return 4
}

/** Needs available at a given stage, without repeating the previous one. */
export function nextNeed(satisfiedCount: number, previousId: string | null, rng: () => number = Math.random): NeedDef {
  const stage = stageFor(satisfiedCount)
  const pool = NEED_CATALOG.filter((n) => n.stage <= stage && n.id !== previousId)
  return pool[Math.floor(rng() * pool.length)]
}

/** Milliseconds between spontaneous want spawns at the top end. */
export function spawnIntervalMs(stage: number, satisfiedCount: number): number | null {
  if (stage < 3) return null
  const base = stage === 3 ? 9_000 : 4_500
  const accel = Math.max(1_400, base - satisfiedCount * 120)
  return accel
}

/** The structural ceiling of the satisfaction index — it never rises above this. */
export const SATISFACTION_CEILING = 34

export const RELIEF_PER_SATISFY = 26
export const RELIEF_DECAY_PER_TICK = 1.4

export const STILLNESS_THRESHOLD_MS = 24_000
export const EARLY_IDLE_NOTE_MS = 13_000

export const LOG_LINES = {
  satisfy: [
    'RELIEF RECORDED.',
    'SATISFACTION ACHIEVED. DECAY BEGINS.',
    'THE NEED REPORTS ITSELF SATISFIED. THE METER DISAGREES.',
    'SATISFACTION FILED. NEXT DEFICIENCY PREPARING.',
  ],
  stage: [
    'THE ENGINE HAS EXPANDED ITS PORTFOLIO.',
    'MORE ABSTRACT NEEDS ARE NOW MANUFACTURED.',
    'WANT GENERATION IS NOW SELF-SUSTAINING.',
  ],
  endSession: 'NEW DESIRE DETECTED: DESIRE TO STOP DESIRING',
  stillness: [
    'INPUT HAS CEASED.',
    'THE NEEDS FIND NO SURFACE TO LAND ON.',
    'ONE BY ONE, THE WANTS CLOSE THEMSELVES.',
    'THE STRIVING HAS NOT BEEN SATISFIED. IT HAS CEASED.',
  ],
  idleNote: 'INACTIVITY OBSERVED. THE ENGINE WONDERS WHETHER YOU HAVE DISCOVERED REFRAINING.',
}
