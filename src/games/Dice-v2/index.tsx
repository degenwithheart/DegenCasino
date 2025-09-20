import React from 'react'
import { useUserStore } from '../../hooks/data/useUserStore'
import { GAME_CAPABILITIES } from '../../constants'

// Lazy load both renderers
const DiceV2Renderer2D = React.lazy(() => import('./Dice-v2-2D'))
const DiceV2Renderer3D = React.lazy(() => import('./Dice-v2-3D'))

const DiceV2Game: React.FC = () => {
  // Use the reactive selector pattern to ensure re-renders
  const currentMode = useUserStore(state => state.getGameRenderMode('dice-v2'))
  
  const gameCapabilities = GAME_CAPABILITIES['dice-v2']

  // Determine which renderer to use
  const shouldUse2D = currentMode === '2D' && gameCapabilities.supports2D
  const shouldUse3D = currentMode === '3D' && gameCapabilities.supports3D

  // Fallback to 2D if current mode is not supported
  const effectiveMode = shouldUse2D ? '2D' : shouldUse3D ? '3D' : '2D'

  console.log('🎯 DICE-V2 WRAPPER LOADING...', { 
    currentMode, 
    effectiveMode, 
    shouldUse2D, 
    shouldUse3D,
    timestamp: Date.now()
  })

  // Force re-render with key when mode changes
  const renderKey = `dice-v2-${effectiveMode}`

  return (
    <div key={renderKey}>
      <React.Suspense fallback={<div>Loading dice game...</div>}>
        {effectiveMode === '2D' ? <DiceV2Renderer2D /> : <DiceV2Renderer3D />}
      </React.Suspense>
    </div>
  )
}

export default DiceV2Game
