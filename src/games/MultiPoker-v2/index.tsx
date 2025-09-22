import React, { Suspense } from 'react'
import { useUserStore } from '../../hooks/data/useUserStore'
import { GAME_CAPABILITIES } from '../../constants'
import { useGameSEO } from '../../hooks/ui/useGameSEO'

// Lazy load 2D and 3D components
const MultiPoker2D = React.lazy(() => import('./MultiPoker-2D'))
const MultiPoker3D = React.lazy(() => import('./MultiPoker-3D'))

export default function MultiPokerWrapper() {
  // SEO for MultiPoker game
  const seoHelmet = useGameSEO({
    gameName: "Multi Poker",
    description: "Play multiple poker hands simultaneously! Video poker with multiple betting lines and royal flush jackpots",
    rtp: 99,
    maxWin: "4000x"
  })

  // Get current render mode for this game
  const renderMode = useUserStore(state => state.getGameRenderMode('multipoker'))
  
  // Check if game supports 3D
  const gameSupports3D = GAME_CAPABILITIES.multipoker?.supports3D ?? false
  
  // If 3D is not supported or not available, default to 2D
  const shouldRender3D = gameSupports3D && renderMode === '3D'
  
  console.log('🃏 MultiPoker Wrapper - Render Mode:', renderMode, 'Supports3D:', gameSupports3D, 'ShouldRender3D:', shouldRender3D)
  
  return (
    <>
      {seoHelmet}
      <Suspense fallback={<div>Loading...</div>}>
        {shouldRender3D ? <MultiPoker3D /> : <MultiPoker2D />}
      </Suspense>
    </>
  )
}