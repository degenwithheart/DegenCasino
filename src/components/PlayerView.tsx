import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { PublicKey } from '@solana/web3.js'
import styled from 'styled-components'
import { TokenValue, useTokenMeta } from 'gamba-react-ui-v2'
import { GambaTransaction } from 'gamba-core-v2'
import { BPS_PER_WHOLE } from 'gamba-core-v2'
import { PLATFORM_CREATOR_ADDRESS } from '../constants'

interface PlayerResponse {
  volume: number
  profit: number
  plays: number
  wins: number
}

const PlayerContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  color: white;
`

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
`

const StatCard = styled.div`
  text-align: center;
`

const StatValue = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: white;
  margin-bottom: 4px;
`

const StatLabel = styled.div`
  font-size: 14px;
  color: #888;
`

const PlayerSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
`

const PlayerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`

const PlayerAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`

const PlayerName = styled.h2`
  margin: 0;
  color: #ff6666;
  font-family: monospace;
  font-size: 18px;
  font-weight: 500;
`

const AddressSection = styled.div`
  margin-bottom: 20px;
`

const AddressLabel = styled.div`
  color: #888;
  font-size: 14px;
  margin-bottom: 8px;
`

const AddressValue = styled.div`
  color: white;
  font-family: monospace;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`

const CopyButton = styled.button`
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #888;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`

const RecentPlaysSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
`

const SectionTitle = styled.h3`
  margin: 0 0 20px 0;
  color: white;
  font-size: 18px;
  font-weight: 500;
`

const PlaysTable = styled.div`
  width: 100%;
`

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
  color: #888;
  font-weight: 500;
`

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`

const PlatformCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ff6666;
  font-size: 14px;
`

const PlayerCell = styled.div`
  color: #ff6666;
  font-family: monospace;
  font-size: 14px;
`

const TokenCell = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
  font-size: 14px;
`

const TokenIcon = styled.img`
  width: 16px;
  height: 16px;
  border-radius: 50%;
`

const PayoutCell = styled.div<{$isWin: boolean}>`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${props => props.$isWin ? '#4ade80' : 'white'};
  font-size: 14px;
`

const MultiplierBadge = styled.span<{$isWin: boolean}>`
  background: ${props => props.$isWin ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$isWin ? '#4ade80' : '#888'};
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`

const TimeCell = styled.div`
  color: #888;
  font-size: 14px;
`

const LoadMoreButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-size: 14px;
`

function TimeDiff({ time }: { time: number }) {
  const diff = Date.now() - time
  const sec = Math.floor(diff / 1000)
  const min = Math.floor(sec / 60)
  const hrs = Math.floor(min / 60)
  const days = Math.floor(hrs / 24)
  
  if (days >= 1) return <span>{days}d ago</span>
  if (hrs >= 1) return <span>{hrs}h ago</span>
  if (min >= 1) return <span>{min}m ago</span>
  return <span>Just now</span>
}

function PlayerPlayRow({ play }: { play: any }) {
  const navigate = useNavigate()
  
  // Create PublicKey objects for proper component usage
  const tokenMint = React.useMemo(() => {
    try {
      return new PublicKey(play.token)
    } catch {
      return PublicKey.default
    }
  }, [play.token])
  
  const token = useTokenMeta(tokenMint)
  const wager = play.wager || 0
  const payout = play.payout || 0
  const isWin = payout > wager
  const multiplier = play.multiplier || (payout > 0 ? payout / wager : 0)

  const handleClick = () => {
    if (play.signature) {
      navigate(`/explorer/transaction/${play.signature}?user=${play.user}`)
    }
  }

  return (
    <TableRow onClick={handleClick}>
      <PlatformCell>
        🎰 DegenCasino
      </PlatformCell>
      <PlayerCell>{play.user.slice(0, 4)}...{play.user.slice(-4)}</PlayerCell>
      <TokenCell>
        <TokenIcon src={token.image} alt={token.symbol} />
        <TokenValue amount={wager} mint={tokenMint} />
      </TokenCell>
      <PayoutCell $isWin={isWin}>
        <TokenIcon src={token.image} alt={token.symbol} />
        <TokenValue amount={payout} mint={tokenMint} />
        {isWin && <MultiplierBadge $isWin={isWin}>{multiplier.toFixed(2)}x</MultiplierBadge>}
      </PayoutCell>
      <TimeCell>
        <TimeDiff time={play.time || Date.now()} />
      </TimeCell>
    </TableRow>
  )
}

