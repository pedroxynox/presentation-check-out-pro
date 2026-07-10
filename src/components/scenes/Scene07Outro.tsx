import { Particles } from '../effects'
import { PALETTES } from '../core'

/**
 * Scene 07 — Outro (01:55 → 02:00).
 * Black screen, golden particles, the Check-Out Pro logo crystallizes
 * (molecular reconstruction). "GESTIÓN INTELIGENTE" + tagline via HUD.
 * Final sub-boom, absolute fade to silence.
 */
export default function Scene07Outro() {
  const p = PALETTES.optimized
  return (
    <group name="scene07-outro">
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 0, 5]} intensity={2.5} color={p.accent} />

      {/* Crystallizing brand marker (placeholder for logo) */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <torusKnotGeometry args={[1, 0.3, 160, 24]} />
        <meshStandardMaterial
          color={p.accent}
          emissive={p.accent}
          emissiveIntensity={1.4}
          metalness={0.7}
          roughness={0.15}
          toneMapped={false}
        />
      </mesh>

      <Particles count={900} color={p.accent} spread={12} size={0.06} />
    </group>
  )
}
