import { SLOT_ITEMS, SlotItem, NUM_REELS, NUM_ROWS, NUM_PAYLINES } from './constants'
import { SLOTS_CONFIG } from '../rtpConfig'

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

export const generateBetArray = (
  maxPayout: number,
  wager: number,
  maxLength = 1000,
) => {
  // Always return the full bet array from rtpConfig, no filtering or overrides
  return SLOTS_CONFIG.betArray;
}

/**
 * Gets the paylines for checking wins (1 horizontal bottom line)
 * Grid layout (2x3 grid, column-major for reels):
 * Reel 0: [0, 1]  <- Left column (top, bottom)
 * Reel 1: [2, 3]  <- Middle column (top, bottom)
 * Reel 2: [4, 5]  <- Right column (top, bottom)
 * Only the bottom row [1, 3, 5] is the winning line
 */
export const getPaylines = () => {
  return [
    [1, 3, 5], // Bottom horizontal line (only winning line)
  ];
}

/**
 * Checks if a payline has a winning combination
 */
export const checkPaylineWin = (grid: SlotItem[], paylineIndices: number[]) => {
  const symbols = paylineIndices.map(index => grid[index]);
  const firstSymbol = symbols[0];
  
  // Check if all symbols in the payline are the same and have a multiplier > 0
  const isWinning = symbols.every(symbol => 
    symbol.multiplier === firstSymbol.multiplier && 
    firstSymbol.multiplier > 0
  );
  
  return isWinning ? firstSymbol : null;
}

/**
 * Gets all winning paylines from a grid
 */
export const getWinningPaylines = (grid: SlotItem[]) => {
  const paylines = getPaylines();
  const winningPaylines: { payline: number[], symbol: SlotItem }[] = [];
  
  paylines.forEach((payline, index) => {
    const winningSymbol = checkPaylineWin(grid, payline);
    if (winningSymbol) {
      winningPaylines.push({ payline, symbol: winningSymbol });
    }
  });
  
  return winningPaylines;
}

/**
 * Enhanced getSlotCombination with strategic column sequences and no matching top row
 * Grid layout (2 rows, 3 columns):
 * [0, 2, 4] <- Top row (never matching)
 * [1, 3, 5] <- Bottom row (winning line)
 * 
 * Column sequences:
 * Column 0: UNICORN, DGHRT, SOL, USDC, JUP, BONK, WOJAK
 * Column 1: WOJAK, BONK, JUP, USDC, SOL, DGHRT, UNICORN (reverse)
 * Column 2: UNICORN, DGHRT, SOL, USDC, JUP, BONK, WOJAK
 */
