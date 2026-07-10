import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, Material, Mesh, PointLight } from 'three'
import { PALETTES, masterTimeline } from '../core'
import { Particles } from '../effects'
import { SupermarketSet } from './shared/SupermarketSet'
import { clamp, mapRange } from '../../utils'

const RING_COUNT = 26
const TUNNEL_SPAN = 64
const RING_COLORS = [PALETTES.digital.key, PALETTES.digital.fill, PALETTES.digital.accent]

/** Warp tunnel of circuit rings rushing toward the camera (the "dive"). */
function DataTunnel() {
  const groupRef = useRef<Group>(null)

  useFrame(() => {
    const t = masterTimeline.elapsed
    const group = groupRef.current
    if (!group) return
    const speed = 7
    group.children.forEach((ring, i) => {
      const raw = ((i / RING_COUNT) * TUNNEL_SPAN + t * speed) % TUNNEL_SPAN
      const z = raw - TUNNEL_SPAN + 14 // travels from ~-50 up past the camera
      ring.position.z = z
      ring.rotation.z = i * 0.4 + t * 0.3
      const s = clamp(mapRange(z, -50, 14, 0.15, 2.4), 0.15, 2.6)
      ring.scale.setScalar(s)
    })
  })

  return (
    <group ref={groupRef} position={[0, 1.6, 0]}>
      {Array.from({ length: RING_COUNT }, (_, i) => (
        <mesh key={i}>
          <torusGeometry args={[3, 0.05, 8, 40]} />
          <meshStandardMaterial
            color={RING_COLORS[i % RING_COLORS.length]}
            emissive={RING_COLORS[i % RING_COLORS.length]}
            emissiveIntensity={1.6}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

/**
 * Scene 03 — Activación (00:45 → 01:00).
 *
 * The phone releases digital energy: particles emerge, the supermarket fades
 * away and the camera dives into the device, flying through circuits, data and
 * connections toward the Data World. Motion sampled from the GSAP master clock.
 */
export default function Scene03Activation() {
  const p = PALETTES.digital
  const worldRef = useRef<Group>(null)
  const coreRef = useRef<Mesh>(null)
  const coreLightRef = useRef<PointLight>(null)

  // Long "data streak" boxes flying alongside the rings for a circuit feel.
  const streaks = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => {
        const angle = (i / 10) * Math.PI * 2
        return {
          x: Math.cos(angle) * 2.4,
          y: 1.6 + Math.sin(angle) * 2.4,
          color: RING_COLORS[i % RING_COLORS.length],
        }
      }),
    [],
  )

  useFrame(() => {
    const t = masterTimeline.elapsed

    // Supermarket dissolves slowly (45s → 49s), then is hidden for perf.
    const fade = clamp(mapRange(t, 45, 49, 1, 0), 0, 1)
    const world = worldRef.current
    if (world) {
      world.visible = fade > 0.02
      if (world.visible) {
        world.traverse((obj) => {
          const mesh = obj as Mesh
          if (mesh.isMesh) {
            const material = mesh.material as Material
            material.transparent = true
            material.opacity = fade
          }
        })
      }
    }

    // Energy core bursts from the phone then expands.
    const grow = clamp(mapRange(t, 45, 52, 0.2, 3.5), 0.2, 3.5)
    if (coreRef.current) {
      coreRef.current.scale.setScalar(grow)
      coreRef.current.rotation.x = t * 0.6
      coreRef.current.rotation.y = t * 0.9
    }
    if (coreLightRef.current) {
      coreLightRef.current.intensity = 2 + Math.sin(t * 8) * 0.8
    }
  })

  return (
    <group name="scene03-activation">
      <color attach="background" args={['#050816']} />
      <ambientLight intensity={0.4} color={p.fill} />
      <pointLight ref={coreLightRef} position={[0, 1.6, 0]} intensity={2.5} color={p.accent} distance={30} />

      {/* Fading real world */}
      <group ref={worldRef}>
        <SupermarketSet />
      </group>

      {/* Energy core released by the phone */}
      <mesh ref={coreRef} position={[0, 1.6, 1]}>
        <icosahedronGeometry args={[0.8, 2]} />
        <meshStandardMaterial
          color={p.key}
          emissive={p.key}
          emissiveIntensity={2}
          toneMapped={false}
          wireframe
        />
      </mesh>

      {/* The dive tunnel */}
      <DataTunnel />

      {/* Circuit data-streaks around the tunnel */}
      {streaks.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, -6]}>
          <boxGeometry args={[0.04, 0.04, 8]} />
          <meshStandardMaterial color={s.color} emissive={s.color} emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
      ))}

      {/* Digital particle streams */}
      <Particles count={900} color={p.fill} spread={16} size={0.05} />
      <Particles count={400} color={p.accent} spread={10} size={0.08} />
    </group>
  )
}
