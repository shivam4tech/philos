import type { TextualApparatus } from '@/archive/content'

/** Sections 03–08 authored against the implemented mechanic. */
export const apparatus: Partial<TextualApparatus> = {
  whatTheMachineDid:
    'The screen instructs the subject to reach an exit. Arrow keys scroll the world — posts, floor, and eventually the door itself — while the avatar remains at center, its coordinate readout invariant at 0.00 / 0.00 no matter how it is consulted. A Zeno unit announces the halfway point of a distance whose remaining half then doubles. After enough traversal of nothing, the door retreats and the apparatus files the result: the subject did not move; the world did.',
  whatTheMachineDistorted:
    'It stages the prohibition of motion as a cheap parlor trick — the coordinate readout is a GUI element, not an argument. Parmenides’ case rests on what can coherently be said of what-is; a display refusing to update proves only that the programmer willed it so, which the machine’s own sly footnote admits.',
  whyDistortionMatters:
    'The trick works precisely because it separates appearance from report: every visual cue says motion, every number says stillness. That gap is a miniature of the Doxa/Alētheia split the poem draws — mortal opinions against the way of truth — even though the machine plays it for a laugh. The joke is the honest part; the metaphysics would require the world, not the window, to be unable to move.',
  competingReading:
    'A Zeno-defense reading treats the apparatus as a reductio of the motion-denial: if nothing can move, exit is impossible — absurd, therefore something moves. The apparatus leaves this available on purpose; the participant who walks away has, in the classical sense, refuted nobody.',
  implementationNotes:
    'The avatar is positioned absolutely at viewport center and never translated; the world layer carries all transforms, so the invariant readout is a structural fact of the implementation, not a displayed lie. Door retreat is scheduled by step count. The coordinate readout is consultable; the third consultation is recorded as a rite (UR-014).',
}
