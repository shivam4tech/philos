/**
 * Persistence model — versioned, migrated, never bricking.
 *
 * Storage keys:
 *   cml.research-record   the research record (progress, counters, contamination)
 *   cml.settings          audio + accessibility preferences
 *   cml.corrupt-backup    last unreadable payload, for forensics
 */

export const SCHEMA_VERSION = 2

const RECORD_KEY = 'cml.research-record'
const SETTINGS_KEY = 'cml.settings'
const CORRUPT_BACKUP_KEY = 'cml.corrupt-backup'

export type Designation = 'UNREGISTERED' | 'OBSERVED' | 'APPARATUS'

export interface MachineRecord {
  enteredCount: number
  completions: number
  modesCompleted: string[]
  secretsFound: string[]
  totalInteractionMs: number
  lastEnteredAt: number | null
}

export interface ResearchCounters {
  sessions: number
  contradictionsProduced: number
  failedVerifications: number
  recurrencesAccepted: number
  recurrencesRefused: number
  resets: number
  semanticLoops: number
  unauthorizedProcedures: number
  satisfactions: number
  expenditures: number
  idleEvents: number
  chamberRuns: number
}

export interface SecretRecord {
  id: string
  code: string
  classification: string
  discoveredAt: number
}

export interface ContaminationState {
  unlocked: string[]
  witnessed: string[]
  cooldownUntil: Record<string, number>
  lastEffectAt: number | null
}

export interface ResearchRecord {
  schemaVersion: number
  createdAt: number
  updatedAt: number
  entered: boolean
  designation: Designation
  /** set when the visitor has passed through the Observation Deck */
  observingAcknowledged: boolean
  machines: Record<string, MachineRecord>
  counters: ResearchCounters
  contamination: ContaminationState
  secrets: SecretRecord[]
}

export function emptyRecord(now = Date.now()): ResearchRecord {
  return {
    schemaVersion: SCHEMA_VERSION,
    createdAt: now,
    updatedAt: now,
    entered: false,
    designation: 'UNREGISTERED',
    observingAcknowledged: false,
    machines: {},
    counters: {
      sessions: 0,
      contradictionsProduced: 0,
      failedVerifications: 0,
      recurrencesAccepted: 0,
      recurrencesRefused: 0,
      resets: 0,
      semanticLoops: 0,
      unauthorizedProcedures: 0,
      satisfactions: 0,
      expenditures: 0,
      idleEvents: 0,
      chamberRuns: 0,
    },
    contamination: {
      unlocked: [],
      witnessed: [],
      cooldownUntil: {},
      lastEffectAt: null,
    },
    secrets: [],
  }
}

export function emptyMachineRecord(): MachineRecord {
  return {
    enteredCount: 0,
    completions: 0,
    modesCompleted: [],
    secretsFound: [],
    totalInteractionMs: 0,
    lastEnteredAt: null,
  }
}

/** Endgame designation thresholds (tuned in Sprint 4). */
export function designationFor(totalCompletions: number): Designation {
  if (totalCompletions >= 9) return 'APPARATUS'
  if (totalCompletions >= 3) return 'OBSERVED'
  return 'UNREGISTERED'
}

export function totalCompletions(record: ResearchRecord): number {
  return Object.values(record.machines).reduce((n, m) => n + m.completions, 0)
}

/* ------------------------------------------------------------------ */
/* Migration chain                                                     */
/* ------------------------------------------------------------------ */

export type RawPayload = Record<string, unknown>

/**
 * Registered migrations: schemaVersion N → N+1. Extend as the schema evolves;
 * `migrate` walks the chain so old saves never brick the app.
 */
export const MIGRATIONS: ReadonlyMap<number, (raw: RawPayload) => RawPayload> = new Map([
  [
    1,
    (raw) => ({
      ...raw,
      schemaVersion: 2,
      observingAcknowledged: typeof raw['observingAcknowledged'] === 'boolean' ? raw['observingAcknowledged'] : false,
    }),
  ],
])

