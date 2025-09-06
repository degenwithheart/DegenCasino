// src/components/Lobby.tsx
import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { PublicKey } from '@solana/web3.js'
import { useSpecificGames } from 'gamba-react-v2'
import { useSound, useCurrentToken, TokenValue, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import CreateGameModal from './CreateGameModal'
import lobbymusicSnd from '../sounds/lobby.mp3'
import {
  musicManager,
  attachMusic,
  stopAndDispose,
  toggleMuted,
} from '../musicManager'

const shorten = (pk: PublicKey) =>
  pk.toBase58().slice(0, 4) + '...'
const formatDuration = (ms: number) => {
  const total = Math.ceil(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2,'0')}`
}

// Animations
const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2);
  }
`

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

// Styled Components
const LobbyContainer = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 32px;
  background: linear-gradient(135deg, rgba(24, 24, 24, 0.95) 0%, rgba(40, 40, 40, 0.95) 100%);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  animation: ${slideIn} 0.6s ease-out;
`

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(162, 89, 255, 0.1) 100%);
  border-radius: 16px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  animation: ${glowPulse} 3s ease-in-out infinite;
`

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffd700 0%, #a259ff 50%, #ff9500 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`

const StyledButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  position: relative;
  overflow: hidden;

  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
          color: #fff;
          box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
          }
        `
      case 'secondary':
        return `
          background: linear-gradient(135deg, #333 0%, #555 100%);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          &:hover {
            background: linear-gradient(135deg, #555 0%, #777 100%);
            transform: translateY(-2px);
          }
        `
      case 'danger':
        return `
          background: linear-gradient(135deg, #ff6b35 0%, #ff5722 100%);
          color: #fff;
          box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
          }
        `
      default:
        return `
          background: linear-gradient(135deg, #ffd700 0%, #ffb300 100%);
          color: #000;
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
          }
        `
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`

const WarningBanner = styled.div`
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 152, 0, 0.1) 100%);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 12px;
  padding: 16px 20px;
  color: #ffc107;
  font-size: 1rem;
  text-align: center;
  margin: 16px 0;
  animation: ${float} 2s ease-in-out infinite;
`

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  padding: 0 8px;
`

const GameCard = styled.div<{ clickable?: boolean; status?: 'waiting' | 'started' | 'ended' }>`
  background: linear-gradient(135deg, rgba(24, 24, 24, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  transition: all 0.3s ease;
  cursor: ${({ clickable }) => clickable ? 'pointer' : 'default'};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ status }) => {
      switch (status) {
        case 'waiting': return 'linear-gradient(90deg, #4caf50, #45a049)';
        case 'started': return 'linear-gradient(90deg, #ff6b35, #ff5722)';
        case 'ended': return 'linear-gradient(90deg, #666, #555)';
        default: return 'linear-gradient(90deg, #ffd700, #ffb300)';
      }
    }};
  }

  &:hover {
    ${({ clickable }) => clickable ? `
      transform: translateY(-8px);
      box-shadow: 0 12px 32px rgba(255, 215, 0, 0.2);
      border-color: rgba(255, 215, 0, 0.4);
    ` : ''}
  }

  animation: ${slideIn} 0.6s ease-out;
  animation-fill-mode: both;
`

const GameId = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffd700;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '🎯';
    font-size: 1.5rem;
  }
`

const GameInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
`

const InfoLabel = styled.span`
  color: #ccc;
  font-weight: 500;
`

const InfoValue = styled.span`
  color: #fff;
  font-weight: 600;
`

const StatusBadge = styled.div<{ status: 'waiting' | 'started' | 'ended' }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  ${({ status }) => {
    switch (status) {
      case 'waiting':
        return `
          background: linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(69, 160, 73, 0.2) 100%);
          color: #4caf50;
          border: 1px solid rgba(76, 175, 80, 0.3);
        `
      case 'started':
        return `
          background: linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(255, 87, 34, 0.2) 100%);
          color: #ff6b35;
          border: 1px solid rgba(255, 107, 53, 0.3);
        `
      case 'ended':
        return `
          background: linear-gradient(135deg, rgba(102, 102, 102, 0.2) 0%, rgba(85, 85, 85, 0.2) 100%);
          color: #888;
          border: 1px solid rgba(102, 102, 102, 0.3);
        `
    }
  }}
`

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #888;
  font-size: 1.2rem;
  background: linear-gradient(135deg, rgba(24, 24, 24, 0.8) 0%, rgba(40, 40, 40, 0.8) 100%);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${float} 3s ease-in-out infinite;

  &::before {
    content: '🎲';
    font-size: 3rem;
    display: block;
    margin-bottom: 16px;
    opacity: 0.5;
  }
