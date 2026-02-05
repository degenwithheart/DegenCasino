import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useGambaProvider, useSpecificGames } from 'gamba-react-v2'
import { GambaUi } from 'gamba-react-ui-v2'
import { DESIRED_MAX_PLAYERS, DESIRED_WINNERS_TARGET } from '../config'
import CreateGameModal from './CreateGameModal'
import { fetchPlayerMetadata } from '@gamba-labs/multiplayer-sdk'
import { parseGameConfig, shorten, formatDuration, sol } from '../utils'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`

const Title = styled.h2`
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`

const Button = styled.button`
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: #333;
  color: #fff;
  transition: background 0.2s ease;
  &:hover {
    background: #444;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const CreateButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  &:hover {
    background: linear-gradient(135deg, #5568d3 0%, #66398f 100%);
  }
`

const DebugButton = styled(Button)`
  background: #ff9800;
  &:hover {
    background: #f57c00;
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  overflow: hidden;
`

const TH = styled.th`
  text-align: left;
  padding: 14px 16px;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  color: #aaa;
  border-bottom: 2px solid #333;
  background: rgba(0, 0, 0, 0.3);
`

const TR = styled.tr<{ $clickable?: boolean }>`
  &:hover {
    background: ${({ $clickable }) => ($clickable ? 'rgba(255, 255, 255, 0.05)' : 'inherit')};
  }
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  transition: background 0.2s ease;
`

const TD = styled.td`
  padding: 14px 16px;
  font-size: 0.95rem;
  color: #ddd;
  border-bottom: 1px solid #222;
`

const StatusBadge = styled.span<{ $status: 'waiting' | 'ready' | 'started' }>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${({ $status }) => {
    if ($status === 'waiting') return '#ffc107'
    if ($status === 'ready') return '#4caf50'
    return '#666'
  }};
  color: #000;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #888;
  font-size: 1.1rem;
`

export default function Lobby({
  onSelect,
  onDebug,
}: {
  onSelect(pk: PublicKey): void
  onDebug(): void
}) {
  const { games, loading, refresh } = useSpecificGames(
    { maxPlayers: DESIRED_MAX_PLAYERS, winnersTarget: DESIRED_WINNERS_TARGET },
    0,
  )

  const { anchorProvider } = useGambaProvider()
  const [metas, setMetas] = useState<Record<string, Record<string, string>>>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [now, setNow] = useState(Date.now())

  // Fetch player metadata for all visible games
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const entries = await Promise.all(
          games.map(async (g) => {
            try {
              const md = await fetchPlayerMetadata(anchorProvider as any, (g.account as any).gameSeed)
              return [g.publicKey.toBase58(), md] as const
            } catch {
              return [g.publicKey.toBase58(), {}] as const
            }
          })
        )
        if (!cancelled) {
          const next: Record<string, Record<string, string>> = {}
          for (const [k, v] of entries) next[k] = v
          setMetas(next)
        }
      } catch (e) {
        console.error('Error fetching metadata:', e)
      }
    }
    if (games.length > 0) {
      load()
    }
    return () => {
      cancelled = true
    }
  }, [games, anchorProvider])

  // Update timer every second
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <GambaUi.Portal target="screen">
      <Wrapper>
        <Header>
          <Title>🎲 Dice Dual Lobby</Title>
          <ButtonGroup>
            <CreateButton onClick={() => setIsModalOpen(true)}>
              + Create Game
            </CreateButton>
            <DebugButton onClick={onDebug}>
              🐞 Debug Mode
            </DebugButton>
            <Button onClick={refresh} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </ButtonGroup>
        </Header>

        {games.length > 0 ? (
          <Table>
            <thead>
              <tr>
                <TH>Creator</TH>
                <TH>Config</TH>
                <TH>Players</TH>
                <TH>Bet</TH>
                <TH>Status</TH>
              </tr>
            </thead>
            <tbody>
              {games.map((g) => {
                const {
                  gameMaker,
                  players,
                  maxPlayers,
                  wager,
                  softExpirationTimestamp,
                  state,
                } = g.account as any

                const md = metas[g.publicKey.toBase58()] || {}
                const makerMeta = md[gameMaker.toBase58()] || ''
                const config = parseGameConfig(makerMeta)

                const configLabel = config
                  ? `${config.diceCount}d6 ${config.prediction} ${config.targetNumber}`
                  : 'Custom'

                const betLabel = `${sol(wager.toNumber()).toFixed(2)} SOL`

                const startMs = Number(softExpirationTimestamp) * 1000
                const msLeft = startMs - now
                
                let status: 'waiting' | 'ready' | 'started'
                let statusLabel: string
                
                if (state.waiting) {
                  if (msLeft > 0) {
                    status = 'waiting'
                    statusLabel = formatDuration(msLeft)
                  } else {
                    status = 'ready'
                    statusLabel = 'Ready'
                  }
                } else {
                  status = 'started'
                  statusLabel = 'Started'
                }

                return (
                  <TR
                    key={g.publicKey.toBase58()}
                    $clickable
                    onClick={() => onSelect(g.publicKey)}
                  >
                    <TD>{shorten(gameMaker)}</TD>
                    <TD>{configLabel}</TD>
                    <TD>
                      {players.length} / {maxPlayers}
                    </TD>
                    <TD>{betLabel}</TD>
                    <TD>
                      <StatusBadge $status={status}>{statusLabel}</StatusBadge>
                    </TD>
                  </TR>
                )
              })}
            </tbody>
          </Table>
        ) : (
          <EmptyState>
            {loading ? 'Loading games...' : 'No active games. Create one or try debug mode!'}
          </EmptyState>
        )}

        <CreateGameModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreated={onSelect}
        />
      </Wrapper>
    </GambaUi.Portal>
  )
}