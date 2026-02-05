import { PublicKey } from '@solana/web3.js'

export type PredictionType = 'over' | 'under' | 'exact'

export interface GameConfig {
  diceCount: number
  prediction: PredictionType
  targetNumber: number
}

export interface PlayerMetadata extends GameConfig {
  playerKey: string
}

export interface DiceResult {
  rolls: number[]
  total: number
  timestamp: number
}