export function migrate(raw: RawPayload): RawPayload {
  let current = raw
  let version = typeof current['schemaVersion'] === 'number' ? current['schemaVersion'] : 0
  let guard = 0
  while (version < SCHEMA_VERSION && guard < 32) {
    const step = MIGRATIONS.get(version)
    if (!step) break
    current = step(current)
    version = typeof current['schemaVersion'] === 'number' ? current['schemaVersion'] : version + 1
    guard += 1
  }
  return current
}

function looksLikeRecord(raw: unknown): raw is RawPayload {
  return (
    typeof raw === 'object' &&
    raw !== null &&
    typeof (raw as RawPayload)['schemaVersion'] === 'number' &&
    typeof (raw as RawPayload)['machines'] === 'object'
  )
}

function num(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function bool(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback
}

function str(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback
}

function strArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []
}

/**
 * Tolerant repair: merge a (possibly stale or hand-edited) payload over a
 * fresh record. Unreadable payloads never get here — see `loadRecord`.
 */
export function repairRecord(raw: RawPayload, now = Date.now()): ResearchRecord {
  const fresh = emptyRecord(now)
  const machinesRaw = (raw['machines'] ?? {}) as RawPayload
  const countersRaw = (raw['counters'] ?? {}) as RawPayload
  const contaminationRaw = (raw['contamination'] ?? {}) as RawPayload
  const secretsRaw = raw['secrets']

  const machines: Record<string, MachineRecord> = {}
  for (const [id, value] of Object.entries(machinesRaw)) {
    if (typeof value !== 'object' || value === null) continue
    const m = value as RawPayload
    machines[id] = {
      enteredCount: Math.max(0, Math.floor(num(m['enteredCount'], 0))),
      completions: Math.max(0, Math.floor(num(m['completions'], 0))),
      modesCompleted: strArray(m['modesCompleted']),
      secretsFound: strArray(m['secretsFound']),
      totalInteractionMs: Math.max(0, num(m['totalInteractionMs'], 0)),
      lastEnteredAt: num(m['lastEnteredAt'], 0) || null,
    }
  }

  const counters: ResearchCounters = { ...fresh.counters }
  for (const key of Object.keys(fresh.counters) as (keyof ResearchCounters)[]) {
    counters[key] = Math.max(0, Math.floor(num(countersRaw[key], fresh.counters[key])))
  }

  const secrets: SecretRecord[] = Array.isArray(secretsRaw)
    ? secretsRaw
        .filter((s): s is RawPayload => typeof s === 'object' && s !== null)
        .map((s) => ({
          id: str(s['id'], 'unknown'),
          code: str(s['code'], 'UR-???'),
          classification: str(s['classification'], 'UNCLASSIFIED'),
          discoveredAt: num(s['discoveredAt'], now),
        }))
    : []

  const designation = str(raw['designation'], 'UNREGISTERED')
  return {
    schemaVersion: SCHEMA_VERSION,
    createdAt: num(raw['createdAt'], now),
    updatedAt: num(raw['updatedAt'], now),
    entered: bool(raw['entered'], false),
    designation:
      designation === 'OBSERVED' || designation === 'APPARATUS' ? designation : 'UNREGISTERED',
    observingAcknowledged: bool(raw['observingAcknowledged'], false),
    machines,
    counters,
    contamination: {
      unlocked: strArray(contaminationRaw['unlocked']),
      witnessed: strArray(contaminationRaw['witnessed']),
      cooldownUntil: Object.fromEntries(
        Object.entries((contaminationRaw['cooldownUntil'] ?? {}) as RawPayload)
          .filter(([, v]) => typeof v === 'number')
          .map(([k, v]) => [k, v as number]),
      ),
      lastEffectAt: num(contaminationRaw['lastEffectAt'], 0) || null,
    },
    secrets,
  }
}

/* ------------------------------------------------------------------ */
/* Load / save                                                         */
/* ------------------------------------------------------------------ */

export type RecordLoadResult = {
  record: ResearchRecord
  /** 'fresh' = no prior data or unrecoverable payload */
  source: 'fresh' | 'stored'
  corrupted: boolean
}

