import { Physics, RigidBody } from '@react-three/rapier'
import { Particles } from '../effects'
import { PALETTES } from '../core'

/** A physics-driven data block ("bloque de horarios") that self-organizes. */
function DataBlock({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <RigidBody colliders="cuboid" position={position} restitution={0.3}>
      <mesh castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshToonMaterial color={color} />
      </mesh>
    </RigidBody>
  )
}

/**
 * Scene 04 — Data World (01:00 → 01:25).
 * Inside the Check-Out Pro OS: living dashboards, connected teams and floating
 * blocks that self-organize via rapier physics. Everything reacts to the music.
 */
export default function Scene04DataWorld() {
  const p = PALETTES.digital
  return (
    <group name="scene04-dataworld">
      <ambientLight intensity={0.4} color={p.fill} />
      <directionalLight position={[4, 10, 6]} intensity={1.2} color={p.key} castShadow />

      <Physics gravity={[0, -9.81, 0]}>
        {/* Ground */}
        <RigidBody type="fixed" colliders="cuboid" position={[0, -2, 0]}>
          <mesh receiveShadow>
            <boxGeometry args={[40, 0.5, 40]} />
            <meshStandardMaterial color={p.background} />
          </mesh>
        </RigidBody>

        <DataBlock position={[-1.2, 5, 0]} color={p.fill} />
        <DataBlock position={[0.3, 7, 0.4]} color={p.key} />
        <DataBlock position={[1.1, 9, -0.3]} color={p.accent} />
        <DataBlock position={[-0.6, 11, 0.2]} color={p.fill} />
      </Physics>

      {/* Holographic dashboard */}
      <mesh position={[0, 2, -3]}>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial color={p.accent} emissive={p.accent} emissiveIntensity={0.6} transparent opacity={0.35} />
      </mesh>

      <Particles count={700} color={p.fill} spread={16} />
    </group>
  )
}
