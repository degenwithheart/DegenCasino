import React, { Suspense } from 'react'
import { useUserStore } from '../../hooks/data/useUserStore'
import { GAME_CAPABILITIES } from '../../constants'

// Lazy load 2D and 3D components
const Crash2D = React.lazy(() => import('./Crash-2D'))
const Crash3D = React.lazy(() => import('./Crash-3D'))

export default function CrashWrapper() {
  // Get current render mode for this game
  const renderMode = useUserStore(state => state.getGameRenderMode('crash'))
  
  // Check if game supports 3D
  const gameSupports3D = GAME_CAPABILITIES.crash?.supports3D ?? false
  
  // If 3D is not supported or not available, default to 2D
  const shouldRender3D = gameSupports3D && renderMode === '3D'
  
  console.log('🚀 Crash Wrapper - Render Mode:', renderMode, 'Supports3D:', gameSupports3D, 'ShouldRender3D:', shouldRender3D)
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {shouldRender3D ? <Crash3D /> : <Crash2D />}
    </Suspense>
  )
}