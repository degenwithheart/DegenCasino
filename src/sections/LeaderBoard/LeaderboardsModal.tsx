// src/components/LeaderboardsModal.tsx
import React, { useState } from 'react'
// Use the main Modal component with full quantum portal effects
import { Modal } from '../../components'
import {
  useLeaderboardData,
  Period,
  Player,
} from '../../hooks/data/useLeaderboardData'
import { useColorScheme } from '../../themes/ColorSchemeContext'

import {
  ModalContent,
  HeaderSection,
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
  const colorScheme = useColorScheme()

  const {
    data: leaderboard,
    loading,
    error,
  } = useLeaderboardData(period, creator)

  return (
    <ModalContent $colorScheme={colorScheme}>
      {/* ────── header ────── */}
      <HeaderSection>
        <Title $colorScheme={colorScheme}>Leaderboard</Title>
        <Subtitle $colorScheme={colorScheme}>
          Top players by volume{' '}
          {period === 'weekly' ? 'this week' : 'this month'} (USD)
        </Subtitle>
      </HeaderSection>

      {/* ────── tabs ────── */}
      <TabRow $colorScheme={colorScheme}>
        <TabButton
          $selected={period === 'weekly'}
          $colorScheme={colorScheme}
          onClick={() => setPeriod('weekly')}
          disabled={loading}
        >
          Weekly
        </TabButton>

        <TabButton
          $selected={period === 'monthly'}
          $colorScheme={colorScheme}
          onClick={() => setPeriod('monthly')}
          disabled={loading}
        >
          Monthly
        </TabButton>
      </TabRow>

      {/* ────── body ────── */}
      {loading ? (
        <LoadingText $colorScheme={colorScheme}>Loading...</LoadingText>
      ) : error ? (
        <ErrorText $colorScheme={colorScheme}>{error}</ErrorText>
      ) : leaderboard && leaderboard.length > 0 ? (
        <LeaderboardList>
          <ListHeader $colorScheme={colorScheme}>
            <HeaderRank>Rank</HeaderRank>
            <HeaderPlayer>Player</HeaderPlayer>
            <HeaderVolume>Volume&nbsp;(USD)</HeaderVolume>
          </ListHeader>

          {leaderboard.map((entry: Player, index) => {
            const rank = index + 1
            return (
              <RankItem key={entry.user} $isTop3={rank <= 3} $colorScheme={colorScheme}>
                <RankNumber rank={rank} $colorScheme={colorScheme}>{rank > 3 ? rank : ''}</RankNumber>
                <PlayerInfo $colorScheme={colorScheme} title={entry.user}>{entry.user}</PlayerInfo>
                <VolumeAmount $colorScheme={colorScheme}>{formatVolume(entry.usd_volume)}</VolumeAmount>
              </RankItem>
            )
          })}
        </LeaderboardList>
      ) : (
        <EmptyStateText $colorScheme={colorScheme}>Coming soon.</EmptyStateText>
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
