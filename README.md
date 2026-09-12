# CONCEPTUAL MACHINES LAB

### Institute for Applied Metaphysics

A browser-based installation in which philosophical problems are instantiated as
experimental apparatuses. Philosophy as executable conceptual machinery — not
content, not a quiz, not a course.

**Status:** Phase 0 (foundation) complete. Apparatus wings are under calibration.

## Development

```bash
npm install
npm run dev        # local development
npm run build      # production build (dist/)
npm run preview    # serve the production build
npm run typecheck  # tsc -b
npm run lint       # eslint
npm test           # vitest
```

## Constraints

- No runtime LLM / generative AI / cloud inference — everything is authored,
  procedural, deterministic, and local.
- Deployable as a static site.

## Project documents

- `PROMPT-1.md` — founding specification
- `PROMPT-2.md` — second-pass specification
