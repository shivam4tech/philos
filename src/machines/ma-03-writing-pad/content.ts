import type { TextualApparatus } from '@/archive/content'

/** Sections 03–08 authored against the implemented mechanic. */
export const apparatus: Partial<TextualApparatus> = {
  whatTheMachineDid:
    'A writing pad with two layers: visible strokes on the celluloid sheet, permanent faint traces on the wax slab beneath. Lifting the sheet (erase) clears the visible surface entirely while the slab retains everything ever written; subsequent strokes are measurably bent and colored by the retained traces — perception writes on a surface that memory has already inscribed. Three erasures with marks on record complete the apparatus.',
  whatTheMachineDistorted:
    'It converts Freud’s model into two literal canvases, which is almost too faithful: the Wonderblock’s magic is the single touch that both receives and disconnects — a protective celluloid pressed down to write and lifted to erase — not a graphics buffer with an alpha channel. The trace here is also perceptibly causal, where Freud’s bread crumbs of memory influence without ever displaying.',
  whyDistortionMatters:
    'The literalization is the risk: memory-as-storage is the folk model Freud was arguing against. The apparatus keeps one feature that resists it — the traces are never displayable all at once and are visible only in their deformation of the present — which is the part of the 1925 model worth keeping, and the part most often dropped.',
  competingReading:
    'A neural reading treats the slab as synaptic weight and the sheet as working memory; the pad becomes an ordinary two-buffer system. The apparatus does not dispute the mapping. It notes only that the phenomenology of the pad — the sense that the surface “resists” — is what the model was built to explain.',
  implementationNotes:
    'Sheet and slab are separate canvases; erasure clears only the sheet. Trace influence is computed by sampling the slab under the cursor and offsetting the stroke proportionally — no randomizer outside that local sample. Completion requires genuine prior inscription; an eraser with nothing written is merely an eraser.',
}
