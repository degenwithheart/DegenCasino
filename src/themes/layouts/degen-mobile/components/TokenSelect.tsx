import React from 'react'
import { FeesTab } from '../../../../components/Transaction/FeesTab'
import { PublicKey } from '@solana/web3.js'
import {
  FAKE_TOKEN_MINT,
  GambaPlatformContext,
  GambaUi,
  PoolToken,
  useCurrentToken,
  useTokenMeta,
  useTokenBalance,
  useReferral,
} from 'gamba-react-ui-v2'
import { useWalletAddress } from 'gamba-react-v2'
import { PLATFORM_SHARABLE_URL } from '../../../../constants'
import styled from 'styled-components'
import { POOLS, PLATFORM_ALLOW_REFERRER_REMOVAL, PLATFORM_REFERRAL_FEE } from '../../../../constants'
import { truncateString } from '../../../../utils'
import { generateUsernameFromWallet } from '../../../../utils/user/userProfileUtils'
import { useToast } from '../../../../hooks/ui/useToast'
import { useWalletToast } from '../../../../utils/wallet/solanaWalletToast'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useReferralCount } from '../../../../hooks/analytics/useReferralAnalytics'
import { getReferralTierInfo, getReferralsToNextTier, formatTierDisplay } from '../../../../utils/user/referralTier'
import { useColorScheme } from '../../../../themes/ColorSchemeContext'
import NetworkToggle from '../../../../components/Network/NetworkToggle'
import { useNetwork } from '../../../../contexts/NetworkContext'
import { spacing, components, animations, media } from '../breakpoints'

const TokensContainer = styled.div<{ $colorScheme?: any }>`
  background: linear-gradient(135deg,
    ${props => props.$colorScheme?.colors?.surface || 'rgba(24, 24, 24, 0.95)'},
    ${props => props.$colorScheme?.colors?.background || 'rgba(15, 15, 35, 0.98)'}
  );
  border-radius: 20px;
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.$colorScheme?.colors?.primary || 'rgba(255, 215, 0, 0.2)'};
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  padding: ${spacing.lg};
  max-height: 450px;
  overflow-y: auto;
  position: relative;

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.$colorScheme?.colors?.primary || '#ffd700'}50;
    border-radius: 3px;

    &:hover {
      background: ${props => props.$colorScheme?.colors?.primary || '#ffd700'}70;
    }
  }

  ${media.maxMobile} {
    padding: ${spacing.base};
    border-radius: 12px;
    max-height: 350px;
  }
`

const TokenSection = styled.div`
  margin-bottom: ${spacing.lg};

  &:last-child {
    margin-bottom: 0;
  }
`

const TokenSectionTitle = styled.h3<{ $colorScheme?: any }>`
  color: ${props => props.$colorScheme?.colors?.primary || '#ffd700'};
  font-size: 1rem;
  margin: 0 0 ${spacing.base} 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${spacing.sm};

  &::before {
    content: '💎';
    font-size: 1.2rem;
  }
`

const TokenGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: ${spacing.base};

  ${media.maxMobile} {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: ${spacing.sm};
  }

  ${media.maxMobile} {
    grid-template-columns: 1fr;
    gap: ${spacing.xs};
  }
