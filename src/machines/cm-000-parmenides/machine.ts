/**
 * CM-000 — pure motion math. The avatar never moves; the world does.
 */

export interface WorldState {
  /** how far the world has been shifted (the avatar's coordinates do not) */
  offsetX: number
  offsetY: number
  /** authored world tiles for the backdrop */
  seed: number
}

export const INITIAL_WORLD: WorldState = { offsetX: 0, offsetY: 0, seed: 7 }

export const WORLD_STEP = 24

export function stepWorld(world: WorldState, direction: 'up' | 'down' | 'left' | 'right'): WorldState {
  const { offsetX, offsetY, seed } = world
  switch (direction) {
    case 'left':
      return { offsetX: offsetX + WORLD_STEP, offsetY, seed }
    case 'right':
      return { offsetX: offsetX - WORLD_STEP, offsetY, seed }
    case 'up':
      return { offsetX, offsetY: offsetY + WORLD_STEP, seed }
    case 'down':
      return { offsetX, offsetY: offsetY - WORLD_STEP, seed }
  }
}

/** The avatar's coordinates. Invariant. Ontologically. */
export function avatarCoordinates(_world: WorldState): { x: number; y: number } {
  return { x: 0, y: 0 }
}

/** Distance to the exit, computed in world space — it does not close. */
export function exitDistance(world: WorldState): number {
  return Math.hypot(world.offsetX, world.offsetY)
}

export const STEPS_BEFORE_THE_DOOR_RETREATS = 9

export const LINES = {
  instruction: 'MOVE TO THE EXIT.',
  readout: 'SUBJECT COORDINATES',
  doorRetreats: 'THE EXIT IS NOT BEHIND THE DOOR.',
  halfway: 'ZENO UNIT ENGAGED: YOU ARE HALFWAY TO THE EXIT.',
  verdict: [
    'SUBJECT DID NOT MOVE.',
    'THE WORLD DID.',
    'THE RECORD SHOWS: X 0.00 — Y 0.00.',
    'WHAT-IS IS COMPLETE AND IMMOVABLE.',
  ],
  coordinatePiety: 'THE COORDINATES HAVE BEEN CONSULTED THREE TIMES. THEY HAVE NOT CHANGED. THIS IS NOW A RITE.',
}
