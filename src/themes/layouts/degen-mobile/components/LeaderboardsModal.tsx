// src/components/LeaderboardsModal.tsx
import React from 'react'
// Use the main Modal component with full quantum portal effects
import { Modal } from './Modal'
import {
  useLeaderboardData,
  Period,
  Player,
} from '../../../../hooks/data/useLeaderboardData'
import { useColorScheme } from '../../../../themes/ColorSchemeContext'

import {
  ModalContent,
  HeaderSection,
  Title,
  Subtitle,
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
  const period: Period = 'alltime' // Only all-time now
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
          Top players by wagered amount (SOL)
        </Subtitle>
      </HeaderSection>

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
            <HeaderVolume>Wagered</HeaderVolume>
          </ListHeader>

          {leaderboard.map((entry: Player, index) => {
            const rank = index + 1
            return (
              <RankItem key={entry.user} $isTop3={rank <= 3} $colorScheme={colorScheme}>
                <RankNumber rank={rank} $colorScheme={colorScheme}>{rank > 3 ? rank : ''}</RankNumber>
                <PlayerInfo $colorScheme={colorScheme} title={entry.user}>{entry.user}</PlayerInfo>
                <VolumeAmount $colorScheme={colorScheme}>{formatVolume(entry.sol_volume)}</VolumeAmount>
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
    <Modal isOpen={true} onClose={onClose}>
      <LeaderboardsContent creator={creator} />
    </Modal>
  )
}

export default LeaderboardsModal
