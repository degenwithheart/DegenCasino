// src/components/LeaderboardsModal.tsx
import React, { useState } from 'react'
// Use the main Modal component with full quantum portal effects
import { Modal } from '../../components'
import {
  useLeaderboardData,
  Period,
  Player,
} from '../../hooks/useLeaderboardData'
import { useTheme } from '../../themes/ThemeContext'
import { TOKEN_METADATA } from '../../constants'
import { useTokenPrices } from '../../hooks/useTokenPrices'
import { generateUsernameFromWallet } from '../../utils/userProfileUtils'

import {
  ModalContent,
  HeaderSection,
  HeaderTop,
  RefreshButton,
  Title,
  Subtitle,
  TabRow,
  TabButton,
  LeaderboardList,
  ListHeader,
  HeaderRank,
  HeaderPlayer,
  HeaderVolume,
  RankItem,
  RankNumber,
  PlayerInfo,
  PlayerLink,
  VolumeAmount,
  formatVolume,
  LoadingText,
  ErrorText,
  EmptyStateText,
} from './LeaderboardsModal.styles'

interface LeaderboardsModalProps {
  onClose: () => void
  creator: string
}

interface LeaderboardsContentProps {
  creator: string
}

export const LeaderboardsContent: React.FC<LeaderboardsContentProps> = ({
  creator,
}) => {
  const [period, setPeriod] = useState<Period>('weekly') // default
  const theme = useTheme()

  const {
    data: leaderboard,
    loading,
    error,
    refresh,
  } = useLeaderboardData(period, creator)

  // Get current token prices to convert USD back to SOL
  const tokenMetadata = useTokenPrices()
  
  // Helper function to convert USD volume to SOL volume
  const convertUsdToSol = (usdVolume: number): number => {
    const solToken = tokenMetadata.find(token => 
      token.mint.toBase58() === 'So11111111111111111111111111111111111111112'
    )
    if (!solToken || !solToken.usdPrice || solToken.usdPrice === 0) {
      // Fallback to a reasonable SOL price if not available
      return usdVolume / 180 // Approximate SOL price fallback
    }
    return usdVolume / solToken.usdPrice
  }

  // Helper function to format SOL volume (replacing formatVolume for SOL display)
  const formatSolVolume = (usdVolume: number): string => {
    const solVolume = convertUsdToSol(usdVolume)
    return `${solVolume.toFixed(2)} SOL`
  }

  return (
    <ModalContent $theme={theme}>
      {/* ────── header ────── */}
      <HeaderSection>
        <HeaderTop>
          <Title $theme={theme}>Leaderboard</Title>
          <RefreshButton 
            $theme={theme}
            onClick={refresh}
            disabled={loading}
            title="Refresh leaderboard data"
          >
            🔄
          </RefreshButton>
        </HeaderTop>
        <Subtitle $theme={theme}>
          Top players by wager{' '}
          {period === 'weekly' ? 'this week' : 'this month'} (SOL)
        </Subtitle>
      </HeaderSection>

      {/* ────── tabs ────── */}
      <TabRow $theme={theme}>
        <TabButton
          $selected={period === 'weekly'}
          $theme={theme}
          onClick={() => setPeriod('weekly')}
          disabled={loading}
        >
          Weekly
        </TabButton>

        <TabButton
          $selected={period === 'monthly'}
          $theme={theme}
          onClick={() => setPeriod('monthly')}
          disabled={loading}
        >
          Monthly
        </TabButton>
      </TabRow>

      {/* ────── body ────── */}
      {loading ? (
        <LoadingText $theme={theme}>Loading...</LoadingText>
      ) : error ? (
        <ErrorText $theme={theme}>{error}</ErrorText>
      ) : leaderboard && leaderboard.length > 0 ? (
        <LeaderboardList>
          <ListHeader $theme={theme}>
            <HeaderRank>Rank</HeaderRank>
            <HeaderPlayer>Player</HeaderPlayer>
            <HeaderVolume>Wagered&nbsp;(SOL)</HeaderVolume>
          </ListHeader>

          {leaderboard.map((entry: Player, index) => {
            const rank = index + 1
            const username = generateUsernameFromWallet(entry.user)
            const solscanUrl = `https://solscan.io/account/${entry.user}`
            
            return (
              <RankItem key={entry.user} $isTop3={rank <= 3} $theme={theme}>
                <RankNumber rank={rank} $theme={theme}>{rank > 3 ? rank : ''}</RankNumber>
                <PlayerLink 
                  $theme={theme} 
                  href={solscanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`${username} - View on Solscan: ${entry.user}`}
                >
                  {username}
                </PlayerLink>
                <VolumeAmount $theme={theme}>{formatSolVolume(entry.usd_volume)}</VolumeAmount>
              </RankItem>
            )
          })}
        </LeaderboardList>
      ) : (
        <EmptyStateText $theme={theme}>Coming soon.</EmptyStateText>
      )}
    </ModalContent>
  )
}

const LeaderboardsModal: React.FC<LeaderboardsModalProps> = ({
  onClose,
  creator,
}) => {
  return (
    <Modal onClose={onClose}>
      <LeaderboardsContent creator={creator} />
    </Modal>
  )
}

export default LeaderboardsModal
