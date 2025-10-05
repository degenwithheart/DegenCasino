// apps/platform/src/sections/RecentPlays/useRecentPlays.ts

import { GambaTransaction } from 'gamba-core-v2';
import {
  useWalletAddress,
  useGambaEvents,
  useGambaEventListener,
} from 'gamba-react-v2';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { extractMetadata } from '../../utils';
import { PLATFORM_CREATOR_ADDRESS } from '../../constants';

interface Params {
  showAllPlatforms?: boolean;
  gameId?: string; // NEW: Filter by specific game
  limit?: number;  // NEW: Limit number of results
}

export function useRecentPlays(params: Params = {}) {
  const { showAllPlatforms = false, gameId, limit = 30 } = params;
  const location = useLocation();
  const userAddress = useWalletAddress();

  // 1) Historical events via lightweight fetchRecentLogs under the hood
  const previousEvents = useGambaEvents<'GameSettled'>(
    'GameSettled',
    {
      address: !showAllPlatforms
        ? PLATFORM_CREATOR_ADDRESS
        : undefined,
      signatureLimit: 10, // Reduced from 30 to fix RPC batch size error
    },
  );

  // 2) State for live events
  const [liveEvents, setLiveEvents] = React.useState<
    GambaTransaction<'GameSettled'>[]
  >([]);

  // 3) Refs for up-to-date filter values
  const showAllRef = React.useRef(showAllPlatforms);
  const userRef = React.useRef(userAddress);
  const pathRef = React.useRef(location.pathname);
  const gameIdRef = React.useRef(gameId);
  React.useEffect(() => {
    showAllRef.current = showAllPlatforms;
  }, [showAllPlatforms]);
  React.useEffect(() => {
    userRef.current = userAddress;
  }, [userAddress]);
  React.useEffect(() => {
    pathRef.current = location.pathname;
  }, [location.pathname]);
  React.useEffect(() => {
    gameIdRef.current = gameId;
  }, [gameId]);

  // 4) Live subscription via the single‐argument callback signature
  useGambaEventListener<'GameSettled'>(
    'GameSettled',
    (evt) => {
      const { data, signature } = evt;

      console.debug('🎮 Processing game event:', {
        signature,
        metadata: data.metadata,
        creator: data.creator.toBase58(),
        platformCreator: PLATFORM_CREATOR_ADDRESS.toBase58(),
        currentGameId: gameIdRef.current
      });

      // Platform filter
      if (
        !showAllRef.current &&
        !data.creator.equals(PLATFORM_CREATOR_ADDRESS)
      ) {
        console.debug('⏭️ Skipping non-platform game:', {
          eventCreator: data.creator.toBase58(),
          platformCreator: PLATFORM_CREATOR_ADDRESS.toBase58()
        });
        return;
      }

      // Game filter - extract game ID from metadata
      if (gameIdRef.current) {
        try {
          // Use the same extractMetadata function that the explorer uses
          const { gameId: extractedGameId } = extractMetadata(evt);

          console.debug('🎲 Game ID check:', {
            extractedGameId,
            expectedGameId: gameIdRef.current,
            matches: extractedGameId === gameIdRef.current,
            rawMetadata: data.metadata
          });

          if (extractedGameId !== gameIdRef.current) {
            return; // Skip if not matching game
          }
        } catch (error) {
          console.warn('❌ Failed to extract game ID:', error, { metadata: data.metadata });
          return; // Skip if metadata parsing fails
        }
      }

      // Optional suspense delay for user’s own plays
      const isUserGame = data.user.equals(userRef.current);
      const inSuspense = ['plinko', 'slots'].some((p) =>
        pathRef.current.includes(p),
      );
      const delay = isUserGame && inSuspense ? 3000 : 1;

      setTimeout(() => {
        console.debug('✨ Adding new game event:', {
          signature: evt.signature,
          gameId: gameIdRef.current,
          metadata: evt.data.metadata,
          delay
        });
        setLiveEvents((all: GambaTransaction<'GameSettled'>[]) => [evt, ...all]);
      }, delay);
    },
    // re-subscribe whenever these change
    [showAllPlatforms, userAddress, location.pathname, gameId],
  );

  // 5) Merge, filter by game, and return
  return React.useMemo(() => {
    let events = [...liveEvents, ...previousEvents];

    console.debug('🎮 useRecentPlays filtering:', {
      gameId,
      totalEvents: events.length,
      firstEvent: events[0] ? {
        signature: events[0].signature,
        metadata: events[0].data.metadata
      } : null
    });

    // Apply game filtering to historical events as well
    if (gameId) {
      const filteredEvents = events.filter(event => {
        try {
          const metadata = event.data.metadata;

          // Fast path for exact match
          if (typeof metadata === 'string' && metadata.includes(gameId)) {
            console.debug('✅ Direct gameId match:', { gameId, metadata });
            return true;
          }

          const { gameId: extractedGameId } = extractMetadata(event);
          const matches = extractedGameId === gameId;

          console.debug('🎲 Game filtering:', {
            event: event.signature,
            metadata,
            extractedGameId,
            targetGameId: gameId,
            matches
          });

          return matches;
        } catch (err) {
          console.warn('❌ Failed to filter game:', err, {
            signature: event.signature,
            metadata: event.data.metadata
          });
          return false;
        }
      });

      events = filteredEvents;
      console.debug('🎮 Filtered results:', {
        gameId,
        originalCount: events.length,
        filteredCount: filteredEvents.length,
        sampleEvents: filteredEvents.slice(0, 3).map(e => ({
          signature: e.signature,
          metadata: e.data.metadata
        }))
      });
    }

    return events.slice(0, limit);
  }, [liveEvents, previousEvents, gameId, limit]);
}
