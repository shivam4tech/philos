/**
 * Contamination definitions — the authored inventory of ways completing an
 * apparatus destabilizes the laboratory shell. The engine (Sprint 1) reads
 * these and applies unlock conditions, probabilities, and cooldowns.
 */

export type RouteScope =
  | 'entrance'
  | 'catalogue'
  | 'facility'
  | 'archive'
  | 'record'
  | 'settings'
  | 'machine'
  | 'any'

export interface ContaminationEffectDef {
  id: string
  /** machine whose completion unlocks this effect; 'lab' = progression drift */
  sourceMachineId: string
  /** institutional designation shown when the effect is logged */
  designation: string
  /** internal description for the contamination ledger */
  description: string
  /** authored escalation tier: 1 subtle → 3 structural */
  severity: 1 | 2 | 3
  /** chance per eligible trigger, 0–1 */
  probability: number
  /** minimum ms between firings of this effect */
  cooldownMs: number
  /** global apparatus completions required before the effect is eligible */
  minCompletions: number
  /** route contexts in which the effect may fire */
  applicableRoutes: RouteScope[]
}

export const CONTAMINATION_EFFECTS: ContaminationEffectDef[] = [
  {
    id: 'conspicuous-tool',
    sourceMachineId: 'cm-004-broken-tool',
    designation: 'CONSPICUOUS TOOL EVENT',
    description:
      'A routine interface control stops working, becomes outlined and labeled with its component name, and issues an institutional apology.',
    severity: 2,
    probability: 0.15,
    cooldownMs: 8 * 60_000,
    minCompletions: 1,
    applicableRoutes: ['catalogue', 'facility', 'archive', 'record', 'settings'],
  },
  {
    id: 'semantic-linkage',
    sourceMachineId: 'cm-011-terms',
    designation: 'SEMANTIC LINKAGE',
    description:
      'Terms embedded in shell copy become clickable chains of further definitions.',
    severity: 1,
    probability: 0.2,
    cooldownMs: 10 * 60_000,
    minCompletions: 1,
    applicableRoutes: ['catalogue', 'archive', 'record'],
  },
  {
    id: 'definitional-echo',
    sourceMachineId: 'cm-011-terms',
    designation: 'DEFINITIONAL ECHO',
    description:
      'A terminal chirp repeats once, quietly, after a semantic shift has occurred.',
    severity: 1,
    probability: 0.3,
    cooldownMs: 5 * 60_000,
    minCompletions: 1,
    applicableRoutes: ['any'],
  },
  {
    id: 'sequence-replay',
    sourceMachineId: 'cm-006-again',
    designation: 'IDENTICAL SEQUENCE REPLAY',
    description:
      'A recent navigation sequence repeats exactly; the exit is the same entry.',
    severity: 3,
    probability: 0.1,
    cooldownMs: 15 * 60_000,
    minCompletions: 1,
    applicableRoutes: ['catalogue', 'facility', 'archive'],
  },
  {
    id: 'search-interrogation',
    sourceMachineId: 'cm-002-desire',
    designation: 'SEARCH FIELD INTERROGATION',
    description:
      'The catalogue search placeholder mutates: WHAT ARE YOU LOOKING FOR? → WHAT DO YOU EXPECT TO FIND? → WHO DO YOU EXPECT TO FIND IT FOR?',
    severity: 2,
    probability: 0.2,
    cooldownMs: 6 * 60_000,
    minCompletions: 1,
    applicableRoutes: ['catalogue', 'archive'],
  },
  {
    id: 'behavioral-summary',
    sourceMachineId: 'cm-012-observation',
    designation: 'BEHAVIORAL SUMMARY RELEASED',
    description:
      'The institute surfaces a dossier of the subject’s own recent conduct: hovers, hesitations, deviations.',
    severity: 2,
    probability: 0.15,
    cooldownMs: 12 * 60_000,
    minCompletions: 1,
    applicableRoutes: ['any'],
  },
  {
    id: 'additional-request',
    sourceMachineId: 'cm-001-will',
    designation: 'ADDITIONAL INSTITUTIONAL REQUEST',
    description:
      'Completion of one task immediately generates a further institutional request.',
    severity: 1,
    probability: 0.25,
    cooldownMs: 8 * 60_000,
    minCompletions: 1,
    applicableRoutes: ['catalogue', 'facility', 'archive'],
  },
  {
    id: 'remote-activation',
    sourceMachineId: 'cm-001-will',
    designation: 'REMOTE APPARATUS ACTIVATION',
    description:
      'Closing one apparatus causes another, elsewhere in the catalogue, to power on.',
    severity: 2,
    probability: 0.2,
    cooldownMs: 10 * 60_000,
    minCompletions: 1,
    applicableRoutes: ['catalogue', 'facility'],
  },
  {
    id: 'contradictory-signage',
    sourceMachineId: 'cm-003-vending',
    designation: 'CONTRADICTORY SIGNAGE',
    description:
      'A label negates itself; navigating the negation becomes a legitimate transition.',
    severity: 2,
    probability: 0.15,
    cooldownMs: 9 * 60_000,
    minCompletions: 1,
    applicableRoutes: ['catalogue', 'facility', 'archive'],
  },
  {
    id: 'perfect-correspondence',
    sourceMachineId: 'cm-007-windows',
    designation: 'PERFECT CORRESPONDENCE',
    description:
      'A distant sequence elsewhere in the lab synchronizes exactly with the subject’s interaction rhythm.',
    severity: 3,
    probability: 0.08,
    cooldownMs: 20 * 60_000,
    minCompletions: 1,
    applicableRoutes: ['any'],
  },
  {
    id: 'institutional-drift',
    sourceMachineId: 'lab',
    designation: 'INSTITUTIONAL DRIFT',
    description:
      'Contradictory labels, unusual system notices, and small equipment misbehavior escalate with research progress.',
    severity: 1,
    probability: 0.1,
    cooldownMs: 7 * 60_000,
    minCompletions: 4,
    applicableRoutes: ['any'],
  },
]

export const CONTAMINATION_BY_ID: ReadonlyMap<string, ContaminationEffectDef> = new Map(
  CONTAMINATION_EFFECTS.map((e) => [e.id, e]),
)

/** Effects unlocked by completing a given machine (plus drift at threshold). */
export function effectsForSource(machineId: string): ContaminationEffectDef[] {
  return CONTAMINATION_EFFECTS.filter((e) => e.sourceMachineId === machineId)
}
