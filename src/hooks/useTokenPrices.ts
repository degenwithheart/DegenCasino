import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { TOKEN_METADATA, updateTokenPrices } from '../constants'

/**
 * Custom hook to provide live token prices and force re-render on update.
 * Returns the current TOKEN_METADATA array (with up-to-date usdPrice values).
 * 
 * Smart loading: Only fetches prices when on Dashboard pages to reduce API overhead.
 */
export function useTokenPrices(intervalMs = 60000, forceEnable = false) {
  const [, setVersion] = useState(0)
  const location = useLocation()

  // Only fetch prices on Dashboard-related pages or when explicitly forced
  const shouldFetchPrices = forceEnable || 
    location.pathname === '/' || 
    location.pathname.startsWith('/game/') ||
    location.pathname.includes('/profile')

  useEffect(() => {
    if (!shouldFetchPrices) {
      console.log('🚫 Skipping token price fetch - not on Dashboard page')
      return
    }

    let mounted = true
    async function fetchPrices() {
      console.log('💰 Fetching token prices for Dashboard page')
      await updateTokenPrices()
      if (mounted) setVersion(v => v + 1)
    }
    
    fetchPrices()
    const interval = setInterval(fetchPrices, intervalMs)
    return () => { mounted = false; clearInterval(interval) }
  }, [intervalMs, shouldFetchPrices])

  return TOKEN_METADATA
}
