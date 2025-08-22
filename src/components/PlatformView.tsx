import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { PublicKey } from '@solana/web3.js'
import styled from 'styled-components'
import { GambaTransaction } from 'gamba-core-v2'
import { GambaUi, TokenValue, useTokenMeta } from 'gamba-react-ui-v2'
import { useGambaEvents } from 'gamba-react-v2'
import { useLeaderboardData } from '../hooks/useLeaderboardData'
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
  padding: 16px;
  position: relative;
  overflow: hidden;
`

const VolumeBar = styled.div<{ height: number; index: number }>`
  position: absolute;
  bottom: 16px;
  width: 12px;
  height: ${props => props.height}%;
  background: linear-gradient(180deg, #ffd700 0%, #ff6600 100%);
  border-radius: 2px;
  left: ${props => 16 + props.index * 20}px;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(180deg, #fff700 0%, #ff8800 100%);
    transform: scaleY(1.1);
  }
`

const TokenDistributionBar = styled.div<{ width: number; color: string }>`
  height: 20px;
  width: ${props => props.width}%;
  background: ${props => props.color};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scaleY(1.2);
  }
`

const ChartPlaceholder = styled.div`
  color: #666;
  font-size: 14px;
`

const LeaderboardSection = styled(Section)`
  height: 296px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.3);
    border-radius: 3px;
    
    &:hover {
      background: rgba(255, 215, 0, 0.5);
    }
  }
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
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
  color: #888;
  font-weight: 500;
