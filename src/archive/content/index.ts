/**
 * Textual apparatus — the scholarly layer exposed by the Archive and by each
 * completed machine. Structure follows the Institute's canonical eight
 * sections (see PROMPT-2, Part VII). A software mechanic is an
 * interpretation; these documents say so explicitly.
 */

export interface TextualApparatus {
  machineId: string
  /** 1. PRIMARY SOURCE — precise citations, no fabricated quotations */
  primarySource: string[]
  /** 2. CONCEPTUAL PROBLEM — what is at stake in the texts */
  conceptualProblem: string
  /** 3. WHAT THE MACHINE DID — the mechanic as staged */
  whatTheMachineDid: string
  /** 4. WHAT THE MACHINE DISTORTED — the cost of operationalizing */
  whatTheMachineDistorted: string
  /** 5. WHY THAT DISTORTION MATTERS */
  whyDistortionMatters: string
  /** 6. COMPETING READING — a serious alternative interpretation */
  competingReading: string
  /** 7. QUESTIONS TO TAKE BACK TO THE TEXT */
  questionsForTheText: string[]
  /** 8. IMPLEMENTATION NOTES — how the software embodies the choices above */
  implementationNotes: string
}

type ApparatusDraft = Pick<TextualApparatus, 'machineId' | 'primarySource' | 'conceptualProblem' | 'questionsForTheText'>

/**
 * Machine-local apparatus sections (03–08) live inside each machine folder
 * and are merged here with the citation drafts above. A new apparatus adds
 * its content.ts and one import below.
 */
import { apparatus as cm001 } from '@/machines/cm-001-will/content'
import { apparatus as cm002 } from '@/machines/cm-002-desire/content'
import { apparatus as cm003 } from '@/machines/cm-003-vending/content'
import { apparatus as cm004 } from '@/machines/cm-004-broken-tool/content'
import { apparatus as cm005 } from '@/machines/cm-005-bracket/content'
import { apparatus as cm006 } from '@/machines/cm-006-again/content'
import { apparatus as cm007 } from '@/machines/cm-007-windows/content'
import { apparatus as cm008 } from '@/machines/cm-008-private/content'
import { apparatus as cm009 } from '@/machines/cm-009-difference/content'
import { apparatus as cm010 } from '@/machines/cm-010-expenditure/content'
import { apparatus as cm011 } from '@/machines/cm-011-terms/content'
import { apparatus as cm012 } from '@/machines/cm-012-observation/content'
import { apparatus as cm000 } from '@/machines/cm-000-parmenides/content'
import { apparatus as ma01 } from '@/machines/ma-01-zeno/content'
import { apparatus as ma02 } from '@/machines/ma-02-noumenal/content'
import { apparatus as ma03 } from '@/machines/ma-03-writing-pad/content'
import { apparatus as ma04 } from '@/machines/ma-04-attention/content'

const SECTION_FILL: Readonly<Record<string, Partial<TextualApparatus>>> = {
  'cm-001-will': cm001,
  'cm-002-desire': cm002,
  'cm-003-vending': cm003,
  'cm-004-broken-tool': cm004,
  'cm-005-bracket': cm005,
  'cm-006-again': cm006,
  'cm-007-windows': cm007,
  'cm-008-private': cm008,
  'cm-009-difference': cm009,
  'cm-010-expenditure': cm010,
  'cm-011-terms': cm011,
  'cm-012-observation': cm012,
  'cm-000-parmenides': cm000,
  'ma-01-zeno': ma01,
  'ma-02-noumenal': ma02,
  'ma-03-writing-pad': ma03,
  'ma-04-attention': ma04,
}

const EMPTY_SECTIONS = {
  whatTheMachineDid: '',
  whatTheMachineDistorted: '',
  whyDistortionMatters: '',
  competingReading: '',
  implementationNotes: '',
} as const


