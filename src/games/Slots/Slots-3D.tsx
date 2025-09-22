import React, { useRef, useState, useEffect, useMemo } from 'react'
import { GambaUi } from 'gamba-react-ui-v2'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, OrbitControls, Environment } from '@react-three/drei'
import { EnhancedWagerInput, EnhancedPlayButton, MobileControls, DesktopControls } from '../../components'
import { GameStatsHeader } from '../../components/Game/GameStatsHeader'
import { useIsCompact } from '../../hooks/ui/useIsCompact'
import styled from 'styled-components'
import * as THREE from 'three'
import {
  SlotMode,
  getNumSlots,
  getNumReels,
  getNumRows,
  getNumPaylines,
  SLOT_ITEMS,
  SlotItem,
} from './constants'
import { useSlotsGameLogic } from './sharedLogic'

// Styled Container for 3D Scene
const Container3D = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f1419 100%);
  border-radius: 12px;
  overflow: hidden;
  min-height: 400px;
`

const LoadingFallback = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: white;
  font-size: 18px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f1419 100%);
`

// Get symbol colors for 3D rendering
const getSymbolColor = (multiplier: number): string => {
  if (multiplier >= 175) return '#ff6b9d' // MYTHICAL - Pink
  if (multiplier >= 87) return '#ffd700' // LEGENDARY - Gold  
  if (multiplier >= 35) return '#9d4edd' // DGHRT - Purple
  if (multiplier >= 12) return '#06ffa5' // SOL - Green
  if (multiplier >= 5) return '#277da1' // USDC - Blue
  if (multiplier >= 2.5) return '#f77f00' // JUP - Orange
  if (multiplier >= 2) return '#fcbf49' // BONK - Yellow
  return '#666666' // WOJAK - Gray
}

// Get symbol text representation
const getSymbolText = (item: SlotItem): string => {
  if (item.multiplier >= 175) return '💎' // MYTHICAL
  if (item.multiplier >= 87) return '👑' // LEGENDARY
  if (item.multiplier >= 35) return '🚀' // DGHRT
  if (item.multiplier >= 12) return '☀️' // SOL
  if (item.multiplier >= 5) return '💰' // USDC
  if (item.multiplier >= 2.5) return '🪐' // JUP
  if (item.multiplier >= 2) return '🐕' // BONK
  return '😢' // WOJAK
}

// 3D Reel Component
interface Reel3DProps {
  position: [number, number, number]
  items: SlotItem[]
  isSpinning: boolean
  revealProgress: number
  isWinning: boolean[]
  mobile: boolean
}

const Reel3D: React.FC<Reel3DProps> = ({ 
  position, 
  items, 
  isSpinning, 
  revealProgress,
  isWinning,
  mobile 
}) => {
  const reelRef = useRef<THREE.Group>(null)
  const [spinSpeed, setSpinSpeed] = useState(0)
  
  // Reel dimensions - smaller for mobile
  const reelRadius = mobile ? 0.4 : 0.5
  const reelHeight = mobile ? 1.8 : 2.4
  const symbolSpacing = reelHeight / 3 // 3 symbols visible
  
  useEffect(() => {
    if (isSpinning) {
      setSpinSpeed(20) // High speed spinning
    } else {
      setSpinSpeed(0) // Stop immediately when revealed
    }
  }, [isSpinning, revealProgress])

  useFrame((state, delta) => {
    if (reelRef.current && spinSpeed > 0) {
      reelRef.current.rotation.y += spinSpeed * delta
    }
  })

  return (
    <group ref={reelRef} position={position}>
      {/* Reel Cylinder */}
      <mesh>
        <cylinderGeometry args={[reelRadius, reelRadius, reelHeight, 12]} />
        <meshStandardMaterial 
          color="#2a2a3e" 
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {/* Symbols on the reel */}
      {items.map((item, index) => {
        const angle = (index / 3) * Math.PI * 2
        const x = Math.sin(angle) * reelRadius * 1.1
        const z = Math.cos(angle) * reelRadius * 1.1
        const y = (index - 1) * symbolSpacing
        
        const isWin = isWinning[index]
        const symbolColor = getSymbolColor(item.multiplier)
        const symbolText = getSymbolText(item)
        
        return (
          <group key={index} position={[x, y, z]} rotation={[0, -angle, 0]}>
            {/* Symbol Background */}
            <mesh position={[0, 0, 0.05]}>
              <planeGeometry args={[mobile ? 0.6 : 0.8, mobile ? 0.4 : 0.5]} />
              <meshStandardMaterial 
                color={isWin ? '#ffffff' : '#1a1a2e'}
                emissive={isWin ? symbolColor : '#000000'}
                emissiveIntensity={isWin ? 0.3 : 0}
                transparent
                opacity={0.9}
              />
            </mesh>
            
            {/* Symbol Text */}
            <Text
              position={[0, 0, 0.1]}
              fontSize={mobile ? 0.25 : 0.3}
              color={isWin ? '#ffffff' : symbolColor}
              anchorX="center"
              anchorY="middle"
              font="/fonts/Inter-Bold.woff"
            >
              {symbolText}
            </Text>
            
            {/* Win Glow Effect */}
            {isWin && (
              <pointLight
                position={[0, 0, 0.2]}
                color={symbolColor}
                intensity={2}
                distance={2}
              />
            )}
          </group>
        )
      })}
    </group>
  )
}

// Main 3D Scene Component
interface SlotMachine3DProps {
  gameState: any
  mobile: boolean
}

