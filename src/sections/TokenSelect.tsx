import React from 'react'
import { FeesTab } from '../components/FeesTab'
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
import styled from 'styled-components'
import { POOLS, PLATFORM_ALLOW_REFERRER_REMOVAL, PLATFORM_REFERRAL_FEE } from '../constants'
import { truncateString } from '../utils'
import { generateUsernameFromWallet } from './userProfileUtils'
import { useToast } from '../hooks/useToast'
import { useWalletToast } from '../utils/solanaWalletToast'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useReferralCount } from '../hooks/useReferralAnalytics'
import { getReferralTierInfo, formatFeePercentage, getReferralsToNextTier } from '../utils/referralTier'

const GridContainer = styled.div<{ $isSingleToken: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isSingleToken }) => ($isSingleToken ? '1fr' : 'repeat(2, 1fr)')};
  gap: 16px;
  background: rgba(24, 24, 24, 0.8);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(255, 215, 0, 0.15);
  border: 1px solid #ffd700;
  padding: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 8px 2px;
    border-radius: 8px;
  }
`

const TokenCard = styled.button<{ $selected?: boolean }>`
  width: 100%;
  background: ${({ $selected }) => ($selected ? 'rgba(255, 215, 0, 0.2)' : 'rgba(24, 24, 24, 0.8)')};
  border: 1px solid ${({ $selected }) => ($selected ? '#ffd700' : 'rgba(255, 255, 255, 0.2)')};
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  color: #ffd700;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: background 0.3s, border-color 0.3s;

  @media (max-width: 600px) {
    padding: 8px 4px;
    border-radius: 8px;
    font-size: 0.98rem;
    gap: 6px;
  }

  &:hover {
    background: rgba(255, 215, 0, 0.15);
    border-color: #ffd700;
  }
`

const StyledTokenImage = styled.img`
  height: 48px;
  width: 48px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 6px #ffd700aa;

  @media (max-width: 600px) {
    height: 38px;
    width: 38px;
  }
`

const SectionHeading = styled.h2`
  color: #ffd700;
  margin: 24px 0 12px 8px;
  font-size: 1.2rem;
`

const ToggleContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`

const ToggleButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 12px 16px;
  background: ${({ $active }) => ($active ? '#ffd700' : 'rgba(24, 24, 24, 0.8)')};
  color: ${({ $active }) => ($active ? '#222' : '#ffd700')};
  border: 1px solid #ffd700;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  transition: background 0.3s, color 0.3s;

  &:hover {
    background: #ffd700cc;
    color: #222;
  }
