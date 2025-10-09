import React, { Suspense } from 'react';
import { useUserStore } from '../../hooks/data/useUserStore';
import { useGameSEO } from '../../hooks/ui/useGameSEO';
import { ALL_GAMES } from '../allGames';

// Lazy load 2D and 3D components
const Mines2D = React.lazy(() => import('./Mines-2D'));
const Mines3D = React.lazy(() => import('./Mines-3D'));

export default function MinesWrapper() {
  const seoHelmet = useGameSEO({
    gameName: 'Mines',
    description: 'Mines game — select tiles and avoid the mines.',
    maxWin: 'varies'
  });

  const renderMode = useUserStore(state => state.getGameRenderMode('mines'));
  const minesGame = ALL_GAMES.find(g => g.id === 'mines');
  const gameSupports3D = minesGame?.capabilities?.supports3D ?? false;
  const shouldRender3D = gameSupports3D && renderMode === '3D';

  return (
    <>
      {seoHelmet}
      <Suspense fallback={<div>Loading Mines...</div>}>
        {shouldRender3D ? <Mines3D /> : <Mines2D />}
      </Suspense>
    </>
  );
}

