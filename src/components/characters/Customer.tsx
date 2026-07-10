import { useMemo } from 'react'
import { Character, ToonMat } from './Character'
import type { CharacterProps } from './Character'

const TOPS = ['#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']
const BOTTOMS = ['#334155', '#1f2937', '#4b5563', '#3f3f46']
const HAIR = ['#3a2a1a', '#111827', '#6b4423', '#7c2d12']
const SKIN = ['#f2c19a', '#e8b98c', '#d69a6e', '#c68642']

/** A waiting/shopping Customer with random appearance and a shopping basket. */
export function Customer(props: CharacterProps) {
  const look = useMemo(() => {
    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
    return { top: pick(TOPS), bottom: pick(BOTTOMS), hair: pick(HAIR), skin: pick(SKIN) }
  }, [])

  return (
    <Character
      {...props}
      colors={look}
      handProp={
        <group position={[0, 0.86, 0.34]}>
          <mesh>
            <boxGeometry args={[0.34, 0.22, 0.24]} />
            <ToonMat color="#9ca3af" />
          </mesh>
          <mesh position={[0, 0.17, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.12, 0.02, 8, 16, Math.PI]} />
            <ToonMat color="#6b7280" />
          </mesh>
        </group>
      }
    />
  )
}
