import React, { Suspense, lazy } from 'react'
import { useUserStore } from '../../hooks/data/useUserStore'
import { GAME_CAPABILITIES } from '../../constants'

// Lazy load the 2D and 3D components
const PlinkoRenderer2D = lazy(() => import('./Plinko-2D'))
const PlinkoRenderer3D = lazy(() => import('./Plinko-3D'))

const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '400px',
    color: 'white',
    fontSize: '18px'
  }}>
    Loading Plinko...
  </div>
)

export default function Plinko() {
  // Use the reactive selector pattern to ensure re-renders
  const currentMode = useUserStore(state => state.getGameRenderMode('plinko'))
  const gameSupports3D = GAME_CAPABILITIES.plinko?.supports3D ?? false
  
  // Determine which component to render
  const shouldUse3D = currentMode === '3D' && gameSupports3D
  
  console.log('🎯 PLINKO WRAPPER LOADING...', { 
    currentMode, 
    gameSupports3D, 
    shouldUse3D,
    timestamp: Date.now()
  })
  
  // Force re-render with key when mode changes
  const renderKey = `plinko-${currentMode}-${shouldUse3D ? '3d' : '2d'}`
  
  return (
    <div key={renderKey}>
      <Suspense fallback={<LoadingFallback />}>
        {shouldUse3D ? <PlinkoRenderer3D /> : <PlinkoRenderer2D />}
      </Suspense>
    </div>
  )
}
