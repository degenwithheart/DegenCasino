import React, { Suspense } from 'react'
import { useUserStore } from '../../hooks/data/useUserStore'
import { GAME_CAPABILITIES } from '../../constants'

// Lazy load 2D and 3D components
const Flip2D = React.lazy(() => import('./Flip-2D'))
const Flip3D = React.lazy(() => import('./Flip-3D'))

export default function FlipWrapper() {
  // Get current render mode for this game
  const renderMode = useUserStore(state => state.getGameRenderMode('flip-v2'))
  
  // Check if game supports 3D
  const gameSupports3D = GAME_CAPABILITIES['flip-v2']?.supports3D ?? false
  
  // If 3D is not supported or not available, default to 2D
  const shouldRender3D = gameSupports3D && renderMode === '3D'
  
  console.log('🎲 Flip Wrapper - Render Mode:', renderMode, 'Supports3D:', gameSupports3D, 'ShouldRender3D:', shouldRender3D)
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {shouldRender3D ? <Flip3D /> : <Flip2D />}
    </Suspense>
  )
}