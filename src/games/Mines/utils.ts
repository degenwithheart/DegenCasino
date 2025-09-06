import { CellState } from './types'
import { makeDeterministicRng } from '../../fairness/deterministicRng'

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
  const rng = makeDeterministicRng(`mines:${cellIndex}:${numberOfMines}:${cells.length}`)
  const hidden = cells.map((cell, index) => index).filter(i => i !== cellIndex)
  // Fisher-Yates deterministic shuffle
  for (let i = hidden.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[hidden[i], hidden[j]] = [hidden[j], hidden[i]]
  }
  const mineIndices = [cellIndex, ...hidden.slice(0, numberOfMines - 1)]

  return cells.map<CellState>(
    (cell, i) => {
      if (mineIndices.includes(i)) {
        return { status: 'mine', profit: 0 }
      }
      return cell
    },
  )
}
