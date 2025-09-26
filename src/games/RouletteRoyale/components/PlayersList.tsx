import React from 'react'
import styled from 'styled-components'
import { PublicKey } from '@solana/web3.js'
import { TokenValue } from 'gamba-react-ui-v2'

const PlayersContainer = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  padding: 15px;
`

const Title = styled.h4`
  color: #ffd700;
  margin: 0 0 15px 0;
  text-align: center;
`

const PlayerItem = styled.div<{ $isCurrentPlayer?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 6px;
  background: ${props => props.$isCurrentPlayer 
    ? 'rgba(255, 215, 0, 0.2)' 
    : 'rgba(255, 255, 255, 0.1)'
  };
  border: 2px solid ${props => props.$isCurrentPlayer 
    ? 'rgba(255, 215, 0, 0.5)' 
    : 'transparent'
  };
`

const PlayerName = styled.div`
  font-size: 0.9rem;
  color: white;
`

const PlayerStatus = styled.div<{ $status: string }>`
  font-size: 0.8rem;
  padding: 2px 6px;
  border-radius: 4px;
  background: ${props => {
    switch (props.$status) {
      case 'ready': return '#4caf50'
      case 'betting': return '#ff9800'
      case 'waiting': return '#9e9e9e'
      default: return '#9e9e9e'
    }
  }};
`

interface PlayersListProps {
  players: Array<{
    user: PublicKey
    wager?: number
    status?: string
  }>
  currentPlayer?: PublicKey | null
  gameState: any
}

const shorten = (pk: PublicKey) => pk.toBase58().slice(0, 6) + '...'

export default function PlayersList({ players, currentPlayer, gameState }: PlayersListProps) {
  return (
    <PlayersContainer>
      <Title>Players ({players.length})</Title>
      {players.length === 0 ? (
        <div style={{ textAlign: 'center', opacity: 0.6, fontSize: '0.9rem' }}>
          No players yet
        </div>
      ) : (
        players.map((player, index) => (
          <PlayerItem 
            key={player.user.toString()}
            $isCurrentPlayer={currentPlayer?.equals(player.user)}
          >
            <div>
              <PlayerName>
                {currentPlayer?.equals(player.user) ? '👤 You' : `Player ${index + 1}`}
              </PlayerName>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                {shorten(player.user)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              {player.wager && (
                <div style={{ marginBottom: '4px' }}>
                  <TokenValue amount={player.wager} />
                </div>
              )}
                          <PlayerStatus $status={player.status || 'waiting'}>
                {gameState.waiting ? 'Waiting' : 'Ready'}
              </PlayerStatus>
            </div>
          </PlayerItem>
        ))
      )}
    </PlayersContainer>
  )
}
