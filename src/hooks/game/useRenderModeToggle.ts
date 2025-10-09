import { useCallback } from 'react';
import { useUserStore } from '../data/useUserStore';
import { FEATURE_FLAGS } from '../../constants';
import { ALL_GAMES } from '../../games/allGames';

export const useRenderModeToggle = (gameId: string) => {
  const {
    setGameRenderMode,
    setGlobalRenderMode
  } = useUserStore();

  // Use reactive selector to ensure re-renders
  const currentMode = useUserStore(state => state.getGameRenderMode(gameId));
  const game = ALL_GAMES.find(g => g.id === gameId);
  const gameCapabilities = game?.capabilities;

  const canToggle = FEATURE_FLAGS.TOGGLE_2D_3D_MODE &&
    gameCapabilities?.supports2D &&
    gameCapabilities?.supports3D;

  console.log('🎮 useRenderModeToggle:', {
    gameId,
    currentMode,
    gameCapabilities,
    canToggle,
    TOGGLE_2D_3D_MODE: FEATURE_FLAGS.TOGGLE_2D_3D_MODE,
    timestamp: Date.now()
  });

  const toggleMode = () => {
    console.log(`[useRenderModeToggle] Toggling mode for game: "${gameId}"`);
    console.log(`[useRenderModeToggle] Current mode: "${currentMode}"`);
    console.log(`[useRenderModeToggle] Has feature flag: ${FEATURE_FLAGS.TOGGLE_2D_3D_MODE}`);
    console.log(`[useRenderModeToggle] Can toggle: ${canToggle}`);

    const newMode = currentMode === '2D' ? '3D' : '2D';
    console.log(`[useRenderModeToggle] New mode: "${newMode}"`);

    setGameRenderMode(gameId, newMode);

    // Verify the mode was actually set
    const verifyMode = useUserStore.getState().getGameRenderMode(gameId);
    console.log(`[useRenderModeToggle] Verified mode in store: "${verifyMode}"`);

    // Force a re-render by triggering state update
    console.log(`[useRenderModeToggle] Forcing re-render check...`);
  };

  return {
    currentMode,
    canToggle,
    toggleMode,
    gameCapabilities
  };
};