import React, { useState } from 'react'
import styled from 'styled-components'
import { PublicKey } from '@solana/web3.js'
import { useSound } from 'gamba-react-ui-v2'
import { Card } from '../Card'
import cardSnd from '../sounds/card.mp3'
import winSnd from '../sounds/win.mp3'
import win2Snd from '../sounds/win2.mp3'
import loseSnd from '../sounds/lose.mp3'
import playSnd from '../sounds/play.mp3'

const DebugWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a, #1e293b, #334155);
  padding: 20px;
  position: relative;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  border: 1px solid #374151;
`

const Title = styled.h1`
  color: #f0f0ff;
  margin: 0;
  font-size: 24px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
`

const BackButton = styled.button`
  padding: 10px 16px;
  background: rgba(107, 114, 128, 0.2);
  color: #d1d5db;
  border: 1px solid #374151;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(107, 114, 128, 0.3);
  }
`

const DebugGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  height: calc(100vh - 140px);
`

const GameArea = styled.div`
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  border: 1px solid #374151;
  padding: 20px;
  overflow: hidden;
`

const ControlPanel = styled.div`
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  border: 1px solid #374151;
  padding: 20px;
  gap: 20px;
  overflow-y: auto;
`

const PlayerArea = styled.div<{ isActive?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 2px solid ${({ isActive }) => (isActive ? '#4f46e5' : '#374151')};
  border-radius: 16px;
  background: ${({ isActive }) => 
    isActive 
      ? 'rgba(79, 70, 229, 0.1)' 
      : 'rgba(0, 0, 0, 0.3)'
  };
  transition: all 0.3s ease;
  flex: 1;
  margin: 10px 0;
  
  ${({ isActive }) => isActive && `
    box-shadow: 0 0 20px rgba(79, 70, 229, 0.3);
  `}
`

const PlayerName = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #f0f0ff;
  text-align: center;
`

const CardsArea = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  min-height: 120px;
  align-items: center;
`

const HandValue = styled.div<{ isBust?: boolean; isBlackjack?: boolean }>`
  font-size: 24px;
  font-weight: bold;
  color: ${({ isBust, isBlackjack }) => 
    isBust ? '#ef4444' : isBlackjack ? '#fbbf24' : '#4ade80'
  };
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
`

const ControlSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const SectionTitle = styled.h3`
  color: #f0f0ff;
  margin: 0;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #374151;
  padding-bottom: 8px;
`

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  width: 100%;
  
  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          
          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
          }
        `;
      case 'secondary':
        return `
          background: rgba(107, 114, 128, 0.2);
          color: #d1d5db;
          border: 1px solid #374151;
          
          &:hover {
            background: rgba(107, 114, 128, 0.3);
          }
        `;
      case 'danger':
        return `
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          color: white;
          
          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #374151;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.3);
  color: #e5e5e5;
  font-size: 14px;
  cursor: pointer;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: #4f46e5;
  }
  
  option {
    background: #1a1a2e;
    color: #e5e5e5;
  }
`

const StatusDisplay = styled.div`
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #374151;
`

const StatusItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #d1d5db;
  font-size: 14px;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`

const CenterInfo = styled.div`
  text-align: center;
  color: #f0f0ff;
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  margin: 20px 0;
`

// Types
interface DebugCard {
  suit: string
  rank: string
  value: number
}

interface DebugPlayer {
  name: string
  cards: DebugCard[]
  handValue: number
  isBust: boolean
  isBlackjack: boolean
  bet: number
}

// Card generation (matching original BlackJack pattern)
const CARD_VALUES = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10] // A, 2-10, J, Q, K
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const SUITS = ['♠', '♥', '♦', '♣']

const createCard = (rankIndex?: number, suitIndex?: number): DebugCard => {
  const rank = rankIndex !== undefined ? rankIndex : Math.floor(Math.random() * RANKS.length)
  const suit = suitIndex !== undefined ? suitIndex : Math.floor(Math.random() * SUITS.length)
  
  return {
    rank: RANKS[rank],
    suit: SUITS[suit],
    value: CARD_VALUES[rank]
  }
}

function calculateHandValue(cards: DebugCard[]): number {
  let value = 0
  let aces = 0
  
  for (const card of cards) {
    if (card.rank === 'A') {
      aces++
      value += 11
    } else {
      value += card.value
    }
  }
  
  // Handle aces
  while (value > 21 && aces > 0) {
    value -= 10
    aces--
  }
  
  return value
}

const generateBlackjackHand = (): DebugCard[] => {
  const aceCard = createCard(0) // Ace
  const tenCards = [9, 10, 11, 12] // 10, J, Q, K
  const tenCard = createCard(tenCards[Math.floor(Math.random() * tenCards.length)])
  return [aceCard, tenCard]
}

const generateWinningHand = (): DebugCard[] => {
  const values = [17, 18, 19, 20, 21]
  const targetValue = values[Math.floor(Math.random() * values.length)]
  
  for (let attempts = 0; attempts < 100; attempts++) {
    const card1 = createCard()
    const card2 = createCard()
    const hand = [card1, card2]
    if (calculateHandValue(hand) === targetValue) {
      return hand
    }
  }
  
  // Fallback
  return targetValue === 21 ? generateBlackjackHand() : [createCard(1), createCard(targetValue - 2)]
}

export default function DebugGameScreen({ onBack }: { onBack: () => void }) {
  const [players, setPlayers] = useState<DebugPlayer[]>([
    { name: 'Player 1', cards: [], handValue: 0, isBust: false, isBlackjack: false, bet: 100 },
    { name: 'Player 2', cards: [], handValue: 0, isBust: false, isBlackjack: false, bet: 100 }
  ])
  const [currentPlayer, setCurrentPlayer] = useState(0)
  const [gamePhase, setGamePhase] = useState<'setup' | 'playing' | 'finished'>('setup')
  const [selectedPreset, setSelectedPreset] = useState<string>('random')
  
  const sounds = useSound({
    card: cardSnd,
    win: winSnd,
    win2: win2Snd,
    lose: loseSnd,
    play: playSnd,
  })

  const dealRandomCard = (playerIndex: number) => {
    const newCard = createCard()
    
    const updatedPlayers = [...players]
    updatedPlayers[playerIndex].cards.push(newCard)
    updatedPlayers[playerIndex].handValue = calculateHandValue(updatedPlayers[playerIndex].cards)
    updatedPlayers[playerIndex].isBust = updatedPlayers[playerIndex].handValue > 21
    updatedPlayers[playerIndex].isBlackjack = 
      updatedPlayers[playerIndex].handValue === 21 && updatedPlayers[playerIndex].cards.length === 2
    
    setPlayers(updatedPlayers)
    sounds.play('card')
  }

  const generatePresetHand = (playerIndex: number, preset: string) => {
    let newCards: DebugCard[] = []
    
    switch (preset) {
      case 'blackjack':
        newCards = generateBlackjackHand()
        break
      case 'winning':
        newCards = generateWinningHand()
        break
      case 'bust':
        newCards = [createCard(9), createCard(9)] // Two 10s = 20, then add one more
        setTimeout(() => dealRandomCard(playerIndex), 100)
        break
      case 'lowhand':
        newCards = [createCard(1), createCard(2)] // 2 + 3 = 5
        break
      default:
        dealRandomCard(playerIndex)
        return
    }
    
    const updatedPlayers = [...players]
    updatedPlayers[playerIndex].cards = newCards
    updatedPlayers[playerIndex].handValue = calculateHandValue(newCards)
    updatedPlayers[playerIndex].isBust = updatedPlayers[playerIndex].handValue > 21
    updatedPlayers[playerIndex].isBlackjack = 
      updatedPlayers[playerIndex].handValue === 21 && newCards.length === 2
    
    setPlayers(updatedPlayers)
    sounds.play('card')
  }

  const simulateDuel = () => {
    const winner = Math.random() < 0.5 ? 0 : 1
    const loser = winner === 0 ? 1 : 0
    
    // Generate winner's hand
    const winnerCards = Math.random() < 0.3 ? generateBlackjackHand() : generateWinningHand()
    const winnerValue = calculateHandValue(winnerCards)
    
    // Generate loser's hand (lower value or bust)
    let loserCards: DebugCard[] = []
    for (let attempts = 0; attempts < 100; attempts++) {
      const card1 = createCard()
      const card2 = createCard()
      const testCards = [card1, card2]
      const testValue = calculateHandValue(testCards)
      
      if (testValue < winnerValue || testValue > 21) {
        loserCards = testCards
        break
      }
    }
    
    const updatedPlayers = [...players]
    
    updatedPlayers[winner].cards = winnerCards
    updatedPlayers[winner].handValue = winnerValue
    updatedPlayers[winner].isBlackjack = winnerValue === 21 && winnerCards.length === 2
    updatedPlayers[winner].isBust = false
    
    updatedPlayers[loser].cards = loserCards
    updatedPlayers[loser].handValue = calculateHandValue(loserCards)
    updatedPlayers[loser].isBust = updatedPlayers[loser].handValue > 21
    updatedPlayers[loser].isBlackjack = false
    
    setPlayers(updatedPlayers)
    setGamePhase('finished')
    sounds.play(updatedPlayers[winner].isBlackjack ? 'win2' : 'win')
  }

  const clearPlayerCards = (playerIndex: number) => {
    const updatedPlayers = [...players]
    updatedPlayers[playerIndex].cards = []
    updatedPlayers[playerIndex].handValue = 0
    updatedPlayers[playerIndex].isBust = false
    updatedPlayers[playerIndex].isBlackjack = false
    
    setPlayers(updatedPlayers)
  }

  const resetGame = () => {
    setPlayers([
      { name: 'Player 1', cards: [], handValue: 0, isBust: false, isBlackjack: false, bet: 100 },
      { name: 'Player 2', cards: [], handValue: 0, isBust: false, isBlackjack: false, bet: 100 }
    ])
    setCurrentPlayer(0)
    setGamePhase('setup')
  }

  const getGameResult = () => {
    const [p1, p2] = players
    
    if (p1.isBust && p2.isBust) return 'Both bust - Draw!'
    if (p1.isBust) return 'Player 2 wins!'
    if (p2.isBust) return 'Player 1 wins!'
    
    if (p1.isBlackjack && !p2.isBlackjack) return 'Player 1 wins with Blackjack!'
    if (p2.isBlackjack && !p1.isBlackjack) return 'Player 2 wins with Blackjack!'
    
    if (p1.handValue > p2.handValue) return 'Player 1 wins!'
    if (p2.handValue > p1.handValue) return 'Player 2 wins!'
    return 'Draw!'
  }

  const allPlayersReady = players.every(p => p.cards.length >= 2)

  return (
    <DebugWrapper>
      <Header>
        <Title>🐞 BlackJack Debug Mode</Title>
        <BackButton onClick={onBack}>← Back to Lobby</BackButton>
      </Header>
      
      <DebugGrid>
        <GameArea>
          {/* Player 2 Area */}
          <PlayerArea isActive={currentPlayer === 1 && gamePhase === 'playing'}>
            <PlayerName>{players[1].name}</PlayerName>
            <CardsArea>
              {players[1].cards.map((card, index) => (
                <Card key={index} card={card} />
              ))}
            </CardsArea>
            <HandValue isBust={players[1].isBust} isBlackjack={players[1].isBlackjack}>
              Value: {players[1].handValue}
              {players[1].isBlackjack && ' (Blackjack!)'}
              {players[1].isBust && ' (Bust)'}
            </HandValue>
          </PlayerArea>

          <CenterInfo>
            {gamePhase === 'setup' && <div>Use debug controls to set up the duel scenario</div>}
            {gamePhase === 'playing' && !allPlayersReady && (
              <div>Setting up cards...</div>
            )}
            {(gamePhase === 'finished' || allPlayersReady) && (
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {getGameResult()}
              </div>
            )}
          </CenterInfo>

          {/* Player 1 Area */}
          <PlayerArea isActive={currentPlayer === 0 && gamePhase === 'playing'}>
            <PlayerName>{players[0].name}</PlayerName>
            <CardsArea>
              {players[0].cards.map((card, index) => (
                <Card key={index} card={card} />
              ))}
            </CardsArea>
            <HandValue isBust={players[0].isBust} isBlackjack={players[0].isBlackjack}>
              Value: {players[0].handValue}
              {players[0].isBlackjack && ' (Blackjack!)'}
              {players[0].isBust && ' (Bust)'}
            </HandValue>
          </PlayerArea>
        </GameArea>

        <ControlPanel>
          <ControlSection>
            <SectionTitle>Game Controls</SectionTitle>
            <Button onClick={simulateDuel}>
              🃏 Simulate Duel
            </Button>
            <Button onClick={resetGame} variant="danger">
              Reset Game
            </Button>
            <Button 
              onClick={() => setCurrentPlayer(currentPlayer === 0 ? 1 : 0)}
              variant="secondary"
            >
              Switch Active Player
            </Button>
          </ControlSection>

          <ControlSection>
            <SectionTitle>Hand Presets</SectionTitle>
            <Select
              value={selectedPreset}
              onChange={(e) => setSelectedPreset(e.target.value)}
            >
              <option value="random">Random Hand</option>
              <option value="blackjack">Blackjack (21)</option>
              <option value="winning">Winning Hand (17-20)</option>
              <option value="bust">Bust Hand (22+)</option>
              <option value="lowhand">Low Hand (5)</option>
            </Select>
            <Button 
              onClick={() => generatePresetHand(0, selectedPreset)}
            >
              Give to Player 1
            </Button>
            <Button 
              onClick={() => generatePresetHand(1, selectedPreset)}
            >
              Give to Player 2
            </Button>
          </ControlSection>

          <ControlSection>
            <SectionTitle>Individual Cards</SectionTitle>
            <Button onClick={() => dealRandomCard(0)}>
              Deal Random to Player 1
            </Button>
            <Button onClick={() => dealRandomCard(1)}>
              Deal Random to Player 2
            </Button>
            <Button onClick={() => clearPlayerCards(0)} variant="danger">
              Clear Player 1 Cards
            </Button>
            <Button onClick={() => clearPlayerCards(1)} variant="danger">
              Clear Player 2 Cards
            </Button>
          </ControlSection>

          <ControlSection>
            <SectionTitle>Game Status</SectionTitle>
            <StatusDisplay>
              <StatusItem>
                <span>Phase:</span>
                <span style={{ textTransform: 'capitalize' }}>{gamePhase}</span>
              </StatusItem>
              <StatusItem>
                <span>Active Player:</span>
                <span>{players[currentPlayer].name}</span>
              </StatusItem>
              <StatusItem>
                <span>P1 Hand:</span>
                <span>
                  {players[0].cards.length} cards
                  {players[0].isBlackjack ? ' (Blackjack!)' : ''}
                  {players[0].isBust ? ' (Bust)' : ''}
                </span>
              </StatusItem>
              <StatusItem>
                <span>P2 Hand:</span>
                <span>
                  {players[1].cards.length} cards
                  {players[1].isBlackjack ? ' (Blackjack!)' : ''}
                  {players[1].isBust ? ' (Bust)' : ''}
                </span>
              </StatusItem>
              <StatusItem>
                <span>Result:</span>
                <span>{allPlayersReady ? getGameResult() : 'Not ready'}</span>
              </StatusItem>
            </StatusDisplay>
          </ControlSection>
        </ControlPanel>
      </DebugGrid>
    </DebugWrapper>
  )
}