`

const TokenCard = styled.button<{ $selected?: boolean; $colorScheme?: any }>`
  width: 100%;
  background: ${props => props.$selected
    ? `linear-gradient(135deg, ${props.$colorScheme?.colors?.primary || '#ffd700'}20, ${props.$colorScheme?.colors?.accent || '#a259ff'}15)`
    : 'linear-gradient(135deg, rgba(24, 24, 24, 0.9), rgba(15, 15, 35, 0.95))'
  };
  border: 2px solid ${props => props.$selected
    ? props.$colorScheme?.colors?.primary || '#ffd700'
    : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: ${props => props.$selected
    ? `0 8px 24px ${props.$colorScheme?.colors?.primary || '#ffd700'}30`
    : '0 4px 12px rgba(0, 0, 0, 0.2)'
  };
  padding: ${spacing.lg} ${spacing.base};
  cursor: pointer;
  color: ${props => props.$selected 
    ? props.$colorScheme?.colors?.primary || '#ffd700'
    : props.$colorScheme?.colors?.text || '#ffffff'};
  font-weight: 700;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${spacing.sm};
  transition: all ${animations.duration.normal} ${animations.easing.easeOut};
  min-height: 64px;
  position: relative;
  overflow: hidden;

  ${media.maxMobile} {
    padding: ${spacing.sm};
    border-radius: 10px;
    font-size: 0.9rem;
    gap: ${spacing.xs};
    min-height: 52px;
  }

  &:hover {
    background: ${props => props.$colorScheme?.colors?.primary || '#ffd700'}10;
    border-color: ${props => props.$colorScheme?.colors?.primary || '#ffd700'};
    transform: translateY(-2px);
    box-shadow: 0 8px 24px ${props => props.$colorScheme?.colors?.primary || '#ffd700'}20;
  }

  &:active {
    transform: translateY(0);
  }
`

const StyledTokenImage = styled.img<{ $colorScheme?: any }>`
  height: 48px;
  width: 48px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 8px ${props => props.$colorScheme?.colors?.primary || '#ffd700'}60;
  border: 2px solid ${props => props.$colorScheme?.colors?.primary || '#ffd700'}30;

  ${media.maxMobile} {
    height: 40px;
    width: 40px;
  }
`

const SectionHeading = styled.h2<{ $colorScheme?: any }>`
  color: ${props => props.$colorScheme?.colors?.primary || '#ffd700'};
  margin: ${spacing.xl} 0 ${spacing.base} 0;
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
  text-shadow: 0 0 8px ${props => props.$colorScheme?.colors?.primary || '#ffd700'}50;

  ${media.maxMobile} {
    margin: ${spacing.lg} 0 ${spacing.sm} 0;
    font-size: 1.1rem;
  }
`

const ToggleContainer = styled.div`
  display: flex;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.lg};
  flex-wrap: wrap;
  justify-content: center;

  ${media.maxMobile} {
    gap: ${spacing.xs};
    margin-bottom: ${spacing.base};
  }
`

const ToggleButton = styled.button<{ $active: boolean; $colorScheme?: any }>`
  flex: 1;
  min-width: 100px;
  padding: ${spacing.sm} ${spacing.lg};
  background: ${props => props.$active
    ? `linear-gradient(135deg, ${props.$colorScheme?.colors?.primary || '#ffd700'}, ${props.$colorScheme?.colors?.accent || '#a259ff'})`
    : 'transparent'
  };
  color: ${props => props.$active
    ? '#000'
    : props.$colorScheme?.colors?.text || '#ffd700'
  };
  border: 2px solid ${props => props.$colorScheme?.colors?.primary || '#ffd700'};
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.9rem;
  transition: all ${animations.duration.fast} ${animations.easing.easeOut};
  position: relative;
  overflow: hidden;

  ${media.maxMobile} {
    padding: ${spacing.xs} ${spacing.base};
    font-size: 0.85rem;
    min-width: 80px;
  }

  &:hover {
    background: ${props => props.$active
      ? `linear-gradient(135deg, ${props.$colorScheme?.colors?.primary || '#ffd700'}cc, ${props.$colorScheme?.colors?.accent || '#a259ff'}cc)`
      : `${props.$colorScheme?.colors?.primary || '#ffd700'}10`
    };
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.$colorScheme?.colors?.primary || '#ffd700'}30;
  }

  &:active {
    transform: translateY(0);
  }
