import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import styled, { keyframes } from 'styled-components'
import { GambaUi, TokenValue, useCurrentToken } from 'gamba-react-ui-v2'
import { useWalletAddress } from 'gamba-react-v2'
import { Modal } from './Modal'
import { useReferralLeaderboard, ReferralLeaderboardEntry } from '../../../../hooks/analytics/useReferralAnalytics'
import { truncateString } from '../../../../utils'
import { formatTierDisplay, getReferralTierInfo } from '../../../../utils/user/referralTier'
import { generateUsernameFromWallet } from '../../../../utils/user/userProfileUtils'
import { useColorScheme } from '../../../../themes/ColorSchemeContext'
import { spacing, animations, media } from '../breakpoints'

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

const ModalContent = styled.div<{ $colorScheme?: any }>`
  width: 100%;
  max-width: 700px;
  padding: ${spacing['3xl']};
  background: linear-gradient(135deg,
    rgba(24, 24, 24, 0.95),
    rgba(15, 15, 35, 0.98)
  );
  backdrop-filter: blur(25px);
  border: 1px solid ${props => props.$colorScheme?.colors?.primary || '#ffd700'}30;
  border-radius: 24px;
  color: white;
  position: relative;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.4),
    0 0 80px ${props => props.$colorScheme?.colors?.primary || '#ffd700'}20,
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: ${quantumDissolve} 0.6s cubic-bezier(0.7,0.2,0.2,1);
  margin: auto;

  ${media.maxMobile} {
    margin: ${spacing.base};
    padding: ${spacing.xl};
    max-width: calc(100vw - 2rem);
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
    border-radius: 20px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg,
      ${props => props.$colorScheme?.colors?.primary || '#ffd700'},
      ${props => props.$colorScheme?.colors?.accent || '#a259ff'},
      ${props => props.$colorScheme?.colors?.primary || '#ffd700'}
    );
    border-radius: 24px 24px 0 0;
  }
`

const Header = styled.div`
  text-align: center;
  margin-bottom: ${spacing['3xl']};
  
  ${media.maxMobile} {
    margin-bottom: ${spacing.xl};
  }
`

const Title = styled.h2<{ $colorScheme?: any }>`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 ${spacing.sm} 0;
  background: linear-gradient(135deg,
    ${props => props.$colorScheme?.colors?.primary || '#ffd700'},
    ${props => props.$colorScheme?.colors?.accent || '#a259ff'}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 20px ${props => props.$colorScheme?.colors?.primary || '#ffd700'}50;
  
  ${media.maxMobile} {
    font-size: 1.6rem;
  }
`

const Subtitle = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-weight: 500;
  
  ${media.maxMobile} {
    font-size: 0.9rem;
  }
`

const LeaderboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.base};
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.3);
    border-radius: 4px;
    
    &:hover {
      background: rgba(255, 215, 0, 0.5);
    }
  }

  ${media.maxMobile} {
    max-height: 350px;
    gap: ${spacing.sm};
  }
`

const LeaderboardEntry = styled.div<{ $isUser: boolean; $colorScheme?: any }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing.lg};
  background: ${props => props.$isUser
    ? `linear-gradient(135deg,
        ${props.$colorScheme?.colors?.primary || '#ffd700'}20,
        ${props.$colorScheme?.colors?.accent || '#a259ff'}20
      )`
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))'
  };
  border: 1px solid ${props => props.$isUser 
    ? props.$colorScheme?.colors?.primary || '#ffd700'
    : 'rgba(255, 255, 255, 0.08)'
  };
  border-radius: 16px;
  transition: all ${animations.duration.fast} ${animations.easing.easeOut};
  position: relative;
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-2px);
    background: ${props => props.$isUser
      ? `linear-gradient(135deg,
          ${props.$colorScheme?.colors?.primary || '#ffd700'}30,
          ${props.$colorScheme?.colors?.accent || '#a259ff'}30
        )`
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04))'
    };
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }

  ${props => props.$isUser && `
    animation: ${glowPulse} 2s infinite;
    box-shadow: 0 0 20px ${props.$colorScheme?.colors?.primary || '#ffd700'}30;
  `}

  ${media.maxMobile} {
    padding: ${spacing.base};
    flex-direction: column;
    align-items: flex-start;
    gap: ${spacing.sm};
    border-radius: 12px;
  }
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.base};
  flex: 1;

  ${media.maxMobile} {
    width: 100%;
    justify-content: space-between;
  }
`

const RankBadge = styled.div<{ $rank: number; $colorScheme?: any }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-weight: 700;
  font-size: 1rem;
  color: #000;
  background: ${props => {
    if (props.$rank === 1) return 'linear-gradient(135deg, #FFD700, #FFA500)'
    if (props.$rank === 2) return 'linear-gradient(135deg, #C0C0C0, #A8A8A8)'
    if (props.$rank === 3) return 'linear-gradient(135deg, #CD7F32, #B8860B)'
    return `linear-gradient(135deg, ${props.$colorScheme?.colors?.primary || '#ffd700'}80, ${props.$colorScheme?.colors?.accent || '#a259ff'}80)`
  }};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  
  ${media.maxMobile} {
    width: 36px;
    height: 36px;
    font-size: 0.9rem;
  }
`

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
  flex: 1;
