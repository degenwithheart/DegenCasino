//useUserStore.ts
import { StoreApi, create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { PublicKey } from '@solana/web3.js';
import { DEFAULT_GAME_MODE } from '../../constants';
import { ALL_GAMES } from '../../games/allGames';

export interface UserStore {
  /** Show disclaimer if first time user */
  newcomer: boolean;
  /** User Modal */
  userModal: boolean;
  /** Initial tab for TokenSelect modal */
  userModalInitialTab?: 'free' | 'live' | 'fees' | 'invite';
  /** A list of games played. The first time a game is opened we can display info */
  gamesPlayed: Array<string>;
  /** The last pool a user had selected */
  lastSelectedPool: { token: string, authority?: string; } | null;
  /** Data saver mode for reduced bandwidth usage */
  dataSaver?: boolean;
  /** Particles and visual effects enabled */
  particlesEnabled?: boolean;
  /** Prefetch level for loading optimization */
  prefetchLevel?: 'off' | 'conservative' | 'aggressive';
  /** Reduce motion for accessibility */
  reduceMotion?: boolean;
  /** Less glow effects */
  lessGlow?: boolean;
  /** Ticker refresh interval in milliseconds */
  tickerInterval?: number;
  /** Image quality setting */
  imageQuality?: 'data' | 'balanced' | 'high';
  /** Defer audio engine initialization */
  deferAudio?: boolean;
  /** Progressive image loading */
  progressiveImages?: boolean;
  /** Background throttling */
  backgroundThrottle?: boolean;
  /** Cache warmup enabled */
  cacheWarmup?: boolean;
  /** Slim font loading */
  fontSlim?: boolean;
  /** Auto adaptation under load */
  autoAdapt?: boolean;
  /** Adaptive RAF enabled */
  adaptiveRaf?: boolean;

  /** Global game render mode preference */
  gameRenderMode?: '2D' | '3D';

  /** Per-game render mode preferences */
  perGameModePreferences?: Record<string, '2D' | '3D'>;

  /** Set global render mode */
  setGlobalRenderMode: (mode: '2D' | '3D') => void;

  /** Set render mode for specific game */
  setGameRenderMode: (gameId: string, mode: '2D' | '3D') => void;

  /** Get effective render mode for a game (per-game override or global) */
  getGameRenderMode: (gameId: string) => '2D' | '3D';

  markGameAsPlayed: (gameId: string, played: boolean) => void;
  set: (partial: Partial<UserStore> | ((state: UserStore) => Partial<UserStore>), replace?: boolean) => void;
}

/**
 * Store client settings here
 */
export const useUserStore = create(
  persist<UserStore>(
    (set, get) => ({
      newcomer: true,
      userModal: false,
      userModalInitialTab: undefined,
      lastSelectedPool: null,
      gamesPlayed: [],
      dataSaver: false,
      particlesEnabled: true,
      prefetchLevel: 'conservative',
      reduceMotion: false,
      lessGlow: false,
      tickerInterval: 15000,
      imageQuality: 'balanced',
      deferAudio: true,
      progressiveImages: true,
      backgroundThrottle: true,
      cacheWarmup: true,
      fontSlim: true,
      autoAdapt: true,
      adaptiveRaf: true,

      gameRenderMode: DEFAULT_GAME_MODE,
      perGameModePreferences: {},

      setGlobalRenderMode: (mode) => {
        set({ gameRenderMode: mode });
      },

      setGameRenderMode: (gameId, mode) => {
        const currentPreferences = get().perGameModePreferences || {};
        set({
          perGameModePreferences: {
            ...currentPreferences,
            [gameId]: mode
          }
        });
      },

      getGameRenderMode: (gameId) => {
        const state = get();
        const game = ALL_GAMES.find(g => g.id === gameId);
        const gameCapabilities = game?.capabilities;

        if (!gameCapabilities) {
          return state.gameRenderMode || DEFAULT_GAME_MODE;
        }

        // Check per-game preference first
        const perGameMode = state.perGameModePreferences?.[gameId];
        if (perGameMode &&
          ((perGameMode === '2D' && gameCapabilities.supports2D) ||
            (perGameMode === '3D' && gameCapabilities.supports3D))) {
          return perGameMode;
        }

        // Fall back to global preference if supported
        const globalMode = state.gameRenderMode || DEFAULT_GAME_MODE;
        if ((globalMode === '2D' && gameCapabilities.supports2D) ||
          (globalMode === '3D' && gameCapabilities.supports3D)) {
          return globalMode;
        }

        // Fall back to game's default
        return gameCapabilities.default;
      },

      markGameAsPlayed: (gameId, played) => {
        const gamesPlayed = new Set(get().gamesPlayed);
        if (played) {
          gamesPlayed.add(gameId);
        } else {
          gamesPlayed.delete(gameId);
        }
        set({ gamesPlayed: Array.from(gamesPlayed) });
      },
      set,
    }),
    {
      name: 'user',
      storage: createJSONStorage(() => window.localStorage),
    },
  ),
);
