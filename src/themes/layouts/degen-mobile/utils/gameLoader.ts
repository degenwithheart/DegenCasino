import React from 'react';
import { shouldUseMobileGames, shouldUseDesktopGames } from './deviceDetection';
import type { ExtendedGameBundle } from '../../../../games/allGames';

/**
 * Game Loader for Degen Mobile Theme
 * Loads mobile-specific game files on mobile devices, desktop versions on tablets
 */

/**
 * Dynamically import mobile version of a game
 * Follows convention: /src/games/{GameName}/index-mobile.tsx
 */
const importMobileGame = (gameId: string) => {
  // Capitalize first letter for folder name convention
  const gameFolderName = gameId.charAt(0).toUpperCase() + gameId.slice(1);

  console.log(`📱 Importing mobile game: ${gameId} -> ${gameFolderName}`);

  return React.lazy(() =>
    import(`../../../../games/${gameFolderName}/index-mobile`)
      .then((module) => {
        console.log(`✅ Mobile game loaded successfully: ${gameId}`);
        return module;
      })
      .catch((error) => {
        // Fallback to desktop version if mobile doesn't exist
        console.warn(`❌ Mobile version not found for ${gameId}, falling back to desktop:`, error);
        return import(`../../../../games/${gameFolderName}/index`);
      })
  );
};

/**
 * Load appropriate game component based on device type and game availability
 */
export const loadGameComponent = (game: ExtendedGameBundle): React.LazyExoticComponent<React.ComponentType<any>> => {
  console.log(`🔄 Loading game component for: ${game.id}`, {
    shouldUseDesktop: shouldUseDesktopGames(),
    shouldUseMobile: shouldUseMobileGames(),
    mobileAvailable: game.mobileAvailable
  });

  // Tablets always use desktop version
  if (shouldUseDesktopGames()) {
    console.log(`🖥️ Using desktop version for: ${game.id}`);
    return game.app; // Original desktop version
  }

  // Mobile devices: Check if mobile version is available
  if (shouldUseMobileGames()) {
    if (game.mobileAvailable === 'yes') {
      console.log(`📱 Using mobile version for: ${game.id}`);
      return importMobileGame(game.id);
    } else {
      // Game not available on mobile - fallback to desktop version
      console.warn(`⚠️ Mobile version not available for: ${game.id}, falling back to desktop version`);
      return game.app; // Use desktop version as fallback
    }
  }

  // Default fallback
  console.log(`🔄 Using default version for: ${game.id}`);
  return game.app;
};

/**
 * Enhanced game bundle with device-aware loading
 */
export const createDeviceAwareGame = (game: ExtendedGameBundle): ExtendedGameBundle => {
  return {
    ...game,
    app: loadGameComponent(game)
  };
};

/**
 * Transform games array to use device-aware loading
 * Only applies in degen-mobile theme context
 */
export const createDeviceAwareGames = (games: ExtendedGameBundle[]): ExtendedGameBundle[] => {
  return games.map(createDeviceAwareGame);
};