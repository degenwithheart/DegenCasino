import type { GameBundle } from './types'
import { ALL_GAMES } from './allGames'

// Example: Only show Dice, Crash, Plinko as featured
export const FEATURED_GAMES: GameBundle[] = ALL_GAMES.filter(game => [
  'dice', 'magic8ball', 'plinko', 'mines'
].includes(game.id));