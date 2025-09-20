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
  background: linear-gradient(135deg, #3d1a00 0%, #5c2700 50%, #7a3300 100%);
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
  background: linear-gradient(135deg, #3d1a00 0%, #5c2700 50%, #7a3300 100%);
\`

const ComingSoonOverlay = styled.div\`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 40px;
  border-radius: 20px;
  border: 2px solid rgba(255, 87, 34, 0.5);
  text-align: center;
  z-index: 10;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
\`

const ComingSoonTitle = styled.h2\`
  color: #ff5722;
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
\`

const ComingSoonSubtitle = styled.p\`
  color: #ff8a65;
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

// 3D Crash Scene with rocket and explosion effects
const Scene3D: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#ff5722" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff8a65" />
      <pointLight position={[0, 10, 0]} intensity={0.6} color="#ff9800" />
      
      <PerspectiveCamera makeDefault position={[0, 8, 12]} fov={50} />
      
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        autoRotate
        autoRotateSpeed={1.0}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 4}
        maxDistance={20}
        minDistance={6}
      />
      
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[1, 4, 8]} />
        <meshStandardMaterial 
          color="#ff5722" 
          metalness={0.7}
          roughness={0.3}
          emissive="#ff5722"
          emissiveIntensity={0.4}
        />
      </mesh>
      
      <mesh position={[0, -2.5, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 2, 16]} />
        <meshStandardMaterial 
          color="#616161" 
          metalness={0.8}
          roughness={0.2}
          emissive="#424242"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {Array.from({ length: 8 }).map((_, index) => (
        <mesh 
          key={\`flame-\${index}\`} 
          position={[
            Math.cos(index * Math.PI / 4) * 2, 
            -4 + Math.sin(index * 0.5) * 0.5, 
            Math.sin(index * Math.PI / 4) * 2
          ]} 
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
        >
          <coneGeometry args={[0.3, 1.5, 8]} />
          <meshStandardMaterial 
            color={index % 2 === 0 ? "#ff9800" : "#ff5722"}
            emissive={index % 2 === 0 ? "#ff9800" : "#ff5722"}
            emissiveIntensity={0.8}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
      
      {Array.from({ length: 12 }).map((_, index) => (
        <Sphere 
          key={\`spark-\${index}\`}
          position={[
            Math.cos(index * Math.PI / 6) * 6 + Math.random() * 2, 
            Math.random() * 8 + 2, 
            Math.sin(index * Math.PI / 6) * 6 + Math.random() * 2
          ]} 
          args={[0.1, 8, 8]}
        >
          <meshStandardMaterial 
            color="#ffeb3b"
            emissive="#ffeb3b"
            emissiveIntensity={1.0}
          />
        </Sphere>
      ))}
      
      <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#3d1a00" 
          metalness={0.1}
          roughness={0.9}
          emissive="#3d1a00"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      <Text
        position={[0, 8, 0]}
        fontSize={1.2}
        color="#ff5722"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        3D Crash
      </Text>
      
      <Text
        position={[0, 6.8, 0]}
        fontSize={0.6}
        color="#ff8a65"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        Coming Soon
      </Text>
      
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4, 0]}>
        <torusGeometry args={[7, 0.15, 16, 100]} />
        <meshStandardMaterial 
          color="#ff5722" 
          emissive="#ff5722"
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      <mesh rotation={[Math.PI / 4, 0, 0]} position={[0, 4, 0]}>
        <torusGeometry args={[5, 0.1, 16, 100]} />
        <meshStandardMaterial 
          color="#ff8a65" 
          emissive="#ff8a65"
          emissiveIntensity={0.4}
          transparent
          opacity={0.5}
        />
      </mesh>
    </>
  )
}

export default function CrashRenderer3D() {
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
          gameName="Crash"
          gameMode="3D (Coming Soon)"
          rtp="99"
          stats={gameStats}
          onReset={handleResetStats}
          isMobile={mobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <Container3D>
          <Suspense fallback={<LoadingFallback>Loading 3D Crash Scene...</LoadingFallback>}>
            <Canvas>
              <Scene3D />
            </Canvas>
          </Suspense>
          
          <ComingSoonOverlay>
            <ComingSoonTitle>🚀 3D Crash Coming Soon!</ComingSoonTitle>
            <ComingSoonSubtitle>
              Experience the thrill of Crash in full 3D with realistic rocket physics,<br />
              explosive visual effects, dynamic flame animations,<br />
              and immersive multiplier tracking in stunning 3D space.
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
