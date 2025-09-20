import React from 'react'
import styled from 'styled-components'
import { GambaUi, TokenValue, useCurrentToken } from 'gamba-react-ui-v2'
import { useWalletAddress } from 'gamba-react-v2'
import { useReferralLeaderboard, ReferralLeaderboardEntry } from '../../hooks/analytics/useReferralAnalytics'
import { truncateString } from '../../utils'
import { getReferralTierInfo, formatTierDisplay } from '../../utils/user/referralTier'
import { generateUsernameFromWallet } from '../../utils/user/userProfileUtils'
import { useUserStore } from '../../hooks/data/useUserStore'

const Container = styled.div`
  width: 100%;
  max-width: none;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  overflow: hidden;
`

const HeaderSection = styled.div`
  text-align: center;
  padding: 2rem 1.5rem 1rem;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(162, 89, 255, 0.1));
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const Title = styled.h2`
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffd700;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &::before {
    content: '🏆';
    font-size: 1.2em;
  }
`

const Subtitle = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  line-height: 1.4;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: rgba(255, 255, 255, 0.6);
`

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.7;
`

const EmptyTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  color: #ffd700;
`

const EmptyDescription = styled.p`
  margin: 0 0 1.5rem 0;
  font-size: 0.95rem;
  line-height: 1.5;
`

const LeaderboardContent = styled.div`
  padding: 1.5rem;
`

const ListHeader = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr 120px 100px;
  gap: 1rem;
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 50px 1fr 100px;
    gap: 0.5rem;
    font-size: 0.8rem;
  }
`

const HeaderReferrals = styled.div`
  @media (max-width: 600px) {
    display: none;
  }
`

const LeaderboardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const RankItem = styled.div<{ $isTop3: boolean; $isCurrentUser?: boolean }>`
  display: grid;
  grid-template-columns: 60px 1fr 120px 100px;
  gap: 1rem;
  padding: 1rem;
  background: ${props => 
    props.$isCurrentUser 
      ? 'rgba(255, 215, 0, 0.1)' 
      : props.$isTop3 
        ? 'rgba(255, 255, 255, 0.08)' 
        : 'rgba(255, 255, 255, 0.03)'
  };
  border: ${props => 
    props.$isCurrentUser 
      ? '1px solid rgba(255, 215, 0, 0.3)' 
      : '1px solid rgba(255, 255, 255, 0.05)'
  };
  border-radius: 12px;
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
      width: 3px;
      background: linear-gradient(180deg, #ffd700, #ff8c00);
      border-radius: 12px 0 0 12px;
    }
  `}
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 50px 1fr 100px;
    gap: 0.5rem;
    padding: 0.75rem;
  }
`

const RankNumber = styled.div<{ rank: number }>`
  font-size: ${props => props.rank <= 3 ? '1.2rem' : '1rem'};
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
  gap: 0.25rem;
`

const PlayerAddress = styled.div`
  font-weight: 600;
  color: #ffd700;
  font-size: 0.95rem;
`

const PlayerTier = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

const ReferralCount = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  
  @media (max-width: 600px) {
    display: none;
  }
`

const EarningsValue = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #00ff88;
  text-align: right;
`

export function FullReferralLeaderboard() {
  const currentUser = useWalletAddress()
  const leaderboard = useReferralLeaderboard()
  const token = useCurrentToken()
  const user = useUserStore()

  const openInviteModal = () => {
    user.set({ 
      userModal: true, 
      userModalInitialTab: 'invite' 
    })
  }

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <Container>
        <HeaderSection>
          <Title>Referral Champions</Title>
          <Subtitle>Top referrers earn the most rewards</Subtitle>
        </HeaderSection>
        <EmptyState>
          <EmptyIcon>🏆</EmptyIcon>
          <EmptyTitle>Be the first to appear on the referral leaderboard!</EmptyTitle>
          <EmptyDescription>
            Start inviting friends to earn rewards and see your name here!
          </EmptyDescription>
          <GambaUi.Button 
            main 
            onClick={openInviteModal}
          >
            Start Referring Friends
          </GambaUi.Button>
        </EmptyState>
      </Container>
    )
  }

  return (
    <Container>
      <HeaderSection>
        <Title>Referral Champions</Title>
        <Subtitle>Top referrers earning the most rewards</Subtitle>
      </HeaderSection>
      
      <LeaderboardContent>
        <ListHeader>
          <div>Rank</div>
          <div>Player</div>
          <HeaderReferrals>Referrals</HeaderReferrals>
          <div>Earnings</div>
        </ListHeader>
        
        <LeaderboardList>
          {leaderboard.map((entry: any, index: number) => {
            const rank = index + 1
            const isTop3 = rank <= 3
            const isCurrentUser = currentUser?.toBase58() === entry.address
            const tierInfo = getReferralTierInfo(entry.referralCount)
            const username = generateUsernameFromWallet(entry.address)
            
            return (
              <RankItem key={entry.address} $isTop3={isTop3} $isCurrentUser={isCurrentUser}>
                <RankNumber rank={rank} />
                
                <PlayerInfo>
                  <PlayerAddress>
                    {isCurrentUser ? 'You' : `${username} (${truncateString(entry.address)})`}
                  </PlayerAddress>
                  <PlayerTier>
                    {formatTierDisplay(tierInfo)}
                  </PlayerTier>
                </PlayerInfo>
                
                <ReferralCount>
                  {entry.referralCount.toLocaleString()}
                </ReferralCount>
                
                <EarningsValue>
                  {token && (
                    <TokenValue 
                      mint={token.mint} 
                      amount={entry.totalEarnings} 
                      exact 
                    />
                  )}
                </EarningsValue>
              </RankItem>
            )
          })}
        </LeaderboardList>
      </LeaderboardContent>
    </Container>
  )
}
