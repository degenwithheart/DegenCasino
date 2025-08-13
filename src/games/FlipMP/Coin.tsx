import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import React from 'react'
import { Group } from 'three'
import { clamp } from 'three/src/math/MathUtils'
import TEXTURE_HEADS from './heads.png'
import TEXTURE_TAILS from './tails.png'

export { TEXTURE_HEADS, TEXTURE_TAILS }

function CoinModel() {
  const [heads, tails] = useTexture([TEXTURE_HEADS, TEXTURE_TAILS])
  return (
    <>
      {/* Heads */}
      <mesh rotation={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.1, 64]} />
        <meshStandardMaterial map={heads} />
      </mesh>
      {/* Tails (back) */}
      <mesh rotation={[Math.PI, 0, 0]} position={[0, 0, -0.1]}>
        <cylinderGeometry args={[1, 1, 0.1, 64]} />
        <meshStandardMaterial map={tails} />
      </mesh>
      {/* Edge */}
      <mesh>
        <torusGeometry args={[1, 0.05, 8, 64]} />
        <meshStandardMaterial color={'#999'} />
      </mesh>
    </>
  )
}

export const Coin: React.FC<{ flipping: boolean; targetSide: 'heads' | 'tails' | null }> = ({ flipping, targetSide }) => {
  const group = React.useRef<Group>(null!)
  const target = React.useRef(0)
  const [isFlipping, setIsFlipping] = React.useState(false)

  React.useEffect(() => {
    if (flipping) {
      setIsFlipping(true)
    } else if (targetSide) {
      // Stop soon after target is known
      setTimeout(() => setIsFlipping(false), 500)
    }
  }, [flipping, targetSide])

  useFrame((_, dt) => {
    if (!group.current) return
    // Spin on Y a bit
    group.current.rotation.y += dt * 2
    // Flip on X while flipping
    if (isFlipping) {
      group.current.rotation.x += dt * 10
    } else if (targetSide) {
      // Ease to target orientation
      target.current = targetSide === 'heads' ? 0 : Math.PI
      group.current.rotation.x += clamp((target.current - group.current.rotation.x) * 10 * dt, -0.2, 0.2)
    }
    const s = isFlipping ? 1.2 : 1
    group.current.scale.x += (s - group.current.scale.x) * 0.15
    group.current.scale.y += (s - group.current.scale.y) * 0.15
    group.current.scale.z += (s - group.current.scale.z) * 0.15
  })

  return (
    <group ref={group}>
      <CoinModel />
    </group>
  )
}
