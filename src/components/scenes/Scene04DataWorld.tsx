import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Physics, RigidBody } from '@react-three/rapier'
import type { Group, Mesh } from 'three'
import { PALETTES, masterTimeline } from '../core'
import { Particles } from '../effects'
import { clamp, lerp, mapRange } from '../../utils'

const P = PALETTES.digital

/** Simulated musical beat derived from the master clock (until audio lands). */
function beatAt(t: number): number {
  return Math.pow(Math.abs(Math.sin(t * Math.PI * 1.1)), 6)
}

/** Growing bar chart (KPIs improving) with staggered reveal + beat pulse. */
function GrowingBars() {
  const groupRef = useRef<Group>(null)
  const targets = useMemo(() => [1.4, 2.1, 1.7, 2.8, 2.3, 3.2, 3.8], [])

  useFrame(() => {
    const t = masterTimeline.elapsed
    const group = groupRef.current
    if (!group) return
    group.children.forEach((bar, i) => {
      const grow = clamp(mapRange(t, 61 + i * 0.5, 67 + i * 0.5, 0, 1), 0, 1)
      const pulse = 1 + Math.sin(t * 6 + i) * 0.05 + beatAt(t) * 0.12
      const h = Math.max(0.001, targets[i] * grow * pulse)
      bar.scale.y = h
      bar.position.y = h / 2
    })
  })

  return (
    <group ref={groupRef} position={[-4.8, 0, 0.5]}>
      {targets.map((_, i) => (
        <mesh key={i} position={[i * 0.62, 0, 0]}>
          <boxGeometry args={[0.46, 1, 0.46]} />
          <meshStandardMaterial
            color={i === targets.length - 1 ? P.accent : P.fill}
            emissive={i === targets.length - 1 ? P.accent : P.key}
            emissiveIntensity={0.8}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

/** Holographic sales dashboard: panel + rising graph + traveling highlight. */
function SalesDashboard() {
  const rootRef = useRef<Group>(null)
  const dotRef = useRef<Mesh>(null)

  const graph = useMemo(
    () =>
      [
        [-1.4, -0.6],
        [-0.7, -0.25],
        [0, 0.05],
        [0.7, 0.45],
        [1.4, 0.85],
      ] as [number, number][],
    [],
  )

  useFrame(() => {
    const t = masterTimeline.elapsed
    const appear = clamp(mapRange(t, 60, 62.5, 0, 1), 0, 1)
    if (rootRef.current) {
      rootRef.current.scale.setScalar(appear)
      rootRef.current.position.y = 3.2 + Math.sin(t * 1.5) * 0.06
    }
    // Highlight dot travels up the rising graph.
    if (dotRef.current) {
      const f = (t * 0.35) % 1
      const seg = f * (graph.length - 1)
      const i = Math.min(graph.length - 2, Math.floor(seg))
      const local = seg - i
      dotRef.current.position.x = lerp(graph[i][0], graph[i + 1][0], local)
      dotRef.current.position.y = lerp(graph[i][1], graph[i + 1][1], local)
    }
  })

  return (
    <group ref={rootRef} position={[0, 3.2, -2.6]}>
      {/* Panel */}
      <mesh>
        <planeGeometry args={[3.6, 2]} />
        <meshStandardMaterial color={P.accent} emissive={P.accent} emissiveIntensity={0.35} transparent opacity={0.28} toneMapped={false} />
      </mesh>
      {/* Border */}
      <mesh>
        <ringGeometry args={[1.9, 1.95, 4]} />
        <meshBasicMaterial color={P.fill} transparent opacity={0.4} />
      </mesh>
      {/* Grid lines */}
      {[-0.5, 0, 0.5].map((y) => (
        <mesh key={y} position={[0, y, 0.01]}>
          <planeGeometry args={[3.2, 0.012]} />
          <meshBasicMaterial color={P.key} transparent opacity={0.35} />
        </mesh>
      ))}
      {/* Rising graph segments */}
      {graph.slice(0, -1).map((pt, i) => {
        const next = graph[i + 1]
        const dx = next[0] - pt[0]
        const dy = next[1] - pt[1]
        const len = Math.hypot(dx, dy)
        const angle = Math.atan2(dy, dx)
        return (
          <mesh key={i} position={[(pt[0] + next[0]) / 2, (pt[1] + next[1]) / 2, 0.02]} rotation={[0, 0, angle]}>
            <planeGeometry args={[len, 0.05]} />
            <meshBasicMaterial color={P.fill} toneMapped={false} />
          </mesh>
        )
      })}
      {/* Traveling highlight */}
      <mesh ref={dotRef} position={[0, 0, 0.05]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
    </group>
  )
}

/** Connected team network: hub + spokes with energy packets flowing outward. */
function CollaboratorNetwork() {
  const rootRef = useRef<Group>(null)
  const nodesRef = useRef<Group>(null)
  const packetsRef = useRef<Group>(null)

  const spokes = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2
        return { angle: a, length: 1.6 }
      }),
    [],
  )

  useFrame(() => {
    const t = masterTimeline.elapsed
    const appear = clamp(mapRange(t, 63, 65.5, 0, 1), 0, 1)
    if (rootRef.current) {
      rootRef.current.scale.setScalar(appear)
      rootRef.current.rotation.z = Math.sin(t * 0.3) * 0.15
    }
    const pulse = 1 + beatAt(t) * 0.35
    if (nodesRef.current) {
      nodesRef.current.children.forEach((node, i) => {
        node.scale.setScalar(i === 0 ? pulse * 1.1 : 1 + Math.sin(t * 4 + i) * 0.12)
      })
    }
    if (packetsRef.current) {
      packetsRef.current.children.forEach((packet, i) => {
        const s = spokes[i]
        const f = ((t * 0.6) + i * 0.17) % 1
        packet.position.set(Math.cos(s.angle) * s.length * f, Math.sin(s.angle) * s.length * f, 0)
      })
    }
  })

  return (
    <group ref={rootRef} position={[4.7, 2.5, -0.5]}>
      {/* Spokes */}
      {spokes.map((s, i) => (
        <mesh
          key={i}
          position={[Math.cos(s.angle) * s.length * 0.5, Math.sin(s.angle) * s.length * 0.5, 0]}
          rotation={[0, 0, s.angle]}
        >
          <planeGeometry args={[s.length, 0.02]} />
          <meshBasicMaterial color={P.fill} transparent opacity={0.5} toneMapped={false} />
        </mesh>
      ))}
      {/* Nodes: hub + ring of collaborators */}
      <group ref={nodesRef}>
        <mesh>
          <sphereGeometry args={[0.28, 20, 20]} />
          <meshStandardMaterial color={P.accent} emissive={P.accent} emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
        {spokes.map((s, i) => (
          <mesh key={i} position={[Math.cos(s.angle) * s.length, Math.sin(s.angle) * s.length, 0]}>
            <sphereGeometry args={[0.2, 18, 18]} />
            <meshStandardMaterial color={P.key} emissive={P.fill} emissiveIntensity={1} toneMapped={false} />
          </mesh>
        ))}
      </group>
      {/* Energy packets flowing along spokes */}
      <group ref={packetsRef}>
        {spokes.map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/** A self-organizing schedule block driven by rapier physics. */
function ScheduleBlock({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <RigidBody colliders="cuboid" position={position} restitution={0.35} friction={0.6}>
      <mesh castShadow>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshToonMaterial color={color} />
      </mesh>
    </RigidBody>
  )
}

/**
 * Scene 04 — Data World (01:00 → 01:25).
 *
 * Inside the Check-Out Pro OS: everything is alive and reacts to the beat.
 * Growing KPI bars, a holographic sales dashboard, a connected-team network
 * with energy packets, and floating "schedule blocks" that self-organize via
 * rapier physics. Motion is sampled from the single GSAP master clock.
 */
export default function Scene04DataWorld() {
  return (
    <group name="scene04-dataworld">
      <color attach="background" args={['#04102e']} />
      <ambientLight intensity={0.45} color={P.fill} />
      <directionalLight position={[4, 12, 6]} intensity={1} color={P.key} castShadow />
      <pointLight position={[0, 3, 4]} intensity={1.4} color={P.accent} distance={40} />

      {/* Holographic floor grid */}
      <gridHelper args={[50, 50, P.key, '#0b1a3a']} position={[0, 0, 0]} />

      <GrowingBars />
      <SalesDashboard />
      <CollaboratorNetwork />

      {/* Self-organizing schedule blocks (physics) */}
      <Physics gravity={[0, -9.81, 0]}>
        <RigidBody type="fixed" colliders="cuboid" position={[0, -0.25, 1.5]}>
          <mesh receiveShadow>
            <boxGeometry args={[6, 0.5, 4]} />
            <meshStandardMaterial color={P.background} emissive={P.key} emissiveIntensity={0.15} />
          </mesh>
        </RigidBody>
        <ScheduleBlock position={[-0.8, 5, 1.5]} color={P.fill} />
        <ScheduleBlock position={[0.4, 7, 1.2]} color={P.key} />
        <ScheduleBlock position={[1.1, 9, 1.8]} color={P.accent} />
        <ScheduleBlock position={[-0.4, 11, 1.4]} color={P.fill} />
        <ScheduleBlock position={[0.7, 13, 1.6]} color={P.key} />
      </Physics>

      {/* Ambient data particles */}
      <Particles count={800} color={P.fill} spread={18} size={0.04} />
      <Particles count={300} color={P.accent} spread={12} size={0.07} />
    </group>
  )
}
