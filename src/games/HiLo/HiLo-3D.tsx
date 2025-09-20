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
  background: linear-gradient(135deg, #0e4b2a 0%, #1a5c3a 50%, #266b4a 100%);
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
  background: linear-gradient(135deg, #0e4b2a 0%, #1a5c3a 50%, #266b4a 100%);
\`

const ComingSoonOverlay = styled.div\`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 40px;
  border-radius: 20px;
  border: 2px solid rgba(76, 175, 80, 0.5);
  text-align: center;
  z-index: 10;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
\`

const ComingSoonTitle = styled.h2\`
  color: #4caf50;
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
\`

const ComingSoonSubtitle = styled.p\`
  color: #81c784;
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

// 3D HiLo Scene with card towers and green theme
const Scene3D: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#4caf50" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#81c784" />
      <pointLight position={[0, 10, 0]} intensity={0.6} color="#2e7d32" />
      
      <PerspectiveCamera makeDefault position={[0, 8, 12]} fov={50} />
      
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        autoRotate
        autoRotateSpeed={0.6}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 4}
        maxDistance={18}
        minDistance={6}
      />
      
      {Array.from({ length: 13 }).map((_, index) => (
        <mesh key={\`card-\${index}\`} position={[index * 0.8 - 5, index * 0.3, 0]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[1.2, 1.8, 0.1]} />
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={0.3}
            roughness={0.4}
            emissive="#4caf50"
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
      
      <mesh position={[-3, 1, 3]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.2, 1.8, 0.1]} />
        <meshStandardMaterial 
          color="#ff5722" 
          metalness={0.4}
          roughness={0.3}
          emissive="#ff5722"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      <mesh position={[3, 1, 3]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.2, 1.8, 0.1]} />
        <meshStandardMaterial 
          color="#2196f3" 
          metalness={0.4}
          roughness={0.3}
          emissive="#2196f3"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#0e4b2a" 
          metalness={0.2}
          roughness={0.8}
          emissive="#0e4b2a"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      <Text
        position={[0, 8, 0]}
        fontSize={1.2}
        color="#4caf50"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        3D HiLo
      </Text>
      
      <Text
        position={[0, 6.8, 0]}
        fontSize={0.6}
        color="#81c784"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        Coming Soon
      </Text>
      
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3, 0]}>
        <torusGeometry args={[6, 0.12, 16, 100]} />
        <meshStandardMaterial 
          color="#4caf50" 
          emissive="#4caf50"
          emissiveIntensity={0.4}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      <mesh rotation={[Math.PI / 4, 0, 0]} position={[0, 3, 0]}>
        <torusGeometry args={[4, 0.08, 16, 100]} />
        <meshStandardMaterial 
          color="#81c784" 
          emissive="#81c784"
          emissiveIntensity={0.3}
          transparent
          opacity={0.5}
        />
      </mesh>
    </>
  )
}

export default function HiLoRenderer3D() {
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
          gameName="HiLo"
          gameMode="3D (Coming Soon)"
          rtp="99"
          stats={gameStats}
          onReset={handleResetStats}
          isMobile={mobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <Container3D>
          <Suspense fallback={<LoadingFallback>Loading 3D HiLo Scene...</LoadingFallback>}>
            <Canvas>
              <Scene3D />
            </Canvas>
          </Suspense>
          
          <ComingSoonOverlay>
            <ComingSoonTitle>📈 3D HiLo Coming Soon!</ComingSoonTitle>
            <ComingSoonSubtitle>
              Experience HiLo like never before with dynamic 3D card stacks,<br />
              realistic physics simulations, immersive betting interface,<br />
              and stunning visual feedback for wins and losses.
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
