import React, { useState } from 'react'
import styled from 'styled-components'
import { GambaUi, TokenValue, useCurrentToken } from 'gamba-react-ui-v2'
import { useWalletAddress } from 'gamba-react-v2'
import { Modal } from './Modal'
import { useReferralLeaderboard, ReferralLeaderboardEntry } from '../hooks/useReferralAnalytics'
import { truncateString } from '../utils'
import { formatTierDisplay, getReferralTierInfo } from '../utils/referralTier'
import { generateUsernameFromWallet } from '../sections/userProfileUtils'

const ModalContent = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(24, 24, 24, 0.95) 0%, rgba(32, 32, 48, 0.95) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  color: white;
  position: relative;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 60px rgba(255, 215, 0, 0.1);
  
  @media (max-width: 600px) {
    margin: 1rem;
    padding: 1.5rem;
    max-width: calc(100vw - 2rem);
  }
`

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
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

const LeaderboardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 400px;
  overflow-y: auto;
  
  /* Custom scrollbar */
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
  margin-bottom: 0.5rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 50px 1fr 100px;
    gap: 0.5rem;
    font-size: 0.8rem;
  }
`

const HeaderRank = styled.div``
const HeaderPlayer = styled.div``
const HeaderReferrals = styled.div`
  @media (max-width: 600px) {
    display: none;
  }
`
const HeaderEarnings = styled.div``

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
`

const ReferralCount = styled.div`
  font-weight: 600;
  color: #00ff88;
  text-align: center;
  
  @media (max-width: 600px) {
    display: none;
  }
`

const EarningsAmount = styled.div`
  font-weight: 600;
  color: white;
  text-align: right;
  font-size: 0.9rem;
`

const LoadingText = styled.div`
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
`

const EmptyStateText = styled.div`
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  line-height: 1.5;
`

interface ReferralLeaderboardModalProps {
  onClose: () => void
}

export function ReferralLeaderboardModal({ onClose }: ReferralLeaderboardModalProps) {
  const userAddress = useWalletAddress()
  const token = useCurrentToken()
  const leaderboard = useReferralLeaderboard(20)
  const [isLoading, setIsLoading] = useState(false)

  const userKey = userAddress?.toBase58()

  return (
    <Modal onClose={onClose}>
      <ModalContent>
        <HeaderSection>
          <Title>Referral Leaderboard</Title>
          <Subtitle>
            Top referrers by total earnings • Updated in real-time
          </Subtitle>
        </HeaderSection>

        {isLoading ? (
          <LoadingText>Loading leaderboard...</LoadingText>
        ) : leaderboard.length === 0 ? (
          <EmptyStateText>
            No referral data available yet.<br />
            Start inviting friends to appear on the leaderboard!
          </EmptyStateText>
        ) : (
          <LeaderboardList>
            <ListHeader>
              <HeaderRank>Rank</HeaderRank>
              <HeaderPlayer>Player</HeaderPlayer>
              <HeaderReferrals>Referrals</HeaderReferrals>
              <HeaderEarnings>Earnings</HeaderEarnings>
            </ListHeader>

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
                    <PlayerAddress title={entry.address}>
                      {isCurrentUser ? 'You' : `${username} (${truncateString(entry.address, 6, 4)})`}
                    </PlayerAddress>
                    <PlayerTier>
                      {formatTierDisplay(tierInfo)}
                    </PlayerTier>
                  </PlayerInfo>
                  
                  <ReferralCount>
                    {entry.referralCount}
                  </ReferralCount>
                  
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
      </ModalContent>
    </Modal>
  )
}

// Export hook for easy usage
export function useReferralLeaderboardModal() {
  const [isOpen, setIsOpen] = useState(false)
  
  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)
  
  const Modal = isOpen ? (
    <ReferralLeaderboardModal onClose={closeModal} />
  ) : null
  
  return {
    openModal,
    closeModal,
    Modal,
    isOpen,
  }
}
