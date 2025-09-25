import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { PublicKey } from '@solana/web3.js'
import styled from 'styled-components'
import { GambaTransaction } from 'gamba-core-v2'
import { GambaUi, TokenValue, useTokenMeta } from 'gamba-react-ui-v2'
import { useLeaderboardData } from '../../hooks/data/useLeaderboardData'
import { extractMetadata } from '../../utils'
import { BPS_PER_WHOLE } from 'gamba-core-v2'
import { PLATFORM_CREATOR_ADDRESS } from '../../constants'
import { ExplorerHeader } from '../Explorer/ExplorerHeader'
import { useColorScheme } from '../../themes/ColorSchemeContext'
import {
  UnifiedPageContainer,
  UnifiedPageTitle,
  UnifiedSection,
  UnifiedSectionTitle,
  UnifiedContent,
  UnifiedGrid
} from '../UI/UnifiedDesign'

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

const PlatformContainer = styled.div<{ $colorScheme?: any }>`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.text || 'white'};
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
`

const PlatformImage = styled.img<{ $colorScheme?: any }>`
  width: 64px;
  height: 64px;
  border-radius: 12px;
  border: 2px solid ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ff4444'};
`

const PlatformInfo = styled.div`
  flex: 1;
`

const PlatformName = styled.h1<{ $colorScheme?: any }>`
  margin: 0 0 8px 0;
  font-size: 2rem;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.text || 'white'};
  display: flex;
  align-items: center;
  gap: 8px;
`

const PlatformIcon = styled.span<{ $colorScheme?: any }>`
  color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ff4444'};
  font-size: 1.5rem;
`

const PlatformAddress = styled.div<{ $colorScheme?: any }>`
  font-family: monospace;
  font-size: 14px;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.textSecondary || '#888'};
`

const TopStatsRow = styled.div<{ $colorScheme?: any }>`
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
  font-size: 14px;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.textSecondary || '#888'};
`

const TopStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const TopStatLabel = styled.div<{ $colorScheme?: any }>`
  color: ${({ $colorScheme }) => $colorScheme?.colors?.textSecondary || '#888'};
`

const TopStatValue = styled.div<{ $colorScheme?: any }>`
  color: ${({ $colorScheme }) => $colorScheme?.colors?.text || 'white'};
  font-size: 16px;
  font-weight: 500;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`

const StatCard = styled.div<{ $colorScheme?: any }>`
  background: ${({ $colorScheme }) => $colorScheme?.colors?.surface || 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  padding: 20px;
  text-align: center;
`

const StatLabel = styled.div<{ $colorScheme?: any }>`
  font-size: 14px;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.textSecondary || '#888'};
  margin-bottom: 8px;
`

const StatValue = styled.div<{ $colorScheme?: any }>`
  font-size: 24px;
  font-weight: bold;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
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

const Section = styled.div<{ $colorScheme?: any }>`
  background: ${({ $colorScheme }) => $colorScheme?.colors?.surface || 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  padding: 24px;
`

const SectionTitle = styled.h3<{ $colorScheme?: any }>`
  margin: 0 0 20px 0;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.text || 'white'};
  font-size: 18px;
  font-weight: 500;
`

const ChartContainer = styled.div<{ $colorScheme?: any }>`
  height: 200px;
  background: ${({ $colorScheme }) => $colorScheme?.colors?.surface || 'rgba(0, 0, 0, 0.2)'};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`

const ChartPlaceholder = styled.div<{ $colorScheme?: any }>`
  color: ${({ $colorScheme }) => $colorScheme?.colors?.textSecondary || '#666'};
  font-size: 14px;
`

// Game Status Overview Components
const GameStatusContainer = styled.div<{ $colorScheme?: any }>`
  background: ${({ $colorScheme }) => $colorScheme?.colors?.surface || 'rgba(34, 34, 34, 0.9)'};
  border: 1px solid ${({ $colorScheme }) => $colorScheme?.colors?.success || 'rgba(76, 175, 80, 0.3)'};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 32px;
