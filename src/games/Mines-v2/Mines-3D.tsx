import { GambaUi, TokenValue } from 'gamba-react-ui-v2'
import React, { Suspense } from 'react'
import styled from 'styled-components'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Text, Sphere, Box } from '@react-three/drei'
import { EnhancedWagerInput, EnhancedButton, EnhancedPlayButton, MobileControls, SwitchControl, DesktopControls } from '../../components'
import GameScreenFrame from '../../components/Game/GameScreenFrame'
import { GameStatsHeader } from '../../components/Game/GameStatsHeader'

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
  border: 2px solid rgba(244, 67, 54, 0.5);
  text-align: center;
  z-index: 10;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`

const ComingSoonTitle = styled.h2`
  color: #f44336;
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`

const ComingSoonSubtitle = styled.p`
  color: #ff8a80;
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

// 3D Mines Scene with mine field
const Scene3D: React.FC = () => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#f44336" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff8a80" />
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
      
      {/* Mine field grid - 5x5 tiles */}
      {Array.from({ length: 25 }).map((_, index) => {
        const row = Math.floor(index / 5)
        const col = index % 5
        return (
          <mesh key={index} position={[col * 1.2 - 2.4, 0, row * 1.2 - 2.4]} rotation={[0, 0, 0]}>
            <boxGeometry args={[1, 0.1, 1]} />
            <meshStandardMaterial 
              color="#424242" 
              metalness={0.3}
              roughness={0.4}
              emissive="#f44336"
              emissiveIntensity={0.05}
            />
          </mesh>
        )
      })}
      
      {/* Floating mines - scattered around */}
      {Array.from({ length: 3 }).map((_, index) => (
        <Sphere
          key={index}
          position={[
            (Math.random() - 0.5) * 8,
            Math.random() * 2 + 1,
            (Math.random() - 0.5) * 8
          ]}
          args={[0.3, 16, 16]}
        >
          <meshStandardMaterial 
            color="#f44336"
            emissive="#f44336"
            emissiveIntensity={0.3}
            metalness={0.5}
            roughness={0.2}
          />
        </Sphere>
      ))}
      
      {/* Floating "Coming Soon" text */}
      <Text
        position={[0, 8, 0]}
        fontSize={1}
        color="#f44336"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        3D Mines
      </Text>
      
      <Text
        position={[0, 7, 0]}
        fontSize={0.6}
        color="#ff8a80"
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
          color="#f44336" 
          emissive="#f44336"
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      <mesh rotation={[Math.PI / 3, 0, 0]} position={[0, 2, 0]}>
        <torusGeometry args={[4, 0.05, 16, 100]} />
        <meshStandardMaterial 
          color="#ff8a80" 
          emissive="#ff8a80"
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
        />
      </mesh>
    </>
  )
}

