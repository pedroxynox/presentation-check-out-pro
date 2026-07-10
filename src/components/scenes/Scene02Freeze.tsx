import { Manager, Customer } from '../characters'
import { PALETTES } from '../core'

/**
 * Scene 02 — Congelación (00:30 → 00:45).
 * Absolute silence, everything frozen (timeScale 0). Lighting shifts from warm
 * commercial to tech-blue. The manager is the only living element; his phone
 * lights up (emissive + bloom). Title CHECK-OUT PRO / GESTIÓN INTELIGENTE
 * appears via the HUD overlay.
 */
export default function Scene02Freeze() {
  const p = PALETTES.digital
  return (
    <group name="scene02-freeze">
      <ambientLight intensity={0.25} color={p.fill} />
      <pointLight position={[0, 2, 2]} intensity={2} color={p.key} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshToonMaterial color="#1a1c22" />
      </mesh>

      <Manager position={[0, 0, 2]} />
      <Customer position={[-1.5, 0, 3]} />

      {/* Glowing phone in the manager's hands */}
      <mesh position={[0.35, 1.2, 2.5]}>
        <boxGeometry args={[0.25, 0.5, 0.03]} />
        <meshStandardMaterial
          color={p.fill}
          emissive={p.fill}
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}
