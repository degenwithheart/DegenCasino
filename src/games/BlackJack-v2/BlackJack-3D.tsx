import { GambaUi, TokenValue } from 'gamba-react-ui-v2'
import React, { Suspense } from 'react'
import styled from 'styled-components'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Text, Sphere, Box } from '@react-three/drei'
import { EnhancedWagerInput, EnhancedButton, EnhancedPlayButton, MobileControls, SwitchControl, DesktopControls } from '../../components'
import GameScreenFrame from '../../components/Game/GameScreenFrame'
import { GameStatsHeader } from '../../components/Game/GameStatsHeader'

const Container3D = styled.div\`
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(135deg, #0a0511 0%, #1a1a2e 50%, #16213e 100%);
  border-radius: 12px;
  overflow: hidden;
\`

const LoadingFallback = styled.div\`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: white;
  font-size: 18px;
  background: linear-gradient(135deg, #0a0511 0%, #1a1a2e 50%, #16213e 100%);
\`

const ComingSoonOverlay = styled.div\`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 40px;
  border-radius: 20px;
  border: 2px solid rgba(33, 33, 33, 0.5);
  text-align: center;
  z-index: 10;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
\`

const ComingSoonTitle = styled.h2\`
  color: #212121;
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
\`

const ComingSoonSubtitle = styled.p\`
  color: #616161;
  font-size: 16px;
  margin: 0 0 24px 0;
  line-height: 1.4;
\`

const ToggleHint = styled.p\`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin: 0;
  font-style: italic;
\`

// 3D BlackJack Scene with cards and table
const Scene3D: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#212121" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#616161" />
      <pointLight position={[0, 10, 0]} intensity={0.6} color="#4a90e2" />
      
      <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={50} />
      
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
      
      {Array.from({ length: 7 }).map((_, index) => (
        <mesh key={index} position={[index * 1.2 - 3.6, 0, 0]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[1.5, 2, 0.1]} />
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={0.3}
            roughness={0.4}
            emissive="#212121"
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
      
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial 
          color="#0d5c0d" 
          metalness={0.2}
          roughness={0.8}
          emissive="#0d5c0d"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      <Text
        position={[0, 8, 0]}
        fontSize={1}
        color="#212121"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        3D BlackJack
      </Text>
      
      <Text
        position={[0, 7, 0]}
        fontSize={0.6}
        color="#616161"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        Coming Soon
      </Text>
      
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2, 0]}>
        <torusGeometry args={[6, 0.1, 16, 100]} />
        <meshStandardMaterial 
          color="#212121" 
          emissive="#212121"
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      <mesh rotation={[Math.PI / 3, 0, 0]} position={[0, 2, 0]}>
        <torusGeometry args={[4, 0.05, 16, 100]} />
        <meshStandardMaterial 
          color="#616161" 
          emissive="#616161"
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
        />
      </mesh>
    </>
  )
}

export default function BlackJackRenderer3D() {
  const gameStats = {
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    sessionProfit: 0,
    bestWin: 0
  }

  const handleResetStats = () => {
    // Mock function for 3D mode
  }

  const [wager, setWager] = React.useState(0.1)
  const mobile = false

  return (
    <>
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="BlackJack"
          gameMode="3D (Coming Soon)"
          rtp="99"
          stats={gameStats}
          onReset={handleResetStats}
          isMobile={mobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <Container3D>
          <Suspense fallback={<LoadingFallback>Loading 3D BlackJack Scene...</LoadingFallback>}>
            <Canvas>
              <Scene3D />
            </Canvas>
          </Suspense>
          
          <ComingSoonOverlay>
            <ComingSoonTitle>🃏 3D BlackJack Coming Soon!</ComingSoonTitle>
            <ComingSoonSubtitle>
              Experience BlackJack like never before with realistic 3D physics,<br />
              interactive camera controls, immersive lighting effects,<br />
              and stunning visual card dealing in full 3D space.
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
