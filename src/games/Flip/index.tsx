import React, { Suspense } from 'react'
import { useUserStore } from '../../hooks/data/useUserStore'
import { GAME_CAPABILITIES } from '../../constants'
import { useGameSEO } from '../../hooks/ui/useGameSEO'

// Lazy load 2D and 3D components
const Flip2D = React.lazy(() => import('./Flip-2D'))
const Flip3D = React.lazy(() => import('./Flip-3D'))

export default function FlipWrapper() {
  // SEO for Flip game
  const seoHelmet = useGameSEO({
    gameName: "Coin Flip",
    description: "Simple coin flip game with 50/50 odds! Choose heads or tails and double your money with this classic gambling game",
    maxWin: "2x"
  })

  // Get current render mode for this game
  const renderMode = useUserStore(state => state.getGameRenderMode('flip'))
  
  // Check if game supports 3D
  const gameSupports3D = GAME_CAPABILITIES['flip']?.supports3D ?? false
  
  // If 3D is not supported or not available, default to 2D
  const shouldRender3D = gameSupports3D && renderMode === '3D'
  
  console.log('🎲 Flip Wrapper - Render Mode:', renderMode, 'Supports3D:', gameSupports3D, 'ShouldRender3D:', shouldRender3D)
  
  return (
    <>
      {seoHelmet}
      <Suspense fallback={<div>Loading...</div>}>
        {shouldRender3D ? <Flip3D /> : <Flip2D />}
      </Suspense>
    </>
  )
}