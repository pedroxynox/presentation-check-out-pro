import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import type { Group, Points } from 'three'
import { PALETTES, masterTimeline } from '../core'
import { clamp, lerp, mapRange } from '../../utils'

const P = PALETTES.brand
const WHITE = '#ffffff'
const TILE_BLUE = '#1d4ed8'

const backOut = (x: number): number => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

/** One rounded stroke segment (cylinder) between two 2D points. */
function Stroke({ a, b, radius = 0.15, z = 0.2 }: { a: [number, number]; b: [number, number]; radius?: number; z?: number }) {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const len = Math.hypot(dx, dy)
  const angle = Math.atan2(dy, dx)
  return (
    <mesh position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, z]} rotation={[0, 0, angle - Math.PI / 2]}>
      <cylinderGeometry args={[radius, radius, len, 16]} />
      <meshStandardMaterial color={WHITE} emissive={WHITE} emissiveIntensity={0.6} toneMapped={false} />
    </mesh>
  )
}

/**
 * Check-Out Pro logo reconstructed as vector 3D: the open "C" arc + the
 * upward trend arrow with its node dot. White marks on a royal-blue tile.
 */
function CheckOutProLogo() {
  // Arrow path (logo local space).
  const p0: [number, number] = [-0.55, -0.45]
  const p1: [number, number] = [0.15, 0.15]
  const p2: [number, number] = [0.6, -0.05]
  const p3: [number, number] = [1.6, 0.95]
  const headAngle = Math.atan2(p3[1] - p2[1], p3[0] - p2[0])

  return (
    <group>
      {/* App-icon tile */}
      <RoundedBox args={[4.8, 4.8, 0.5]} radius={0.55} smoothness={4} position={[0, 0, -0.3]}>
        <meshStandardMaterial color={TILE_BLUE} emissive={TILE_BLUE} emissiveIntensity={0.15} metalness={0.2} roughness={0.5} />
      </RoundedBox>

      {/* Open "C" arc (gap on the right) */}
      <mesh rotation={[0, 0, Math.PI / 4]} position={[0, 0, 0.08]}>
        <torusGeometry args={[1.85, 0.28, 20, 64, Math.PI * 1.5]} />
        <meshStandardMaterial color={WHITE} emissive={WHITE} emissiveIntensity={0.6} toneMapped={false} />
      </mesh>

      {/* Upward trend arrow */}
      <Stroke a={p0} b={p1} />
      <Stroke a={p1} b={p2} />
      <Stroke a={p2} b={p3} />
      {/* Node dot */}
      <mesh position={[p0[0], p0[1], 0.2]}>
        <sphereGeometry args={[0.22, 20, 20]} />
        <meshStandardMaterial color={WHITE} emissive={WHITE} emissiveIntensity={0.6} toneMapped={false} />
      </mesh>
      {/* Arrowhead */}
      <mesh position={[p3[0], p3[1], 0.2]} rotation={[0, 0, headAngle - Math.PI / 2]}>
        <coneGeometry args={[0.34, 0.6, 20]} />
        <meshStandardMaterial color={WHITE} emissive={WHITE} emissiveIntensity={0.6} toneMapped={false} />
      </mesh>
    </group>
  )
}

/** White particles that collapse inward to "crystallize" the logo. */
function CrystallizingParticles() {
  const pointsRef = useRef<Points>(null)
  const count = 700

  const { starts, targets, positions } = useMemo(() => {
    const starts = new Float32Array(count * 3)
    const targets = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      starts[i * 3] = (Math.random() - 0.5) * 34
      starts[i * 3 + 1] = (Math.random() - 0.5) * 24
      starts[i * 3 + 2] = (Math.random() - 0.5) * 22
      const a = Math.random() * Math.PI * 2
      const r = 1 + Math.random() * 2.6
      targets[i * 3] = Math.cos(a) * r
      targets[i * 3 + 1] = Math.sin(a) * r
      targets[i * 3 + 2] = (Math.random() - 0.5) * 1.2
    }
    return { starts, targets, positions: new Float32Array(starts) }
  }, [])

  useFrame(() => {
    const t = masterTimeline.elapsed
    const k = clamp(mapRange(t, 115, 117.6, 0, 1), 0, 1)
    const e = 1 - Math.pow(1 - k, 3)
    const geo = pointsRef.current?.geometry
    if (!geo) return
    const attr = geo.getAttribute('position')
    const arr = attr.array as Float32Array
    for (let i = 0; i < count * 3; i++) arr[i] = lerp(starts[i], targets[i], e)
    attr.needsUpdate = true
    const mat = pointsRef.current
    if (mat) mat.visible = k < 0.995 // fade out once crystallized
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color={P.fill} sizeAttenuation transparent depthWrite={false} />
    </points>
  )
}

/**
 * Scene 07 — Outro (01:55 → 02:00).
 *
 * Deep royal-blue field, white particles crystallize the Check-Out Pro logo
 * (molecular reconstruction), then it locks in with a settle. Tagline is
 * revealed by the HUD overlay. Motion sampled from the master clock.
 */
export default function Scene07Outro() {
  const logoRef = useRef<Group>(null)

  useFrame(() => {
    const t = masterTimeline.elapsed
    const appear = clamp(mapRange(t, 115.4, 118, 0, 1), 0, 1)
    if (logoRef.current) {
      logoRef.current.scale.setScalar(Math.max(0.001, backOut(appear)))
      logoRef.current.rotation.z = (1 - appear) * -0.6
      logoRef.current.position.y = 0.3 + Math.sin(t * 1.2) * 0.03
    }
  })

  return (
    <group name="scene07-outro">
      <color attach="background" args={['#0a1f6b']} />
      <ambientLight intensity={0.9} color={P.fill} />
      <directionalLight position={[3, 5, 6]} intensity={1.1} color={WHITE} />
      <pointLight position={[0, 0, 6]} intensity={1.6} color={P.accent} distance={30} />

      <CrystallizingParticles />

      <group ref={logoRef} position={[0, 0.3, 0]}>
        <CheckOutProLogo />
      </group>
    </group>
  )
}
