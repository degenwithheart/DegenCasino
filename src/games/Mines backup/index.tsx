import React, { Suspense } from 'react'
import { useUserStore } from '../../hooks/data/useUserStore'
import { GAME_CAPABILITIES } from '../../constants'
import { useGameSEO } from '../../hooks/ui/useGameSEO'

// Lazy load 2D and 3D components
const Mines2D = React.lazy(() => import('./Mines-2D'))
const Mines3D = React.lazy(() => import('./Mines-3D'))

export default function MinesWrapper() {
  const seoHelmet = useGameSEO({
    gameName: 'Mines',
    description: 'Mines game — select tiles and avoid the mines.',
    maxWin: 'varies'
  })

  const renderMode = useUserStore(state => state.getGameRenderMode('mines'))
  const gameSupports3D = GAME_CAPABILITIES['mines']?.supports3D ?? false
  const shouldRender3D = gameSupports3D && renderMode === '3D'

  return (
    <>
      {seoHelmet}
      <Suspense fallback={<div>Loading Mines...</div>}>
        {shouldRender3D ? <Mines3D /> : <Mines2D />}
      </Suspense>
    </>
  )
}

