import { CellState } from './types'
import { PROGRESSIVE_CAPS, GRID_SIZE } from './constants'

// Get progressive caps for a given level
export const getProgressiveCaps = (level: number) => {
  const capIndex = Math.min(level, PROGRESSIVE_CAPS.multiplier.length - 1)
  return {
    maxMultiplier: PROGRESSIVE_CAPS.multiplier[capIndex],
    maxWagerRatio: PROGRESSIVE_CAPS.wagerPercent[capIndex] / 100
  }
}

// Calculate progressive multiplier based on level and remaining cells
export const getProgressiveMultiplier = (level: number, remainingCells: number, mines: number) => {
  const { maxMultiplier } = getProgressiveCaps(level)
  const baseMultiplier = Number(BigInt(remainingCells) * 10000n / BigInt(remainingCells - mines)) / 10000
  return Math.min(baseMultiplier, maxMultiplier)
}

// Calculate next wager based on current profit and level
export const getProgressiveWager = (level: number, initialWager: number, currentProfit: number, poolMaxPayout: number) => {
  const capIndex = Math.min(level, PROGRESSIVE_CAPS.wagerPercent.length - 1)
  
  // Calculate percentage-based increase
  const percentIncrease = (PROGRESSIVE_CAPS.wagerPercent[capIndex] - 100) / 100
  const percentBasedWager = initialWager * (1 + percentIncrease)
  
  // Calculate absolute-capped increase
  const maxIncrease = PROGRESSIVE_CAPS.wagerMaxIncrease[capIndex]
  const absoluteCappedWager = initialWager + maxIncrease
  
  // Take the smaller of percentage or absolute increase
  const maxWager = Math.min(percentBasedWager, absoluteCappedWager)
  
  // Ensure we never exceed pool limits
  const maxSafeWager = poolMaxPayout / getProgressiveMultiplier(level, GRID_SIZE - level, 1)
  
  // Use the smallest of all constraints
  const suggestedWager = Math.min(currentProfit, maxWager, maxSafeWager)
  
  // Never go below initial wager
  return Math.max(initialWager, suggestedWager)
}

export const generateGrid = (size: number) =>
  Array
    .from<CellState>({ length: size })
    .fill({ status: 'hidden', profit: 0 })

export const revealGold = (cells: CellState[], cellIndex: number, value: number) => {
  return cells.map<CellState>(
    (cell, i) => {
      if (i === cellIndex) {
        return { status: 'gold', profit: value }
      }
      return cell
    },
  )
}

export const revealAllMines = (
  cells: CellState[],
  cellIndex: number,
  numberOfMines: number,
) => {
  const mineIndices = cells
    .map((cell, index) => ({ cell, index }))
    .sort((a, b) => {
      if (a.index === cellIndex) return -1
      if (b.index === cellIndex) return 1
      if (a.cell.status === 'hidden' && b.cell.status === 'hidden') {
        return Math.random() - .5
      }
      if (a.cell.status === 'hidden') return -1
      if (b.cell.status === 'hidden') return 1
      return 0
    })
    .map((x) => x.index)
    .slice(0, numberOfMines)

  return cells.map<CellState>(
    (cell, i) => {
      if (mineIndices.includes(i)) {
        return { status: 'mine', profit: 0 }
      }
      return cell
    },
  )
}
