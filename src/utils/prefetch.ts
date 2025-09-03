// src/utils/prefetch.ts
import { cache, CacheKeys, CacheTTL } from './cache';

export interface PrefetchConfig {
  enabled: boolean;
  onAppStart: boolean;
  onNavigation: boolean;
  backgroundRefresh: boolean;
}

class PrefetchManager {
  private config: PrefetchConfig = {
    enabled: true,
    onAppStart: true,
    onNavigation: true,
    backgroundRefresh: true,
  };

  private isAppStarted = false;
  private refreshIntervals = new Map<string, NodeJS.Timeout>();

  /**
   * Mark that the app has started - enables automatic prefetching
   */
  markAppStarted() {
    this.isAppStarted = true;
    if (this.config.onAppStart) {
      this.prefetchCriticalData();
    }
  }

  /**
   * Prefetch critical data that's likely to be needed
   */
  async prefetchCriticalData() {
    if (!this.config.enabled) return;

    try {
      // Prefetch common leaderboard data
      await this.prefetchLeaderboard('weekly', 'DGHRTBxDmtBaL9bjwN7EtLNKh7FLqezKq4QyE6iDfR8n');
      await this.prefetchLeaderboard('monthly', 'DGHRTBxDmtBaL9bjwN7EtLNKh7FLqezKq4QyE6iDfR8n');
      
      // Prefetch recent plays
      await this.prefetchRecentPlays(false, 'DGHRTBxDmtBaL9bjwN7EtLNKh7FLqezKq4QyE6iDfR8n');
      
      console.log('✅ Critical data prefetched successfully');
    } catch (error) {
      console.warn('⚠️ Error prefetching critical data:', error);
    }
  }

  /**
   * Prefetch leaderboard data if not in cache or stale
   */
  async prefetchLeaderboard(period: 'weekly' | 'monthly', creator: string): Promise<void> {
    const cacheKey = CacheKeys.leaderboard(period, creator);
    const cached = cache.get(cacheKey, CacheTTL.LEADERBOARD);
    
    // Skip if we have fresh data
    if (cached) {
      console.log(`📋 Leaderboard cache hit for ${period}`);
      return;
    }

    try {
      console.log(`🔄 Prefetching ${period} leaderboard...`);
      const response = await fetch(`https://api.gamba.so/creator/${creator}/players?period=${period}&limit=100`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      cache.set(cacheKey, result.players || [], CacheTTL.LEADERBOARD);
      console.log(`✅ ${period} leaderboard prefetched`);
    } catch (error) {
      console.warn(`❌ Failed to prefetch ${period} leaderboard:`, error);
    }
  }

  /**
   * Prefetch recent plays data if not in cache or stale
   */
  async prefetchRecentPlays(showAllPlatforms: boolean, creator?: string): Promise<void> {
    const cacheKey = CacheKeys.recentPlays(showAllPlatforms, creator);
    const cached = cache.get(cacheKey, CacheTTL.RECENT_PLAYS);
    
    // Skip if we have fresh data
    if (cached) {
      console.log('🎮 Recent plays cache hit');
      return;
    }

    try {
      console.log('🔄 Prefetching recent plays...');
      const url = showAllPlatforms 
        ? 'https://api.gamba.so/events/settledGames?limit=50'
        : `https://api.gamba.so/events/settledGames?creator=${creator}&limit=50`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      cache.set(cacheKey, result || [], CacheTTL.RECENT_PLAYS);
      console.log('✅ Recent plays prefetched');
    } catch (error) {
      console.warn('❌ Failed to prefetch recent plays:', error);
    }
  }

  /**
   * Setup background refresh for critical data
   */
  setupBackgroundRefresh() {
    if (!this.config.backgroundRefresh) return;

    // Refresh leaderboard every 2 minutes
    const leaderboardInterval = setInterval(() => {
      this.prefetchLeaderboard('weekly', 'DGHRTBxDmtBaL9bjwN7EtLNKh7FLqezKq4QyE6iDfR8n');
      this.prefetchLeaderboard('monthly', 'DGHRTBxDmtBaL9bjwN7EtLNKh7FLqezKq4QyE6iDfR8n');
    }, CacheTTL.LEADERBOARD);

    // Refresh recent plays every 30 seconds
    const recentPlaysInterval = setInterval(() => {
      this.prefetchRecentPlays(false, 'DGHRTBxDmtBaL9bjwN7EtLNKh7FLqezKq4QyE6iDfR8n');
    }, CacheTTL.RECENT_PLAYS);

    this.refreshIntervals.set('leaderboard', leaderboardInterval);
    this.refreshIntervals.set('recentPlays', recentPlaysInterval);

    console.log('🔄 Background refresh intervals setup');
  }

  /**
   * Manually refresh all cached data
   */
  async refreshAll(): Promise<void> {
    console.log('🔄 Manual refresh triggered');
    
    // Clear relevant cache
    cache.invalidateByPattern('leaderboard:.*');
    cache.invalidateByPattern('recentPlays:.*');
    
    // Refetch critical data
    await this.prefetchCriticalData();
  }

  /**
   * Clean up intervals
   */
  cleanup() {
    for (const interval of this.refreshIntervals.values()) {
      clearInterval(interval);
    }
    this.refreshIntervals.clear();
  }

  /**
   * Check if data exists in cache (for instant display)
   */
  hasCachedLeaderboard(period: 'weekly' | 'monthly', creator: string): boolean {
    const cacheKey = CacheKeys.leaderboard(period, creator);
    return cache.has(cacheKey);
  }

  hasCachedRecentPlays(showAllPlatforms: boolean, creator?: string): boolean {
    const cacheKey = CacheKeys.recentPlays(showAllPlatforms, creator);
    return cache.has(cacheKey);
  }
}

// Export singleton instance
export const prefetchManager = new PrefetchManager();
