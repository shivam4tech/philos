import type { TextualApparatus } from '@/archive/content'

/** Sections 03–08 authored against the implemented mechanic. */
export const apparatus: Partial<TextualApparatus> = {
  whatTheMachineDid:
    'The apparatus opens with the most transparent interface in the facility: six crates, three shelves, a handler that behaves. As crates are placed, breakdowns arrive in the order Heidegger describes — catching (drag resistance), obtrusiveness (cursor drift, exposed component names), obstinacy (a control that stops responding and then announces its identity). The task remains completable throughout. The session closes by declaring the equipment an object.',
  whatTheMachineDistorted:
    'It equates the ready-to-hand with a smooth UI and the present-at-hand with a labeled one, which flattens Heidegger’s point: the distinction is between ways of encountering beings, not between two visual states of a widget. A debug overlay is not Vorhandenheit; it is a theater of it.',
  whyDistortionMatters:
    'The flattening is what makes the machine playable — and it risks teaching exactly the “useful vs. broken” misreading the textual apparatus is here to block. The deliberate counterweight: the task never becomes impossible. Breakdown in §§15–16 is not paralysis; the world keeps working while becoming conspicuous, and so does this one.',
  competingReading:
    'A design-theoretic reading treats the whole thing as a Norman-style walkthrough of error states: breakdown reveals affordances, full stop. The apparatus does not dispute the overlap; it notes that the design reading explains why breakdown teaches, while Heidegger’s explains why breakdown discloses a world — the references behind the crates (manifests, shelves, the practice of sorting) become visible together.',
  implementationNotes:
    'Breakdown levels are keyed to crates placed, with a floor of one interaction before the first catch. The unresponsive control is genuinely unresponsive to pointer input, three times, then records the procedure. Keyboard operators complete the same task through controls that are exempt from breakdown — accessibility never participates in the experiment.',
}
