import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { PublicKey, Keypair } from '@solana/web3.js'
import { useSound, useCurrentToken, TokenValue, FAKE_TOKEN_MINT, GambaUi } from 'gamba-react-ui-v2'
import CreateGameModal from './CreateGameModal'
import { SOUND_PLAY } from '../constants'

// Styled components
const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2);
  }
`

const LobbyContainer = styled.div`
  padding: 20px;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  background: radial-gradient(ellipse at center, rgba(139, 69, 19, 0.3) 0%, rgba(0, 0, 0, 0.8) 70%);
`

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`

const Subtitle = styled.p`
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 30px;
  opacity: 0.9;
  max-width: 600px;
  line-height: 1.6;
`

const ActionRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`

const CreateButton = styled.button`
  background: linear-gradient(45deg, #ff6b6b, #ffd700);
  border: none;
  padding: 15px 30px;
  border-radius: 10px;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${glowPulse} 3s ease-in-out infinite;

  &:hover {
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    animation: none;
  }
`

const DebugButton = styled.button`
  background: linear-gradient(45deg, #4CAF50, #45a049);
  border: none;
  padding: 15px 30px;
  border-radius: 10px;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    background: linear-gradient(45deg, #45a049, #3d8b40);
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  opacity: 0.7;
`

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;
`

const GameCard = styled.div`
  background: rgba(139, 69, 19, 0.2);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 15px;
  padding: 20px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 215, 0, 0.6);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
`

const GameTitle = styled.h3`
  color: #ffd700;
  margin: 0 0 10px 0;
  font-size: 1.2rem;
`

const GameInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.9rem;
  opacity: 0.8;
`

const PlayersCount = styled.span`
  color: #4CAF50;
  font-weight: bold;
`

const JoinButton = styled.button`
  background: linear-gradient(45deg, #4CAF50, #45a049);
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`

const DebugBadge = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(76, 175, 80, 0.9);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
  z-index: 1000;
`

// Helper functions
const shorten = (pk: PublicKey) => pk.toBase58().slice(0, 4) + '...'

interface LobbyProps {
  onGameSelect: (pubkey: PublicKey) => void
  onDebug: () => void
  onBackToRealLobby?: () => void
}

// Generate fake games for debug mode
const generateFakeGames = () => {
  const games = []
  const gameStates = ['waiting', 'started', 'betting']
  const gameNames = [
    'High Rollers Table',
    'Beginner\'s Luck',
    'VIP Diamond Room',
    'Speed Betting Arena',
    'Classic European',
    'American Style',
  ]

  for (let i = 0; i < 6; i++) {
    const keypair = Keypair.generate()
    games.push({
      pubkey: keypair.publicKey,
      account: {
        state: gameStates[i % gameStates.length],
        players: Math.floor(Math.random() * 8) + 1,
        maxPlayers: 8,
        pot: (Math.random() * 10 + 1).toFixed(2),
        timeLeft: Math.floor(Math.random() * 30000) + 10000,
        name: gameNames[i] || `Table ${i + 1}`,
        creator: Keypair.generate().publicKey,
      }
    })
  }
  return games
}

function DebugLobby({ onGameSelect, onDebug, onBackToRealLobby }: LobbyProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [fakeGames] = useState(() => generateFakeGames())
  const sounds = useSound({ play: SOUND_PLAY })

  const handleCreateGame = () => {
    sounds.play('play')
    setShowCreateModal(true)
  }

  const handleGameSelect = (pubkey: PublicKey) => {
    sounds.play('play')
    onGameSelect(pubkey)
  }

  return (
    <>
      <DebugBadge>🔧 DEBUG MODE</DebugBadge>
      <GambaUi.Portal target="screen">
        <LobbyContainer>
          <Title>🎰 ROULETTE ROYALE</Title>
          <Subtitle>
            Experience the thrill of multiplayer roulette! Join existing games or create your own table. 
            Place your bets, spin the wheel, and compete for the ultimate prize!
            <br />
            <strong>Debug Mode:</strong> All games below are simulated for testing purposes.
          </Subtitle>

          <ActionRow>
            <CreateButton onClick={handleCreateGame}>
              🎲 Create New Game
            </CreateButton>
            <DebugButton onClick={onDebug}>
              🎮 Start Debug Game
            </DebugButton>
            {onBackToRealLobby && (
              <DebugButton 
                onClick={onBackToRealLobby}
                style={{ background: 'linear-gradient(45deg, #2196F3, #1976D2)' }}
              >
                🔙 Real Lobby
              </DebugButton>
            )}
          </ActionRow>

          {fakeGames.length > 0 ? (
            <GameGrid>
              {fakeGames.map((game) => (
                <GameCard key={game.pubkey.toBase58()} onClick={() => handleGameSelect(game.pubkey)}>
                  <GameTitle>{game.account.name}</GameTitle>
                  <GameInfo>
                    <span>Creator: {shorten(game.account.creator)}</span>
                    <PlayersCount>{game.account.players}/{game.account.maxPlayers} players</PlayersCount>
                  </GameInfo>
                  <GameInfo>
                    <span>Pot: {game.account.pot} SOL</span>
                    <span>Status: {game.account.state}</span>
                  </GameInfo>
                  <JoinButton>
                    {game.account.state === 'waiting' ? 'Join Game' : 'Watch Game'}
                  </JoinButton>
                </GameCard>
              ))}
            </GameGrid>
          ) : (
            <EmptyState>
              <h3>No Active Games</h3>
              <p>Be the first to create a Roulette Royale game!</p>
            </EmptyState>
          )}
        </LobbyContainer>
      </GambaUi.Portal>

      {showCreateModal && (
        <CreateGameModal 
          onClose={() => setShowCreateModal(false)}
          onCreate={() => {
            setShowCreateModal(false)
            // In debug mode, just start a debug game
            onDebug()
          }}
        />
      )}
    </>
  )
}

export default DebugLobby