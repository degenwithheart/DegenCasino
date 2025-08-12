// Types for the Scissors (Rock Paper Scissors) game

export type PlayerChoice = 'rock' | 'paper' | 'scissors';

export const CHOICES: PlayerChoice[] = ['rock', 'paper', 'scissors'];

export interface GameState {
  playerChoice: PlayerChoice;
  computerChoice: PlayerChoice | null;
  result: 'win' | 'lose' | 'tie' | null;
  isPlaying: boolean;
  showResult: boolean;
}

export interface GameResult {
  playerChoice: PlayerChoice;
  computerChoice: PlayerChoice;
  result: 'win' | 'lose' | 'tie';
  payout: number;
  wager: number;
  multiplier: number;
}

export interface PaytableGameData {
  playerChoice: PlayerChoice;
  computerChoice: PlayerChoice;
  result: 'win' | 'lose' | 'tie';
  payout: number;
  wager: number;
  multiplier: number;
}

export interface GameMode {
  label: string;
  bet: number[];
  description: string;
  winMultiplier: number;
  tieMultiplier: number;
}