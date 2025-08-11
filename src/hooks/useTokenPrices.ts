import { useEffect, useState } from 'react'
import { TOKEN_METADATA, updateTokenPrices } from '../constants'

/**
 * Custom hook to provide live token prices and force re-render on update.
 * Returns the current TOKEN_METADATA array (with up-to-date usdPrice values).
 */
export function useTokenPrices(intervalMs = 60000) {
  const [, setVersion] = useState(0)

  useEffect(() => {
    let mounted = true
    async function fetchPrices() {
      await updateTokenPrices()
      if (mounted) setVersion(v => v + 1)
    }
    fetchPrices()
    const interval = setInterval(fetchPrices, intervalMs)
    return () => { mounted = false; clearInterval(interval) }
  }, [intervalMs])

  return TOKEN_METADATA
}
