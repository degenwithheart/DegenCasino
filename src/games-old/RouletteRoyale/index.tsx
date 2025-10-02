import React, { Suspense, useCallback, useState } from 'react'
import { useGameSEO } from '../../hooks/ui/useGameSEO'
import { PublicKey } from '@solana/web3.js'
import type { SingleplayerGameConfig } from './components/CreateSingleplayerGameModal'

// Lazy load game components
const GameLobby = React.lazy(() => import('./components/GameLobby'))
const RouletteRoyaleGame = React.lazy(() => import('./components/GameScreen'))
const SingleplayerGameScreen = React.lazy(() => import('./components/SingleplayerGameScreen'))
const CreateSingleplayerGameModal = React.lazy(() => import('./components/CreateSingleplayerGameModal'))
import CreateMultiplayerGameModal from './components/CreateMultiplayerGameModal'

const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '400px',
    color: 'white',
    fontSize: '18px'
  }}>
    Loading Roulette Royale...
  </div>
)

export default function RouletteRoyaleWrapper() {
  // SEO for RouletteRoyale game
  const seoHelmet = useGameSEO({
    gameName: "Roulette Royale",
    description: "Multiplayer roulette with real-time betting! Compete with other players on the same wheel for the ultimate prize",
    rtp: 97,
    maxWin: "35x"
  })

  // Game state management
  const [gameMode, setGameMode] = useState<'lobby' | 'singleplayer' | 'multiplayer'>('lobby')
  const [selectedGame, setSelectedGame] = useState<PublicKey | null>(null)
  // State for handling singleplayer game configuration
  const [singleplayerWager, setSingleplayerWager] = useState<number>(1000000)
  const [showCreateSingleplayerModal, setShowCreateSingleplayerModal] = useState(false)
  const [showCreateMultiplayerModal, setShowCreateMultiplayerModal] = useState(false)
  
  const handleBack = useCallback(() => {
    setGameMode('lobby')
    setSelectedGame(null)
    setSingleplayerWager(0)
    // Close any open modals when returning to lobby
    setShowCreateSingleplayerModal(false)
    setShowCreateMultiplayerModal(false)
  }, [])
  
  const handleJoinSingleplayer = useCallback((wager: number) => {
    setSingleplayerWager(wager)
    setGameMode('singleplayer')
    // Close any open modals when joining a game
    setShowCreateSingleplayerModal(false)
    setShowCreateMultiplayerModal(false)
  }, [])
  
  const handleJoinMultiplayer = useCallback((gameId: string) => {
    setSelectedGame(new PublicKey(gameId))
    setGameMode('multiplayer')
    // Close any open modals when joining a game
    setShowCreateSingleplayerModal(false)
    setShowCreateMultiplayerModal(false)
  }, [])
  
  const handleCreateSingleplayer = useCallback(() => {
    setShowCreateSingleplayerModal(true)
  }, [])
  
  const handleCreateMultiplayer = useCallback(() => {
    setShowCreateMultiplayerModal(true)
  }, [])
  
  const handleSingleplayerConfig = useCallback((config: SingleplayerGameConfig) => {
    setSingleplayerWager(config.fixedWager)
    setGameMode('singleplayer')
    setShowCreateSingleplayerModal(false)
  }, [])
  
  const handleMultiplayerGameSelect = useCallback((gamePubkey: PublicKey) => {
    setSelectedGame(gamePubkey)
    setGameMode('multiplayer')
    setShowCreateMultiplayerModal(false)
  }, [])

  console.log('🎰 ROULETTE ROYALE COMPONENT LOADING...')

  return (
    <>
      {seoHelmet}
      <Suspense fallback={<LoadingFallback />}>
        {gameMode === 'lobby' ? (
          <GameLobby
            onJoinSingleplayer={handleJoinSingleplayer}
            onJoinMultiplayer={handleJoinMultiplayer}
            onCreateSingleplayer={handleCreateSingleplayer}
            onCreateMultiplayer={handleCreateMultiplayer}
          />
        ) : gameMode === 'singleplayer' ? (
          <SingleplayerGameScreen 
            onBack={handleBack}
            initialWager={singleplayerWager}
          />
        ) : gameMode === 'multiplayer' && selectedGame ? (
          <RouletteRoyaleGame 
            gamePubkey={selectedGame} 
            onBack={handleBack}
          />
        ) : (
          <GameLobby
            onJoinSingleplayer={handleJoinSingleplayer}
            onJoinMultiplayer={handleJoinMultiplayer}
            onCreateSingleplayer={handleCreateSingleplayer}
            onCreateMultiplayer={handleCreateMultiplayer}
          />
        )}
        
        {/* Modals */}
        {showCreateSingleplayerModal && (
          <CreateSingleplayerGameModal
            onClose={() => setShowCreateSingleplayerModal(false)}
            onConfigureGame={handleSingleplayerConfig}
          />
        )}
        
        {showCreateMultiplayerModal && (
          <CreateMultiplayerGameModal
            onClose={() => setShowCreateMultiplayerModal(false)}
          />
        )}
      </Suspense>
    </>
  )
}
