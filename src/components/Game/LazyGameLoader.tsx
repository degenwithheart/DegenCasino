import React, { Suspense, lazy } from 'react';
import { LoadingBar } from '../../sections/Game/LoadingBar';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 20px;
`;

const LoadingText = styled.div`
  color: var(--gamba-ui-color);
  font-size: 1.1rem;
  opacity: 0.8;
`;

// Lazy load all games
const lazyGames = {
  blackjack: lazy(() => import('../../games/BlackJack-v2')),
  plinko: lazy(() => import('../../games/Plinko')),
  'plinko-race': lazy(() => import('../../games/PlinkoRace')),
  roulette: lazy(() => import('../../games/Roulette')),
  slots: lazy(() => import('../../games/Slots')),
  mines: lazy(() => import('../../games/Mines-v2')),
  crash: lazy(() => import('../../games/CrashGame')),
  flip: lazy(() => import('../../games/Flip-v2')),
  hilo: lazy(() => import('../../games/HiLo')),
  'progressive-poker': lazy(() => import('../../games/MultiPoker-v2')),
};

interface LazyGameLoaderProps {
  gameId: string;
}

const GameLoadingFallback = ({ gameId }: { gameId: string }) => (
  <LoadingContainer>
    <LoadingText>Loading {gameId}...</LoadingText>
    <LoadingBar />
  </LoadingContainer>
);

export function LazyGameLoader({ gameId, ...props }: LazyGameLoaderProps & any) {
  const GameComponent = lazyGames[gameId as keyof typeof lazyGames];
  
  if (!GameComponent) {
    return <div>Game not found: {gameId}</div>;
  }

  return (
    <Suspense fallback={<GameLoadingFallback gameId={gameId} />}>
      <GameComponent {...props} />
    </Suspense>
  );
}

export default LazyGameLoader;
