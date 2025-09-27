import React, { useState, useCallback } from 'react'
import { GambaUi } from 'gamba-react-ui-v2'
import { useGameSEO } from '../../hooks/ui/useGameSEO'
import { PublicKey } from '@solana/web3.js'
import { STRATEGY_PRESETS } from './types'

// Import components directly
import GameLobby from './components/GameLobby'
import MultiplayerGameScreen from './components/MultiplayerGameScreen'
import SingleplayerGameScreen from './components/SingleplayerGameScreen'

export default function PokerShowdownWrapper() {
  // SEO for PokerShowdown game
  const seoHelmet = useGameSEO({
    gameName: "Poker Showdown",
    description: "Strategy meets destiny in this multiplayer arena where minds clash before cards are ever dealt. Choose your approach—conservative safety, balanced wisdom, or aggressive ambition—then watch as fate unfolds your predetermined path. This is not mere chance, but calculated risk made manifest, where every decision echoes through the digital felt. Five cards become your weapon, strategy your shield, and the pot your prize. Here, victory belongs not to the lucky, but to those who understand that in poker, as in life, the choices made before the battle often determine its outcome.",
    rtp: 94,
    maxWin: "600x"
  })

  // Game state management
  const [gameMode, setGameMode] = useState<'lobby' | 'singleplayer' | 'multiplayer'>('lobby')
  const [selectedGame, setSelectedGame] = useState<PublicKey | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleBack = useCallback(() => {
    setGameMode('lobby')
    setSelectedGame(null)
    setShowCreateModal(false)
  }, [])

  const handleJoinSingleplayer = useCallback(() => {
    setGameMode('singleplayer')
  }, [])

  const handleJoinMultiplayer = useCallback((gameId: string) => {
    setSelectedGame(new PublicKey(gameId))
    setGameMode('multiplayer')
  }, [])

  const handleCreateMultiplayer = useCallback(() => {
    setShowCreateModal(true)
  }, [])

  const handleGameCreated = useCallback((gamePubkey: PublicKey) => {
    setSelectedGame(gamePubkey)
    setGameMode('multiplayer')
    setShowCreateModal(false)
  }, [])

  console.log('🃏 POKER SHOWDOWN COMPONENT LOADING...')

  return (
    <>
      {seoHelmet}
      {gameMode === 'lobby' && (
        <GameLobby
          onJoinSingleplayer={handleJoinSingleplayer}
          onJoinMultiplayer={handleJoinMultiplayer}
          onCreateMultiplayer={handleCreateMultiplayer}
        />
      )}
      {gameMode === 'singleplayer' && (
        <SingleplayerGameScreen
          onBack={handleBack}
        />
      )}
      {gameMode === 'multiplayer' && selectedGame && (
        <MultiplayerGameScreen
          gamePubkey={selectedGame}
          selectedStrategy={STRATEGY_PRESETS.BALANCED} // Default strategy for multiplayer
          onBack={() => {
            setGameMode('lobby')
            setSelectedGame(null)
          }}
        />
      )}
    </>
  )
}