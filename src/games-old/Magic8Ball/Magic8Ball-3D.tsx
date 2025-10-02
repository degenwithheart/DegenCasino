import React, { useRef, useState, useEffect, useMemo, Suspense, useCallback } from 'react'
import { GambaUi, useCurrentPool, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, OrbitControls, Environment } from '@react-three/drei'
import { EnhancedWagerInput, MobileControls, DesktopControls, GameRecentPlaysHorizontal } from '../../components'
import { GameStatsHeader } from '../../components/Game/GameStatsHeader'
import { useGameStats } from '../../hooks/game/useGameStats'
import { useIsCompact } from '../../hooks/ui/useIsCompact'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGameMeta } from '../useGameMeta'
import styled from 'styled-components'
import * as THREE from 'three'
import { BPS_PER_WHOLE } from 'gamba-core-v2'
import { BET_ARRAYS_V3 } from '../rtpConfig-v3'

// Styled Container for 3D Scene with dynamic background
const Container3D = styled.div<{ $gameState: 'idle' | 'playing' | 'win' | 'lose' }>`
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  min-height: 400px;
  
  /* Consistent background for all states */
  background: radial-gradient(circle at center, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);

  /* Romantic degen background elements */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    opacity: 0.15;
    background-image: 
      /* Large dice symbols positioned like 2D version */
      radial-gradient(circle at 12% 15%, transparent 30px, transparent 31px),
      radial-gradient(circle at 88% 85%, transparent 25px, transparent 26px),
      radial-gradient(circle at 75% 25%, transparent 15px, transparent 16px),
      radial-gradient(circle at 25% 75%, transparent 15px, transparent 16px);
    z-index: 1;
  }

  /* Dice symbols overlay */
  &::after {
    content: '⚃ ⚄ ⚂ ⚁ ⚀ ⚅ ⚃ ⚄';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    color: rgba(212, 165, 116, 0.2);
    font-size: 40px;
    font-family: serif;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    letter-spacing: 20px;
    transform: rotate(-15deg);
    z-index: 1;
  }

  /* Mystical circles animation */
  background-size: 400px 400px;
  animation: ${props => props.$gameState === 'playing' ? 'mysticalFloat 8s ease-in-out infinite' : 'none'};

  @keyframes mysticalFloat {
    0%, 100% { 
      background-position: 0% 0%, 25% 25%, 75% 75%, 50% 50%; 
    }
    50% { 
      background-position: 25% 25%, 75% 75%, 25% 25%, 75% 75%; 
    }
  }

  /* Floating rune animations */
  @keyframes float0 { 0%, 100% { transform: rotate(0deg) translateY(0px); } 50% { transform: rotate(180deg) translateY(-20px); } }
  @keyframes float1 { 0%, 100% { transform: rotate(45deg) translateY(0px); } 50% { transform: rotate(225deg) translateY(-15px); } }
  @keyframes float2 { 0%, 100% { transform: rotate(90deg) translateY(0px); } 50% { transform: rotate(270deg) translateY(-25px); } }
  @keyframes float3 { 0%, 100% { transform: rotate(135deg) translateY(0px); } 50% { transform: rotate(315deg) translateY(-10px); } }
  @keyframes float4 { 0%, 100% { transform: rotate(180deg) translateY(0px); } 50% { transform: rotate(0deg) translateY(-30px); } }
  @keyframes float5 { 0%, 100% { transform: rotate(225deg) translateY(0px); } 50% { transform: rotate(45deg) translateY(-18px); } }
  @keyframes float6 { 0%, 100% { transform: rotate(270deg) translateY(0px); } 50% { transform: rotate(90deg) translateY(-22px); } }
  @keyframes float7 { 0%, 100% { transform: rotate(315deg) translateY(0px); } 50% { transform: rotate(135deg) translateY(-12px); } }

  /* Mystical circle orbit animations */
  @keyframes orbit0 { 0% { transform: rotate(0deg) translateX(50px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(50px) rotate(-360deg); } }
  @keyframes orbit1 { 0% { transform: rotate(0deg) translateX(70px) rotate(0deg); } 100% { transform: rotate(-360deg) translateX(70px) rotate(360deg); } }
  @keyframes orbit2 { 0% { transform: rotate(0deg) translateX(90px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(90px) rotate(-360deg); } }
  @keyframes orbit3 { 0% { transform: rotate(0deg) translateX(110px) rotate(0deg); } 100% { transform: rotate(-360deg) translateX(110px) rotate(360deg); } }
  @keyframes orbit4 { 0% { transform: rotate(0deg) translateX(130px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(130px) rotate(-360deg); } }
  @keyframes orbit5 { 0% { transform: rotate(0deg) translateX(150px) rotate(0deg); } 100% { transform: rotate(-360deg) translateX(150px) rotate(360deg); } }
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

// 3D Magic 8-Ball Component
interface Magic8Ball3DProps {
  number: number | string
  isAnimating: boolean
  isShaking: boolean
  isWin: boolean
  isLose: boolean
  mobile: boolean
}

const Magic8Ball3DComponent: React.FC<Magic8Ball3DProps> = ({ 
  number, 
  isAnimating, 
  isShaking, 
  isWin, 
  isLose, 
  mobile 
}) => {
  const ballRef = useRef<THREE.Mesh>(null)
  const numberRef = useRef<THREE.Group>(null)
  const [rotationSpeed, setRotationSpeed] = useState(0)
  const [shakeIntensity, setShakeIntensity] = useState(0)
  
  useEffect(() => {
    if (isAnimating) {
      setRotationSpeed(0.1)
    } else {
      setRotationSpeed(0.02)
    }
    
    if (isShaking) {
      setShakeIntensity(0.1)
      const timer = setTimeout(() => setShakeIntensity(0), 500)
      return () => clearTimeout(timer)
    }
  }, [isAnimating, isShaking])
  
  useFrame((state) => {
    if (ballRef.current) {
      ballRef.current.rotation.x += rotationSpeed * 0.5
      ballRef.current.rotation.y += rotationSpeed
      
      if (shakeIntensity > 0) {
        ballRef.current.position.x = (Math.random() - 0.5) * shakeIntensity
        ballRef.current.position.z = (Math.random() - 0.5) * shakeIntensity
      } else {
        ballRef.current.position.x = 0
        ballRef.current.position.z = 0
      }
      
      if (isWin) {
        ballRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4) * 0.05)
      } else if (isLose) {
        ballRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 6) * 0.03)
      } else {
        ballRef.current.scale.setScalar(1)
      }
    }
  })
  
  const ballColor = '#1a1a2e' // Always use the same color
  
  const ballSize = mobile ? 1.2 : 1.5
  
  return (
    <group>
      {/* Main Magic 8-Ball - only the sphere gets the pulsing effect */}
      <mesh ref={ballRef} position={[0, 0, 0]}>
        <sphereGeometry args={[ballSize, 32, 32]} />
        <meshStandardMaterial 
          color={ballColor}
          metalness={0.2}
          roughness={0.1}
          emissive="#000"
          emissiveIntensity={0}
        />
      </mesh>
      
      {/* Static elements that don't pulse - separate from the ball */}
      <group>
        {/* Dark window on the ball - positioned with bigger gap from ball */}
        <mesh position={[0, 0, ballSize * 1.08]}>
          <circleGeometry args={[ballSize * 0.35, 32]} />
          <meshStandardMaterial 
            color="#000011"
            transparent
            opacity={1.0}
            emissive="#000055"
            emissiveIntensity={0.4}
          />
        </mesh>
        
        {/* "Outcome" label - positioned above the window with bigger gap */}
        <group position={[0, ballSize * 0.25, ballSize * 1.09]}>
          <Text
            fontSize={mobile ? 0.15 : 0.18}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.015}
            outlineColor="#000000"
            fontWeight="bold"
          >
            OUTCOME
          </Text>
        </group>
        
        {/* Number display - aligned with outcome label with bigger gap */}
        <group ref={numberRef} position={[0, -ballSize * 0.1, ballSize * 1.09]}>
          <Text
            fontSize={mobile ? 0.4 : 0.5}
            color={isWin ? '#00ff88' : isLose ? '#ff4444' : '#ffffff'}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.025}
            outlineColor="#000000"
            fontWeight="bold"
          >
            {(typeof number === 'string' && number !== '') || (typeof number === 'number' && number > 0) ? number.toString() : (isAnimating ? '?' : '-')}
          </Text>
        </group>
      </group>
      
      {/* Particles - separate from ball so they don't pulse */}
      {(isAnimating || isWin) && (
        <>
          {Array.from({ length: 8 }).map((_, i) => (
            <Particle3DComponent 
              key={i} 
              delay={i * 0.1} 
              color={isWin ? '#ffd700' : '#9c27b0'} 
              radius={ballSize * 1.5}
            />
          ))}
        </>
      )}
    </group>
  )
}

const Particle3DComponent: React.FC<{ delay: number; color: string; radius: number }> = ({ delay, color, radius }) => {
  const particleRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (particleRef.current) {
      const time = state.clock.elapsedTime + delay
      const x = Math.cos(time * 2) * radius
      const y = Math.sin(time * 3) * 0.5
      const z = Math.sin(time * 2) * radius
      
      particleRef.current.position.set(x, y, z)
      particleRef.current.scale.setScalar(0.5 + Math.sin(time * 4) * 0.2)
    }
  })
  
  return (
    <mesh ref={particleRef}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial 
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.7}
      />
    </mesh>
  )
}



// Lucky number state interface (same as 2D)
interface LuckyNumberState {
  currentNumber: number | string
  targetNumber: number | string
  isAnimating: boolean
  animationProgress: number
  particles: any[]
  randomSequence: (number | string)[]
  currentSequenceIndex: number
}

function Magic8Ball3D() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const pool = useCurrentPool()
  const [wager, setWager] = useWagerInput()
  const { mobile: isMobile } = useIsCompact()
  const effectsRef = useRef<GameplayEffectsRef>(null)
  
  // Local state - simplified for Magic 8-Ball 50/50 game
  const [hasPlayed, setHasPlayed] = useState(false)
  const [lastGameResult, setLastGameResult] = useState<'win' | 'lose' | null>(null)
  const [resultIndex, setResultIndex] = useState(-1)
  
  // Local lucky number state (like 2D version)
  const [luckyNumberState, setLuckyNumberState] = useState<LuckyNumberState>({
    currentNumber: 0,
    targetNumber: 0,
    isAnimating: false,
    animationProgress: 0,
    particles: [],
    randomSequence: [],
    currentSequenceIndex: 0
  })
  
  // Animation refs
  const animationFrameRef = useRef<number>()
  const animationStartTimeRef = useRef<number>(0)
  
  const gameStats = useGameStats('magic8ball')
  
  // Get Magic 8-Ball multiplier from RTP config
  const multiplier = (BET_ARRAYS_V3 as any)['magic8ball'].getMultiplier()
  const maxWin = multiplier * wager
  const poolExceeded = maxWin > pool.maxPayout
  
  // Animation constants
  const ANIMATION_DURATION = 2500
  
  // Animation function (same logic as 2D)
  const animate = useCallback((currentTime: number) => {
    if (animationStartTimeRef.current === 0) {
      animationStartTimeRef.current = currentTime
    }

    const elapsed = currentTime - animationStartTimeRef.current
    const progress = Math.min(elapsed / ANIMATION_DURATION, 1)

    // Calculate which number to show based on elapsed time
    const numberDuration = 80 // ms per number (same as 2D)
    const totalNumbers = 20
    const currentNumberIndex = Math.min(
      Math.floor(elapsed / numberDuration),
      totalNumbers - 1
    )

    setLuckyNumberState(prev => {
      // Check if animation is complete
      const isComplete = progress >= 1 || currentNumberIndex >= totalNumbers - 1

      if (isComplete) {
        // Animation complete
        return {
          ...prev,
          isAnimating: false,
          animationProgress: 1,
          currentSequenceIndex: totalNumbers - 1
        }
      }

      // Continue animation
      animationFrameRef.current = requestAnimationFrame(animate)

      return {
        ...prev,
        animationProgress: progress,
        currentSequenceIndex: currentNumberIndex
      }
    })
  }, [ANIMATION_DURATION])

  // Start animation function (same logic as 2D)
  const startLuckyNumberAnimation = useCallback((targetNumber: number | string) => {
    // Generate sequence showing "Thinking..." during animation
    const sequence: (number | string)[] = []
    const totalNumbers = 20
    const targetText = typeof targetNumber === 'string' ? targetNumber : (targetNumber === 1 ? 'Win' : 'Lose')

    // Add "Thinking..." for all animation frames except the last
    for (let i = 0; i < totalNumbers - 1; i++) {
      sequence.push('Thinking...')
    }

    // Add the actual result at the end
    sequence.push(targetText)

    setLuckyNumberState({
      currentNumber: 0,
      targetNumber,
      isAnimating: true,
      animationProgress: 0,
      particles: [],
      randomSequence: sequence,
      currentSequenceIndex: 0
    })

    // Reset timing and start animation
    animationStartTimeRef.current = 0
    animationFrameRef.current = requestAnimationFrame(animate)
  }, [animate])
  
  // Calculate display text (same logic as 2D)
  const displayNumber = useMemo(() => {
    if (luckyNumberState.isAnimating) {
      if (luckyNumberState.randomSequence.length > 0 && luckyNumberState.currentSequenceIndex < luckyNumberState.randomSequence.length) {
        return luckyNumberState.randomSequence[luckyNumberState.currentSequenceIndex]
      } else if (luckyNumberState.targetNumber !== 0 && luckyNumberState.targetNumber !== '') {
        return luckyNumberState.targetNumber
      } else {
        return 'Thinking...'
      }
    } else if (luckyNumberState.targetNumber !== 0 && luckyNumberState.targetNumber !== '') {
      return luckyNumberState.targetNumber
    } else if (hasPlayed && resultIndex >= 0) {
      return resultIndex === 1 ? 'Win' : 'Lose'
    } else if (gamba.isPlaying) {
      return 'Thinking...'
    }
    return '-'
  }, [luckyNumberState, resultIndex, hasPlayed, gamba.isPlaying])

  // Play function (same logic as 2D)
  const play = async () => {
    if (wager <= 0) return

    // Reset game state
    setHasPlayed(false)
    setResultIndex(-1)
    setLastGameResult(null)

    // Reset lucky number state
    setLuckyNumberState(prev => ({
      ...prev,
      currentNumber: 0,
      targetNumber: 0,
      isAnimating: false,
      animationProgress: 0,
      particles: [],
      randomSequence: [],
      currentSequenceIndex: 0
    }))

    // Reset animation timing
    animationStartTimeRef.current = 0
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = undefined
    }

  // Get Magic 8-Ball bet array from RTP v3 config
  const betArray = (BET_ARRAYS_V3 as any)['magic8ball'].calculateBetArray()

    await game.play({ wager, bet: betArray })
    const result = await game.result()
    const win = result.payout > 0

    // Store the game result
    setLastGameResult(win ? 'win' : 'lose')

    // Determine win/lose outcome for Magic 8-Ball
    const outcome = win ? 'Win' : 'Lose'

    setResultIndex(win ? 1 : 0)

    // Update game statistics
    const profit = result.payout - wager
    gameStats.updateStats(profit)

    // Start animation after a small delay
    setTimeout(() => startLuckyNumberAnimation(outcome), 50)

    // Mark game as played after animation
    setTimeout(() => {
      setHasPlayed(true)
    }, ANIMATION_DURATION + 100)
  }

  // Reset game
  const resetGame = () => {
    setHasPlayed(false)
    setResultIndex(-1)
    setLastGameResult(null)
    setLuckyNumberState(prev => ({
      ...prev,
      currentNumber: 0,
      targetNumber: 0,
      isAnimating: false,
      animationProgress: 0,
      particles: [],
      randomSequence: [],
      currentSequenceIndex: 0
    }))
  }
  
  return (
    <>
      {/* Recent Plays Portal - positioned above stats */}
      <GambaUi.Portal target="recentplays">
        <GameRecentPlaysHorizontal gameId="magic8ball" />
      </GambaUi.Portal>

      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Magic 8-Ball"
          gameMode="3D"
          rtp="95"
          stats={gameStats.stats}
          onReset={gameStats.resetStats}
          isMobile={isMobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <Container3D 
          $gameState={
            lastGameResult === 'win' && !luckyNumberState.isAnimating ? 'win' :
            lastGameResult === 'lose' && !luckyNumberState.isAnimating ? 'lose' :
            luckyNumberState.isAnimating ? 'playing' : 'idle'
          }
        >
          {/* Mystical floating elements overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 2,
            opacity: luckyNumberState.isAnimating ? 0.6 : 0.3,
            transition: 'opacity 0.5s ease'
          }}>
            {/* Floating runes/symbols */}
            {['✦', '✧', '✩', '✪', '✫', '✬', '✭', '✮'].map((rune, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  color: 'rgba(255, 215, 0, 0.6)',
                  fontSize: '24px',
                  fontFamily: 'serif',
                  left: `${10 + (i * 10)}%`,
                  top: `${20 + Math.sin(i * 0.8) * 30}%`,
                  transform: `rotate(${i * 45}deg)`,
                  animation: luckyNumberState.isAnimating ? `float${i} 3s ease-in-out infinite` : 'none'
                }}
              >
                {rune}
              </div>
            ))}
            
            {/* Mystical circles */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`circle-${i}`}
                style={{
                  position: 'absolute',
                  width: `${30 + i * 10}px`,
                  height: `${30 + i * 10}px`,
                  borderRadius: '50%',
                  border: '2px solid rgba(138, 43, 226, 0.3)',
                  left: `${20 + (i * 12)}%`,
                  top: `${30 + (i * 8)}%`,
                  animation: luckyNumberState.isAnimating ? `orbit${i} 4s linear infinite` : 'none'
                }}
              />
            ))}
          </div>

          <Suspense fallback={<LoadingFallback>Loading Magic 8-Ball...</LoadingFallback>}>
            <Canvas
              camera={{ 
                position: [0, 0, isMobile ? 3.5 : 4], 
                fov: isMobile ? 60 : 50 
              }}
              style={{ width: '100%', height: '100%', zIndex: 3 }}
            >
              <ambientLight intensity={0.4} />
              <spotLight 
                position={[10, 10, 10]} 
                angle={0.15} 
                penumbra={1} 
                intensity={1}
                castShadow
              />
              <pointLight position={[-10, -10, -10]} intensity={0.5} />
              
              <Environment preset="night" />
              
              {/* Center the Magic 8-Ball perfectly */}
              <group position={[0, 0, 0]}>
                <Magic8Ball3DComponent
                  number={displayNumber}
                  isAnimating={luckyNumberState.isAnimating}
                  isShaking={gamba.isPlaying}
                  isWin={lastGameResult === 'win'}
                  isLose={lastGameResult === 'lose'}
                  mobile={isMobile}
                />
              </group>
              
              <OrbitControls
                enablePan={false}
                enableZoom={true}
                minDistance={isMobile ? 2.5 : 2}
                maxDistance={isMobile ? 6 : 8}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI - Math.PI / 4}
                target={[0, 0, 0]}
              />
            </Canvas>
          </Suspense>
          

          
          <GameplayFrame
            ref={effectsRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              zIndex: 1000
            }}
            {...(useGameMeta('magic8ball') && {
              title: useGameMeta('magic8ball')!.name,
              description: useGameMeta('magic8ball')!.description
            })}
          />
        </Container3D>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        <MobileControls
          wager={wager}
          setWager={setWager}
          onPlay={hasPlayed ? resetGame : play}
          playDisabled={gamba.isPlaying || (!hasPlayed && luckyNumberState.isAnimating) || poolExceeded}
          playText={hasPlayed ? "New Game" : "Ask Magic 8-Ball"}
        />

        <DesktopControls
          onPlay={hasPlayed ? resetGame : play}
          playDisabled={gamba.isPlaying || (!hasPlayed && luckyNumberState.isAnimating) || poolExceeded}
          playText={hasPlayed ? "New Game" : "Ask Magic 8-Ball"}
        >
          <EnhancedWagerInput value={wager} onChange={setWager} />
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}

export default Magic8Ball3D