`

// Helper component to render bet amounts using TokenValue
function BetLabel({ wagerType, wager, minBet, maxBet, token }: any) {
  if ('sameWager' in wagerType) {
    return <TokenValue amount={wager.toNumber()} />
  } else if ('customWager' in wagerType) {
    return <span style={{ color: '#ffd700', fontWeight: 'bold' }}>Unlimited</span>
  } else {
    return (
      <span style={{ color: '#00ff88', fontWeight: 'bold' }}>
        <TokenValue amount={minBet.toNumber()} /> – <TokenValue amount={maxBet.toNumber()} />
      </span>
    )
  }
}

interface LobbyProps {
  onSelect: (game: PublicKey) => void;
  onDebug: () => void;
}

export function Lobby({ onSelect, onDebug }: LobbyProps) {
  const sound = useSound({
    lobby: lobbymusicSnd,
  })
  const { play } = sound
  const token = useCurrentToken()
  const isFreeToken = token.mint.equals(FAKE_TOKEN_MINT)

  const { games } = useSpecificGames({
    creator: new PublicKey('DP1uxUKbZPhFh1BTPfAHgBLsRc8gNPj3DhBNXQbdxuFM')
  })

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const snd = sound.sounds.lobby
    
    if (!musicManager.sound) {
      snd.player.loop = true
      const startWhenReady = () => {
        if (snd.ready) {
          play('lobby')
          attachMusic(snd)
        } else {
          setTimeout(startWhenReady, 100)
        }
      }
      startWhenReady()
    }

    return () => {
      // Don't dispose here
    }
  }, [])

  return (
    <>
      <LobbyContainer>
        <HeaderSection>
          <Title>Plinko Race Lobby</Title>
          <ButtonGroup>
            <StyledButton
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              disabled={isFreeToken}
              title={isFreeToken ? 'Multiplayer games require real tokens' : 'Create a new game'}
            >
              🎯 Create Game
            </StyledButton>
            <StyledButton
              variant="secondary"
              onClick={() => {
                const wasMuted = musicManager.muted
                toggleMuted()
              }}
            >
              🔇
            </StyledButton>
            <StyledButton
              variant="danger"
              onClick={onDebug}
            >
              🛠️ Debug
            </StyledButton>
          </ButtonGroup>
        </HeaderSection>

        {isFreeToken && (
          <WarningBanner>
            ⚠️ PlinkoRace is a multiplayer game that requires real tokens. Please select a live token to create or join games.
          </WarningBanner>
        )}

        <GamesGrid>
          {games.filter(g => {
            // Filter out games that might be using free tokens
            const mint = (g.account as any)?.mint;
            if (mint && mint.equals && mint.equals(FAKE_TOKEN_MINT)) {
              return false;
            }
            return true;
          }).map(g => {
            const {
              gameId,
              gameMaker,
              players,
              maxPlayers,
              wagerType,
              wager,
              minBet,
              maxBet,
              softExpirationTimestamp,
              state,
            } = g.account as any

            const startMs = Number(softExpirationTimestamp) * 1000
            const msLeft = startMs - now
            const isWaiting = state.waiting
            const isStarted = state.started
            const isEnded = !isWaiting && !isStarted

            let status: 'waiting' | 'started' | 'ended' = 'waiting'
            let statusText = ''
            let statusIcon = ''

            if (isWaiting) {
              status = 'waiting'
              statusText = msLeft > 0 ? `Starts in ${formatDuration(msLeft)}` : 'Ready to start'
              statusIcon = msLeft > 0 ? '⏱️' : '🚀'
            } else if (isStarted) {
              status = 'started'
              statusText = 'In Progress'
              statusIcon = '🏁'
            } else {
              status = 'ended'
              statusText = 'Ended'
              statusIcon = '🏆'
            }

            return (
              <GameCard
                key={gameId}
                clickable={isWaiting && !isFreeToken}
                status={status}
                onClick={() => {
                  if (isWaiting && !isFreeToken) {
                    onSelect(gameId)
                  }
                }}
              >
                <GameId>{shorten(gameId)}</GameId>
                
                <GameInfo>
                  <InfoRow>
                    <InfoLabel>Maker:</InfoLabel>
                    <InfoValue>{shorten(gameMaker)}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>Players:</InfoLabel>
                    <InfoValue>{players.length} / {maxPlayers}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>Bet:</InfoLabel>
                    <BetLabel 
                      wagerType={wagerType}
                      wager={wager}
                      minBet={minBet}
                      maxBet={maxBet}
                      token={token}
                    />
                  </InfoRow>
                </GameInfo>

                <StatusBadge status={status}>
                  {statusIcon} {statusText}
                </StatusBadge>
              </GameCard>
            )
          })}
        </GamesGrid>

        {games.length === 0 && (
          <EmptyState>
            No active games. Be the first to create one!
          </EmptyState>
        )}
      </LobbyContainer>

      {showCreateModal && (
        <CreateGameModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
      )}
    </>
  )
}

export default Lobby
