import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useHandleWalletConnect } from './walletConnect';
import { PublicKey } from '@solana/web3.js'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import styled, { keyframes } from 'styled-components'
import { Modal } from '../components'
import {
  POOLS,
  PLATFORM_ALLOW_REFERRER_REMOVAL,
  PLATFORM_REFERRAL_FEE,
} from '../constants'
import TokenSelect from './TokenSelect'
import { useIsCompact } from '../hooks/ui/useIsCompact'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../hooks/data/useUserStore'
import { useToast } from '../hooks/ui/useToast'
import { truncateString } from '../utils'
import {
  GambaUi,
  useTokenBalance,
  useCurrentToken,
  useTokenMeta,
  TokenValue,
  useReferral,
} from 'gamba-react-ui-v2'
import { useTheme } from '../themes/ThemeContext'

// Keyframe animations matching casino style
const neonPulse = keyframes`
  0% { 
    box-shadow: 0 0 24px #a259ff88, 0 0 48px #ffd70044;
    border-color: #ffd70044;
  }
  100% { 
    box-shadow: 0 0 48px #ffd700cc, 0 0 96px #a259ff88;
    border-color: #ffd700aa;
  }
`;

const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
`;

const Container = styled.div<{ $theme?: any }>`
  height: auto;
  width: 600px;
  margin: 1rem auto;
  border-radius: 20px;
  padding: 2rem;
  color: ${({ $theme }) => $theme?.colors?.text || '#fff'};
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 600;
  text-align: center;
  position: relative;

  /* Enhanced glassmorphism */
  background: ${({ $theme }) => $theme?.colors?.surface || 'rgba(24, 24, 24, 0.8)'};
  backdrop-filter: blur(20px);
  border: 2px solid ${({ $theme }) => $theme?.colors?.border || 'rgba(255, 255, 255, 0.15)'};
  box-shadow: ${({ $theme }) => $theme?.effects?.glow || '0 12px 40px 0 rgba(31, 38, 135, 0.4)'};

  /* Casino gradient border effect */
  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(45deg, ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}, ${({ $theme }) => $theme?.colors?.secondary || '#a259ff'}, #ff00cc, ${({ $theme }) => $theme?.colors?.primary || '#ffd700'});
    background-size: 300% 100%;
    border-radius: 20px;
    opacity: 0.3;
    z-index: -1;
    animation: ${moveGradient} 4s linear infinite;
  }

  /* Inner glow effect */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 20px;
    background: 
      radial-gradient(circle at 30% 20%, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 70% 80%, rgba(162, 89, 255, 0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  @media (max-width: 600px) {
    width: 98vw;
    min-width: 0;
    padding: 1rem 0.5rem;
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.18);
  }
`;

const Header = styled.h3<{ $theme?: any }>`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: ${({ $theme }) => $theme?.colors?.primary || '#ffd700'};
  font-family: 'Luckiest Guy', cursive, sans-serif;
  text-shadow: 0 0 12px ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}, 0 0 24px ${({ $theme }) => $theme?.colors?.secondary || '#a259ff'};
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &::before {
    content: '🎰';
    font-size: 1.2em;
    filter: drop-shadow(0 0 8px #ffd700);
  }
`

const TokenPreview = styled.div`
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 700;
  font-size: 1.1rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  @media (max-width: 600px) {
    font-size: 1rem;
    padding: 0.7rem 0.5rem;
    border-radius: 8px;
    gap: 0.5rem;
  }
`;

const TokenIcon = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  box-shadow: 0 0 12px #ffd700aa;
  filter: drop-shadow(0 0 4px #ffd700);

  @media (max-width: 600px) {
    width: 26px;
    height: 26px;
    border-radius: 6px;
  }
`;

const WalletButtonWrapper = styled.div<{ $theme?: any }>`
  text-align: center;
  position: relative;

  .gamba-button {
    background: linear-gradient(90deg, ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}, ${({ $theme }) => $theme?.colors?.secondary || '#a259ff'}) !important;
    border: 2px solid transparent !important;
    border-radius: 16px !important;
    padding: 0.75rem 1.5rem !important;
    font-weight: 700 !important;
    font-size: 1rem !important;
    color: ${({ $theme }) => $theme?.colors?.buttonText || '#222'} !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3) !important;
    animation: ${neonPulse} 2s infinite alternate !important;

    @media (max-width: 600px) {
      font-size: 0.98rem !important;
      padding: 0.6rem 1rem !important;
      border-radius: 10px !important;
    }

    &:hover {
      transform: scale(1.05) !important;
      box-shadow: 0 0 30px ${({ $theme }) => $theme?.colors?.primary ? `${$theme.colors.primary}80` : 'rgba(255, 215, 0, 0.5)'} !important;
    }
  }
`;

// Enhanced referral section styles
const ReferralSection = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  position: relative;

  &::before {
    content: '💎';
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 1.5rem;
    animation: ${sparkle} 2s infinite;
    filter: drop-shadow(0 0 8px #ffd700);
  }

  @media (max-width: 600px) {
    padding: 0.8rem 0.3rem;
    border-radius: 10px;
    gap: 0.6rem;
  }
`;

const ReferralButton = styled.div`
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

const RemoveButton = styled.div`
  .gamba-button {
    background: rgba(255, 69, 87, 0.8) !important;
    border: 1px solid rgba(255, 69, 87, 0.5) !important;
    border-radius: 12px !important;
    color: white !important;
    transition: all 0.3s ease !important;
    
    &:hover:not(:disabled) {
      background: rgba(255, 69, 87, 1) !important;
      box-shadow: 0 0 16px rgba(255, 69, 87, 0.4) !important;
    }
    
    &:disabled {
      opacity: 0.5 !important;
      cursor: not-allowed !important;
    }
  }
`

const InfoText = styled.div`
  opacity: 0.8;
  font-size: 0.9rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;

  @media (max-width: 600px) {
    font-size: 0.85rem;
    padding: 0 2px;
  }

  a {
    color: #ffd700;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-shadow: 0 0 8px #ffd700;
    }
  }
`;

  const TokenSelectionModal = () => {
    const user = useUserStore()
    const referral = useReferral()
    const toast = useToast()
    const walletModal = useWalletModal()
    const [removing, setRemoving] = useState(false)
    const { currentTheme } = useTheme()

    const [selectedMint, setSelectedMint] = useState<PublicKey>(POOLS[0].token)
    const selectedToken = POOLS.find((t) => t.token.equals(selectedMint))
    const isFreeToken = selectedMint && POOLS[0].token && selectedMint.equals(POOLS[0].token)

    return (
      <Modal onClose={() => user.set({ userModal: false, userModalInitialTab: undefined })}>
        <Container $theme={currentTheme}>
          <Header $theme={currentTheme}>Select a Token</Header>
          <TokenSelect 
            setSelectedMint={setSelectedMint} 
            selectedMint={selectedMint} 
            initialTab={user.userModalInitialTab}
          />
          {/* ✅ Invite section removed — now handled inside Invite tab */}
        </Container>
      </Modal>
    )
  }

const TokenIconAndBalance = () => {
  const selectedToken = useCurrentToken()
  const balance = useTokenBalance()
  const meta = useTokenMeta(selectedToken.mint)

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      padding: '0.25rem',
      backdropFilter: 'blur(10px)'
    }}>
      <img
        src={meta.image}
        alt="token-icon"
        height="24"
        style={{ 
          borderRadius: '50%', 
          boxShadow: '0 0 8px #ffd700aa',
          filter: 'drop-shadow(0 0 4px #ffd700)'
        }}
      />
      <TokenValue mint={selectedToken.mint} amount={balance.balance} />
    </div>
  )
}


export function UserButton() {
  const walletModal = useWalletModal()
  const wallet = useWallet()
  const user = useUserStore()
  const handleWalletConnect = useHandleWalletConnect();
  const { mobile } = useIsCompact()
  const navigate = useNavigate()
  const { currentTheme } = useTheme()



  return (
    <>
      {wallet.connected && user.userModal &&
        ReactDOM.createPortal(<TokenSelectionModal />, document.body)
      }

      {wallet.connected ? (
        <WalletButtonWrapper $theme={currentTheme}>
          <GambaUi.Button onClick={() => (mobile ? navigate('/select-token') : user.set({ userModal: true }))}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TokenIconAndBalance />
            </div>
          </GambaUi.Button>
        </WalletButtonWrapper>
      ) : (
        <WalletButtonWrapper $theme={currentTheme}>
          <GambaUi.Button onClick={handleWalletConnect}>
            {wallet.connecting ? 'Connecting...' : 'Connect'}
          </GambaUi.Button>
        </WalletButtonWrapper>
      )}
    </>
  )
}
