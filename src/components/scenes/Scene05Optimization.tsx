import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { DoubleSide } from 'three'
import type { Group, Mesh, MeshBasicMaterial } from 'three'
import { PALETTES, masterTimeline } from '../core'
import { Particles } from '../effects'
import { clamp, lerp, mapRange } from '../../utils'

const P = PALETTES.optimized

function beatAt(t: number): number {
  return Math.pow(Math.abs(Math.sin(t * Math.PI * 1.1)), 6)
}

const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3)

interface BlockData {
  from: [number, number, number]
  to: [number, number, number]
  stagger: number
  gold: boolean
  spin: number
}

/** Scattered cubes that converge into a perfect organized grid (chaos -> order). */
function ConvergingBlocks() {
  const groupRef = useRef<Group>(null)

  const blocks = useMemo<BlockData[]>(() => {
    const cols = 5
    const rows = 5
    const spacing = 0.94
    const arr: BlockData[] = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c
        arr.push({
          to: [(c - (cols - 1) / 2) * spacing, 2.7 + (r - (rows - 1) / 2) * spacing, 0],
          from: [(Math.random() - 0.5) * 26, (Math.random() - 0.1) * 11, (Math.random() - 0.5) * 18],
          stagger: (r + c) * 0.22,
          gold: idx % 7 === 3,
          spin: Math.random() * Math.PI * 2,
        })
      }
    }
    return arr
  }, [])

  useFrame(() => {
    const t = masterTimeline.elapsed
    const group = groupRef.current
    if (!group) return
    const beat = beatAt(t)
    group.children.forEach((cube, i) => {
      const b = blocks[i]
      const conv = clamp(mapRange(t, 86 + b.stagger, 97 + b.stagger, 0, 1), 0, 1)
      const e = easeOutCubic(conv)
      cube.position.set(
        lerp(b.from[0], b.to[0], e),
        lerp(b.from[1], b.to[1], e),
        lerp(b.from[2], b.to[2], e),
      )
      const spin = (1 - e) * (b.spin + 6)
      cube.rotation.set(spin, spin, 0)
      cube.scale.setScalar((0.35 + 0.65 * e) * (1 + beat * 0.08))
    })
  })

  return (
    <group ref={groupRef}>
      {blocks.map((b, i) => (
        <mesh key={i} castShadow>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshToonMaterial color={b.gold ? P.accent : P.key} />
        </mesh>
      ))}
    </group>
  )
}

/** Gold frame that seals the organized grid at the climax. */
function SuccessFrame() {
  const ref = useRef<Mesh>(null)
  useFrame(() => {
    const t = masterTimeline.elapsed
    const appear = clamp(mapRange(t, 97, 100.5, 0, 1), 0, 1)
    if (ref.current) {
      ref.current.scale.setScalar(appear * (1 + beatAt(t) * 0.03))
      ref.current.rotation.z = t * 0.08
    }
  })
  return (
    <mesh ref={ref} position={[0, 2.7, -0.6]}>
      <torusGeometry args={[3.4, 0.06, 16, 90]} />
      <meshStandardMaterial color={P.accent} emissive={P.accent} emissiveIntensity={1.6} toneMapped={false} />
    </mesh>
  )
}

/** Expanding shockwave rings at the musical peak. */
function Shockwaves() {
  const ref = useRef<Group>(null)
  useFrame(() => {
    const t = masterTimeline.elapsed
    const group = ref.current
    if (!group) return
    group.children.forEach((ring, i) => {
      const period = 4.5
      const phase = t - 97 - i * 2.2
      const f = phase > 0 ? (phase % period) / period : -1
      const scale = 0.5 + Math.max(0, f) * 11
      ring.scale.set(scale, scale, scale)
      const material = (ring as Mesh).material as MeshBasicMaterial
      material.opacity = f >= 0 ? clamp(1 - f, 0, 1) * 0.55 : 0
    })
  })
  return (
    <group ref={ref} position={[0, 2.7, -0.4]}>
      {[0, 1].map((i) => (
        <mesh key={i}>
          <ringGeometry args={[1, 1.07, 72]} />
          <meshBasicMaterial color={P.accent} transparent opacity={0} side={DoubleSide} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

/**
 * Scene 05 — Optimización (01:25 → 01:45).
 *
 * The complete transformation: chaos resolves into order as scattered blocks
 * converge into a perfect grid, a gold success frame seals it, and shockwaves
 * fire at the musical peak. Metrics peak in the HUD overlay. Green / gold /
 * clean-white palette. Motion sampled from the single GSAP master clock.
 */
export default function Scene05Optimization() {
  return (
    <group name="scene05-optimization">
      <ambientLight intensity={0.7} color={P.fill} />
      <directionalLight position={[5, 12, 6]} intensity={1.3} color={P.key} castShadow />
      <pointLight position={[0, 4, 6]} intensity={1.5} color={P.accent} distance={40} />

      {/* Order grid floor */}
      <gridHelper args={[50, 50, P.key, '#0a2a18']} position={[0, 0, 0]} />

      <ConvergingBlocks />
      <SuccessFrame />
      <Shockwaves />

      {/* Resources flowing correctly */}
      <Particles count={700} color={P.key} spread={18} size={0.04} />
      <Particles count={250} color={P.accent} spread={12} size={0.07} />
    </group>
  )
}
