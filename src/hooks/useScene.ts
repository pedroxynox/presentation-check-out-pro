import { useTimeline } from './useTimeline'
import { localProgress } from '../components/core'
import type { ScenePhase, SceneSegment } from '../components/core'

export interface SceneState {
  phase: ScenePhase
  segment: SceneSegment
  /** Normalized progress [0,1] within the active scene. */
  progress: number
}

/** Derives the active scene + local progress from the master timeline. */
export function useScene(): SceneState {
  const { elapsed, segment } = useTimeline()
  return {
    phase: segment.phase,
    segment,
    progress: localProgress(elapsed, segment),
  }
}
