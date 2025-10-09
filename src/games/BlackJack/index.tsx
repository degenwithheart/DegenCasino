import React, { Suspense } from 'react';
import { useUserStore } from '../../hooks/data/useUserStore';
import { useGameSEO } from '../../hooks/ui/useGameSEO';
import { ALL_GAMES } from '../allGames';

// Lazy load 2D and 3D components
const BlackJack2D = React.lazy(() => import('./BlackJack-2D'));
const BlackJack3D = React.lazy(() => import('./BlackJack-3D'));

export default function BlackJackWrapper() {
  const seoHelmet = useGameSEO({
    gameName: 'BlackJack',
    description: `Classic casino card game where you compete against the dealer to get as close to 21 as possible without going over. Get a blackjack for the highest payout!`,
    maxWin: '2.5x'
  });

  const renderMode = useUserStore(state => state.getGameRenderMode('blackjack'));
  const blackjackGame = ALL_GAMES.find(g => g.id === 'blackjack');
  const gameSupports3D = blackjackGame?.capabilities?.supports3D ?? false;
  const shouldRender3D = gameSupports3D && renderMode === '3D';

  return (
    <>
      {seoHelmet}
      <Suspense fallback={<div>Loading BlackJack...</div>}>
        {shouldRender3D ? <BlackJack3D /> : <BlackJack2D logo="" />}
      </Suspense>
    </>
  );
}