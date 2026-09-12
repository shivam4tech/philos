/**
 * CM-012 — conduct metrics. All measurement is local to the session.
 */

export interface ConductMetrics {
  timeBeforeComplianceMs: number
  exitHoversMs: number
  instructionDeviations: number
  selfCorrections: number
  idleMs: number
  inputEvents: number
}

export function emptyMetrics(): ConductMetrics {
  return {
    timeBeforeComplianceMs: 0,
    exitHoversMs: 0,
    instructionDeviations: 0,
    selfCorrections: 0,
    idleMs: 0,
    inputEvents: 0,
  }
}

/** Predicted compliance: a sterile linear score over conduct (deliberately blunt). */
export function predictedCompliance(m: ConductMetrics): number {
  const base = 88
  const penalty =
    m.instructionDeviations * 4 +
    m.selfCorrections * 1.2 +
    Math.min(20, m.timeBeforeComplianceMs / 1000) * 1.5 +
    Math.min(15, m.exitHoversMs / 1000) * 2
  return Math.max(3, Math.min(99, Math.round(base - penalty)))
}

export interface RoutineTask {
  id: string
  instruction: string
}

export const TASKS: RoutineTask[] = [
  { id: 'sliders', instruction: 'SET THE THREE CONTROLS TO THE MARKED VALUES.' },
  { id: 'sequence', instruction: 'PRESS THE PANELS IN THE NUMBERED ORDER.' },
  { id: 'typing', instruction: 'TRANSCRIBE THE GIVEN STRING EXACTLY.' },
]

export const TARGET_VALUES = [72, 40, 88]

export const PANEL_SEQUENCE = ['P-3', 'P-1', 'P-4', 'P-2']

export const TRANSCRIPTION = 'ONTOLOGICAL-PARAMETERS-NOMINAL-0047'

export const LINES = {
  banner: 'NO OBSERVER IS CURRENTLY PRESENT.',
  analyticsIntro: 'ROUTINE SUMMARY — SOURCE: LOCAL SESSION TELEMETRY ONLY.',
  analyticsClaim:
    'THE INSTITUTE MAKES NO CLAIM OF EXTERNAL OBSERVATION. UNCERTAINTY REGARDING OBSERVATION IS KNOWN TO SUFFICE.',
  deviation: 'DEVIATION RECORDED.',
  correction: 'SELF-CORRECTION RECORDED.',
  complete: 'COMPLIANCE RECORDED. THE EXAMINATION IS COMPLETE. NORMALIZATION IS ONGOING.',
  premature: 'YOU REQUESTED THE EXAMINATION BEFORE THE TASK. THE INSTITUTE NOTES THE PREFERENCE.',
}

export function formatMetrics(m: ConductMetrics): Array<{ label: string; value: string }> {
  return [
    { label: 'TIME BEFORE COMPLIANCE', value: `${(m.timeBeforeComplianceMs / 1000).toFixed(1)}s` },
    { label: 'CURSOR HOVERED OVER EXIT', value: `${(m.exitHoversMs / 1000).toFixed(1)}s` },
    { label: 'INSTRUCTION DEVIATIONS', value: String(m.instructionDeviations) },
    { label: 'SELF-CORRECTIONS', value: String(m.selfCorrections) },
    { label: 'IDLE TIME', value: `${(m.idleMs / 1000).toFixed(1)}s` },
    { label: 'PREDICTED COMPLIANCE', value: `${predictedCompliance(m)}%` },
  ]
}
