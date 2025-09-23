// Game-specific TypeScript type definitions
// Use this file to define types for your game

export interface GameState {
  phase: 'idle' | 'playing' | 'finished'
  result: GameResult | null
  animation: AnimationState | null
}

export interface GameResult {
  outcome: number
  payout: number
  multiplier: number
  isWin: boolean
  timestamp: number
}

export interface AnimationState {
  type: 'spin' | 'bounce' | 'fade' | 'slide'
  duration: number
  progress: number
  completed: boolean
}

export interface GameConfig {
  name: string
  minBet: number
  maxBet: number
  defaultRTP: number
  maxMultiplier: number
  animationDuration: number
}

export interface GameStats {
  gamesPlayed: number
  wins: number
  losses: number
  sessionProfit: number
  bestWin: number
  currentStreak: number
  bestStreak: number
  totalWagered: number
  averageBet: number
}

export interface PlayerChoice {
  id: string
  label: string
  multiplier: number
  probability: number
  selected: boolean
}

export interface CanvasRenderProps {
  ctx: CanvasRenderingContext2D
  size: { width: number; height: number }
  clock: number
}

export interface SoundEffects {
  win: HTMLAudioElement | null
  lose: HTMLAudioElement | null
  play: HTMLAudioElement | null
  tick: HTMLAudioElement | null
  background?: HTMLAudioElement | null
}

// Game-specific enums
export enum GamePhase {
  IDLE = 'idle',
  PLAYING = 'playing',
  ANIMATING = 'animating',
  FINISHED = 'finished'
}

export enum GameDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum AnimationType {
  SPIN = 'spin',
  BOUNCE = 'bounce',
  FADE = 'fade',
  SLIDE = 'slide',
  SCALE = 'scale'
}

// Utility types
export type BetArray = number[]
export type GameMode = 'singleplayer' | 'multiplayer'
export type GameCategory = 'dice' | 'cards' | 'slots' | 'arcade' | 'puzzle'