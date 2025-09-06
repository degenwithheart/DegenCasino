//useUserStore.ts
import { StoreApi, create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { PublicKey } from '@solana/web3.js'

export interface UserStore {
  /** Show disclaimer if first time user */
  newcomer: boolean
  /** User Modal */
  userModal: boolean
  /** Initial tab for TokenSelect modal */
  userModalInitialTab?: 'free' | 'live' | 'fees' | 'invite'
  /** A list of games played. The first time a game is opened we can display info */
  gamesPlayed: Array<string>
  /** The last pool a user had selected */
  lastSelectedPool: { token: string, authority?: string } | null
  /** Data saver mode for reduced bandwidth usage */
  dataSaver?: boolean
  /** Particles and visual effects enabled */
  particlesEnabled?: boolean
  /** Prefetch level for loading optimization */
  prefetchLevel?: 'off' | 'conservative' | 'aggressive'
  /** Reduce motion for accessibility */
  reduceMotion?: boolean
  /** Less glow effects */
  lessGlow?: boolean
  /** Ticker refresh interval in milliseconds */
  tickerInterval?: number
  /** Image quality setting */
  imageQuality?: 'data' | 'balanced' | 'high'
  /** Defer audio engine initialization */
  deferAudio?: boolean
  /** Progressive image loading */
  progressiveImages?: boolean
  /** Background throttling */
  backgroundThrottle?: boolean
  /** Cache warmup enabled */
  cacheWarmup?: boolean
  /** Slim font loading */
  fontSlim?: boolean
  /** Auto adaptation under load */
  autoAdapt?: boolean
  /** Adaptive RAF enabled */
  adaptiveRaf?: boolean
  markGameAsPlayed: (gameId: string, played: boolean) => void
  set: (partial: Partial<UserStore> | ((state: UserStore) => Partial<UserStore>), replace?: boolean) => void
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
      markGameAsPlayed: (gameId, played) => {
        const gamesPlayed = new Set(get().gamesPlayed)
        if (played) {
          gamesPlayed.add(gameId)
        } else {
          gamesPlayed.delete(gameId)
        }
        set({ gamesPlayed: Array.from(gamesPlayed) })
      },
      set,
    }),
    {
      name: 'user',
      storage: createJSONStorage(() => window.localStorage),
    },
  ),
)
