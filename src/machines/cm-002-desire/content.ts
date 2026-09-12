import type { TextualApparatus } from '@/archive/content'

/** Sections 03–08 authored against the implemented mechanic. */
export const apparatus: Partial<TextualApparatus> = {
  whatTheMachineDid:
    'The terminal runs three verification exercises whose interfaces sabot themselves: grid selections drift off their marks as the cursor approaches, the second exercise answers every hypothesis about the Other with a further displacement, and the missing object turns out to occupy every position it was absent from. The terminal then produces a triage of the session’s events into need, demand, and desire — categories of the session’s conduct, not of the subject — and closes with an incomplete verification.',
  whatTheMachineDistorted:
    'It stage-manages objet petit a as a jumping tile, which literalizes a structural concept into a game mechanic; in Lacan’s account the cause of desire is not a hidden object that evades capture but the constitutive inadequation of the subject to any object. The triage table also risks reading like a diagnostic instrument, which Lacan’s clinic explicitly is not.',
  whyDistortionMatters:
    'The displacements are the honest part of the machine; the scoring is the dishonest part. If the apparatus were allowed to report a result (“your desire is 40% your own”), it would become exactly the personality test the Institute forbids. The deliberately anticlimactic verdict — verification incomplete, desire operational — is the load-bearing design decision: failure here is the successful outcome.',
  competingReading:
    'A sceptical reading holds that the machine demonstrates only poor usability: shifting targets and vanishing marks are frustrations, and calling them objet a is decoration. Against this, the apparatus notes that the CAPTCHA form itself already stages the Other’s demand — prove your humanity to an automated judge — so the frustration has a referent beyond the frustration.',
  implementationNotes:
    'Displacement is deterministic per interaction (seeded by selection count), so the exercise replays identically. Session counters feed the triage table locally; nothing is transmitted. The INSTITUTE VERIFICATION AUTHORITY seal is clickable three times before it responds — this is recorded as an unauthorized procedure, not a easter egg.',
}
