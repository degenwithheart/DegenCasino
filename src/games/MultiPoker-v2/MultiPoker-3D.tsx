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
  background: linear-gradient(135deg, #1a3e56 0%, #0d2f4a 50%, #0a1e33 100%);
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
  background: linear-gradient(135deg, #1a3e56 0%, #0d2f4a 50%, #0a1e33 100%);
\`

const ComingSoonOverlay = styled.div\`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 40px;
  border-radius: 20px;
  border: 2px solid rgba(52, 152, 219, 0.5);
  text-align: center;
  z-index: 10;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
\`

const ComingSoonTitle = styled.h2\`
  color: #3498db;
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
\`

const ComingSoonSubtitle = styled.p\`
  color: #5dade2;
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

// 3D MultiPoker Scene with poker tables and chips
const Scene3D: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#3498db" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#5dade2" />
      <pointLight position={[0, 10, 0]} intensity={0.6} color="#1abc9c" />
      
      <PerspectiveCamera makeDefault position={[0, 8, 12]} fov={50} />
      
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        autoRotate
        autoRotateSpeed={0.8}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 4}
        maxDistance={20}
        minDistance={6}
      />
      
      {Array.from({ length: 5 }).map((_, index) => (
        <mesh key={\`card-\${index}\`} position={[index * 1.5 - 3, 0, -2]} rotation={[0, 0, 0.05 * index]}>
          <boxGeometry args={[1.4, 2, 0.05]} />
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={0.3}
            roughness={0.4}
            emissive="#3498db"
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
      
      {Array.from({ length: 8 }).map((_, index) => (
        <mesh key={\`chip-\${index}\`} position={[
          Math.cos(index * Math.PI / 4) * 4, 
          0.3, 
          Math.sin(index * Math.PI / 4) * 4
        ]}>
          <cylinderGeometry args={[0.8, 0.8, 0.3, 16]} />
          <meshStandardMaterial 
            color={index % 2 === 0 ? "#e74c3c" : "#f39c12"}
            metalness={0.6}
            roughness={0.2}
            emissive={index % 2 === 0 ? "#e74c3c" : "#f39c12"}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
      
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 12]} />
        <meshStandardMaterial 
          color="#0d4f8c" 
          metalness={0.2}
          roughness={0.8}
          emissive="#0d4f8c"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6, 8, 32]} />
        <meshStandardMaterial 
          color="#1abc9c" 
          metalness={0.4}
          roughness={0.6}
          emissive="#1abc9c"
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      <Text
        position={[0, 8, 0]}
        fontSize={1.2}
        color="#3498db"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        3D MultiPoker
      </Text>
      
      <Text
        position={[0, 6.8, 0]}
        fontSize={0.6}
        color="#5dade2"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        Coming Soon
      </Text>
      
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2, 0]}>
        <torusGeometry args={[7, 0.15, 16, 100]} />
        <meshStandardMaterial 
          color="#3498db" 
          emissive="#3498db"
          emissiveIntensity={0.4}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      <mesh rotation={[Math.PI / 4, 0, 0]} position={[0, 2, 0]}>
        <torusGeometry args={[5, 0.1, 16, 100]} />
        <meshStandardMaterial 
          color="#5dade2" 
          emissive="#5dade2"
          emissiveIntensity={0.3}
          transparent
          opacity={0.5}
        />
      </mesh>
    </>
  )
}

export default function MultiPokerRenderer3D() {
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
          gameName="MultiPoker"
          gameMode="3D (Coming Soon)"
          rtp="99"
          stats={gameStats}
          onReset={handleResetStats}
          isMobile={mobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <Container3D>
          <Suspense fallback={<LoadingFallback>Loading 3D MultiPoker Scene...</LoadingFallback>}>
            <Canvas>
              <Scene3D />
            </Canvas>
          </Suspense>
          
          <ComingSoonOverlay>
            <ComingSoonTitle>🃏 3D MultiPoker Coming Soon!</ComingSoonTitle>
            <ComingSoonSubtitle>
              Experience poker like never before with realistic 3D tables,<br />
              animated chip stacking, immersive card dealing physics,<br />
              and multi-table gameplay in stunning 3D environments.
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
