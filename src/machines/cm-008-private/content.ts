import type { TextualApparatus } from '@/archive/content'

/** Sections 03–08 authored against the implemented mechanic. */
export const apparatus: Partial<TextualApparatus> = {
  whatTheMachineDid:
    'The user fixes a sign (△Q7) to an inner sensation by ostension — hold and concentrate. The diary then recurs, and each “same sensation” judgement is challenged for its criterion: seeming-right is rejected, memory is rejected, and only a check that could in principle be performed by another is admitted. The admitted criterion is immediately public practice, and simulated participant M. begins using the sign, with correctness judged against the shared rule rather than the original sensation.',
  whatTheMachineDistorted:
    'It makes the private-language considerations into a progression of exercises with right answers, whereas the Investigations’ argument is therapeutic: the temptation itself is undone, not refuted with a counterexample. The machine also supplies a tidy endpoint — “the sign has become a word” — where the text leaves an open workshop.',
  whyDistortionMatters:
    'The risk is converting §243ff into the slogan “language is social,” as if the argument were a sociological observation. The machine’s criterion challenge is designed against exactly that: what collapses is not privacy as a fact but private correctness as a distinction — whatever seems right would be right, and so nothing is. If the user leaves with a slogan, the apparatus has reproduced the disease it was built to treat.',
  competingReading:
    'A deflationary reading holds the diary episode shows only fallibility of memory, not the impossibility of a private language: one could privately check against a stored record. The apparatus stages this option as the “I remember the first one” answer and lets it fail — but a careful reader of the text may side with the memory-model reading, and the apparatus does not adjudicate.',
  implementationNotes:
    'Episodes are authored with a hidden ground truth (sameAsFirst) that the machine never reveals; judgements are recorded without grading. The [REFUSE PUBLIC CRITERIA] path is functional and twice-filing it is recorded as an unauthorized procedure. No network, no participants: M. is a script.',
}
