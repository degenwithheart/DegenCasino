import React, { useState, useCallback, Suspense } from 'react'
import { GambaUi } from 'gamba-react-ui-v2'
import type { PublicKey } from '@solana/web3.js'
import { useGameSEO } from '../../hooks/ui/useGameSEO'
import { useIsCompact } from '../../hooks/ui/useIsCompact'
import { GameStatsHeader } from '../../components/Game/GameStatsHeader'
import { GameRecentPlaysHorizontal } from '../../components'
import { useGameStats } from '../../hooks/game/useGameStats'

import Lobby from './components/Lobby'
import GameScreen from './components/GameScreen'
import DebugGameScreen from './components/DebugGameScreen'

export default function DiceDual() {
  const seoHelmet = useGameSEO({
    gameName: 'Dice Dual',
    description: `Challenge other players in this multiplayer dice prediction game. Roll the dice and predict over, under, or exact numbers. Winner takes all in this fair and exciting PvP dice battle.`,
    maxWin: 'varies'
  })

  const { mobile: isMobile } = useIsCompact()
  const gameStats = useGameStats('dicedual')
  const [selectedGame, setSelectedGame] = useState<PublicKey | null>(null)
  const [debugMode, setDebugMode] = useState(false)

  const handleBack = useCallback(() => {
    setSelectedGame(null)
    setDebugMode(false)
  }, [])

  return (
    <>
      {seoHelmet}
      
      {/* Recent Plays Portal */}
      <GambaUi.Portal target="recentplays">
        <GameRecentPlaysHorizontal gameId="dicedual" />
      </GambaUi.Portal>

      {/* Stats Portal */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Dice Dual"
          gameMode="Multiplayer"
          stats={gameStats.stats}
          onReset={gameStats.resetStats}
          isMobile={isMobile}
        />
      </GambaUi.Portal>

      <Suspense fallback={<div>Loading Dice Dual...</div>}>
        {debugMode ? (
          <DebugGameScreen onBack={() => setDebugMode(false)} />
        ) : selectedGame ? (
          <GameScreen pk={selectedGame} onBack={handleBack} />
        ) : (
          <Lobby onSelect={setSelectedGame} onDebug={() => setDebugMode(true)} />
        )}
      </Suspense>
    </>
  )
}