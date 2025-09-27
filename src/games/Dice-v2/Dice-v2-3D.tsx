import { GambaUi } from 'gamba-react-ui-v2'
import React, { Suspense } from 'react'
import styled from 'styled-components'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei'
import { EnhancedWagerInput, MobileControls, DesktopControls } from '../../components'
import { useDiceV2GameLogic } from './sharedLogic'

const Container3D = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(135deg, #0a0511 0%, #1a1a2e 50%, #16213e 100%);
  border-radius: 12px;
  overflow: hidden;
`

const LoadingFallback = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: white;
  font-size: 18px;
  background: linear-gradient(135deg, #0a0511 0%, #1a1a2e 50%, #16213e 100%);
`

const ComingSoonOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 40px;
  border-radius: 20px;
  border: 2px solid rgba(255, 215, 0, 0.5);
  text-align: center;
  z-index: 10;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`

const ComingSoonTitle = styled.h2`
  color: #ffd700;
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`

const ComingSoonSubtitle = styled.p`
  color: #d4a574;
  font-size: 16px;
  margin: 0 0 24px 0;
  line-height: 1.4;
`

const ToggleHint = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin: 0;
  font-style: italic;
`

// Simple 3D scene with floating dice and mystical elements
const Scene3D: React.FC = () => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffd700" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#d4a574" />
      
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
      
      {/* Controls */}
      <OrbitControls 
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={1}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
      
      {/* Simple floating cube representing dice */}
      <mesh position={[0, 0, 0]} rotation={[0.5, 0.5, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.3}
          roughness={0.4}
          emissive="#d4a574"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Mystical ring around the dice */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[4, 0.1, 16, 100]} />
        <meshStandardMaterial 
          color="#d4a574" 
          emissive="#d4a574"
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Floating "Coming Soon" text */}
      <Text
        position={[0, -3, 0]}
        fontSize={0.8}
        color="#ffd700"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        3D Mode Coming Soon
      </Text>
    </>
  )
}

export default function DiceV2Renderer3D() {
  const {
    wager,
    setWager,
    hasPlayed,
    play,
    resetGame,
    multiplier,
    poolExceeded,
    isPlaying,
    isAnimating
  } = useDiceV2GameLogic()

  // For 3D mode, we still use the same game logic but show coming soon message
  return (
    <>
      <GambaUi.Portal target="screen">
        <Container3D>
          <Suspense fallback={<LoadingFallback>Loading 3D Scene...</LoadingFallback>}>
            <Canvas>
              <Scene3D />
            </Canvas>
          </Suspense>
          
          <ComingSoonOverlay>
            <ComingSoonTitle>🎲 3D Dice Coming Soon!</ComingSoonTitle>
            <ComingSoonSubtitle>
              Experience the magic 8-ball in stunning 3D with realistic physics,<br />
              interactive sphere rotation, and immersive visual effects.
            </ComingSoonSubtitle>
            <ToggleHint>
              Toggle back to 2D mode to play the current version
            </ToggleHint>
          </ComingSoonOverlay>
        </Container3D>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        <MobileControls
          wager={wager}
          setWager={setWager}
          onPlay={hasPlayed ? resetGame : play}
          playDisabled={true} // Disabled in 3D coming soon mode
          playText="3D Mode Coming Soon"
        />

        <DesktopControls
          onPlay={() => {}}
          playDisabled={true}
          playText="3D Mode Coming Soon"
        >
          <EnhancedWagerInput value={wager} onChange={setWager} disabled />
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}