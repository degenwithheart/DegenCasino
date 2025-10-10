// Game loader stub for degen-mobile theme
// The mobile theme uses the global `ALL_GAMES` bundles directly (same as degenheart).
// Keep a small, documented stub here to avoid runtime import errors if any file
// still imports these helpers. Do not perform any device-specific imports here.

import type { ExtendedGameBundle } from '../../../../games/allGames';

export const createDeviceAwareGames = (games: ExtendedGameBundle[]): ExtendedGameBundle[] => games;

export const loadGameComponent = (game: ExtendedGameBundle) => game?.app;