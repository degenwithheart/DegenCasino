import React, { Suspense } from 'react';
import { useUserStore } from '../../hooks/data/useUserStore';

const Roulette2D = React.lazy(() => import('./Roulette-2D'));
const Roulette3D = React.lazy(() => import('./Roulette-3D'));

export default function Roulette() {
  const renderMode = useUserStore((state) => state.gameRenderMode);

  const GameComponent = renderMode === '3D' ? Roulette3D : Roulette2D;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameComponent />
    </Suspense>
  );
}
