import type { TextualApparatus } from '@/archive/content'

/** Sections 03–08 authored against the implemented mechanic. */
export const apparatus: Partial<TextualApparatus> = {
  whatTheMachineDid:
    'One button, named REPEAT, each press of which returns a modified specimen: the first twenty differences are barely perceptible, then they accumulate — sides drift, hue wanders, irregularity compounds — until lineages can be named, retrospective resemblances appear between specimens whose divergence showed nothing, and identity across the lineage survives only as a statistical residue. The genealogy is navigable: any previous specimen can be selected and repeated from, forking the line. There is no randomizer; every specimen is a pure function of its lineage.',
  whatTheMachineDistorted:
    'It visualizes repetition as a tree of discrete specimens, which makes difference look like an accumulate-and-display process; Deleuze’s claim is that repetition-for-itself is positive and productive in the event, not a databank of variants. The machine also lets the user stand outside the repetition and name lineages — a God’s-eye view the philosophy explicitly refuses.',
  whyDistortionMatters:
    'The tree is a compromise with legibility: real repetition-for-itself would not leave an inspectable archive. What the machine preserves — and why the compromise is worth it — is the inversion of priority: identity is computed after the fact, from variance, and displayed as “provisional,” while repetition itself remains the only operation the apparatus offers.',
  competingReading:
    'A nominalist reading sees only a mutation chain with cosmetic framing: step a generator, get variety, nothing deeper. The apparatus’s answer is in the button labels: the user is never offered a “new object” operation, only REPEAT — the ontology of the interface asserts what the philosophy asserts, and the user who wants reproduction must discover it is not among the options.',
  implementationNotes:
    'The transform is deterministic (hash-seeded) — no randomizer anywhere; the same lineage always produces the same children. Identity is computed as normalized dispersion over the last seven generations. Repeating from the same source three times is recorded as an unauthorized procedure: reproduction was never among the available actions.',
}
