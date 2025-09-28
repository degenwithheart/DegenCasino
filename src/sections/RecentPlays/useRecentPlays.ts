// apps/platform/src/sections/RecentPlays/useRecentPlays.ts

import { GambaTransaction } from 'gamba-core-v2'
import {
  useWalletAddress,
  useGambaEvents,
  useGambaEventListener,
} from 'gamba-react-v2'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { extractMetadata } from '../../utils'
import { PLATFORM_CREATOR_ADDRESS } from '../../constants'

interface Params {
  showAllPlatforms?: boolean
  gameId?: string // NEW: Filter by specific game
  limit?: number  // NEW: Limit number of results
}

export function useRecentPlays(params: Params = {}) {
  const { showAllPlatforms = false, gameId, limit = 30 } = params
  const location    = useLocation()
  const userAddress = useWalletAddress()

  // 1) Historical events via lightweight fetchRecentLogs under the hood
  const previousEvents = useGambaEvents<'GameSettled'>(
    'GameSettled',
    {
      address: !showAllPlatforms
        ? PLATFORM_CREATOR_ADDRESS
        : undefined,
      signatureLimit: 10, // Reduced from 30 to fix RPC batch size error
    },
  )

  // 2) State for live events
  const [liveEvents, setLiveEvents] = React.useState<
  GambaTransaction<'GameSettled'>[]
  >([])

  // 3) Refs for up-to-date filter values
  const showAllRef = React.useRef(showAllPlatforms)
  const userRef    = React.useRef(userAddress)
  const pathRef    = React.useRef(location.pathname)
  const gameIdRef  = React.useRef(gameId)
  React.useEffect(() => {
    showAllRef.current = showAllPlatforms 
  }, [showAllPlatforms])
  React.useEffect(() => {
    userRef.current    = userAddress    
  }, [userAddress])
  React.useEffect(() => {
    pathRef.current    = location.pathname 
  }, [location.pathname])
  React.useEffect(() => {
    gameIdRef.current = gameId
  }, [gameId])

  // 4) Live subscription via the single‐argument callback signature
  useGambaEventListener<'GameSettled'>(
    'GameSettled',
    (evt) => {
      const { data, signature } = evt

      // Platform filter
      if (
        !showAllRef.current &&
        !data.creator.equals(PLATFORM_CREATOR_ADDRESS)
      ) {
        return
      }

      // Game filter - extract game ID from metadata
      if (gameIdRef.current) {
        try {
          // Use the same extractMetadata function that the explorer uses
          const { gameId: extractedGameId } = extractMetadata(evt)
          
          if (extractedGameId !== gameIdRef.current) {
            return // Skip if not matching game
          }
        } catch (error) {
          return // Skip if metadata parsing fails
        }
      }

      // Optional suspense delay for user’s own plays
      const isUserGame = data.user.equals(userRef.current)
      const inSuspense = ['plinko', 'slots'].some((p) =>
        pathRef.current.includes(p),
      )
      const delay = isUserGame && inSuspense ? 3000 : 1

      setTimeout(() => {
        setLiveEvents((all) => [evt, ...all])
      }, delay)
    },
    // re-subscribe whenever these change
    [showAllPlatforms, userAddress, location.pathname, gameId],
  )

  // 5) Merge, filter by game, and return
  return React.useMemo(() => {
    let events = [...liveEvents, ...previousEvents]
    
    // Apply game filtering to historical events as well
    if (gameId) {
      const filteredEvents = events.filter(event => {
        try {
          const { gameId: extractedGameId } = extractMetadata(event)
          return extractedGameId === gameId
        } catch (err) {
          return false
        }
      })
      events = filteredEvents
    }
    
    return events.slice(0, limit)
  }, [liveEvents, previousEvents, gameId, limit])
}