`

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
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
      <PlatformCell>
        <PlatformIcon>🎰</PlatformIcon>
        {platformName}
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

export function PlatformView() {
  const { creator } = useParams<{creator: string}>()
  const [stats, setStats] = React.useState<any>(null)
  const [recentPlays, setRecentPlays] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [volumeData, setVolumeData] = React.useState<number[]>([])
  const [tokenDistribution, setTokenDistribution] = React.useState<{token: string, volume: number, percentage: number, color: string}[]>([])
  const [apiAvailable, setApiAvailable] = React.useState(true)
  
  const { data: leaderboard = [] } = useLeaderboardData('weekly', creator || '')

  // Fetch real historical volume data
  React.useEffect(() => {
    const fetchVolumeData = async () => {
      if (!creator) return
      
      try {
        const promises = []
        const today = new Date()
        
        // Fetch volume for each of the last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today)
          date.setDate(date.getDate() - i)
          const startTime = date.setHours(0, 0, 0, 0)
          const endTime = date.setHours(23, 59, 59, 999)
          
          promises.push(
            fetch(`https://api.gamba.so/stats?creator=${creator}&startTime=${startTime}&endTime=${endTime}`)
              .then(res => res.ok ? res.json() : null)
              .catch(() => null)
          )
        }
        
        const results = await Promise.all(promises)
        const volumes = results.map(result => result?.usd_volume || 0)
        const maxVolume = Math.max(...volumes, 1)
        
        // Convert to percentages for display
        const volumePercentages = volumes.map(vol => (vol / maxVolume) * 100)
        setVolumeData(volumePercentages)
      } catch (error) {
        console.error('Failed to fetch volume data:', error)
        setApiAvailable(false)
        setVolumeData([])
      }
    }
    
    fetchVolumeData()
  }, [creator])

  // Generate token distribution from real data only
  React.useEffect(() => {
    if (stats && stats.usd_volume > 0) {
      // For now, we don't have per-token breakdown from API
      // So we'll show a message that this data is not available
      setTokenDistribution([])
    } else {
      setTokenDistribution([])
    }
  }, [stats])

  React.useEffect(() => {
    if (creator) {
      const startTime = Date.now() - 7 * 24 * 60 * 60 * 1000 // 7 days ago
      
      const fetchData = async () => {
        try {
          setLoading(true)
          
          // Fetch platform stats
          const statsResponse = await fetch(`https://api.gamba.so/stats?creator=${creator}&startTime=${startTime}`)
          if (statsResponse.ok) {
            const statsData = await statsResponse.json()
            console.log('Stats data received:', statsData)
            setStats(statsData)
            setApiAvailable(true)
          } else {
            console.warn('Failed to fetch stats:', statsResponse.status)
            setApiAvailable(false)
            setStats(null)
          }
          
          // Fetch recent plays for this platform
          const playsResponse = await fetch(`https://api.gamba.so/events/settledGames?creator=${creator}&itemsPerPage=10&page=0`)
          if (playsResponse.ok) {
            const playsData = await playsResponse.json()

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
          console.error('Failed to fetch platform data:', err)
          setError('Failed to load platform data')
          setApiAvailable(false)
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
      <Header>
        <PlatformImage src="/casino.png" alt="Platform" />
        <PlatformInfo>
          <PlatformName>
            <PlatformIcon>🎰</PlatformIcon>
            {platformName}
          </PlatformName>
          <PlatformAddress>{creator}</PlatformAddress>
        </PlatformInfo>
      </Header>

      <TopStatsRow>
        <TopStat>
          <TopStatLabel>Volume</TopStatLabel>
          <TopStatValue>${volume.toFixed(2)}</TopStatValue>
        </TopStat>
        <TopStat>
          <TopStatLabel>Estimated Fees</TopStatLabel>
          <TopStatValue>${estimatedFees.toFixed(2)}</TopStatValue>
        </TopStat>
        <TopStat>
          <TopStatLabel>Plays</TopStatLabel>
          <TopStatValue>{plays}</TopStatValue>
        </TopStat>
        <TopStat>
          <TopStatLabel>Players</TopStatLabel>
          <TopStatValue>{players}</TopStatValue>
        </TopStat>
      </TopStatsRow>

      <MainContent>
        <div>
          <Section>
            <SectionTitle>7d Volume</SectionTitle>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
              {apiAvailable ? `$${volume.toFixed(1)}` : 'API Unavailable'}
            </div>
            <ChartContainer>
              {!apiAvailable ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
                  API data not available
                </div>
              ) : volumeData.length > 0 ? (
                <>
                  {volumeData.map((height, index) => (
                    <VolumeBar 
                      key={index} 
                      height={height} 
                      index={index}
                      title={`Day ${index + 1}: ${height.toFixed(1)}% of peak`}
                    />
                  ))}
                  <div style={{ position: 'absolute', bottom: '4px', left: '16px', fontSize: '10px', color: '#666' }}>
                    7 days ago
                  </div>
                  <div style={{ position: 'absolute', bottom: '4px', right: '16px', fontSize: '10px', color: '#666' }}>
                    Today
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
                  No volume data available
                </div>
              )}
            </ChartContainer>
          </Section>
        </div>

        <div>
          <LeaderboardSection>
            <LeaderboardHeader>
              <SectionTitle style={{ margin: 0 }}>7d Leaderboard</SectionTitle>
              <ViewAllLink to="#" onClick={(e) => e.preventDefault()}>View all</ViewAllLink>
            </LeaderboardHeader>
            <LeaderboardList>
              {(leaderboard || []).map((player, index) => (
                <LeaderboardItem 
                  key={player.user}
                  onClick={() => window.location.href = `/explorer/player/${player.user}`}
                >
                  <PlayerInfo>
                    <Rank>{index + 1}</Rank>
                    <PlayerAddress>{player.user.slice(0, 4)}...{player.user.slice(-4)}</PlayerAddress>
                  </PlayerInfo>
                  <VolumeAmount>${player.usd_volume.toLocaleString()}</VolumeAmount>
                </LeaderboardItem>
              ))}
            </LeaderboardList>
          </LeaderboardSection>
        </div>
      </MainContent>

      {/* 
      <RecentPlaysTable>
        <Section>
          <SectionTitle>Recent plays</SectionTitle>
          <TableHeader>
            <div>Platform</div>
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
              Loading recent plays...
            </div>
          )}
          {!loading && recentPlays.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              No recent plays found
            </div>
          )}
        </Section>
      </RecentPlaysTable>
      */}
    </PlatformContainer>
  )
}
