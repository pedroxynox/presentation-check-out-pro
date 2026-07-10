import { Particles } from '../effects'
import { PALETTES } from '../core'

/**
 * Scene 01 — El Caos (00:00 → 00:30).
 * The chaotic, saturated store is carried by the cinematic backdrop image.
 * Here we only add subtle warm atmospheric dust for depth.
 */
export default function Scene01Chaos() {
  const p = PALETTES.real
  return (
    <group name="scene01-chaos">
      <ambientLight intensity={0.6} />
      <Particles count={140} color={p.accent} spread={16} size={0.03} />
    </group>
  )
}
