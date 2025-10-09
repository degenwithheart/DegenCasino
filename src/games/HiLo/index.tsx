import React, { Suspense } from 'react';
import { useUserStore } from '../../hooks/data/useUserStore';

export interface HiLoConfig {
  logo: string;
}

const HiLo2D = React.lazy(() => import('./HiLo-2D'));
const HiLo3D = React.lazy(() => import('./HiLo-3D'));

export default function HiLo(props: HiLoConfig) {
  const renderMode = useUserStore((state) => state.gameRenderMode);

  const GameComponent = renderMode === '3D' ? HiLo3D : HiLo2D;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameComponent {...props} />
    </Suspense>
  );
}
