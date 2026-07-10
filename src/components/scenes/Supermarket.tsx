/**
 * Scene 1 — Supermarket (0s → 45s).
 *
 * Opening act: the user enters the Check-Out Pro world through a stylized
 * supermarket aisle. This is a skeleton R3F scene rendered inside the app
 * <Canvas>; swap the placeholder geometry for the aisle/product models loaded
 * from /src/assets/models as the choreography is built out.
 */
export function Supermarket() {
  return (
    <group name="supermarket-scene">
      <ambientLight intensity={0.7} />
      <spotLight position={[6, 8, 4]} angle={0.4} penumbra={0.6} intensity={1.2} castShadow />

      {/* Placeholder "checkout counter" block */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[3, 1, 1.4]} />
        <meshStandardMaterial color="#aa3bff" metalness={0.2} roughness={0.4} />
      </mesh>

      {/* Placeholder floor */}
      <mesh position={[0, -0.75, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#0e0e1c" />
      </mesh>
    </group>
  )
}
