import { GambaUi, TokenValue } from 'gamba-react-ui-v2'
import React, { Suspense } from 'react'
import styled from 'styled-components'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Text, Sphere, Box } from '@react-three/drei'
import { EnhancedWagerInput, EnhancedButton, EnhancedPlayButton, MobileControls, SwitchControl, DesktopControls } from '../../components'
import GameScreenFrame from '../../components/Game/GameScreenFrame'
import { GameStatsHeader } from '../../components/Game/GameStatsHeader'
import { StyledPlinkoBackground } from './PlinkoBackground.enhanced.styles'
import { usePlinkoGameLogic } from './sharedLogic'

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
  border: 2px solid rgba(156, 39, 176, 0.5);
  text-align: center;
  z-index: 10;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`

const ComingSoonTitle = styled.h2`
  color: #9c27b0;
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`

const ComingSoonSubtitle = styled.p`
  color: #e91e63;
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

// 3D Plinko Scene with floating elements
const Scene3D: React.FC = () => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#9c27b0" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#e91e63" />
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
      
      {/* Floating Plinko Board Structure */}
      {/* Pegs arranged in triangular pattern */}
      {Array.from({ length: 5 }, (_, row) => 
        Array.from({ length: row + 3 }, (_, col) => (
          <Sphere
            key={`peg-${row}-${col}`}
            position={[
              (col - (row + 2) / 2) * 1.5,
              4 - row * 1.2,
              0
            ]}
            args={[0.1, 16, 16]}
          >
            <meshStandardMaterial 
              color="#4a90e2"
              emissive="#4a90e2"
              emissiveIntensity={0.2}
              metalness={0.5}
              roughness={0.3}
            />
          </Sphere>
        ))
      )}
      
      {/* Floating Ball */}
      <Sphere
        position={[0, 6, 0]}
        args={[0.2, 16, 16]}
      >
        <meshStandardMaterial 
          color="#ff6b6b"
          emissive="#ff6b6b"
          emissiveIntensity={0.3}
          metalness={0.4}
          roughness={0.2}
        />
      </Sphere>
      
      {/* Bucket Base Structure */}
      {Array.from({ length: 7 }, (_, i) => (
        <Box
          key={`bucket-${i}`}
          position={[(i - 3) * 1.5, -1, 0]}
          args={[1.2, 0.3, 0.8]}
        >
          <meshStandardMaterial 
            color={`hsl(${(i * 60) % 360}, 70%, 50%)`}
            emissive={`hsl(${(i * 60) % 360}, 70%, 20%)`}
            emissiveIntensity={0.2}
            metalness={0.3}
            roughness={0.4}
          />
        </Box>
      ))}
      
      {/* Floating "Coming Soon" text */}
      <Text
        position={[0, 8, 0]}
        fontSize={1}
        color="#9c27b0"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        3D Plinko
      </Text>
      
      <Text
        position={[0, 7, 0]}
        fontSize={0.6}
        color="#e91e63"
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
          color="#9c27b0" 
          emissive="#9c27b0"
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      <mesh rotation={[Math.PI / 3, 0, 0]} position={[0, 2, 0]}>
        <torusGeometry args={[4, 0.05, 16, 100]} />
        <meshStandardMaterial 
          color="#e91e63" 
          emissive="#e91e63"
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
        />
      </mesh>
    </>
  )
}

