import React from 'react'
import styled from 'styled-components'
import { GambaUi, TokenValue, useCurrentToken } from 'gamba-react-ui-v2'
import { useWalletAddress } from 'gamba-react-v2'
import { useReferralLeaderboard, ReferralLeaderboardEntry } from '../../hooks/useReferralAnalytics'
import { truncateString } from '../../utils'
import { getReferralTierInfo, formatTierDisplay } from '../../utils/referralTier'
import { useReferralLeaderboardModal } from './ReferralLeaderboardModal'
import { generateUsernameFromWallet } from '../../utils/userProfileUtils'

const Container = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '🏆';
    position: absolute;
    top: -8px;
    right: -8px;
    font-size: 1.3rem;
    filter: drop-shadow(0 0 8px #ffd700);
    z-index: 1;
  }
`

const Header = styled.div`
  padding: 1.5rem 1.5rem 0.75rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const Title = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #ffd700;
  font-size: 1.3rem;
  font-weight: 700;
  text-shadow: 0 0 12px rgba(255, 215, 0, 0.3);
`

const Subtitle = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  line-height: 1.3;
`

const LeaderboardList = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 280px;
  overflow-y: auto;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.3);
    border-radius: 2px;
    
    &:hover {
      background: rgba(255, 215, 0, 0.5);
    }
  }
`

const RankItem = styled.div<{ $isTop3: boolean; $isCurrentUser?: boolean }>`
  display: grid;
  grid-template-columns: 40px 1fr auto;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${props => 
    props.$isCurrentUser 
      ? 'rgba(255, 215, 0, 0.08)' 
      : props.$isTop3 
        ? 'rgba(255, 255, 255, 0.06)' 
        : 'rgba(255, 255, 255, 0.03)'
  };
  border: ${props => 
    props.$isCurrentUser 
      ? '1px solid rgba(255, 215, 0, 0.2)' 
      : '1px solid rgba(255, 255, 255, 0.05)'
  };
  border-radius: 8px;
  align-items: center;
  transition: all 0.2s ease;
  position: relative;
  
  ${props => props.$isTop3 && `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 2px;
      background: linear-gradient(180deg, #ffd700, #ff8c00);
      border-radius: 8px 0 0 8px;
    }
  `}
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-1px);
  }
`

const RankNumber = styled.div<{ rank: number }>`
  font-size: ${props => props.rank <= 3 ? '1rem' : '0.9rem'};
  font-weight: 700;
  color: ${props => {
    if (props.rank === 1) return '#ffd700'
    if (props.rank === 2) return '#c0c0c0'
    if (props.rank === 3) return '#cd7f32'
    return 'rgba(255, 255, 255, 0.7)'
  }};
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: ${props => {
      if (props.rank === 1) return "'🥇'"
      if (props.rank === 2) return "'🥈'"
      if (props.rank === 3) return "'🥉'"
      return `'${props.rank}'`
    }};
  }
`

const PlayerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
`

const PlayerAddress = styled.div`
  font-weight: 600;
  color: #ffd700;
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
`

const PlayerTier = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
`

const EarningsAmount = styled.div`
  font-weight: 600;
  color: white;
  text-align: right;
  font-size: 0.85rem;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  line-height: 1.4;
`

const ViewAllButton = styled.div`
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  .gamba-button {
    width: 100%;
    background: linear-gradient(90deg, #ffd700, #a259ff) !important;
    border: none !important;
    border-radius: 8px !important;
    color: #000 !important;
    font-weight: 600 !important;
    font-size: 0.9rem !important;
    padding: 0.75rem !important;
    
    &:hover {
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3) !important;
    }
  }
`

export function CompactReferralLeaderboard() {
  const userAddress = useWalletAddress()
  const token = useCurrentToken()
  const leaderboard = useReferralLeaderboard(5) // Show top 5
  const leaderboardModal = useReferralLeaderboardModal()
  
  const userKey = userAddress?.toBase58()

  return (
    <>
      <Container>
        <Header>
          <Title>🏆 Top Referrers</Title>
          <Subtitle>Leading players by referral earnings</Subtitle>
        </Header>

        {leaderboard.length === 0 ? (
          <EmptyState>
            Be the first to appear on the<br />referral leaderboard!<br />
            <span style={{ fontSize: '0.8rem', marginTop: '0.5rem', display: 'block' }}>
              Start inviting friends to earn rewards
            </span>
          </EmptyState>
        ) : (
          <LeaderboardList>
            {leaderboard.map((entry, index) => {
              const rank = index + 1
              const isCurrentUser = entry.address === userKey
              const tierInfo = getReferralTierInfo(entry.referralCount)
              const username = generateUsernameFromWallet(entry.address)
              
              return (
                <RankItem 
                  key={entry.address} 
                  $isTop3={rank <= 3}
                  $isCurrentUser={isCurrentUser}
                >
                  <RankNumber rank={rank} />
                  
                  <PlayerInfo>
                    <PlayerAddress>
                      {isCurrentUser ? 'You' : `${username} (${truncateString(entry.address, 6, 4)})`}
                    </PlayerAddress>
                    <PlayerTier>
                      {entry.referralCount} referrals • {tierInfo.currentTierData.badge} {tierInfo.currentTierData.name}
                    </PlayerTier>
                  </PlayerInfo>
                  
                  <EarningsAmount>
                    <TokenValue 
                      amount={entry.totalEarnings} 
                      mint={token.mint}
                      exact
                    />
                  </EarningsAmount>
                </RankItem>
              )
            })}
          </LeaderboardList>
        )}

        <ViewAllButton>
          <GambaUi.Button onClick={leaderboardModal.openModal}>
            View Full Leaderboard
          </GambaUi.Button>
        </ViewAllButton>
      </Container>
      
      {leaderboardModal.Modal}
    </>
  )
}
