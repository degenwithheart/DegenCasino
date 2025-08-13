import { SLOT_ITEMS, SlotItem, WINNING_PATTERNS, SCATTER_PATTERNS, MIN_MATCH, MAX_MATCH, PAYLINES, NUM_REELS, NUM_ROWS, TOTAL_POSITIONS, REEL_STRIPS } from './constants'

// Import seeded random functions for provable fairness
import { fnv1a, mulberry32 } from '../../sections/userProfileUtils'

const pickRandom = <T>(arr: T[]) => arr.at(Math.floor(Math.random() * arr.length))

// Deterministic shuffle using seeded random (for provable fairness)
const shuffleWithSeed = <T>(array: T[], seed: string): T[] => {
  const rng = mulberry32(fnv1a(seed))
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Generate a single reel from its predefined strip at a deterministic position
 * Uses a seed based on reel index for consistent but varied results
 */
const generateReelFromStrip = (reelIndex: number, seedSuffix: string = ''): SlotItem[] => {
  const strip = REEL_STRIPS[reelIndex]
  if (!strip) {
    // Fallback if reel strip doesn't exist
    return Array.from({ length: NUM_ROWS }, () => pickRandom(SLOT_ITEMS) ?? SLOT_ITEMS[0])
  }
  
  // Use deterministic position based on reel index and seed
  const seed = `reel-${reelIndex}-${seedSuffix}`
  const rng = mulberry32(fnv1a(seed))
  const startPos = Math.floor(rng() * strip.length)
  const reel: SlotItem[] = []
  
  // Get 3 consecutive symbols from the strip (wrapping around if needed)
  for (let i = 0; i < NUM_ROWS; i++) {
    const symbolId = strip[(startPos + i) % strip.length]
    const slotItem = SLOT_ITEMS.find(item => item.id === symbolId)
    reel.push(slotItem ?? SLOT_ITEMS[0])
  }
  
  return reel
}

/**
 * Find all possible reel positions where a specific symbol appears in the middle row (index 1)
 */
const findSymbolPositionsInReel = (reelIndex: number, symbolId: string): number[] => {
  const strip = REEL_STRIPS[reelIndex]
  if (!strip) return []
  
  const positions: number[] = []
  
  // Look for positions where the symbol would appear in the middle row (position 1 of the 3-symbol window)
  for (let startPos = 0; startPos < strip.length; startPos++) {
    const middleSymbol = strip[(startPos + 1) % strip.length]
    if (middleSymbol === symbolId) {
      positions.push(startPos)
    }
  }
  
  return positions
}

/**
 * Generate a reel positioned so a specific symbol appears in a specific row
 */
const generateReelWithSymbolAtPosition = (reelIndex: number, symbolId: string, targetRow: number): SlotItem[] | null => {
  const strip = REEL_STRIPS[reelIndex]
  if (!strip) return null
  
  // Find all starting positions where the symbol appears at the target row
  const validStartPositions: number[] = []
  
  for (let startPos = 0; startPos < strip.length; startPos++) {
    const symbolAtTargetRow = strip[(startPos + targetRow) % strip.length]
    if (symbolAtTargetRow === symbolId) {
      validStartPositions.push(startPos)
    }
  }
  
  if (validStartPositions.length === 0) {
    return null // This symbol doesn't appear at this row position in this reel's strip
  }
  
  // Pick a random valid starting position
  const chosenStartPos = pickRandom(validStartPositions) ?? validStartPositions[0]
  
  // Generate the reel showing 3 consecutive symbols from this position
  const reel: SlotItem[] = []
  for (let i = 0; i < NUM_ROWS; i++) {
    const symbolId = strip[(chosenStartPos + i) % strip.length]
    const slotItem = SLOT_ITEMS.find(item => item.id === symbolId)
    reel.push(slotItem ?? SLOT_ITEMS[0])
  }
  
  return reel
}

/**
 * Convert reel-based structure to flat grid for compatibility with existing payline logic
 */
const reelsToGrid = (reels: SlotItem[][]): SlotItem[] => {
  const grid: SlotItem[] = []
  
  for (let row = 0; row < NUM_ROWS; row++) {
    for (let reel = 0; reel < NUM_REELS; reel++) {
      grid.push(reels[reel][row])
    }
  }
  
  return grid
}

/**
 * Convert flat grid back to reel structure 
 */
const gridToReels = (grid: SlotItem[]): SlotItem[][] => {
  const reels: SlotItem[][] = []
  
  for (let reel = 0; reel < NUM_REELS; reel++) {
    const reelItems: SlotItem[] = []
    for (let row = 0; row < NUM_ROWS; row++) {
      const gridIndex = row * NUM_REELS + reel
      reelItems.push(grid[gridIndex])
    }
    reels.push(reelItems)
  }
  
  return reels
}

/**
 * Get all possible winning multipliers for the new payline system
 */
const getAllPossibleMultipliers = () => {
  const multipliers: number[] = []
  
  // Add all winning pattern multipliers (payline wins)
  for (let matchCount = MIN_MATCH; matchCount <= MAX_MATCH; matchCount++) {
    const patterns = WINNING_PATTERNS[matchCount as keyof typeof WINNING_PATTERNS]
    if (patterns) {
      Object.values(patterns).forEach(mult => {
        if (!multipliers.includes(mult)) {
          multipliers.push(mult)
        }
      })
    }
  }
  
  // Add scatter pattern multipliers
  for (let matchCount = MIN_MATCH; matchCount <= MAX_MATCH; matchCount++) {
    const patterns = SCATTER_PATTERNS[matchCount as keyof typeof SCATTER_PATTERNS]
    if (patterns) {
      Object.values(patterns).forEach(mult => {
        if (!multipliers.includes(mult)) {
          multipliers.push(mult)
        }
      })
    }
  }
  
  // Add zero for losing combinations
  multipliers.push(0)
  
  return multipliers.sort((a, b) => a - b)
}

/**
 * Creates a bet array for given wager amount and max payout
 */
export const generateBetArray = (
  maxPayout: number,
  wager: number,
  maxLength = 50,
) => {
  const maxMultiplier = Math.min(maxLength, maxPayout / wager)
  const allPossibleMultipliers = getAllPossibleMultipliers()
  const validMultipliers = allPossibleMultipliers.filter(mult => mult <= maxMultiplier && mult > 0) // Only winning multipliers
  
  if (!validMultipliers.length) return Array(maxLength).fill(0) // All losses if no valid wins
  
  // Create realistic slot machine odds: ~85% losses, ~15% wins
  const lossCount = Math.floor(maxLength * 0.85) // 85% losses
  const winCount = maxLength - lossCount // 15% wins
  
  const arr: number[] = []
  
  // Add losses (0 multiplier)
  for (let i = 0; i < lossCount; i++) {
    arr.push(0)
  }
  
  // Add wins (cycle through valid multipliers)
  for (let i = 0; i < winCount; i++) {
    const multiplier = validMultipliers[i % validMultipliers.length]
    arr.push(multiplier)
  }
  
  // Use deterministic shuffle for provable fairness
  const shuffleSeed = `slots-bet-array-${maxPayout}-${wager}-${maxLength}`
  const rng = mulberry32(fnv1a(shuffleSeed))
  
  // Deterministic Fisher-Yates shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }

  console.log('Generated bet array:', {
    length: arr.length,
    lossCount,
    winCount,
    lossPercentage: (lossCount / maxLength * 100).toFixed(1) + '%',
    winPercentage: (winCount / maxLength * 100).toFixed(1) + '%',
    validMultipliers,
    maxMultiplier,
    maxPayout,
    wager,
    sampleArray: arr.slice(0, 20) // Show first 20 elements
  })

  return arr
}

/**
 * Check for winning patterns on paylines
 */
const checkPaylineWins = (grid: SlotItem[]): { symbol: string; count: number; multiplier: number; isScatter: boolean } | null => {
  // Check paylines for consecutive matches
  for (const payline of PAYLINES) {
    for (let startPos = 0; startPos <= payline.length - MIN_MATCH; startPos++) {
      for (let length = MAX_MATCH; length >= MIN_MATCH; length--) {
        if (startPos + length > payline.length) continue
        
        const positions = payline.slice(startPos, startPos + length)
        const symbols = positions.map(pos => grid[pos])
        
        if (symbols.every(symbol => symbol?.id === symbols[0]?.id)) {
          const symbolId = symbols[0].id
          const patterns = WINNING_PATTERNS[length as keyof typeof WINNING_PATTERNS]
          
          if (patterns && patterns[symbolId as keyof typeof patterns]) {
            return {
              symbol: symbolId,
              count: length,
              multiplier: patterns[symbolId as keyof typeof patterns],
              isScatter: false
            }
          }
        }
      }
    }
  }
  
  // Check for scatter wins (same symbol anywhere on grid)
  const symbolCounts: Record<string, number> = {}
  grid.forEach(item => {
    if (item) {
      symbolCounts[item.id] = (symbolCounts[item.id] || 0) + 1
    }
  })
  
  for (let count = MAX_MATCH; count >= MIN_MATCH; count--) {
    for (const [symbolId, symbolCount] of Object.entries(symbolCounts)) {
      if (symbolCount >= count) {
        const patterns = SCATTER_PATTERNS[count as keyof typeof SCATTER_PATTERNS]
        if (patterns && patterns[symbolId as keyof typeof patterns]) {
          return {
            symbol: symbolId,
            count,
            multiplier: patterns[symbolId as keyof typeof patterns],
            isScatter: true
          }
        }
      }
    }
  }
  
  return null
}

/**
 * Determines which symbol and count combination gives the target multiplier
 */
const findWinningPattern = (multiplier: number): { symbol: string; count: number; isScatter: boolean } | null => {
  // Check payline patterns first
  for (let matchCount = MAX_MATCH; matchCount >= MIN_MATCH; matchCount--) {
    const patterns = WINNING_PATTERNS[matchCount as keyof typeof WINNING_PATTERNS]
    if (patterns) {
      for (const [symbol, mult] of Object.entries(patterns)) {
        if (mult === multiplier) {
          return { symbol, count: matchCount, isScatter: false }
        }
      }
    }
  }
  
  // Check scatter patterns
  for (let matchCount = MAX_MATCH; matchCount >= MIN_MATCH; matchCount--) {
    const patterns = SCATTER_PATTERNS[matchCount as keyof typeof SCATTER_PATTERNS]
    if (patterns) {
      for (const [symbol, mult] of Object.entries(patterns)) {
        if (mult === multiplier) {
          return { symbol, count: matchCount, isScatter: true }
        }
      }
    }
  }
  
  return null
}

/**
 * Picks a random slot grid combination based on the result using strict reel strip logic
 * CRITICAL: All reels must follow their predefined sequences exactly
 */
export const getSlotCombination = (totalPositions: number, multiplier: number, bet: number[]): SlotItem[] => {
  console.log('getSlotCombination called with:', { multiplier, isWin: multiplier > 0 })
  
  // WINNING COMBINATION: Only if Gamba says it's a win
  if (multiplier > 0) {
    const winningPattern = findWinningPattern(multiplier)
    
    if (winningPattern) {
      const { symbol, count: matchCount, isScatter } = winningPattern
      console.log('Creating winning pattern:', { symbol, matchCount, isScatter, targetMultiplier: multiplier })
      
      if (isScatter) {
        // For scatter wins, try to position reels so the symbol appears in various positions
        return generateScatterWinWithStrips(symbol, matchCount)
      } else {
        // For payline wins, try to create the pattern using reel strips
        return generatePaylineWinWithStrips(symbol, matchCount)
      }
    } else {
      console.warn('No winning pattern found for multiplier:', multiplier)
      return generateStrictLosingCombination()
    }
  }

  // LOSING COMBINATION: Guaranteed to have no winning patterns while respecting reel strips
  console.log('Creating guaranteed losing combination')
  return generateStrictLosingCombination()
}

/**
 * Generate a payline win using strict reel strip adherence
 */
const generatePaylineWinWithStrips = (symbol: string, matchCount: number): SlotItem[] => {
  // Use deterministic shuffle based on symbol and match count for provable fairness
  const shuffleSeed = `${symbol}-${matchCount}-paylines`
  const shuffledPaylines = shuffleWithSeed(PAYLINES, shuffleSeed)
  
  // Try each payline to see if we can create the winning pattern
  for (const payline of shuffledPaylines) {
    const maxStartPos = Math.max(0, payline.length - matchCount)
    
    for (let startPos = 0; startPos <= maxStartPos; startPos++) {
      const winningPositions = payline.slice(startPos, startPos + matchCount)
      
      // Check if all required reels can show this symbol in the required rows
      let canCreatePattern = true
      const requiredReelConfigs: { reelIndex: number; targetRow: number }[] = []
      
      for (const position of winningPositions) {
        const reelIndex = position % NUM_REELS
        const rowIndex = Math.floor(position / NUM_REELS)
        
        // Check if this reel can show this symbol at this row
        const strip = REEL_STRIPS[reelIndex]
        if (!strip) {
          canCreatePattern = false
          break
        }
        
        // Check if the symbol exists at this row position in any starting position
        let symbolCanAppearAtRow = false
        for (let stripStartPos = 0; stripStartPos < strip.length; stripStartPos++) {
          const symbolAtRow = strip[(stripStartPos + rowIndex) % strip.length]
          if (symbolAtRow === symbol) {
            symbolCanAppearAtRow = true
            break
          }
        }
        
        if (!symbolCanAppearAtRow) {
          canCreatePattern = false
          break
        }
        
        requiredReelConfigs.push({ reelIndex, targetRow: rowIndex })
      }
      
      if (canCreatePattern) {
        // Generate the winning pattern with a deterministic seed
        const seedSuffix = `payline-win-${symbol}-${matchCount}`
        const reels = Array.from({ length: NUM_REELS }, (_, i) => generateReelFromStrip(i, seedSuffix))
        
        // Position required reels to show the winning symbol
        for (const { reelIndex, targetRow } of requiredReelConfigs) {
          const specialReel = generateReelWithSymbolAtPosition(reelIndex, symbol, targetRow)
          if (specialReel) {
            reels[reelIndex] = specialReel
          }
        }
        
        const grid = reelsToGrid(reels)
        
        // Verify this creates the expected pattern
        const verification = checkPaylineWins(grid)
        if (verification && verification.symbol === symbol && verification.count === matchCount) {
          console.log('Successfully created payline win with strips:', verification)
          return grid
        }
      }
    }
  }
  
  console.warn('Could not create payline win with strict strips, falling back to losing combination')
  return generateStrictLosingCombination()
}

/**
 * Generate a scatter win using strict reel strip adherence
 */
const generateScatterWinWithStrips = (symbol: string, matchCount: number): SlotItem[] => {
  const seedSuffix = `scatter-win-${symbol}-${matchCount}`
  const reels = Array.from({ length: NUM_REELS }, (_, i) => generateReelFromStrip(i, seedSuffix))
  
  // Try to position symbols by checking which reels can show the symbol
  let symbolsPlaced = 0
  const reelIndices = shuffleWithSeed(Array.from({ length: NUM_REELS }, (_, i) => i), `scatter-reels-${symbol}-${matchCount}`)
  
  for (const reelIndex of reelIndices) {
    if (symbolsPlaced >= matchCount) break
    
    // Check if this reel can show the symbol in any row
    for (let targetRow = 0; targetRow < NUM_ROWS; targetRow++) {
      const specialReel = generateReelWithSymbolAtPosition(reelIndex, symbol, targetRow)
      if (specialReel) {
        reels[reelIndex] = specialReel
        symbolsPlaced++
        break
      }
    }
  }
  
  const grid = reelsToGrid(reels)
  
  // Verify we got enough symbols for scatter
  const symbolCount = grid.filter(item => item.id === symbol).length
  if (symbolCount >= matchCount) {
    console.log('Successfully created scatter win with strips')
    return grid
  }
  
  console.warn('Could not create scatter win with strict strips, falling back to losing combination')
  return generateStrictLosingCombination()
}

/**
 * Generate a losing combination that strictly follows reel strips
 */
const generateStrictLosingCombination = (): SlotItem[] => {
  let attempts = 0
  
  while (attempts < 50) {
    // Generate all reels from their strips with deterministic seed based on attempt
    const seedSuffix = `losing-combo-attempt-${attempts}`
    const reels = Array.from({ length: NUM_REELS }, (_, i) => generateReelFromStrip(i, seedSuffix))
    const grid = reelsToGrid(reels)
    
    // Check if this accidentally creates any wins
    const winCheck = checkPaylineWins(grid)
    
    if (winCheck === null) {
      console.log('Generated losing combination with strict strips')
      return grid
    }
    
    attempts++
  }
  
  console.warn('Could not generate losing combination with strips after 50 attempts, using fallback')
  
  // Fallback: Generate a specific losing pattern manually
  // Create a pattern that's guaranteed to lose by ensuring no 3+ consecutive matches
  const safeReels: SlotItem[][] = []
  
  for (let reelIndex = 0; reelIndex < NUM_REELS; reelIndex++) {
    const strip = REEL_STRIPS[reelIndex]
    if (!strip) {
      safeReels.push([SLOT_ITEMS[0], SLOT_ITEMS[1], SLOT_ITEMS[2]])
      continue
    }
    
    // Find a position in the strip that won't create horizontal matches
    let bestStartPos = 0
    for (let startPos = 0; startPos < strip.length; startPos++) {
      const middleSymbol = strip[(startPos + 1) % strip.length]
      
      // Try to avoid common symbols for horizontal matches
      if (reelIndex > 0) {
        const prevReelMiddle = safeReels[reelIndex - 1][1].id
        if (middleSymbol !== prevReelMiddle) {
          bestStartPos = startPos
          break
        }
      } else {
        bestStartPos = startPos
        break
      }
    }
    
    // Generate reel from chosen position
    const reel: SlotItem[] = []
    for (let i = 0; i < NUM_ROWS; i++) {
      const symbolId = strip[(bestStartPos + i) % strip.length]
      const slotItem = SLOT_ITEMS.find(item => item.id === symbolId)
      reel.push(slotItem ?? SLOT_ITEMS[0])
    }
    
    safeReels.push(reel)
  }
  
  return reelsToGrid(safeReels)
}
