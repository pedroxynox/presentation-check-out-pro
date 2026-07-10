import { PALETTES } from '../core'

/**
 * Scene 05 — Optimización (01:25 → 01:45).
 * Chaos resolves into order: metrics rise, staff auto-distributes, schedules
 * optimize, resources flow. Music peaks. Success-green / premium-gold palette.
 */
export default function Scene05Optimization() {
  const p = PALETTES.optimized
  const bars = [1.2, 2, 1.6, 2.6, 3.2]
  return (
    <group name="scene05-optimization">
      <ambientLight intensity={0.7} color={p.fill} />
      <directionalLight position={[5, 10, 5]} intensity={1.3} color={p.key} castShadow />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshToonMaterial color={p.background} />
      </mesh>

      {/* Rising metric bars */}
      {bars.map((h, i) => (
        <mesh key={i} position={[(i - 2) * 1.4, h / 2, 0]} castShadow>
          <boxGeometry args={[0.8, h, 0.8]} />
          <meshToonMaterial color={i === bars.length - 1 ? p.accent : p.key} />
        </mesh>
      ))}
    </group>
  )
}
