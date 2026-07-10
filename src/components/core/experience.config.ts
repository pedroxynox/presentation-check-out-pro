/**
 * Master configuration for the 120-second Check-Out Pro Web Experience.
 *
 * The whole narrative is driven by a single GSAP master timeline whose total
 * length equals EXPERIENCE_DURATION. Each scene owns a segment of that
 * timeline. Scenes read the current phase to mount/unmount their 3D content.
 */

export const EXPERIENCE_DURATION = 120 // seconds

export type ScenePhase = 'supermarket' | 'dataworld' | 'outro'

export interface SceneSegment {
  phase: ScenePhase
  /** Start time within the master timeline, in seconds. */
  start: number
  /** End time within the master timeline, in seconds. */
  end: number
  /** Human-readable label used by the HUD. */
  label: string
}

/**
 * Segment map for the master timeline. Tweak these boundaries as the
 * narrative choreography evolves.
 */
export const SCENE_SEGMENTS: readonly SceneSegment[] = [
  { phase: 'supermarket', start: 0, end: 45, label: 'Supermarket' },
  { phase: 'dataworld', start: 45, end: 95, label: 'Data World' },
  { phase: 'outro', start: 95, end: EXPERIENCE_DURATION, label: 'Final Outro' },
] as const

/** Resolve which scene should be active for a given elapsed time (seconds). */
export function phaseForTime(seconds: number): ScenePhase {
  const segment = SCENE_SEGMENTS.find((s) => seconds >= s.start && seconds < s.end)
  return segment?.phase ?? 'outro'
}
