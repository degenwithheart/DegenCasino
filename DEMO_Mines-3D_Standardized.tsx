/**
 * Demonstration: Mines-3D using the standardized ComingSoon3D component
 * This shows how easy it is to migrate existing 3D games to the new system
 */

import React from 'react'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import ComingSoon3D from '../../components/Game/ComingSoon3D'
import { getComingSoon3DProps } from '../../components/Game/game3DConfigs'
import { useMinesV2GameLogic } from './sharedLogic'
import { StyledMinesBackground } from './MinesBackground.enhanced.styles'
import { useGameMigration } from '../../hooks/ui/useGameMigration'

// Custom 3D scene for Mines with explosive elements
const MinesScene3D: React.FC = () => {
  return (
    <>
      {/* Dramatic lighting for mines theme */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.0} color="#ff5722" />
      <pointLight position={[-10, -10, -10]} intensity={0.7} color="#ffab40" />
      <pointLight position={[0, 15, 0]} intensity={0.5} color="#ff9800" />
      
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 8, 12]} fov={45} />
      
      {/* Controls */}
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        autoRotate
        autoRotateSpeed={0.8}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 6}
        maxDistance={20}
        minDistance={8}
      />
      
      {/* 3D Minefield grid visualization */}
      {Array.from({ length: 25 }, (_, i) => {
        const row = Math.floor(i / 5)
        const col = i % 5
        const x = (col - 2) * 2
        const z = (row - 2) * 2
        const isMine = Math.random() > 0.8 // Random mines for demo
        
        return (
          <group key={i} position={[x, 0, z]}>
            {/* Tile base */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.8, 0.2, 1.8]} />
              <meshStandardMaterial 
                color={isMine ? "#ff5722" : "#424242"}
                metalness={0.4}
                roughness={0.6}
                emissive={isMine ? "#ff5722" : "#000000"}
                emissiveIntensity={isMine ? 0.2 : 0}
              />
            </mesh>
            
            {/* Mine indicator (floating orb) */}
            {isMine && (
              <mesh position={[0, 1, 0]}>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial 
                  color="#ff1744"
                  emissive="#ff1744"
                  emissiveIntensity={0.5}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            )}
          </group>
        )
      })}
      
      {/* Floating danger signs */}
      <mesh position={[0, 6, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.5, 1, 3]} />
        <meshStandardMaterial 
          color="#ffab40"
          emissive="#ffab40"
          emissiveIntensity={0.3}
        />
      </mesh>
    </>
  )
}

export default function MinesV23D() {
  // Use shared game logic
  const {
    gameStats,
    handleResetStats,
    wager,
    setWager
  } = useMinesV2GameLogic()

  // Get mobile detection
  const { mobile } = useGameMigration()

  // Get standardized props for this game
  const comingSoonProps = getComingSoon3DProps('mines', 'Mines')

  return (
    <ComingSoon3D
      {...comingSoonProps}
      scene3D={MinesScene3D}
      gameStats={gameStats}
      onResetStats={handleResetStats}
      wager={wager}
      setWager={setWager}
      mobile={mobile}
      backgroundComponent={StyledMinesBackground}
    />
  )
}