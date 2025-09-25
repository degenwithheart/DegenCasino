// src/hooks/useLeaderboardData.ts
import { useState, useEffect } from 'react';

export type Period = 'alltime';

export interface Player {
  user: string;
  usd_volume: number;          // USD volume across every token (kept for compatibility)
  sol_volume: number;          // Actual SOL volume calculated from wagers
}

interface LeaderboardResult {
  players: Player[];
}

// Set your API base URL (adjust if necessary)
const API_BASE_URL = 'https://api.gamba.so';

/**
 * Fetches leaderboard data using the same method as Explorer - actual SOL wager amounts
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

        // Use the same method as Explorer - fetch plays data and calculate SOL volume
        const playsUrl = `${API_BASE_URL}/events/settledGames?creator=${creator}&itemsPerPage=200&page=0`;
        
        const res = await fetch(playsUrl, { 
          signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });
        if (!res.ok) throw new Error(await res.text());

        const playsData = await res.json();
        
        if (!playsData || !Array.isArray(playsData.results)) {
          throw new Error('Invalid plays data received');
        }
        
        // Filter plays by creator and calculate SOL volume per player
        const filteredPlays = playsData.results.filter((play: any) => play.creator === creator);
        
        // Group plays by user and calculate SOL volume
        const playerVolumes = new Map<string, number>();
        
        filteredPlays.forEach((play: any) => {
          const user = play.user;
          const wagerInSol = (parseFloat(play.wager) || 0) / 1e9; // Convert lamports to SOL
          
          const currentVolume = playerVolumes.get(user) || 0;
          playerVolumes.set(user, currentVolume + wagerInSol);
        });
        
        // Convert to array and sort by SOL volume
        const players = Array.from(playerVolumes.entries())
          .map(([user, sol_volume]) => ({ user, usd_volume: 0, sol_volume }))
          .sort((a, b) => b.sol_volume - a.sol_volume);
        
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
