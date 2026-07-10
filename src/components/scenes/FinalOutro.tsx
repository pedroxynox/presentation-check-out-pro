/**
 * Scene 3 — Final Outro (95s → 120s).
 *
 * Closing act: the world resolves into the Check-Out Pro brand moment / CTA.
 * Rendered inside the <Canvas>; the accompanying DOM call-to-action lives in
 * the framer-motion HUD overlay. Replace the placeholder with the final
 * brand geometry and logo reveal.
 */
export function FinalOutro() {
  return (
    <group name="final-outro-scene">
      <ambientLight intensity={0.9} />
      <pointLight position={[0, 3, 5]} intensity={1.4} color="#ffb347" />

      {/* Placeholder rotating brand marker */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <torusKnotGeometry args={[1, 0.32, 128, 24]} />
        <meshStandardMaterial color="#ffb347" metalness={0.6} roughness={0.2} />
      </mesh>
    </group>
  )
}
