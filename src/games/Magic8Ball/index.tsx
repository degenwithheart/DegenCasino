import React from 'react'
import { useUserStore } from '../../hooks/data/useUserStore'
import { GAME_CAPABILITIES } from '../../constants'
import { useGameSEO } from '../../hooks/ui/useGameSEO'

// Lazy load both renderers
const Magic8BallRenderer2D = React.lazy(() => import('./Magic8Ball-2D'))
const Magic8BallRenderer3D = React.lazy(() => import('./Magic8Ball-3D'))

const Magic8BallGame: React.FC = () => {
  // SEO for Magic 8-Ball game
  const seoHelmet = useGameSEO({
    gameName: "Magic 8-Ball",
    description: "Consult the mystical Magic 8-Ball oracle! Ask your question and let cosmic forces reveal your fortune",
    rtp: 95,
    maxWin: "100x"
  })

  // Use the reactive selector pattern to ensure re-renders
  const currentMode = useUserStore(state => state.getGameRenderMode('magic8ball'))
  
  const gameCapabilities = GAME_CAPABILITIES['magic8ball']

  // Determine which renderer to use
  const shouldUse2D = currentMode === '2D' && gameCapabilities.supports2D
  const shouldUse3D = currentMode === '3D' && gameCapabilities.supports3D

  // Fallback to 2D if current mode is not supported
  const effectiveMode = shouldUse2D ? '2D' : shouldUse3D ? '3D' : '2D'

  console.log('🎯 MAGIC8BALL WRAPPER LOADING...', { 
    currentMode, 
    effectiveMode, 
    shouldUse2D, 
    shouldUse3D,
    timestamp: Date.now()
  })

  // Force re-render with key when mode changes
  const renderKey = `magic8ball-${effectiveMode}`

  return (
    <div key={renderKey}>
      {seoHelmet}
      <React.Suspense fallback={<div>Loading Magic 8-Ball game...</div>}>
        {effectiveMode === '2D' ? <Magic8BallRenderer2D /> : <Magic8BallRenderer3D />}
      </React.Suspense>
    </div>
  )
}

export default Magic8BallGame
