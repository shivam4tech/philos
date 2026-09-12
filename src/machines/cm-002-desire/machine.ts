/**
 * CM-002 — verification exercise data and displacement logic (pure).
 */

export interface VerificationConcept {
  id: string
  label: string
}

export const GRID_CONCEPTS: VerificationConcept[] = [
  { id: 'warmth', label: 'WARMTH' },
  { id: 'approval', label: 'APPROVAL' },
  { id: 'money', label: 'MONEY' },
  { id: 'sleep', label: 'SLEEP' },
  { id: 'love', label: 'LOVE' },
  { id: 'meaning', label: 'MEANING' },
  { id: 'control', label: 'CONTROL' },
  { id: 'escape', label: 'ESCAPE' },
  { id: 'hunger', label: 'HUNGER' },
]

export const OTHER_OPTIONS = [
  { id: 'already', label: 'WHAT YOU ALREADY WANT', response: 'INCORRECT. THE OTHER WANTS YOUR WANTING ITSELF.' },
  { id: 'theirs', label: 'WHAT THEY HAVE', response: 'INCORRECT. THE OTHER WANTS YOU TO WANT IT WITHOUT RESENTING THEM.' },
  { id: 'missing', label: 'WHAT IS MISSING', response: 'INCORRECT. WHAT IS MISSING IS ONLY VISIBLE FROM WHERE THE OTHER STANDS.' },
  { id: 'notwant', label: 'NOT TO WANT', response: 'INCORRECT. THE OTHER DOES NOT ACCEPT SILENCE AS AN ANSWER.' },
]

/** Grid displacement: approaching a tile swaps it with a determinate neighbor. */
export function displacedGrid(
  order: number[],
  hoverIndex: number,
  swapCount: number,
): number[] {
  const next = [...order]
  const neighbor = (hoverIndex + 2 + (swapCount % 3)) % 9
  const tmp = next[hoverIndex]
  next[hoverIndex] = next[neighbor]
  next[neighbor] = tmp
  return next
}

export const EXERCISE_LINES = {
  intro: 'VERIFY THAT YOUR DESIRE IS YOUR OWN.',
  exercise1: 'SELECT ALL SQUARES CONTAINING WHAT YOU WANT.',
  drift: 'THE MARK HAS DRIFTED. YOUR SELECTIONS COULD NOT BE RETAINED.',
  exercise2: 'WHAT DO YOU THINK THE OTHER WANTS YOU TO WANT?',
  exercise3: 'IDENTIFY THE MISSING OBJECT.',
  missingDone: 'THE MISSING OBJECT HAS BEEN LOCATED IN EVERY POSITION. INCLUDING YOURS.',
  triage: 'SESSION TRIAGE — CATEGORIES OF THE SESSION’S CONDUCT, NOT OF THE SUBJECT.',
  final: ['VERIFICATION INCOMPLETE.', 'DESIRE REMAINS OPERATIONAL.'],
}
