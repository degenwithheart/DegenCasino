import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { PublicKey } from '@solana/web3.js'
import styled from 'styled-components'
import { GambaTransaction } from 'gamba-core-v2'
import { GambaUi, TokenValue, useTokenMeta } from 'gamba-react-ui-v2'
import { useLeaderboardData } from '../hooks/useLeaderboardData'
import { extractMetadata } from '../utils'
import { BPS_PER_WHOLE } from 'gamba-core-v2'
import { PLATFORM_CREATOR_ADDRESS } from '../constants'
import { ExplorerHeader } from './ExplorerHeader'

const API_ENDPOINT = 'https://api.gamba.so'

interface StatsData {
  usd_volume: number
  usd_fees: number
  total_games: number
}

interface PlayData {
  signature: string
  user: string
  creator: string
  token: string
  wager: number
  payout: number
  time: number
  game?: string
  multiplier?: number
}

interface ApiPlayData {
  signature: string
  user: string
  creator: string
  token: string
  wager: string
  payout: string
  block_time: number
  multiplier_bps: number
  metadata?: string
}

interface ApiResponse {
  results: ApiPlayData[]
  total: number
}

const PlatformContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
`

const PlatformImage = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 12px;
  border: 2px solid #ff4444;
`

const PlatformInfo = styled.div`
  flex: 1;
`

const PlatformName = styled.h1`
  margin: 0 0 8px 0;
  font-size: 2rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
`

const PlatformIcon = styled.span`
  color: #ff4444;
  font-size: 1.5rem;
`

const PlatformAddress = styled.div`
  font-family: monospace;
  font-size: 14px;
  color: #888;
`

const TopStatsRow = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
  font-size: 14px;
  color: #888;
`

const TopStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const TopStatLabel = styled.div`
  color: #888;
`

const TopStatValue = styled.div`
  color: white;
  font-size: 16px;
  font-weight: 500;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
`

const StatLabel = styled.div`
  font-size: 14px;
  color: #888;
  margin-bottom: 8px;
`

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #ffd700;
`

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const Section = styled.div`
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

const ChartContainer = styled.div`
  height: 200px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`

const ChartPlaceholder = styled.div`
  color: #666;
  font-size: 14px;
`

// Game Status Overview Components
const GameStatusContainer = styled.div`
  background: rgba(34, 34, 34, 0.9);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 32px;
`

const GameStatusHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  color: #4caf50;
  font-weight: 600;
  font-size: 16px;
`

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

const StatusCard = styled.div`
  background: rgba(45, 45, 45, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
`

const StatusValue = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: #ffd700;
  margin-bottom: 8px;
`

const StatusLabel = styled.div`
  font-size: 12px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const LeaderboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`

const ViewAllLink = styled(Link)`
  color: #ffd700;
  text-decoration: none;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
`

const LeaderboardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const LeaderboardItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    background: rgba(0, 0, 0, 0.3);
  }
`

const PlayerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const Rank = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ffd700;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
`

const PlayerAddress = styled.div`
  font-family: monospace;
  font-size: 14px;
  color: #ff6666;
`

const VolumeAmount = styled.div`
  color: white;
  font-weight: 500;
`

const RecentPlaysTable = styled.div`
  margin-top: 32px;
`

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
  color: #888;
  font-weight: 500;
`

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  
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

const DetailsSection = styled.div`
  margin-top: 32px;
`

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`

const DetailLabel = styled.div`
  color: #888;
  font-size: 14px;
`

const DetailValue = styled.div`
  color: white;
  font-family: monospace;
  font-size: 14px;
