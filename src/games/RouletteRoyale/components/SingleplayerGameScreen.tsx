import { useEffect, useState, useCallback, useRef } from 'react'
import { PublicKey, Keypair } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { GambaUi, useSound, TokenValue, useCurrentToken } from 'gamba-react-ui-v2'
import styled, { keyframes } from 'styled-components'
import { EnhancedWagerInput, MobileControls, DesktopControls, GameControlsSection, GameRecentPlaysHorizontal } from '../../../components'
import { useIsCompact } from '../../../hooks/ui/useIsCompact'
import { GameStatsHeader } from '../../../components/Game/GameStatsHeader'
import { useGameStats } from '../../../hooks/game/useGameStats'
import { generateUsernameFromWallet } from '../../../utils/user/userProfileUtils'
import RouletteTable from './RouletteTable'
import RouletteWheel from './RouletteWheel'
import CreateSingleplayerGameModal, { SingleplayerGameConfig } from './CreateSingleplayerGameModal'
import PlayersList from './PlayersList'
import { SOUND_WIN, SOUND_LOSE, SOUND_PLAY, SOUND_CHIP } from '../constants'
import { ROULETTE_ROYALE_CONFIG } from '../../rtpConfigMultiplayer'

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 25px rgba(255, 215, 0, 0.6);
  }
`

const GameContainer = styled.div`
  padding: 20px;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  color: white;
  background: radial-gradient(ellipse at center, rgba(139, 69, 19, 0.4) 0%, rgba(0, 0, 0, 0.9) 70%);
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
`

const GameTitle = styled.h2`
  color: #ffd700;
  margin: 0;
  font-size: 1.5rem;
`

const GameStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  color: #ffd700;
  font-weight: bold;
`

const GameContent = styled.div`
  display: flex;
  gap: 20px;
  flex-grow: 1;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const TableSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const WheelSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const PlayersSection = styled.div`
  background: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  padding: 15px;
  border: 1px solid rgba(255, 215, 0, 0.3);
`

const BettingControls = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 15px;
  flex-wrap: wrap;
`

const DebugBanner = styled.div`
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 10px 20px;
  text-align: center;
  font-weight: bold;
  border-radius: 8px;
  margin-bottom: 20px;
  animation: ${glowPulse} 2s ease-in-out infinite;
`

const BackButton = styled.button`
  background: rgba(255, 0, 0, 0.2);
  color: white;
  border: 1px solid rgba(255, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 0, 0, 0.4);
    border-color: rgba(255, 0, 0, 0.8);
  }
`

// Fake players now use generated usernames from consistent seeds

interface SingleplayerGameScreenProps {
  onBack: () => void
  initialWager?: number
}

