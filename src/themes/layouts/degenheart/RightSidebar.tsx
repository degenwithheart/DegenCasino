import React, { useMemo } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { useLocation } from 'react-router-dom'
import { useColorScheme } from '../../ColorSchemeContext'
import { useWallet } from '@solana/wallet-adapter-react'
import { useCurrentPool, TokenValue } from 'gamba-react-ui-v2'
import { FaTrophy, FaFire, FaCrown, FaGamepad, FaCoins, FaUsers, FaChartLine, FaShieldAlt, FaChartBar, FaDice, FaStar } from 'react-icons/fa'
import { ALL_GAMES } from '../../../games/allGames'
import { useLeaderboardData } from '../../../hooks/data/useLeaderboardData'
import { useGameStats, useGlobalGameStats } from '../../../hooks/game/useGameStats'
import { RTP_TARGETS } from '../../../games/rtpConfig'
import { RTP_TARGETS_V2 } from '../../../games/rtpConfig-v2'

// Utility function to get RTP for each game (fetches from rtpConfig files dynamically)
const getGameRTP = (gameId: string): string => {
  const gameKey = gameId.toLowerCase()
  
  // Check V2 games first
  if (gameKey.includes('-v2')) {
    const v2Key = gameKey as keyof typeof RTP_TARGETS_V2
    if (RTP_TARGETS_V2[v2Key]) {
      return Math.round(RTP_TARGETS_V2[v2Key] * 100).toString()
    }
  }
  
  // Check V1 games
  const v1Key = gameKey as keyof typeof RTP_TARGETS
  if (RTP_TARGETS[v1Key]) {
    return Math.round(RTP_TARGETS[v1Key] * 100).toString()
  }
  
  // Default fallback
  return '95'
}

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
`

const SidebarContainer = styled.aside<{ $colorScheme: any }>`
  background: linear-gradient(180deg, 
    ${props => props.$colorScheme.colors.surface}95,
    ${props => props.$colorScheme.colors.background}80
  );
  backdrop-filter: blur(10px);
  border-left: 2px solid ${props => props.$colorScheme.colors.accent}20;
  padding: 2rem 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.$colorScheme.colors.background};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.$colorScheme.colors.accent}40;
    border-radius: 3px;
    
    &:hover {
      background: ${props => props.$colorScheme.colors.accent}60;
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`

const Section = styled.div<{ $colorScheme: any }>`
  background: linear-gradient(135deg, 
    ${props => props.$colorScheme.colors.surface}80,
    ${props => props.$colorScheme.colors.surface}40
  );
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.$colorScheme.colors.accent}20;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${props => props.$colorScheme.colors.accent}40;
    box-shadow: 0 8px 32px ${props => props.$colorScheme.colors.accent}20;
  }
`

const SectionTitle = styled.h3<{ $colorScheme: any }>`
  color: ${props => props.$colorScheme.colors.text};
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: ${props => props.$colorScheme.colors.accent};
    font-size: 1rem;
  }
`

const LeaderboardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const LeaderboardItem = styled.div<{ $colorScheme: any; $rank: number }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, 
    ${props => props.$colorScheme.colors.background}60,
    ${props => props.$colorScheme.colors.background}20
  );
  border-radius: 12px;
  border: 1px solid ${props => props.$colorScheme.colors.accent}15;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  ${props => props.$rank === 1 && css`
    background: linear-gradient(135deg, 
      ${props.$colorScheme.colors.accent}25,
      ${props.$colorScheme.colors.accent}10
    );
    border-color: ${props.$colorScheme.colors.accent}40;
    animation: ${pulse} 3s ease-in-out infinite;
  `}
  
  &:hover {
    border-color: ${props => props.$colorScheme.colors.accent}30;
    transform: translateY(-2px);
  }
`

const RankBadge = styled.div<{ $colorScheme: any; $rank: number }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.8rem;
  flex-shrink: 0;
  
  ${props => {
    if (props.$rank === 1) {
      return `
        background: linear-gradient(135deg, #FFD700, #FFA500);
        color: #1a1a1a;
        box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
      `
    } else {
      return `
        background: ${props.$colorScheme.colors.accent}30;
        color: ${props.$colorScheme.colors.text};
        border: 1px solid ${props.$colorScheme.colors.accent}40;
      `
    }
  }}
