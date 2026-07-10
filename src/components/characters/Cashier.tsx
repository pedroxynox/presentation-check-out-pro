import type { CharacterProps } from './Manager'

/** A checkout Cashier. Toon-shaded placeholder. */
export function Cashier({ position = [0, 0, 0] }: CharacterProps) {
  return (
    <group position={position} name="cashier">
      <mesh castShadow position={[0, 0.85, 0]}>
        <capsuleGeometry args={[0.32, 0.8, 8, 16]} />
        <meshToonMaterial color="#0ea5e9" />
      </mesh>
      <mesh castShadow position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshToonMaterial color="#f6c89f" />
      </mesh>
    </group>
  )
}
