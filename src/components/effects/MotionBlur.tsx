/**
 * MotionBlur placeholder.
 *
 * postprocessing has no drop-in motion-blur pass, so cinematic motion blur is
 * planned via camera-velocity driven effects in the transition scenes
 * (Activation / Return). Kept as an explicit architectural slot; returns null
 * until the custom pass is wired.
 */
export function MotionBlur() {
  return null
}
