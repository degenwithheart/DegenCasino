// src/components/Lobby.tsx
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  border: 1px solid #202533;
  border-radius: 12px;
  padding: 16px;
  background: rgba(24, 24, 24, 0.95);
  backdrop-filter: blur(10px);
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const Button = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
`
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`
const TH = styled.th`
  text-align: left;
  padding: 8px 12px;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  border-bottom: 1px solid #333;
`
const TR = styled.tr<{ $clickable?: boolean }>`
  &:hover {
    background: ${({ $clickable }) => ($clickable ? '#a2a2a26c' : 'inherit')};
  }
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
`
const TD = styled.td`
  padding: 10px 12px;
  font-size: 0.95rem;
  border-bottom: 3px solid #222;
`

// Helper component to render bet amounts using TokenValue
function BetLabel({ wagerType, wager, minBet, maxBet, token }: any) {
  if ('sameWager' in wagerType) {
    return <TokenValue amount={wager.toNumber()} />
  } else if ('customWager' in wagerType) {
    return <span>Unlimited</span>
  } else {
    return (
      <span>
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
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '20px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <Wrapper>
          <Header>
            <h1>Plinko Race Lobby</h1>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                onClick={() => setShowCreateModal(true)}
                disabled={isFreeToken}
                style={{
                  background: isFreeToken ? '#666' : '#4caf50',
                  color: '#fff',
                  border: 'none',
                  opacity: isFreeToken ? 0.5 : 1,
                  cursor: isFreeToken ? 'not-allowed' : 'pointer',
                }}
                title={isFreeToken ? 'Multiplayer games require real tokens' : 'Create a new game'}
              >
                Create Game
              </Button>
              <Button
                onClick={() => {
                  const wasMuted = musicManager.muted
                  toggleMuted()
                }}
                style={{
                  background: '#333',
                  color: '#fff',
                  border: '1px solid #555',
                }}
              >
                🔇
              </Button>
              <Button
                onClick={onDebug}
                style={{
                  background: '#ff6b35',
                  color: '#fff',
                  border: 'none',
                }}
              >
                Debug
              </Button>
            </div>
          </Header>

          {isFreeToken && (
            <div style={{
              background: 'rgba(255, 193, 7, 0.1)',
              border: '1px solid rgba(255, 193, 7, 0.3)',
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#ffc107',
              fontSize: '0.9rem',
              textAlign: 'center',
              marginBottom: '16px'
            }}>
              ⚠️ PlinkoRace is a multiplayer game that requires real tokens. Please select a live token to create or join games.
            </div>
          )}

          <Table>
            <thead>
              <tr>
                <TH>ID</TH>
                <TH>Maker</TH>
                <TH>Players</TH>
                <TH>Bet</TH>
                <TH>Starts In</TH>
              </tr>
            </thead>
            <tbody>
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
                const startsIn = state.waiting
                  ? msLeft > 0
                    ? (
                      <span style={{ color: '#FFD700', fontWeight: 'bold' }}>
                        {formatDuration(msLeft)}
                      </span>
                    )
                    : (
                      <span style={{ color: '#00FF99', fontWeight: 'bold' }}>
                        Ready to start
                      </span>
                    )
                  : state.started
                    ? (
                      <span style={{ color: '#FF6B35', fontWeight: 'bold' }}>
                        In Progress
                      </span>
                    )
                    : (
                      <span style={{ color: '#888', fontWeight: 'bold' }}>
                        Ended
                      </span>
                    )

                return (
                  <TR
                    key={gameId}
                    $clickable={state.waiting && !isFreeToken}
                    onClick={() => {
                      if (state.waiting && !isFreeToken) {
                        onSelect(gameId)
                      }
                    }}
                  >
                    <TD>{shorten(gameId)}</TD>
                    <TD>{shorten(gameMaker)}</TD>
                    <TD>
                      {players.length} / {maxPlayers}
                    </TD>
                    <TD>
                      <BetLabel 
                        wagerType={wagerType}
                        wager={wager}
                        minBet={minBet}
                        maxBet={maxBet}
                        token={token}
                      />
                    </TD>
                    <TD>{startsIn}</TD>
                  </TR>
                )
              })}
            </tbody>
          </Table>

          {games.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#888',
                fontSize: '1.1rem',
              }}
            >
              No active games. Be the first to create one!
            </div>
          )}
        </Wrapper>

        {showCreateModal && (
          <CreateGameModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
        )}
      </div>
    </>
  )
}

export default Lobby