`

const GameStatusHeader = styled.div<{ $colorScheme?: any }>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.success || '#4caf50'};
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

const StatusCard = styled.div<{ $colorScheme?: any }>`
  background: ${({ $colorScheme }) => $colorScheme?.colors?.surface || 'rgba(45, 45, 45, 0.8)'};
  border: 1px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  padding: 16px;
  text-align: center;
`

const StatusValue = styled.div<{ $colorScheme?: any }>`
  font-size: 28px;
  font-weight: bold;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
  margin-bottom: 8px;
`

const StatusLabel = styled.div<{ $colorScheme?: any }>`
  font-size: 12px;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.textSecondary || '#888'};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const LeaderboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`

const ViewAllLink = styled(Link)<{ $colorScheme?: any }>`
  color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
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

const LeaderboardItem = styled.div<{ $colorScheme?: any }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: ${({ $colorScheme }) => $colorScheme?.colors?.surface || 'rgba(0, 0, 0, 0.2)'};
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    background: ${({ $colorScheme }) => $colorScheme?.colors?.surface || 'rgba(0, 0, 0, 0.3)'};
  }
`

const PlayerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const Rank = styled.div<{ $colorScheme?: any }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
  color: ${({ $colorScheme }) => $colorScheme?.colors?.background || '#000'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
`

const PlayerAddress = styled.div<{ $colorScheme?: any }>`
  font-family: monospace;
  font-size: 14px;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ff6666'};
`

const VolumeAmount = styled.div<{ $colorScheme?: any }>`
  color: ${({ $colorScheme }) => $colorScheme?.colors?.text || 'white'};
  font-weight: 500;
`

const RecentPlaysTable = styled.div`
  margin-top: 32px;
`

const TableHeader = styled.div<{ $colorScheme?: any }>`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
  font-size: 14px;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.textSecondary || '#888'};
  font-weight: 500;
`

const TableRow = styled.div<{ $colorScheme?: any }>`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(255, 255, 255, 0.05)'};
  cursor: pointer;
  
  &:hover {
    background: ${({ $colorScheme }) => $colorScheme?.colors?.surface || 'rgba(255, 255, 255, 0.02)'};
  }
`

const PlatformCell = styled.div<{ $colorScheme?: any }>`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ff6666'};
  font-size: 14px;
`

const PlayerCell = styled.div<{ $colorScheme?: any }>`
  color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ff6666'};
  font-family: monospace;
  font-size: 14px;
`

const TokenCell = styled.div<{ $colorScheme?: any }>`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.text || 'white'};
  font-size: 14px;
`

const TokenIcon = styled.img`
  width: 16px;
  height: 16px;
  border-radius: 50%;
`

const PayoutCell = styled.div<{ $isWin: boolean; $colorScheme?: any }>`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${props => props.$isWin ? (props.$colorScheme?.colors?.success || '#4ade80') : (props.$colorScheme?.colors?.text || 'white')};
  font-size: 14px;
`

const MultiplierBadge = styled.span<{ $isWin: boolean; $colorScheme?: any }>`
  background: ${props => props.$isWin ? 'rgba(74, 222, 128, 0.2)' : (props.$colorScheme?.colors?.surface || 'rgba(255, 255, 255, 0.1)')};
  color: ${props => props.$isWin ? (props.$colorScheme?.colors?.success || '#4ade80') : (props.$colorScheme?.colors?.textSecondary || '#888')};
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`

const TimeCell = styled.div<{ $colorScheme?: any }>`
  color: ${({ $colorScheme }) => $colorScheme?.colors?.textSecondary || '#888'};
  font-size: 14px;
`

const DetailsSection = styled.div`
  margin-top: 32px;
`

const DetailItem = styled.div<{ $colorScheme?: any }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(255, 255, 255, 0.05)'};
`

const DetailLabel = styled.div<{ $colorScheme?: any }>`
  color: ${({ $colorScheme }) => $colorScheme?.colors?.textSecondary || '#888'};
  font-size: 14px;
`

const DetailValue = styled.div<{ $colorScheme?: any }>`
  color: ${({ $colorScheme }) => $colorScheme?.colors?.text || 'white'};
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

