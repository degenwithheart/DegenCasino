import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import React from 'react'
import { Group } from 'three'
import { clamp } from 'three/src/math/MathUtils'
import TEXTURE_HEADS from '../heads.png'
import TEXTURE_TAILS from '../tails.png'

export { TEXTURE_HEADS, TEXTURE_TAILS }

function CoinModel() {
  const [heads, tails] = useTexture([TEXTURE_HEADS, TEXTURE_TAILS])
  return (
    <>
      {/* Coin edge */}
      <mesh>
        <cylinderGeometry args={[0.65, 0.65, 0.1, 32]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Heads side */}
      <mesh position-z={0.051}>
        <planeGeometry args={[1.3, 1.3]} />
        <meshStandardMaterial transparent map={heads} />
      </mesh>
      
      {/* Tails side */}
      <group rotation-y={Math.PI}>
        <mesh position-z={0.051}>
          <planeGeometry args={[1.3, 1.3]} />
          <meshStandardMaterial transparent map={tails} />
        </mesh>
      </group>
    </>
  )
}

interface CoinFlipProps {
  flipping: boolean
  result: number
}

export function Coin({ flipping, result }: CoinFlipProps) {
  const group = React.useRef<Group>(null!)
  const target = React.useRef(0)

  React.useEffect(() => {
    if (!flipping) {
      const fullTurns = Math.floor(group.current.rotation.y / (Math.PI * 2))
      target.current = (fullTurns + 1) * Math.PI * 2 + result * Math.PI
    }
  }, [flipping, result])

  useFrame(() => {
    if (flipping) {
      group.current.rotation.y += 0.4
      group.current.rotation.x += 0.2
    } else {
      const diff = target.current - group.current.rotation.y
      group.current.rotation.y += diff * 0.1
      group.current.rotation.x = clamp(group.current.rotation.x * 0.95, -0.1, 0.1)
    }
  })

  return (
    <group ref={group}>
      <CoinModel />
    </group>
  )
}
