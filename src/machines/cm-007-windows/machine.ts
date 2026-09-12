/**
 * CM-007 — monad internals. Every monad's state is a deterministic function
 * of the shared clock plus its own phase: no transmission, perfect
 * correspondence.
 */

export const MONAD_STATES = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'EPSILON', 'ZETA'] as const
export type MonadState = (typeof MONAD_STATES)[number]

export interface MonadSpec {
  id: 'A' | 'B' | 'C'
  /** internal principle: period of its own sequence, in ticks */
  periodTicks: number
  phase: number
}

export const MONADS: MonadSpec[] = [
  { id: 'A', periodTicks: 4, phase: 0 },
  { id: 'B', periodTicks: 4, phase: 1 },
  { id: 'C', periodTicks: 4, phase: 2 },
]

/** A monad's state at tick t — function of its own principle only. */
export function monadState(spec: MonadSpec, t: number): MonadState {
  const step = Math.floor(t / spec.periodTicks) + spec.phase
  return MONAD_STATES[((step % 6) + 6) % 6]
}

/** What the monad will be next tick — predictable, since it is internal. */
export function predictedNext(spec: MonadSpec, t: number): MonadState {
  return monadState(spec, t + spec.periodTicks)
}

/**
 * The correspondence table: what B and C show when A shows a given state.
 * Pre-established — no causal channel required, or permitted.
 */
export const CORRESPONDENCE: Record<MonadState, { B: MonadState; C: MonadState }> = {
  ALPHA: { B: 'BETA', C: 'GAMMA' },
  BETA: { B: 'GAMMA', C: 'DELTA' },
  GAMMA: { B: 'DELTA', C: 'EPSILON' },
  DELTA: { B: 'EPSILON', C: 'ZETA' },
  EPSILON: { B: 'ZETA', C: 'ALPHA' },
  ZETA: { B: 'ALPHA', C: 'BETA' },
}

/** Correspondence holds when the table is satisfied. It always is. */
export function correspondenceHolds(a: MonadState, b: MonadState, c: MonadState): boolean {
  return CORRESPONDENCE[a].B === b && CORRESPONDENCE[a].C === c
}

export const CORRESPONDENCE_EVENTS_FOR_COMPLETION = 3

export const FEED_LINES: Record<'A' | 'B' | 'C', string[]> = {
  A: [
    'A BRIGHTNESS IN ME TODAY. NO REASON.',
    'I FIND MYSELF COUNTING IN FOURS.',
    'SOMETHING LIKE ANTICIPATION.',
    'THE INTERIOR IS LOUD THIS EVENING.',
  ],
  B: [
    'STRANGELY, I ALSO.',
    'WHAT A COINCIDENCE. AGAIN.',
    'I WAS ABOUT TO POST THE SAME.',
    'FOURS AS WELL. UNSETTLING.',
  ],
  C: [
    'AS DO I. WHOM ARE WE ANSWERING?',
    'THE PATTERN CONTINUES.',
    'I HAVE NO ANSWER. THE PATTERN HOLDS.',
    'COUNTING. SAME NUMERALS.',
  ],
}

export const LINES = {
  perturbed: 'MONAD {X} PERTURBED. CAUSAL TRANSMISSION: 0.',
  responded: 'MONADS B AND C ENTERED THE CORRESPONDING STATES. TRANSMITTED INFLUENCE: 0.',
  declareAvailable: 'CORRESPONDENCE OBSERVED {N} TIMES. DECLARATION PERMITTED.',
  declared: 'CORRESPONDENCE DECLARED PERFECT.',
  windowless: 'NO CAUSAL INTERACTION WAS DETECTED. CORRESPONDENCE REMAINS PERFECT.',
  transmissionFailed: 'TRANSMISSION FAILED: NO WINDOWS.',
}
