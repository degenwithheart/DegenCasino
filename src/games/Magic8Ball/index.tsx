import React, { Suspense } from 'react';
import { useUserStore } from '../../hooks/data/useUserStore';
import { useGameSEO } from '../../hooks/ui/useGameSEO';
import { ALL_GAMES } from '../allGames';

// Lazy load 2D and 3D components
const Magic8Ball2D = React.lazy(() => import('./Magic8Ball-2D'));
const Magic8Ball3D = React.lazy(() => import('./Magic8Ball-3D'));

export default function Magic8BallWrapper() {
  const seoHelmet = useGameSEO({
    gameName: 'Magic 8 Ball',
    description: 'Magic 8 Ball game — ask a question and receive an answer.',
    maxWin: 'varies'
  });

  const renderMode = useUserStore(state => state.getGameRenderMode('magic8ball'));
  const magic8ballGame = ALL_GAMES.find(g => g.id === 'magic8ball');
  const gameSupports3D = magic8ballGame?.capabilities?.supports3D ?? false;
  const shouldRender3D = gameSupports3D && renderMode === '3D';

  return (
    <>
      {seoHelmet}
      <Suspense fallback={<div>Loading Magic 8 Ball...</div>}>
        {shouldRender3D ? <Magic8Ball3D /> : <Magic8Ball2D />}
      </Suspense>
    </>
  );
}

