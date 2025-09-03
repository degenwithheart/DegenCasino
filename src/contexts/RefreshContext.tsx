// src/contexts/RefreshContext.tsx
import React, { createContext, useContext, useCallback } from 'react';
import { prefetchManager } from '../utils/prefetch';

interface RefreshContextType {
  refreshAll: () => Promise<void>;
  refreshLeaderboard: () => void;
  refreshRecentPlays: () => void;
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export const RefreshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const refreshAll = useCallback(async () => {
    console.log('🔄 Global refresh triggered');
    await prefetchManager.refreshAll();
    
    // Trigger a custom event that components can listen to
    window.dispatchEvent(new CustomEvent('app:refresh-all'));
  }, []);

  const refreshLeaderboard = useCallback(() => {
    console.log('🔄 Leaderboard refresh triggered');
    window.dispatchEvent(new CustomEvent('app:refresh-leaderboard'));
  }, []);

  const refreshRecentPlays = useCallback(() => {
    console.log('🔄 Recent plays refresh triggered');
    window.dispatchEvent(new CustomEvent('app:refresh-recent-plays'));
  }, []);

  return (
    <RefreshContext.Provider value={{ refreshAll, refreshLeaderboard, refreshRecentPlays }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = () => {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error('useRefresh must be used within a RefreshProvider');
  }
  return context;
};
