import { GambaTransaction } from 'gamba-core-v2';
import { ALL_GAMES } from './games/allGames';

export const truncateString = (s: string, startLen = 4, endLen = startLen) => s.slice(0, startLen) + '...' + s.slice(-endLen);

export const extractMetadata = (event: GambaTransaction<'GameSettled'>) => {
  try {
    const metadata = event.data.metadata as any;
    let gameId = '';

    if (!metadata) {
      console.debug('No metadata found in event', { event });
      return { gameId: '', game: undefined };
    }

    // Debug the metadata format
    console.debug('Processing metadata:', {
      metadata,
      type: typeof metadata,
      isArray: Array.isArray(metadata),
      raw: event.data.metadata
    });

    // Handle string format
    if (typeof metadata === 'string') {
      const match = ALL_GAMES.find(game => metadata.includes(game.id));
      if (match) {
        gameId = match.id;
        console.debug('Found game ID in string:', gameId);
      }
    }
    // Handle array format
    else if (Array.isArray(metadata)) {
      // First check if the first element is a valid game ID
      if (metadata.length > 0 && typeof metadata[0] === 'string') {
        const match = ALL_GAMES.find(game => game.id === metadata[0]);
        if (match) {
          gameId = match.id;
          console.debug('Found game ID in array position 0:', gameId);
        }
      }
      // If not found, check if it's the old Mines format (array of numbers)
      else if (metadata.every((item: any) => typeof item === 'number')) {
        gameId = 'mines';
        console.debug('Detected legacy Mines format');
      }
    }

    const game = ALL_GAMES.find(g => g.id === gameId);

    if (!game) {
      console.warn('No matching game found for ID:', gameId, {
        metadata,
        searchedId: gameId,
        availableGames: ALL_GAMES.map(g => g.id)
      });
    }

    // Always return an object with gameId and game
    return { gameId, game };
  } catch (error) {
    console.error('extractMetadata error:', error, {
      metadata: event.data.metadata,
      event
    });
    return { gameId: '', game: undefined };
  }
};