`

function formatTimestamp({ time }: { time: number }) {
  const date = new Date(time)
  
  // Format as HH:MM:SS MM/DD/YYYY
  const timeString = date.toLocaleTimeString('en-US', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  
  const dateString = date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  })
  
  return <span>{timeString} {dateString}</span>
}

function RecentPlayRow({ play, platformName }: { play: any; platformName: string }) {
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
      navigate(`/explorer/transaction/${play.signature}`)
    }
  }

  return (
    <TableRow onClick={handleClick}>
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
        {formatTimestamp({ time: play.time || Date.now() })}
      </TimeCell>
    </TableRow>
  )
}

export function PlatformView() {
  const { creator } = useParams<{creator: string}>()
  const [stats, setStats] = React.useState<any>(null)
  const [recentPlays, setRecentPlays] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  
  const { data: leaderboard = [] } = useLeaderboardData('weekly', creator || '')
  
  // Only use real Gamba API data - no fallbacks or fake data

  React.useEffect(() => {
    if (creator) {
      const startTime = Date.now() - 7 * 24 * 60 * 60 * 1000 // 7 days ago
      
      const fetchData = async () => {
        try {
          setLoading(true)
          setError(null)
          
          // Fetch platform stats
          const statsUrl = `${API_ENDPOINT}/stats?creator=${creator}&startTime=${startTime}`
          
          const statsResponse = await fetch(statsUrl)
          
          if (statsResponse.ok) {
            const statsData = await statsResponse.json()
            setStats(statsData)
          } else {
            const errorText = await statsResponse.text()
            console.warn('Failed to fetch stats:', statsResponse.status, errorText)
          }
          
          // Fetch recent plays for this platform
          const playsUrl = `${API_ENDPOINT}/events/settledGames?creator=${creator}&itemsPerPage=20&page=0`
          
          const playsResponse = await fetch(playsUrl)
          
          if (playsResponse.ok) {
            const playsData = await playsResponse.json()
            
            // Log the raw API response to see what we're getting
            console.log('Raw API response:', playsData)

            // Check if the response has the expected structure
            if (playsData && Array.isArray(playsData.results)) {
              // Log first few plays to see the data structure
              console.log('First 3 plays from API:', playsData.results.slice(0, 3))
              
              // Filter to only include plays where creator matches exactly
              const filteredPlays = playsData.results.filter((play: any) => play.creator === creator)

              // Transform the API data to match our display format
              const transformedPlays = filteredPlays.map((play: any) => {
                const wager = parseFloat(play.wager) || 0
                const payout = parseFloat(play.payout) || 0
                const multiplierBps = play.multiplier_bps || 0
                const multiplier = multiplierBps > 0 ? multiplierBps / BPS_PER_WHOLE : (payout > 0 && wager > 0 ? payout / wager : 0)

                // Log all time-related fields from the API
                console.log('Time fields for play:', {
                  signature: play.signature,
                  block_time: play.block_time,
                  time: play.time,
                  timestamp: play.timestamp,
                  created_at: play.created_at,
                  updated_at: play.updated_at,
                  all_fields: Object.keys(play)
                })

                // Try different timestamp fields that might be in the response
                let timestamp = play.block_time || play.time || play.timestamp || play.created_at
                if (timestamp) {
                  // Handle different timestamp formats
                  if (typeof timestamp === 'string') {
                    timestamp = new Date(timestamp).getTime()
                  } else {
                    timestamp = timestamp < 1e12 ? timestamp * 1000 : timestamp
                  }
                } else {
                  console.warn('No timestamp found for play:', play)
                  timestamp = Date.now()
                }

                return {
                  signature: play.signature,
                  user: play.user,
                  creator: play.creator,
                  token: play.token,
                  wager,
                  payout,
                  time: timestamp,
                  multiplier
                }
              })

              setRecentPlays(transformedPlays)
            } else {
              console.warn('Unexpected plays data structure:', playsData)
              // Try alternative API endpoint format
              const altPlaysUrl = `${API_ENDPOINT}/events?creator=${creator}&limit=20`
              
              const altResponse = await fetch(altPlaysUrl)
              if (altResponse.ok) {
                const altData = await altResponse.json()
                
                if (Array.isArray(altData)) {
                  const transformedAltPlays = altData
                    .filter((play: any) => play.creator === creator)
                    .map((play: any) => {
                      // Handle various timestamp formats from alternative API
                      let timestamp = play.block_time || play.time || play.timestamp
                      if (timestamp) {
                        timestamp = timestamp < 1e12 ? timestamp * 1000 : timestamp
                      } else {
                        timestamp = Date.now()
                      }

                      console.log('Alt play data:', {
                        signature: play.signature,
                        original_time: play.block_time || play.time || play.timestamp,
                        converted_time: timestamp,
                        date: new Date(timestamp).toISOString()
                      })

                      return {
                        signature: play.signature || 'unknown',
                        user: play.user || play.player || 'unknown',
                        creator: play.creator,
                        token: play.token || play.mint,
                        wager: parseFloat(play.wager) || parseFloat(play.amount) || 0,
                        payout: parseFloat(play.payout) || parseFloat(play.winnings) || 0,
                        time: timestamp,
                        multiplier: play.multiplier || (play.payout && play.wager ? parseFloat(play.payout) / parseFloat(play.wager) : 0)
                      }
                    })
                  
                  setRecentPlays(transformedAltPlays)
                }
              }
            }
          } else {
            const errorText = await playsResponse.text()
            console.warn('Failed to fetch recent plays:', playsResponse.status, errorText)
          }
          
        } catch (err) {
          console.error('Failed to fetch platform data:', err)
          setError(`Failed to load platform data: ${err instanceof Error ? err.message : 'Unknown error'}`)
        } finally {
          setLoading(false)
        }
      }
      
      fetchData()
    }
  }, [creator])

  if (!creator) {
    return <div>No platform creator provided</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const platformName = creator === PLATFORM_CREATOR_ADDRESS.toString() 
    ? 'DegenCasino' 
    : `6o1i...8ocZ`

  const volume = stats?.usd_volume || 0
  const estimatedFees = stats?.revenue_usd || 0
  const plays = stats?.plays || 0
  const players = stats?.players || 0

  return (
    <PlatformContainer>
      <ExplorerHeader />

      {/* Game Status Overview */}
      <GameStatusContainer>
        <GameStatusHeader>
          📊 PLATFORM STATISTICS
        </GameStatusHeader>
        <StatusGrid>
          <StatusCard>
            <StatusValue>${volume.toFixed(2)}</StatusValue>
            <StatusLabel>VOLUME</StatusLabel>
          </StatusCard>
          <StatusCard>
            <StatusValue>${estimatedFees.toFixed(2)}</StatusValue>
            <StatusLabel>ESTIMATED FEES</StatusLabel>
          </StatusCard>
          <StatusCard>
            <StatusValue>{recentPlays.length}</StatusValue>
            <StatusLabel>PLAYS</StatusLabel>
          </StatusCard>
          <StatusCard>
            <StatusValue>{new Set(recentPlays.map(play => play.user)).size}</StatusValue>
            <StatusLabel>PLAYERS</StatusLabel>
          </StatusCard>
        </StatusGrid>
      </GameStatusContainer>

      {/* All Plays Section */}
      <RecentPlaysTable>
        <Section>
          <SectionTitle>All Plays</SectionTitle>
          <TableHeader>
            <div>Player</div>
            <div>Wager</div>
            <div>Payout</div>
            <div>Time</div>
          </TableHeader>
          {recentPlays.slice(0, 10).map((play, index) => (
            <RecentPlayRow 
              key={play.signature || index}
              play={play}
              platformName={creator === PLATFORM_CREATOR_ADDRESS.toString() ? 'DegenCasino' : '6o1i...8ocZ'}
            />
          ))}
          {loading && (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              Loading games...
            </div>
          )}
          {!loading && recentPlays.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              No games found
            </div>
          )}
        </Section>
      </RecentPlaysTable>
    </PlatformContainer>
  )
}