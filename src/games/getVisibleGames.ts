import { ALL_GAMES } from './allGames';
import type { GameBundle } from './types';

/**
 * Returns the games visible in the current environment.
 * - In development (local), returns all games.
 * - In production (deploy), returns only games with live: 'yes'.
 */
export function getVisibleGames(): GameBundle[] {
  // Always return all games for menu, but mark maintenance/creating games
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
