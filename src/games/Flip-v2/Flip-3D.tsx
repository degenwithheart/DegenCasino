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
  background: linear-gradient(135deg, #2c1810 0%, #4a2c1a 50%, #6b3e2e 100%);
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
  background: linear-gradient(135deg, #2c1810 0%, #4a2c1a 50%, #6b3e2e 100%);
\`

const ComingSoonOverlay = styled.div\`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 40px;
  border-radius: 20px;
  border: 2px solid rgba(218, 165, 32, 0.5);
  text-align: center;
  z-index: 10;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
\`

const ComingSoonTitle = styled.h2\`
  color: #daa520;
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
\`

const ComingSoonSubtitle = styled.p\`
  color: #f4d03f;
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

// 3D Flip Scene with spinning coins
const Scene3D: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#daa520" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#f4d03f" />
      <pointLight position={[0, 10, 0]} intensity={0.6} color="#cd853f" />
      
      <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={50} />
      
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        autoRotate
        autoRotateSpeed={1.2}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 4}
        maxDistance={15}
        minDistance={5}
      />
      
      {Array.from({ length: 6 }).map((_, index) => (
        <mesh 
          key={\`coin-\${index}\`} 
          position={[
            Math.cos(index * Math.PI / 3) * 3, 
            Math.sin(index * 0.5) * 2 + 1, 
            Math.sin(index * Math.PI / 3) * 3
          ]} 
          rotation={[index * 0.5, index * 0.3, 0]}
        >
          <cylinderGeometry args={[1, 1, 0.2, 32]} />
          <meshStandardMaterial 
            color="#daa520" 
            metalness={0.8}
            roughness={0.2}
            emissive="#daa520"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
      
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.3, 32]} />
        <meshStandardMaterial 
          color="#f4d03f" 
          metalness={0.9}
          roughness={0.1}
          emissive="#f4d03f"
          emissiveIntensity={0.4}
        />
      </mesh>
      
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#2c1810" 
          metalness={0.1}
          roughness={0.9}
          emissive="#2c1810"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      <Text
        position={[0, 7, 0]}
        fontSize={1.2}
        color="#daa520"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        3D Coin Flip
      </Text>
      
      <Text
        position={[0, 5.8, 0]}
        fontSize={0.6}
        color="#f4d03f"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        Coming Soon
      </Text>
      
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3, 0]}>
        <torusGeometry args={[5, 0.1, 16, 100]} />
        <meshStandardMaterial 
          color="#daa520" 
          emissive="#daa520"
          emissiveIntensity={0.4}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      <mesh rotation={[Math.PI / 3, 0, 0]} position={[0, 3, 0]}>
        <torusGeometry args={[3.5, 0.08, 16, 100]} />
        <meshStandardMaterial 
          color="#f4d03f" 
          emissive="#f4d03f"
          emissiveIntensity={0.3}
          transparent
          opacity={0.5}
        />
      </mesh>
      
      {Array.from({ length: 4 }).map((_, index) => (
        <Sphere 
          key={\`light-\${index}\`}
          position={[
            Math.cos(index * Math.PI / 2) * 8, 
            4, 
            Math.sin(index * Math.PI / 2) * 8
          ]} 
          args={[0.2, 16, 16]}
        >
          <meshStandardMaterial 
            color="#daa520"
            emissive="#daa520"
            emissiveIntensity={0.8}
          />
        </Sphere>
      ))}
    </>
  )
}

export default function FlipRenderer3D() {
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
          gameName="Coin Flip"
          gameMode="3D (Coming Soon)"
          rtp="98"
          stats={gameStats}
          onReset={handleResetStats}
          isMobile={mobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <Container3D>
          <Suspense fallback={<LoadingFallback>Loading 3D Coin Flip Scene...</LoadingFallback>}>
            <Canvas>
              <Scene3D />
            </Canvas>
          </Suspense>
          
          <ComingSoonOverlay>
            <ComingSoonTitle>🪙 3D Coin Flip Coming Soon!</ComingSoonTitle>
            <ComingSoonSubtitle>
              Experience coin flipping like never before with realistic 3D physics,<br />
              spinning coin animations, dynamic lighting effects,<br />
              and immersive sound design in full 3D space.
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
