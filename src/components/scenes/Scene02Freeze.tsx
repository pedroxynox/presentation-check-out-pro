import { Particles } from '../effects'
import { PALETTES } from '../core'

/**
 * Scene 02 — Congelación (00:30 → 00:45).
 * The frozen, blue-graded store is carried by the cinematic backdrop; the
 * CHECK-OUT PRO title is revealed by the HUD overlay. Here we add halted,
 * suspended cold particles for the "time-stopped" feel.
 */
export default function Scene02Freeze() {
  const p = PALETTES.digital
  return (
    <group name="scene02-freeze">
      <ambientLight intensity={0.5} color={p.fill} />
      <Particles count={200} color={p.fill} spread={14} size={0.04} />
    </group>
  )
}
