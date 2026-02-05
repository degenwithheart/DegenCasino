import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { Dice } from './Dice'

interface DiceGroupProps {
  count: number
  results: number[]
  rolling: boolean
}

export function DiceGroup({ count, results, rolling }: DiceGroupProps) {
  const groupRef = useRef<Group>(null)

  // Removed the rotation animation that was causing visual issues
  // Each die rotates independently in the Dice component

  const spacing = 2.2  // Spacing between dice
  const offset = ((count - 1) * spacing) / 2

  return (
    <group ref={groupRef}>
      {Array.from({ length: count }).map((_, i) => (
        <Dice
          key={i}
          position={[i * spacing - offset, 0, 0]}
          result={results[i] || 1}
          rolling={rolling}
        />
      ))}
    </group>
  )
}