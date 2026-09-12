import { INSTITUTION_MESSAGES, type InstitutionEvent } from './messages'

/**
 * Institution response engine — finite authored pools, real event triggers,
 * per-category cooldowns. Emits a message or null while cooling down.
 */

const DEFAULT_COOLDOWN_MS = 2 * 60_000

/** Special-case cooldowns (ms); unlisted categories use the default. */
const COOLDOWNS: Partial<Record<InstitutionEvent, number>> = {
  startup: 0,
  'audio-muted': 10 * 60_000,
  'reduced-motion': 10 * 60_000,
  secret: 30_000,
  idle: 5 * 60_000,
}

export class InstitutionEngine {
  private lastEmitted = new Map<InstitutionEvent, number>()
  private poolCursor = new Map<InstitutionEvent, number>()

  emit(event: InstitutionEvent, now = Date.now()): string | null {
    const pool = INSTITUTION_MESSAGES[event]
    if (!pool || pool.length === 0) return null
    const cooldown = COOLDOWNS[event] ?? DEFAULT_COOLDOWN_MS
    const last = this.lastEmitted.get(event)
    if (last !== undefined && now - last < cooldown) return null
    this.lastEmitted.set(event, now)

    const cursor = this.poolCursor.get(event) ?? Math.floor(Math.random() * pool.length)
    const message = pool[cursor % pool.length]
    this.poolCursor.set(event, (cursor + 1) % pool.length)
    return message
  }

  cooldownRemaining(event: InstitutionEvent, now = Date.now()): number {
    const last = this.lastEmitted.get(event)
    if (last === undefined) return 0
    const cooldown = COOLDOWNS[event] ?? DEFAULT_COOLDOWN_MS
    return Math.max(0, cooldown - (now - last))
  }
}

export const institution = new InstitutionEngine()
