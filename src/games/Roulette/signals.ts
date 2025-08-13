import { computed, signal } from '@preact/signals-react'
import { CHIPS, NUMBERS, tableLayout } from './constants'

export const chipPlacements = signal<Record<string, number>>({})
export const hovered = signal<readonly number[]>([])
export const results = signal<readonly number[]>([])
export const selectedChip = signal<number>(CHIPS[0])

// Distributes chips placed on squares equally across all numbers covered by those squares
export const distributedChips = computed(() => {
  const placements = Object.entries(chipPlacements.value)
  const distributed: number[] = Array(NUMBERS).fill(0)

  for (const [id, amount] of placements) {
    const square = tableLayout[id]
    if (!square) continue
    // Distribute amount equally to each number in this square
    // Using BigInt to avoid floating precision errors (chip amounts may be decimals)
    const divided = Number(BigInt(amount * 10_000) / BigInt(square.numbers.length)) / 10_000

    for (const number of square.numbers) {
      const numValue = typeof number === 'string' ? parseInt(number, 10) : number
      const index = numValue - 1
      if (index >= 0 && index < distributed.length) {
        distributed[index] = distributed[index] + divided
      }
    }
  }

  return distributed
})

// Sum of all chips on the table
export const totalChipValue = computed(() =>
  Math.floor(distributedChips.value.reduce((a, b) => a + b, 0))
)

// Returns the proportional bet for each number based on distributed chips
export const bet = computed(() => {
  const total = totalChipValue.value || 1
  return distributedChips.value.map((amount) =>
    (Number(BigInt(amount * distributedChips.value.length * 10_000) / BigInt(total)) / 10_000) * 0.95
  )
})

export const addResult = (index: number) => {
  results.value = [...results.value, index]
}

export const getChips = (id: string) => chipPlacements.value[id] ?? 0

export const hover = (ids: number[]) => {
  hovered.value = ids
}

export const addChips = (id: string, amount: number) => {
  chipPlacements.value = {
    ...chipPlacements.value,
    [id]: getChips(id) + amount,
  }
}

export const removeChips = (id: string) => {
  chipPlacements.value = {
    ...chipPlacements.value,
    [id]: 0,
  }
}

export const clearChips = () => {
  chipPlacements.value = {}
}

export const clearHover = () => {
  hovered.value = []
}

export const clearResults = () => {
  results.value = []
}
