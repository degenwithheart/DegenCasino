// apps/platform/src/sections/RecentPlays/useRecentPlays.ts

import { GambaTransaction } from 'gamba-core-v2'
import {
  useWalletAddress,
  useGambaEvents,
  useGambaEventListener,
} from 'gamba-react-v2'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { PLATFORM_CREATOR_ADDRESS } from '../../constants'
import { cache, CacheKeys, CacheTTL } from '../../utils/cache'
import { prefetchManager } from '../../utils/prefetch'

interface Params {
  showAllPlatforms?: boolean
}

export function useRecentPlays(params: Params = {}) {
  const { showAllPlatforms = false } = params
  const location    = useLocation()
  const userAddress = useWalletAddress()

  // 1) Check cache first for historical events - prioritize cached data for instant display
  const cacheKey = CacheKeys.recentPlays(showAllPlatforms, !showAllPlatforms ? PLATFORM_CREATOR_ADDRESS.toString() : undefined);
  const [cachedPreviousEvents, setCachedPreviousEvents] = React.useState<GambaTransaction<'GameSettled'>[]>(() => {
    const cached = cache.get<GambaTransaction<'GameSettled'>[]>(cacheKey, CacheTTL.RECENT_PLAYS);
    if (cached) {
      console.log('🎮 Recent plays cache hit - showing cached data');
    }
    return cached || [];
  });

  // 2) Historical events via lightweight fetchRecentLogs under the hood
  const previousEvents = useGambaEvents<'GameSettled'>(
    'GameSettled',
    {
      address: !showAllPlatforms
        ? PLATFORM_CREATOR_ADDRESS
        : undefined,
      signatureLimit: 30,
    },
  )

  // 3) Update cache when new historical events are loaded
  React.useEffect(() => {
    if (previousEvents.length > 0) {
      console.log('🎮 Recent plays fetched - updating cache');
      cache.set(cacheKey, previousEvents, CacheTTL.RECENT_PLAYS);
      setCachedPreviousEvents(previousEvents);
    }
  }, [previousEvents, cacheKey]);

  // 4) Use cached data if available, otherwise use fresh data
  const eventsToUse = cachedPreviousEvents.length > 0 ? cachedPreviousEvents : previousEvents;

  // 5) State for live events
  const [liveEvents, setLiveEvents] = React.useState<
  GambaTransaction<'GameSettled'>[]
  >([])

  // 6) Refs for up-to-date filter values
  const showAllRef = React.useRef(showAllPlatforms)
  const userRef    = React.useRef(userAddress)
  const pathRef    = React.useRef(location.pathname)
  React.useEffect(() => {
    showAllRef.current = showAllPlatforms 
  }, [showAllPlatforms])
  React.useEffect(() => {
    userRef.current    = userAddress    
  }, [userAddress])
  React.useEffect(() => {
    pathRef.current    = location.pathname 
  }, [location.pathname])

  // 7) Live subscription via the single‐argument callback signature
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

      // Optional suspense delay for user's own plays
      const isUserGame = data.user.equals(userRef.current)
      const inSuspense = ['plinko', 'slots'].some((p) =>
        pathRef.current.includes(p),
      )
      const delay = isUserGame && inSuspense ? 3000 : 1

      // Invalidate related caches when new play comes in
      setTimeout(() => {
        setLiveEvents((all) => [evt, ...all])
        
        // Invalidate relevant caches since new data is available
        cache.invalidateByPattern(`recentPlays:.*`);
        cache.invalidateByPattern(`leaderboard:.*:${data.creator.toString()}`);
        
        // Update the cached previous events to include this new event
        const currentCached = cache.get<GambaTransaction<'GameSettled'>[]>(cacheKey) || [];
        const updatedEvents = [evt, ...currentCached].slice(0, 30); // Keep only latest 30
        cache.set(cacheKey, updatedEvents, CacheTTL.RECENT_PLAYS);
        setCachedPreviousEvents(updatedEvents);
      }, delay)
    },
    // re-subscribe whenever these change
    [showAllPlatforms, userAddress, location.pathname],
  )

  // 8) Manual refresh function
  const refresh = React.useCallback(() => {
    console.log('🔄 Manual refresh triggered for recent plays');
    cache.invalidateByPattern(`recentPlays:.*`);
    setCachedPreviousEvents([]);
    setLiveEvents([]);
  }, []);

  // 9) Merge & return
  const events = React.useMemo(
    () => [...liveEvents, ...eventsToUse],
    [liveEvents, eventsToUse],
  );

  return { events, refresh };
}
