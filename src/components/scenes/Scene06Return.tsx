import { Particles } from '../effects'
import { PALETTES } from '../core'

/**
 * Scene 06 — Retorno (01:45 → 01:55).
 * The now-perfect store is carried by the cinematic backdrop (bright, green/
 * gold grading). Here we add gentle gold/green sparkle for a success feel.
 */
export default function Scene06Return() {
  const p = PALETTES.optimized
  return (
    <group name="scene06-return">
      <ambientLight intensity={0.7} color={p.fill} />
      <Particles count={160} color={p.accent} spread={16} size={0.04} />
    </group>
  )
}
