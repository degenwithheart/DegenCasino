import React, { Suspense, useCallback, useState } from 'react'
import { useGameSEO } from '../../hooks/ui/useGameSEO'
import { PublicKey } from '@solana/web3.js'

// Lazy load multiplayer components
const RouletteRoyaleLobby = React.lazy(() => import('./components/Lobby'))
const RouletteRoyaleGame = React.lazy(() => import('./components/GameScreen'))
const DebugGameScreen = React.lazy(() => import('./components/DebugGameScreen'))

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

  // Multiplayer game state
  const [selectedGame, setSelectedGame] = useState<PublicKey | null>(null)
  const [debugMode, setDebugMode] = useState(false)
  
  const handleBackToLobby = useCallback(() => {
    setSelectedGame(null)
    setDebugMode(false)
  }, [])

  console.log('🎰 ROULETTE ROYALE COMPONENT LOADING...')

  return (
    <>
      {seoHelmet}
      <Suspense fallback={<LoadingFallback />}>
        {debugMode ? (
          <DebugGameScreen onBack={handleBackToLobby} />
        ) : selectedGame ? (
          <RouletteRoyaleGame 
            gamePubkey={selectedGame} 
            onBack={handleBackToLobby}
          />
        ) : (
          <RouletteRoyaleLobby
            onGameSelect={setSelectedGame}
            onDebug={() => setDebugMode(true)}
          />
        )}
      </Suspense>
    </>
  )
}
