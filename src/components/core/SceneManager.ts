import { segmentForTime } from './experience.config'
import type { SceneSegment } from './experience.config'

/**
 * Scene resolution helpers built on top of the segment map. Keeps scene
 * math in one place so hooks/components stay declarative.
 */

/** Normalized progress [0,1] within the currently active segment. */
export function localProgress(seconds: number, segment: SceneSegment): number {
  const span = segment.end - segment.start
  if (span <= 0) return 0
  const p = (seconds - segment.start) / span
  return Math.min(1, Math.max(0, p))
}

/** Resolve segment + local progress in one call. */
export function resolveScene(seconds: number): { segment: SceneSegment; progress: number } {
  const segment = segmentForTime(seconds)
  return { segment, progress: localProgress(seconds, segment) }
}
