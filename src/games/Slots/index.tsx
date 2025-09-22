import React, { Suspense } from 'react'
import { useUserStore } from '../../hooks/data/useUserStore'
import { GAME_CAPABILITIES } from '../../constants'
import { useGameSEO } from '../../hooks/ui/useGameSEO'

// Lazy load the 2D and 3D components
const SlotsRenderer2D = React.lazy(() => import('./Slots-2D'))
const SlotsRenderer3D = React.lazy(() => import('./Slots-3D'))

const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '400px',
    color: 'white',
    fontSize: '18px'
  }}>
    Loading Slots...
  </div>
)

export default function Slots() {
  // SEO for Slots game
  const seoHelmet = useGameSEO({
    gameName: "Slots",
    description: "Spin the reels and hit the jackpot! Classic slot machine with multiple paylines and bonus features",
    rtp: 96,
    maxWin: "1000x"
  })

  const currentMode = useUserStore(state => state.getGameRenderMode('slots'))
  const gameSupports3D = GAME_CAPABILITIES.slots?.supports3D ?? false
  
  // Determine which component to render
  const shouldUse3D = currentMode === '3D' && gameSupports3D
  
  console.log('🎯 SLOTS WRAPPER LOADING...', { 
    currentMode, 
    gameSupports3D, 
    shouldUse3D,
    timestamp: Date.now()
  })
  
  // Force re-render with key when mode changes
  const renderKey = `slots-${currentMode}-${shouldUse3D ? '3d' : '2d'}`
  
  return (
    <div key={renderKey}>
      {seoHelmet}
      <Suspense fallback={<LoadingFallback />}>
        {shouldUse3D ? <SlotsRenderer3D /> : <SlotsRenderer2D />}
      </Suspense>
    </div>
  )
}