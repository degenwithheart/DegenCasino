// 🎵 Sounds
export { default as SOUND_CHIP } from './chip.mp3'
export { default as SOUND_LOSE } from './lose.mp3'
export { default as SOUND_PLAY } from './play.mp3'
export { default as SOUND_WIN } from './win.mp3'

// 🎲 Game Constants

// Array of all numbers on a European roulette wheel (0-36)
export const allNumbers = Array.from({ length: 37 }, (_, i) => i);


// 🔴 Red Numbers (alternating for 8 slices)
const RED_NUMBERS = [1, 3, 5, 7];
const isRed = (number: number): boolean => RED_NUMBERS.includes(number);

const getRow = (index: number): number =>
  2 - (index % 2)


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

// 🧩 Final Table Layout (simplified for 8-slice wheel)
export const tableLayout: TableLayout = {
  ...numbersLayout,

  // Bottom row special squares (adjusted for 8 numbers)
  firstHalf: makeSquare('<5', n => n <= 4, [1, 3]),
  even: makeSquare('Even', n => n % 2 === 0, [2, 3]),
  red: makeSquare('Red', isRed, [3, 3]),
  black: makeSquare('Black', n => !isRed(n), [4, 3]),
  odd: makeSquare('Odd', n => n % 2 === 1, [5, 3]),
  secondHalf: makeSquare('>4', n => n > 4, [6, 3]),
}