`

const PlayerInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const PlayerName = styled.div<{ $colorScheme: any }>`
  color: ${props => props.$colorScheme.colors.text};
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const PlayerWinnings = styled.div<{ $colorScheme: any }>`
  color: ${props => props.$colorScheme.colors.accent};
  font-size: 0.8rem;
  font-weight: 500;
  margin-top: 2px;
`

const JackpotDisplay = styled.div<{ $colorScheme: any }>`
  text-align: center;
  padding: 1rem;
  background: linear-gradient(135deg, 
    ${props => props.$colorScheme.colors.accent}20,
    ${props => props.$colorScheme.colors.accent}10
  );
  border-radius: 12px;
  border: 1px solid ${props => props.$colorScheme.colors.accent}30;
`

const JackpotAmount = styled.div<{ $colorScheme: any }>`
  color: ${props => props.$colorScheme.colors.accent};
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
`

const JackpotLabel = styled.div<{ $colorScheme: any }>`
  color: ${props => props.$colorScheme.colors.text};
  font-size: 0.8rem;
  opacity: 0.8;
`

export const RightSidebar: React.FC = () => {
  const location = useLocation()
  const { currentColorScheme } = useColorScheme()
  const { connected } = useWallet()
  const pool = useCurrentPool()
  const { data: leaderboardData, loading: leaderboardLoading } = useLeaderboardData('weekly', '')
  
  // Initialize stats hooks
  const globalStats = useGlobalGameStats() // For user profile sidebar
  const gameStats = useGameStats() // For individual game routes (will be overridden below)

  // Hot games data
  const hotGames = useMemo(() => [
    { name: 'Dice', status: 'Popular', emoji: '🎲' },
    { name: 'Plinko', status: 'Trending', emoji: '🏀' },
    { name: 'Mines', status: 'Hot', emoji: '💣' },
    { name: 'Slots', status: 'Classic', emoji: '🎰' }
  ], [])

  // Process leaderboard data
  const displayLeaderboard = useMemo(() => {
    if (!connected || leaderboardLoading || !leaderboardData?.length) {
      return [
        { name: 'No data yet', winnings: 'be the first!', rank: 1 }
      ]
    }

    if (leaderboardData.length > 0) {
      return leaderboardData.slice(0, 5).map((player, index) => ({
        name: player.user || `Player ${player.user?.slice(0, 4) || Math.random().toString(36).slice(2, 6)}`,
        winnings: `$${(player.usd_volume || 0).toFixed(2)}`,
        rank: index + 1
      }))
    }

    return [
      { name: 'No data yet', winnings: 'be the first!', rank: 1 }
    ]
  }, [connected, leaderboardData, leaderboardLoading])

  // Get contextual content based on current route
  const getContextualContent = () => {
    const path = location.pathname

    // Profile route
    if (path.includes('/profile')) {
      return (
        <>
          <Section $colorScheme={currentColorScheme}>
            <SectionTitle $colorScheme={currentColorScheme}>
              <FaUsers />
              Your Stats
            </SectionTitle>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
              {connected ? (
                <>
                  <div style={{ marginBottom: '0.5rem' }}>
                    Games Played: <strong style={{ color: currentColorScheme.colors.accent }}>
                      {globalStats.stats.gamesPlayed}
                    </strong>
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    Win Rate: <strong style={{ 
                      color: globalStats.winRate > 60 ? '#00ff41' : globalStats.winRate < 30 ? '#dc143c' : currentColorScheme.colors.accent 
                    }}>
                      {globalStats.winRate.toFixed(1)}%
                    </strong>
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    Total Wins: <strong style={{ color: '#00ff41' }}>
                      {globalStats.stats.wins}
                    </strong>
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    Total Losses: <strong style={{ color: '#dc143c' }}>
                      {globalStats.stats.losses}
                    </strong>
                  </div>
                  {globalStats.stats.gamesPlayed > 0 && (
                    <div style={{ 
                      textAlign: 'center', 
                      fontSize: '0.8rem', 
                      fontStyle: 'italic', 
                      marginTop: '1rem',
                      color: globalStats.isOnFire ? '#00ff41' : globalStats.isRekt ? '#dc143c' : 'inherit'
                    }}>
                      {globalStats.isOnFire && '🔥 You\'re on fire across all games!'}
                      {globalStats.isRekt && '💀 Tough run - maybe take a break?'}
                      {!globalStats.isOnFire && !globalStats.isRekt && '🎯 Steady gaming across all games!'}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ opacity: 0.7 }}>Connect wallet to view your statistics</div>
              )}
            </div>
          </Section>
        </>
      )
    }

    // Leaderboard route
    if (path === '/leaderboard') {
      return (
        <>
          <Section $colorScheme={currentColorScheme}>
            <SectionTitle $colorScheme={currentColorScheme}>
              <FaChartLine />
              Stats Overview
            </SectionTitle>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                Total Players: <strong>{leaderboardData?.length || 0}</strong>
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                Active Games: <strong>{ALL_GAMES.filter(g => g.live === 'up').length}</strong>
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                Rankings update weekly
              </div>
            </div>
          </Section>
        </>
      )
    }

    // Jackpot route
    if (path === '/jackpot') {
      return (
        <>
          <Section $colorScheme={currentColorScheme}>
            <SectionTitle $colorScheme={currentColorScheme}>
              <FaCoins />
              Jackpot Info
            </SectionTitle>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                Current Pool: <strong>
                  {connected && pool?.jackpotBalance ? (
                    <TokenValue amount={pool.jackpotBalance} />
                  ) : 'Connect to view'}
                </strong>
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                Win jackpots by playing games with max bets!
              </div>
            </div>
          </Section>
        </>
      )
    }

    // Token/Presale routes  
    if (path === '/token' || path === '/presale') {
      return (
        <>
          <Section $colorScheme={currentColorScheme}>
            <SectionTitle $colorScheme={currentColorScheme}>
              <FaCoins />
              Token Details
            </SectionTitle>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                Symbol: <strong>DGHRT</strong>
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                Network: <strong>Solana</strong>
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                Utility token for the DegenHeart ecosystem
              </div>
            </div>
          </Section>
        </>
      )
    }

    // Audit route
    if (path === '/audit') {
      return (
        <>
          <Section $colorScheme={currentColorScheme}>
            <SectionTitle $colorScheme={currentColorScheme}>
              <FaShieldAlt />
              Security Info
            </SectionTitle>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                Platform: <strong>Audited</strong>
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                Games: <strong>Provably Fair</strong>
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                All games use verifiable randomness
              </div>
            </div>
          </Section>
        </>
      )
    }

    // Game routes (check for individual games)
    const pathSegments = path.split('/')
    if (pathSegments.length >= 4 && pathSegments[1] === 'game') {
      const gameId = pathSegments[3]
      const currentGame = ALL_GAMES.find(game => game.id.toLowerCase() === gameId.toLowerCase())
      
      if (currentGame) {
        // Use game-specific stats for this game
        const currentGameStats = useGameStats(gameId)
        
        return (
          <>
            <Section $colorScheme={currentColorScheme}>
              <SectionTitle $colorScheme={currentColorScheme}>
                <FaChartBar />
                Live Game Stats
              </SectionTitle>
              
              <div style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: 'bold', 
                    color: currentColorScheme.colors.accent,
                    marginBottom: '0.25rem'
                  }}>
                    {currentGame.meta.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                    {currentGame.meta.category || 'Casino'} • {getGameRTP(currentGame.id)}% RTP
                  </div>
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontWeight: 'bold', 
                      color: currentColorScheme.colors.accent,
                      marginBottom: '0.25rem'
                    }}>
                      {currentGameStats.stats.gamesPlayed}
                    </div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.8, textTransform: 'uppercase' }}>
                      Games
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontWeight: 'bold', 
                      color: currentGameStats.stats.gamesPlayed > 0 
                        ? (currentGameStats.stats.wins / currentGameStats.stats.gamesPlayed) * 100 > 60 
                          ? '#00ff41' 
                          : currentColorScheme.colors.accent
                        : currentColorScheme.colors.accent,
                      marginBottom: '0.25rem'
                    }}>
                      {currentGameStats.stats.gamesPlayed > 0 
                        ? `${((currentGameStats.stats.wins / currentGameStats.stats.gamesPlayed) * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.8, textTransform: 'uppercase' }}>
                      Win Rate
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontWeight: 'bold', 
                      color: currentGameStats.stats.wins > currentGameStats.stats.losses ? '#00ff41' : currentColorScheme.colors.accent,
                      marginBottom: '0.25rem'
                    }}>
                      {currentGameStats.stats.wins}
                    </div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.8, textTransform: 'uppercase' }}>
                      Wins
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontWeight: 'bold', 
                      color: currentGameStats.stats.losses > currentGameStats.stats.wins ? '#dc143c' : currentColorScheme.colors.accent,
                      marginBottom: '0.25rem'
                    }}>
                      {currentGameStats.stats.losses}
                    </div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.8, textTransform: 'uppercase' }}>
                      Losses
                    </div>
                  </div>
                </div>
                
                {currentGameStats.stats.gamesPlayed > 0 && (
                  <>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7, textAlign: 'center', fontStyle: 'italic', marginBottom: '1rem' }}>
                      {((currentGameStats.stats.wins / currentGameStats.stats.gamesPlayed) * 100) > 60 
                        ? '🔥 You\'re on fire! Keep it up!'
                        : ((currentGameStats.stats.wins / currentGameStats.stats.gamesPlayed) * 100) < 30 && currentGameStats.stats.gamesPlayed > 5
                        ? '💀 Tough session, maybe take a break?'
                        : '🎯 Steady gaming, good luck!'
                      }
                    </div>
                    
                    <div style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => currentGameStats.resetStats()}
                        style={{
                          background: 'rgba(220, 20, 60, 0.15)',
                          border: '1px solid rgba(220, 20, 60, 0.3)',
                          borderRadius: '8px',
                          padding: '8px 16px',
                          color: '#dc143c',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          fontWeight: '600'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(220, 20, 60, 0.25)'
                          e.currentTarget.style.borderColor = 'rgba(220, 20, 60, 0.5)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(220, 20, 60, 0.15)'
                          e.currentTarget.style.borderColor = 'rgba(220, 20, 60, 0.3)'
                        }}
                      >
                        🔄 Reset Stats
                      </button>
                    </div>
                  </>
                )}
              </div>
            </Section>
          </>
        )
      }
    }

    // Default content for home and other routes
    return (
      <>
        <Section $colorScheme={currentColorScheme}>
          <SectionTitle $colorScheme={currentColorScheme}>
            <FaTrophy />
            Leaderboard
          </SectionTitle>
          
          <LeaderboardList>
            {displayLeaderboard.map((player) => (
              <LeaderboardItem 
                key={`${player.name}-${player.rank}`}
                $colorScheme={currentColorScheme}
                $rank={player.rank}
              >
                <RankBadge $colorScheme={currentColorScheme} $rank={player.rank}>
                  {player.rank === 1 ? <FaCrown /> : player.rank}
                </RankBadge>
                <PlayerInfo>
                  <PlayerName $colorScheme={currentColorScheme}>
                    {player.name}
                  </PlayerName>
                  <PlayerWinnings $colorScheme={currentColorScheme}>
                    {player.winnings}
                  </PlayerWinnings>
                </PlayerInfo>
              </LeaderboardItem>
            ))}
          </LeaderboardList>
        </Section>

        <Section $colorScheme={currentColorScheme}>
          <SectionTitle $colorScheme={currentColorScheme}>
            <FaCoins />
            Jackpot Pool
          </SectionTitle>
          
          <JackpotDisplay $colorScheme={currentColorScheme}>
            <JackpotAmount $colorScheme={currentColorScheme}>
              {connected && pool && pool.jackpotBalance ? (
                <TokenValue amount={pool.jackpotBalance} />
              ) : connected ? (
                'No Jackpot'
              ) : (
                'Connect Wallet'
              )}
            </JackpotAmount>
            <JackpotLabel $colorScheme={currentColorScheme}>
              {connected && pool && pool.jackpotBalance ? 'Total Jackpot' : 
               connected ? 'to see jackpot' : 'to see jackpot'}
            </JackpotLabel>
          </JackpotDisplay>
        </Section>

        <Section $colorScheme={currentColorScheme}>
          <SectionTitle $colorScheme={currentColorScheme}>
            <FaFire />
            Hot Games
          </SectionTitle>
          
          <LeaderboardList>
            {hotGames.map((game, index) => (
              <LeaderboardItem key={game.name} $colorScheme={currentColorScheme} $rank={index + 1}>
                <RankBadge $colorScheme={currentColorScheme} $rank={index + 1}>
                  {game.emoji}
                </RankBadge>
                <PlayerInfo>
                  <PlayerName $colorScheme={currentColorScheme}>
                    {game.name}
                  </PlayerName>
                  <PlayerWinnings $colorScheme={currentColorScheme}>
                    {game.status}
                  </PlayerWinnings>
                </PlayerInfo>
              </LeaderboardItem>
            ))}
          </LeaderboardList>
        </Section>
      </>
    )
  }

  return (
    <SidebarContainer $colorScheme={currentColorScheme}>
      {getContextualContent()}
    </SidebarContainer>
  )
}

export default RightSidebar