export default function SingleplayerGameScreen({ onBack, initialWager }: SingleplayerGameScreenProps) {
  const { publicKey } = useWallet()
  const token = useCurrentToken()
  
  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    play: SOUND_PLAY,
    chip: SOUND_CHIP
  })
  
  // Game statistics tracking
  const gameStats = useGameStats('roulette-royale')
  const { mobile: isMobile } = useIsCompact()
  
  const [gamePhase, setGamePhase] = useState<'wagering' | 'placing' | 'spinning' | 'outcome' | 'lobby'>('placing')
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [gameConfig, setGameConfig] = useState<SingleplayerGameConfig | null>(null)
  const [timeLeft, setTimeLeft] = useState(30)
  const [wageringTimeLeft, setWageringTimeLeft] = useState(30)
  const [lobbyTimeLeft, setLobbyTimeLeft] = useState(15)
  const [currentBets, setCurrentBets] = useState<any[]>([])
  const [allPlayerBets, setAllPlayerBets] = useState<any[]>([])
  const [fakePlayerBets, setFakePlayerBets] = useState<any[]>([])
  const [winningNumber, setWinningNumber] = useState<number | null>(null)
  const spinningInitiatedRef = useRef(false)
  
  // Debug logging for winning number changes in singleplayer mode
  useEffect(() => {
    console.log('🎮 Singleplayer: Winning number changed to:', winningNumber, 'Game phase:', gamePhase)
  }, [winningNumber, gamePhase])
  const [hasCommitted, setHasCommitted] = useState(false)
  
  const handleConfigureGame = (config: SingleplayerGameConfig) => {
    setGameConfig(config)
    setWagerAmount(config.fixedWager)
    setTimeLeft(config.gameDuration)
    setGamePhase('wagering')
    console.log('⚙️ Singleplayer game configured:', config)
  }
  const [wagerAmount, setWagerAmount] = useState(initialWager || gameConfig?.fixedWager || 1000000) // Initial wager from props or config

  // Auto-configure game when initialWager is provided (joining from table)
  useEffect(() => {
    if (initialWager && !gameConfig) {
      const autoConfig: SingleplayerGameConfig = {
        wagerMode: 'fixed',
        fixedWager: initialWager,
        gameDuration: 30, // Default 30 seconds
        autoStart: true, // Auto-start when joining from table
        showBotActions: true // Show bot actions for gameplay visibility
      }
      console.log('🚀 Auto-configuring singleplayer game from table join:', autoConfig)
      setGameConfig(autoConfig)
      setWagerAmount(autoConfig.fixedWager)
      setTimeLeft(autoConfig.gameDuration)
      setShowConfigModal(false) // Ensure modal is closed for table joins
      setHasCommitted(true) // Enable betting for table joins
      
      // Generate fake player bets for chip visualization
      const fakeBets: any[] = []
      fakePlayers.forEach((playerName, index) => {
        const fakePlayerKey = `fake_player_${index}_${playerName.replace(/\s/g, '_')}`
        // Each fake player places exactly the configured number of chips
        const numBets = ROULETTE_ROYALE_CONFIG.CHIPS_PER_PLAYER
        for (let i = 0; i < numBets; i++) {
          if (Math.random() > 0.6) {
            // Color bet (red/black)
            fakeBets.push({
              type: 'outside',
              value: Math.random() > 0.5 ? 'red' : 'black',
              amount: autoConfig.fixedWager,
              player: fakePlayerKey
            })
          } else {
            // Number bet
            fakeBets.push({
              type: 'number',
              value: Math.floor(Math.random() * 37),
              amount: autoConfig.fixedWager,
              player: fakePlayerKey
            })
          }
        }
      })
      setFakePlayerBets(fakeBets)
      setAllPlayerBets(fakeBets)
      
      // Skip wagering phase and go directly to placing phase for table joins
      setGamePhase('placing')
      console.log('⚡ Skipping to placing phase for table join with', fakeBets.length, 'fake bets')
    }
  }, [initialWager, gameConfig])
  
  // Generate random fake player names from a large pool
  const generateRandomBots = () => {
    const botPool = Array.from({ length: 50 }, (_, i) => 
      generateUsernameFromWallet(`roulette_bot_${String(i + 1).padStart(3, '0')}_${Date.now()}`)
    )
    
    // Shuffle the pool and take 3 random bots
    const shuffled = [...botPool].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 3)
  }
  
  const [fakePlayers] = useState(() => generateRandomBots()) // Fixed 3 AI opponents for 4-player max tables
  
  const getNumberColor = (num: number): 'red' | 'black' | 'green' => {
    if (num === 0) return 'green'
    const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]
    return redNumbers.includes(num) ? 'red' : 'black'
  }
  
    // Simulate 5-phase game
  useEffect(() => {
    if (gamePhase === 'placing') {
      // Start countdown for placing bets
      let interval: NodeJS.Timeout
      if (timeLeft > 0) {
        interval = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              setGamePhase('spinning')
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
      return () => {
        if (interval) clearInterval(interval)
      }
    }
    
    if (gamePhase === 'spinning' && winningNumber === null && !spinningInitiatedRef.current) {
      // Mark spinning as initiated to prevent multiple executions
      spinningInitiatedRef.current = true
      
      // Generate winning number in background but don't set it yet
      const randomWinningNumber = Math.floor(Math.random() * 37) // 0-36
      console.log('🎲 DEBUG: Generated winning number (will reveal in 2s):', randomWinningNumber)
      
      // Let wheel spin freely for 2 seconds, then reveal winning number
      const revealTimeout = setTimeout(() => {
        console.log('🎯 DEBUG: Revealing winning number:', randomWinningNumber)
        setWinningNumber(randomWinningNumber)
      }, 2000)
      
      // Show outcome after total 5 seconds (2s free spin + 3s landing animation)
      console.log('⏰ DEBUG: Setting outcome timeout for 5 seconds')
      const outcomeTimeout = setTimeout(() => {
        console.log('🎯 DEBUG: Outcome timeout FIRED - Transitioning to outcome phase')
        setGamePhase('outcome')
        
        // Check for winners and play sounds
        const hasWinner = currentBets.some(bet => 
          (bet.type === 'number' && bet.value === randomWinningNumber) ||
          (bet.type === 'outside' && bet.value === 'red' && getNumberColor(randomWinningNumber) === 'red') ||
          (bet.type === 'outside' && bet.value === 'black' && getNumberColor(randomWinningNumber) === 'black')
        )
        console.log('🏆 DEBUG: Winner check result:', { hasWinner, randomWinningNumber })
        sounds.play(hasWinner ? 'win' : 'lose')
        
        // Set lobby timeout after transitioning to outcome
        console.log('⏰ DEBUG: Setting lobby timeout for 15 seconds (from outcome)')
        setTimeout(() => {
          console.log('🔄 DEBUG: Lobby timeout FIRED - Transitioning to lobby')
          setGamePhase('lobby')
          setLobbyTimeLeft(15) // Reset lobby countdown
        }, 3000)
      }, 5000)
      
      // Cleanup function to clear timeouts if component unmounts or phase changes
      return () => {
        clearTimeout(revealTimeout)
        clearTimeout(outcomeTimeout)
      }
    }
    
    if (gamePhase === 'lobby') {
      // Countdown timer for lobby phase
      console.log('🏠 DEBUG: In lobby phase, countdown:', lobbyTimeLeft)
      const countdownInterval = setInterval(() => {
        setLobbyTimeLeft(prev => {
          if (prev <= 1) {
            console.log('🔄 DEBUG: Auto-returning to lobby (countdown finished)')
            onBack() // Return to lobby when countdown reaches 0
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      return () => clearInterval(countdownInterval)
    }
  }, [gamePhase, hasCommitted]) // Removed sounds to prevent timeout clearing due to sounds object recreation
  
  const handleRestartGame = useCallback(() => {
    console.log('🔄 DEBUG: Staying with table - Restarting game')
    // Always go directly to placing phase (skip wagering/playerlist)
    setGamePhase('placing')
    setWinningNumber(null)
    setCurrentBets([])
    setAllPlayerBets([])
    setFakePlayerBets([])
    setTimeLeft(gameConfig?.gameDuration || 30)
    setWageringTimeLeft(30)
    setLobbyTimeLeft(15)
    setHasCommitted(true) // Auto-commit since wagering is handled in placing phase
    spinningInitiatedRef.current = false
  }, [gameConfig])

  const handleCommitWager = useCallback(() => {
    if (hasCommitted) return
    setHasCommitted(true)
    setGamePhase('placing')
    sounds.play('play')
    
    // Generate fake player bets for chip visualization
    const fakeBets: any[] = []
    fakePlayers.forEach((playerName, index) => {
      const fakePlayerKey = `fake_player_${index}_${playerName.replace(/\s/g, '_')}`
      const numBets = ROULETTE_ROYALE_CONFIG.CHIPS_PER_PLAYER // Use configured chip limit
      
      for (let i = 0; i < numBets; i++) {
        // Determine wager amount based on config
        let betAmount = wagerAmount
        if (gameConfig?.wagerMode === 'random' && gameConfig.minWager && gameConfig.maxWager) {
          betAmount = Math.floor(Math.random() * (gameConfig.maxWager - gameConfig.minWager) + gameConfig.minWager)
        }
        
        if (Math.random() > 0.6) {
          // 40% chance for color bet
          fakeBets.push({
            type: 'outside',
            value: Math.random() > 0.5 ? 'red' : 'black',
            amount: betAmount,
            player: fakePlayerKey
          })
        } else {
          // 60% chance for number bet
          fakeBets.push({
            type: 'number',
            value: Math.floor(Math.random() * 37),
            amount: betAmount,
            player: fakePlayerKey
          })
        }
      }
    })
    
    setFakePlayerBets(fakeBets)
    setAllPlayerBets([...currentBets, ...fakeBets])
    console.log('🎰 Generated fake player bets for chip visualization:', fakeBets)
    
    // Simulate fake players placing bets over time for realism
    fakeBets.forEach((bet, index) => {
      setTimeout(() => {
        console.log(`🤖 Fake player ${bet.player} placed bet:`, bet)
        // The bet is already in allPlayerBets, this is just for realistic timing/logging
      }, Math.random() * 5000 + 1000) // Random delay between 1-6 seconds
    })
  }, [hasCommitted, sounds, fakePlayers, wagerAmount, currentBets])
  
  const handleBetPlaced = useCallback((betData: any) => {
    if (gamePhase !== 'placing' || !hasCommitted || !publicKey) return
    sounds.play('chip')
    // Allow configurable number of chips per player
    const playerKey = publicKey.toBase58()
    const newBet = { ...betData, player: playerKey }
    
    setCurrentBets(prev => {
      const playerBets = prev.filter(bet => bet.player === playerKey)
      if (playerBets.length >= ROULETTE_ROYALE_CONFIG.CHIPS_PER_PLAYER) {
        // Replace the oldest bet if at limit
        const newBets = [...playerBets.slice(1), newBet]
        const otherBets = prev.filter(bet => bet.player !== playerKey)
        return [...otherBets, ...newBets]
      } else {
        // Add new bet
        return [...prev, newBet]
      }
    })
    
    // Update combined bets for chip visualization
    setAllPlayerBets(prev => {
      const withoutThisPlayer = prev.filter(bet => bet.player !== playerKey)
      const playerBets = prev.filter(bet => bet.player === playerKey)
      if (playerBets.length >= ROULETTE_ROYALE_CONFIG.CHIPS_PER_PLAYER) {
        const newPlayerBets = [...playerBets.slice(1), newBet]
        return [...withoutThisPlayer, ...newPlayerBets, ...fakePlayerBets]
      } else {
        return [...prev, newBet]
      }
    })
  }, [gamePhase, hasCommitted, publicKey, sounds, fakePlayerBets])
  
  const handleWagerContinue = useCallback(() => {
    setHasCommitted(true)
    setGamePhase('placing')
    sounds.play('play')
  }, [sounds])
  
  const handleStartSpinning = useCallback(() => {
    setGamePhase('spinning')
    sounds.play('play')
  }, [sounds])
  
  const getPhaseText = () => {
    switch (gamePhase) {
      case 'wagering':
        return `Set your wager amount... ${wageringTimeLeft}s`
      case 'placing':
        return `Place your bets! ${timeLeft}s`
      case 'spinning':
        return 'Spinning...'
      case 'outcome':
        return `Winning number: ${winningNumber}`
      case 'lobby':
        return 'Returning to lobby...'
      default:
        return ''
    }
  }
  
  // All players (fake + real player if committed)
  const allPlayers = [
    ...fakePlayers.map((name, index) => ({
      user: Keypair.generate().publicKey, // Generate fake public keys for demo
      name,
      status: 'joined' as const,
      wager: wagerAmount
    })),
    ...(hasCommitted && publicKey ? [{ 
      user: publicKey, 
      name: 'You', 
      status: 'joined' as const,
      wager: wagerAmount 
    }] : [])
  ]
  
  return (
    <>
      {/* Recent Plays Portal - positioned above stats */}
      <GambaUi.Portal target="recentplays">
        <GameRecentPlaysHorizontal gameId="roulette-royale" />
      </GambaUi.Portal>

      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Roulette Royale"
          gameMode="Debug"
          rtp={(0.973 * 100).toFixed(0)}
          stats={gameStats.stats}
          onReset={gameStats.resetStats}
          isMobile={isMobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <div style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          background: 'radial-gradient(ellipse at center, rgba(139, 69, 19, 0.4) 0%, rgba(0, 0, 0, 0.9) 70%)'
        }}>

          {/* Main Game Area - Mobile-First */}
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: 'clamp(130px, 28vw, 150px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(15px, 4vw, 25px)'
          }}>
            {/* Phase-based full screen content */}
            {!gameConfig && !initialWager && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{
                  fontSize: '2rem',
                  color: '#ffd700',
                  textAlign: 'center',
                  marginBottom: '15px'
                }}>
                  🎰 Roulette Royale - Singleplayer 🎰
                </div>
                <div style={{
                  fontSize: '1rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  textAlign: 'center',
                  maxWidth: '400px',
                  lineHeight: '1.5',
                  marginBottom: '20px'
                }}>
                  Play against the house with AI opponents. Configure your singleplayer game settings and wagers.
                </div>
                <button
                  onClick={() => setShowConfigModal(true)}
                  style={{
                    padding: '15px 30px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #ff6b6b, #ffd700)',
                    border: 'none',
                    borderRadius: '10px',
                    color: 'white',
                    cursor: 'pointer',
                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)'
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.5)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3)'
                  }}
                >
                  ⚙️ Configure Singleplayer Game
                </button>
              </div>
            )}

            {gamePhase === 'placing' && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
                width: '100%',
                height: '100%'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%'
                }}>

                  {gameConfig?.wagerMode !== 'fixed' && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 215, 0, 0.2)'
                    }}>
                      <span style={{ color: '#a0aec0', fontSize: '0.9rem' }}>Wager:</span>
                      <EnhancedWagerInput
                        value={wagerAmount}
                        onChange={setWagerAmount}
                        disabled={false}
                      />
                    </div>
                  )}
                </div>
                <RouletteTable
                  gamePhase={gamePhase}
                  onBetPlaced={handleBetPlaced}
                  playerBets={allPlayerBets}
                  wagerAmount={wagerAmount}
                  disabled={gamePhase !== 'placing' || !publicKey || currentBets.filter(bet => bet.player === publicKey.toBase58()).length >= ROULETTE_ROYALE_CONFIG.CHIPS_PER_PLAYER}
                />
              </div>
            )}

            {gamePhase === 'spinning' && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%'
              }}>
                {/* <h2 style={{ color: '#ffd700', margin: 0, fontSize: '1rem' }}>
                  Spinning...
                </h2> */}
                <RouletteWheel
                  spinning={true}
                  winningNumber={winningNumber}
                  gamePhase={gamePhase}
                  playerBets={allPlayerBets}
                  gameResult={{ winnerIndexes: winningNumber ? [winningNumber] : [] }}
                />
              </div>
            )}

            {gamePhase === 'outcome' && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
                width: '100%',
                maxWidth: '500px',
                margin: '0 auto'
              }}>
                {/* Game Results with Player Bets */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.9)',
                  borderRadius: '15px',
                  padding: '15px',
                  border: '2px solid #ffd700',
                  width: '100%',
                  maxHeight: '500px',
                  overflowY: 'auto'
                }}>
                  <div style={{
                    textAlign: 'center',
                    marginBottom: '15px',
                    padding: '10px',
                    background: `linear-gradient(135deg, ${winningNumber !== null && getNumberColor(winningNumber) === 'red' ? '#dc3545, #a71e2a' : winningNumber !== null && getNumberColor(winningNumber) === 'black' ? '#343a40, #1a1e21' : '#28a745, #1e7e34'})`,
                    borderRadius: '10px',
                    border: '2px solid #ffd700'
                  }}>
                    <h3 style={{ color: 'white', margin: 0, fontSize: '1.2rem' }}>
                      🎯 Winning Number: {winningNumber} ({winningNumber !== null ? getNumberColor(winningNumber).toUpperCase() : 'UNKNOWN'})
                    </h3>
                  </div>
                  
                  {/* All Players Results */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(() => {
                      // Create simulated bets for all players
                      const allPlayersWithBets = []
                      
                      // Add fake players with random bets
                      fakePlayers.forEach((playerName, index) => {
                        const fakePlayerKey = `fake_player_${index}`
                        const randomBets = []
                        
                        // Generate bets per configured chip limit
                        const numBets = ROULETTE_ROYALE_CONFIG.CHIPS_PER_PLAYER
                        for (let i = 0; i < numBets; i++) {
                          if (Math.random() > 0.7) {
                            // 30% chance for color bet
                            randomBets.push({
                              type: 'outside',
                              value: Math.random() > 0.5 ? 'red' : 'black',
                              amount: wagerAmount,
                              player: fakePlayerKey
                            })
                          } else {
                            // 70% chance for number bet
                            randomBets.push({
                              type: 'number',
                              value: Math.floor(Math.random() * 37),
                              amount: wagerAmount,
                              player: fakePlayerKey
                            })
                          }
                        }
                        
                        allPlayersWithBets.push({
                          name: playerName,
                          key: fakePlayerKey,
                          bets: randomBets
                        })
                      })
                      
                      // Add real player if they have bets
                      if (publicKey && currentBets.length > 0) {
                        allPlayersWithBets.push({
                          name: 'You',
                          key: publicKey.toBase58(),
                          bets: currentBets
                        })
                      }
                      
                      return allPlayersWithBets.length > 0 ? allPlayersWithBets.map((player, playerIndex) => {
                        const hasWin = player.bets.some(bet => 
                          (bet.type === 'number' && bet.value === winningNumber) ||
                          (bet.type === 'outside' && bet.value === 'red' && getNumberColor(winningNumber || 0) === 'red') ||
                          (bet.type === 'outside' && bet.value === 'black' && getNumberColor(winningNumber || 0) === 'black')
                        )
                        
                        return (
                          <div key={playerIndex} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 12px',
                            background: hasWin ? 'rgba(40, 167, 69, 0.2)' : 'rgba(220, 53, 69, 0.2)',
                            border: `2px solid ${hasWin ? '#28a745' : '#dc3545'}`,
                            borderRadius: '8px',
                            fontSize: '0.9rem'
                          }}>
                            <div style={{ 
                              color: hasWin ? '#28a745' : '#dc3545', 
                              fontWeight: 'bold',
                              minWidth: '80px'
                            }}>
                              {hasWin ? '🏆 WIN' : '❌ LOSE'}
                            </div>
                            <div style={{ 
                              color: 'white',
                              flex: 1,
                              textAlign: 'center',
                              fontWeight: player.name === 'You' ? 'bold' : 'normal'
                            }}>
                              {player.name}
                            </div>
                            <div style={{ color: '#ffd700', fontSize: '0.8rem', minWidth: '120px', textAlign: 'right' }}>
                              {player.bets.map(bet => 
                                bet.type === 'number' ? `#${bet.value}` : bet.value.toUpperCase()
                              ).join(', ')}
                            </div>
                          </div>
                        )
                      }) : (
                        <div style={{ textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
                          No bets placed
                        </div>
                      )
                    })()}
                  </div>
                </div>
              </div>
            )}

            {gamePhase === 'lobby' && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '30px'
              }}>
                <h2 style={{ color: '#ffd700', margin: 0, fontSize: '2rem' }}>
                  Game Finished!
                </h2>
                <div style={{ color: '#a0aec0', fontSize: '1.2rem', textAlign: 'center' }}>
                  Returning to lobby in {lobbyTimeLeft} seconds...
                </div>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {/* <BackButton onClick={handleRestartGame} style={{ backgroundColor: '#48bb78', borderColor: '#48bb78' }}>
                    🎯 Stay with Table
                  </BackButton> */}
                  <BackButton onClick={onBack}>
                    ← Back to Lobby
                  </BackButton>
                </div>
              </div>
            )}
          </div>

          {/* GameControlsSection at bottom - Mobile-First Design */}
          {(gamePhase === 'placing' || gamePhase === 'spinning' || gamePhase === 'outcome') && (
            <GameControlsSection>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                width: '100%',
                justifyContent: 'space-between',
                padding: '0 5px',
                gap: '10px'
              }}>
                {/* Left: User tiles */}
                <div style={{
                  display: 'flex',
                  gap: 'min(12px, 3vw)',
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}>
                {/* Player 1 (You) */}
                <div style={{
                  background: 'rgba(26, 32, 44, 0.9)',
                  borderRadius: '12px',
                  padding: 'clamp(8px, 2vw, 12px)',
                  textAlign: 'center',
                  minWidth: 'clamp(80px, 20vw, 100px)',
                  flex: '1 1 auto',
                  maxWidth: '120px',
                  border: publicKey ? '2px solid rgba(72, 187, 120, 0.6)' : '2px solid rgba(74, 85, 104, 0.5)',
                  boxShadow: '0 4px 16px rgba(26, 32, 44, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ 
                    fontSize: 'clamp(10px, 2vw, 12px)', 
                    marginBottom: '4px', 
                    color: '#a0aec0',
                    fontWeight: 'bold'
                  }}>
                    {publicKey ? generateUsernameFromWallet(publicKey.toBase58()) : 'You'}
                  </div>
                  <div style={{ 
                    fontSize: 'clamp(12px, 2.5vw, 14px)', 
                    fontWeight: 'bold', 
                    color: publicKey ? '#48bb78' : '#e53e3e',
                    marginBottom: '2px'
                  }}>
                    {publicKey ? '🟢' : '🔴'}
                  </div>
                  <div style={{ 
                    fontSize: 'clamp(8px, 1.5vw, 10px)', 
                    color: '#a0aec0',
                    wordBreak: 'break-all',
                    lineHeight: '1.2'
                  }}>
                    {publicKey ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}` : 'No Wallet'}
                  </div>
                  <div style={{ 
                    fontSize: 'clamp(10px, 2vw, 12px)', 
                    color: '#ffd700',
                    marginTop: '4px',
                    fontWeight: 'bold'
                  }}>
                    {gamePhase === 'placing' ? 
                      `${(wagerAmount / token.baseWager).toFixed(3).replace(/\.?0+$/, '')} SOL` : 
                      currentBets.length > 0 ? `${currentBets.length} bets` : 'No bets'
                    }
                  </div>
                </div>

                {/* AI Players */}
                {fakePlayers.map((playerName, index) => {
                  const fakePlayerKey = `fake_player_${index}_${playerName.replace(/\s/g, '_')}`
                  const playerBets = allPlayerBets.filter(bet => bet.player === fakePlayerKey).length
                  
                  // Show bet count based on current game phase and actual bets
                  
                  return (
                    <div key={index} style={{
                      background: 'rgba(26, 32, 44, 0.9)',
                      borderRadius: '12px',
                      padding: 'clamp(8px, 2vw, 12px)',
                      textAlign: 'center',
                      minWidth: 'clamp(80px, 20vw, 100px)',
                      flex: '1 1 auto',
                      maxWidth: '120px',
                      border: '2px solid rgba(255, 165, 0, 0.6)', // Orange for AI
                      boxShadow: '0 4px 16px rgba(26, 32, 44, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    }}>
                      <div style={{ 
                        fontSize: 'clamp(10px, 2vw, 12px)', 
                        marginBottom: '4px', 
                        color: '#a0aec0',
                        fontWeight: 'bold'
                      }}>
                        {playerName}
                      </div>
                      <div style={{ 
                        fontSize: 'clamp(12px, 2.5vw, 14px)', 
                        fontWeight: 'bold', 
                        color: '#ffa500',
                        marginBottom: '2px'
                      }}>
                        🤖
                      </div>
                      <div style={{ 
                        fontSize: 'clamp(8px, 1.5vw, 10px)', 
                        color: '#a0aec0',
                        lineHeight: '1.2'
                      }}>
                        AI Player
                      </div>
                      <div style={{ 
                        fontSize: 'clamp(10px, 2vw, 12px)', 
                        color: '#ffd700',
                        marginTop: '4px',
                        fontWeight: 'bold'
                      }}>
                        {gamePhase === 'placing' ? 
                          `${(wagerAmount / token.baseWager).toFixed(3).replace(/\.?0+$/, '')} SOL` :
                          playerBets > 0 ? `${playerBets} bets` : 'Ready'
                        }
                      </div>
                    </div>
                  );
                })}
                </div>

                {/* Right: Betting info and settings */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '6px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: 'clamp(8px, 2vw, 12px)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  minWidth: '200px'
                }}>
                  <div style={{
                    color: '#ffd700',
                    fontSize: 'clamp(11px, 2.2vw, 13px)',
                    fontWeight: 'bold',
                    textAlign: 'right',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                  }}>
                    💰 Total: {(currentBets.length * wagerAmount / token.baseWager).toFixed(3).replace(/\.?0+$/, '')} SOL | {gamePhase}
                  </div>
                  <div style={{
                    color: '#ffd700',
                    fontSize: 'clamp(10px, 2vw, 12px)',
                    fontWeight: '500',
                    textAlign: 'right',
                    opacity: 0.9
                  }}>
                    Place Your Bets! Time left: {timeLeft}s
                  </div>
                  <button
                    onClick={() => setShowConfigModal(true)}
                    style={{
                      padding: '4px 8px',
                      fontSize: 'clamp(10px, 1.8vw, 11px)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 215, 0, 0.4)',
                      borderRadius: '4px',
                      color: '#ffd700',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      alignSelf: 'flex-end'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 215, 0, 0.1)'
                      e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.6)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                      e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.4)'
                    }}
                  >
                    🔧 Settings
                  </button>
                </div>
              </div>
            </GameControlsSection>
          )}
        </div>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        <MobileControls
          wager={wagerAmount}
          setWager={setWagerAmount}
          onPlay={handleStartSpinning}
          playDisabled={gamePhase !== 'placing'}
          playText={
            gamePhase === 'placing' ? "Start Spinning" :
            "Waiting..."
          }
        />

        <DesktopControls
          onPlay={handleStartSpinning}
          playDisabled={gamePhase !== 'placing'}
          playText={gamePhase === 'placing' ? "Start Spinning" : "Waiting..."}
        >
          <EnhancedWagerInput value={wagerAmount} onChange={setWagerAmount} disabled={gamePhase !== 'placing' || !!initialWager} />
        </DesktopControls>
      </GambaUi.Portal>
      
      {showConfigModal && (
        <CreateSingleplayerGameModal
          onClose={() => setShowConfigModal(false)}
          onConfigureGame={handleConfigureGame}
        />
      )}
    </>
  )
}