import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { GambaUi, TokenValue, useCurrentToken, useReferral } from 'gamba-react-ui-v2';
import { useWalletAddress } from 'gamba-react-v2';
import { truncateString } from '../../../../utils';
import { useReferralAnalytics, useReferralCount } from '../../../../hooks/analytics/useReferralAnalytics';
import { getReferralTierInfo, getReferralsToNextTier, formatTierDisplay } from '../../../../utils/user/referralTier';
import { useWalletToast } from '../../../../utils/wallet/solanaWalletToast';
import { generateUsernameFromWallet } from '../../../../utils/user/userProfileUtils';
import { spacing, animations, media } from '../breakpoints';

// Modern TikTok/Instagram inspired container
const Container = styled.div<{ $colorScheme?: any; }>`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
  padding: ${spacing.xl};
  background: linear-gradient(135deg,
    rgba(24, 24, 24, 0.95),
    rgba(15, 15, 35, 0.98)
  );
  border-radius: 24px;
  border: 1px solid ${props => props.$colorScheme?.colors?.primary || '#ffd700'}30;
  backdrop-filter: blur(20px);
  position: relative;
  width: 100%;
  max-width: none;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  &::before {
    content: '🎁';
    position: absolute;
    top: -12px;
    right: -12px;
    font-size: 1.8rem;
    filter: drop-shadow(0 0 12px ${props => props.$colorScheme?.colors?.primary || '#ffd700'});
    animation: ${animations.easing.bounce} 2s infinite;
  }

  ${media.maxMobile} {
    padding: ${spacing.lg};
    gap: ${spacing.base};
    border-radius: 20px;
    
    &::before {
      font-size: 1.5rem;
      top: -10px;
      right: -10px;
    }
  }
`;

const SectionTitle = styled.h3<{ $colorScheme?: any; }>`
  margin: 0 0 ${spacing.base} 0;
  color: ${props => props.$colorScheme?.colors?.primary || '#ffd700'};
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  text-shadow: 0 0 10px ${props => props.$colorScheme?.colors?.primary || '#ffd700'}50;

  ${media.maxMobile} {
    font-size: 1.2rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: ${spacing.base};
  margin-bottom: ${spacing['2xl']};

  ${media.maxMobile} {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: ${spacing.sm};
    margin-bottom: ${spacing.lg};
  }
`;

const StatCard = styled.div<{ $colorScheme?: any; }>`
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.08),
    rgba(255, 255, 255, 0.03)
  );
  border-radius: 16px;
  padding: ${spacing.lg};
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all ${animations.duration.fast} ${animations.easing.easeOut};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg,
      ${props => props.$colorScheme?.colors?.primary || '#ffd700'},
      ${props => props.$colorScheme?.colors?.accent || '#a259ff'}
    );
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.12),
      rgba(255, 255, 255, 0.06)
    );
  }

  ${media.maxMobile} {
    padding: ${spacing.base};
    border-radius: 12px;
  }
`;

const StatValue = styled.div<{ $colorScheme?: any; }>`
  font-size: 1.6rem;
  font-weight: 700;
  color: ${props => props.$colorScheme?.colors?.accent || '#00ff88'};
  margin-bottom: ${spacing.xs};
  text-shadow: 0 0 8px ${props => props.$colorScheme?.colors?.accent || '#00ff88'}50;

  ${media.maxMobile} {
    font-size: 1.4rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;

  ${media.maxMobile} {
    font-size: 0.8rem;
  }
`;

const TierProgress = styled.div`
  margin: ${spacing.base} 0;
`;

const TierInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.sm};
  font-size: 0.95rem;
  flex-wrap: wrap;
  gap: ${spacing.xs};

  ${media.maxMobile} {
    font-size: 0.85rem;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const CurrentTier = styled.span<{ $colorScheme?: any; }>`
  color: ${props => props.$colorScheme?.colors?.primary || '#ffd700'};
  font-weight: 700;
  text-shadow: 0 0 6px ${props => props.$colorScheme?.colors?.primary || '#ffd700'}50;
`;

const NextTier = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;

  ${media.maxMobile} {
    font-size: 0.8rem;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled.div<{ progress: number; $colorScheme?: any; }>`
  width: ${props => props.progress * 100}%;
  height: 100%;
  background: linear-gradient(90deg,
    ${props => props.$colorScheme?.colors?.primary || '#ffd700'},
    ${props => props.$colorScheme?.colors?.accent || '#a259ff'}
  );
  transition: width ${animations.duration.slow} ${animations.easing.easeOut};
  box-shadow: 0 0 10px ${props => props.$colorScheme?.colors?.primary || '#ffd700'}60;
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${spacing.base};
  margin-top: ${spacing.lg};

  ${media.maxMobile} {
    grid-template-columns: 1fr;
    gap: ${spacing.sm};
  }
`;

const ShareButton = styled.div<{ $colorScheme?: any; }>`
  .gamba-button {
    background: linear-gradient(135deg,
      ${props => props.$colorScheme?.colors?.primary || '#ffd700'},
      ${props => props.$colorScheme?.colors?.accent || '#a259ff'}
    ) !important;
    border: none !important;
    border-radius: 12px !important;
    padding: ${spacing.base} ${spacing.lg} !important;
    font-weight: 600 !important;
    color: #000 !important;
    transition: all ${animations.duration.fast} ${animations.easing.easeOut} !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
    
    &:hover {
      transform: scale(1.02) !important;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3) !important;
    }

    &:active {
      transform: scale(0.98) !important;
    }

    ${media.maxMobile} {
      padding: ${spacing.sm} ${spacing.base} !important;
      font-size: 0.9rem !important;
    }
  }
`;

const RecentReferrals = styled.div`
  margin-top: ${spacing['2xl']};
`;

const ReferralList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  max-height: 250px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.3);
    border-radius: 3px;
    
    &:hover {
      background: rgba(255, 215, 0, 0.5);
    }
  }
