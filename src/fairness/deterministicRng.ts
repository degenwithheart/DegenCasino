// Deterministic RNG utilities used to map on-chain results to reproducible
// visual sequences. Not cryptographically secure (chain already ensured fairness).

export type Rng = () => number

export function makeDeterministicRng(seed: string): Rng {
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

export function pickDeterministic<T>(arr: T[], rng: Rng): T {
  return arr[Math.floor(rng() * arr.length)]
}
