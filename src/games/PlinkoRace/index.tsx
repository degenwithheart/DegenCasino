import React, { Suspense } from 'react';
import { useUserStore } from '../../hooks/data/useUserStore';

const PlinkoRace2D = React.lazy(() => import('./PlinkoRace-2D'));
const PlinkoRace3D = React.lazy(() => import('./PlinkoRace-3D'));

export default function PlinkoRace() {
  const renderMode = useUserStore((state) => state.gameRenderMode);

  const GameComponent = renderMode === '3D' ? PlinkoRace3D : PlinkoRace2D;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameComponent />
    </Suspense>
  );
}
