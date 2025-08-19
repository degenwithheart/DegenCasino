import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { PublicKey } from '@solana/web3.js'
import { useSpecificGames } from 'gamba-react-v2'
import { useSound, useCurrentToken, TokenValue, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { CreateGameModal } from './'
import lobbymusicSnd from '../sounds/coin.mp3'

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
  margin: 20px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`

const Title = styled.h2`
  color: #f0f0ff;
  margin: 0;
  font-size: 24px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
`

const Subtitle = styled.p`
  color: #d0d0ea;
  margin: 0;
  font-size: 14px;
  opacity: 0.8;
`

const Button = styled.button`
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  border: none;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
`

const TH = styled.th`
  text-align: left;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  background: rgba(79, 70, 229, 0.2);
  color: #e5e5ff;
  border-bottom: 1px solid #333;
`

const TR = styled.tr<{ $clickable?: boolean }>`
  &:hover {
    background: ${({ $clickable }) => ($clickable ? 'rgba(79, 70, 229, 0.1)' : 'inherit')};
  }
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  transition: background 0.2s ease;
`

const TD = styled.td`
  padding: 12px 16px;
  font-size: 0.95rem;
  border-bottom: 1px solid #333;
  color: #e5e5e5;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
  
  h3 {
    margin: 0 0 8px 0;
    color: #d1d5db;
  }
  
  p {
    margin: 0;
    opacity: 0.8;
  }
`

const StatusBadge = styled.span<{ status: 'waiting' | 'active' | 'finished' }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${({ status }) => {
    switch (status) {
      case 'waiting':
        return `
          background: rgba(234, 179, 8, 0.2);
          color: #fbbf24;
          border: 1px solid rgba(234, 179, 8, 0.3);
        `;
      case 'active':
        return `
          background: rgba(34, 197, 94, 0.2);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.3);
        `;
      case 'finished':
        return `
          background: rgba(107, 114, 128, 0.2);
          color: #9ca3af;
          border: 1px solid rgba(107, 114, 128, 0.3);
        `;
    }
  }}
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

export default function Lobby({ onSelect, onDebug }: { 
  onSelect: (pk: PublicKey) => void 
  onDebug?: () => void 
}) {
  const token = useCurrentToken()
  const [showCreateModal, setShowCreateModal] = useState(false)
  
  // Fetch games for Flip-v1 (we'll use a specific creator or filter)
  const { games, loading } = useSpecificGames({
    creator: undefined, // We can filter by a specific creator if needed
  })

  // Filter for flip games - in a real implementation, you'd have metadata to identify flip games
  const flipGames = games.filter((game: any) => {
    // This is a placeholder - you'd implement proper game type identification
    return true
  })

  const sounds = useSound({
    lobby: lobbymusicSnd,
  })

  useEffect(() => {
    sounds.play('lobby')
    return () => {
      // Clean up sound when component unmounts
    }
  }, [])

  const getGameStatus = (game: any) => {
    if (game.state.settled) return 'finished'
    if (game.players.length >= 2) return 'active'
    return 'waiting'
  }

  const canJoinGame = (game: any) => {
    const status = getGameStatus(game)
    return status === 'waiting' && game.players.length < 2
  }

  return (
    <Wrapper>
      <Header>
        <div>
          <Title>🪙 Flip Duel Lobby</Title>
          <Subtitle>Join a 1v1 coin flip battle or create your own duel</Subtitle>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {onDebug && (
            <Button onClick={onDebug} style={{ background: 'rgba(107, 114, 128, 0.2)' }}>
              🐞 Debug
            </Button>
          )}
          <Button onClick={() => setShowCreateModal(true)}>
            Create New Duel
          </Button>
        </div>
      </Header>

      {flipGames.length === 0 ? (
        <EmptyState>
          <h3>🌙 The arena stands empty</h3>
          <p>No duels are currently active. Be the first to cast your silver into the void!</p>
        </EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <TH>Game</TH>
              <TH>Creator</TH>
              <TH>Bet Amount</TH>
              <TH>Players</TH>
              <TH>Status</TH>
              <TH>Time Left</TH>
            </tr>
          </thead>
          <tbody>
            {flipGames.map((game: any, index: number) => {
              const status = getGameStatus(game)
              const clickable = canJoinGame(game)
              
              return (
                <TR
                  key={game.publicKey.toString()}
                  $clickable={clickable}
                  onClick={() => clickable && onSelect(game.publicKey)}
                >
                  <TD>Flip Duel #{index + 1}</TD>
                  <TD>{shorten(game.creator)}</TD>
                  <TD>
                    <BetLabel
                      wagerType={game.wagerType}
                      wager={game.wager}
                      minBet={game.minBet}
                      maxBet={game.maxBet}
                      token={token}
                    />
                  </TD>
                  <TD>{game.players.length}/2</TD>
                  <TD>
                    <StatusBadge status={status}>
                      {status}
                    </StatusBadge>
                  </TD>
                  <TD>
                    {game.softExpirationTimestamp
                      ? formatDuration(Number(game.softExpirationTimestamp) * 1000 - Date.now())
                      : '∞'
                    }
                  </TD>
                </TR>
              )
            })}
          </tbody>
        </Table>
      )}

      {showCreateModal && (
        <CreateGameModal
          onClose={() => setShowCreateModal(false)}
          onGameCreated={(pk: PublicKey) => {
            setShowCreateModal(false)
            onSelect(pk)
          }}
        />
      )}
    </Wrapper>
  )
}
