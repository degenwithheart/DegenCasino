import { CellState } from './types'

// Import seeded random functions for deterministic mine placement
const fnv1a = (str: string): number => {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

const mulberry32 = (seed: number) => {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
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
  // Use deterministic mine placement for visual display
  const seed = `mines-${cellIndex}-${numberOfMines}-${cells.length}`
  const rng = mulberry32(fnv1a(seed))
  
  const mineIndices = cells
    .map((cell, index) => ({ cell, index }))
    .sort((a, b) => {
      if (a.index === cellIndex) return -1
      if (b.index === cellIndex) return 1
      if (a.cell.status === 'hidden' && b.cell.status === 'hidden') {
        // Use deterministic randomness instead of Math.random()
        return rng() - 0.5
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
