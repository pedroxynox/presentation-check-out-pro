// Timeline (single GSAP master, singleton)
export { masterTimeline } from './MasterTimeline'
export type { TimeListener } from './MasterTimeline'
export { TimelineProvider, TimelineContext } from './TimelineController'
export type { TimelineContextValue } from './TimelineController'

// Scene resolution
export {
  EXPERIENCE_DURATION,
  SCENE_SEGMENTS,
  segmentForTime,
  phaseForTime,
} from './experience.config'
export type { ScenePhase, WorldKey, SceneSegment } from './experience.config'
export { localProgress, resolveScene } from './SceneManager'

// Camera
export { CameraRig } from './CameraRig'
export { CAMERA_PATH, applyKeyframe } from './CameraManager'
export type { CameraKeyframe } from './CameraManager'

// Lighting / palettes
export {
  PALETTES,
  paletteForWorld,
  paletteForPhase,
  paletteForTime,
} from './LightingManager'
export type { WorldPalette } from './LightingManager'

// Audio
export { AudioManager, audioManager } from './AudioManager'
export type { TrackConfig } from './AudioManager'