export default function PlinkoRenderer3D() {
  const {
    wager,
    setWager,
    gameStats,
    degen,
    setDegen,
    ballCount,
    setBallCount,
    play,
    resetGame,
    handleResetStats,
    maxWagerForPool,
    poolExceeded,
    mobile,
    isPlaying,
    game
  } = usePlinkoGameLogic()

  return (
    <>
      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Plinko"
          gameMode="3D (Coming Soon)"
          rtp="98"
          stats={gameStats}
          onReset={handleResetStats}
          isMobile={mobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <StyledPlinkoBackground>
          <Container3D>
            <Suspense fallback={<LoadingFallback>Loading 3D Plinko Scene...</LoadingFallback>}>
              <Canvas>
                <Scene3D />
              </Canvas>
            </Suspense>
            
            <ComingSoonOverlay>
              <ComingSoonTitle>🎯 3D Plinko Coming Soon!</ComingSoonTitle>
              <ComingSoonSubtitle>
                Experience Plinko like never before with realistic 3D physics,<br />
                interactive camera controls, immersive lighting effects,<br />
                and stunning visual ball trajectories in full 3D space.
              </ComingSoonSubtitle>
              <ToggleHint>
                Toggle back to 2D mode to play the current version
              </ToggleHint>
            </ComingSoonOverlay>
          </Container3D>
        </StyledPlinkoBackground>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        <MobileControls
          wager={wager}
          setWager={setWager}
          onPlay={() => {}}
          playDisabled={true}
          playText="3D Mode Coming Soon"
        >
          {/* Mode Toggle + Balls Dropdown + Settings */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {/* Normal|Degen Toggle */}
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '2px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <button
                onClick={() => {}}
                disabled={true}
                style={{
                  padding: '4px 10px',
                  borderRadius: '14px',
                  border: 'none',
                  background: !degen 
                    ? 'linear-gradient(135deg, #4caf50, #45a049)'
                    : 'transparent',
                  color: !degen ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  cursor: 'not-allowed',
                  opacity: 0.5,
                  transition: 'all 0.2s ease'
                }}
              >
                Normal
              </button>
              <button
                onClick={() => {}}
                disabled={true}
                style={{
                  padding: '4px 10px',
                  borderRadius: '14px',
                  border: 'none',
                  background: degen 
                    ? 'linear-gradient(135deg, #ff9800, #f57c00)'
                    : 'transparent',
                  color: degen ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  cursor: 'not-allowed',
                  opacity: 0.5,
                  transition: 'all 0.2s ease'
                }}
              >
                Degen
              </button>
            </div>

            {/* Balls Dropdown */}
            <select
              value={ballCount}
              onChange={() => {}}
              disabled={true}
              style={{
                padding: '4px 8px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 87, 34, 0.4)',
                background: 'rgba(255, 87, 34, 0.1)',
                color: '#ff5722',
                fontSize: '10px',
                fontWeight: 'bold',
                cursor: 'not-allowed',
                opacity: 0.5
              }}
            >
              {[1, 3, 5, 10].map(count => (
                <option key={count} value={count} style={{ background: '#1a1a1a', color: '#ff5722' }}>
                  {count} Ball{count > 1 ? 's' : ''}
                </option>
              ))}
            </select>

            {/* Settings Button - Always visible but disabled */}
            <button
              onClick={() => {}}
              disabled={true}
              style={{
                padding: '4px 8px',
                borderRadius: '8px',
                border: '1px solid rgba(156, 39, 176, 0.4)',
                background: 'rgba(156, 39, 176, 0.1)',
                color: '#9c27b0',
                fontSize: '12px',
                cursor: 'not-allowed',
                opacity: 0.5,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ⚙️
            </button>
          </div>
        </MobileControls>
        
        <DesktopControls
          wager={wager}
          setWager={setWager}
          onPlay={() => {}}
          playDisabled={true}
        >
          <EnhancedWagerInput 
            value={wager} 
            onChange={setWager} 
            maxWager={maxWagerForPool}
            disabled={true}
          />
          
          {/* Controls Container - EXACTLY like 2D version */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(10, 5, 17, 0.85) 0%, rgba(139, 90, 158, 0.1) 50%, rgba(10, 5, 17, 0.85) 100%)',
            border: '1px solid rgba(212, 165, 116, 0.4)',
            borderRadius: '16px',
            padding: '14px',
            boxShadow: 'inset 0 2px 8px rgba(10, 5, 17, 0.4), 0 4px 16px rgba(212, 165, 116, 0.1), 0 0 0 1px rgba(212, 165, 116, 0.15)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: 'fit-content',
            opacity: 0.5
          }}>
            {/* Mode Toggle (where number input would be) */}
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '2px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <button
                onClick={() => {}}
                disabled={true}
                style={{
                  padding: '6px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: !degen 
                    ? 'linear-gradient(135deg, #4caf50, #45a049)'
                    : 'transparent',
                  color: !degen ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'not-allowed',
                  opacity: 0.5,
                  transition: 'all 0.2s ease'
                }}
              >
                Normal
              </button>
              <button
                onClick={() => {}}
                disabled={true}
                style={{
                  padding: '6px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: degen 
                    ? 'linear-gradient(135deg, #ff9800, #f57c00)'
                    : 'transparent',
                  color: degen ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'not-allowed',
                  opacity: 0.5,
                  transition: 'all 0.2s ease'
                }}
              >
                Degen
              </button>
            </div>
            
            {/* Balls Dropdown (where token would be) */}
            <select
              value={ballCount}
              onChange={() => {}}
              disabled={true}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(212, 165, 116, 0.5)',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'not-allowed',
                opacity: 0.5,
                outline: 'none',
                fontFamily: 'Libre Baskerville, serif'
              }}
            >
              {[1, 3, 5, 10].map(count => (
                <option key={count} value={count} style={{ background: '#1a1a1a', color: '#ff5722' }}>
                  {count} Ball{count > 1 ? 's' : ''}
                </option>
              ))}
            </select>

            {/* Settings Button (where info icon would be) */}
            <button
              onClick={() => {}}
              disabled={true}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(212, 165, 116, 0.5)',
                fontSize: '16px',
                cursor: 'not-allowed',
                opacity: 0.5,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0',
                minWidth: '24px',
                height: '24px'
              }}
            >
              ⚙️
            </button>
          </div>
          
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