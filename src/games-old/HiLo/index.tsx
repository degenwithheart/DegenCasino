import React, { Suspense } from 'react'
import { useUserStore } from '../../hooks/data/useUserStore'
import { GAME_CAPABILITIES } from '../../constants'
import { useGameSEO } from '../../hooks/ui/useGameSEO'

// Lazy load 2D and 3D components
const HiLo2D = React.lazy(() => import('./HiLo-2D'))
const HiLo3D = React.lazy(() => import('./HiLo-3D'))

export default function HiLoWrapper() {
  // SEO for HiLo game
  const seoHelmet = useGameSEO({
    gameName: "HiLo",
    description: "Guess if the next card is higher or lower! Simple yet exciting card prediction game with consecutive win multipliers",
    rtp: 96,
    maxWin: "100x"
  })

  // Get current render mode for this game
  const renderMode = useUserStore(state => state.getGameRenderMode('hilo'))
  
  // Check if game supports 3D
  const gameSupports3D = GAME_CAPABILITIES.hilo?.supports3D ?? false
  
  // If 3D is not supported or not available, default to 2D
  const shouldRender3D = gameSupports3D && renderMode === '3D'
  
  console.log('🃏 HiLo Wrapper - Render Mode:', renderMode, 'Supports3D:', gameSupports3D, 'ShouldRender3D:', shouldRender3D)
  
  return (
    <>
      {seoHelmet}
      <Suspense fallback={<div>Loading...</div>}>
        {shouldRender3D ? <HiLo3D /> : <HiLo2D logo={''} />}
      </Suspense>
    </>
  )
}