export default function MinesRenderer3D() {
  // Mock game logic for 3D mode
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
      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Mines"
          gameMode="3D (Coming Soon)"
          rtp="97"
          stats={gameStats}
          onReset={handleResetStats}
          isMobile={mobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <Container3D>
          <Suspense fallback={<LoadingFallback>Loading 3D Mines Scene...</LoadingFallback>}>
            <Canvas>
              <Scene3D />
            </Canvas>
          </Suspense>
          
          <ComingSoonOverlay>
            <ComingSoonTitle>💣 3D Mines Coming Soon!</ComingSoonTitle>
            <ComingSoonSubtitle>
              Experience Mines like never before with realistic 3D physics,<br />
              interactive camera controls, immersive lighting effects,<br />
              and stunning visual mine field in full 3D space.
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
    console.log('💣 3D Mines - Coming Soon! This mode is not yet available.')
  }

  // Helper calculations
  const maxPayout = pool?.maxPayout || 0
  const maxMultiplier = 100 // Simplified for 3D
  const poolExceeded = wager * maxMultiplier > maxPayout

  return (
    <>
      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Mines"
          gameMode="3D Mode (Coming Soon)"
          rtp="95"
          stats={gameStats}
          onReset={handleResetStats}
          isMobile={isMobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <div style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #1a1a2e, #2d1b69)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 3D Mode Coming Soon Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            backdropFilter: 'blur(5px)',
          }}>
            <div style={{
              color: 'white',
              fontSize: '2rem',
              fontWeight: 'bold',
              textAlign: 'center',
              padding: '2rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '1rem',
              border: '2px solid rgba(255, 255, 255, 0.2)',
            }}>
              💣 3D Mode<br />
              <span style={{ fontSize: '1.2rem', opacity: 0.8 }}>Coming Soon!</span>
            </div>
          </div>

          <GameplayFrame
            ref={effectsRef}
            {...(useGameMeta('mines') && { 
              title: useGameMeta('mines')!.name, 
              description: useGameMeta('mines')!.description 
            })}
          >
            {/* Game grid placeholder */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gridTemplateRows: 'repeat(5, 1fr)',
              gap: '8px',
              width: '300px',
              height: '300px',
              padding: '20px',
              opacity: 0.3
            }}>
              {Array.from({ length: 25 }).map((_, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(147, 88, 255, 0.2)',
                    border: '2px solid rgba(147, 88, 255, 0.4)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1.5rem'
                  }}
                >
                  ?
                </div>
              ))}
            </div>
          </GameplayFrame>
        </div>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        {/* EXACT SAME CONTROLS AS 2D BUT DISABLED */}
        {!started ? (
          <>
            <MobileControls
              wager={wager}
              setWager={setWager}
              onPlay={startGame}
              playDisabled={true}
              playText="Coming Soon"
            >
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ color: '#fff', minWidth: '60px' }}>Mines:</label>
                <select
                  value={mineCount}
                  onChange={(e) => setMineCount(Number(e.target.value))}
                  disabled={true}
                  style={{
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(147, 88, 255, 0.3)',
                    background: '#1a1a2e',
                    color: '#fff',
                    flex: 1
                  }}
                >
                  {MINE_SELECT.map(count => (
                    <option key={count} value={count}>{count}</option>
                  ))}
                </select>
              </div>
            </MobileControls>

            <DesktopControls
              wager={wager}
              setWager={setWager}
              onPlay={startGame}
              playDisabled={true}
              playText="Coming Soon"
            >
              <EnhancedWagerInput 
                value={wager} 
                onChange={setWager} 
                multiplier={maxMultiplier}
              />
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label style={{ color: '#fff', minWidth: '60px' }}>Mines:</label>
                <select
                  value={mineCount}
                  onChange={(e) => setMineCount(Number(e.target.value))}
                  disabled={true}
                  style={{
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(147, 88, 255, 0.3)',
                    background: '#1a1a2e',
                    color: '#fff'
                  }}
                >
                  {MINE_SELECT.map(count => (
                    <option key={count} value={count}>{count}</option>
                  ))}
                </select>
              </div>
              <EnhancedPlayButton onClick={startGame} wager={wager} disabled={true}>
                Coming Soon
              </EnhancedPlayButton>
            </DesktopControls>
          </>
        ) : (
          <>
            <MobileControls
              wager={wager}
              setWager={setWager}
              onPlay={endGame}
              playDisabled={true}
              playText="Coming Soon"
            >
              {started && totalGain > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <EnhancedButton 
                    onClick={endGame} 
                    disabled={true} 
                    variant="primary"
                  >
                    💰 Cash Out
                  </EnhancedButton>
                </div>
              )}
            </MobileControls>
            
            <DesktopControls
              wager={wager}
              setWager={setWager}
              onPlay={endGame}
              playDisabled={true}
              playText="Coming Soon"
            >
              {started && totalGain > 0 && (
                <EnhancedButton 
                  onClick={endGame} 
                  disabled={true} 
                  variant="primary"
                >
                  💰 Cash Out
                </EnhancedButton>
              )}
            </DesktopControls>
          </>
        )}
      </GambaUi.Portal>
    </>
  )
}