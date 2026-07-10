import { useMemo } from 'react'

export interface ParticlesProps {
  count?: number
  color?: string
  size?: number
  /** Cube half-extent the particles are scattered within. */
  spread?: number
}

/**
 * Lightweight GPU point cloud used for digital energy, data flow and the
 * golden outro particles. Positions are generated once and reused.
 */
export function Particles({
  count = 500,
  color = '#22d3ee',
  size = 0.05,
  spread = 10,
}: ParticlesProps) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < arr.length; i++) {
      arr[i] = (Math.random() - 0.5) * spread * 2
    }
    return arr
  }, [count, spread])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        sizeAttenuation
        transparent
        depthWrite={false}
      />
    </points>
  )
}
