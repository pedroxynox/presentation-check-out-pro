import { Character, ToonMat } from './Character'
import type { CharacterProps } from './Character'

/**
 * The store Manager — protagonist. Business look (blue shirt, tie) holding a
 * glowing tablet (the Check-Out Pro device).
 */
export function Manager(props: CharacterProps) {
  return (
    <Character
      {...props}
      colors={{ top: '#2563eb', bottom: '#1e293b', hair: '#2b2b2b', skin: '#f2c19a' }}
      torsoProp={
        <mesh position={[0, 1.2, 0.17]}>
          <boxGeometry args={[0.09, 0.36, 0.02]} />
          <ToonMat color="#e11d48" />
        </mesh>
      }
      handProp={
        <mesh position={[0.44, 1.0, 0.28]} rotation={[0.35, -0.2, 0]}>
          <boxGeometry args={[0.26, 0.36, 0.02]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.7} toneMapped={false} />
        </mesh>
      }
    />
  )
}
