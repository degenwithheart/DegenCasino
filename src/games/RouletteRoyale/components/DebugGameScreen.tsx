import { useEffect, useState, useCallback } from 'react'
import { PublicKey, Keypair } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { GambaUi, useSound, TokenValue } from 'gamba-react-ui-v2'
import styled, { keyframes } from 'styled-components'
import RouletteTable from './RouletteTable'
import RouletteWheel from './RouletteWheel'
import PlayersList from './PlayersList'
import { SOUND_WIN, SOUND_LOSE, SOUND_PLAY, SOUND_CHIP } from '../constants'

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

// Generate fake players - same as PlinkoRace approach
function generateFakePlayer(index: number) {
  const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry']
  
  return {
    user: Keypair.generate().publicKey,
    name: names[index % names.length] + (index + 1),
    status: 'joined' as const,
    wager: (index + 1) * 2000000, // Deterministic wager amounts
  }
}

interface DebugGameScreenProps {
  onBack: () => void
}

export default function DebugGameScreen({ onBack }: DebugGameScreenProps) {
  const { publicKey } = useWallet()
  
  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    play: SOUND_PLAY,
    chip: SOUND_CHIP
  })
  
  const [gamePhase, setGamePhase] = useState<'waiting' | 'betting' | 'spinning' | 'results'>('waiting')
  const [timeLeft, setTimeLeft] = useState(30)
  const [currentBets, setCurrentBets] = useState<any[]>([])
  const [winningNumber, setWinningNumber] = useState<number | null>(null)
  const [hasJoined, setHasJoined] = useState(false)
  
  // Generate fake players
  const [fakePlayers] = useState(() => Array.from({ length: 3 }, (_, i) => generateFakePlayer(i)))
  
  // Simulate multiplayer game phases
  useEffect(() => {
    if (gamePhase === 'waiting') return
    
    let interval: NodeJS.Timeout
    
    if (gamePhase === 'betting' && timeLeft > 0) {
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
    
    if (gamePhase === 'spinning') {
      // Simulate spinning for 3 seconds then show results
      setTimeout(() => {
        // Use deterministic result (no Math.random)
        const seed = currentBets.length + fakePlayers.length + timeLeft
        const randomWinningNumber = (seed * 13 + 7) % 37 // 0-36
        setWinningNumber(randomWinningNumber)
        setGamePhase('results')
        
        // Check for winners and play sounds
        const hasWinner = currentBets.some(bet => 
          bet.type === 'straight' && bet.number === randomWinningNumber
        )
        sounds.play(hasWinner ? 'win' : 'lose')
        
        // Return to waiting after 5 seconds
        setTimeout(() => {
          setGamePhase('waiting')
          setWinningNumber(null)
          setCurrentBets([])
          setTimeLeft(30)
          setHasJoined(false)
        }, 5000)
      }, 3000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [gamePhase, timeLeft, currentBets, sounds, fakePlayers])
  
  const handleJoinGame = useCallback(() => {
    if (hasJoined) return
    
    setHasJoined(true)
    setGamePhase('betting')
    sounds.play('play')
  }, [hasJoined, sounds])
  
  const handleBetPlaced = useCallback((betData: any) => {
    if (gamePhase !== 'betting' || !hasJoined) return
    
    sounds.play('chip')
    setCurrentBets(prev => [...prev, { ...betData, player: publicKey }])
  }, [gamePhase, hasJoined, publicKey, sounds])
  
  const getPhaseText = () => {
    switch (gamePhase) {
      case 'waiting':
        return 'Waiting for players...'
      case 'betting':
        return `Place your bets! ${timeLeft}s`
      case 'spinning':
        return 'Spinning...'
      case 'results':
        return `Winning number: ${winningNumber}`
      default:
        return ''
    }
  }
  
  // All players (fake + real player if joined)
  const allPlayers = [
    ...fakePlayers,
    ...(hasJoined && publicKey ? [{ 
      user: publicKey, 
      name: 'You', 
      status: 'joined' as const,
      wager: 1000000 
    }] : [])
  ]
  
  return (
    <GambaUi.Portal target="screen">
      <GameContainer>
        <DebugBanner>
          🧪 DEBUG MODE - Free Play with Fake Players 🧪
        </DebugBanner>
        
        <Header>
          <GameTitle>Roulette Royale (Debug)</GameTitle>
          <GameStatus>
            <span>{getPhaseText()}</span>
            <BackButton onClick={onBack}>
              ← Back to Lobby
            </BackButton>
          </GameStatus>
        </Header>
        
        <GameContent>
          <TableSection>
            <RouletteTable 
              gamePhase={gamePhase}
              onBetPlaced={handleBetPlaced}
              disabled={gamePhase !== 'betting' || !hasJoined}
            />
            
            <BettingControls>
              {gamePhase === 'waiting' && (
                <GambaUi.Button 
                  onClick={handleJoinGame}
                  disabled={hasJoined}
                >
                  {hasJoined ? 'Joined!' : 'Join Game (Free)'}
                </GambaUi.Button>
              )}
              
              {gamePhase === 'betting' && hasJoined && (
                <div style={{ color: '#ffd700' }}>
                  Place your bets on the table above! Time left: {timeLeft}s
                </div>
              )}
            </BettingControls>
          </TableSection>
          
          <WheelSection>
            <RouletteWheel 
              spinning={gamePhase === 'spinning'}
              winningNumber={winningNumber}
            />
            
            <PlayersSection>
              <PlayersList 
                players={allPlayers}
                currentPlayer={publicKey}
                gameState={{ [gamePhase]: true }}
              />
            </PlayersSection>
          </WheelSection>
        </GameContent>
      </GameContainer>
    </GambaUi.Portal>
  )
}