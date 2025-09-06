import { ALL_GAMES } from './allGames';
import type { GameBundle } from './types';
import { filterVisibleGames } from '../utils/contentUtils';

/**
 * Returns the games visible in the current environment.
 * - In development (local), returns all games.
 * - In production (deploy), returns only games with live: 'yes'.
 * - Also filters based on admin content settings.
 */
export async function getVisibleGames(): Promise<GameBundle[]> {
  // First apply live status filtering
  const liveFilteredGames = ALL_GAMES.map(game => {
    if (game.live === 'down') {
      return { ...game, maintenance: true, creating: false };
    }
    if (game.live === 'new') {
      return { ...game, maintenance: false, creating: true };
    }
    return { ...game, maintenance: false, creating: false };
  });

  // Then apply admin content filtering
  const adminFilteredGames = await filterVisibleGames(liveFilteredGames);

  return adminFilteredGames;
}

/**
 * Synchronous version for components that need immediate access
 * Falls back to live status filtering if content settings can't be fetched
 */
export function getVisibleGamesSync(): GameBundle[] {
  return ALL_GAMES.map(game => {
    if (game.live === 'down') {
      return { ...game, maintenance: true, creating: false };
    }
    if (game.live === 'new') {
      return { ...game, maintenance: false, creating: true };
    }
    return { ...game, maintenance: false, creating: false };
  });
}
