import { GambaTransaction } from 'gamba-core-v2'
import { useGambaEventListener, useGambaEvents, useWalletAddress } from 'gamba-react-v2'
import React, { useRef } from 'react'
// Throttle hook
function useThrottle(callback: (...args: any[]) => void, delay: number) {
  const lastCall = useRef(0);
  return (...args: any[]) => {
    const now = Date.now();
    if (now - lastCall.current > delay) {
      lastCall.current = now;
      callback(...args);
    }
  };
}
import { useLocation } from 'react-router-dom'
import { PLATFORM_CREATOR_ADDRESS } from '../../constants'

interface Params {
  showAllPlatforms?: boolean
}

export function useRecentPlays(params: Params = {}) {
  const { showAllPlatforms = false } = params
  const location = useLocation()
  const userAddress = useWalletAddress()

  // Fetch previous events
  const previousEvents = useGambaEvents(
    'GameSettled',
    { address: !showAllPlatforms ? PLATFORM_CREATOR_ADDRESS : undefined },
  )

  const [newEvents, setEvents] = React.useState<GambaTransaction<'GameSettled'>[]>([])

  // Throttle event listener to avoid excessive updates
  const throttledSetEvents = useThrottle(
    (event: GambaTransaction<'GameSettled'>) => {
      setEvents((events) => [event, ...events]);
    },
    10000 // 10 seconds
  );

  // Listen for new events
  useGambaEventListener(
    'GameSettled',
    (event) => {
      if (!showAllPlatforms && !event.data.creator.equals(PLATFORM_CREATOR_ADDRESS)) return;
      const delay = event.data.user.equals(userAddress) && ['plinko', 'slots'].some((x) => location.pathname.includes(x)) ? 3000 : 1;
      setTimeout(() => {
        throttledSetEvents(event);
      }, delay);
    },
    [location.pathname, userAddress, showAllPlatforms],
  );

  // Merge previous & new events
  return React.useMemo(
    () => {
      return [...newEvents, ...previousEvents]
    },
    [newEvents, previousEvents],
  )
}
