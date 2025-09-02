import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import styled, { keyframes } from 'styled-components'
import { GambaUi, TokenValue, useCurrentToken } from 'gamba-react-ui-v2'
import { useWalletAddress } from 'gamba-react-v2'
import { Modal } from '../Modal/Modal'
import { useReferralLeaderboard, ReferralLeaderboardEntry } from '../../hooks/useReferralAnalytics'
import { truncateString } from '../../utils'
import { formatTierDisplay, getReferralTierInfo } from '../../utils/referralTier'
import { generateUsernameFromWallet } from '../../utils/userProfileUtils'

const quantumDissolve = keyframes`
  0% { opacity: 0; filter: blur(12px); transform: scale(0.8) rotate(-5deg); }
  60% { opacity: 1; filter: blur(2px); transform: scale(1.05) rotate(1deg); }
  100% { opacity: 1; filter: blur(0); transform: scale(1) rotate(0deg); }
`

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.2);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3);
  }
`

const ModalContent = styled.div`
  width: 100%;
  max-width: 700px;
  padding: 2.5rem;
  background: linear-gradient(135deg, rgba(15, 18, 27, 0.95) 0%, rgba(24, 24, 24, 0.95) 100%);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 24px;
  color: white;
  position: relative;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.4),
    0 0 80px rgba(255, 215, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: ${quantumDissolve} 0.6s cubic-bezier(0.7,0.2,0.2,1);
  margin: auto;

  @media (max-width: 600px) {
    margin: 1rem;
    padding: 1.5rem;
    max-width: calc(100vw - 2rem);
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
    border-radius: 20px;
  }
`

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #ffd700, transparent);
    border-radius: 1px;
  }
`

const Title = styled.h2`
  margin: 0 0 0.75rem 0;
  font-size: 2.2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  letter-spacing: -0.5px;

  &::before {
    content: '🏆';
    font-size: 1.4em;
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
  }

  @media (max-width: 600px) {
    font-size: 1.8rem;
  }
`

const Subtitle = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.75);
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 400;
  max-width: 400px;
  margin: 0 auto;
`

const LeaderboardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 450px;
  overflow-y: auto;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgba(255, 215, 0, 0.4) 0%, rgba(255, 140, 0, 0.4) 100%);
    border-radius: 4px;

    &:hover {
      background: linear-gradient(180deg, rgba(255, 215, 0, 0.6) 0%, rgba(255, 140, 0, 0.6) 100%);
    }
  }
`

const ListHeader = styled.div`
  display: grid;
  grid-template-columns: 70px 1fr 120px 120px;
  gap: 1rem;
  padding: 1rem 1.25rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid rgba(255, 215, 0, 0.2);
  margin-bottom: 0.5rem;
  background: rgba(255, 215, 0, 0.05);
  border-radius: 12px;

  @media (max-width: 600px) {
    grid-template-columns: 60px 1fr 100px;
    gap: 0.75rem;
    font-size: 0.8rem;
    padding: 0.75rem;
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
  grid-template-columns: 70px 1fr 120px 120px;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: ${props =>
    props.$isCurrentUser
      ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 140, 0, 0.1) 100%)'
      : props.$isTop3
        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)'
        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(24, 24, 24, 0.02) 100%)'
  };
  border: ${props =>
    props.$isCurrentUser
      ? '1px solid rgba(255, 215, 0, 0.4)'
      : props.$isTop3
        ? '1px solid rgba(255, 215, 0, 0.2)'
        : '1px solid rgba(255, 255, 255, 0.08)'
  };
  border-radius: 16px;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  ${props => props.$isTop3 && `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: linear-gradient(180deg, #ffd700, #ff8c00, #ff6b35);
      border-radius: 16px 0 0 16px;
      box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
    }
  `}

  ${props => props.$isCurrentUser && `
    animation: ${glowPulse} 2s ease-in-out infinite;
  `}

  &:hover {
    background: ${props =>
      props.$isCurrentUser
        ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 140, 0, 0.15) 100%)'
        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)'
    };
    transform: translateY(-2px);
    box-shadow:
      0 8px 25px rgba(0, 0, 0, 0.3),
      0 0 20px rgba(255, 215, 0, 0.1);
    border-color: ${props =>
      props.$isCurrentUser
        ? 'rgba(255, 215, 0, 0.6)'
        : 'rgba(255, 215, 0, 0.3)'
    };
  }

  @media (max-width: 600px) {
    grid-template-columns: 60px 1fr 100px;
    gap: 0.75rem;
    padding: 1rem;
    border-radius: 12px;

    ${props => props.$isTop3 && `
      &::before {
        width: 3px;
      }
    `}
  }
`

const RankNumber = styled.div<{ rank: number }>`
  font-size: ${props => props.rank <= 3 ? '1.4rem' : '1.1rem'};
  font-weight: 800;
  color: ${props => {
    if (props.rank === 1) return '#ffd700'
    if (props.rank === 2) return '#c0c0c0'
    if (props.rank === 3) return '#cd7f32'
    return 'rgba(255, 255, 255, 0.8)'
  }};
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: ${props => props.rank <= 3 ? '0 0 10px rgba(255, 215, 0, 0.5)' : 'none'};

  &::before {
    content: ${props => {
      if (props.rank === 1) return "'🥇'"
      if (props.rank === 2) return "'🥈'"
      if (props.rank === 3) return "'🥉'"
      return `'${props.rank}'`
    }};
    font-size: ${props => props.rank <= 3 ? '1.2em' : '1em'};
  }
`

const PlayerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const PlayerAddress = styled.div`
  font-weight: 700;
  color: #ffd700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::after {
    content: ${props => props.title ? "'👤'" : "''"};
    font-size: 0.8em;
    opacity: 0.7;
  }
`

const PlayerTier = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.65);
  background: rgba(255, 255, 255, 0.05);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  width: fit-content;

  &::before {
    content: '🏅';
    font-size: 0.7em;
  }
`

const ReferralCount = styled.div`
  font-weight: 700;
  color: #00ff88;
  text-align: center;
  background: rgba(0, 255, 136, 0.1);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(0, 255, 136, 0.2);
  font-size: 0.9rem;

  @media (max-width: 600px) {
    display: none;
  }
`

const EarningsAmount = styled.div`
  font-weight: 700;
  color: white;
  text-align: right;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const LoadingText = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  &::before {
    content: '⏳';
    font-size: 2rem;
    opacity: 0.6;
  }
`

const EmptyStateText = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  line-height: 1.6;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  &::before {
    content: '🎯';
    font-size: 2rem;
    opacity: 0.6;
  }
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
    <>
      {ReactDOM.createPortal(
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
        </Modal>,
        document.body
      )}
    </>
  )
}

// Export hook for easy usage
export function useReferralLeaderboardModal() {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  const Modal = isOpen ? (
    ReactDOM.createPortal(
      <ReferralLeaderboardModal onClose={closeModal} />,
      document.body
    )
  ) : null

  return {
    openModal,
    closeModal,
    Modal,
    isOpen,
  }
}
