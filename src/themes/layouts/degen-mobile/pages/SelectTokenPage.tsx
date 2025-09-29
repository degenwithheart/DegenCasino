import React from 'react'
import { useNavigate } from 'react-router-dom'
import { usePageSEO } from '../../../../hooks/ui/useGameSEO'
import { useTokenBalance, useTokenMeta, useCurrentToken, FAKE_TOKEN_MINT, useGambaPlatformContext, useReferral } from 'gamba-react-ui-v2'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletAddress } from 'gamba-react-v2'
import { POOLS, PLATFORM_SHARABLE_URL } from '../../../../constants'
import { useReferralCount } from '../../../../hooks/analytics/useReferralAnalytics'
import { getReferralTierInfo, getReferralsToNextTier } from '../../../../utils/user/referralTier'
import styled from 'styled-components'
import { 
  ModalOverlay, 
  ModalContainer, 
  Header, 
  Title, 
  CloseButton, 
  Content
} from '../components/ModalComponents'

// Custom token selection components - no default theme dependencies
const TokenList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`

const TokenOption = styled.button<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: ${props => props.$selected 
    ? 'rgba(34, 197, 94, 0.15)' 
    : 'rgba(255, 255, 255, 0.05)'
  };
  border-radius: 16px;
  border: 2px solid ${props => props.$selected 
    ? 'rgba(34, 197, 94, 0.4)' 
    : 'rgba(34, 197, 94, 0.1)'
  };
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    background: rgba(34, 197, 94, 0.1);
    border-color: rgba(34, 197, 94, 0.3);
    transform: translateY(-2px);
  }
  
  .token-info {
    display: flex;
    align-items: center;
    gap: 16px;
    
    .icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      background: linear-gradient(135deg, #22c55e, #16a34a);
      color: white;
    }
    
    .details {
      text-align: left;
      
      .name {
        font-weight: 700;
        color: #fff;
        margin-bottom: 4px;
        font-size: 1.1rem;
      }
      
      .symbol {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.6);
        font-family: monospace;
      }
    }
  }
  
  .balance {
    text-align: right;
    
    .amount {
      font-weight: 700;
      color: #22c55e;
      font-size: 1.2rem;
      margin-bottom: 4px;
    }
    
    .price {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.5);
    }
  }
`

const FreePlayCard = styled.div`
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 140, 0, 0.1));
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 20px;
  padding: 20px;
  text-align: center;
  margin-bottom: 24px;
  
  .badge {
    background: linear-gradient(135deg, #ffd700, #ffed4e);
    color: black;
    padding: 6px 12px;
    border-radius: 16px;
    font-weight: 700;
    font-size: 0.8rem;
    display: inline-block;
    margin-bottom: 12px;
  }
  
  .amount {
    font-size: 2.5rem;
    font-weight: 900;
    background: linear-gradient(135deg, #ffd700, #ffed4e);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 8px;
  }
  
  .label {
    color: rgba(255, 255, 255, 0.8);
    font-weight: 600;
  }
`

const FeesInfo = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 16px;
  margin-top: 20px;
  border: 1px solid rgba(34, 197, 94, 0.1);
  
  .title {
    color: #22c55e;
    font-weight: 600;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .fee-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    
    &:last-child {
      border-bottom: none;
    }
    
    .label {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
    }
    
    .value {
      color: #22c55e;
      font-weight: 600;
      font-size: 0.9rem;
    }
  }
`

const SelectButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 24px;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(34, 197, 94, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

// Tab components
const TabContainer = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 4px;
  margin-bottom: 20px;
`

// Priority fee selection components
const FeeOption = styled.button<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: ${props => props.$selected 
    ? 'rgba(34, 197, 94, 0.15)' 
    : 'rgba(255, 255, 255, 0.05)'
  };
  border-radius: 12px;
  border: 2px solid ${props => props.$selected 
    ? 'rgba(34, 197, 94, 0.4)' 
    : 'rgba(34, 197, 94, 0.1)'
  };
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-bottom: 12px;
  
  &:hover {
    background: rgba(34, 197, 94, 0.1);
    border-color: rgba(34, 197, 94, 0.3);
    transform: translateY(-1px);
  }
  
  .fee-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    
    .fee-label {
      font-weight: 700;
      color: #fff;
      margin-bottom: 4px;
      font-size: 1rem;
    }
    
    .fee-description {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.6);
    }
  }
  
  .fee-price {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    
    .sol-amount {
      font-weight: 700;
      color: #22c55e;
      font-size: 1rem;
      margin-bottom: 2px;
    }
    
    .usd-amount {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.5);
    }
  }
`

const FeeSelectionContainer = styled.div`
  margin: 20px 0;
`

const Tab = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, #22c55e, #16a34a)'
    : 'transparent'
  };
  color: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  font-weight: ${props => props.$active ? '700' : '500'};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: white;
    background: ${props => props.$active 
      ? 'linear-gradient(135deg, #22c55e, #16a34a)'
      : 'rgba(34, 197, 94, 0.1)'
    };
  }
`

const TabContent = styled.div<{ $active?: boolean }>`
  display: ${props => props.$active ? 'block' : 'none'};
`

