import React from 'react';
import { useWalletAddress } from 'gamba-react-v2';
import { PLATFORM_CREATOR_ADDRESS } from '../../constants';

/**
 * Fetch recent settled game events for the current user from api.gamba.so
 * Normalizes the response to a lightweight shape used by Session widgets.
 * No mock data or hardcoded payloads — relies on the public API.
 */
export function useUserPlaysApi(opts?: { limit?: number }) {
  const wallet = useWalletAddress();
  const limit = opts?.limit ?? 50;
  const [plays, setPlays] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!wallet) {
      setPlays([]);
      return;
    }

    let mounted = true;
    const fetchPlays = async () => {
      setLoading(true);
      setError(null);
      try {
        const address = wallet.toBase58();
        const url = `https://api.gamba.so/events/settledGames?user=${encodeURIComponent(address)}&itemsPerPage=${limit}&page=0`;
        const res = await fetch(url);
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`API ${res.status}: ${txt}`);
        }

        const data = await res.json();
        const creator = PLATFORM_CREATOR_ADDRESS.toBase58();

        const filtered = (data.results || []).filter((p: any) => p.creator === creator);

        // Normalize to simple shape: { signature, user, token, wager, payout, time }
        const normalized = filtered.map((p: any) => {
          return {
            signature: p.signature,
            user: p.user,
            creator: p.creator,
            token: p.token,
            wager: Number(p.wager) || 0,
            payout: Number(p.payout) || 0,
            time: Number(p.time) || Date.now(),
            // keep raw for edge cases
            _raw: p,
          };
        });

        if (mounted) setPlays(normalized);
      } catch (err: any) {
        console.error('useUserPlaysApi fetch error', err);
        if (mounted) setError(err?.message ?? String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPlays();

    return () => {
      mounted = false;
    };
  }, [wallet, limit]);

  return { plays, loading, error } as const;
}

export default useUserPlaysApi;
