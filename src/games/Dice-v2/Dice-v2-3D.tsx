import { GambaUi, TokenValue } from 'gamba-react-ui-v2'
import React, { Suspense } from 'react'
import styled from 'styled-components'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Text, Sphere, Box } from '@react-three/drei'
import { EnhancedWagerInput, EnhancedButton, EnhancedPlayButton, MobileControls, SwitchControl, DesktopControls } from '../../components'
import GameScreenFrame from '../../components/Game/GameScreenFrame'
import { GameStatsHeader } from '../../components/Game/GameStatsHeader'
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
  border: 2px solid rgba(255, 193, 7, 0.5);
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

// 3D Dice Scene with floating elements
const Scene3D: React.FC = () => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffd700" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#d4a574" />
      <pointLight position={[0, 10, 0]} intensity={0.6} color="#4a90e2" />
      
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={50} />
      
      {/* Controls */}
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 4}
        maxDistance={15}
        minDistance={5}
      />
      
      {/* Floating dice - multiple cubes */}
      <mesh position={[0, 0, 0]} rotation={[0.5, 0.5, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.3}
          roughness={0.4}
          emissive="#ffd700"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      <mesh position={[-3, 1, -1]} rotation={[1, 0.3, 0.7]}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.3}
          roughness={0.4}
          emissive="#d4a574"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      <mesh position={[3, -1, 1]} rotation={[0.2, 1.2, 0.4]}>
        <boxGeometry args={[1.8, 1.8, 1.8]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.3}
          roughness={0.4}
          emissive="#ffd700"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Floating "Coming Soon" text */}
      <Text
        position={[0, 8, 0]}
        fontSize={1}
        color="#ffd700"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        3D Dice
      </Text>
      
      <Text
        position={[0, 7, 0]}
        fontSize={0.6}
        color="#d4a574"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        Coming Soon
      </Text>
      
      {/* Mystical floating rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2, 0]}>
        <torusGeometry args={[6, 0.1, 16, 100]} />
        <meshStandardMaterial 
          color="#ffd700" 
          emissive="#ffd700"
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      <mesh rotation={[Math.PI / 3, 0, 0]} position={[0, 2, 0]}>
        <torusGeometry args={[4, 0.05, 16, 100]} />
        <meshStandardMaterial 
          color="#d4a574" 
          emissive="#d4a574"
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
        />
      </mesh>
    </>
  )
}

export default function DiceV2Renderer3D() {
  const {
    wager,
    setWager,
    gameStats,
    handleResetStats,
    mobile
  } = useDiceV2GameLogic()

  return (
    <>
      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Dice"
          gameMode="3D (Coming Soon)"
          rtp="98"
          stats={gameStats}
          onReset={handleResetStats}
          isMobile={mobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <Container3D>
          <Suspense fallback={<LoadingFallback>Loading 3D Dice Scene...</LoadingFallback>}>
            <Canvas>
              <Scene3D />
            </Canvas>
          </Suspense>
          
          <ComingSoonOverlay>
            <ComingSoonTitle>🎲 3D Dice Coming Soon!</ComingSoonTitle>
            <ComingSoonSubtitle>
              Experience Dice like never before with realistic 3D physics,<br />
              interactive camera controls, immersive lighting effects,<br />
              and stunning visual dice rolling in full 3D space.
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
          onPlay={() => {}}
          playDisabled={true}
          playText="3D Mode Coming Soon"
        />
        
        <DesktopControls
          wager={wager}
          setWager={setWager}
          onPlay={() => {}}
          playDisabled={true}
        >
          <EnhancedWagerInput 
            value={wager} 
            onChange={setWager} 
            disabled={true}
          />
          
          <EnhancedPlayButton 
            onClick={() => {}} 
            disabled={true}
          >
            3D Mode Coming Soon
          </EnhancedPlayButton>
          
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}