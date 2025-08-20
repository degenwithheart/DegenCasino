import { PublicKey } from '@solana/web3.js'
import { useSpecificGames } from 'gamba-react-v2'

// Identify a blackjack-v1 duel game. For now we use structural heuristics.
export const BJ_V1_META_KEY = 'gtype'
export const BJ_V1_META_VAL = 'blackjack-v1'

export function isBlackjackV1Game(g: any): boolean {
  try {
    if (!g) return false
    if (g.maxPlayers !== 2) return false
    if (g.winnersTarget !== 1) return false
    // Check optional metadata marker (stored in account metadata array or map)
    const meta = g.metadata || g.meta || []
    if (Array.isArray(meta)) {
      if (meta.includes(BJ_V1_META_VAL)) return true
    } else if (typeof meta === 'object') {
      if (meta[BJ_V1_META_KEY] === BJ_V1_META_VAL) return true
    }
    return true
  } catch {
    return false
  }
}

export function getWinnerIndex(g: any): number | null {
  if (!g?.state?.settled) return null
  return g.winnerIndexes?.[0] ?? null
}

export function useBlackjackV1Games(creator?: PublicKey) {
  const { games } = useSpecificGames(creator ? { creator } : {})
  return (games || []).filter(isBlackjackV1Game)
}

export function buildCreateOptions(opts: {
  mint: PublicKey,
  creator: PublicKey,
  wagerLamports: number,
  softDuration?: number,
}): any {
  const { mint, creator, wagerLamports, softDuration = 300 } = opts
  return {
    mint,
    creatorAddress: creator,
    maxPlayers: 2,
    preAllocPlayers: 2,
    winnersTarget: 1,
    softDuration,
    wagerType: 0,
    payoutType: 0,
    wager: wagerLamports,
    minBet: wagerLamports,
    maxBet: wagerLamports,
  metadata: [BJ_V1_META_VAL],
  }
}
