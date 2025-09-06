import { useState, useCallback } from 'react'
import { useCurrentToken } from 'gamba-react-ui-v2'

interface GameResult {
  /** The payout amount from the game result */
  payout: number
  /** The wager amount */
  wager: number
}

interface UseGameOutcomeReturn {
  /** Whether the outcome overlay is visible */
  showOutcome: boolean
  /** Whether the player has played before (for button text) */
  hasPlayedBefore: boolean
  /** Function to call when game completes with result */
  handleGameComplete: (result: GameResult) => void
  /** Function to call when play again is clicked */
  handlePlayAgain: () => void
  /** Whether the last game was a win */
  isWin: boolean
  /** The profit/loss amount (positive for win, negative for loss) */
  profitAmount: number
  /** Function to reset game state */
  resetGameState: () => void
}

/**
 * Custom hook for managing game outcome overlay state
 * Handles win/loss detection, play again logic, and overlay visibility
 */
export const useGameOutcome = (): UseGameOutcomeReturn => {
  const [showOutcome, setShowOutcome] = useState(false)
  const [hasPlayedBefore, setHasPlayedBefore] = useState(false)
  const [isWin, setIsWin] = useState(false)
  const [profitAmount, setProfitAmount] = useState(0)
  const token = useCurrentToken()

  const handleGameComplete = useCallback((result: GameResult) => {
    const profit = result.payout - result.wager
    const won = profit > 0  // Fixed: win if profit > 0, not just payout > 0
    
    setIsWin(won)
    setProfitAmount(Math.abs(profit))
    setShowOutcome(true)
    setHasPlayedBefore(true)
  }, [])

  const handlePlayAgain = useCallback(() => {
    setShowOutcome(false)
    // Reset win state after a short delay to prevent flashing
    setTimeout(() => {
      setIsWin(false)
      setProfitAmount(0)
    }, 300)
  }, [])

  const resetGameState = useCallback(() => {
    setShowOutcome(false)
    setHasPlayedBefore(false)
    setIsWin(false)
    setProfitAmount(0)
  }, [])

  return {
    showOutcome,
    hasPlayedBefore,
    handleGameComplete,
    handlePlayAgain,
    isWin,
    profitAmount,
    resetGameState,
  }
}

export default useGameOutcome
