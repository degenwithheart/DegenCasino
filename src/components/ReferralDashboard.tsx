import React from 'react'
import styled from 'styled-components'
import { GambaUi, TokenValue, useCurrentToken, useReferral } from 'gamba-react-ui-v2'
import { useWalletAddress } from 'gamba-react-v2'
import { truncateString } from '../utils'
import { useReferralAnalytics, useReferralCount } from '../hooks/useReferralAnalytics'
import { getReferralTierInfo, formatFeePercentage, getReferralsToNextTier } from '../utils/referralTier'
import { useWalletToast } from '../utils/solanaWalletToast'
import { generateUsernameFromWallet } from '../sections/userProfileUtils'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  position: relative;
  
  &::before {
    content: '🎁';
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 1.5rem;
    filter: drop-shadow(0 0 8px #ffd700);
  }
`

const SectionTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #ffd700;
  font-size: 1.2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const StatValue = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  color: #00ff88;
  margin-bottom: 0.25rem;
`

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const TierProgress = styled.div`
  margin: 1rem 0;
`

const TierInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`

const CurrentTier = styled.span`
  color: #ffd700;
  font-weight: 600;
`

const NextTier = styled.span`
  color: rgba(255, 255, 255, 0.7);
`

const ProgressBar = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  height: 8px;
  overflow: hidden;
  position: relative;
`

const ProgressFill = styled.div<{ progress: number }>`
  background: linear-gradient(90deg, #00ff88, #ffd700);
  height: 100%;
  width: ${props => props.progress * 100}%;
  transition: width 0.3s ease;
  border-radius: 8px;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`

const ShareButton = styled.div`
  .gamba-button {
    background: linear-gradient(90deg, #00ff88, #0099ff) !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 0.75rem 1.5rem !important;
    font-weight: 600 !important;
    color: #000 !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 0 16px rgba(0, 255, 136, 0.3) !important;
    
    &:hover {
      transform: scale(1.02) !important;
      box-shadow: 0 0 24px rgba(0, 255, 136, 0.5) !important;
    }
  }
`

const RecentReferrals = styled.div`
  margin-top: 1rem;
`

const ReferralList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
`

const ReferralItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.9rem;
`

const ReferralAddress = styled.span`
  color: #ffd700;
  font-weight: 600;
`

const ReferralStats = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
`

interface ReferralDashboardProps {
  className?: string
}

export function ReferralDashboard({ className }: ReferralDashboardProps) {
  const userAddress = useWalletAddress()
  const referral = useReferral()
  const token = useCurrentToken()
  const stats = useReferralAnalytics()
  const referralCount = useReferralCount(userAddress?.toBase58())
  const { showWalletToast } = useWalletToast()
  
  const tierInfo = getReferralTierInfo(referralCount)
  const referralsToNext = getReferralsToNextTier(referralCount)

  const handleCopyLink = async () => {
    try {
      await referral.copyLinkToClipboard()
      showWalletToast('REFERRAL_COPY_SUCCESS')
    } catch (error) {
      console.error('Failed to copy referral link:', error)
    }
  }

const shareTexts = {
    twitter: `🎰 Join me on DegenCasino! Get started with my referral link and we both win! 💰

${referral.referralLink}`,
    telegram: `🎯 Play at DegenCasino with my link and get a bonus! 🚀 ${referral.referralLink}`,
    discord: `Hey! Check out DegenCasino - provably fair gaming on Solana! 🎲 Use my link: ${referral.referralLink}`,
    whatsapp: `🎰 I'm playing DegenCasino and earning crypto! Join me: ${referral.referralLink}`
  }

  const handleShare = (platform: 'twitter' | 'telegram' | 'discord') => {
    const message = shareTexts[platform]
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`, '_blank')
        break
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(referral.referralLink || '')}&text=${encodeURIComponent('🎯 Play at DegenCasino with my link and get a bonus! 🚀')}`, '_blank')
        break
      case 'discord':
        navigator.clipboard.writeText(message)
        showWalletToast('REFERRAL_COPY_SUCCESS')
        break
    }
  }

  if (!userAddress) {
    return (
      <Container className={className}>
        <SectionTitle>🎁 Referral Dashboard</SectionTitle>
        <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
          Connect your wallet to view referral stats
        </div>
      </Container>
    )
  }

  return (
    <Container className={className}>
      <SectionTitle>🎁 Referral Dashboard</SectionTitle>
      
      {/* Stats Grid */}
      <StatsGrid>
        <StatCard>
          <StatValue>{referralCount}</StatValue>
          <StatLabel>Total Referrals</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{formatFeePercentage(tierInfo.currentFee)}</StatValue>
          <StatLabel>Current Rate</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>
            <TokenValue amount={stats.totalEarnings} mint={token.mint} />
          </StatValue>
          <StatLabel>Total Earned</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.recentReferrals.length}</StatValue>
          <StatLabel>Active This Month</StatLabel>
        </StatCard>
      </StatsGrid>

      {/* Tier Progress */}
      <TierProgress>
        <TierInfo>
          <CurrentTier>
            Tier {tierInfo.currentTier} • {formatFeePercentage(tierInfo.currentFee)}
          </CurrentTier>
          {tierInfo.nextTier && (
            <NextTier>
              Next: Tier {tierInfo.nextTier} • {formatFeePercentage(tierInfo.nextFee!)} ({referralsToNext} more)
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
          <GambaUi.Button onClick={() => handleShare('telegram')}>
            ✈️ Share on Telegram
          </GambaUi.Button>
        </ShareButton>
        <ShareButton>
          <GambaUi.Button onClick={() => handleShare('discord')}>
            💬 Copy for Discord
          </GambaUi.Button>
        </ShareButton>
      </ButtonGroup>

      {/* Recent Referrals */}
      {stats.recentReferrals.length > 0 && (
        <RecentReferrals>
          <h4 style={{ margin: '0 0 0.75rem 0', color: 'rgba(255, 255, 255, 0.9)' }}>
            Recent Referrals
          </h4>
          <ReferralList>
            {stats.recentReferrals.map((ref, index) => {
              const username = generateUsernameFromWallet(ref.address)
              return (
                <ReferralItem key={ref.address}>
                  <div>
                    <ReferralAddress>
                      {username} ({truncateString(ref.address, 6, 4)})
                    </ReferralAddress>
                    <ReferralStats>
                      {' • '}{ref.gameCount} games
                    </ReferralStats>
                  </div>
                  <ReferralStats>
                    <TokenValue amount={ref.totalWagered} mint={token.mint} />
                  </ReferralStats>
                </ReferralItem>
              )
            })}
          </ReferralList>
        </RecentReferrals>
      )}
    </Container>
  )
}