export const getSlotCombination = (
  count: number, // Should be 6 (2x3 grid)
  multiplier: number,
  bet: number[],
  seed: string, // typically the on-chain result signature
) => {
  const rng = makeDeterministicRng(`${seed}:${multiplier}:${bet.length}:${count}`)

    // Define column sequences (must match Reel.tsx) - using actual RTP config symbols
  const COLUMN_SEQUENCES = {
    0: ['MYTHICAL', 'LEGENDARY', 'DGHRT', 'SOL', 'USDC', 'JUP', 'BONK', 'WOJAK'], // Column 1
    1: ['WOJAK', 'BONK', 'JUP', 'USDC', 'SOL', 'DGHRT', 'LEGENDARY', 'MYTHICAL'], // Column 2 (reverse)
    2: ['SOL', 'JUP', 'WOJAK', 'MYTHICAL', 'BONK', 'USDC', 'DGHRT', 'LEGENDARY'], // Column 3 (offset)
  }
  
  // Helper to get SlotItem by symbol name - using actual RTP config multipliers
  const getSymbolByName = (symbolName: string): SlotItem => {
    // Get the actual multiplier from RTP config symbols
    const symbolFromConfig = SLOTS_CONFIG.symbols.find(s => s.name === symbolName)
    if (!symbolFromConfig) {
      console.error('Symbol not found in config:', symbolName)
      return SLOT_ITEMS[0] // fallback to first item
    }
    
    // Find the corresponding SLOT_ITEM with the exact multiplier
    const slotItem = SLOT_ITEMS.find(item => Math.abs(item.multiplier - symbolFromConfig.multiplier) < 0.001)
    if (!slotItem) {
      console.error('SlotItem not found for multiplier:', symbolFromConfig.multiplier)
      return SLOT_ITEMS[0] // fallback to first item
    }
    
    return slotItem
  }
  
  // Helper to get random position in column sequence
  const getRandomSymbolFromColumn = (columnIndex: number, rng: () => number): SlotItem => {
    const sequence = COLUMN_SEQUENCES[columnIndex as keyof typeof COLUMN_SEQUENCES]
    const randomIndex = Math.floor(rng() * sequence.length)
    return getSymbolByName(sequence[randomIndex])
  }

  // WIN CASE: create a grid with the winning bottom line
  if (multiplier > 0) {
    const winningItems = SLOT_ITEMS.filter((x) => x.multiplier === multiplier)
    const chosen = winningItems.length > 0 
      ? pickDeterministic(winningItems, rng)
      : pickDeterministic(SLOT_ITEMS, rng)

    // Create a 2x3 grid (6 slots total)
    const grid: SlotItem[] = new Array(6).fill(null);
    
    // Fill the bottom winning line [1, 3, 5] with the winning symbol
    grid[1] = chosen; // Bottom left
    grid[3] = chosen; // Bottom middle  
    grid[5] = chosen; // Bottom right
    
    // Fill the top positions [0, 2, 4] ensuring no matches across top row and no column duplicates
    const topPositions = [0, 2, 4];
    const usedTopSymbols = new Set<string>();
    
    topPositions.forEach((index, i) => {
      const columnIndex = i; // 0, 1, 2 for columns
      const bottomIndex = index + 1; // 1, 3, 5 (corresponding bottom positions)
      const bottomSymbol = grid[bottomIndex]; // The winning symbol
      
      let attempts = 0;
      let symbol: SlotItem;
      
      do {
        symbol = getRandomSymbolFromColumn(columnIndex, rng);
        attempts++;
      } while (
        attempts < 20 && 
        (usedTopSymbols.has(symbol.image) || symbol.image === bottomSymbol.image)
      );
      
      grid[index] = symbol;
      usedTopSymbols.add(symbol.image);
    });
    
    return grid;
  }

  // LOSS CASE: create a grid with no winning bottom line but following column sequences
  const grid: SlotItem[] = new Array(6).fill(null);
  
  // Fill top row [0, 2, 4] ensuring no matches and following column sequences
  const usedTopSymbols = new Set<string>();
  [0, 2, 4].forEach((index, i) => {
    const columnIndex = i;
    let attempts = 0;
    let symbol: SlotItem;
    
    do {
      symbol = getRandomSymbolFromColumn(columnIndex, rng);
      attempts++;
    } while (attempts < 20 && usedTopSymbols.has(symbol.image));
    
    grid[index] = symbol;
    usedTopSymbols.add(symbol.image);
  });
  
  // Fill bottom row [1, 3, 5] ensuring no winning line and no column duplicates
  [1, 3, 5].forEach((index, i) => {
    const columnIndex = i;
    const topIndex = i * 2; // 0, 2, 4 (corresponding top positions)
    const topSymbol = grid[topIndex];
    
    let attempts = 0;
    let symbol: SlotItem;
    
    do {
      symbol = getRandomSymbolFromColumn(columnIndex, rng);
      attempts++;
    } while (attempts < 20 && symbol.image === topSymbol.image);
    
    grid[index] = symbol;
  });
  
  // Ensure the bottom line [1, 3, 5] is NOT a winning line
  let attempts = 0;
  while (attempts < 10) {
    const bottomLineSymbols = [grid[1], grid[3], grid[5]];
    const firstSymbol = bottomLineSymbols[0];
    
    // Check if bottom line is a winning combination
    const isBottomLineWinning = bottomLineSymbols.every(symbol => 
      symbol.multiplier === firstSymbol.multiplier && 
      firstSymbol.multiplier > 0
    );
    
    if (!isBottomLineWinning) {
      break; // No winning line, we're good
    }
    
    // Break the winning bottom line by changing one symbol from its column sequence
    const indexToChange = 1 + Math.floor(rng() * 3) * 2; // 1, 3, or 5
    const columnIndex = (indexToChange - 1) / 2; // 0, 1, or 2
    grid[indexToChange] = getRandomSymbolFromColumn(columnIndex, rng);
    
    attempts++;
  }
  
  return grid;
}
