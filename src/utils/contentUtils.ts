// Content management utilities for frontend-only app
// This provides runtime filtering based on admin settings stored in cache

const CACHE_KEY = 'admin_game_visibility';

/**
 * Get content settings from cache
 */
export async function getContentSettings(): Promise<Record<string, boolean>> {
  try {
    const response = await fetch('/api/admin/content?action=get');
    const data = await response.json();
    return data.settings || {};
  } catch (error) {
    console.error('Failed to fetch content settings:', error);
    return {};
  }
}

/**
 * Check if a game should be visible based on admin settings
 */
export async function isGameVisible(gameId: string): Promise<boolean> {
  const settings = await getContentSettings();
  // If not explicitly set, default to visible
  return settings[gameId] !== false;
}

/**
 * Filter games array based on visibility settings
 */
export async function filterVisibleGames<T extends { id: string }>(games: T[]): Promise<T[]> {
  const settings = await getContentSettings();
  return games.filter(game => settings[game.id] !== false);
}

/**
 * Get featured games override from cache
 */
export async function getFeaturedGamesOverride(): Promise<string[] | null> {
  try {
    const response = await fetch('/api/admin/content?action=get');
    const data = await response.json();
    return data.settings?.featured || null;
  } catch (error) {
    console.error('Failed to fetch featured games:', error);
    return null;
  }
}

/**
 * Example usage in components:
 *
 * import { filterVisibleGames, getFeaturedGamesOverride } from './contentUtils';
 *
 * // Filter games list
 * const visibleGames = await filterVisibleGames(ALL_GAMES);
 *
 * // Get custom featured games
 * const featuredOverride = await getFeaturedGamesOverride();
 * const featuredGames = featuredOverride
 *   ? ALL_GAMES.filter(game => featuredOverride.includes(game.id))
 *   : FEATURED_GAMES;
 */
