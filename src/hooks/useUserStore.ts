//useUserStore.ts
import { StoreApi, create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { PublicKey } from '@solana/web3.js'

export interface UserStore {
  /** Show disclaimer if first time user */
  newcomer: boolean
  /** User Modal */
  userModal: boolean
  /** User preference to reduce bandwidth / disable prefetch */
  dataSaver?: boolean
  /** Enable particle / flashy visual effects */
  particlesEnabled?: boolean
  /** Prefetch aggressiveness */
  prefetchLevel?: 'off' | 'conservative' | 'aggressive'
  /** Reduce most CSS/keyframe animations */
  reduceMotion?: boolean
  /** Remove heavy glows & large shadows */
  lessGlow?: boolean
  /** Polling interval for ticker (ms) */
  tickerInterval?: number
  /** Image quality mode */
  imageQuality?: 'high' | 'balanced' | 'data'
  /** Defer initializing audio engine */
  deferAudio?: boolean
  /** Lazy load game engines/physics until opened */
  lazyGameEngines?: boolean
  /** Use progressive image loading placeholders */
  progressiveImages?: boolean
  /** Throttle background loops when tab hidden */
  backgroundThrottle?: boolean
  /** Enable service worker warm cache of assets */
  cacheWarmup?: boolean
  /** Limit font variants / weights */
  fontSlim?: boolean
  /** Automatically adapt based on device/network */
  autoAdapt?: boolean
  /** Enable adaptive FPS scheduling */
  adaptiveRaf?: boolean
  /** Initial tab for TokenSelect modal */
  userModalInitialTab?: 'free' | 'live' | 'fees' | 'invite'
  /** A list of games played. The first time a game is opened we can display info */
  gamesPlayed: Array<string>
  /** The last pool a user had selected */
  lastSelectedPool: { token: string, authority?: string } | null
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
  lazyGameEngines: true,
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