`

function TokenSelectItem({ mint }: { mint: PublicKey }) {
  const meta = useTokenMeta(mint)
  const balance = useTokenBalance(mint)

  const rawBalance = balance.balance ?? 0
  const decimals = meta.decimals ?? 9
  const tokenBalance = rawBalance / 10 ** decimals

  const formattedBalance = tokenBalance.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })

  const isFreeToken = mint.equals(FAKE_TOKEN_MINT)
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        padding: '2px 6px',
        background: 'none',
        justifyContent: 'flex-start',
      }}
    >
      <img
        src={meta.image}
        alt={meta.symbol}
        style={{
          height: 28,
          width: 28,
          borderRadius: '50%',
          objectFit: 'cover',
          boxShadow: '0 0 4px #ffd70099',
          border: '1.2px solid #ffd700',
          background: '#181818',
        }}
      />
      <span style={{ color: '#ffd700', fontWeight: 700 }}>{meta.symbol}</span>
      <span style={{ color: '#ffd700', fontWeight: 700 }}>
        {formattedBalance} {meta.symbol}
      </span>
      {isFreeToken && <span style={{ color: '#00ff88', fontWeight: 700 }}></span>}
    </div>
  )
}

export default function TokenSelect({ setSelectedMint, selectedMint }: {
  setSelectedMint?: (mint: PublicKey) => void,
  selectedMint?: PublicKey,
}) {
  const context = React.useContext(GambaPlatformContext)
  const selectedToken = useCurrentToken()
  const userAddress = useWalletAddress()
  const referralCount = useReferralCount(userAddress?.toBase58())
  const tierInfo = getReferralTierInfo(referralCount)
  const referralsToNext = getReferralsToNextTier(referralCount)

  const [mode, setMode] = React.useState<'free' | 'live' | 'fees' | 'invite'>('live')
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

  const getPools = (mode: 'free' | 'live' | 'fees') =>
    mode === 'free'
      ? POOLS.filter((p) => p.token.equals(FAKE_TOKEN_MINT))
      : mode === 'live'
        ? POOLS.filter((p) => !p.token.equals(FAKE_TOKEN_MINT))
        : []

  const tokensToShow = getPools(mode as 'free' | 'live' | 'fees')
  const isSingleToken = tokensToShow.length === 1

  const handleModeChange = (newMode: 'free' | 'live' | 'fees' | 'invite') => {
    setMode(newMode)
    if (newMode === 'fees' || newMode === 'invite') return
    const pools = getPools(newMode as 'free' | 'live' | 'fees')
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
        <ToggleButton $active={mode === 'free'} onClick={() => handleModeChange('free')}>
          Free Play
        </ToggleButton>
        <ToggleButton $active={mode === 'live'} onClick={() => handleModeChange('live')}>
          Live Play
        </ToggleButton>
        <ToggleButton $active={mode === 'fees'} onClick={() => handleModeChange('fees')}>
          Fees
        </ToggleButton>
        <ToggleButton $active={mode === 'invite'} onClick={() => handleModeChange('invite')}>
          Invite
        </ToggleButton>
      </ToggleContainer>

      {mode === 'invite' ? (
        <div>
          <SectionHeading>🎁 Referral System</SectionHeading>
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
                <span style={{color:'#ffd700',fontWeight:700}}>Current Rate:</span> <span style={{color:'#00ff88',fontWeight:700}}>{formatFeePercentage(tierInfo.currentFee)}</span> of every bet your friends make!
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                You have <span style={{color:'#ffd700', fontWeight: 600}}>{referralCount}</span> referrals
                {tierInfo.nextTier && (
                  <span> • {referralsToNext} more for <span style={{color:'#00ff88', fontWeight: 600}}>{formatFeePercentage(tierInfo.nextFee!)}</span></span>
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
                  const shareText = `🎰 I'm earning ${formatFeePercentage(tierInfo.currentFee)} from every bet my friends make at Degen Casino! Join me and let's win together! 🚀`
                  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(`https://degencasino.to/?ref=${userAddress.toBase58()}`)}`
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
                  const shareText = `🎰 I'm earning ${formatFeePercentage(tierInfo.currentFee)} from every bet my friends make at Degen Casino! Join me and let's win together! 🚀`
                  const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ` https://degencasino.to/?ref=${userAddress.toBase58()}`)}`
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
                  navigator.clipboard.writeText(`https://degencasino.to/?ref=${userAddress.toBase58()}`)
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
          <SectionHeading>Transaction Fees</SectionHeading>
          <div style={{ margin: '16px 0' }}>
            <FeesTab value={priorityFee} onChange={setPriorityFee} />
          </div>
        </div>
      ) : (
        <>
          <SectionHeading>{mode === 'free' ? 'Free Play Tokens' : 'Live Play Tokens'}</SectionHeading>
          <GridContainer $isSingleToken={isSingleToken}>
            {tokensToShow.map((pool, i) => (
              <TokenCard
                key={i}
                onClick={() => selectPool(pool)}
                $selected={selectedMint ? selectedMint.equals(pool.token) : selectedToken?.mint.equals(pool.token)}
              >
                <TokenSelectItem mint={pool.token} />
              </TokenCard>
            ))}
          </GridContainer>
        </>
      )}
    </>
  )
}
