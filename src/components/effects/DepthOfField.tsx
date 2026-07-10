import { DepthOfField } from '@react-three/postprocessing'

/**
 * Cinematic depth of field for focus pulls. Must be rendered inside an
 * <EffectComposer>.
 */
export function SceneDepthOfField() {
  return <DepthOfField focusDistance={0.02} focalLength={0.05} bokehScale={2.5} />
}
