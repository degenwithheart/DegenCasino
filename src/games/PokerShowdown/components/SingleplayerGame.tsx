import React, { useState, useCallback, useRef } from 'react'
import { GambaUi, useSound, useWagerInput, useCurrentPool } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import styled from 'styled-components'
import { DrawStrategy, GameResult } from '../types'
import { POKER_COLORS, CONFIG, SOUND_WIN, SOUND_LOSE, SOUND_PLAY, SOUND_CARD } from '../constants'
import { executePokerShowdown, simulateGameOutcome } from '../engine/GameEngine'
import { POKER_SHOWDOWN_CONFIG, getPokerShowdownBetArray } from '../../rtpConfigMultiplayer'
import { EnhancedWagerInput, EnhancedButton, MobileControls, DesktopControls } from '../../../components'
import { useGameStats } from '../../../hooks/game/useGameStats'
import { GameStatsHeader } from '../../../components/Game/GameStatsHeader'
import GameplayFrame, { GameplayEffectsRef } from '../../../components/Game/GameplayFrame'
import GameScreen from './GameScreen'
import type { STRATEGY_PRESETS } from '../types'

const PracticeContainer = styled.div`
  background: ${POKER_COLORS.background};
  width: 100%;
  height: 100%;
  color: ${POKER_COLORS.text};
  position: relative;
`

const GameArea = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StrategyDisplay = styled.div`
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  max-width: 600px;
  text-align: center;
  
  .strategy-title {
    color: ${POKER_COLORS.gold};
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .strategy-details {
    font-size: 14px;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.8);
  }
`

const ResultsPanel = styled.div`
  background: linear-gradient(135deg, rgba(26, 107, 58, 0.8) 0%, rgba(13, 90, 45, 0.9) 100%);
  border: 3px solid ${POKER_COLORS.gold};
  border-radius: 20px;
  padding: 25px;
  margin: 20px 0;
  text-align: center;
  max-width: 500px;
  
  .result-title {
    font-size: 24px;
    color: ${POKER_COLORS.gold};
    font-weight: bold;
    margin-bottom: 15px;
  }
  
  .hand-name {
    font-size: 18px;
    margin-bottom: 10px;
  }
  
  .payout-info {
    font-size: 16px;
    color: ${POKER_COLORS.accent};
    margin-bottom: 15px;
  }
  
  .strategy-feedback {
    font-size: 14px;
    padding: 10px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.8);
  }
`

interface SingleplayerGameProps {
  selectedStrategy: DrawStrategy
  onBack: () => void
  onChangeStrategy: () => void
}

