import { Physics, useBox, usePlane } from '@react-three/cannon'
import type { Mesh } from 'three'

/** A single physics-driven "schedule block" that falls under gravity. */
function ScheduleBlock({ position }: { position: [number, number, number] }) {
  const [ref] = useBox<Mesh>(() => ({ mass: 1, position, args: [1, 1, 1] }))
  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#39ffd0" emissive="#0c4" emissiveIntensity={0.2} />
    </mesh>
  )
}

/** Static ground plane that catches the falling blocks. */
function Ground() {
  const [ref] = usePlane<Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -2, 0],
  }))
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial color="#050510" />
    </mesh>
  )
}

/**
 * Scene 2 — Data World (45s → 95s).
 *
 * The narrative's core: abstract data landscape where the "bloque de horarios"
 * (schedule blocks) drop and stack using the cannon-es physics engine, driven
 * through @react-three/cannon. Placeholder blocks below demonstrate the
 * physics wiring; replace with data-driven bodies as the story develops.
 */
export function DataWorld() {
  return (
    <group name="dataworld-scene">
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 10, 6]} intensity={1.1} castShadow />

      <Physics gravity={[0, -9.81, 0]}>
        <Ground />
        <ScheduleBlock position={[-1.2, 5, 0]} />
        <ScheduleBlock position={[0.3, 7, 0.4]} />
        <ScheduleBlock position={[1.1, 9, -0.3]} />
      </Physics>
    </group>
  )
}
