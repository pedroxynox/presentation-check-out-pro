import { PALETTES } from '../../core'

/**
 * Static supermarket environment (floor, aisles/shelves, checkout counters)
 * shared by the Chaos, Freeze and Return scenes. Characters and scene-specific
 * props are composed on top by each scene.
 */
export function SupermarketSet() {
  const p = PALETTES.real
  return (
    <group name="supermarket-set">
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshToonMaterial color={p.background} />
      </mesh>

      {/* Aisles / shelves in the back */}
      {[-4, 0, 4].map((x) => (
        <group key={x} position={[x, 0, -4]}>
          <mesh castShadow position={[0, 0.6, 0]}>
            <boxGeometry args={[3.2, 1.2, 0.8]} />
            <meshToonMaterial color={p.accent} />
          </mesh>
          <mesh castShadow position={[0, 1.5, 0]}>
            <boxGeometry args={[3.2, 0.5, 0.8]} />
            <meshToonMaterial color="#c98f5a" />
          </mesh>
        </group>
      ))}

      {/* Checkout counters: one open lane (left), one closed (right) */}
      <mesh position={[-3, 0.5, 0]} castShadow>
        <boxGeometry args={[2, 1, 1.2]} />
        <meshToonMaterial color="#8a8f98" />
      </mesh>
      <mesh position={[3, 0.5, 0]} castShadow>
        <boxGeometry args={[2, 1, 1.2]} />
        <meshToonMaterial color="#6b7280" />
      </mesh>
    </group>
  )
}
