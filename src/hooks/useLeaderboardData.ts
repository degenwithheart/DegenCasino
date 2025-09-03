// src/hooks/useLeaderboardData.ts
import { useState, useEffect } from 'react';
import { cache, CacheKeys, CacheTTL } from '../utils/cache';
import { prefetchManager } from '../utils/prefetch';

export type Period = 'weekly' | 'monthly';

export interface Player {
  user: string;
  usd_volume: number;          // USD volume across every token
}

interface LeaderboardResult {
  players: Player[];
}

// Set your API base URL (adjust if necessary)
const API_BASE_URL = 'https://api.gamba.so';

/**
 * Fetches leaderboard data (USD volume) for a given creator
 * over the chosen period. Prioritizes cached data for instant display.
 */
export function useLeaderboardData(period: Period, creator: string) {
  const [data, setData] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!creator) return;

    const cacheKey = CacheKeys.leaderboard(period, creator);
    
    // Check cache first - instant display if available
    const cachedData = cache.get<Player[]>(cacheKey, CacheTTL.LEADERBOARD);
    if (cachedData) {
      console.log(`📋 Leaderboard cache hit for ${period} - showing cached data`);
      setData(cachedData);
      setError(null);
      setLoading(false);
      return; // Don't fetch if we have fresh cached data
    }

    // No cache available, need to fetch
    console.log(`📋 No cache for ${period} leaderboard - fetching...`);
    setLoading(true);

    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // Determine starting timestamp for the selected period
        const now = Date.now();
        const startTime =
          period === 'weekly'
            ? now - 7 * 24 * 60 * 60 * 1000      // 7 days
            : now - 30 * 24 * 60 * 60 * 1000;    // 30 days

        const url =
          `${API_BASE_URL}/players` +
          `?creator=${creator}` +
          `&sortBy=usd_volume` +
          `&startTime=${startTime}`;

        const res = await fetch(url, { 
          signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });
        if (!res.ok) throw new Error(await res.text());

        const { players }: LeaderboardResult = await res.json();
        
        // Cache the data
        cache.set(cacheKey, players, CacheTTL.LEADERBOARD);
        setData(players);
        console.log(`✅ ${period} leaderboard fetched and cached`);
      } catch (err: any) {
        if (err.name === 'AbortError') return; // component unmounted/cancelled
        console.error(err);
        setError(err.message ?? 'Failed to fetch leaderboard data.');
      } finally {
        setLoading(false);
      }
    })();

    // Abort fetch if component unmounts or deps change
    return () => controller.abort();
  }, [period, creator, retryCount]); // Added retryCount to trigger refetch on retry

  // Manual refresh function that forces a new fetch
  const refresh = async () => {
    const cacheKey = CacheKeys.leaderboard(period, creator);
    cache.delete(cacheKey);
    setRetryCount(prev => prev + 1);
    console.log(`🔄 Manual refresh triggered for ${period} leaderboard`);
  };

  // Retry function that clears cache for this specific key
  const retry = () => {
    refresh();
  };
  
  return { data, loading, error, retry, retryCount, refresh };
}