const DRAFTS: ApparatusDraft[] = [
  {
    machineId: 'cm-001-will',
    primarySource: [
      'Schopenhauer, Die Welt als Wille und Vorstellung I, §§56–57 (wanting, attainment, satiety)',
      'Schopenhauer, Die Welt als Wille und Vorstellung II, Kap. 46 (life swinging between suffering and boredom)',
    ],
    conceptualProblem:
      'Schopenhauer argues that willing arises from lack, and that attainment therefore cannot terminate willing: satisfaction is at best the momentary absence of a felt deficiency, after which the same structure reasserts itself either as renewed lack or as boredom — the felt absence of anything left to want. The problem staged here is whether an economy of satisfactions can ever be terminal, or whether the loop of striving → relief → boredom → renewed striving is the operating condition of a subject at all.',
    questionsForTheText: [
      'Does §57 treat satisfaction as an event in the world or as a modification of willing itself?',
      'Is boredom, on Schopenhauer’s account, a failure of the world or the successful exhaustion of desire?',
      'What would the negation of the will have to feel like from inside a subject that still wants?',
    ],
  },
  {
    machineId: 'cm-002-desire',
    primarySource: [
      'Lacan, Écrits, “Subversion du sujet et dialectique du désir dans l’inconscient freudien” (1960)',
      'Lacan, Le Séminaire, Livre XI, Les quatre concepts fondamentaux de la psychanalyse (objet petit a)',
    ],
    conceptualProblem:
      'Lacan distinguishes need (biological, in principle satisfiable), demand (articulated in language, always also a demand for love), and desire (in excess of both, sustained by lack). Desire is not wanting a missing object; it is the effect of the object being constitutively displaced — objet petit a is the cause of desire, not its goal. The machine stages verification of desire because desire resists exactly the checklist form a verification procedure requires: whatever you select is already articulated in the terms of the Other.',
    questionsForTheText: [
      'Can a demand ever be satisfied without transforming the desire that demanded it?',
      'What would it mean for a desire to pass verification — and who would sign the result?',
      'Is the lack that sustains desire the same lack that makes demand insatiable?',
    ],
  },
  {
    machineId: 'cm-003-vending',
    primarySource: [
      'Hegel, Phänomenologie des Geistes (1807), Kap. IV “Selbstbewußtsein”, §§178–196 (recognition, lordship and bondage)',
      'Hegel, Wissenschaft der Logik, Lehre vom Wesen, “Die Existenz” (mediation and grounding)',
    ],
    conceptualProblem:
      'The vending transaction presents itself as immediate: a request, a coin, an object. Hegel’s problem is that immediacy of this kind is produced by a structure of mediations — property, money, labor, the recognition of self and other — that must remain invisible for the object to appear simply available. Determinate negation is not an obstacle to be routed around but the movement through which a richer position is generated. The apparatus stages the emergence of those mediations from inside an ordinary act.',
    questionsForTheText: [
      'When the drink finally arrives, is it the same object that was initially requested?',
      'Is the contradiction located in the machine, or in the form of the request?',
      'Does recognition between user and machine reproduce the lord/bondsman structure or dissolve it?',
    ],
  },
  {
    machineId: 'cm-004-broken-tool',
    primarySource: [
      'Heidegger, Sein und Zeit (1927), §§14–16 (equipment, readiness-to-hand, conspicuousness)',
    ],
    conceptualProblem:
      'Equipment is encountered primarily in use, not as an object with properties; its being withdraws while it functions. When equipment fails — becomes conspicuous, obtrusive, or obstinate — what was invisibly at work becomes visible, and the environing world of references becomes examinable. The distinction ready-to-hand / present-at-hand is not “useful versus useless” but two ways of encountering beings: equipment in play versus a thing stared at as an object.',
    questionsForTheText: [
      'At what point did the interface become conspicuous — and was that a malfunction of the interface or an event in your attention?',
      'Is the revealed component the equipment itself, or its present-at-hand remainder?',
      'Can transparency be restored by repairing the tool, or does the repair itself remain conspicuous?',
    ],
  },
  {
    machineId: 'cm-005-bracket',
    primarySource: [
      'Husserl, Die Idee der Phänomenologie (1907) — the natural attitude and the epoché',
      'Husserl, Ideen zu einer reinen Phänomenologie I (1913), §§27–32',
      'Husserl, Vorlesungen zur Phänomenologie des inneren Zeitbewusstseins — retention and protention',
    ],
    conceptualProblem:
      'The epoché is not doubt about whether the object exists; it is a suspension of the existential thesis of the natural attitude so that the modes of givenness themselves can be examined. The object is never given all at once: it shows profiles, implies unseen sides, is constituted across retentions and protentions, and is indexed to a bodily here. The machine stages constitution as an investigable process rather than an assumption.',
    questionsForTheText: [
      'What remains of the chair when its existence-thesis is bracketed — nothing, or everything except the thesis?',
      'Can any profile be excluded without importing a rule about which profiles count as the same object?',
      'Is the horizon of the object part of the object?',
    ],
  },
  {
    machineId: 'cm-006-again',
    primarySource: [
      'Nietzsche, Die fröhliche Wissenschaft (1882), §341 (“Das grösste Schwergewicht”)',
      'Nietzsche, Also sprach Zarathustra III, “Der Genesende” (1884)',
      'Nietzsche, Nachlass 1881–1884 (KSA 9, 11) — early cosmological formulations',
    ],
    conceptualProblem:
      '§341 poses recurrence not as doctrine but as test: a demon offers your life again, innumerable times, identical — and the question is whether you would gnash your teeth or answer that no teacher was ever more devout. Readings divide: a cosmological thesis about force and time, an existential test of affirmation, and a selective principle by which life-denying values are exposed and transformed. The apparatus stores your sequence and asks the §341 question with your own recorded actions.',
    questionsForTheText: [
      'Did the replay change because you knew it was a replay?',
      'Is affirmation of the whole compatible with regret for any part?',
      'Which interpretation makes the demon cruel, and which makes him neutral?',
    ],
  },
  {
    machineId: 'cm-007-windows',
    primarySource: [
      'Leibniz, Monadologie (1714), §§7, 11–13, 51, 78–81',
      'Leibniz, Discours de métaphysique (1686), §§14–15',
    ],
    conceptualProblem:
      'Monads have no windows: nothing enters or leaves a simple substance by causal influence, yet each monad expresses the entire universe from its own point of view, and their states correspond through pre-established harmony. Apparent interaction is coordinated internal development, not transmission. The machine stages a social room in which coordination is perfect while the causal channel reads zero — and asks whether the appearance of conversation can be distinguished from conversation.',
    questionsForTheText: [
      'If correspondence is perfect, what work is causation still doing?',
      'Does the user’s intervention in one monad differ in kind from the monad’s own internal principle?',
      'Is pre-established harmony a solution to the problem, or a renaming of it?',
    ],
  },
  {
    machineId: 'cm-008-private',
    primarySource: [
      'Wittgenstein, Philosophische Untersuchungen (1953), §§243, 254–261, 293 (private ostensive definition, the diary case, the beetle in the box)',
    ],
    conceptualProblem:
      '§243 asks whether words for inner experiences can refer to what only the speaker can know. The private diarist of §258 tries to fix a sign to a private sensation by concentrating attention — but then whatever seems right will be right, and the distinction between correctness and the appearance of correctness collapses. Criteria of correct use are constitutively public: not because language is policed by others, but because rule-following is discernible only in practice. The machine stages a “private” symbol that becomes usable exactly insofar as its use becomes shared.',
    questionsForTheText: [
      'Where exactly did the private criterion fail — or did it ever exist as a criterion?',
      'Does the symbol becoming shared practice add meaning to it, or constitute its meaning for the first time?',
      'What could a sensation-word mean if its correctness never had to be checkable by anyone, including you?',
    ],
  },
  {
    machineId: 'cm-009-difference',
    primarySource: [
      'Deleuze, Différence et répétition (1968), chs. 1–2 (“La différence en elle-même”, “La répétition pour elle-même”)',
    ],
    conceptualProblem:
      'Deleuze distinguishes repetition of the same from repetition that produces difference: genuine repetition is not the return of an identical but a practice in which each iteration internalizes and displaces the last — difference made by repetition, not despite it. The identity of the object is the retrospective effect of stabilized differences, not their origin. The machine forbids reproduction: REPEAT always repeats, and the result is never the same object.',
    questionsForTheText: [
      'At which iteration did “the same object” stop referring?',
      'Is the genealogy visible at the end a structure that was always there, or an artifact of the repetition?',
      'If identity is a statistical stabilization, what is it a stabilization of?',
    ],
  },
  {
    machineId: 'cm-010-expenditure',
    primarySource: [
      'Bataille, La part maudite (1949), esp. “L’économie restreinte et l’économie générale”',
      'Bataille, “La notion de dépense” (1933)',
    ],
    conceptualProblem:
      'Bataille distinguishes the restricted economy of production and conservation from the general economy, in which living wealth always exceeds what can usefully be absorbed, and surplus must be spent — gloriously or catastrophically — because growth that cannot be consumed becomes pressure. Expenditure (festival, monument, gift, spectacle, sacrifice) is not waste in the restricted sense but the necessary consumption of excess. The machine builds a tiny economy and lets saturation make the point that saving has a ceiling.',
    questionsForTheText: [
      'Which of your expenditures increased the system’s glory, and which merely deferred its pressure?',
      'Is “useless” architecture useless for the economy, or for the restricted way of measuring it?',
      'Did you spend because you chose to, or because storage saturated?',
    ],
  },
  {
    machineId: 'cm-011-terms',
    primarySource: [
      'Derrida, Marges de la philosophie (1972), “La différance”, “Signature événement contexte”',
      'Derrida, De la grammatologie (1967), Partie I',
    ],
    conceptualProblem:
      'Signification is differential: a term means through its relations to other terms and through the traces of what it is not; meaning is therefore constituted with a constitutive deferral (différance) and depends on contexts that can never be closed. Iterability — a mark’s capacity to function in the absence of its origin and addressee — is what allows the mark to work at all, and simultaneously prevents any context from saturating it. The machine stages terms and conditions as a semantic graph with no ground floor: ACCEPT retreats as the graph grows.',
    questionsForTheText: [
      'Did any definition in the chain reach a stopping point that was not arbitrary?',
      'Is ACCEPT deeper in the graph a failure of consent, or a more honest account of what consent is?',
      'What does the graph depend on, if not on further definitions?',
    ],
  },
  {
    machineId: 'cm-012-observation',
    primarySource: [
      'Foucault, Surveiller et punir (1975), Partie III “La discipline”, esp. “L’examen” and “Le panoptisme”',
    ],
    conceptualProblem:
      'Disciplinary power operates less by force than by visibility arranged so that conduct is normalized: hierarchical observation, the examination that documents and compares individuals, and the panoptic schema in which the permanent possibility of being seen makes the inmate the principle of his own surveillance. The apparatus never claims an observer is present; it uses only local session data. The point is that uncertain visibility is sufficient to change conduct, and that the resulting statistics are themselves an instrument of normalization.',
    questionsForTheText: [
      'Which of your actions would you have performed differently if the analytics had never been visible?',
      'Who is examined by the examination: the subject, or the population?',
      'Does knowing the observer is absent restore an outside, or simply add you to the observers?',
    ],
  },
  {
    machineId: 'cm-000-parmenides',
    primarySource: [
      'Parmenides, Poem, DK 28 B8 (Diels–Kranz numbering) — what-is is ungenerated and motionless',
      'Parmenides, Poem, DK 28 B1 — the road of inquiry',
    ],
    conceptualProblem:
      'In B8 the goddess forbids the route on which what-is comes to be or passes away: what-is is complete, immovable, whole. Change and locomotion, on the strictest reading, belong to the opinions of mortals, not to what-is. The motion test exploits the difference between the visual field moving and the subject moving: the apparatus relocates the world and reports the avatar’s coordinates as invariant, because on this ontological regime there is nothing for the avatar to traverse.',
    questionsForTheText: [
      'Is the impossibility of exit a fact about space, or about what-is?',
      'Zeno defends this territory by argument; this apparatus defends it by physics. Which defense do you trust?',
      'If the coordinates never change, what exactly did you do?',
    ],
  },
  {
    machineId: 'ma-01-zeno',
    primarySource: [
      'Zeno of Elea, DK 29 B1–B3 (the dichotomy, Achilles), as reported in Aristotle, Physica VI 9',
    ],
    conceptualProblem:
      'The dichotomy argues that motion cannot complete — or begin — because before reaching any point one must first reach the halfway point, without limit. Aristotle’s standard response distinguishes potential from actual infinity. The apparatus halves the remaining distance indefinitely but refuses to let the bar be infinite: at an authored threshold the Institute declares the traversal complete by decree, which is one honest way out of an argument about limits.',
    questionsForTheText: [
      'Was the bar ever moving, or was the space between states shrinking?',
      'Which arrived first: the end of the bar, or the decision that it had ended?',
    ],
  },
  {
    machineId: 'ma-02-noumenal',
    primarySource: [
      'Kant, Kritik der reinen Vernunft (1781/1787), “Von den Noumena”, A235–260/B294–315; cf. B xxvi–xxvii',
    ],
    conceptualProblem:
      'For Kant, objects are given only under the forms of sensibility and the categories of understanding; the thing as it is in itself is thinkable but not knowable. Every attempt to inspect an object “as it is unmediated” therefore yields another appearance — another determination shaped by the inspecting apparatus. The inspector stages this: the raw-object pane cannot be opened without generating a new mediated representation, and the pane beneath is itself a representation.',
    questionsForTheText: [
      'Is the inspector’s failure an epistemic limitation, or a constitutive condition of objecthood?',
      'Can you distinguish the nth representation from the (n+1)th in kind, rather than in position?',
    ],
  },
  {
    machineId: 'ma-03-writing-pad',
    primarySource: ['Freud, “Notiz über den Wunderblock” (1925), GW XIV'],
    conceptualProblem:
      'Freud’s mystic writing pad supplies his model of perception-consciousness: the wax paper receives and releases marks (the surface of consciousness), while the wax slab beneath retains permanent traces it can never display all at once. Memory, on this model, is not a surface but a depth that keeps writing on what has already been written. The apparatus erases the visible sheet and lets the retained traces bend the next marks.',
    questionsForTheText: [
      'Where does the trace reside if the surface is always clean?',
      'Are your next marks composed by you, or countersigned by the slab?',
    ],
  },
  {
    machineId: 'ma-04-attention',
    primarySource: [
      'Weil, Attente de Dieu (posth. 1950), “Réflexions sur le bon usage des études scolaires en vue de l’amour de Dieu”',
      'Weil, Lettre à Joë Bousquet (1942)',
    ],
    conceptualProblem:
      'Weil treats attention — sustained, non-appropriative regard — as the core of both study and prayer; in the Bousquet letter she calls it the rarest and purest form of generosity. The laboratory’s apparatuses all reward manipulation; this one withholds until manipulation stops, so that what appears is a function of restraint rather than acquisition.',
    questionsForTheText: [
      'What did you learn in the apparatus that could not have been extracted from it?',
      'Is patience a form of action the apparatus failed to measure, or the one action it measured correctly?',
    ],
  },
]

/**
 * Phase 0 shipped citations + the conceptual problem + take-back questions.
 * Sections 3–6 and 8 come from the machine folders via SECTION_FILL.
 */
export const APPARATUS_CONTENT: ReadonlyMap<string, TextualApparatus> = new Map(
  DRAFTS.map((d) => [
    d.machineId,
    {
      ...EMPTY_SECTIONS,
      ...d,
      ...(SECTION_FILL[d.machineId] ?? {}),
    } satisfies TextualApparatus,
  ]),
)

export function getApparatusContent(machineId: string): TextualApparatus | undefined {
  return APPARATUS_CONTENT.get(machineId)
}
