import type { PerspectiveCamera } from 'three'

/** A cinematic camera keyframe positioned on the master timeline. */
export interface CameraKeyframe {
  /** Time on the master timeline, in seconds. */
  time: number
  position: [number, number, number]
  lookAt: [number, number, number]
}

/**
 * High-level camera choreography for the 120s experience. Positions are
 * placeholders to be refined per scene; the master timeline interpolates
 * between them (see MasterTimeline).
 */
export const CAMERA_PATH: readonly CameraKeyframe[] = [
  { time: 0, position: [0, 3, 14], lookAt: [0, 1, 0] }, // Chaos: wide travelling
  { time: 15, position: [4, 2.5, 9], lookAt: [0, 1, 0] }, // Chaos: follow manager
  { time: 30, position: [2, 2, 6], lookAt: [0, 1.4, 0] }, // Freeze
  { time: 45, position: [0, 1.6, 3], lookAt: [0, 1.6, -2] }, // Activation: into phone
  { time: 60, position: [0, 2, 10], lookAt: [0, 0, 0] }, // Data World
  { time: 85, position: [0, 4, 12], lookAt: [0, 0, 0] }, // Optimization
  { time: 105, position: [0, 2.5, 11], lookAt: [0, 1, 0] }, // Return
  { time: 118, position: [0, 0, 6], lookAt: [0, 0, 0] }, // Outro
] as const

/** Snap a camera to a keyframe (used for seeking / debugging). */
export function applyKeyframe(camera: PerspectiveCamera, kf: CameraKeyframe): void {
  camera.position.set(kf.position[0], kf.position[1], kf.position[2])
  camera.lookAt(kf.lookAt[0], kf.lookAt[1], kf.lookAt[2])
}
