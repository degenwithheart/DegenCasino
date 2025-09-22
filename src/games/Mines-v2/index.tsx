import React, { Suspense } from 'react'
import { useUserStore } from '../../hooks/data/useUserStore'
import { GAME_CAPABILITIES } from '../../constants'
import { useGameSEO } from '../../hooks/ui/useGameSEO'

// Lazy load 2D and 3D components
const Mines2D = React.lazy(() => import('./Mines-2D'))
const Mines3D = React.lazy(() => import('./Mines-3D'))

export default function MinesWrapper() {
  // SEO for Mines game
  const seoHelmet = useGameSEO({
    gameName: "Mines",
    description: "Navigate the minefield and find hidden gems! Choose your risk level and discover treasures while avoiding mines",
    rtp: 97,
    maxWin: "500x"
  })

  // Get current render mode for this game
  const renderMode = useUserStore(state => state.getGameRenderMode('mines-v2'))
  
  // Check if game supports 3D
  const gameSupports3D = GAME_CAPABILITIES['mines-v2']?.supports3D ?? false
  
  // If 3D is not supported or not available, default to 2D
  const shouldRender3D = gameSupports3D && renderMode === '3D'
  
  console.log('💣 Mines Wrapper - Render Mode:', renderMode, 'Supports3D:', gameSupports3D, 'ShouldRender3D:', shouldRender3D)
  
  return (
    <>
      {seoHelmet}
      <Suspense fallback={<div>Loading...</div>}>
        {shouldRender3D ? <Mines3D /> : <Mines2D />}
      </Suspense>
    </>
  )
}