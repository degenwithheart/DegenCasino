import { SLOT_ITEMS, SlotItem } from './constants'
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
 * Gets the paylines for checking wins (1 horizontal line on middle row)
 * Dynamically calculates payline based on number of reels and rows
 * For 3-row games: middle row (row 1)
 * For 4-row games: 3rd row (row 2)  
 * Grid layout is column-major: reel 0: [0, 1, 2...], reel 1: [rows, rows+1, rows+2...]
 */
export const getPaylines = (numReels: number, numRows: number) => {
  const middleRow = Math.floor(numRows / 2); // Row 1 for 3 rows, row 1 for 4 rows
  const winningLine: number[] = [];
  
  // Build the middle row payline: [middleRow, middleRow + numRows, middleRow + 2*numRows, ...]
  for (let reel = 0; reel < numReels; reel++) {
    winningLine.push(middleRow + reel * numRows);
  }
  
  return [winningLine];
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
export const getWinningPaylines = (grid: SlotItem[], numReels: number, numRows: number) => {
  const paylines = getPaylines(numReels, numRows);
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
 * Enhanced getSlotCombination with strategic column sequences 
 * Supports dynamic grid sizes (4x3 or 6x3)
 * Grid layout is column-major: [0, 1, 2], [3, 4, 5], [6, 7, 8]... for 3 rows
 * Winning line is always the middle row
 */
export const getSlotCombination = (
  count: number, // Total slots (numReels * numRows)
  multiplier: number,
  bet: number[],
  seed: string, // typically the on-chain result signature
  numReels: number,
  numRows: number,
) => {
  const rng = makeDeterministicRng(`${seed}:${multiplier}:${bet.length}:${count}:${numReels}:${numRows}`)

  // Generate dynamic column sequences based on number of reels
  const baseSequence = ['MYTHICAL', 'LEGENDARY', 'DGHRT', 'SOL', 'USDC', 'JUP', 'BONK', 'WOJAK'];
  const generateColumnSequences = (numReels: number) => {
    const sequences: string[][] = [];
    for (let i = 0; i < numReels; i++) {
      if (i === 0) {
        sequences.push([...baseSequence]); // Column 0: original
      } else if (i === 1) {
        sequences.push([...baseSequence].reverse()); // Column 1: reverse
      } else {
        // For other columns, create variations by rotating and shuffling
        const rotated = [...baseSequence.slice(i), ...baseSequence.slice(0, i)];
        sequences.push(rotated);
      }
    }
    return sequences;
  };
  
  const COLUMN_SEQUENCES = generateColumnSequences(numReels);
  
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
    const sequence = COLUMN_SEQUENCES[columnIndex]
    if (!sequence) return SLOT_ITEMS[0] // fallback
    const randomIndex = Math.floor(rng() * sequence.length)
    return getSymbolByName(sequence[randomIndex])
  }

  // Helper to get unique symbols for a column (no duplicates in vertical reel)
  const getUniqueSymbolsForColumn = (columnIndex: number, count: number, rng: () => number): SlotItem[] => {
    const sequence = COLUMN_SEQUENCES[columnIndex]
    if (!sequence) return Array(count).fill(SLOT_ITEMS[0]) // fallback
    const shuffled = [...sequence].sort(() => rng() - 0.5) // Shuffle the sequence
    return shuffled.slice(0, count).map(symbolName => getSymbolByName(symbolName))
  }

  const middleRow = Math.floor(numRows / 2); // Middle row is the winning line
  
  // WIN CASE: create a grid with the winning middle row line
  if (multiplier > 0) {
    const winningItems = SLOT_ITEMS.filter((x) => x.multiplier === multiplier)
    const chosen = winningItems.length > 0 
      ? pickDeterministic(winningItems, rng)
      : pickDeterministic(SLOT_ITEMS, rng)

    // Create dynamic grid
    const grid: SlotItem[] = new Array(count).fill(null);
    
    // Fill each column with symbols, ensuring the winning symbol is at the middle row
    for (let columnIndex = 0; columnIndex < numReels; columnIndex++) {
      const uniqueSymbols = getUniqueSymbolsForColumn(columnIndex, numRows, rng);
      
      // Place symbols in this column
      for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
        const index = columnIndex * numRows + rowIndex;
        if (rowIndex === middleRow) {
          grid[index] = chosen; // Place winning symbol at middle row
        } else {
          grid[index] = uniqueSymbols[rowIndex];
        }
      }
    }
    
    return grid;
  }

  // LOSS CASE: create a grid with no winning middle row line
  const grid: SlotItem[] = new Array(count).fill(null);
  
  // Fill each column with unique symbols (no duplicates per vertical reel)
  for (let columnIndex = 0; columnIndex < numReels; columnIndex++) {
    const uniqueSymbols = getUniqueSymbolsForColumn(columnIndex, numRows, rng);
    
    // Place symbols in this column
    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
      const index = columnIndex * numRows + rowIndex;
      grid[index] = uniqueSymbols[rowIndex];
    }
  }
  
  // Ensure the middle row is NOT a winning line
  let attempts = 0;
  while (attempts < 10) {
    const middleRowSymbols: SlotItem[] = [];
    for (let columnIndex = 0; columnIndex < numReels; columnIndex++) {
      const index = columnIndex * numRows + middleRow;
      middleRowSymbols.push(grid[index]);
    }
    
    const firstSymbol = middleRowSymbols[0];
    
    // Check if middle row is a winning combination
    const isMiddleRowWinning = middleRowSymbols.every(symbol => 
      symbol.multiplier === firstSymbol.multiplier && 
      firstSymbol.multiplier > 0
    );
    
    if (!isMiddleRowWinning) {
      break; // No winning line, we're good
    }
    
    // Break the winning middle row line by changing one symbol
    const columnToChange = Math.floor(rng() * numReels);
    const newUniqueSymbols = getUniqueSymbolsForColumn(columnToChange, numRows, rng);
    
    // Replace all symbols in this column with new unique symbols
    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
      const index = columnToChange * numRows + rowIndex;
      grid[index] = newUniqueSymbols[rowIndex];
    }
    
    attempts++;
  }
  
  return grid;
}