const ReferralSection = styled.div`
  background: rgba(255, 215, 0, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 16px;
  padding: 20px;
  margin: 20px 0;
`

const ReferralHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  
  .title {
    color: #ffd700;
    font-weight: 700;
    font-size: 1.1rem;
  }
`

const ReferralStats = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  
  .status {
    color: #00ff88;
    font-weight: 700;
    margin-bottom: 8px;
  }
  
  .details {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    line-height: 1.4;
  }
`

const ShareButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 12px;
  color: #22c55e;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(34, 197, 94, 0.2);
    transform: translateY(-1px);
  }
`

// Token selection component to get real token data
function TokenItem({ pool, isSelected, onSelect }: { pool: any, isSelected: boolean, onSelect: () => void }) {
  const balance = useTokenBalance(pool.token)
  const meta = useTokenMeta(pool.token)
  const { connected } = useWallet()
  
  const rawBalance = balance.balance ?? 0
  const decimals = meta.decimals ?? 9
  const tokenBalance = rawBalance / 10 ** decimals
  const formattedBalance = tokenBalance.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })
  
  const isFreeToken = pool.token.equals(FAKE_TOKEN_MINT)
  
  return (
    <TokenOption $selected={isSelected} onClick={onSelect}>
      <div className="token-info">
        <div className="icon">
          <img 
            src={meta.image} 
            alt={meta.symbol}
            style={{ width: '100%', height: '100%', borderRadius: '50%' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
        <div className="details">
          <div className="name">{meta.name || 'Unknown Token'}</div>
          <div className="symbol">{meta.symbol || '???'}</div>
        </div>
      </div>
      <div className="balance">
        <div className="amount">
          {connected ? formattedBalance : '0.00'}
        </div>
        <div className="price">
          {isFreeToken ? 'FREE' : `$${meta.usdPrice?.toFixed(2) || '0.00'}`}
        </div>
      </div>
    </TokenOption>
  )
}

// Priority fee presets (matching FeesTab component)
const SOL_PRESETS = [
  { label: 'None', amount: 0, description: 'Standard speed', usd: 0 },
  { label: 'Fast', amount: 0.002, description: 'Faster confirmation', usd: 0.46 },
  { label: 'Turbo', amount: 0.01, description: 'Very fast confirmation', usd: 2.33 },
  { label: 'Ultra', amount: 0.025, description: 'Ultra fast confirmation', usd: 5.82 },
  { label: 'Max', amount: 0.05, description: 'Maximum speed', usd: 11.64 }
]

export default function SelectTokenPage() {
  const navigate = useNavigate()
  const currentToken = useCurrentToken()
  const context = useGambaPlatformContext()
  const [selectedTokenMint, setSelectedTokenMint] = React.useState(currentToken.mint)
  
  // Load saved priority fee or default to Fast
  const [selectedFee, setSelectedFee] = React.useState(() => {
    const savedFee = localStorage.getItem('priorityFee')
    if (savedFee) {
      const savedAmount = parseFloat(savedFee)
      const preset = SOL_PRESETS.find(p => p.amount === savedAmount)
      return preset || SOL_PRESETS[1] // Default to Fast if not found
    }
    return SOL_PRESETS[1] // Default to Fast
  })
  
  const [activeTab, setActiveTab] = React.useState<'tokens' | 'fees' | 'referral'>('tokens')
  const userAddress = useWalletAddress()
  const referral = useReferral()
  const referralCount = useReferralCount(userAddress?.toBase58())
  const tierInfo = getReferralTierInfo(referralCount)
  const referralsToNext = getReferralsToNextTier(referralCount)
  const { connected } = useWallet()

  // SEO optimization
  usePageSEO(
    'Select Token - DegenHeart Casino',
    'Choose your preferred token for playing games and earning rewards'
  )

  const handleClose = () => {
    navigate(-1)
  }

  const handleTokenSelect = (pool: any) => {
    setSelectedTokenMint(pool.token)
    context.setPool(pool.token, pool.authority)
  }

  const handleConfirmSelection = () => {
    // Save fee selection to localStorage or context (matches FeesTab behavior)
    if (selectedFee) {
      localStorage.setItem('priorityFee', selectedFee.amount.toString())
    }
    
    // Selection is already applied via handleTokenSelect
    navigate(-1)
  }

  return (
    <>
      <ModalOverlay onClick={handleClose}>
        <ModalContainer 
          $variant="token"
          onClick={(e) => e.stopPropagation()}
        >
          <Header $variant="token">
            <Title $variant="token" $icon="💰">
              Select Token
            </Title>
            <CloseButton $variant="token" onClick={handleClose} />
          </Header>
          
          <Content>
            <TabContainer>
              <Tab 
                $active={activeTab === 'tokens'} 
                onClick={() => setActiveTab('tokens')}
              >
                💰 Tokens
              </Tab>
              <Tab 
                $active={activeTab === 'fees'} 
                onClick={() => setActiveTab('fees')}
              >
                ⚡ Fees
              </Tab>
              <Tab 
                $active={activeTab === 'referral'} 
                onClick={() => setActiveTab('referral')}
              >
                🎁 Referral
              </Tab>
            </TabContainer>

            <TabContent $active={activeTab === 'tokens'}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px' }}>
                  Choose your preferred token for playing games
                </p>
              </div>

              <TokenList>
                {POOLS.map((pool, index) => (
                  <TokenItem
                    key={index}
                    pool={pool}
                    isSelected={selectedTokenMint.equals(pool.token)}
                    onSelect={() => handleTokenSelect(pool)}
                  />
                ))}
              </TokenList>

              <SelectButton 
                onClick={handleConfirmSelection}
                disabled={!selectedTokenMint}
              >
                💎 Confirm Selection
              </SelectButton>
            </TabContent>

            <TabContent $active={activeTab === 'fees'}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px' }}>
                  Select your preferred priority fee level for faster transaction processing
                </p>
              </div>

              <FeeSelectionContainer>
                {SOL_PRESETS.map((preset, index) => (
                  <FeeOption
                    key={index}
                    $selected={selectedFee.amount === preset.amount}
                    onClick={() => setSelectedFee(preset)}
                  >
                    <div className="fee-info">
                      <div className="fee-label">{preset.label}</div>
                      <div className="fee-description">{preset.description}</div>
                    </div>
                    <div className="fee-price">
                      <div className="sol-amount">
                        {preset.amount === 0 ? 'Free' : `${preset.amount} SOL`}
                      </div>
                      <div className="usd-amount">
                        {preset.amount === 0 ? '' : `~$${preset.usd.toFixed(2)}`}
                      </div>
                    </div>
                  </FeeOption>
                ))}
              </FeeSelectionContainer>

              <div style={{ 
                background: 'rgba(34, 197, 94, 0.05)', 
                border: '1px solid rgba(34, 197, 94, 0.2)', 
                borderRadius: '12px', 
                padding: '16px', 
                marginTop: '20px',
                textAlign: 'center'
              }}>
                <div style={{ color: '#22c55e', fontWeight: '600', marginBottom: '8px' }}>
                  ⚡ Current Selection
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem', fontWeight: '600' }}>
                  {selectedFee.label} ({selectedFee.amount === 0 ? 'Free' : `${selectedFee.amount} SOL`})
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', marginTop: '4px' }}>
                  {selectedFee.description}
                </div>
              </div>

              <div style={{ 
                background: 'rgba(255, 215, 0, 0.05)', 
                border: '1px solid rgba(255, 215, 0, 0.2)', 
                borderRadius: '12px', 
                padding: '14px', 
                marginTop: '16px',
                textAlign: 'center'
              }}>
                <div style={{ color: '#ffd700', fontWeight: '600', marginBottom: '6px', fontSize: '0.9rem' }}>
                  💡 Pro Tip
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                  Higher priority fees help during network congestion, but aren't always necessary
                </div>
              </div>
            </TabContent>

            <TabContent $active={activeTab === 'referral'}>
              {connected && userAddress ? (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px' }}>
                      Earn rewards by referring friends to the platform
                    </p>
                  </div>

                  <ReferralSection>
                    <ReferralHeader>
                      <span>🎁</span>
                      <div className="title">Referral System</div>
                    </ReferralHeader>
                    <ReferralStats>
                      <div className="status">
                        {tierInfo.isFinancialMode ? 'Current Rate:' : 'Current Status:'} {' '}
                        {tierInfo.isFinancialMode 
                          ? `${tierInfo.currentFee}% of every bet`
                          : `${tierInfo.currentTierData.badge} ${tierInfo.currentTierData.name} Badge`
                        }
                      </div>
                      <div className="details">
                        You have {referralCount} referrals
                        {tierInfo.nextTier && (
                          <span> • {referralsToNext} more for {' '}
                            {tierInfo.nextTierData?.badge} {tierInfo.nextTierData?.name} {tierInfo.isFinancialMode ? `${tierInfo.nextFee}%` : 'Badge'}
                          </span>
                        )}
                      </div>
                    </ReferralStats>
                    <ShareButton
                      onClick={() => {
                        const shareText = tierInfo.isFinancialMode 
                          ? `🎰 I'm earning ${tierInfo.currentFee}% from every bet my friends make at Degen Casino! Join me and let's win together! 🚀`
                          : `🎰 I'm a ${tierInfo.currentTierData.badge} ${tierInfo.currentTierData.name} at Degen Casino! Join me and let's climb the ranks together! 🚀`
                        const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ` https://${PLATFORM_SHARABLE_URL}/?ref=${userAddress.toBase58()}`)}`
                        window.open(shareUrl, '_blank')
                      }}
                    >
                      📱 Share Referral Link
                    </ShareButton>
                  </ReferralSection>
                </>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px 20px',
                  color: 'rgba(255, 255, 255, 0.6)'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔒</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '8px' }}>
                    Connect Wallet
                  </div>
                  <div>
                    Connect your wallet to view and manage your referral system
                  </div>
                </div>
              )}
            </TabContent>
          </Content>
        </ModalContainer>
      </ModalOverlay>
    </>
  )
}