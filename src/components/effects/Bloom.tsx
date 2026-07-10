import { Bloom } from '@react-three/postprocessing'

/**
 * Premium bloom for emissive elements (phone glow, holograms, data world).
 * Must be rendered inside an <EffectComposer>.
 */
export function SceneBloom() {
  return (
    <Bloom
      intensity={0.9}
      luminanceThreshold={0.2}
      luminanceSmoothing={0.9}
      mipmapBlur
    />
  )
}
