import { useFrame } from '@react-three/fiber'
import React from 'react'

/** Placeholder effect – you can keep your original particle effects if desired */
export default function Effect() {
  const ref = React.useRef<any>(null)
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.z += 0.002
    }
  })
  return <group ref={ref} />
}
