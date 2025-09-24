// src/hooks/useLeaderboardData.ts
import { useState, useEffect } from 'react';

export type Period = 'alltime';

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
 * over the chosen period.
 */
export function useLeaderboardData(period: Period, creator: string) {
  const [data, setData] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    if (!creator) return;

    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // Build URL for all-time data (no time filter needed)
        const url = `${API_BASE_URL}/players?creator=${creator}&sortBy=usd_volume&limit=100`;

        const res = await fetch(url, { 
          signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });
        if (!res.ok) throw new Error(await res.text());

        const { players }: LeaderboardResult = await res.json();
        setData(players);
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
  }, [period, creator]);

  // Optionally, you can expose a retry function for manual retry from UI
  const retry = () => setRetryCount(0);
  return { data, loading, error, retry, retryCount };
}
