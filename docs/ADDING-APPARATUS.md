# Adding a New Apparatus

This guide is the contract for extending the laboratory. Follow it and a new
machine registers into the catalogue, facility map, archive, research record,
contamination system, and audio system without touching the shell.

## The key contributor rule

A new apparatus should not begin with "What visuals would look cool?"

It should begin with:

> "What philosophical distinction, argument, problem, or structure can become
> a rule of interaction?"

If you cannot state the philosophical problem as a mechanic in one sentence,
the machine is not ready to build. Write the sentence first; it will become
the machine's `system` line.

## Directory template

```
src/machines/cm-0XX-slug/
  machine.ts     pure logic: state machines, data, transforms — unit-tested
  Machine.tsx    the interactive component (default export)
  content.ts     textual apparatus sections 03–08 (Partial<TextualApparatus>)
  <slug>.css     machine styling, namespaced by .<slug> classes
```

Minimal `machine.ts` skeleton:

```ts
export interface Phase { /* ... */ }
export const INITIAL: /* ... */ = {}
export function step(state: State, input: Input): State { /* pure */ }
export const LINES = { /* authored copy */ }
```

Minimal `Machine.tsx` skeleton:

```tsx
import { useMachine } from '@/machines/context'
import { usePressable } from '@/interact/micro'
import { Btn, Microlabel } from '@/shell/ui'
import './slug.css'

export default function Machine() {
  const api = useMachine()
  // ...render the experiment; call api.complete('slug:canonical-event') at the end
}
```

## Registration checklist (one line + one entry)

1. **`src/machines/registry.ts`** — add the `MachineMeta` entry: id, code
   (CM-0XX or MA-0X), title, thinker, kind, zone, status, duration, system
   line, concepts, `primaryWorks` (precise citations only), `componentKey`,
   `audioScene` (add a profile in `src/audio/scenes.ts`), `hidden`,
   `completionEvents`, and `modes` if alternate interpretations exist.
2. **`src/machines/machineComponents.ts`** — add one lazy line:
   ```ts
   'cm-0XX-slug': lazy(() => import('./cm-0XX-slug/Machine')),
   ```
3. **`src/archive/content/index.ts`** — import your `content.ts` and add it to
   `SECTION_FILL` (sections 01–02 and 07 live in the citation drafts at the
   top of that file).
4. **`src/audio/scenes.ts`** — add a `SceneProfile` keyed by your `audioScene`
   (layer gains, machine hum frequency, event intensities).

That is the whole registration. The catalogue, facility map, archive, research
record, and endgame pick the machine up automatically.

## Completion contract

Fire exactly the canonical events declared in your registry entry via
`api.complete('slug:event')`. The frame records the completion, updates the
designation, unlocks contamination effects, and shows the completion banner.
Machines must never write persistence directly.

## Machine API (from `useMachine()`)

| Method | Purpose |
|--------|---------|
| `complete(event)` | fire a canonical completion event |
| `counter(key, n?)` | increment an institutional counter |
| `failure()` | record a failed verification (may provoke the institution) |
| `secret(id, code, classification)` | file an unauthorized procedure (UR-###) |
| `noteMode(modeId)` | mark an interpretation mode as completed |
| `play(name, gain?)` | route a procedural sound to the machine bus |
| `completed` | whether the record already shows a completion |
| `modeId` / `contaminantId` | active interpretation mode / chamber contaminant |

## Contamination and chamber hooks (optional)

- Shell contamination: add an effect definition in
  `src/contamination/definitions.ts` with `sourceMachineId` set to your
  machine; implement its shell manifestation in
  `src/shell/ContaminationLayer.tsx`.
- Chamber hybrid: add a `HybridDef` in `src/machines/chamber.ts`, then branch
  your machine's mechanics on `api.contaminantId` — alter the rules, never
  just the copy.
- Interpretation modes: declare `modes` in the registry, branch on
  `api.modeId`, and change mechanics (not labels) for each reading.

## Rules

- No runtime AI, no network calls, no `Math.random` where a deterministic
  result is philosophically required (seed with a hash instead).
- Primary-text discipline: no fake quotations, no invented terminology, no
  slogan reductions.
- Interaction first: explanatory copy belongs in `content.ts`, not on the
  machine's screen.
- The machine must clean up after itself: timers, rAF loops, listeners,
  canvas contexts (see existing machines for the pattern).
- Accessibility controls never participate in the experiment.