`

const Username = styled.div<{ $colorScheme?: any }>`
  font-weight: 600;
  font-size: 1rem;
  color: ${props => props.$colorScheme?.colors?.primary || '#ffd700'};
  text-shadow: 0 0 6px ${props => props.$colorScheme?.colors?.primary || '#ffd700'}40;

  ${media.maxMobile} {
    font-size: 0.9rem;
  }
`

const UserAddress = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  font-family: monospace;

  ${media.maxMobile} {
    font-size: 0.75rem;
  }
`

const Stats = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${spacing.xs};
  text-align: right;

  ${media.maxMobile} {
    align-items: flex-start;
    text-align: left;
    width: 100%;
  }
`

const StatValue = styled.div<{ $colorScheme?: any }>`
  font-weight: 700;
  font-size: 1rem;
  color: ${props => props.$colorScheme?.colors?.accent || '#00ff88'};
  text-shadow: 0 0 6px ${props => props.$colorScheme?.colors?.accent || '#00ff88'}40;

  ${media.maxMobile} {
    font-size: 0.9rem;
  }
`

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${media.maxMobile} {
    font-size: 0.7rem;
  }
`

const TierBadge = styled.span<{ $colorScheme?: any }>`
  background: linear-gradient(135deg,
    ${props => props.$colorScheme?.colors?.primary || '#ffd700'}20,
    ${props => props.$colorScheme?.colors?.accent || '#a259ff'}20
  );
  color: ${props => props.$colorScheme?.colors?.primary || '#ffd700'};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid ${props => props.$colorScheme?.colors?.primary || '#ffd700'}30;

  ${media.maxMobile} {
    padding: 4px ${spacing.xs};
    font-size: 0.65rem;
  }
`

const EmptyStateText = styled.div`
  text-align: center;
  padding: ${spacing['3xl']} ${spacing.xl};
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  line-height: 1.6;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.base};

  &::before {
    content: '🎯';
    font-size: 2rem;
    opacity: 0.6;
  }

  ${media.maxMobile} {
    padding: ${spacing['2xl']} ${spacing.base};
    font-size: 1rem;
  }
`

const CloseButton = styled.button<{ $colorScheme?: any }>`
  position: absolute;
  top: ${spacing.base};
  right: ${spacing.base};
  background: none;
  border: none;
  color: ${props => props.$colorScheme?.colors?.primary || '#ffd700'};
  font-size: 1.5rem;
  cursor: pointer;
  padding: ${spacing.sm};
  border-radius: 8px;
  transition: all ${animations.duration.fast} ${animations.easing.easeOut};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.1);
  }

  ${media.maxMobile} {
    font-size: 1.3rem;
    padding: ${spacing.xs};
  }
`

interface ReferralLeaderboardModalProps {
  onClose: () => void
}

export function ReferralLeaderboardModal({ onClose }: ReferralLeaderboardModalProps) {
  const userAddress = useWalletAddress()
  const token = useCurrentToken()
  const leaderboard = useReferralLeaderboard(20) // Show top 20
  const { currentColorScheme } = useColorScheme()
  
  const userKey = userAddress?.toBase58()

  return ReactDOM.createPortal(
    <Modal isOpen={true} onClose={onClose}>
      <ModalContent $colorScheme={currentColorScheme}>
        <CloseButton onClick={onClose} $colorScheme={currentColorScheme}>
          ×
        </CloseButton>
        
        <Header>
          <Title $colorScheme={currentColorScheme}>🏆 Referral Leaderboard</Title>
          <Subtitle>Top players by referral performance</Subtitle>
        </Header>

        <LeaderboardContainer>
          {leaderboard.length === 0 ? (
            <EmptyStateText>
              Be the first to appear on the leaderboard!
              <br />
              Start inviting friends to earn rewards and climb the ranks.
            </EmptyStateText>
          ) : (
            leaderboard.map((entry, index) => {
              const rank = index + 1
              const isUser = entry.address === userKey
              const username = generateUsernameFromWallet(entry.address)
              const tierInfo = getReferralTierInfo(entry.referralCount)

              return (
                <LeaderboardEntry 
                  key={entry.address} 
                  $isUser={isUser}
                  $colorScheme={currentColorScheme}
                >
                  <UserInfo>
                    <RankBadge $rank={rank} $colorScheme={currentColorScheme}>
                      {rank}
                    </RankBadge>
                    <UserDetails>
                      <Username $colorScheme={currentColorScheme}>
                        {username}
                        {isUser && ' (You)'}
                      </Username>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' }}>
                        <UserAddress>
                          {truncateString(entry.address, 6, 4)}
                        </UserAddress>
                        <TierBadge $colorScheme={currentColorScheme}>
                          {formatTierDisplay(tierInfo)}
                        </TierBadge>
                      </div>
                    </UserDetails>
                  </UserInfo>
                  
                  <Stats>
                    <div style={{ display: 'flex', gap: spacing.lg }}>
                      <div>
                        <StatValue $colorScheme={currentColorScheme}>
                          {entry.referralCount}
                        </StatValue>
                        <StatLabel>Referrals</StatLabel>
                      </div>
                      <div>
                        <StatValue $colorScheme={currentColorScheme}>
                          <TokenValue amount={entry.totalEarnings} mint={token.mint} />
                        </StatValue>
                        <StatLabel>Earnings</StatLabel>
                      </div>
                    </div>
                  </Stats>
                </LeaderboardEntry>
              )
            })
          )}
        </LeaderboardContainer>
      </ModalContent>
    </Modal>,
    document.body
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
    isOpen,
    openModal,
    closeModal,
    Modal,
  }
}