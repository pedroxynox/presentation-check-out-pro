import { Manager, Cashier, Customer } from '../characters'
import { PALETTES } from '../core'

/**
 * Scene 06 — Retorno (01:45 → 01:55).
 * Camera leaves the digital universe back to the store — now perfectly
 * operational. No lines, no stress: order. Green / gold / bright-white grading.
 */
export default function Scene06Return() {
  const p = PALETTES.optimized
  return (
    <group name="scene06-return">
      <ambientLight intensity={0.9} color={p.fill} />
      <directionalLight position={[6, 9, 4]} intensity={1.2} color={p.accent} castShadow />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshToonMaterial color={p.background} />
      </mesh>

      <mesh position={[-3, 0.5, 0]} castShadow>
        <boxGeometry args={[2, 1, 1.2]} />
        <meshToonMaterial color={p.key} />
      </mesh>

      <Manager position={[2.5, 0, 1]} />
      <Cashier position={[-3, 0, -0.8]} />
      <Customer position={[-1.2, 0, 1.5]} />
    </group>
  )
}
