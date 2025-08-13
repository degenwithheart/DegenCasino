import { useContext, useEffect } from 'react'
import { GambaResultContext } from '../context/GambaResultContext'

/**
 * Hook to store and retrieve Gamba result data
 * @param clearOnMount - Whether to clear results when the component mounts (default: true)
 */
export const useGambaResult = (clearOnMount: boolean = true) => {
  const { gambaResult, setGambaResult } = useContext(GambaResultContext)

  // Clear result when component mounts (new game loaded)
  useEffect(() => {
    if (clearOnMount) {
      setGambaResult(null)
    }
    
    // Cleanup when component unmounts
    return () => {
      if (clearOnMount) {
        setGambaResult(null)
      }
    }
  }, [setGambaResult, clearOnMount])

  const storeResult = (result: any) => {
    setGambaResult(result)
  }

  const clearResult = () => {
    setGambaResult(null)
  }

  return {
    gambaResult,
    storeResult,
    clearResult,
  }
}
