import { Sparkles } from '@react-three/drei'
import React from 'react'

export function Effect({ color }: { color: string }) {
  return (
    <Sparkles
      count={50}
      scale={[4, 4, 4]}
      size={3}
      speed={0.4}
      color={color}
      opacity={0.6}
    />
  )
}