export function loadRecord(now = Date.now()): RecordLoadResult {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(RECORD_KEY)
  } catch {
    return { record: emptyRecord(now), source: 'fresh', corrupted: false }
  }
  if (!raw) return { record: emptyRecord(now), source: 'fresh', corrupted: false }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    backupCorrupt(raw)
    return { record: emptyRecord(now), source: 'fresh', corrupted: true }
  }
  if (!looksLikeRecord(parsed)) {
    backupCorrupt(raw)
    return { record: emptyRecord(now), source: 'fresh', corrupted: true }
  }
  const migrated = migrate(parsed)
  return { record: repairRecord(migrated, now), source: 'stored', corrupted: false }
}

export function saveRecord(record: ResearchRecord): void {
  try {
    const withStamp: ResearchRecord = { ...record, updatedAt: Date.now() }
    localStorage.setItem(RECORD_KEY, JSON.stringify(withStamp))
  } catch (err) {
    console.warn('[institute] research record could not be written', err)
  }
}

export function resetRecord(now = Date.now()): ResearchRecord {
  const fresh = emptyRecord(now)
  saveRecord(fresh)
  return fresh
}

function backupCorrupt(raw: string): void {
  try {
    localStorage.setItem(CORRUPT_BACKUP_KEY, raw)
  } catch {
    /* backup is best-effort */
  }
}

export function clearCorruptBackup(): void {
  try {
    localStorage.removeItem(CORRUPT_BACKUP_KEY)
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ */
/* Export / import                                                     */
/* ------------------------------------------------------------------ */

export interface RecordEnvelope {
  kind: 'cml-research-record'
  schemaVersion: number
  exportedAt: number
  record: ResearchRecord
}

export function exportRecord(record: ResearchRecord): string {
  const envelope: RecordEnvelope = {
    kind: 'cml-research-record',
    schemaVersion: SCHEMA_VERSION,
    exportedAt: Date.now(),
    record,
  }
  return JSON.stringify(envelope, null, 2)
}

export type ImportResult =
  | { ok: true; record: ResearchRecord }
  | { ok: false; reason: string }

export function importRecord(text: string, now = Date.now()): ImportResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, reason: 'PAYMENT OF ATTENTION REQUIRED: FILE IS NOT VALID JSON.' }
  }
  const envelope = parsed as RawPayload
  const recordCandidate =
    (envelope['kind'] === 'cml-research-record' ? envelope['record'] : envelope) ?? null
  if (!looksLikeRecord(recordCandidate)) {
    return { ok: false, reason: 'FILE DOES NOT CONTAIN A RESEARCH RECORD.' }
  }
  const migrated = migrate(recordCandidate)
  return { ok: true, record: repairRecord(migrated, now) }
}

export function downloadRecordJson(filename: string, text: string): void {
  if (typeof document === 'undefined') return
  const blob = new Blob([text], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

export type ReducedMotionSetting = 'auto' | 'on' | 'off'

export interface Settings {
  master: number
  ambience: number
  interaction: number
  muted: boolean
  reducedMotion: ReducedMotionSetting
  reducedSensory: boolean
}

export const DEFAULT_SETTINGS: Settings = {
  master: 0.8,
  ambience: 0.7,
  interaction: 0.9,
  muted: false,
  reducedMotion: 'auto',
  reducedSensory: false,
}

function clamp01(value: unknown, fallback: number): number {
  const n = num(value, fallback)
  return Math.min(1, Math.max(0, n))
}

export function repairSettings(raw: unknown): Settings {
  if (typeof raw !== 'object' || raw === null) return { ...DEFAULT_SETTINGS }
  const r = raw as RawPayload
  const motion = r['reducedMotion']
  return {
    master: clamp01(r['master'], DEFAULT_SETTINGS.master),
    ambience: clamp01(r['ambience'], DEFAULT_SETTINGS.ambience),
    interaction: clamp01(r['interaction'], DEFAULT_SETTINGS.interaction),
    muted: bool(r['muted'], DEFAULT_SETTINGS.muted),
    reducedMotion: motion === 'on' || motion === 'off' ? motion : 'auto',
    reducedSensory: bool(r['reducedSensory'], DEFAULT_SETTINGS.reducedSensory),
  }
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    return repairSettings(JSON.parse(raw))
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch (err) {
    console.warn('[institute] settings could not be written', err)
  }
}
