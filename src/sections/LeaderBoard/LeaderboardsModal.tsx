// src/components/LeaderboardsModal.tsx
import React, { useState } from 'react'
// If Modal exists elsewhere, update the import path accordingly, for example:
import { Modal } from './Modal'
// Or, if Modal should be defined locally, create a Modal.tsx file in the same directory with a basic Modal component.
import {
  useLeaderboardData,
  Period,
  Player,            // exported from the hook
} from '../../hooks/useLeaderboardData'
import { useTheme } from '../../themes/ThemeContext'

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
  const theme = useTheme()

  const {
    data: leaderboard,
    loading,
    error,
  } = useLeaderboardData(period, creator)

  return (
    <ModalContent $theme={theme}>
      {/* ────── header ────── */}
      <HeaderSection>
        <Title $theme={theme}>Leaderboard</Title>
        <Subtitle $theme={theme}>
          Top players by volume{' '}
          {period === 'weekly' ? 'this week' : 'this month'} (USD)
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
            <HeaderVolume>Volume&nbsp;(USD)</HeaderVolume>
          </ListHeader>

          {leaderboard.map((entry: Player, index) => {
            const rank = index + 1
            return (
              <RankItem key={entry.user} $isTop3={rank <= 3} $theme={theme}>
                <RankNumber rank={rank} $theme={theme}>{rank > 3 ? rank : ''}</RankNumber>
                <PlayerInfo $theme={theme} title={entry.user}>{entry.user}</PlayerInfo>
                <VolumeAmount $theme={theme}>{formatVolume(entry.usd_volume)}</VolumeAmount>
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