`

function TokenSelectItem({ mint }: { mint: PublicKey }) {
  const meta = useTokenMeta(mint)
  const balance = useTokenBalance(mint)
  const { currentColorScheme } = useColorScheme()

  const rawBalance = balance.balance ?? 0
  const decimals = meta.decimals ?? 9
  const tokenBalance = rawBalance / 10 ** decimals

  const formattedBalance = tokenBalance.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })

  const isFreeToken = mint.equals(FAKE_TOKEN_MINT)

  return (
    <>
      <StyledTokenImage
        src={meta.image}
        alt={meta.symbol}
        $colorScheme={currentColorScheme}
      />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '4px',
        flex: 1,
        minWidth: 0
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          width: '100%'
        }}>
          <span style={{
            color: currentColorScheme?.colors?.primary || '#ffd700',
            fontWeight: 700,
            fontSize: '0.95rem'
          }}>
            {meta.symbol}
          </span>
          {isFreeToken && (
            <span style={{
              color: '#00ff88',
              fontWeight: 600,
              fontSize: '0.75rem',
              background: 'rgba(0,255,136,0.15)',
              padding: '2px 6px',
              borderRadius: '6px',
              border: '1px solid rgba(0,255,136,0.3)'
            }}>
              FREE
            </span>
          )}
        </div>
        <span style={{
          color: `${currentColorScheme?.colors?.text || '#ffffff'}70`,
          fontWeight: 500,
          fontSize: '0.8rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {formattedBalance}
        </span>
      </div>
    </>
  )
}

export default function TokenSelect({ setSelectedMint, selectedMint, initialTab }: {
  setSelectedMint?: (mint: PublicKey) => void,
  selectedMint?: PublicKey,
  initialTab?: 'free' | 'live' | 'tokens' | 'fees' | 'invite',
}) {
  const context = React.useContext(GambaPlatformContext) as any
  const selectedToken = useCurrentToken()
  const userAddress = useWalletAddress()
  const referralCount = useReferralCount(userAddress?.toBase58())
  const tierInfo = getReferralTierInfo(referralCount)
  const referralsToNext = getReferralsToNextTier(referralCount)
  const { currentColorScheme } = useColorScheme()

  const [mode, setMode] = React.useState<'tokens' | 'fees' | 'invite'>(
    initialTab === 'free' || initialTab === 'live' ? 'tokens' : initialTab || 'tokens'
  )
  const referral = useReferral()
  const [removing, setRemoving] = React.useState(false)
  const toast = useToast()
  const { showWalletToast } = useWalletToast()
  const walletModal = useWalletModal()

  const [priorityFee, setPriorityFee] = React.useState<number>(() => {
    const saved = localStorage.getItem('priorityFee')
    return saved ? Number(saved) : 400201
  })

  React.useEffect(() => {
    localStorage.setItem('priorityFee', String(priorityFee))
  }, [priorityFee])

  // Get all tokens (both free and live) for the combined view
  const getAllTokens = () => {
    return POOLS // Return all pools
  }

  const tokensToShow = mode === 'tokens' ? getAllTokens() : []

  const handleModeChange = (newMode: 'tokens' | 'fees' | 'invite') => {
    setMode(newMode)
    if (newMode === 'fees' || newMode === 'invite') return
    const pools = getAllTokens()
    if (setSelectedMint && pools.length > 0) {
      setSelectedMint(pools[0].token)
    }
  }

  const selectPool = (pool: PoolToken) => {
    context.setPool(pool.token, pool.authority)
    if (setSelectedMint) {
      setSelectedMint(pool.token)
    }
  }

  const removeInvite = async () => {
    try {
      setRemoving(true)
      await referral.removeInvite()
    } finally {
      setRemoving(false)
    }
  }

  return (
    <>
      <ToggleContainer>
        <ToggleButton $active={mode === 'tokens'} $colorScheme={currentColorScheme} onClick={() => handleModeChange('tokens')}>
          💰 Tokens
        </ToggleButton>
        <ToggleButton $active={mode === 'fees'} $colorScheme={currentColorScheme} onClick={() => handleModeChange('fees')}>
          ⚡ Fees
        </ToggleButton>
        <ToggleButton $active={mode === 'invite'} $colorScheme={currentColorScheme} onClick={() => handleModeChange('invite')}>
          🎁 Invite
        </ToggleButton>
      </ToggleContainer>

      {mode === 'invite' ? (
        <div>
          <SectionHeading $colorScheme={currentColorScheme}>🎁 Referral System</SectionHeading>
          {/* Enhanced info box with tier information */}
          <div
            style={{
              background: 'rgba(120, 80, 255, 0.13)',
              borderRadius: 14,
              padding: '16px 18px',
              margin: '16px 0 18px 0',
              color: '#fff',
              fontWeight: 500,
              fontSize: 15,
              boxShadow: '0 2px 8px rgba(120,80,255,0.10)',
              maxWidth: 440,
              width: '100%',
              marginLeft: 'auto',
              marginRight: 'auto',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
            }}
          >
            <span style={{fontSize:20,marginRight:8,marginTop:2,opacity:0.85}}>🎁</span>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '8px' }}>
                <span style={{color:'#ffd700',fontWeight:700}}>
                  {tierInfo.isFinancialMode ? 'Current Rate:' : 'Current Status:'}
                </span>{' '}
                <span style={{color:'#00ff88',fontWeight:700}}>
                  {tierInfo.isFinancialMode 
                    ? `${tierInfo.currentFee}% of every bet`
                    : `${tierInfo.currentTierData.badge} ${tierInfo.currentTierData.name} Badge`
                  }
                </span>
                {tierInfo.isFinancialMode && ' your friends make!'}
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                You have <span style={{color:'#ffd700', fontWeight: 600}}>{referralCount}</span> referrals
                {tierInfo.nextTier && (
                  <span> • {referralsToNext} more for <span style={{color:'#00ff88', fontWeight: 600}}>
                    {tierInfo.nextTierData?.badge} {tierInfo.nextTierData?.name} {tierInfo.isFinancialMode ? `${tierInfo.nextFee}%` : 'Badge'}
                  </span></span>
                )}
              </div>
            </div>
          </div>
          
          {/* Tier Progress Bar */}
          {tierInfo.nextTier && (
            <div
              style={{
                background: 'rgba(24,24,24,0.5)',
                borderRadius: 10,
                padding: '12px 14px',
                margin: '0 0 12px 0',
                maxWidth: 440,
                width: '100%',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '6px',
                fontSize: '13px'
              }}>
                <span style={{color:'#ffd700',fontWeight:600}}>
                  Tier Progress
                </span>
                <span style={{color:'rgba(255,255,255,0.7)'}}>
                  {referralCount}/{tierInfo.nextTier}
                </span>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '4px',
                height: '6px',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: 'linear-gradient(90deg, #00ff88, #ffd700)',
                  height: '100%',
                  width: `${tierInfo.progress * 100}%`,
                  transition: 'width 0.3s ease',
                  borderRadius: '4px'
                }} />
              </div>
            </div>
          )}
          {/* Invite Link row styled like Transaction Priority Fee row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(24,24,24,0.5)',
              borderRadius: 10,
              padding: '10px 14px',
              margin: '0 0 18px 0',
              maxWidth: 440,
              width: '100%',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <span style={{color:'#ffd700',fontWeight:600,fontSize:15}}>Invite Link</span>
            <div style={{ minWidth: 120, fontWeight: 700, fontSize: 15 }}>
              <GambaUi.Button
                main
                onClick={() => {
                  try {
                    referral.copyLinkToClipboard()
                    showWalletToast('REFERRAL_COPY_SUCCESS')
                  } catch {
                    walletModal.setVisible(true)
                  }
                }}
              >
                <span style={{fontSize:17,marginRight:6}}>💸</span>Copy invite link
              </GambaUi.Button>
            </div>
          </div>

          {/* Social sharing buttons */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 12, 
            maxWidth: 440,
            width: '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            <button
              style={{
                background: 'rgba(66,165,245,0.16)', 
                border: 'none',
                borderRadius: 12,
                padding: '12px 16px',
                color: '#66B3FF',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(66,165,245,0.24)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(66,165,245,0.16)'
                e.currentTarget.style.transform = 'translateY(0px)'
              }}
              onClick={() => {
                if (userAddress) {
                  const shareText = tierInfo.isFinancialMode 
                    ? `🎰 I'm earning ${tierInfo.currentFee}% from every bet my friends make at Degen Casino! Join me and let's win together! 🚀`
                    : `🎰 I'm a ${tierInfo.currentTierData.badge} ${tierInfo.currentTierData.name} at Degen Casino! Join me and let's climb the ranks together! 🚀`
                  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(`https://${PLATFORM_SHARABLE_URL}/?ref=${userAddress.toBase58()}`)}`
                  window.open(shareUrl, '_blank', 'width=500,height=400')
                }
              }}
            >
              <span>🐦</span>
              Share on Twitter
            </button>

            <button
              style={{
                background: 'rgba(76,175,80,0.16)',
                border: 'none',
                borderRadius: 12,
                padding: '12px 16px',
                color: '#81C784',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(76,175,80,0.24)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(76,175,80,0.16)'
                e.currentTarget.style.transform = 'translateY(0px)'
              }}
              onClick={() => {
                if (userAddress) {
                  const shareText = tierInfo.isFinancialMode 
                    ? `🎰 I'm earning ${tierInfo.currentFee}% from every bet my friends make at Degen Casino! Join me and let's win together! 🚀`
                    : `🎰 I'm a ${tierInfo.currentTierData.badge} ${tierInfo.currentTierData.name} at Degen Casino! Join me and let's climb the ranks together! 🚀`
                  const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ` https://${PLATFORM_SHARABLE_URL}/?ref=${userAddress.toBase58()}`)}`
                  window.open(shareUrl, '_blank')
                }
              }}
            >
              <span>📱</span>
              Share on WhatsApp
            </button>

            <button
              style={{
                background: 'rgba(255,193,7,0.16)',
                border: 'none',
                borderRadius: 12,
                padding: '12px 16px',
                color: '#FFD54F',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,193,7,0.24)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,193,7,0.16)'
                e.currentTarget.style.transform = 'translateY(0px)'
              }}
              onClick={() => {
                if (userAddress) {
                  navigator.clipboard.writeText(`https://${PLATFORM_SHARABLE_URL}/?ref=${userAddress.toBase58()}`)
                  showWalletToast('REFERRAL_COPY_SUCCESS')
                }
              }}
            >
              <span>📋</span>
              Copy Referral Link
            </button>
          </div>

          {/* Subtle share info row styled like token price row */}
          <div
            style={{
              textAlign: 'center',
              color: '#bdbdbd',
              fontSize: 13,
              fontWeight: 400,
              margin: '18px 0 0 0',
              maxWidth: 440,
              width: '100%',
              marginLeft: 'auto',
              marginRight: 'auto',
              letterSpacing: 0.1,
            }}
          >
            Share your link and earn rewards as your friends play! 🎯
          </div>
        </div>
      ) : mode === 'fees' ? (
        <div>
          <SectionHeading $colorScheme={currentColorScheme}>⚡ Transaction Fees</SectionHeading>
          <div style={{ margin: '16px 0' }}>
            <FeesTab value={priorityFee} onChange={setPriorityFee} />
          </div>
        </div>
      ) : (
        <>
          <NetworkToggle colorScheme={currentColorScheme} />
          <SectionHeading $colorScheme={currentColorScheme}>💰 Select Token</SectionHeading>
          <TokensContainer $colorScheme={currentColorScheme}>
            {/* Free Play Tokens Section */}
            {POOLS.filter((p) => p.token.equals(FAKE_TOKEN_MINT)).length > 0 && (
              <TokenSection>
                <TokenSectionTitle $colorScheme={currentColorScheme}>
                  🎮 Free Play
                </TokenSectionTitle>
                <TokenGrid>
                  {POOLS.filter((p) => p.token.equals(FAKE_TOKEN_MINT)).map((pool, i) => (
                    <TokenCard
                      key={`free-${i}`}
                      onClick={() => selectPool(pool)}
                      $selected={selectedMint && typeof selectedMint.equals === 'function' ? selectedMint.equals(pool.token) : selectedToken?.mint.equals(pool.token)}
                      $colorScheme={currentColorScheme}
                    >
                      <TokenSelectItem mint={pool.token} />
                    </TokenCard>
                  ))}
                </TokenGrid>
              </TokenSection>
            )}
            
            {/* Live Play Tokens Section */}
            {POOLS.filter((p) => !p.token.equals(FAKE_TOKEN_MINT)).length > 0 && (
              <TokenSection>
                <TokenSectionTitle $colorScheme={currentColorScheme}>
                  💰 Live Play
                </TokenSectionTitle>
                <TokenGrid>
                  {POOLS.filter((p) => !p.token.equals(FAKE_TOKEN_MINT)).map((pool, i) => (
                    <TokenCard
                      key={`live-${i}`}
                      onClick={() => selectPool(pool)}
                      $selected={selectedMint && typeof selectedMint.equals === 'function' ? selectedMint.equals(pool.token) : selectedToken?.mint.equals(pool.token)}
                      $colorScheme={currentColorScheme}
                    >
                      <TokenSelectItem mint={pool.token} />
                    </TokenCard>
                  ))}
                </TokenGrid>
              </TokenSection>
            )}
          </TokensContainer>
        </>
      )}
    </>
  )
}