# CONCEPTUAL MACHINES LAB

### Institute for Applied Metaphysics

A browser-based installation in which philosophical problems are instantiated
as experimental apparatuses. Philosophy as executable conceptual machinery —
not content, not a quiz, not a course.

Visitors operate twelve machines (plus one secret apparatus and four minor
ones), each of which turns a specific philosophical distinction, argument, or
structure into a rule of interaction. Completing machines contaminates the
laboratory itself. The facility remembers.

## What it is

An authored indie browser game / interactive philosophical artwork. The
visitor's intended progression: curiosity → amusement → experimentation →
recognition → conceptual confusion → philosophical reflection → suspicion that
the laboratory itself is part of the experiment.

It is explicitly **not**: a philosophy blog, a quote site, a course platform,
a personality quiz, gamified flashcards, or AI-generated philosophy.

## Design philosophy

1. **Interaction precedes explanation.** Every machine is playable before it
   is explainable. Interpretation lives in the textual apparatus, unlocked
   after operation.
2. **The mechanic is the argument.** A machine is authored starting from the
   question: *what philosophical distinction, argument, problem, or structure
   can become a rule of interaction?* Never from "what visuals would look
   cool?"
3. **Distortion is declared.** Software operationalizes a text at a cost. Each
   machine's textual apparatus names what it did, what it distorted, why the
   distortion matters, and what a competing reading would say.
4. **Contamination over completion.** Finishing an apparatus changes the shell
   of the laboratory. The product should eventually argue with its visitor.
5. **Primary-text discipline.** Precise citations, no fabricated quotations,
   no pop slogans, no thesis–antithesis–synthesis caricature. Humor is
   permitted; reduction is not.

## Architecture

```
src/
  main.tsx            entry; fonts + global styles
  App.tsx             route switching, entrance gate, shell composition
  router/             typed hash router (no dependency)
  state/
    store.ts          minimal reactive store (useSyncExternalStore)
    persistence.ts    versioned save schema, migrations, export/import
    record.ts         research-record store + actions
    settings.ts       audio/accessibility preferences
    lab.ts            session state, contamination instances, ticker, metrics
  audio/
    engine.ts         AudioEngine singleton: lazy AudioContext, master
                      limiter, three buses, ambience layer graph, scheduler
    scenes.ts         per-machine ambience profiles (pure data)
    sfx.ts            ~20 procedural sound recipes (oscillators + noise only)
  interact/micro.ts   pressable springs, magnetic targets, fx effects
  contamination/
    definitions.ts    effect inventory: unlock, probability, cooldown, scope
    engine.ts         eligibility logic + firing
  institution/
    messages.ts       authored message pools (14 event categories)
    engine.ts         cooldown-based emission
  machines/
    registry.ts       metadata for every apparatus (data-driven catalogue)
    machineComponents.ts  componentKey → lazy component map (one line each)
    chamber.ts        the six hand-authored cross-contaminations
    MachineFrame.tsx  full-screen apparatus shell + machine context API
    cm-001-will/      one folder per apparatus:
      machine.ts        pure logic (unit-tested)
      Machine.tsx       the interactive component
      content.ts        textual apparatus sections 03–08
      *.css             machine styling
  archive/content/    citation drafts + merged apparatus content
  shell/              entrance, catalogue, facility map, record, archive,
                      settings, chamber page, observing deck, contamination
                      layer, error boundary
tests/                vitest suite (logic + integrity + render smoke tests)
```

## Machine registry

Every apparatus is a `MachineMeta` entry in `src/machines/registry.ts`: id,
code, title, thinker, kind (apparatus/micro/restricted), zone, status,
duration, system line, concepts, primary works, component key, audio scene,
hidden flag, canonical completion events, and interpretation modes. The
catalogue, facility map, archive, and research record all read from this
single source. Nothing hard-codes the catalogue.

## The apparatuses

| Code | Apparatus | Thinker | System |
|------|-----------|---------|--------|
| CM-001 | THE WILL ENGINE | Schopenhauer | Striving / Relief / Boredom |
| CM-002 | DESIRE VERIFICATION TERMINAL | Lacan | Need / Demand / Desire |
| CM-003 | DIALECTICAL VENDING UNIT | Hegel | Immediacy / Mediation / Recognition |
| CM-004 | BROKEN TOOL | Heidegger | Transparency / Breakdown / Conspicuity |
| CM-005 | BRACKET | Husserl | Givenness / Horizon / Constitution |
| CM-006 | AGAIN | Nietzsche | Choice / Recurrence / Affirmation |
| CM-007 | NO WINDOWS | Leibniz | Correspondence / Causality / Harmony |
| CM-008 | PRIVATE ROOM | Wittgenstein | Ostension / Rule / Criteria |
| CM-009 | DIFFERENCE ENGINE | Deleuze | Repetition / Difference / Identity |
| CM-010 | EXPENDITURE | Bataille | Production / Saturation / Expenditure |
| CM-011 | TERMS | Derrida | Sign / Trace / Context |
| CM-012 | OBSERVATION ROOM | Foucault | Visibility / Examination / Conduct |
| CM-000 | PARMENIDES MOTION TEST *(secret)* | Parmenides | Locomotion / Being / Refusal |
| MA-01–04 | Zeno / Kant / Freud / Weil *(minor)* | — | 30–120 s each |

