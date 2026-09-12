/**
 * CM-009 — deterministic divergence. No randomizer: every specimen is a
 * pure function of its lineage's parameters and generation count.
 */

export interface SpecimenParams {
  sides: number
  radius: number
  irregularity: number
  rotation: number
  hue: number
  thickness: number
}

export const INITIAL_PARAMS: SpecimenParams = {
  sides: 6,
  radius: 40,
  irregularity: 0.08,
  rotation: 0,
  hue: 42,
  thickness: 1.4,
}

/** deterministic 32-bit hash → [0, 1) */
export function hash01(seed: number): number {
  let h = seed | 0
  h = Math.imul(h ^ (h >>> 16), 2246822507)
  h = Math.imul(h ^ (h >>> 13), 3266489909)
  h ^= h >>> 16
  return (h >>> 0) / 4294967296
}

/** The repetition transform: repeats, never reproduces. Small first. */
export function transform(params: SpecimenParams, seed: number): SpecimenParams {
  const r1 = hash01(seed)
  const r2 = hash01(seed + 1013)
  const r3 = hash01(seed + 7717)
  const r4 = hash01(seed + 3301)
  return {
    sides: Math.max(3, Math.round(params.sides + (r1 > 0.86 ? 1 : r1 < 0.1 ? -1 : 0))),
    radius: clamp(params.radius + (r2 - 0.42) * 9, 18, 66),
    irregularity: clamp(params.irregularity + (r3 - 0.5) * 0.06, 0.01, 0.62),
    rotation: (params.rotation + r4 * 61) % 360,
    hue: (params.hue + (r1 - 0.5) * 26 + 360) % 360,
    thickness: clamp(params.thickness + (r2 - 0.5) * 0.3, 0.6, 3.4),
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export interface GenealogyNode {
  id: number
  parentId: number | null
  generation: number
  params: SpecimenParams
}

/** Statistical identity: how much a lineage still agrees with itself. */
export function identityScore(nodes: GenealogyNode[]): number {
  if (nodes.length < 2) return 1
  let total = 0
  for (const key of ['radius', 'irregularity', 'hue', 'sides'] as const) {
    const values = nodes.map((n) => n.params[key])
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length
    const scale = key === 'hue' ? 360 : key === 'sides' ? 8 : key === 'radius' ? 66 : 0.62
    total += Math.sqrt(variance) / scale
  }
  return clamp(1 - total / 1.2, 0, 1)
}

export const LINEAGE_NAMES = [
  'THE SMOOTH',
  'THE JAGGED',
  'THE SLOW RED',
  'THE MANY-SIDED',
  'THE FAINT',
  'THE STUBBORN',
]

export function lineageName(nodes: GenealogyNode[]): string {
  if (nodes.length === 0) return LINEAGE_NAMES[0]
  const meanHue = nodes.reduce((a, n) => a + n.params.hue, 0) / nodes.length
  const meanSides = nodes.reduce((a, n) => a + n.params.sides, 0) / nodes.length
  const meanIrr = nodes.reduce((a, n) => a + n.params.irregularity, 0) / nodes.length
  if (meanIrr < 0.12) return LINEAGE_NAMES[0]
  if (meanIrr > 0.4) return LINEAGE_NAMES[1]
  if (meanHue < 30 || meanHue > 330) return LINEAGE_NAMES[2]
  if (meanSides >= 7) return LINEAGE_NAMES[3]
  if (meanSides <= 4) return LINEAGE_NAMES[5]
  return LINEAGE_NAMES[4]
}

export const GENERATIONS_FOR_COMPLETION = 24

export const LINES = {
  repeat: 'REPEAT',
  noReproduction: 'THE ACTION IS CALLED REPETITION. THE RESULT IS CALLED A DIFFERENT OBJECT. THIS IS NOT A CONTRADICTION.',
  resemblance: 'TWO OF THESE NOW RESEMBLE EACH OTHER. THE RESEMBLANCE WAS NOT VISIBLE WHERE THEY DIVERGED.',
  identityProvisional: 'IDENTITY ACROSS THE LINEAGE IS NOW A STATISTICAL RESIDUE. PROVISIONAL.',
  genealogyEmerged: 'THE GENEALOGY HAS EMERGED.',
}
