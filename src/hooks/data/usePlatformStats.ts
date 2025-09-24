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

export function usePlatformStats() {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)

        // Try the main stats endpoint
        const statsUrl = `${API_ENDPOINT}/stats/${PLATFORM_CREATOR}`
        const response = await fetch(statsUrl)

        if (response.ok) {
          const data = await response.json()
          console.log('Platform stats API response:', data)
          
          // Also fetch recent plays to calculate actual SOL volume
          try {
            const playsUrl = `${API_ENDPOINT}/events/settledGames?creator=${PLATFORM_CREATOR}&itemsPerPage=100&page=0`
              const playsResponse = await fetch(playsUrl)
            
            if (playsResponse.ok) {
              const playsData = await playsResponse.json()
              console.log('Plays API response:', playsData)
              let calculatedSolVolume = 0
              
              if (playsData && Array.isArray(playsData.results)) {
                const filteredPlays = playsData.results.filter((play: any) => play.creator === PLATFORM_CREATOR)
                console.log('Filtered plays for creator:', filteredPlays.length, 'plays')
                console.log('First few plays:', filteredPlays.slice(0, 3))
                
                calculatedSolVolume = filteredPlays.reduce((total: number, play: any) => {
                  const wagerAmount = parseFloat(play.wager) || 0
                  console.log('Processing wager:', play.wager, '-> parsed:', wagerAmount)
                  return total + wagerAmount
                }, 0)
                
                console.log('Calculated SOL volume:', calculatedSolVolume)
              } else {
                console.log('No plays results array found:', playsData)
              }
              
              // Add calculated SOL volume to stats
              data.sol_volume = calculatedSolVolume
            } else {
              console.log('Plays API failed:', playsResponse.status, await playsResponse.text())
            }
          } catch (playsErr) {
            console.warn('Failed to fetch plays for SOL volume calculation:', playsErr)
          }
          
          setStats(data)
        } else {
          // Fallback to alternative endpoint if needed
          const altStatsUrl = `${API_ENDPOINT}/stats?creator=${PLATFORM_CREATOR}&startTime=0`
          console.log('Trying fallback stats URL:', altStatsUrl)
          const altResponse = await fetch(altStatsUrl)
          if (altResponse.ok) {
            const altData = await altResponse.json()
            console.log('Fallback stats data:', altData)
            
            // Also try to get plays data for fallback
            try {
              const playsUrl = `${API_ENDPOINT}/events/settledGames?creator=${PLATFORM_CREATOR}&itemsPerPage=100&page=0`
              const playsResponse = await fetch(playsUrl)
              
              if (playsResponse.ok) {
                const playsData = await playsResponse.json()
                if (playsData && Array.isArray(playsData.results)) {
                  const calculatedSolVolume = playsData.results
                    .filter((play: any) => play.creator === PLATFORM_CREATOR)
                    .reduce((total: number, play: any) => {
                      const wagerAmount = play.wager || 0
                      const adjustedWager = wagerAmount > 1000000 ? wagerAmount / 1e9 : wagerAmount
                      return total + adjustedWager
                    }, 0)
                  altData.sol_volume = calculatedSolVolume
                }
              }
            } catch (err) {
              console.warn('Failed to fetch plays for fallback:', err)
            }
            
            setStats(altData)
          } else {
            throw new Error('Failed to fetch platform stats')
          }
        }
      } catch (err) {
        console.error('Error fetching platform stats:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return { stats, loading, error }
}