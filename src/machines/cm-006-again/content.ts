import type { TextualApparatus } from '@/archive/content'

/** Sections 03–08 authored against the implemented mechanic. */
export const apparatus: Partial<TextualApparatus> = {
  whatTheMachineDid:
    'The apparatus records a sequence of mundane choices — rising, replying, eating, walking, speaking, lying, risking, looking, leaving — and then poses §341’s question with the user’s own logged sequence: would you will it again, without alteration? [AGAIN] replays the record exactly, no inputs accepted, at accelerating tempo, with annotations drawing attention to details the first pass smoothed over. [REFUSE] is accepted and immediately filed as an event that has already occurred.',
  whatTheMachineDistorted:
    'It compresses a life into twelve moments and recurrence into one visible replay — the demon’s innumerable times become a second pass and a third. The machine also lets the user see the sequence as a list before choosing, which §341’s scenario pointedly does not: the demon asks before you review the file.',
  whyDistortionMatters:
    'The compression is what makes the test decidable in five minutes, but it moves the burden from imagination to memory: affirming a list is easier than affirming a life. The apparatus marks the gap honestly — the verdict screen says “IT HAS RETURNED” about the recording, and leaves unsaid what would have to return for the doctrine to be true.',
  competingReading:
    'The cosmological reading (recurrence as a doctrine about force and time, argued from the Nachlass) treats the replay as an illustration of a physical thesis, not a practical test; on that view the annotations are irrelevant and the refusal button is a category error. A third reading — selective — would have the apparatus change the sequence before the next recurrence. All three are implemented as modes; none is endorsed.',
  implementationNotes:
    'The record is exact: choice ids, not outcomes, are stored, and outcomes are deterministic functions of ids — the replay cannot deviate. Replay annotations are deterministic per replay count. The nested [AGAIN] during replay is recorded as an unauthorized procedure; it does not spawn a nested replay.',
}
