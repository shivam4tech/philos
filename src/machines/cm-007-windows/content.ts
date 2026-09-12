import type { TextualApparatus } from '@/archive/content'

/** Sections 03–08 authored against the implemented mechanic. */
export const apparatus: Partial<TextualApparatus> = {
  whatTheMachineDid:
    'Three monads display internal states on a shared clock; each state is a function of that monad’s own period and phase, never of the others. Perturbing one monad produces no transmission — the counter stays at zero — yet the others enter the corresponding states exactly on schedule, because the schedule was pre-established. A social feed simulates conversation over the void, and a direct-channel input refuses transmission with the machine’s honest diagnosis: no windows.',
  whatTheMachineDistorted:
    'It renders pre-established harmony as synchronized display updates, which makes the doctrine look like a scheduler quirk. Leibniz’s claim is metaphysical — every state of every simple substance unfolds from its own concept in perfect agreement with the whole — not a timing artifact; the machine also omits entirely why God’s choice of the best harmonized system was supposed to matter.',
  whyDistortionMatters:
    'The synchronization framing invites the cheap objection (“just decouple the clocks”) without engaging the actual claim: that apparent interaction never required transmission in the first place. The apparatus keeps the counter at zero precisely so the user’s intervention is experienced as local, while the world-wide agreement continues untouched — which is the doctrine, staged rather than stated.',
  competingReading:
    'A computational reading treats the room as three state machines sharing a tick — no metaphysics, just co-scheduling. That is accurate about the implementation and silent about the referent: the tick is the part the machine cannot show, which is why the declaration button asks the user to assert the harmony rather than observe it into being.',
  implementationNotes:
    'States are pure functions of tick count (unit-tested), with the correspondence table authored. Perturbations affect only the perturbed monad’s display; “responses” are the others’ scheduled next states. The direct-channel input counts attempts; the third is recorded as an unauthorized procedure.',
}
