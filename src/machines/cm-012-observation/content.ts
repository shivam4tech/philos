import type { TextualApparatus } from '@/archive/content'

/** Sections 03–08 authored against the implemented mechanic. */
export const apparatus: Partial<TextualApparatus> = {
  whatTheMachineDid:
    'The room posts no observer is present and assigns mundane tasks. Midway, a routine summary appears — time before compliance, hovers over the exit button, instruction deviations, self-corrections, predicted compliance — computed entirely from the session’s own input telemetry. The remaining tasks proceed with the summary visible, and the session closes with compliance recorded and normalization declared ongoing. A session-analytics control is available from the first second; opening it before acting is itself measured.',
  whatTheMachineDistorted:
    'It compresses disciplinary power into one visible dossier. Foucault’s panoptism works precisely without such displays — visibility is arranged so its source cannot be confirmed, and normalization operates through examinations that accumulate records across a population, not through one session shown to its subject. The machine also lets you close the dossier.',
  whyDistortionMatters:
    'The simplification risks the reading “being watched is scary,” which is both weaker and stronger than the argument: weaker because no observer is claimed, stronger because fear is not the mechanism — normalizing judgment is. The apparatus displays the disclaimer (local telemetry only; no external observer claimed) and then continues measuring, which is the closest a browser can come to the point that the certainty of the display matters less than the fact of it.',
  competingReading:
    'A benign-UX reading holds the panel as plain formative feedback: dashboards change behavior, nothing ominous. That reading is coherent and the apparatus cannot refute it — the measured conduct does change either way, which is exactly the ambiguity the examination form has always exploited.',
  implementationNotes:
    'All metrics come from local input events: pointer/keyboard timing, slider direction reversals, hover dwell on the frame’s exit control. Predicted compliance is an authored linear function, deliberately blunt. No network calls exist; the “observer” field is permanently empty, and the analytics button opened before any action files UR-013.',
}
