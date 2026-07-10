import type { ScenePhase, WorldKey } from './experience.config'
import { segmentForTime } from './experience.config'

/** A world's color palette, used for background + lighting per the spec. */
export interface WorldPalette {
  background: string
  key: string
  fill: string
  accent: string
}

/**
 * Palettes per the Cinematic Bible:
 *  - real:      warm whites / soft yellows / beige (routine, fatigue)
 *  - digital:   electric blue / cyan / violet (intelligence, future)
 *  - optimized: success green / premium gold / clean white (results)
 */
export const PALETTES: Record<WorldKey, WorldPalette> = {
  real: { background: '#f4ecdd', key: '#fff3d6', fill: '#e8dcc4', accent: '#d9b382' },
  digital: { background: '#050816', key: '#3b82f6', fill: '#22d3ee', accent: '#7c3aed' },
  optimized: { background: '#04120b', key: '#22c55e', fill: '#ffffff', accent: '#d4af37' },
  // brand: deep royal blue backdrop with clean white content (Outro).
  brand: { background: '#0a1f6b', key: '#ffffff', fill: '#dbe4ff', accent: '#5b8bff' },
}

export function paletteForWorld(world: WorldKey): WorldPalette {
  return PALETTES[world]
}

export function paletteForPhase(phase: ScenePhase): WorldPalette {
  const segment = SEGMENT_BY_PHASE[phase]
  return PALETTES[segment]
}

/** Precomputed phase → world lookup. */
const SEGMENT_BY_PHASE: Record<ScenePhase, WorldKey> = {
  chaos: 'real',
  freeze: 'real',
  activation: 'digital',
  dataworld: 'digital',
  optimization: 'optimized',
  return: 'optimized',
  outro: 'brand',
}

/** Convenience: palette directly from elapsed time. */
export function paletteForTime(seconds: number): WorldPalette {
  return PALETTES[segmentForTime(seconds).world]
}
