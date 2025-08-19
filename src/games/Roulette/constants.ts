// 🎵 Sounds
export { default as SOUND_CHIP } from './chip.mp3'
export { default as SOUND_LOSE } from './lose.mp3'
export { default as SOUND_PLAY } from './play.mp3'
export { default as SOUND_WIN } from './win.mp3'

// 🎲 Game Constants
export const CHIPS = [1, 2, 10, 50]
export const NUMBERS = 18
export const NUMBER_COLUMNS = Math.ceil(NUMBERS / 3)

// 🔴 Red Numbers
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]

const isRed = (number: number): boolean =>
  RED_NUMBERS.includes(number % (RED_NUMBERS.length + 1))

const getRow = (index: number): number =>
  3 - (index % 3)

// 🔢 All Numbers (1-based)
const allNumbers = Array.from({ length: NUMBERS }, (_, i) => i + 1)

// 🧱 Grid Shape for Table Squares
interface TableSquare {
  label: string
  numbers: number[] | string[]
  row: number
  column: number
  color?: 'red' | 'black'
}

type TableLayout = Record<string, TableSquare>

// 🔲 Build helper
const makeSquare = (
  label: string,
  numberFilter: (number: number) => boolean,
  [column, row]: [number, number],
): TableSquare => {
  const numbers = allNumbers.filter(numberFilter)
  return { label, numbers, row, column }
}

// 🔢 Main Grid (individual number squares)
const numbersLayout = allNumbers.reduce<TableLayout>((acc, number, index) => {
  acc[number] = {
    label: String(number),
    numbers: [String(number)],
    row: getRow(index),
    column: 1 + Math.floor(index / 3),
    color: isRed(number) ? 'red' : 'black',
  }
  return acc
}, {})

// 🧩 Final Table Layout
export const tableLayout: TableLayout = {
  ...numbersLayout,

  // Bottom row special squares
  firstHalf: makeSquare(`<${Math.floor(NUMBERS / 2 + 1)}`, n => n <= NUMBERS / 2, [1, 4]),
  even: makeSquare('Even', n => n % 2 === 0, [2, 4]),
  red: makeSquare('Red', isRed, [3, 4]),
  black: makeSquare('Black', n => !isRed(n), [4, 4]),
  odd: makeSquare('Odd', n => n % 2 === 1, [5, 4]),
  secondHalf: makeSquare(`>${Math.floor(NUMBERS / 2)}`, n => n > NUMBERS / 2, [6, 4]),

  // Right column (2:1)
  row1: makeSquare('2:1', n => getRow(n - 1) === 1, [NUMBER_COLUMNS + 1, 1]),
  row2: makeSquare('2:1', n => getRow(n - 1) === 2, [NUMBER_COLUMNS + 1, 2]),
  row3: makeSquare('2:1', n => getRow(n - 1) === 3, [NUMBER_COLUMNS + 1, 3]),
}
