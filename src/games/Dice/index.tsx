import React, { Suspense } from 'react';
import { useUserStore } from '../../hooks/data/useUserStore';
import { useGameSEO } from '../../hooks/ui/useGameSEO';
import { useIsCompact } from '../../hooks/ui/useIsCompact';
import { ALL_GAMES } from '../allGames';

// Lazy load 2D, 3D, and Mobile components
const Dice2D = React.lazy(() => import('./Dice-2D'));
const Dice3D = React.lazy(() => import('./Dice-3D'));
const DiceMobile = React.lazy(() => import('./index-mobile'));

export default function DiceWrapper() {
  const seoHelmet = useGameSEO({
    gameName: 'Dice',
    description: `Roll the dice and test your luck in this classic probability game. Choose your betting mode - roll under, over, between, or outside ranges to maximize your winnings. Each roll brings the thrill of chance with provably fair outcomes.`,
    maxWin: 'varies'
  });

  const { mobile: isMobile } = useIsCompact();
  const renderMode = useUserStore(state => state.getGameRenderMode('dice'));
  const diceGame = ALL_GAMES.find(g => g.id === 'dice');
  const gameSupports3D = diceGame?.capabilities?.supports3D ?? false;
  const shouldRender3D = gameSupports3D && renderMode === '3D';

  // DEBUG: Log mobile detection
  console.log('🎲 DICE WRAPPER DEBUG:', {
    isMobile,
    screenWidth: window.innerWidth,
    renderMode,
    shouldRender3D,
    userAgent: navigator.userAgent.toLowerCase().includes('mobile')
  });

  // Priority: Mobile first, then 3D/2D for desktop
  const getGameComponent = () => {
    if (isMobile) {
      console.log('🎲 Loading MOBILE Dice component');
      return <DiceMobile />;
    }
    const component = shouldRender3D ? <Dice3D /> : <Dice2D />;
    console.log('🎲 Loading DESKTOP Dice component:', shouldRender3D ? '3D' : '2D');
    return component;
  };

  return (
    <>
      {seoHelmet}
      <Suspense fallback={<div>Loading Dice...</div>}>
        {getGameComponent()}
      </Suspense>
    </>
  );
}
