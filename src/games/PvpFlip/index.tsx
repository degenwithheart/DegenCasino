import React, { Suspense } from 'react';
import { useUserStore } from '../../hooks/data/useUserStore';

const PvpFlip2D = React.lazy(() => import('./PvpFlip-2D'));
const PvpFlip3D = React.lazy(() => import('./PvpFlip-3D'));

export default function PvpFlip() {
  const renderMode = useUserStore((state) => state.gameRenderMode);

  const GameComponent = renderMode === '3D' ? PvpFlip3D : PvpFlip2D;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameComponent />
    </Suspense>
  );
}


