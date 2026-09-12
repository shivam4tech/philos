/**
 * CM-005 — bracket layers (pure data + view bucket math).
 */

export interface BracketLayer {
  id: string
  title: string
  /** shown once bracketed */
  line: string
}

export const LAYERS: BracketLayer[] = [
  {
    id: 'existence-thesis',
    title: 'ASSERTED EXISTENCE',
    line: 'THE EXISTENCE-THESIS IS SUSPENDED. WHAT REMAINS: A CHAIR-APPEARANCE, GIVEN. THIS IS NOT DOUBT ABOUT THE CHAIR.',
  },
  {
    id: 'profile',
    title: 'VISUAL PROFILE',
    line: 'GIVEN: ONE PROFILE. DRAG TO TURN IT. THE CHAIR ITSELF IS NOT AMONG THE GIVEN.',
  },
  {
    id: 'unseen-sides',
    title: 'UNSEEN SIDES',
    line: 'EVERY PROFILE ANNOUNCES THE OTHERS. THE UNSEEN IS CO-GIVEN WITH THE SEEN.',
  },
  {
    id: 'temporal-flow',
    title: 'RETENTION / PROTOTENTION',
    line: 'THE NOW-PROFILE CARRIES ITS JUST-PAST (RETENTION) AND POINTS TO ITS NOT-YET (PROTOTENTION).',
  },
  {
    id: 'embodied-here',
    title: 'BODILY ORIENTATION',
    line: 'THE PROFILE IS INDEXED TO A BODY. THERE IS NO VIEW FROM NOWHERE.',
  },
  {
    id: 'identity',
    title: 'IDENTITY ACROSS APPEARANCES',
    line: 'IDENTITY: SYNTHESIZED, NOT OBSERVED. THE ONE CHAIR IS AN ACHIEVEMENT.',
  },
]

/** Eight rotation buckets mapped to canonical chair profiles. */
export const VIEW_BUCKETS = [
  'front',
  'three-quarter',
  'side',
  'three-quarter-r',
  'back',
  'three-quarter',
  'side-r',
  'top',
] as const

export type ViewBucket = (typeof VIEW_BUCKETS)[number]

export function bucketForAngle(angle: number): ViewBucket {
  const normalized = ((Math.round(angle / 45) % 8) + 8) % 8
  return VIEW_BUCKETS[normalized]
}

export const VERDICT = 'THE OBJECT REMAINS — AS CONSTITUTED.'
