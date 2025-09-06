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
 * Gets the paylines for checking wins (1 horizontal line on 3rd row)
 * Grid layout (4×6 grid, column-major for reels):
 * Reel 0: [0, 1, 2, 3]    <- Column 1 (rows 0,1,2,3)
 * Reel 1: [4, 5, 6, 7]    <- Column 2 (rows 0,1,2,3)  
 * Reel 2: [8, 9, 10, 11]  <- Column 3 (rows 0,1,2,3)
 * Reel 3: [12, 13, 14, 15] <- Column 4 (rows 0,1,2,3)
 * Reel 4: [16, 17, 18, 19] <- Column 5 (rows 0,1,2,3)
 * Reel 5: [20, 21, 22, 23] <- Column 6 (rows 0,1,2,3)
 * The 3rd row [2, 6, 10, 14, 18, 22] is the winning line
 */
export const getPaylines = () => {
  return [
    [2, 6, 10, 14, 18, 22], // 3rd row horizontal line (winning line)
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
 * Enhanced getSlotCombination with strategic column sequences and no matching top rows
 * Grid layout (4 rows, 6 columns):
 * [0, 4, 8, 12, 16, 20]   <- Top row (row 0)
 * [1, 5, 9, 13, 17, 21]   <- Row 1
 * [2, 6, 10, 14, 18, 22]  <- Row 2 (WINNING LINE)
 * [3, 7, 11, 15, 19, 23]  <- Bottom row (row 3)
 * 
 * Column sequences:
 * Column 0: MYTHICAL, LEGENDARY, DGHRT, SOL, USDC, JUP, BONK, WOJAK
 * Column 1: WOJAK, BONK, JUP, USDC, SOL, DGHRT, LEGENDARY, MYTHICAL (reverse)
 * Column 2: SOL, JUP, WOJAK, MYTHICAL, BONK, USDC, DGHRT, LEGENDARY (offset)
 * Column 3: LEGENDARY, USDC, WOJAK, JUP, MYTHICAL, BONK, SOL, DGHRT (rotated)
 * Column 4: BONK, DGHRT, MYTHICAL, WOJAK, JUP, LEGENDARY, SOL, USDC (shifted)
 * Column 5: USDC, MYTHICAL, BONK, LEGENDARY, WOJAK, SOL, JUP, DGHRT (mixed)
 */
export const getSlotCombination = (
  count: number, // Should be 24 (4×6 grid)
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
    3: ['LEGENDARY', 'USDC', 'WOJAK', 'JUP', 'MYTHICAL', 'BONK', 'SOL', 'DGHRT'], // Column 4 (rotated)
    4: ['BONK', 'DGHRT', 'MYTHICAL', 'WOJAK', 'JUP', 'LEGENDARY', 'SOL', 'USDC'], // Column 5 (shifted)
    5: ['USDC', 'MYTHICAL', 'BONK', 'LEGENDARY', 'WOJAK', 'SOL', 'JUP', 'DGHRT'], // Column 6 (mixed)
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

  // Helper to get unique symbols for a column (no duplicates in vertical reel)
  const getUniqueSymbolsForColumn = (columnIndex: number, count: number, rng: () => number): SlotItem[] => {
    const sequence = COLUMN_SEQUENCES[columnIndex as keyof typeof COLUMN_SEQUENCES]
    const shuffled = [...sequence].sort(() => rng() - 0.5) // Shuffle the sequence
    return shuffled.slice(0, count).map(symbolName => getSymbolByName(symbolName))
  }

  // WIN CASE: create a grid with the winning 3rd row line
  if (multiplier > 0) {
    const winningItems = SLOT_ITEMS.filter((x) => x.multiplier === multiplier)
    const chosen = winningItems.length > 0 
      ? pickDeterministic(winningItems, rng)
      : pickDeterministic(SLOT_ITEMS, rng)

    // Create a 4x6 grid (24 slots total)
    const grid: SlotItem[] = new Array(24).fill(null);
    
    // Fill each column with unique symbols, ensuring the winning symbol is at row 2 (3rd row)
    for (let columnIndex = 0; columnIndex < 6; columnIndex++) {
      const sequence = COLUMN_SEQUENCES[columnIndex as keyof typeof COLUMN_SEQUENCES]
      
      // Find the winning symbol in this column's sequence
      const winningSymbolName = SLOTS_CONFIG.symbols.find(s => Math.abs(s.multiplier - chosen.multiplier) < 0.001)?.name
      const winningSymbolIndex = winningSymbolName ? sequence.indexOf(winningSymbolName) : -1
      
      // Create a unique arrangement with the winning symbol at position 2 (3rd row)
      const shuffled = [...sequence].sort(() => rng() - 0.5)
      
      // Ensure winning symbol is at position 2 if it exists in this column's sequence
      if (winningSymbolIndex !== -1) {
        // Remove winning symbol from shuffled array if it exists
        const filteredShuffled = shuffled.filter(name => name !== winningSymbolName)
        // Place winning symbol at position 2, fill others uniquely
        const columnSymbols = [
          filteredShuffled[0] || sequence[0],           // Row 0
          filteredShuffled[1] || sequence[1],           // Row 1  
          winningSymbolName!,                           // Row 2 (winning line)
          filteredShuffled[2] || sequence[3]            // Row 3
        ]
        
        // Place symbols in this column
        for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
          const index = columnIndex * 4 + rowIndex;
          grid[index] = getSymbolByName(columnSymbols[rowIndex]);
        }
      } else {
        // This column doesn't have the winning symbol, use regular unique arrangement
        const uniqueSymbols = shuffled.slice(0, 4).map(symbolName => getSymbolByName(symbolName))
        for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
          const index = columnIndex * 4 + rowIndex;
          grid[index] = uniqueSymbols[rowIndex];
        }
        // Override position 2 with winning symbol
        grid[columnIndex * 4 + 2] = chosen;
      }
    }
    
    return grid;
  }

    // LOSS CASE: create a grid with no winning 3rd row line but following column sequences
  const grid: SlotItem[] = new Array(24).fill(null);
  
  // Fill each column with unique symbols (no duplicates per vertical reel)
  for (let columnIndex = 0; columnIndex < 6; columnIndex++) {
    const uniqueSymbols = getUniqueSymbolsForColumn(columnIndex, 4, rng);
    
    // Place symbols in this column (4 rows)
    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      const index = columnIndex * 4 + rowIndex;
      grid[index] = uniqueSymbols[rowIndex];
    }
  }
  
  // Ensure the 3rd row [2, 6, 10, 14, 18, 22] is NOT a winning line
  let attempts = 0;
  while (attempts < 10) {
    const thirdRowSymbols = [grid[2], grid[6], grid[10], grid[14], grid[18], grid[22]];
    const firstSymbol = thirdRowSymbols[0];
    
    // Check if 3rd row is a winning combination
    const isThirdRowWinning = thirdRowSymbols.every(symbol => 
      symbol.multiplier === firstSymbol.multiplier && 
      firstSymbol.multiplier > 0
    );
    
    if (!isThirdRowWinning) {
      break; // No winning line, we're good
    }
    
    // Break the winning 3rd row line by regenerating unique symbols for one column
    const columnToChange = Math.floor(rng() * 6); // 0-5 for 6 columns
    const newUniqueSymbols = getUniqueSymbolsForColumn(columnToChange, 4, rng);
    
    // Replace all symbols in this column with new unique symbols
    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      const index = columnToChange * 4 + rowIndex;
      grid[index] = newUniqueSymbols[rowIndex];
    }
    
    attempts++;
  }
  
  return grid;
}
