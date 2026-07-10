import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color } from 'three'
import type {
  AmbientLight,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PointLight,
} from 'three'
import { Cashier, Customer, Manager } from '../characters'
import { PALETTES, masterTimeline } from '../core'
import { Particles } from '../effects'
import { clamp, mapRange } from '../../utils'
import { SupermarketSet } from './shared/SupermarketSet'

const WARM = new Color(PALETTES.real.key)
const BLUE = new Color(PALETTES.digital.key)
const WARM_AMBIENT = new Color(PALETTES.real.fill)
const BLUE_AMBIENT = new Color(PALETTES.digital.fill)

/**
 * Scene 02 — Congelación (00:30 → 00:45).
 *
 * Absolute silence: the whole store freezes (customers immobile, objects
 * suspended, particles halted — a visual timeScale 0). Lighting morphs from
 * warm commercial to tech-blue. The manager is the only living element: he
 * raises his phone, the screen ignites and bathes his face in blue (bloom).
 * The title "CHECK-OUT PRO / GESTIÓN INTELIGENTE" is revealed by the HUD.
 * All motion is sampled from the single GSAP master clock.
 */
export default function Scene02Freeze() {
  const hemiRef = useRef<HemisphereLight>(null)
  const ambientRef = useRef<AmbientLight>(null)
  const dirRef = useRef<DirectionalLight>(null)
  const faceLightRef = useRef<PointLight>(null)
  const phoneRef = useRef<Group>(null)
  const screenRef = useRef<Mesh>(null)

  // Frozen queue (immobile) — same layout as the chaos scene.
  const queue = useMemo(
    () => Array.from({ length: 6 }, (_, i) => [-1.4, 0, 1.6 + i * 1.15] as [number, number, number]),
    [],
  )

  // Suspended items frozen mid-air.
  const suspended = useMemo(
    () =>
      [
        [-2.2, 1.8, 1.5],
        [1.6, 2.3, 0.2],
        [2.6, 1.4, -1.2],
        [-0.8, 2.6, 2.4],
      ] as [number, number, number][],
    [],
  )

  useFrame(() => {
    const t = masterTimeline.elapsed

    // Warm -> blue lighting morph (31s → 40s).
    const shift = clamp(mapRange(t, 31, 40, 0, 1), 0, 1)
    if (hemiRef.current) hemiRef.current.color.copy(WARM).lerp(BLUE, shift)
    if (ambientRef.current) {
      ambientRef.current.color.copy(WARM_AMBIENT).lerp(BLUE_AMBIENT, shift)
      ambientRef.current.intensity = mapRange(shift, 0, 1, 0.5, 0.2)
    }
    if (dirRef.current) {
      dirRef.current.color.copy(WARM).lerp(BLUE, shift)
      dirRef.current.intensity = mapRange(shift, 0, 1, 1.2, 0.15)
    }

    // Manager raises the phone (32s → 35s).
    const raise = clamp(mapRange(t, 32, 35, 0, 1), 0, 1)
    if (phoneRef.current) {
      phoneRef.current.position.y = mapRange(raise, 0, 1, 0.95, 1.45)
      phoneRef.current.rotation.x = mapRange(raise, 0, 1, 0.8, -0.15)
    }

    // Screen ignites + blue face light ramps (34s → 40s).
    const glow = clamp(mapRange(t, 34, 40, 0, 1), 0, 1)
    if (faceLightRef.current) faceLightRef.current.intensity = glow * 3.5
    if (screenRef.current) {
      const material = screenRef.current.material as MeshStandardMaterial
      material.emissiveIntensity = glow * 4
    }
  })

  return (
    <group name="scene02-freeze">
      <hemisphereLight ref={hemiRef} args={[WARM.getHex(), 0x1a1c22, 0.6]} />
      <ambientLight ref={ambientRef} intensity={0.5} />
      <directionalLight ref={dirRef} position={[6, 10, 4]} intensity={1.2} castShadow />
      {/* Blue light cast by the phone screen onto the manager's face */}
      <pointLight
        ref={faceLightRef}
        position={[0, 1.7, 2.1]}
        color={PALETTES.digital.fill}
        intensity={0}
        distance={7}
      />

      <SupermarketSet />

      {/* Frozen staff + customers */}
      <Cashier position={[-3, 0, -0.9]} />
      {queue.map((pos, i) => (
        <Customer key={i} position={pos} />
      ))}

      {/* Suspended items frozen mid-air */}
      {suspended.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshToonMaterial color={i % 2 === 0 ? '#d9b382' : '#c98f5a'} />
        </mesh>
      ))}

      {/* The only living element: the manager + his phone */}
      <group position={[0, 0, 1.4]}>
        <Manager />
        <group ref={phoneRef} position={[0.28, 0.95, 0.4]} rotation={[0.8, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.3, 0.58, 0.03]} />
            <meshStandardMaterial color="#0b0b12" />
          </mesh>
          <mesh ref={screenRef} position={[0, 0, 0.02]}>
            <planeGeometry args={[0.26, 0.5]} />
            <meshStandardMaterial
              color={PALETTES.digital.fill}
              emissive={PALETTES.digital.fill}
              emissiveIntensity={0}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>

      {/* Halted particles suspended in the air */}
      <Particles count={220} color={PALETTES.digital.fill} spread={12} size={0.04} />
    </group>
  )
}
