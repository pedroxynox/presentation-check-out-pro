import { Manager, Cashier, Customer } from '../characters'
import { PALETTES } from '../core'

/**
 * Scene 01 — El Caos (00:00 → 00:30).
 * Cartoon-premium supermarket: long lines, saturated staff, waiting customers.
 * Warm "real world" palette. Camera travelling + manager follow (driven by the
 * master timeline).
 */
export default function Scene01Chaos() {
  const p = PALETTES.real
  return (
    <group name="scene01-chaos">
      <ambientLight intensity={0.8} color={p.fill} />
      <directionalLight position={[6, 9, 4]} intensity={1.1} color={p.key} castShadow />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshToonMaterial color={p.background} />
      </mesh>

      {/* Checkout counter */}
      <mesh position={[-3, 0.5, 0]} castShadow>
        <boxGeometry args={[2, 1, 1.2]} />
        <meshToonMaterial color={p.accent} />
      </mesh>

      <Manager position={[3, 0, 2]} />
      <Cashier position={[-3, 0, -0.8]} />

      {/* Waiting line */}
      <Customer position={[-1.5, 0, 1.5]} />
      <Customer position={[-1.5, 0, 3]} />
      <Customer position={[-1.5, 0, 4.5]} />
    </group>
  )
}