## How contamination works

Completing an apparatus unlocks contamination vectors — see
`src/contamination/definitions.ts`. Each effect declares its source machine,
an authored severity tier, a firing probability, a cooldown, and the routes it
may occupy. The shell checks for eligible effects on route changes, machine
exits, idle ticks, and completions. Fired effects render through
`shell/ContaminationLayer.tsx` (conspicuous controls, definitional chains,
behavioral dossiers, identical sequence replays…), are logged to the record's
contamination ledger, and respect cooldowns so they stay surprising. No
randomness beyond probability gates; nothing is generated at runtime.

Beyond shell contamination, the **Experimental Composition Chamber** (unlocks
at two completions) offers six hand-authored cross-contaminations — e.g.
Schopenhauer × Lacan or Heidegger × Marx — implemented as altered mechanics
inside the base apparatus, each with a post-run note stating that the hybrid
is an experimental confrontation, not a reconciliation.

## Audio system

All sound is procedural (Web Audio API): no samples, no network. A lazy
AudioContext (created on the first user gesture) feeds a master limiter and
three buses — ambience, interaction, machine. One physical ambience graph
(room tone, mains hum, wandering ventilation, distant machinery thumps, rare
impacts, terminal pulses) crossfades between per-machine scene profiles.
Roughly twenty SFX recipes cover clicks, failures, contradictions,
completions, secrets, surveillance events, recurrence pairs, and
contamination stings. Mute is instant; reduced-sensory mode scales all buses
down and suppresses sharp events; audio never starts before user interaction.

## Persistence model

`localStorage`, versioned schema (currently v2), no account. The research
record stores entered/completion state per apparatus, interpretation modes
completed, institutional counters (contradictions, failed verifications,
recurrences accepted, resets, satisfactions, expenditures…), discovered
secrets (UR-records), and the contamination ledger. A migration chain
upgrades old saves; unreadable payloads are backed up and replaced with a
fresh record — the application never bricks. Settings (volumes, mute, reduced
motion, reduced sensory) persist separately with clamped repair. The record
can be exported as JSON and re-imported locally; reset requires an explicit
confirmation step.

## Adding a new apparatus

See [docs/ADDING-APPARATUS.md](docs/ADDING-APPARATUS.md) for the template and
the full walkthrough. The key contributor rule:

> A new apparatus should not begin with "What visuals would look cool?"
> It should begin with "What philosophical distinction, argument, problem, or
> structure can become a rule of interaction?"

## Philosophical sourcing rule

Every machine cites primary texts with precision (e.g. *Sein und Zeit*
§§14–16, *Die fröhliche Wissenschaft* §341, *Philosophische Untersuchungen*
§243ff, DK 28 B8). Direct quotations are brief and sourced; invented
quotations and invented terminology are forbidden. Where scholarship divides,
the textual apparatus presents a competing reading rather than picking a
winner. Interpretive modes (AGAIN, BRACKET, OBSERVATION) change mechanics —
not just labels — so alternate readings are playable, not decorative.

## Accessibility

Keyboard operation throughout (machines expose keyboard paths where the
pointer path exists; CM-004's keyboard route is explicitly exempt from its
own breakdown), visible focus, semantic controls, aria labels and live
regions, reduced-motion (system-following plus manual override),
reduced-sensory mode (quieter, no sudden events), contrast-checked palette,
rem-scalable type. Accessibility controls never participate in an experiment:
they cannot fail, hide, or mislead.

## Local development

```bash
npm install
npm run dev        # dev server
npm run typecheck  # tsc -b
npm run lint       # eslint
npm test           # vitest (97 tests)
npm run build      # production build → dist/
npm run preview    # serve the production build
```

Requires Node ≥ 20. No API keys, no environment variables, no backend.

## Production build

`npm run build` type-checks and emits a fully static `dist/` deployable to
any static host. Machines are lazy-loaded per chunk; total payload is a few
hundred KB uncompressed.

## No-AI-runtime statement

There is **no runtime dependency** on OpenAI, Anthropic, Gemini, local LLMs,
external AI inference, paid APIs, or generative AI services of any kind. All
behavior is authored logic, procedural systems, state machines, local
content, browser APIs, and prewritten philosophical material. The repository's
PROMPT files document the design specifications only.

## Licensing notes

- Code: this repository.
- Fonts: IBM Plex Mono and IBM Plex Sans via @fontsource — SIL Open Font
  License 1.1, redistributable.
- All audio is synthesized at runtime; no recorded assets are bundled.