const SlotMachine3D: React.FC<SlotMachine3DProps> = ({ gameState, mobile }) => {
  const {
    combination,
    spinning,
    revealedSlots,
    good,
    winningPaylines,
    NUM_REELS,
    NUM_ROWS
  } = gameState

  // Calculate reel spacing - tighter on mobile
  const reelSpacing = mobile ? 1.2 : 1.5
  const totalWidth = (NUM_REELS - 1) * reelSpacing
  const startX = -totalWidth / 2

  return (
    <>
      {/* Lighting Setup */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1}
        color="#ffd700"
        castShadow
      />
      <pointLight 
        position={[0, 0, 3]} 
        intensity={0.5} 
        color="#ffffff"
      />
      
      {/* Environment */}
      <Environment preset="night" />
      
      {/* Camera Controls - Limited for mobile */}
      <OrbitControls 
        enablePan={false}
        enableZoom={mobile ? false : true}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
        maxAzimuthAngle={Math.PI / 6}
        minAzimuthAngle={-Math.PI / 6}
      />
      
      {/* Slot Machine Cabinet */}
      <mesh position={[0, 0, -1]}>
        <boxGeometry args={[totalWidth + 2, 4, 0.5]} />
        <meshStandardMaterial 
          color="#1a1a2e"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Reels */}
      {Array.from({ length: NUM_REELS }).map((_, reelIndex) => {
        const reelItems = Array.from({ length: NUM_ROWS }).map((_, rowIndex) => {
          const slotIndex = reelIndex * NUM_ROWS + rowIndex
          return combination[slotIndex] || SLOT_ITEMS[0]
        })
        
        const reelWinning = Array.from({ length: NUM_ROWS }).map((_, rowIndex) => {
          const slotIndex = reelIndex * NUM_ROWS + rowIndex
          return good && winningPaylines.some((line: any) => line.payline.includes(slotIndex))
        })
        
        const reelRevealed = revealedSlots > reelIndex * NUM_ROWS
        const isReelSpinning = spinning && !reelRevealed
        
        return (
          <Reel3D
            key={reelIndex}
            position={[startX + reelIndex * reelSpacing, 0, 0]}
            items={reelItems}
            isSpinning={isReelSpinning}
            revealProgress={revealedSlots}
            isWinning={reelWinning}
            mobile={mobile}
          />
        )
      })}
      
      {/* Win Line Visualization */}
      {good && winningPaylines.length > 0 && (
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[totalWidth + 1, 0.1]} />
          <meshStandardMaterial 
            color="#ffd700"
            emissive="#ffd700"
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
    </>
  )
}

// Main 3D Slots Component
export default function Slots3D() {
  // Use shared game logic
  const {
    wager,
    bet,
    maxMultiplier,
    isValid,
    spinning,
    result,
    combination,
    revealedSlots,
    good,
    winningPaylines,
    winningSymbol,
    gameStats,
    setWager,
    play,
    handleResetStats,
  } = useSlotsGameLogic()
  
  // Mobile detection using the hook
  const { mobile: isMobile } = useIsCompact()
  
  // Dynamic values based on screen size
  const slotMode: SlotMode = isMobile ? 'classic' : 'wide'
  const NUM_REELS = getNumReels(slotMode)
  const NUM_ROWS = getNumRows(slotMode)
  const NUM_SLOTS = getNumSlots(slotMode)
  const NUM_PAYLINES = getNumPaylines(slotMode)

  // Prepare game state for 3D scene
  const gameState = useMemo(() => ({
    combination,
    spinning,
    revealedSlots,
    good,
    winningPaylines,
    winningSymbol,
    NUM_REELS,
    NUM_ROWS,
    NUM_SLOTS
  }), [combination, spinning, revealedSlots, good, winningPaylines, winningSymbol, NUM_REELS, NUM_ROWS, NUM_SLOTS])

  return (
    <>
      {/* Stats Portal */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Slots"
          gameMode="3D Mode"
          rtp="94"
          stats={gameStats}
          onReset={handleResetStats}
          isMobile={isMobile}
        />
      </GambaUi.Portal>

      {/* 3D Scene */}
      <GambaUi.Portal target="screen">
        <Container3D>
          <Canvas
            camera={{ 
              position: isMobile ? [0, 1, 6] : [0, 2, 8], 
              fov: isMobile ? 50 : 45 
            }}
            dpr={isMobile ? 1 : 2} // Lower DPI on mobile for performance
          >
            <SlotMachine3D gameState={gameState} mobile={isMobile} />
          </Canvas>
        </Container3D>
      </GambaUi.Portal>

      {/* Controls Portal */}
      <GambaUi.Portal target="controls">
        <MobileControls
          wager={wager}
          setWager={setWager}
          onPlay={play}
          playDisabled={!isValid || spinning}
          playText={spinning ? "Spinning..." : "Spin"}
        />
        
        <DesktopControls
          wager={wager}
          setWager={setWager}
          onPlay={play}
          playDisabled={!isValid || spinning}
          playText={spinning ? "Spinning..." : "Spin"}
        >
          <EnhancedWagerInput 
            value={wager} 
            onChange={setWager} 
            multiplier={maxMultiplier} 
            disabled={spinning}
          />
          <EnhancedPlayButton 
            disabled={!isValid || spinning} 
            onClick={play}
          >
            {spinning ? "Spinning..." : "Spin"}
          </EnhancedPlayButton>
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}
