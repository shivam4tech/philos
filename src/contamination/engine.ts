import { getRecord } from '@/state/record'
import type { ResearchRecord } from '@/state/persistence'
import type { Route } from '@/router/router'

import { CONTAMINATION_BY_ID, type ContaminationEffectDef, type RouteScope } from './definitions'

/**
 * Contamination engine — pure eligibility logic (unit-tested) plus a thin
 * runtime that fires effect instances into the lab store.
 */

export interface TriggerContext {
  route: Route['name']
  now: number
  record: ResearchRecord
}

export function routeInScope(scope: RouteScope, route: Route['name']): boolean {
  return scope === 'any' || scope === route
}

export function isEligible(def: ContaminationEffectDef, ctx: TriggerContext): boolean {
  if (!def.applicableRoutes.some((scope) => routeInScope(scope, ctx.route))) return false
  if (!ctx.record.contamination.unlocked.includes(def.id)) return false
  const cooldownUntil = ctx.record.contamination.cooldownUntil[def.id] ?? 0
  if (ctx.now < cooldownUntil) return false
  const completions = Object.values(ctx.record.machines).reduce((n, m) => n + m.completions, 0)
  if (completions < def.minCompletions) return false
  return true
}

export function selectEffect(
  candidates: ContaminationEffectDef[],
  ctx: TriggerContext,
  rng: () => number = Math.random,
): ContaminationEffectDef | null {
  const eligible = candidates.filter((def) => isEligible(def, ctx))
  if (eligible.length === 0) return null
  // severity 3 events are rarer: weight by inverse severity
  const weights = eligible.map((def) => 1 / def.severity)
  const total = weights.reduce((a, b) => a + b, 0)
  let roll = rng() * total
  for (let i = 0; i < eligible.length; i++) {
    roll -= weights[i]
    if (roll <= 0) return eligible[i]
  }
  return eligible[eligible.length - 1]
}

/* ------------------------------------------------------------------ */
/* Runtime                                                             */
/* ------------------------------------------------------------------ */

import { addActiveEffect, pushTicker } from '@/state/lab'
import { markEffectWitnessed, setEffectCooldown } from '@/state/record'
import { playContaminationSting } from '@/audio/engine'

/**
 * Attempts to fire one contamination effect. Returns the fired effect id or
 * null. Called on route changes, machine exits, idle ticks, and completions.
 */
export function attemptContamination(
  route: Route['name'],
  rng: () => number = Math.random,
): string | null {
  const record = getRecord()
  const now = Date.now()
  const ctx: TriggerContext = { route, now, record }
  const candidates = [...CONTAMINATION_BY_ID.values()].filter(
    (def) => def.sourceMachineId !== 'lab' || record.contamination.unlocked.includes(def.id),
  )
  const chosen = selectEffect(candidates, ctx, rng)
  if (!chosen) return null
  if (rng() > chosen.probability) return null

  fire(chosen, route)
  return chosen.id
}

export function fire(def: ContaminationEffectDef, route: Route['name']): void {
  const now = Date.now()
  addActiveEffect({
    effectId: def.id,
    designation: def.designation,
    firedAt: now,
    expiresAt: now + effectDurationMs(def),
    payload: { route },
  })
  markEffectWitnessed(def.id)
  setEffectCooldown(def.id, now + def.cooldownMs)
  playContaminationSting(def.severity)
  pushTicker(`CONTAMINATION EVENT — ${def.designation}`, 'contamination')
}

export function effectDurationMs(def: ContaminationEffectDef): number {
  switch (def.severity) {
    case 3:
      return 45_000
    case 2:
      return 30_000
    default:
      return 20_000
  }
}
