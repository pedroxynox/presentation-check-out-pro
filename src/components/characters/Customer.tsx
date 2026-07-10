import type { CharacterProps } from './Manager'

/** A waiting Customer. Toon-shaded placeholder. */
export function Customer({ position = [0, 0, 0] }: CharacterProps) {
  return (
    <group position={position} name="customer">
      <mesh castShadow position={[0, 0.8, 0]}>
        <capsuleGeometry args={[0.3, 0.75, 8, 16]} />
        <meshToonMaterial color="#f59e0b" />
      </mesh>
      <mesh castShadow position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.27, 24, 24]} />
        <meshToonMaterial color="#e8b98c" />
      </mesh>
    </group>
  )
}
