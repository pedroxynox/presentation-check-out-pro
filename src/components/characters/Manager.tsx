export interface CharacterProps {
  position?: [number, number, number]
}

/**
 * The store Manager — protagonist of the narrative. Toon-shaded placeholder
 * (capsule body + sphere head) to be swapped for a rigged GLTF model.
 */
export function Manager({ position = [0, 0, 0] }: CharacterProps) {
  return (
    <group position={position} name="manager">
      <mesh castShadow position={[0, 0.9, 0]}>
        <capsuleGeometry args={[0.35, 0.9, 8, 16]} />
        <meshToonMaterial color="#2563eb" />
      </mesh>
      <mesh castShadow position={[0, 1.75, 0]}>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshToonMaterial color="#f6c89f" />
      </mesh>
    </group>
  )
}
