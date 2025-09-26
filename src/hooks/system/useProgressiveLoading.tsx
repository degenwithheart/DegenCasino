// Hook for Game Components to integrate with Progressive Loading
// Provides hover preloading and performance tracking

import { useContext, createContext, ReactNode, useCallback } from 'react';

interface ProgressiveLoadingContextType {
  preloadGameOnHover: (gameId: string) => Promise<void>;
  getPerformanceStats: () => any;
  isProgressiveLoadingActive: () => boolean;
}

const ProgressiveLoadingContext = createContext<ProgressiveLoadingContextType | null>(null);

export function ProgressiveLoadingProvider({ 
  children, 
  value 
}: { 
  children: ReactNode;
  value: ProgressiveLoadingContextType;
}) {
  return (
    <ProgressiveLoadingContext.Provider value={value}>
      {children}
    </ProgressiveLoadingContext.Provider>
  );
}

export function useProgressiveLoading() {
  const context = useContext(ProgressiveLoadingContext);
  
  if (!context) {
    // Fallback for when context is not available
    return {
      preloadGameOnHover: async () => {},
      getPerformanceStats: () => ({}),
      isProgressiveLoadingActive: () => false,
      onGameHover: () => ({}),
      onGameClick: (gameId: string) => {}
    };
  }

  // Enhanced game hover handler with event props
  const onGameHover = useCallback((gameId: string) => {
    return {
      onMouseEnter: () => context.preloadGameOnHover(gameId),
      onFocus: () => context.preloadGameOnHover(gameId),
      onTouchStart: () => context.preloadGameOnHover(gameId), // For mobile
    };
  }, [context]);

  // Game click handler that updates user activity
  const onGameClick = useCallback((gameId: string) => {
    console.log(`🎮 User clicked game: ${gameId}`);
    
    // Update session storage with game interaction
    const gamesClicked = JSON.parse(sessionStorage.getItem('progressive-loading-games-clicked') || '[]');
    if (!gamesClicked.includes(gameId)) {
      gamesClicked.push(gameId);
      sessionStorage.setItem('progressive-loading-games-clicked', JSON.stringify(gamesClicked));
    }
    
    // Track timestamp of game click
    sessionStorage.setItem(`game-click-${gameId}`, Date.now().toString());
  }, []);

  return {
    ...context,
    onGameHover,
    onGameClick
  };
}