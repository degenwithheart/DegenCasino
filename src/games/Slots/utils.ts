import { SLOT_ITEMS, SlotItem } from './constants'

/**
 * Very small deterministic hash-based PRNG (not cryptographic) used ONLY for
 * deriving a reproducible visual arrangement from an already-final on-chain
 * result (signature, multiplier). This does NOT influence payout; it maps a
 * committed outcome to symbols so players (and auditors) can recompute.
 */
function makeDeterministicRng(seed: string) {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    const t = (h ^= h >>> 16) >>> 0
    return t / 4294967296
  }
}

const pickDeterministic = <T>(arr: T[], rng: () => number) => arr[Math.floor(rng() * arr.length)]

/**
 * Creates a bet array for given wager amount and max payout
 */
import { SLOTS_CONFIG } from '../rtpConfig'

export const generateBetArray = (
  maxPayout: number,
  wager: number,
  maxLength = 1000,
) => {
  // Always return the full bet array from rtpConfig, no filtering or overrides
  return SLOTS_CONFIG.betArray;
}

/**
 * Picks a random slot item combination based on the result
 */
export const getSlotCombination = (
  count: number,
  multiplier: number,
  bet: number[],
  seed: string, // typically the on-chain result signature
) => {
  const rng = makeDeterministicRng(`${seed}:${multiplier}:${bet.length}:${count}`)

  // WIN CASE: every reel shows a symbol with the winning multiplier
  if (multiplier > 0) {
    const winningItems = SLOT_ITEMS.filter((x) => x.multiplier === multiplier)
    const fallback = SLOT_ITEMS.filter((x) => x.multiplier < 1)
    const chosen = (winningItems.length > 0
      ? pickDeterministic(winningItems, rng)
      : pickDeterministic(fallback, rng))
    return new Array(count).fill(chosen) as SlotItem[]
  }

  // LOSS CASE: deterministic pseudo-random arrangement, ensuring not all same
  const available = SLOT_ITEMS.filter((x) => bet.includes(x.multiplier))
  const pool = available.length ? available : SLOT_ITEMS
  const items: SlotItem[] = []
  for (let i = 0; i < count; i++) {
    if (i === 0) {
      items.push(pickDeterministic(pool, rng))
      continue
    }
    const repeatPrev = rng() < 0.75 // deterministic probability
    if (repeatPrev) {
      items.push(items[i - 1])
    } else {
      items.push(pickDeterministic(pool, rng))
    }
  }
  // Ensure not all identical (visual fairness expectation)
  if (items.every((x) => x === items[0])) {
    // Replace last with a different one deterministically
    const alt = pool.find((x) => x !== items[0]) || items[0]
    items[items.length - 1] = alt
  }
  return items
}
