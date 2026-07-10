import { Particles } from '../effects'
import { PALETTES } from '../core'

/**
 * Scene 03 — Activación (00:45 → 01:00).
 * The phone releases digital energy; the supermarket dissolves as the camera
 * dives into the device through circuits, data and particle streams.
 */
export default function Scene03Activation() {
  const p = PALETTES.digital
  return (
    <group name="scene03-activation">
      <ambientLight intensity={0.4} color={p.fill} />
      <pointLight position={[0, 0, 4]} intensity={2.5} color={p.accent} />

      {/* Energy core */}
      <mesh>
        <icosahedronGeometry args={[0.8, 2]} />
        <meshStandardMaterial
          color={p.key}
          emissive={p.key}
          emissiveIntensity={2}
          toneMapped={false}
          wireframe
        />
      </mesh>

      <Particles count={800} color={p.fill} spread={14} />
      <Particles count={400} color={p.accent} spread={8} size={0.08} />
    </group>
  )
}
