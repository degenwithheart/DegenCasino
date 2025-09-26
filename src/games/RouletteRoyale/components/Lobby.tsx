import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { PublicKey } from '@solana/web3.js'
import { useSpecificGames } from 'gamba-react-v2'
import { useSound, useCurrentToken, TokenValue, FAKE_TOKEN_MINT, GambaUi } from 'gamba-react-ui-v2'
import CreateGameModal from './CreateGameModal'
import { SOUND_PLAY, CONFIG } from '../constants'

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
  text-align: center;
  background: linear-gradient(45deg, #ffd700, #ff6b6b, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${glowPulse} 3s ease-in-out infinite;
`

const Subtitle = styled.p`
  font-size: 1rem;
  margin-bottom: 30px;
  text-align: center;
  opacity: 0.8;
  max-width: 600px;
  line-height: 1.6;
`

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 30px;
`

const GameCard = styled.div`
  background: linear-gradient(135deg, rgba(139, 69, 19, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(255, 215, 0, 0.6);
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }
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

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  opacity: 0.7;
`

// Helper functions
const shorten = (pk: PublicKey) => pk.toBase58().slice(0, 4) + '...'
const formatDuration = (ms: number) => {
  const total = Math.ceil(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2,'0')}`
}

interface LobbyProps {
  onGameSelect: (pubkey: PublicKey) => void
  onDebug: () => void
}

function RouletteRoyaleLobby({ onGameSelect, onDebug }: LobbyProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { games } = useSpecificGames({
    creator: new PublicKey('DP1uxUKbZPhFh1BTPfAHgBLsRc8gNPj3DhBNXQbdxuFM') // Use same creator as PlinkoRace
  })
  const token = useCurrentToken()
  const sounds = useSound({ play: SOUND_PLAY })
  const isFreeToken = token.mint.equals(FAKE_TOKEN_MINT)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filter active games for roulette royale
  const activeGames = games.filter(g => {
    // Filter out games that might be using free tokens
    const mint = (g.account as any)?.mint
    if (mint && mint.equals && mint.equals(FAKE_TOKEN_MINT)) {
      return false
    }
    const state = (g.account as any)?.state
    return state?.waiting || state?.started
  }).slice(0, 12) // Limit display

  const handleCreateGame = () => {
    if (isFreeToken) {
      // Show error or notification about needing real tokens
      return
    }
    sounds.play('play')
    setShowCreateModal(true)
  }

  const handleGameSelect = (pubkey: PublicKey) => {
    sounds.play('play')
    onGameSelect(pubkey)
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <LobbyContainer>
          <Title>🎰 ROULETTE ROYALE</Title>
          <Subtitle>
            Experience the thrill of multiplayer roulette! Join existing games or create your own table. 
            Place your bets, spin the wheel, and compete for the ultimate prize!
          </Subtitle>

          {loading && (
            <div style={{ padding: '40px', fontSize: '1.1rem' }}>
              🔄 Loading games...
            </div>
          )}

          {error && (
            <div style={{ padding: '40px', fontSize: '1.1rem', color: '#ff6b6b' }}>
              ❌ Error loading games: {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {activeGames.length > 0 ? (
                <GameGrid>
                  {activeGames.map((g) => {
                    const { gameId, gameMaker, players, maxPlayers, wagerType, wager, minBet, maxBet, softExpirationTimestamp, state } = g.account as any;
                    return (
                      <GameCard
                        key={gameId}
                        onClick={() => handleGameSelect(gameId)}
                      >
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          marginBottom: '15px'
                        }}>
                          <h3 style={{ margin: 0, color: '#ffd700' }}>
                            Table {shorten(gameId)}
                          </h3>
                          <span style={{ 
                            background: state.waiting ? '#4caf50' : '#ff9800',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.8rem'
                          }}>
                            {state.waiting ? 'Open' : 'Playing'}
                          </span>
                        </div>
                        
                        <div style={{ marginBottom: '10px' }}>
                          <strong>Players:</strong> {players.length}/{maxPlayers}
                        </div>
                        
                        <div style={{ marginBottom: '10px' }}>
                          <strong>Wager:</strong> <TokenValue amount={wager} />
                        </div>
                        
                        {state.waiting && (
                          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                            ⏱️ Betting opens when game starts
                          </div>
                        )}
                        
                        {state.playing && (
                          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                            🎲 Game in progress...
                          </div>
                        )}
                      </GameCard>
                    );
                  })}
                </GameGrid>
              ) : (
                <EmptyState>
                  <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎰</div>
                  <h3>No Active Games</h3>
                  <p>Be the first to create a Roulette Royale table!</p>
                </EmptyState>
              )}
            </>
          )}
        </LobbyContainer>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '15px',
          padding: '20px' 
        }}>
          <CreateButton 
            onClick={handleCreateGame}
            disabled={isFreeToken || loading}
          >
            {isFreeToken ? 'Real Tokens Required' : '+ Create New Table'}
          </CreateButton>
          <CreateButton 
            onClick={onDebug}
            style={{ background: 'linear-gradient(45deg, #ff9800, #f57c00)' }}
          >
            🛠️ Debug
          </CreateButton>
        </div>
      </GambaUi.Portal>

      {showCreateModal && (
        <CreateGameModal 
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </>
  )
}

export default RouletteRoyaleLobby
