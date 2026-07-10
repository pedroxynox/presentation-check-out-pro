import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { Manager, Cashier, Customer } from '../characters'
import { PALETTES, masterTimeline } from '../core'
import { SupermarketSet } from './shared/SupermarketSet'

const P = PALETTES.optimized

/** Positive KPI marker: a green panel with an upward arrow (callback to Scene 01). */
function PositiveIndicator({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[1.1, 0.7, 0.08]} />
        <meshStandardMaterial color="#14532d" emissive={P.key} emissiveIntensity={0.7} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.55, 0.05]}>
        <coneGeometry args={[0.28, 0.45, 4]} />
        <meshStandardMaterial color={P.key} emissive={P.key} emissiveIntensity={1} toneMapped={false} />
      </mesh>
    </group>
  )
}

/**
 * Scene 06 — Retorno (01:45 → 01:55).
 *
 * The camera leaves the digital universe and returns to the store — now
 * perfectly operational: no queues, no stress, only order. Relaxed shoppers
 * stroll, green "positive" indicators float where the red ones used to be, and
 * bright green/gold/white grading conveys success. Motion sampled from the
 * master clock.
 */
export default function Scene06Return() {
  const shoppersRef = useRef<Group>(null)
  const indicatorsRef = useRef<Group>(null)

  // A few relaxed, spread-out shoppers (no line).
  const shoppers = useMemo(
    () =>
      [
        [-1.5, 0, 2.5],
        [2.2, 0, 3.2],
        [0.4, 0, 4.4],
      ] as [number, number, number][],
    [],
  )

  useFrame(() => {
    const t = masterTimeline.elapsed

    // Calm strolling.
    if (shoppersRef.current) {
      shoppersRef.current.children.forEach((shopper, i) => {
        shopper.position.x = shoppers[i][0] + Math.sin(t * 0.6 + i * 1.7) * 0.4
        shopper.rotation.y = Math.sin(t * 0.6 + i) * 0.3
      })
    }

    // Gentle positive indicator bob.
    if (indicatorsRef.current) {
      indicatorsRef.current.children.forEach((child, i) => {
        child.position.y = 2.7 + Math.sin(t * 1.6 + i * 1.2) * 0.12
      })
    }
  })

  return (
    <group name="scene06-return">
      {/* Bright, clean success grading */}
      <hemisphereLight args={[P.fill, P.background, 0.9]} />
      <ambientLight intensity={0.75} color={P.fill} />
      <directionalLight position={[6, 11, 5]} intensity={1.5} color={P.key} castShadow />
      <pointLight position={[-4, 4, 4]} intensity={1} color={P.accent} distance={30} />

      <SupermarketSet />

      {/* Smoothly working cashier + confident manager */}
      <Cashier position={[-3, 0, -0.9]} />
      <group position={[1.4, 0, 1.4]}>
        <Manager />
      </group>

      {/* Relaxed, spread-out shoppers (no queue) */}
      <group ref={shoppersRef}>
        {shoppers.map((pos, i) => (
          <Customer key={i} position={pos} />
        ))}
      </group>

      {/* Green positive indicators (callback to the red ones in Chaos) */}
      <group ref={indicatorsRef}>
        <PositiveIndicator position={[-1.4, 2.7, 2]} />
        <PositiveIndicator position={[1, 2.7, 0.5]} />
        <PositiveIndicator position={[3, 2.7, -1]} />
      </group>
    </group>
  )
}
