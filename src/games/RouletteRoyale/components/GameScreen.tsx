import React, { useEffect, useState, useRef, useCallback } from 'react'
import { PublicKey } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { useGame } from 'gamba-react-v2'
import { GambaUi, Multiplayer, useSound, TokenValue } from 'gamba-react-ui-v2'
import styled, { keyframes } from 'styled-components'
import { 
  PLATFORM_CREATOR_ADDRESS,
  MULTIPLAYER_FEE_BPS,
  PLATFORM_REFERRAL_FEE,
} from '../../../constants'
import RouletteTable from './RouletteTable'
import RouletteWheel from './RouletteWheel'
import PlayersList from './PlayersList'
import { SOUND_WIN, SOUND_LOSE, SOUND_PLAY, SOUND_CHIP } from '../constants'
import { getRouletteRoyaleBetArray } from '../../rtpConfigMultiplayer'

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

const GamePhase = styled.div<{ phase: string }>`
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
  text-align: center;
  animation: ${props => props.phase === 'betting' ? glowPulse : 'none'} 2s ease-in-out infinite;
  
  background: ${props => {
    switch (props.phase) {
      case 'betting': return 'linear-gradient(45deg, #4caf50, #45a049)'
      case 'spinning': return 'linear-gradient(45deg, #ff9800, #f57c00)'
      case 'results': return 'linear-gradient(45deg, #2196f3, #1976d2)'
      default: return 'rgba(255, 255, 255, 0.2)'
    }
  }};
`

const MainGameArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  flex-grow: 1;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`

const TableArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`

const Timer = styled.div<{ urgent?: boolean }>`
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: ${props => props.urgent ? '#ff6b6b' : '#ffd700'};
  padding: 10px;
  border: 2px solid ${props => props.urgent ? '#ff6b6b' : '#ffd700'};
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
`

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
  }
`

const WinnerAnnouncement = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(45deg, #ffd700, #ff6b6b);
  padding: 30px;
  border-radius: 16px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  z-index: 1000;
  animation: ${glowPulse} 1s ease-in-out infinite;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
`

interface GameScreenProps {
  gamePubkey: PublicKey
  onBack: () => void
}