export default function SingleplayerGame({
  selectedStrategy,
  onBack,
  onChangeStrategy
}: SingleplayerGameProps) {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const pool = useCurrentPool()
  const [wager, setWager] = useWagerInput()
  const effectsRef = useRef<GameplayEffectsRef>(null)
  
  // Game state
  const [gameResult, setGameResult] = useState<GameResult | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<'ready' | 'playing' | 'results'>('ready')
  
  // Statistics
  const gameStats = useGameStats('poker-showdown-practice')
  
  // Sound effects
  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    play: SOUND_PLAY,
    card: SOUND_CARD,
  })

  // Pool restrictions
  const maxMultiplier = Math.max(...Object.values(POKER_SHOWDOWN_CONFIG.HAND_MULTIPLIERS))
  const maxWagerForPool = pool.maxPayout / maxMultiplier
  const maxPayout = wager * maxMultiplier
  const poolExceeded = maxPayout > pool.maxPayout

  // Generate AI opponents with random strategies
  const generateAIOpponents = useCallback(() => {
    const strategies = ['CONSERVATIVE', 'BALANCED', 'AGGRESSIVE'] as const
    const aiCount = Math.floor(Math.random() * 4) + 2 // 2-5 AI opponents
    
    return Array.from({ length: aiCount }, (_, index) => {
      const randomStrategy = strategies[Math.floor(Math.random() * strategies.length)]
      const preset = {
        'CONSERVATIVE': { keepPairs: true, keepHighCards: true, drawToFlush: false, drawToStraight: false, riskLevel: 'conservative' as const },
        'BALANCED': { keepPairs: true, keepHighCards: true, drawToFlush: true, drawToStraight: false, riskLevel: 'balanced' as const },
        'AGGRESSIVE': { keepPairs: false, keepHighCards: false, drawToFlush: true, drawToStraight: true, riskLevel: 'aggressive' as const }
      }
      
      return {
        strategy: preset[randomStrategy],
        name: `AI Player ${index + 1} (${randomStrategy})`
      }
    })
  }, [])

  const handlePlay = useCallback(async () => {
    if (wager <= 0 || isPlaying || poolExceeded) return
    
    setIsPlaying(true)
    setCurrentPhase('playing')
    sounds.play('play')
    
    try {
      // Generate AI opponents
      const aiOpponents = generateAIOpponents()
      const allStrategies = [selectedStrategy, ...aiOpponents.map(ai => ai.strategy)]
      const allPlayerIds = ['human-player', ...aiOpponents.map((_, i) => `ai-player-${i + 1}`)]
      
      console.log('🎯 Starting practice game with:', {
        humanStrategy: selectedStrategy.riskLevel,
        aiOpponents: aiOpponents.length,
        totalPlayers: allStrategies.length
      })

      // Simulate game outcome to determine bet array
      const seed = `practice-${Date.now()}-${Math.random()}`
      const outcome = simulateGameOutcome(allStrategies, seed)
      
      // Calculate bet array (simplified for practice mode)
      const isHumanWinner = outcome.winnerIndex === 0
      const betArray = getPokerShowdownBetArray(
        outcome.winnerHandRank.toString(),
        allStrategies.length,
        isHumanWinner
      )
      
      // Execute Gamba transaction
      await game.play({
        bet: betArray,
        wager: wager,
        metadata: [
          selectedStrategy.keepPairs ? 1 : 0,
          selectedStrategy.keepHighCards ? 1 : 0,
          selectedStrategy.drawToFlush ? 1 : 0,
          selectedStrategy.drawToStraight ? 1 : 0,
          selectedStrategy.riskLevel === 'aggressive' ? 2 : 
          selectedStrategy.riskLevel === 'balanced' ? 1 : 0
        ]
      })
      
      // Get result from Gamba
      const result = await game.result()
      console.log('🎯 Gamba result:', result)
      
      // Execute full poker logic for detailed results
      const fullResult = executePokerShowdown(
        allStrategies,
        allPlayerIds,
        wager * allStrategies.length,
        seed
      )
      
      // Update payout based on actual Gamba result
      if (fullResult.winnerIndex === 0) { // Human won
        fullResult.players[0].payout = result.payout
      } else {
        fullResult.players[0].payout = 0 // Human lost
      }
      
      setGameResult(fullResult)
      setCurrentPhase('results')
      
      // Update statistics
      const humanWon = fullResult.winnerIndex === 0
      const humanHand = fullResult.players[0].handEval
      gameStats.updateStats(humanWon ? result.payout : 0)
      
      // Play appropriate sound and effects
      if (humanWon) {
        sounds.play('win')
        if (effectsRef.current) {
          effectsRef.current.winFlash('#ffd700', 3)
          setTimeout(() => {
            effectsRef.current?.particleBurst(undefined, undefined, '#ffd700', 30)
          }, 500)
        }
      } else {
        sounds.play('lose')
        if (effectsRef.current) {
          effectsRef.current.loseFlash('#f44336', 2)
        }
      }
      
    } catch (error) {
      console.error('❌ Practice game failed:', error)
      setCurrentPhase('ready')
    } finally {
      setIsPlaying(false)
    }
  }, [wager, isPlaying, poolExceeded, selectedStrategy, generateAIOpponents, sounds, game, gameStats])

  const handleNewGame = useCallback(() => {
    setGameResult(null)
    setCurrentPhase('ready')
  }, [])

  const formatSOL = (lamports: number) => {
    return (lamports / 1000000000).toFixed(4)
  }

  const getStrategyDescription = (strategy: DrawStrategy) => {
    const features = []
    if (strategy.keepPairs) features.push('Keep pairs+')
    if (strategy.keepHighCards) features.push('Keep high cards')
    if (strategy.drawToFlush) features.push('Draw to flushes')
    if (strategy.drawToStraight) features.push('Draw to straights')
    
    return `${strategy.riskLevel.toUpperCase()} strategy: ${features.join(', ')}`
  }

  return (
    <>
      {/* Stats Portal */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Poker Showdown Practice"
          gameMode={selectedStrategy.riskLevel.toUpperCase()}
          rtp="94"
          stats={gameStats.stats}
        />
      </GambaUi.Portal>

      {/* Screen Portal */}
      <GambaUi.Portal target="screen">
        <GameplayFrame effectsRef={effectsRef}>
          <PracticeContainer>
            <GameArea>
              {/* Strategy Display */}
              <StrategyDisplay>
                <div className="strategy-title">Your Strategy</div>
                <div className="strategy-details">
                  {getStrategyDescription(selectedStrategy)}
                </div>
                <button
                  onClick={onChangeStrategy}
                  style={{
                    marginTop: '10px',
                    padding: '8px 16px',
                    background: 'transparent',
                    border: '1px solid rgba(255, 215, 0, 0.5)',
                    color: POKER_COLORS.gold,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Change Strategy
                </button>
              </StrategyDisplay>

              {/* Game Visualization */}
              {gameResult && currentPhase === 'results' && (
                <>
                  <GameScreen
                    gameResult={gameResult}
                    currentPhase="results"
                    playerNames={['You (Human)', ...gameResult.players.slice(1).map((_, i) => `AI Player ${i + 1}`)]}
                    onAnimationComplete={() => console.log('Animation complete')}
                  />
                  
                  <ResultsPanel>
                    <div className="result-title">
                      {gameResult.winnerIndex === 0 ? '🏆 You Won!' : '💔 You Lost'}
                    </div>
                    <div className="hand-name">
                      Your Hand: {gameResult.players[0].handEval.name}
                    </div>
                    <div className="payout-info">
                      {gameResult.winnerIndex === 0 ? (
                        <>Prize: {formatSOL(gameResult.players[0].payout)} SOL</>
                      ) : (
                        <>Lost: {formatSOL(wager)} SOL</>
                      )}
                    </div>
                    <div className="strategy-feedback">
                      Winner: {gameResult.players[gameResult.winnerIndex].handEval.name}
                      <br />
                      {gameResult.players.length} players competed
                    </div>
                  </ResultsPanel>
                </>
              )}
            </GameArea>
          </PracticeContainer>
        </GameplayFrame>
      </GambaUi.Portal>

      {/* Controls Portal */}
      <GambaUi.Portal target="controls">
        {currentPhase === 'ready' ? (
          <>
            <MobileControls
              wager={wager}
              setWager={setWager}
              onPlay={handlePlay}
              playDisabled={isPlaying || !pool || poolExceeded || wager <= 0}
            />
            <DesktopControls>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <EnhancedButton onClick={onBack}>
                  Back to Lobby
                </EnhancedButton>
                <EnhancedWagerInput
                  value={wager}
                  onChange={setWager}
                  disabled={isPlaying}
                />
                <EnhancedButton 
                  onClick={handlePlay} 
                  disabled={isPlaying || !pool || poolExceeded || wager <= 0}
                  variant="primary"
                >
                  {isPlaying ? 'Playing...' : 'Play Practice Game'}
                </EnhancedButton>
              </div>
            </DesktopControls>
          </>
        ) : currentPhase === 'results' ? (
          <>
            <MobileControls
              wager={wager}
              setWager={setWager}
              onPlay={handleNewGame}
              playDisabled={false}
            />
            <DesktopControls>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'center' }}>
                <EnhancedButton onClick={onBack}>
                  Back to Lobby
                </EnhancedButton>
                <EnhancedButton onClick={onChangeStrategy}>
                  Change Strategy
                </EnhancedButton>
                <EnhancedButton onClick={handleNewGame} variant="primary">
                  Play Again
                </EnhancedButton>
              </div>
            </DesktopControls>
          </>
        ) : (
          <div style={{ 
            padding: '20px', 
            textAlign: 'center', 
            color: POKER_COLORS.text 
          }}>
            <p>Game in progress...</p>
          </div>
        )}
      </GambaUi.Portal>
    </>
  )
}