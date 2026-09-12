/**
 * Machine registry — the single data-driven source of truth for every
 * apparatus in the facility. Metadata only: components are resolved lazily
 * via `machineComponents.ts`, so adding an apparatus never edits the shell.
 */

export type ZoneId =
  | 'west-wing'
  | 'east-wing'
  | 'lower-archive'
  | 'central-hall'
  | 'service-corridor'
  | 'still-room'
  | 'restricted'

export interface Zone {
  id: ZoneId
  code: string
  title: string
  subtitle: string
}

export const ZONES: Zone[] = [
  {
    id: 'west-wing',
    code: 'W-WING',
    title: 'WEST WING',
    subtitle: 'INFERENCE & PHENOMENOLOGY',
  },
  {
    id: 'east-wing',
    code: 'E-WING',
    title: 'EAST WING',
    subtitle: 'DESIRE & SUBJECT FORMATION',
  },
  {
    id: 'lower-archive',
    code: 'L-ARCH',
    title: 'LOWER ARCHIVE',
    subtitle: 'LANGUAGE SYSTEMS',
  },
  {
    id: 'central-hall',
    code: 'C-HALL',
    title: 'CENTRAL HALL',
    subtitle: 'TRANSIT & ASSEMBLY',
  },
  {
    id: 'service-corridor',
    code: 'S-CORR',
    title: 'SERVICE CORRIDOR',
    subtitle: 'SYSTEMIC APPARATUSES',
  },
  {
    id: 'still-room',
    code: 'S-ROOM',
    title: 'STILL ROOM',
    subtitle: 'ATTENTION STUDIES',
  },
  {
    id: 'restricted',
    code: 'R-STR',
    title: 'RESTRICTED WING',
    subtitle: 'ACCESS NOT PREAUTHORIZED',
  },
]

export type MachineKind = 'apparatus' | 'micro' | 'restricted'

export type OperationalStatus =
  | 'OPERATIONAL'
  | 'RESTRICTED'
  | 'SEALED'
  | 'NOT FOUND'
  | 'UNFORTUNATELY FUNCTIONING'

export interface PrimaryWorkRef {
  author: string
  work: string
  detail?: string
}

export interface InterpretationModeDef {
  id: string
  label: string
  blurb: string
}

export interface MachineMeta {
  id: string
  code: string
  title: string
  thinker: string
  kind: MachineKind
  zone: ZoneId
  status: OperationalStatus
  duration: string
  /** the SYSTEM: line shown in the catalogue */
  system: string
  concepts: string[]
  primaryWorks: PrimaryWorkRef[]
  /** key resolved by machineComponents.ts */
  componentKey: string
  /** scene id consumed by the audio engine's ambience mixer */
  audioScene: string
  /** hidden machines are excluded from the catalogue until discovered */
  hidden: boolean
  /** canonical completion events (documented contract; dispatched by the machine) */
  completionEvents: string[]
  modes?: InterpretationModeDef[]
}

