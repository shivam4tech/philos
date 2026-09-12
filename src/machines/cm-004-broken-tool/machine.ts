/**
 * CM-004 — breakdown staging (pure). The handler degrades in the order
 * Heidegger describes: catching → obtrusiveness → obstinacy.
 */

export interface BreakdownStage {
  level: number
  /** crates that must be placed before this stage activates */
  threshold: number
  label: string
  note: string
}

export const BREAKDOWN_STAGES: BreakdownStage[] = [
  {
    level: 1,
    threshold: 1,
    label: 'AUFFÄLLIGKEIT',
    note: 'THE HANDLER CATCHES. THIS IS NOTEWORTHY.',
  },
  {
    level: 2,
    threshold: 2,
    label: 'AUFRDRINGLICHKEIT',
    note: 'THE HANDLER OBTRUDES. COMPONENTS ANNOUNCE THEMSELVES.',
  },
  {
    level: 3,
    threshold: 3,
    label: 'AUFSÄSSIGKEIT',
    note: 'A CONTROL REFUSES. ITS IDENTITY HAS BECOME EXAMINABLE.',
  },
]

export function breakdownLevelFor(placed: number): number {
  let level = 0
  for (const stage of BREAKDOWN_STAGES) {
    if (placed >= stage.threshold) level = stage.level
  }
  return level
}

/** Drag resistance multiplier once the handler catches. */
export function dragResistance(level: number): number {
  if (level <= 0) return 1
  if (level === 1) return 0.55
  return 0.3
}

export const TOTAL_CRATES = 6

export const STAGE_LABELS = {
  task: 'SORT SIX CRATES ONTO SHELVES. USE THE HANDLER.',
  placed: (n: number) => `${n}/6 CRATES SHELVED`,
  objectified: 'THE EQUIPMENT HAS BECOME AN OBJECT.',
  unhandled: 'button.zone__drop_target — DISPATCH: UNHANDLED',
  conspicuous: 'THIS CONTROL HAS BECOME CONSPICUOUS.',
}

export const COMPONENT_LABELS = [
  'div.handler_grabber',
  'div.zone__drop_target',
  'div.crate_manifest',
  'span.crate_code',
  'section.apparatus_stage',
  'div.shelf__slot',
]