function RecentPlayRow({ play, platformName, colorScheme }: { play: any; platformName: string; colorScheme?: any }) {
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
    <TableRow $colorScheme={colorScheme} onClick={handleClick}>
      <PlayerCell $colorScheme={colorScheme}>{play.user.slice(0, 4)}...{play.user.slice(-4)}</PlayerCell>
      <TokenCell $colorScheme={colorScheme}>
        <TokenIcon src={token.image} alt={token.symbol} />
        <TokenValue amount={wager} mint={tokenMint} />
      </TokenCell>
      <PayoutCell $colorScheme={colorScheme} $isWin={isWin}>
        <TokenIcon src={token.image} alt={token.symbol} />
        <TokenValue amount={payout} mint={tokenMint} />
        {isWin && <MultiplierBadge $colorScheme={colorScheme} $isWin={isWin}>{multiplier.toFixed(2)}x</MultiplierBadge>}
      </PayoutCell>
      <TimeCell $colorScheme={colorScheme}>
        {formatTimestamp({ time: play.time || Date.now() })}
      </TimeCell>
    </TableRow>
  )
}

// Simple cache to avoid refetching the same data
const dataCache = new Map<string, { data: any, timestamp: number }>()
const CACHE_DURATION = 30000 // 30 seconds

export function PlatformView() {
  const { currentColorScheme } = useColorScheme()
  const { creator } = useParams<{creator: string}>()
  const [stats, setStats] = React.useState<any>(null)
  const [recentPlays, setRecentPlays] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  
  const { data: leaderboard = [] } = useLeaderboardData('alltime', creator || '')
  
  // Only use real Gamba API data with caching for better performance

  React.useEffect(() => {
    if (creator) {
      const cacheKey = `platform_${creator}`
      const cached = dataCache.get(cacheKey)
      
      // Check if we have fresh cached data
      if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        setStats(cached.data.stats)
        setRecentPlays(cached.data.plays)
        setLoading(false)
        console.log('📊 Using cached Explorer platform data')
        return
      }
      
      // If we have stale cached data, show it while loading fresh data
      if (cached && cached.data.stats) {
        setStats(cached.data.stats)
        setRecentPlays(cached.data.plays)
        console.log('📊 Showing stale cache while refreshing Explorer data')
      }
      
      const fetchData = async () => {
        const startTime = performance.now()
        try {
          setLoading(true)
          setError(null)
          
          // Use correct stats endpoint format
          const statsUrl = `${API_ENDPOINT}/stats?creator=${creator}`
          
          const statsResponse = await fetch(statsUrl)
          
          let statsData = null
          let transformedPlays: any[] = []
          
          if (statsResponse.ok) {
            statsData = await statsResponse.json()
            console.log('Explorer stats API response:', statsData)
            setStats(statsData)
          } else {
            console.warn('Failed to fetch Explorer stats:', statsResponse.status)
          }
          
          // Fetch more plays for better data (match Dashboard approach)
          const playsUrl = `${API_ENDPOINT}/events/settledGames?creator=${creator}&itemsPerPage=100&page=0`
          console.log('Fetching Explorer plays from:', playsUrl)
          
          const playsResponse = await fetch(playsUrl)
          
          if (playsResponse.ok) {
            const playsData = await playsResponse.json()
            console.log('Explorer plays API response:', playsData)
            console.log('Number of results:', playsData?.results?.length || 0)
            
            // Streamlined data processing for better performance
            if (playsData && Array.isArray(playsData.results)) {
              // Filter and transform in single pass for better performance
              const filteredPlays = playsData.results.filter((play: any) => play.creator === creator)
              console.log('Filtered plays for creator:', filteredPlays.length, 'plays')
              console.log('First few plays:', filteredPlays.slice(0, 3))
              
              transformedPlays = filteredPlays.map((play: any) => {
                  // Keep wager and payout in lamports for TokenValue component
                  const wager = parseFloat(play.wager) || 0
                  const payout = parseFloat(play.payout) || 0
                  

                  
                  const multiplierBps = play.multiplier_bps || 0
                  const multiplier = multiplierBps > 0 ? multiplierBps / BPS_PER_WHOLE : (payout > 0 && wager > 0 ? payout / wager : 0)

                  // Simplified timestamp handling
                  let timestamp = play.block_time || play.time || Date.now()
                  if (typeof timestamp === 'string') {
                    timestamp = new Date(timestamp).getTime()
                  } else if (timestamp < 1e12) {
                    timestamp *= 1000
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
            }
          }
          
          // Cache the fetched data for better performance
          if (statsData || transformedPlays.length > 0) {
            dataCache.set(cacheKey, {
              data: { stats: statsData, plays: transformedPlays },
              timestamp: Date.now()
            })
          }
          
          const endTime = performance.now()
          console.log(`🏢 Explorer platform stats loaded in ${(endTime - startTime).toFixed(2)}ms`)
          
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

  // Only use fees from API, but calculate volume properly from platform plays
  const estimatedFees = stats?.revenue_usd || stats?.fees || stats?.total_fees || 0

  // Calculate volume from recent plays (convert from lamports to SOL for display)
  const calculatedVolume = recentPlays.reduce((total, play) => {
    const wagerInSol = (play.wager || 0) / 1e9 // Convert lamports to SOL
    return total + wagerInSol
  }, 0)

  console.log('Explorer volume calculation:', {
    recentPlaysCount: recentPlays.length,
    calculatedVolume,
    statsVolume: stats?.sol_volume,
    statsPlays: stats?.plays,
    statsTotalGames: stats?.total_games
  })

  // Use stats data if available, fallback to calculated volume
  const displayVolume = stats?.sol_volume || calculatedVolume
  const displayGamesCount = stats?.plays || stats?.total_games || recentPlays.length

  return (
    <UnifiedPageContainer $colorScheme={currentColorScheme}>
      <ExplorerHeader />

      <UnifiedContent $colorScheme={currentColorScheme}>
        {/* Game Status Overview */}
        <GameStatusContainer $colorScheme={currentColorScheme}>
          <GameStatusHeader $colorScheme={currentColorScheme}>
            📊 PLATFORM STATISTICS {loading && '⟳'}
          </GameStatusHeader>
          <StatusGrid>
            <StatusCard $colorScheme={currentColorScheme}>
              <StatusValue $colorScheme={currentColorScheme}>{displayVolume.toFixed(4)} SOL</StatusValue>
              <StatusLabel $colorScheme={currentColorScheme}>WAGERED</StatusLabel>
            </StatusCard>
            <StatusCard $colorScheme={currentColorScheme}>
              <StatusValue $colorScheme={currentColorScheme}>${estimatedFees.toFixed(2)}</StatusValue>
              <StatusLabel $colorScheme={currentColorScheme}>REVENUE</StatusLabel>
            </StatusCard>
            <StatusCard $colorScheme={currentColorScheme}>
              <StatusValue $colorScheme={currentColorScheme}>{displayGamesCount}</StatusValue>
              <StatusLabel $colorScheme={currentColorScheme}>PLAYS</StatusLabel>
            </StatusCard>
            <StatusCard $colorScheme={currentColorScheme}>
              <StatusValue $colorScheme={currentColorScheme}>{new Set(recentPlays.map(play => play.user)).size}</StatusValue>
              <StatusLabel $colorScheme={currentColorScheme}>PLAYERS</StatusLabel>
            </StatusCard>
          </StatusGrid>
        </GameStatusContainer>

        {/* All Plays Section */}
        <RecentPlaysTable>
          <UnifiedSection $colorScheme={currentColorScheme}>
            <UnifiedSectionTitle $colorScheme={currentColorScheme}>All Plays</UnifiedSectionTitle>
          <TableHeader $colorScheme={currentColorScheme}>
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
              colorScheme={currentColorScheme}
            />
          ))}
          {loading && (
            <div style={{ padding: '20px', textAlign: 'center', color: currentColorScheme?.colors?.textSecondary || '#666' }}>
              Loading games...
            </div>
          )}
          {!loading && recentPlays.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: currentColorScheme?.colors?.textSecondary || '#666' }}>
              No games found
            </div>
          )}
        </UnifiedSection>
      </RecentPlaysTable>
      </UnifiedContent>
    </UnifiedPageContainer>
  )
}