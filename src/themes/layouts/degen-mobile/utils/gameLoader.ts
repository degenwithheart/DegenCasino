import React from 'react'
import { shouldUseMobileGames, shouldUseDesktopGames } from './deviceDetection'
import type { ExtendedGameBundle } from '../../../../games/allGames'

/**
 * Game Loader for Degen Mobile Theme
 * Loads mobile-specific game files on mobile devices, desktop versions on tablets
 */

/**
 * Load appropriate game component based on device type
 * Mobile devices: Load index-mobile.tsx if it exists, fallback to index.tsx
 * Tablets: Load index.tsx (desktop version)
 */
export const loadGameComponent = (game: ExtendedGameBundle): React.LazyExoticComponent<React.ComponentType<any>> => {
  // Tablets always use desktop version
  if (shouldUseDesktopGames()) {
    return game.app // Original desktop version
  }
  
  // Mobile devices: Try to load mobile version
  if (shouldUseMobileGames()) {
    // Handle specific games with mobile versions
    switch (game.id) {
      case 'dice':
        // @ts-ignore - Dynamic import for mobile version
        return React.lazy(() => import('../../../../games/Dice/index'))

      case 'flip':
        // @ts-ignore - Dynamic import for mobile version
        return React.lazy(() => import('../../../../games/Flip/index'))

      case 'slots':
        // @ts-ignore - Dynamic import for mobile version
        return React.lazy(() => import('../../../../games/Slots/index'))
      
      case 'plinko':
        // @ts-ignore - Dynamic import for mobile version
        return React.lazy(() => import('../../../../games/Plinko/index'))
      
      default:
        // For games without mobile versions, throw error to show popup
        throw new Error(`MOBILE_VERSION_NOT_AVAILABLE:${game.id}`)
    }
  }
  
  // Default fallback
  return game.app
}

/**
 * Enhanced game bundle with device-aware loading
 */
export const createDeviceAwareGame = (game: ExtendedGameBundle): ExtendedGameBundle => {
  return {
    ...game,
    app: loadGameComponent(game)
  }
}

/**
 * Transform games array to use device-aware loading
 * Only applies in degen-mobile theme context
 */
export const createDeviceAwareGames = (games: ExtendedGameBundle[]): ExtendedGameBundle[] => {
  return games.map(createDeviceAwareGame)
}