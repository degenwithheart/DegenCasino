export const calculateBetArray = (multiplier: number) => {
  // Apply 95% RTP (5% house edge)
  const adjustedMultiplier = multiplier * 0.95
  
  const fraction = Math.round((adjustedMultiplier % 1) * 100) / 100
  const repeatMultiplier = (() => {
    switch (fraction) {
      case 0.25:
        return 4
      case 0.5:
        return 2
      case 0.75:
        return 4
      default:
        return 1
    }
  })()
  const totalSum = adjustedMultiplier * repeatMultiplier
  const betArray = Array.from({ length: repeatMultiplier }).map(() => adjustedMultiplier)
  const totalElements = Math.ceil(totalSum)
  const zerosToAdd = totalElements - repeatMultiplier
  return betArray.concat(Array.from({ length: zerosToAdd }).map(() => 0))
}
