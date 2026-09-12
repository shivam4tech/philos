import type { TextualApparatus } from '@/archive/content'

/** Sections 03–08 authored against the implemented mechanic. */
export const apparatus: Partial<TextualApparatus> = {
  whatTheMachineDid:
    'The apparatus presents satisfaction as a resource that decays: each [SATISFY] raises relief briefly, and the meter falls regardless of how much was given. Needs escalate from bodily (hunger, thirst) through social (recognition, attention) to abstract (meaning, closure, transcendence), and the interface itself proliferates — more meters, more panels, a want generator accelerating at the top end. The [END SESSION] control, pressed, reports the detection of a new desire: the desire to stop desiring. The only exit that actually ends the loop is sustained non-engagement.',
  whatTheMachineDistorted:
    'It renders the will as a scalar meter and satisfaction as a refill event, which is a caricature of Schopenhauer’s account: for him willing is the subject’s essence, not a variable attached to it. The machine also implies the escape from striving is available as a technique (wait long enough) rather than, on Schopenhauer’s own terms, as the rare metaphysical event he calls the denial of the will — approached through aesthetic contemplation or asceticism, not through idleness.',
  whyDistortionMatters:
    'The caricature is useful and dangerous in equal measure: it makes the pendulum structure legible in two minutes, but it invites the reading that the apparatus is a psychological tip (“ignore your wants”) rather than a metaphysical diagnosis. §341 of this machine’s counterpart is the claim that no arrangement of satisfactions terminates willing; the meter cannot show that, because a meter is precisely a thing that can be filled.',
  competingReading:
    'A pessimistic-behavioral reading would treat the machine as evidence about dopamine and habituation rather than metaphysics — the loop as a property of reward systems, not of being. On that reading the stillness ending is merely extinction training. The textual apparatus takes no side; it notes only that the two readings make the same meter mean different things.',
  implementationNotes:
    'Need escalation, relief decay, and the stage thresholds are pure functions in machine.ts (unit-tested). The stillness detector measures input latency, not patience as such: any satisfy click resets it. The “desire to stop desiring” event fires once; the END SESSION control thereafter remains operational and dishonest.',
}
