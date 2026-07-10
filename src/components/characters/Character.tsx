import { useMemo, useRef } from 'react'
import type { ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { masterTimeline } from '../core'
import { toonGradient } from '../../utils/toonGradient'

export interface CharacterColors {
  skin: string
  top: string
  bottom: string
  hair: string
}

export interface CharacterProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  colors?: Partial<CharacterColors>
  /** Held in the right hand (character-local space). */
  handProp?: ReactNode
  /** Attached to the head group (origin at head center). */
  headProp?: ReactNode
  /** Attached over the torso front. */
  torsoProp?: ReactNode
  /** Subtle breathing/idle animation. */
  idle?: boolean
}

const DEFAULT: CharacterColors = {
  skin: '#f2c19a',
  top: '#3b82f6',
  bottom: '#334155',
  hair: '#3a2a1a',
}

/** Cel-shaded toon material shorthand (shares the gradient map). */
export function ToonMat({ color }: { color: string }) {
  return <meshToonMaterial color={color} gradientMap={toonGradient()} />
}

/**
 * Premium cartoon humanoid built from primitives: legs, torso, arms + hands,
 * neck, head with face and hair. Cel-shaded via a toon gradient map. Roles
 * (Manager/Cashier/Customer) reskin it and add props.
 */
export function Character({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  colors,
  handProp,
  headProp,
  torsoProp,
  idle = true,
}: CharacterProps) {
  const c = { ...DEFAULT, ...colors }
  const upperRef = useRef<Group>(null)
  const seed = useMemo(() => Math.random() * 10, [])

  useFrame(() => {
    if (!idle || !upperRef.current) return
    const t = masterTimeline.elapsed + seed
    upperRef.current.position.y = Math.sin(t * 1.6) * 0.02
    upperRef.current.rotation.z = Math.sin(t * 1.1) * 0.01
  })

  return (
    <group position={position} rotation={rotation}>
      {/* Legs (planted) */}
      <mesh position={[-0.14, 0.42, 0]} castShadow>
        <capsuleGeometry args={[0.13, 0.5, 6, 12]} />
        <ToonMat color={c.bottom} />
      </mesh>
      <mesh position={[0.14, 0.42, 0]} castShadow>
        <capsuleGeometry args={[0.13, 0.5, 6, 12]} />
        <ToonMat color={c.bottom} />
      </mesh>

      {/* Upper body (breathes) */}
      <group ref={upperRef}>
        {/* Torso */}
        <mesh position={[0, 1.15, 0]} castShadow>
          <boxGeometry args={[0.56, 0.66, 0.32]} />
          <ToonMat color={c.top} />
        </mesh>
        {torsoProp}

        {/* Arms */}
        <mesh position={[-0.37, 1.12, 0]} rotation={[0, 0, 0.09]} castShadow>
          <capsuleGeometry args={[0.1, 0.5, 6, 12]} />
          <ToonMat color={c.top} />
        </mesh>
        <mesh position={[0.37, 1.12, 0]} rotation={[0, 0, -0.09]} castShadow>
          <capsuleGeometry args={[0.1, 0.5, 6, 12]} />
          <ToonMat color={c.top} />
        </mesh>

        {/* Hands */}
        <mesh position={[-0.41, 0.83, 0.02]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <ToonMat color={c.skin} />
        </mesh>
        <mesh position={[0.41, 0.83, 0.02]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <ToonMat color={c.skin} />
        </mesh>
        {handProp}

        {/* Neck */}
        <mesh position={[0, 1.53, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.12, 12]} />
          <ToonMat color={c.skin} />
        </mesh>

        {/* Head */}
        <group position={[0, 1.79, 0]}>
          <mesh castShadow scale={[1, 1.05, 1]}>
            <sphereGeometry args={[0.27, 24, 24]} />
            <ToonMat color={c.skin} />
          </mesh>
          {/* Eyes */}
          <mesh position={[-0.1, 0.03, 0.235]}>
            <sphereGeometry args={[0.042, 10, 10]} />
            <meshBasicMaterial color="#1f2937" />
          </mesh>
          <mesh position={[0.1, 0.03, 0.235]}>
            <sphereGeometry args={[0.042, 10, 10]} />
            <meshBasicMaterial color="#1f2937" />
          </mesh>
          {/* Hair cap */}
          <mesh position={[0, 0.11, -0.02]} scale={[1.06, 0.72, 1.06]}>
            <sphereGeometry args={[0.27, 20, 20]} />
            <ToonMat color={c.hair} />
          </mesh>
          {headProp}
        </group>
      </group>
    </group>
  )
}
