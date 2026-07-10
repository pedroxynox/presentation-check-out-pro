import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { Manager, Cashier, Customer } from '../characters'
import { PALETTES, masterTimeline } from '../core'
import { clamp, mapRange } from '../../utils'

/** Negative KPI marker: a red panel with a downward arrow, floating above a queue. */
function NegativeIndicator({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[1.1, 0.7, 0.08]} />
        <meshStandardMaterial color="#7f1d1d" emissive="#ef4444" emissiveIntensity={0.6} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.55, 0.05]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.28, 0.45, 4]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.9} toneMapped={false} />
      </mesh>
    </group>
  )
}

/** A supermarket shelf (aisle) made of stacked toon boxes. */
function Shelf({ position }: { position: [number, number, number] }) {
  const p = PALETTES.real
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.6, 0]}>
        <boxGeometry args={[3.2, 1.2, 0.8]} />
        <meshToonMaterial color={p.accent} />
      </mesh>
      <mesh castShadow position={[0, 1.5, 0]}>
        <boxGeometry args={[3.2, 0.5, 0.8]} />
        <meshToonMaterial color="#c98f5a" />
      </mesh>
    </group>
  )
}

/**
 * Scene 01 — El Caos (00:00 → 00:30).
 *
 * Cartoon-premium supermarket at peak stress: long queues, saturated cashiers,
 * waiting customers and floating negative indicators. Warm "real world"
 * palette. The manager walks in (worried) during the follow phase (15s→30s).
 * All motion is sampled from the single GSAP master clock — no side timelines.
 */
export default function Scene01Chaos() {
  const p = PALETTES.real
  const managerRef = useRef<Group>(null)
  const indicatorsRef = useRef<Group>(null)
  const crowdRef = useRef<Group>(null)

  // Queue layout: a long line of customers waiting at the open checkout.
  const queue = useMemo(
    () => Array.from({ length: 6 }, (_, i) => [-1.4, 0, 1.6 + i * 1.15] as [number, number, number]),
    [],
  )

  useFrame(() => {
    const t = masterTimeline.elapsed

    // Manager walks in during the follow phase (15s → 30s), looking worried.
    if (managerRef.current) {
      const w = clamp(mapRange(t, 15, 30, 0, 1), 0, 1)
      managerRef.current.position.x = mapRange(w, 0, 1, 5.5, 1.2)
      managerRef.current.position.z = mapRange(w, 0, 1, 5.5, 2.2)
      // subtle worried head-shake / body sway
      managerRef.current.rotation.y = Math.sin(t * 1.5) * 0.12 - w * 0.4
    }

    // Negative indicators bob nervously.
    if (indicatorsRef.current) {
      indicatorsRef.current.children.forEach((child, i) => {
        child.position.y = 2.8 + Math.sin(t * 2.2 + i * 1.3) * 0.16
        child.rotation.z = Math.sin(t * 1.7 + i) * 0.05
      })
    }

    // Impatient crowd fidget.
    if (crowdRef.current) {
      crowdRef.current.children.forEach((child, i) => {
        child.position.x = Math.sin(t * 3 + i * 0.9) * 0.06
      })
    }
  })

  return (
    <group name="scene01-chaos">
      {/* Warm commercial lighting */}
      <hemisphereLight args={[p.key, p.background, 0.6]} />
      <ambientLight intensity={0.5} color={p.fill} />
      <directionalLight position={[6, 10, 4]} intensity={1.2} color={p.key} castShadow />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshToonMaterial color={p.background} />
      </mesh>

      {/* Aisles / shelves in the back */}
      <Shelf position={[-4, 0, -4]} />
      <Shelf position={[0, 0, -4]} />
      <Shelf position={[4, 0, -4]} />

      {/* Checkout counter (single open lane -> long queue) */}
      <mesh position={[-3, 0.5, 0]} castShadow>
        <boxGeometry args={[2, 1, 1.2]} />
        <meshToonMaterial color="#8a8f98" />
      </mesh>
      <Cashier position={[-3, 0, -0.9]} />

      {/* A second, closed lane (adds to the "saturated" feel) */}
      <mesh position={[3, 0.5, 0]} castShadow>
        <boxGeometry args={[2, 1, 1.2]} />
        <meshToonMaterial color="#6b7280" />
      </mesh>

      {/* Long waiting line */}
      <group ref={crowdRef}>
        {queue.map((pos, i) => (
          <Customer key={i} position={pos} />
        ))}
      </group>

      {/* Worried manager walking in */}
      <group ref={managerRef} position={[5.5, 0, 5.5]}>
        <Manager />
      </group>

      {/* Floating negative indicators over the chaos */}
      <group ref={indicatorsRef}>
        <NegativeIndicator position={[-1.4, 2.8, 3]} />
        <NegativeIndicator position={[1, 2.8, 1]} />
        <NegativeIndicator position={[3, 2.8, -1]} />
      </group>
    </group>
  )
}
