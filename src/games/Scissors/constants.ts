import { PlayerChoice, GameMode } from './types';

// Sound effects
export const SOUND_PLAY = '/games/scissors/play.mp3';
export const SOUND_WIN = '/games/scissors/win.mp3';
export const SOUND_LOSE = '/games/scissors/lose.mp3';

// Choice emojis for visual representation
export const CHOICE_EMOJI: Record<PlayerChoice, string> = {
  rock: '🪨',
  paper: '📄', 
  scissors: '✂️',
};

// Alternative emoji sets for variety
export const CHOICE_EMOJI_ALT: Record<PlayerChoice, string> = {
  rock: '👊',
  paper: '✋', 
  scissors: '✌️',
};

// Winning combinations - what each choice beats
export const WINNING_COMBINATIONS: Record<PlayerChoice, PlayerChoice[]> = {
  rock: ['scissors'],
  paper: ['rock'],
  scissors: ['paper'],
};

// Game modes with different betting structures
export const GAME_MODES: Record<string, GameMode> = {
  standard: {
    label: 'Standard',
    bet: [1.9, 0, 0.95], // Win: 1.9x, Lose: 0x, Tie: 0.95x - 95% RTP
    description: 'Classic Rock Paper Scissors',
    winMultiplier: 1.9,
    tieMultiplier: 0.95,
  },
  risky: {
    label: 'High Risk',
    bet: [2.85, 0, 0], // Win: 2.85x, Lose: 0x, Tie: 0x - 95% RTP
    description: 'Higher payout, no tie protection',
    winMultiplier: 2.85,
    tieMultiplier: 0,
  },
};

// Game rules and descriptions
export const GAME_RULES = {
  title: 'Rock Paper Scissors',
  description: 'The timeless battle of choices. Rock crushes Scissors, Scissors cut Paper, Paper covers Rock. Pure strategy meets pure chance.',
  rules: [
    'Choose your weapon: Rock, Paper, or Scissors',
    'Computer makes its choice simultaneously', 
    'Rock beats Scissors, Scissors beat Paper, Paper beats Rock',
    'Win for 2x payout, tie for 1x, lose for 0x',
  ],
  tips: [
    'Rock is strong but predictable',
    'Paper is subtle but effective',
    'Scissors are sharp but risky',
    'Trust your instincts or use pure randomness',
  ],
};

// Animation timings
export const ANIMATION_TIMINGS = {
  choiceReveal: 1000,
  resultDisplay: 2000,
  autoReset: 5000,
  thinkingAnimation: 500,
};

// Bet arrays for Gamba - distributed across 3 possible outcomes
export const BET_ARRAYS = {
  // Index 0: win, Index 1: lose, Index 2: tie
  standard: [2, 0, 1],
  risky: [3, 0, 0],
};

// Fun facts and quotes
export const GAME_QUOTES = [
  "Rock solid strategy meets paper thin luck",
  "Cut through the competition with surgical precision", 
  "Every choice echoes through eternity",
  "The ancient game of chance and choice",
  "Three weapons, infinite possibilities",
];

// Achievement thresholds
export const ACHIEVEMENTS = {
  firstWin: { threshold: 1, title: "First Victory", description: "Win your first game" },
  winStreak5: { threshold: 5, title: "Hot Streak", description: "Win 5 games in a row" },
  winStreak10: { threshold: 10, title: "Unstoppable", description: "Win 10 games in a row" },
  perfectChoice: { threshold: 1, title: "Mind Reader", description: "Predict correctly 3 times in a row" },
  highRoller: { threshold: 1, title: "High Roller", description: "Win with a large wager" },
};