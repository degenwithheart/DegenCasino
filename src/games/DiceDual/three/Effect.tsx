import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface EffectProps {
  color: string
}

export function Effect({ color }: EffectProps) {
  const particlesRef = useRef<THREE.Points>(null)

  const particles = useMemo(() => {
    const count = 100
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10

      velocities[i * 3] = (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02
    }

    return { positions, velocities, count }
  }, [])

  useFrame(() => {
    if (!particlesRef.current) return
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < particles.count; i++) {
      positions[i * 3] += particles.velocities[i * 3]
      positions[i * 3 + 1] += particles.velocities[i * 3 + 1]
      positions[i * 3 + 2] += particles.velocities[i * 3 + 2]

      // Reset particles that go too far
      if (Math.abs(positions[i * 3]) > 10 || Math.abs(positions[i * 3 + 1]) > 10) {
        positions[i * 3] = 0
        positions[i * 3 + 1] = 0
        positions[i * 3 + 2] = 0
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color={color} transparent opacity={0.6} />
    </points>
  )
}
