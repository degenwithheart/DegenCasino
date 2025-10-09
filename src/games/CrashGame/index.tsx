import React, { Suspense } from 'react';
import { useUserStore } from '../../hooks/data/useUserStore';
import { useGameSEO } from '../../hooks/ui/useGameSEO';
import { ALL_GAMES } from '../allGames';

// Lazy load 2D and 3D components
const CrashGame2D = React.lazy(() => import('./CrashGame-2D'));
const CrashGame3D = React.lazy(() => import('./CrashGame-3D'));

export default function CrashGameWrapper() {
  const seoHelmet = useGameSEO({
    gameName: 'Crash Game',
    description: `Test your luck with the rocket crash game! Set your target multiplier and watch the rocket soar. Cash out before it crashes to secure your winnings.`,
    maxWin: 'varies'
  });

  const renderMode = useUserStore(state => state.getGameRenderMode('crash'));
  const crashGame = ALL_GAMES.find(g => g.id === 'crash');
  const gameSupports3D = crashGame?.capabilities?.supports3D ?? false;
  const shouldRender3D = gameSupports3D && renderMode === '3D';

  return (
    <>
      {seoHelmet}
      <Suspense fallback={<div>Loading Crash Game...</div>}>
        {shouldRender3D ? <CrashGame3D /> : <CrashGame2D />}
      </Suspense>
    </>
  );
}
