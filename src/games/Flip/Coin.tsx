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
      {/* Heads side */}
      <mesh position-z={0.001}>
        <planeGeometry args={[1.3, 1.3]} />
        <meshStandardMaterial transparent map={heads} />
      </mesh>
      
      {/* Tails side */}
      <group rotation-y={Math.PI}>
        <mesh position-z={0.001}>
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
  enableMotion?: boolean
}

export function Coin({ flipping, result, enableMotion = true }: CoinFlipProps) {
  const group = React.useRef<Group>(null!)
  const target = React.useRef(0)
  const [initialized, setInitialized] = React.useState(false)

  console.log('🪙 FLIP COIN DEBUG:', {
    flipping,
    result,
    enableMotion,
    initialized,
    groupCurrent: !!group.current
  })

  // Initialize the coin properly when ref is ready
  React.useEffect(() => {
    if (group.current && !initialized) {
      console.log('🪙 INITIALIZING COIN:', { result, enableMotion })
      // Always ensure coin is visible and properly positioned
      group.current.scale.setScalar(1)
      group.current.rotation.y = result * Math.PI
      console.log('🪙 COIN INITIALIZED:', {
        scale: group.current.scale.x,
        rotationY: group.current.rotation.y,
        resultExpected: result * Math.PI
      })
      setInitialized(true)
    }
  }, [result, initialized])

  // Handle motion mode changes
  React.useEffect(() => {
    if (group.current && initialized) {
      console.log('🪙 MOTION MODE CHANGE:', { enableMotion, result })
      if (!enableMotion) {
        // For static mode, show final result immediately
        group.current.rotation.y = result * Math.PI
        group.current.scale.setScalar(1)
        console.log('🪙 STATIC MODE SET:', {
          rotationY: group.current.rotation.y,
          scale: group.current.scale.x
        })
      } else {
        // For motion mode, ensure scale is correct
        group.current.scale.setScalar(1)
        console.log('🪙 MOTION MODE SET:', { scale: group.current.scale.x })
      }
    }
  }, [enableMotion, result, initialized])

  React.useEffect(() => {
    if (!flipping && group.current && initialized) {
      const fullTurns = Math.floor(group.current.rotation.y / (Math.PI * 2))
      target.current = (fullTurns + 1) * Math.PI * 2 + result * Math.PI
      console.log('🪙 TARGET SET:', {
        fullTurns,
        targetRotation: target.current,
        currentRotation: group.current.rotation.y
      })
    }
  }, [flipping, result, initialized])

  useFrame((_, dt) => {
    if (!group.current || !initialized) return
    
    // Only animate if motion is enabled
    if (!enableMotion) {
      // Set final position immediately in static mode
      group.current.rotation.y = result * Math.PI
      group.current.scale.setScalar(1)
      return
    }
    
    if (flipping) {
      group.current.rotation.y += 25 * dt
    } else {
      group.current.rotation.y += clamp((target.current - group.current.rotation.y) * 10 * dt, 0, 1)
    }
    const scale = flipping ? 1.25 : 1
    group.current.scale.y += (scale - group.current.scale.y) * .1
    group.current.scale.setScalar(group.current.scale.y)
  })

  console.log('🪙 RENDER COIN:', {
    groupRef: !!group.current,
    initialized,
    scale: group.current?.scale.x || 'no ref',
    rotationY: group.current?.rotation.y || 'no ref'
  })

  return (
    <group ref={group}>
      <CoinModel />
    </group>
  )
}
