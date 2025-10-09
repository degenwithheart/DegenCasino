import React, { Suspense } from 'react';
import { useUserStore } from '../../hooks/data/useUserStore';

const Jackpot2D = React.lazy(() => import('./Jackpot-2D'));
const Jackpot3D = React.lazy(() => import('./Jackpot-3D'));

export default function Jackpot() {
  const renderMode = useUserStore((state) => state.gameRenderMode);

  const GameComponent = renderMode === '3D' ? Jackpot3D : Jackpot2D;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameComponent />
    </Suspense>
  );
}
