import { MACHINE_BY_ID } from '@/machines/registry'

/**
 * The Composition Chamber — hand-authored cross-contaminations. Nothing is
 * generated: each hybrid is an authored confrontation between two systems,
 * implemented as altered mechanics inside the base apparatus.
 */

export interface HybridDef {
  id: string
  baseId: string
  contaminantId: string
  title: string
  /** what changes mechanically */
  mechanism: string
  completionEvent: string
  /** shown in the post-run apparatus; confrontations, not reconciliations */
  note: string
}

export const HYBRIDS: HybridDef[] = [
  {
    id: 'schopenhauer-lacan',
    baseId: 'cm-001-will',
    contaminantId: 'cm-002-desire',
    title: 'WILL ENGINE / DESIRE CONTAMINATION',
    mechanism:
      'Needs now arrive as NEED, DEMAND, or DESIRE. Satisfying NEED works and decays as always. Satisfying DEMAND raises the demand it satisfied. DESIRE is received, never obtained: the variable does not decrease.',
    completionEvent: 'will:contaminated-session',
    note:
      'THE HYBRID IS AN EXPERIMENTAL CONFRONTATION. Schopenhauer’s will and Lacan’s desire agree that satisfaction does not terminate wanting; they disagree about why — lack of being versus constitutive displacement. The apparatus runs both explanations on the same meter and refuses to choose.',
  },
  {
    id: 'hegel-marx',
    baseId: 'cm-003-vending',
    contaminantId: 'marx',
    title: 'DIALECTICAL VENDING UNIT / COMMODITY CONTAMINATION',
    mechanism:
      'The machine now demands the wage relation before dispensing: the price decomposes into labor, materials, machinery, rent, and profit, and the user allocates the remainder. The drink dispenses after three allocations. The commodity form persists.',
    completionEvent: 'vending:contaminated-session',
    note:
      'THE HYBRID IS AN EXPERIMENTAL CONFRONTATION. Hegel: the mediation is logical and consummated in recognition. Marx: the mediation is social and consummated in exploitation. The machine lets the user allocate value; it does not let them abolish the form that required allocation.',
  },
  {
    id: 'nietzsche-deleuze',
    baseId: 'cm-006-again',
    contaminantId: 'cm-009-difference',
    title: 'AGAIN / DIFFERENCE CONTAMINATION',
    mechanism:
      'The recorded sequence returns with authored micro-divergences each pass. The console tracks identity, similarity, difference, and accumulation. The question changes: WHAT EXACTLY HAS RETURNED?',
    completionEvent: 'again:contaminated-session',
    note:
      'THE HYBRID IS AN EXPERIMENTAL CONFRONTATION. For Nietzsche the circle returns the same; for Deleuze repetition produces difference as its principle. The apparatus replays a record that drifts, and files the tension unresolved.',
  },
  {
    id: 'heidegger-marx',
    baseId: 'cm-004-broken-tool',
    contaminantId: 'marx',
    title: 'BROKEN TOOL / COMMODITY CONTAMINATION',
    mechanism:
      'At breakdown, the provenance ledger opens mechanically: each crate must be stamped COMMODITY before shelving, and stamping exposes maker, relation, owner, and what was abstracted. The task cannot complete unstamped.',
    completionEvent: 'tool:contaminated-session',
    note:
      'THE HYBRID IS AN EXPERIMENTAL CONFRONTATION. Heidegger: the tool withdraws in use and appears in breakdown. Marx: the commodity appears transparently in use and its production relations are what withdraw. Breakdown and abstraction are two theories of the same invisibility; the stamp is where they collide.',
  },
  {
    id: 'wittgenstein-derrida',
    baseId: 'cm-008-private',
    contaminantId: 'cm-011-terms',
    title: 'PRIVATE ROOM / TRACE CONTAMINATION',
    mechanism:
      'Each stabilizing rule now spawns the contextual distinctions it depends on — thresholds, borders, cases — indefinitely. Practice stabilizes only by acknowledging the chain. The rule is a chain of further rules.',
    completionEvent: 'private:contaminated-session',
    note:
      'THE HYBRID IS AN EXPERIMENTAL CONFRONTATION. Wittgenstein: criteria are public and settle. Derrida: context is in principle non-closable. The machine makes every settlement open one further distinction — this is not a reconciliation, and neither thinker survives it unchanged.',
  },
  {
    id: 'leibniz-foucault',
    baseId: 'cm-007-windows',
    contaminantId: 'cm-012-observation',
    title: 'NO WINDOWS / OBSERVATION CONTAMINATION',
    mechanism:
      'The institute now predicts every monad state perfectly from correspondence alone, in an always-open analytics panel. Access requests are evaluated and returned: PREDICTED 100% — GRANTED 0%. The visitor is asked to take a stance; none is ratified.',
    completionEvent: 'windows:contaminated-session',
    note:
      'THE HYBRID IS AN EXPERIMENTAL CONFRONTATION. Leibniz: perfect expression without transmission. Foucault: knowledge from visible correspondence, power from recording it. If prediction is total, the question — IS PERFECT PREDICTABILITY EQUIVALENT TO ACCESS? — is not rhetorical. The apparatus does not answer it.',
  },
]

export function hybridFor(baseId: string, contaminantId: string): HybridDef | undefined {
  return HYBRIDS.find((h) => h.baseId === baseId && h.contaminantId === contaminantId)
}

export function chamberAvailable(totalCompletions: number): boolean {
  return totalCompletions >= 2
}

/** Bases the user may contaminate: each needs its base machine completed. */
export function availableBases(completedMachineIds: Set<string>): Array<{ baseId: string; contaminantId: string; title: string }> {
  return HYBRIDS.filter((h) => {
    const base = MACHINE_BY_ID.get(h.baseId)
    const contaminant = h.contaminantId === 'marx' ? true : MACHINE_BY_ID.has(h.contaminantId)
    return base && contaminant && completedMachineIds.has(h.baseId)
  }).map((h) => ({
    baseId: h.baseId,
    contaminantId: h.contaminantId,
    title: h.title,
  }))
}