`;

const ReferralItem = styled.div<{ $colorScheme?: any; }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.base};
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.02)
  );
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.9rem;
  transition: all ${animations.duration.fast} ${animations.easing.easeOut};

  &:hover {
    background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.08),
      rgba(255, 255, 255, 0.04)
    );
    border-color: ${props => props.$colorScheme?.colors?.primary || '#ffd700'}30;
  }

  ${media.maxMobile} {
    padding: ${spacing.sm};
    font-size: 0.85rem;
    flex-direction: column;
    align-items: flex-start;
    gap: ${spacing.xs};
  }
`;

const ReferralLink = styled(Link)`
  display: block;
  text-decoration: none;
  color: inherit;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.12);
    border-radius: 12px;
  }
`;

const ReferralAddress = styled.span<{ $colorScheme?: any; }>`
  color: ${props => props.$colorScheme?.colors?.primary || '#ffd700'};
  font-weight: 600;
  text-shadow: 0 0 4px ${props => props.$colorScheme?.colors?.primary || '#ffd700'}40;
`;

const ReferralStats = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  font-weight: 500;

  ${media.maxMobile} {
    font-size: 0.75rem;
  }
`;

interface ReferralDashboardProps {
  className?: string;
}

export function ReferralDashboard({ className }: ReferralDashboardProps) {
  const userAddress = useWalletAddress();
  const referral = useReferral();
  const token = useCurrentToken();
  const stats = useReferralAnalytics();
  const referralCount = useReferralCount(userAddress?.toBase58());
  const { showWalletToast } = useWalletToast();

  const tierInfo = getReferralTierInfo(referralCount);
  const referralsToNext = getReferralsToNextTier(referralCount);

  const handleCopyLink = async () => {
    try {
      await referral.copyLinkToClipboard();
      showWalletToast('REFERRAL_COPY_SUCCESS');
    } catch (error) {
      console.error('Failed to copy referral link:', error);
    }
  };

  const shareTexts = {
    twitter: `🎰 Join me on DegenCasino! Get started with my referral link and we both win! 💰

${referral.referralLink}`,
    discord: `🎰 **DegenCasino Invite** 🎰

Join me for some epic gaming! Use my referral link:
${referral.referralLink}`,
  };

  const handleShare = (platform: 'twitter' | 'discord') => {
    const text = shareTexts[platform];
    if (platform === 'twitter') {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
      window.open(twitterUrl, '_blank');
    } else if (platform === 'discord') {
      // Copy to clipboard for Discord
      navigator.clipboard.writeText(text);
      showWalletToast('REFERRAL_COPY_SUCCESS');
    }
  };

  return (
    <Container className={className}>
      <SectionTitle>
        🎁 Referral Dashboard
      </SectionTitle>

      {/* Stats Overview */}
      <StatsGrid>
        <StatCard>
          <StatValue>{referralCount}</StatValue>
          <StatLabel>Total Referrals</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>
            <TokenValue amount={stats.totalEarnings} mint={token.mint} />
          </StatValue>
          <StatLabel>Total Earned</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{tierInfo.displayFee}%</StatValue>
          <StatLabel>{tierInfo.isFinancialMode ? 'Current Fee' : 'Target Fee'}</StatLabel>
        </StatCard>
      </StatsGrid>

      {/* Tier Progress */}
      <TierProgress>
        <TierInfo>
          <CurrentTier>
            {formatTierDisplay(tierInfo)}
          </CurrentTier>
          {tierInfo.nextTier && (
            <NextTier>
              Next: {tierInfo.nextTierData?.badge} {tierInfo.nextTierData?.name} • {tierInfo.isFinancialMode ? `${tierInfo.nextFee}% target` : 'Badge'} ({referralsToNext} more)
            </NextTier>
          )}
        </TierInfo>
        <ProgressBar>
          <ProgressFill progress={tierInfo.progress} />
        </ProgressBar>
      </TierProgress>

      {/* Action Buttons */}
      <ButtonGroup>
        <ShareButton>
          <GambaUi.Button onClick={handleCopyLink}>
            📋 Copy Referral Link
          </GambaUi.Button>
        </ShareButton>
        <ShareButton>
          <GambaUi.Button onClick={() => handleShare('twitter')}>
            🐦 Share on X
          </GambaUi.Button>
        </ShareButton>
        <ShareButton>
          <GambaUi.Button onClick={() => handleShare('discord')}>
            💬 Share on Discord
          </GambaUi.Button>
        </ShareButton>
      </ButtonGroup>

      {/* Recent Referrals */}
      {stats.recentReferrals.length > 0 && (
        <RecentReferrals>
          <SectionTitle>
            👥 Recent Referrals
          </SectionTitle>
          <ReferralList>
            {stats.recentReferrals.map((ref, index) => {
              const username = generateUsernameFromWallet(ref.address);
              return (
                <ReferralLink key={ref.address} to={`/explorer/player/${ref.address}`} title={ref.address}>
                  <ReferralItem>
                    <div>
                      <ReferralAddress>
                        {username} — {ref.address.slice(-4)}
                      </ReferralAddress>
                      <ReferralStats>
                        {' • '}{ref.gameCount} games
                      </ReferralStats>
                    </div>
                    <ReferralStats>
                      <TokenValue amount={ref.totalWagered} mint={token.mint} />
                    </ReferralStats>
                  </ReferralItem>
                </ReferralLink>
              );
            })}
          </ReferralList>
        </RecentReferrals>
      )}
    </Container>
  );
}