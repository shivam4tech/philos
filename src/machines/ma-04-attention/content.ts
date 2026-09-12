import type { TextualApparatus } from '@/archive/content'

/** Sections 03–08 authored against the implemented mechanic. */
export const apparatus: Partial<TextualApparatus> = {
  whatTheMachineDid:
    'A slowly turning object under a timer that only advances while the visitor does nothing: no pointer, no wheel, no keys. Revelations appear one at a time, each addressed to the act of attending rather than describing the object. Manipulation is detected and penalized by delay, not punishment; six revelations, earned across roughly a minute of stillness, complete the apparatus.',
  whatTheMachineDistorted:
    'It gamifies attention — a progress counter sits in the header — which Weil’s account explicitly forbids: attention as she describes it is not accumulated but deepened, and is oriented toward prayer or the suffering of another, not toward an SVG. The machine also rewards stillness on a timer, whereas the discipline is precisely not to watch the clock.',
  whyDistortionMatters:
    'Inverting the reward structure of every other apparatus is the point — the visitor’s hands, trained by twelve machines to grasp, are suddenly the obstacle. The distortion (gamified stillness) is the price of making that inversion legible in sixty seconds; the apparatus names its own counter as “a weakness” in the fifth revelation, which is the closest it comes to honesty.',
  competingReading:
    'A skeptical reading sees an idle-timer gimmick: the machine rewards absence of input because input detection is trivial, not because attention is metaphysically privileged. The apparatus accepts the description and notes that Weil’s claim is stronger and stranger than anything a browser can verify.',
  implementationNotes:
    'Revelation timing pauses while a manipulation penalty is active and requires a few seconds of non-interaction to resume; reduced-motion disables the rotation, and the apparatus remains completable entirely without motion. There is no way to accelerate it — the absence of that button is the design.',
}