function RouletteRoyaleGameScreen({ gamePubkey, onBack }: GameScreenProps) {
  const { publicKey } = useWallet()
  const { game: chainGame, metadata } = useGame(gamePubkey, { fetchMetadata: true })
  
  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    play: SOUND_PLAY,
    chip: SOUND_CHIP
  })

  // Game state
  const [gamePhase, setGamePhase] = useState<'waiting' | 'betting' | 'spinning' | 'results'>('waiting')
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [winningNumber, setWinningNumber] = useState<number | null>(null)
  const [winner, setWinner] = useState<PublicKey | null>(null)
  const [showWinnerAnnouncement, setShowWinnerAnnouncement] = useState(false)

  // Betting state  
  const [playerBets, setPlayerBets] = useState<Record<string, any>>({})
  const [myBets, setMyBets] = useState<any[]>([])

  // Game phase management
  useEffect(() => {
    if (!chainGame) return

    if (chainGame.state.waiting) {
      setGamePhase('waiting')
    } else if (chainGame.state.playing) {
      setGamePhase('betting')
      // Start countdown timer
      const endTime = Number(chainGame.softExpirationTimestamp) * 1000
      const updateTimer = () => {
        const now = Date.now()
        const remaining = Math.max(0, endTime - now)
        setTimeLeft(Math.ceil(remaining / 1000))
        
        if (remaining <= 0) {
          setGamePhase('spinning')
        }
      }
      updateTimer()
      const interval = setInterval(updateTimer, 1000)
      return () => clearInterval(interval)
    } else if (chainGame.state.settled) {
      setGamePhase('results')
      // Show results and winner
      handleGameResults()
    }
  }, [chainGame?.state])

  const handleGameResults = useCallback(() => {
    if (!chainGame || !chainGame.winnerIndexes) return

    const winnerIndex = Number(chainGame.winnerIndexes[0])
    setWinningNumber(winnerIndex)
    
    // Determine winner (player who bet on winning number)
    const winnerPlayer = chainGame.players.find(player => {
      // Check if player's bet includes the winning number
      // This would need to be implemented based on how bets are stored
      return false // Placeholder
    })
    
    if (winnerPlayer) {
      setWinner(winnerPlayer.user)
      setShowWinnerAnnouncement(true)
      sounds.play('win')
      
      // Hide announcement after 5 seconds
      setTimeout(() => {
        setShowWinnerAnnouncement(false)
      }, 5000)
    } else {
      sounds.play('lose')
    }
  }, [chainGame, sounds])

  const isPlayerInGame = publicKey && chainGame?.players.some(p => p.user.equals(publicKey))
  const canJoinGame = chainGame?.state.waiting && !isPlayerInGame

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!chainGame) {
    return (
      <GameContainer>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '20px' }}>🔄 Loading game...</div>
          <BackButton onClick={onBack}>← Back to Lobby</BackButton>
        </div>
      </GameContainer>
    )
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <GameContainer>
          {showWinnerAnnouncement && winner && (
            <WinnerAnnouncement>
              🎉 Winner: {winner.toBase58().slice(0, 8)}... 🎉
              <br />
              <small>Number: {winningNumber}</small>
            </WinnerAnnouncement>
          )}

          <Header>
            <div>
              <GameTitle>🎰 Roulette Royale - Table {gamePubkey.toBase58().slice(0, 6)}</GameTitle>
            </div>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <GamePhase phase={gamePhase}>
                {gamePhase === 'waiting' && '⏳ Waiting for Players'}
                {gamePhase === 'betting' && '💰 Betting Open'}
                {gamePhase === 'spinning' && '🎲 Spinning...'}
                {gamePhase === 'results' && '🎊 Results'}
              </GamePhase>
              <BackButton onClick={onBack}>← Lobby</BackButton>
            </div>
          </Header>

          {gamePhase === 'betting' && timeLeft > 0 && (
            <Timer urgent={timeLeft <= 10}>
              ⏰ Betting closes in: {formatTime(timeLeft)}
            </Timer>
          )}

          <MainGameArea>
            <TableArea>
              <RouletteWheel 
                spinning={gamePhase === 'spinning'}
                winningNumber={winningNumber}
              />
              <RouletteTable
                gamePhase={gamePhase}
                onBetPlaced={(bet) => {
                  sounds.play('chip')
                  setMyBets(prev => [...prev, bet])
                }}
                disabled={gamePhase !== 'betting' || !isPlayerInGame}
              />
            </TableArea>
            
            <Sidebar>
              <PlayersList 
                players={chainGame.players}
                currentPlayer={publicKey}
                gameState={chainGame.state}
              />
              
              {myBets.length > 0 && (
                <div style={{ 
                  background: 'rgba(0, 0, 0, 0.3)', 
                  padding: '15px', 
                  borderRadius: '8px',
                  border: '2px solid rgba(255, 215, 0, 0.3)'
                }}>
                  <h4 style={{ color: '#ffd700', margin: '0 0 10px 0' }}>My Bets</h4>
                  {myBets.map((bet, i) => (
                    <div key={i} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '5px'
                    }}>
                      <span>{bet.type}</span>
                      <TokenValue amount={bet.amount} />
                    </div>
                  ))}
                </div>
              )}
            </Sidebar>
          </MainGameArea>
        </GameContainer>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '15px',
          padding: '15px',
          flexWrap: 'wrap'
        }}>
          {canJoinGame && (
            <Multiplayer.JoinGame
              pubkey={gamePubkey}
              account={chainGame as any}
              creatorAddress={PLATFORM_CREATOR_ADDRESS}
              creatorFeeBps={MULTIPLAYER_FEE_BPS}
              referralFee={PLATFORM_REFERRAL_FEE}
              enableMetadata
              onTx={() => sounds.play('play')}
            />
          )}
          
          {isPlayerInGame && gamePhase === 'waiting' && (
            <Multiplayer.EditBet
              pubkey={gamePubkey}
              account={chainGame as any}
              creatorAddress={PLATFORM_CREATOR_ADDRESS}
              creatorFeeBps={MULTIPLAYER_FEE_BPS}
              onComplete={() => {}}
            />
          )}
        </div>
      </GambaUi.Portal>
    </>
  )
}

export default RouletteRoyaleGameScreen