export function PlayerView() {
  const { address } = useParams<{address: string}>()
  const [playerData, setPlayerData] = React.useState<PlayerResponse | null>(null)
  const [recentPlays, setRecentPlays] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  React.useEffect(() => {
    if (address) {
      const fetchData = async () => {
        try {
          setLoading(true)
          
                    // Fetch player data
          const playerResponse = await fetch(`https://api.gamba.so/player?user=${address}`)
          if (playerResponse.ok) {
            const data = await playerResponse.json()
            setPlayerData({
              volume: data.usd_volume || 0,
              profit: data.usd_profit || 0,
              plays: data.games_played || 0,
              wins: data.games_won || 0
            })
          } else {
            const errorText = await playerResponse.text()
            console.warn('Player not found or API error:', playerResponse.status, errorText)
            setPlayerData(null)
          }
          
          // Fetch recent plays for this player
          const playsResponse = await fetch(`https://api.gamba.so/events/settledGames?user=${address}&itemsPerPage=10&page=0`)
          if (playsResponse.ok) {
            const playsData = await playsResponse.json()

            // Use the platform creator address for filtering
            const creator = PLATFORM_CREATOR_ADDRESS.toBase58()

            // Filter to only include plays where creator matches exactly
            const filteredPlays = (playsData.results || []).filter((play: any) => play.creator === creator)

            // Transform the API data to match our display format
            const transformedPlays = filteredPlays.map((play: any) => {
              const wager = parseFloat(play.wager) || 0
              const payout = parseFloat(play.payout) || 0
              const multiplier = play.multiplier || 0

              return {
                signature: play.signature,
                user: play.user,
                creator: play.creator,
                token: play.token,
                wager,
                payout,
                time: play.time,
                multiplier
              }
            })

            setRecentPlays(transformedPlays)
          } else {
            const errorText = await playsResponse.text()
            console.warn('Failed to fetch recent plays:', playsResponse.status, errorText)
          }
        } catch (err) {
          console.error('Failed to fetch player data:', err)
          setPlayerData(null)
          setError('Failed to load player data')
        } finally {
          setLoading(false)
        }
      }
      
      fetchData()
    }
  }, [address])

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    }
  }

  if (!address) {
    return <div>No player address provided</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  // Use API data for plays and wins, fallback to empty arrays if no data
  const volume = playerData?.volume || 0
  const profit = playerData?.profit || 0
  const plays = playerData?.plays || 0
  const wins = playerData?.wins || 0

  return (
    <PlayerContainer>
      <StatsRow>
        <StatCard>
          <StatValue>${volume.toFixed(2)}</StatValue>
          <StatLabel>Volume</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>${profit.toFixed(2)}</StatValue>
          <StatLabel>Profit</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{plays}</StatValue>
          <StatLabel>Plays</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{wins}</StatValue>
          <StatLabel>Wins</StatLabel>
        </StatCard>
      </StatsRow>

      <PlayerSection>
        <PlayerHeader>
          <PlayerAvatar>🎮</PlayerAvatar>
          <PlayerName>iyot1Wei...y2o8n1MX</PlayerName>
        </PlayerHeader>
        
        <AddressSection>
          <AddressLabel>Address:</AddressLabel>
          <AddressValue>
            {address}
            <CopyButton onClick={copyAddress}>Copy</CopyButton>
          </AddressValue>
        </AddressSection>
      </PlayerSection>

      <RecentPlaysSection>
        <SectionTitle>Recent Plays</SectionTitle>
        
        {recentPlays.slice(0, 10).length > 0 ? (
          <PlaysTable>
            <TableHeader>
              <div>Platform</div>
              <div>Player</div>
              <div>Wager</div>
              <div>Payout</div>
              <div>Time</div>
            </TableHeader>
            {recentPlays.slice(0, 10).map((play, index) => (
              <PlayerPlayRow key={play.signature || index} play={play} />
            ))}
          </PlaysTable>
        ) : loading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            Loading recent plays...
          </div>
        ) : (
          <EmptyState>No recent plays found</EmptyState>
        )}
      </RecentPlaysSection>
    </PlayerContainer>
  )
}
