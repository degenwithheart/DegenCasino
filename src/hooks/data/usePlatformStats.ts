import { useState, useEffect } from 'react'

interface PlatformStats {
  usd_volume: number
  usd_fees: number
  total_games: number
  volume?: number // SOL volume if available
  plays?: number // Number of plays
  sol_volume?: number // Calculated SOL volume from actual wagers
}

const API_ENDPOINT = 'https://api.gamba.so'
const PLATFORM_CREATOR = '6o1iE4cKQcjW4UFd4vn35r43qD9LjNDhPGNUMBuS8ocZ'

// Cache for better performance
let cachedStats: { data: PlatformStats | null, timestamp: number } | null = null
const CACHE_DURATION = 30000 // 30 seconds

export function usePlatformStats() {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check cache first - show cached data immediately if available
    if (cachedStats && (Date.now() - cachedStats.timestamp) < CACHE_DURATION) {
      console.log('Using cached dashboard data')
      setStats(cachedStats.data)
      setLoading(false)
      return
    }
    
    // If we have stale cached data, show it while loading fresh data
    if (cachedStats && cachedStats.data) {
      console.log('Showing stale cache while refreshing dashboard data')
      setStats(cachedStats.data)
      setLoading(false) // Don't show loading if we have stale data
    }

    const fetchStats = async () => {
      const startTime = performance.now()
      try {
        setLoading(true)
        setError(null)

        // Use the correct stats endpoint
        const statsUrl = `${API_ENDPOINT}/stats?creator=${PLATFORM_CREATOR}`
        console.log('Fetching dashboard stats from:', statsUrl)
        const response = await fetch(statsUrl, { 
          timeout: 10000 // 10 second timeout
        } as any)

        if (response.ok) {
          const data = await response.json()
          console.log('Platform stats API response:', data)
          
          // Fetch recent plays for SOL volume calculation (optimized)
          try {
            const playsUrl = `${API_ENDPOINT}/events/settledGames?creator=${PLATFORM_CREATOR}&itemsPerPage=100&page=0`
            console.log('Fetching plays data from:', playsUrl)
            const playsResponse = await fetch(playsUrl, { 
              timeout: 10000 // 10 second timeout
            } as any)
            
            if (playsResponse.ok) {
              const playsData = await playsResponse.json()
              
              if (playsData && Array.isArray(playsData.results)) {
                // Calculate SOL volume with proper lamports conversion
                const filteredPlays = playsData.results.filter((play: any) => play.creator === PLATFORM_CREATOR)
                console.log('Filtered plays for creator:', filteredPlays.length, 'plays')
                
                const calculatedSolVolume = filteredPlays.reduce((total: number, play: any) => {
                  const wagerAmount = parseFloat(play.wager) || 0
                  // Convert from lamports to SOL if the number seems too large
                  const adjustedWager = wagerAmount > 1000000 ? wagerAmount / 1e9 : wagerAmount
                  return total + adjustedWager
                }, 0)
                
                console.log('Calculated SOL volume:', calculatedSolVolume)
                data.sol_volume = calculatedSolVolume
                data.plays = filteredPlays.length
                data.total_games = filteredPlays.length
              }
            }
          } catch (playsErr) {
            console.warn('Failed to fetch plays for SOL volume calculation:', playsErr)
            // Set fallback values if plays fetch fails
            data.sol_volume = data.volume || 0
            data.plays = data.total_games || 0
          }
          
          // Ensure we have some data even if plays fetch failed
          if (!data.sol_volume && data.volume) {
            data.sol_volume = data.volume
          }
          if (!data.plays && data.total_games) {
            data.plays = data.total_games
          }
          
          console.log('Final dashboard stats data:', data)
          
          // Cache the result
          cachedStats = { data, timestamp: Date.now() }
          setStats(data)
          
          const endTime = performance.now()
          console.log(`📊 Dashboard stats loaded in ${(endTime - startTime).toFixed(2)}ms`)
        } else {
          console.warn('Failed to fetch stats:', response.status)
          setError('Failed to fetch platform statistics')
        }
      } catch (err) {
        console.error('Error fetching platform stats:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // Refresh stats every 2 minutes for better user experience
    const interval = setInterval(() => {
      // Invalidate cache and fetch fresh data
      cachedStats = null
      fetchStats()
    }, 2 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return { stats, loading, error }
}