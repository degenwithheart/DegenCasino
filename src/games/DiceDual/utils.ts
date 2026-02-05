import { PublicKey } from '@solana/web3.js'
import { GameConfig, PredictionType } from './types'
import { DICE_FACES } from './config'

export const sol = (lamports: number) => lamports / 1_000_000_000

export const shorten = (pk: PublicKey) => pk.toBase58().slice(0, 4) + '…'

export const formatDuration = (ms: number) => {
  const total = Math.ceil(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export const parseGameConfig = (metadataString: string): GameConfig | null => {
  try {
    const parsed = JSON.parse(metadataString)
    if (
      typeof parsed.diceCount === 'number' &&
      typeof parsed.prediction === 'string' &&
      typeof parsed.targetNumber === 'number'
    ) {
      return parsed as GameConfig
    }
  } catch (e) {
    // Invalid JSON
  }
  return null
}

export const getMinRoll = (diceCount: number): number => diceCount

export const getMaxRoll = (diceCount: number): number => diceCount * DICE_FACES

export const getDefaultTarget = (diceCount: number): number => {
  return Math.floor((getMinRoll(diceCount) + getMaxRoll(diceCount)) / 2)
}

export const checkWin = (
  total: number,
  prediction: PredictionType,
  target: number,
): boolean => {
  switch (prediction) {
    case 'over':
      return total > target
    case 'under':
      return total < target
    case 'exact':
      return total === target
    default:
      return false
  }
}

export const calculateOdds = (
  diceCount: number,
  prediction: PredictionType,
  target: number,
): number => {
  const min = getMinRoll(diceCount)
  const max = getMaxRoll(diceCount)
  
  if (target < min || target > max) return 0

  let favorableOutcomes = 0
  const totalOutcomes = Math.pow(DICE_FACES, diceCount)

  if (prediction === 'over') {
    favorableOutcomes = max - target
  } else if (prediction === 'under') {
    favorableOutcomes = target - min
  } else if (prediction === 'exact') {
    favorableOutcomes = 1
  }

  const probability = favorableOutcomes / totalOutcomes
  return probability > 0 ? 1 / probability : 0
}