export const MACHINES: MachineMeta[] = [
  {
    id: 'cm-001-will',
    code: 'CM-001',
    title: 'THE WILL ENGINE',
    thinker: 'Schopenhauer',
    kind: 'apparatus',
    zone: 'east-wing',
    status: 'OPERATIONAL',
    duration: '4–8 min',
    system: 'Striving / Relief / Boredom',
    concepts: ['will', 'lack', 'satisfaction', 'boredom', 'negation of the will'],
    primaryWorks: [
      { author: 'Schopenhauer', work: 'Die Welt als Wille und Vorstellung I', detail: '§§56–57' },
      { author: 'Schopenhauer', work: 'Die Welt als Wille und Vorstellung II', detail: 'Kap. 46' },
    ],
    componentKey: 'cm-001-will',
    audioScene: 'will-engine',
    hidden: false,
    completionEvents: ['will:cessation', 'will:session-ended'],
  },
  {
    id: 'cm-002-desire',
    code: 'CM-002',
    title: 'DESIRE VERIFICATION TERMINAL',
    thinker: 'Lacan',
    kind: 'apparatus',
    zone: 'east-wing',
    status: 'OPERATIONAL',
    duration: '3–6 min',
    system: 'Need / Demand / Desire',
    concepts: ['need', 'demand', 'desire', 'objet petit a', 'the Other'],
    primaryWorks: [
      {
        author: 'Lacan',
        work: 'Écrits',
        detail: '“Subversion du sujet et dialectique du désir dans l’inconscient freudien”',
      },
      { author: 'Lacan', work: 'Le Séminaire, Livre XI', detail: 'objet petit a' },
    ],
    componentKey: 'cm-002-desire',
    audioScene: 'verification',
    hidden: false,
    completionEvents: ['desire:verification-incomplete'],
  },
  {
    id: 'cm-003-vending',
    code: 'CM-003',
    title: 'DIALECTICAL VENDING UNIT',
    thinker: 'Hegel',
    kind: 'apparatus',
    zone: 'central-hall',
    status: 'UNFORTUNATELY FUNCTIONING',
    duration: '3–5 min',
    system: 'Immediacy / Mediation / Recognition',
    concepts: ['immediacy', 'mediation', 'determinate negation', 'recognition'],
    primaryWorks: [
      { author: 'Hegel', work: 'Phänomenologie des Geistes', detail: 'Kap. IV, §§178–196' },
      { author: 'Hegel', work: 'Wissenschaft der Logik', detail: 'Lehre vom Wesen: “Die Existenz”' },
    ],
    componentKey: 'cm-003-vending',
    audioScene: 'vending-hall',
    hidden: false,
    completionEvents: ['vending:dispensed'],
  },
  {
    id: 'cm-004-broken-tool',
    code: 'CM-004',
    title: 'BROKEN TOOL',
    thinker: 'Heidegger',
    kind: 'apparatus',
    zone: 'west-wing',
    status: 'OPERATIONAL',
    duration: '3–5 min',
    system: 'Transparency / Breakdown / Conspicuity',
    concepts: ['equipment', 'ready-to-hand', 'present-at-hand', 'breakdown'],
    primaryWorks: [
      { author: 'Heidegger', work: 'Sein und Zeit', detail: '§§14–16' },
    ],
    componentKey: 'cm-004-broken-tool',
    audioScene: 'workbench',
    hidden: false,
    completionEvents: ['tool:equipment-objectified'],
  },
  {
    id: 'cm-005-bracket',
    code: 'CM-005',
    title: 'BRACKET',
    thinker: 'Husserl',
    kind: 'apparatus',
    zone: 'west-wing',
    status: 'OPERATIONAL',
    duration: '3–6 min',
    system: 'Givenness / Horizon / Constitution',
    concepts: ['epoché', 'profiles', 'horizon', 'retention', 'protention'],
    primaryWorks: [
      { author: 'Husserl', work: 'Die Idee der Phänomenologie', detail: '1907' },
      { author: 'Husserl', work: 'Ideen zu einer reinen Phänomenologie I', detail: '§§27–32' },
      {
        author: 'Husserl',
        work: 'Vorlesungen zur Phänomenologie des inneren Zeitbewusstseins',
      },
    ],
    componentKey: 'cm-005-bracket',
    audioScene: 'bracket-console',
    hidden: false,
    completionEvents: ['bracket:constitution-complete'],
    modes: [
      {
        id: 'static-constitution',
        label: 'MODE A — STATIC CONSTITUTION',
        blurb: 'Object examined through its profiles and horizon, suspended in view.',
      },
      {
        id: 'temporal-constitution',
        label: 'MODE B — TEMPORAL CONSTITUTION',
        blurb: 'Retention and protention foregrounded; the object persists as a flow.',
      },
      {
        id: 'embodied-orientation',
        label: 'MODE C — EMBODIED ORIENTATION',
        blurb: 'Profiles indexed to a bodily here; viewpoint bound to orientation.',
      },
    ],
  },
  {
    id: 'cm-006-again',
    code: 'CM-006',
    title: 'AGAIN',
    thinker: 'Nietzsche',
    kind: 'apparatus',
    zone: 'central-hall',
    status: 'OPERATIONAL',
    duration: '3–5 min',
    system: 'Choice / Recurrence / Affirmation',
    concepts: ['eternal recurrence', 'affirmation', 'self-formation'],
    primaryWorks: [
      { author: 'Nietzsche', work: 'Die fröhliche Wissenschaft', detail: '§341' },
      { author: 'Nietzsche', work: 'Also sprach Zarathustra III', detail: '“Der Genesende”' },
      { author: 'Nietzsche', work: 'Nachlass 1881–1884 (KSA 9, 11)', detail: 'cosmological notes' },
    ],
    componentKey: 'cm-006-again',
    audioScene: 'recurrence-booth',
    hidden: false,
    completionEvents: ['again:recurrence-accepted', 'again:recurrence-refused'],
    modes: [
      {
        id: 'existential-test',
        label: 'MODE A — EXISTENTIAL TEST',
        blurb: 'Recurrence as a practical test of affirmation.',
      },
      {
        id: 'cosmological-proposition',
        label: 'MODE B — COSMOLOGICAL PROPOSITION',
        blurb: 'Recurrence as a doctrine about the structure of time and force.',
      },
      {
        id: 'selective-transformative',
        label: 'MODE C — SELECTIVE / TRANSFORMATIVE',
        blurb: 'Recurrence as the criterion that transforms what may return.',
      },
    ],
  },
  {
    id: 'cm-007-windows',
    code: 'CM-007',
    title: 'NO WINDOWS',
    thinker: 'Leibniz',
    kind: 'apparatus',
    zone: 'service-corridor',
    status: 'OPERATIONAL',
    duration: '3–4 min',
    system: 'Correspondence / Causality / Harmony',
    concepts: ['monads', 'windowlessness', 'pre-established harmony'],
    primaryWorks: [
      { author: 'Leibniz', work: 'Monadologie', detail: '§§7, 11–13, 51, 78–81' },
      { author: 'Leibniz', work: 'Discours de métaphysique', detail: '§§14–15' },
    ],
    componentKey: 'cm-007-windows',
    audioScene: 'monad-room',
    hidden: false,
    completionEvents: ['windows:harmony-observed'],
  },
  {
    id: 'cm-008-private',
    code: 'CM-008',
    title: 'PRIVATE ROOM',
    thinker: 'Wittgenstein',
    kind: 'apparatus',
    zone: 'lower-archive',
    status: 'OPERATIONAL',
    duration: '4–6 min',
    system: 'Ostension / Rule / Criteria',
    concepts: ['private language', 'ostensive definition', 'rule-following', 'criteria'],
    primaryWorks: [
      { author: 'Wittgenstein', work: 'Philosophische Untersuchungen', detail: '§§243, 254–261, 293' },
    ],
    componentKey: 'cm-008-private',
    audioScene: 'private-room',
    hidden: false,
    completionEvents: ['private:criteria-established'],
  },
  {
    id: 'cm-009-difference',
    code: 'CM-009',
    title: 'DIFFERENCE ENGINE',
    thinker: 'Deleuze',
    kind: 'apparatus',
    zone: 'service-corridor',
    status: 'OPERATIONAL',
    duration: '3–5 min',
    system: 'Repetition / Difference / Identity',
    concepts: ['repetition', 'difference-in-itself', 'identity as stabilization'],
    primaryWorks: [
      { author: 'Deleuze', work: 'Différence et répétition', detail: 'chs. 1–2' },
    ],
    componentKey: 'cm-009-difference',
    audioScene: 'difference-bench',
    hidden: false,
    completionEvents: ['difference:genealogy-emerged'],
  },
  {
    id: 'cm-010-expenditure',
    code: 'CM-010',
    title: 'EXPENDITURE',
    thinker: 'Bataille',
    kind: 'apparatus',
    zone: 'service-corridor',
    status: 'OPERATIONAL',
    duration: '4–7 min',
    system: 'Production / Saturation / Expenditure',
    concepts: ['surplus', 'restricted economy', 'general economy', 'expenditure'],
    primaryWorks: [
      { author: 'Bataille', work: 'La part maudite', detail: '1949' },
      { author: 'Bataille', work: '“La notion de dépense”', detail: '1933' },
    ],
    componentKey: 'cm-010-expenditure',
    audioScene: 'expenditure-yard',
    hidden: false,
    completionEvents: ['expenditure:consumption-performed'],
  },
  {
    id: 'cm-011-terms',
    code: 'CM-011',
    title: 'TERMS',
    thinker: 'Derrida',
    kind: 'apparatus',
    zone: 'lower-archive',
    status: 'OPERATIONAL',
    duration: '3–6 min',
    system: 'Sign / Trace / Context',
    concepts: ['différance', 'trace', 'iterability', 'context'],
    primaryWorks: [
      { author: 'Derrida', work: 'Marges de la philosophie', detail: '“La différance”, “Signature événement contexte”' },
      { author: 'Derrida', work: 'De la grammatologie', detail: 'Partie I' },
    ],
    componentKey: 'cm-011-terms',
    audioScene: 'terms-office',
    hidden: false,
    completionEvents: ['terms:accept-depth-reached'],
  },
  {
    id: 'cm-012-observation',
    code: 'CM-012',
    title: 'OBSERVATION ROOM',
    thinker: 'Foucault',
    kind: 'apparatus',
    zone: 'service-corridor',
    status: 'OPERATIONAL',
    duration: '3–5 min',
    system: 'Visibility / Examination / Conduct',
    concepts: ['panopticism', 'examination', 'normalization', 'surveillance'],
    primaryWorks: [
      { author: 'Foucault', work: 'Surveiller et punir', detail: 'Partie III: “L’examen”, “Le panoptisme”' },
    ],
    componentKey: 'cm-012-observation',
    audioScene: 'observation-room',
    hidden: false,
    completionEvents: ['observation:compliance-recorded'],
    modes: [
      {
        id: 'panoptic-visibility',
        label: 'MODE A — PANOPTIC VISIBILITY',
        blurb: 'The tower is lit; the source of visibility is unknown.',
      },
      {
        id: 'examination-normalization',
        label: 'MODE B — EXAMINATION / NORMALIZATION',
        blurb: 'Your conduct is documented, compared, and placed on a curve.',
      },
      {
        id: 'self-monitoring',
        label: 'MODE C — SELF-MONITORING',
        blurb: 'The analytics panel is yours from the first minute.',
      },
    ],
  },
  {
    id: 'cm-000-parmenides',
    code: 'CM-000',
    title: 'PARMENIDES MOTION TEST',
    thinker: 'Parmenides',
    kind: 'restricted',
    zone: 'restricted',
    status: 'RESTRICTED',
    duration: '1–2 min',
    system: 'Locomotion / Being / Refusal',
    concepts: ['being', 'motion', 'the way of truth'],
    primaryWorks: [
      { author: 'Parmenides', work: 'Poem', detail: 'DK 28 B8, B1' },
    ],
    componentKey: 'cm-000-parmenides',
    audioScene: 'motion-test',
    hidden: true,
    completionEvents: ['motion:exit-refused'],
  },
  {
    id: 'ma-01-zeno',
    code: 'MA-01',
    title: 'ZENO PROGRESS BAR',
    thinker: 'Zeno of Elea',
    kind: 'micro',
    zone: 'service-corridor',
    status: 'OPERATIONAL',
    duration: '30–60 s',
    system: 'Approach / Halving / Limit',
    concepts: ['dichotomy', 'infinite divisibility'],
    primaryWorks: [
      { author: 'Zeno of Elea', work: 'DK 29 B1–B3', detail: 'as reported in Aristotle, Physica VI 9' },
    ],
    componentKey: 'ma-01-zeno',
    audioScene: 'zeno-bar',
    hidden: false,
    completionEvents: ['zeno:limit-arrived'],
  },
  {
    id: 'ma-02-noumenal',
    code: 'MA-02',
    title: 'NOUMENAL INSPECTOR',
    thinker: 'Kant',
    kind: 'micro',
    zone: 'west-wing',
    status: 'OPERATIONAL',
    duration: '30–90 s',
    system: 'Appearance / Inspection / Mediation',
    concepts: ['thing in itself', 'phenomenon', 'mediation'],
    primaryWorks: [
      { author: 'Kant', work: 'Kritik der reinen Vernunft', detail: '“Von den Noumena”, A235–260/B294–315' },
    ],
    componentKey: 'ma-02-noumenal',
    audioScene: 'noumenal-desk',
    hidden: false,
    completionEvents: ['noumenal:inspection-withheld'],
  },
  {
    id: 'ma-03-writing-pad',
    code: 'MA-03',
    title: 'MYSTIC WRITING PAD',
    thinker: 'Freud',
    kind: 'micro',
    zone: 'east-wing',
    status: 'OPERATIONAL',
    duration: '30–120 s',
    system: 'Writing / Erasure / Trace',
    concepts: ['perception-consciousness', 'memory trace'],
    primaryWorks: [
      { author: 'Freud', work: '“Notiz über den Wunderblock”', detail: '1925, GW XIV' },
    ],
    componentKey: 'ma-03-writing-pad',
    audioScene: 'writing-pad',
    hidden: false,
    completionEvents: ['writing:trace-remained'],
  },
  {
    id: 'ma-04-attention',
    code: 'MA-04',
    title: 'ATTENTION',
    thinker: 'Simone Weil',
    kind: 'micro',
    zone: 'still-room',
    status: 'OPERATIONAL',
    duration: '60–120 s',
    system: 'Action / Stillness / Attention',
    concepts: ['attention', 'decreation', 'restraint'],
    primaryWorks: [
      { author: 'Weil', work: 'Attente de Dieu', detail: '“Réflexions sur le bon usage des études scolaires”' },
      { author: 'Weil', work: 'Lettre à Joë Bousquet', detail: '1942' },
    ],
    componentKey: 'ma-04-attention',
    audioScene: 'still-room',
    hidden: false,
    completionEvents: ['attention:stillness-held'],
  },
]

export const MACHINE_BY_ID: ReadonlyMap<string, MachineMeta> = new Map(
  MACHINES.map((m) => [m.id, m]),
)

export function machinesInZone(zone: ZoneId): MachineMeta[] {
  return MACHINES.filter((m) => m.zone === zone)
}

export function getMachine(id: string): MachineMeta | undefined {
  return MACHINE_BY_ID.get(id)
}

export function cataloguedMachines(): MachineMeta[] {
  return MACHINES.filter((m) => !m.hidden)
}
