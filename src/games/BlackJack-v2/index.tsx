import React, { Suspense } from 'react'
import { useUserStore } from '../../hooks/data/useUserStore'
import { GAME_CAPABILITIES } from '../../constants'

// Lazy load 2D and 3D components
const BlackJack2D = React.lazy(() => import('./BlackJack-2D'))
const BlackJack3D = React.lazy(() => import('./BlackJack-3D'))

export default function BlackJackWrapper() {
  // Get current render mode for this game
  const renderMode = useUserStore(state => state.getGameRenderMode('blackjack'))
  
  // Check if game supports 3D
  const gameSupports3D = GAME_CAPABILITIES.blackjack?.supports3D ?? false
  
  // If 3D is not supported or not available, default to 2D
  const shouldRender3D = gameSupports3D && renderMode === '3D'
  
  console.log('🃏 BlackJack Wrapper - Render Mode:', renderMode, 'Supports3D:', gameSupports3D, 'ShouldRender3D:', shouldRender3D)
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {shouldRender3D ? <BlackJack3D /> : <BlackJack2D />}
    </Suspense>
  )
}