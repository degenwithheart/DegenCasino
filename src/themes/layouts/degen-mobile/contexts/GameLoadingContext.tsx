import React, { createContext, useContext, useMemo } from 'react'
import { getDeviceType, shouldUseMobileGames, shouldUseDesktopGames } from '../utils/deviceDetection'
import { createDeviceAwareGames } from '../utils/gameLoader'
import { ALL_GAMES } from '../../../../games/allGames'
import type { ExtendedGameBundle } from '../../../../games/allGames'

interface GameLoadingContextType {
  deviceType: 'mobile' | 'tablet' | 'desktop'
  shouldUseMobileGames: boolean
  shouldUseDesktopGames: boolean
  getDeviceAwareGames: () => ExtendedGameBundle[]
  getDesktopGames: () => ExtendedGameBundle[]
}

const GameLoadingContext = createContext<GameLoadingContextType | null>(null)

export const useGameLoading = (): GameLoadingContextType => {
  const context = useContext(GameLoadingContext)
  if (!context) {
    throw new Error('useGameLoading must be used within GameLoadingProvider')
  }
  return context
}

interface GameLoadingProviderProps {
  children: React.ReactNode
}

export const GameLoadingProvider: React.FC<GameLoadingProviderProps> = ({ children }) => {
  const contextValue = useMemo((): GameLoadingContextType => {
    const deviceType = getDeviceType()
    
    return {
      deviceType,
      shouldUseMobileGames: shouldUseMobileGames(),
      shouldUseDesktopGames: shouldUseDesktopGames(),
      getDeviceAwareGames: () => createDeviceAwareGames(ALL_GAMES),
      getDesktopGames: () => ALL_GAMES
    }
  }, [])

  return (
    <GameLoadingContext.Provider value={contextValue}>
      {children}
    </GameLoadingContext.Provider>
  )
}