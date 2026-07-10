import { Character, ToonMat } from './Character'
import type { CharacterProps } from './Character'

/** A checkout Cashier: uniform shirt, apron and a red cap with a visor. */
export function Cashier(props: CharacterProps) {
  return (
    <Character
      {...props}
      colors={{ top: '#0ea5e9', bottom: '#334155', hair: '#4a3527', skin: '#e8b98c' }}
      torsoProp={
        <mesh position={[0, 1.02, 0.17]}>
          <boxGeometry args={[0.5, 0.5, 0.02]} />
          <ToonMat color="#f1f5f9" />
        </mesh>
      }
      headProp={
        <group position={[0, 0.16, 0]}>
          {/* Cap dome */}
          <mesh scale={[1.02, 0.55, 1.02]}>
            <sphereGeometry args={[0.27, 18, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <ToonMat color="#dc2626" />
          </mesh>
          {/* Visor */}
          <mesh position={[0, -0.01, 0.25]} rotation={[-0.35, 0, 0]}>
            <boxGeometry args={[0.34, 0.03, 0.18]} />
            <ToonMat color="#b91c1c" />
          </mesh>
        </group>
      }
    />
  )
}
