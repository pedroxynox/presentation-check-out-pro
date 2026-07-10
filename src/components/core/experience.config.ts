/**
 * Master configuration for the 120-second Check-Out Pro cinematic experience.
 * A single GSAP master timeline drives all 7 scenes; each scene owns a segment.
 */

export const EXPERIENCE_DURATION = 120 // seconds (hard requirement, ±250ms)

export type ScenePhase =
  | 'chaos'
  | 'freeze'
  | 'activation'
  | 'dataworld'
  | 'optimization'
  | 'return'
  | 'outro'

/** Which visual "world" a phase belongs to (drives palette/lighting). */
export type WorldKey = 'real' | 'digital' | 'optimized'

export interface SceneSegment {
  id: number
  phase: ScenePhase
  world: WorldKey
  /** Start time on the master timeline, in seconds. */
  start: number
  /** End time on the master timeline, in seconds. */
  end: number
  label: string
}

export const SCENE_SEGMENTS: readonly SceneSegment[] = [
  { id: 1, phase: 'chaos', world: 'real', start: 0, end: 30, label: 'El Caos' },
  { id: 2, phase: 'freeze', world: 'real', start: 30, end: 45, label: 'Congelación' },
  { id: 3, phase: 'activation', world: 'digital', start: 45, end: 60, label: 'Activación' },
  { id: 4, phase: 'dataworld', world: 'digital', start: 60, end: 85, label: 'Data World' },
  { id: 5, phase: 'optimization', world: 'optimized', start: 85, end: 105, label: 'Optimización' },
  { id: 6, phase: 'return', world: 'optimized', start: 105, end: 115, label: 'Retorno' },
  { id: 7, phase: 'outro', world: 'optimized', start: 115, end: EXPERIENCE_DURATION, label: 'Outro' },
] as const

const FALLBACK: SceneSegment = SCENE_SEGMENTS[SCENE_SEGMENTS.length - 1]

/** Resolve the active segment for a given elapsed time (seconds). */
export function segmentForTime(seconds: number): SceneSegment {
  return SCENE_SEGMENTS.find((s) => seconds >= s.start && seconds < s.end) ?? FALLBACK
}

/** Resolve the active phase for a given elapsed time (seconds). */
export function phaseForTime(seconds: number): ScenePhase {
  return segmentForTime(seconds).phase
}
