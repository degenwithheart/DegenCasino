import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { useSound } from 'gamba-react-ui-v2'

export type GamePhase = 
  | 'idle' 
  | 'thinking' 
  | 'dramatic' 
  | 'celebrating' 
  | 'mourning'
  | 'spinning'
  | 'countdown'
  | 'done'

export type GameSoundEffect = 
  | 'bigCombo' 
  | 'deduction' 
  | 'bump'
  | 'win'
  | 'fall'

export type HudMessage = 'BIG COMBO' | 'DEDUCTION'

export interface HudPayload {
  text: HudMessage
  key: number
}

interface GameStateContextType {
  gamePhase: GamePhase
  setGamePhase: (phase: GamePhase) => void
  hudMessage: HudPayload | null
  showHud: (message: HudMessage) => void
  playSoundEffect: (effect: GameSoundEffect, soundFiles?: Record<string, any>) => void
  triggerBigCombo: (soundFiles?: Record<string, any>) => void
  triggerDeduction: (soundFiles?: Record<string, any>) => void
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined)

interface GameStateProviderProps {
  children: ReactNode
}

export function GameStateProvider({ children }: GameStateProviderProps) {
  const [gamePhase, setGamePhase] = useState<GamePhase>('idle')
  const [hudMessage, setHudMessage] = useState<HudPayload | null>(null)

  const showHud = useCallback((message: HudMessage) => {
    setHudMessage({ text: message, key: Date.now() })
  }, [])

  const playSoundEffect = useCallback((effect: GameSoundEffect, soundFiles?: Record<string, any>) => {
    if (!soundFiles) return
    
    const soundMap: Record<GameSoundEffect, string> = {
      bigCombo: 'bigcombo', 
      deduction: 'ouch',
      bump: 'bump',
      win: 'win',
      fall: 'fall'
    }
    
    const soundKey = soundMap[effect]
    if (soundFiles.sounds?.[soundKey]?.ready && soundFiles.play) {
      // Add playback rate variation for bump sounds
      if (effect === 'bump') {
        soundFiles.play(soundKey, { playbackRate: 0.8 + Math.random() * 0.4 })
      } else {
        soundFiles.play(soundKey)
      }
    }
  }, [])

  const triggerBigCombo = useCallback((soundFiles?: Record<string, any>) => {
    showHud('BIG COMBO')
    playSoundEffect('bigCombo', soundFiles)
  }, [showHud, playSoundEffect])

  const triggerDeduction = useCallback((soundFiles?: Record<string, any>) => {
    showHud('DEDUCTION')
    playSoundEffect('deduction', soundFiles)
  }, [showHud, playSoundEffect])

  return (
    <GameStateContext.Provider value={{ 
      gamePhase, 
      setGamePhase,
      hudMessage,
      showHud,
      playSoundEffect,
      triggerBigCombo,
      triggerDeduction
    }}>
      {children}
    </GameStateContext.Provider>
  )
}

export function useGameState() {
  const context = useContext(GameStateContext)
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider')
  }
  return context
}
