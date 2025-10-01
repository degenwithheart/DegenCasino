import React from 'react'
import { GambaUi, TokenValue, useCurrentPool, useGambaPlatformContext, useCurrentToken, useTokenMeta, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import styled from 'styled-components'
import { Modal } from './Modal'
import { PLATFORM_JACKPOT_FEE, PLATFORM_CREATOR_FEE, PLATFORM_JACKPOT_FEE_BPS, PLATFORM_CREATOR_FEE_BPS } from '../../../../constants'
import { BPS_PER_WHOLE } from 'gamba-core-v2'
import { useWallet } from '@solana/wallet-adapter-react'
import { useColorScheme } from '../../../../themes/ColorSchemeContext'
import { spacing, animations, media } from '../breakpoints'
import {
  HeaderSection,
  Title,
  Subtitle,
  JackpotAmount,
  FeatureList,
  ActionButtons,
  PrimaryButton,
  SecondaryButton
} from './Jackpot.styles'

interface JackpotModalProps {
  isOpen: boolean;
  onClose: () => void
}

const ControlText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`

const ControlTitle = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: #6ffaff;
  text-shadow: 0 0 8px #6ffaff;
  font-family: 'Orbitron', monospace;
  letter-spacing: 0.05em;
`

const ControlSubtitle = styled.span`
  font-size: 0.9rem;
  color: #eaf6fb;
  font-family: 'JetBrains Mono', monospace;
  text-align: center;
  line-height: 1.4;
`

const StatusBadge = styled.span<{ $enabled: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
  border: 2px solid;
  
  ${({ $enabled }) => $enabled ? `
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
    border-color: rgba(16, 185, 129, 0.6);
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.3);
  ` : `
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
    border-color: rgba(239, 68, 68, 0.6);
    box-shadow: 0 0 8px rgba(239, 68, 68, 0.3);
  `}

  &::before {
    content: '${({ $enabled }) => $enabled ? '🟢' : '🔴'}';
    font-size: 1rem;
  }
`

const PoolStatsContainer = styled.div`
  background: rgba(162, 89, 255, 0.08);
  border: 1px solid rgba(162, 89, 255, 0.3);
  border-radius: 12px;
  padding: 1rem;
  margin: 1.2rem 0;
  box-shadow: 0 0 16px rgba(162, 89, 255, 0.15);
`

const PoolStatsTitle = styled.h4`
  color: #a259ff;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  text-align: center;
  letter-spacing: 0.08em;
  text-shadow: 0 0 8px #a259ff88;
  font-family: 'Orbitron', monospace;
`

const PoolStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 0.6rem;
  }
`

const PoolStatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  background: rgba(20, 30, 60, 0.6);
  border-radius: 8px;
  border: 1px solid rgba(111, 250, 255, 0.2);
  box-shadow: 0 0 8px rgba(111, 250, 255, 0.1);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(20, 30, 60, 0.8);
    border-color: rgba(111, 250, 255, 0.4);
    box-shadow: 0 0 12px rgba(111, 250, 255, 0.2);
  }
`

const PoolStatLabel = styled.span`
  color: #eaf6fb;
  font-size: 0.9rem;
  font-weight: 500;
  font-family: 'JetBrains Mono', monospace;
`

const PoolStatValue = styled.span`
  color: #6ffaff;
  font-size: 0.95rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  text-shadow: 0 0 6px #6ffaff88;
`

const InfoText = styled.p`
  color: #eaf6fb;
  font-size: 0.9rem;
  font-family: 'JetBrains Mono', monospace;
  text-align: center;
  margin: 1rem 0;
  line-height: 1.5;
  opacity: 0.9;
`

interface JackpotModalProps {
  isOpen: boolean;
  onClose: () => void
}

// Modern TikTok/Instagram style container
const ModernJackpotContainer = styled.div<{ $colorScheme?: any }>`
  max-width: 480px;
  margin: 0 auto;
  padding: ${spacing.xl};
  background: linear-gradient(135deg,
    rgba(24, 24, 24, 0.95),
    rgba(15, 15, 35, 0.98)
  );
  border-radius: 24px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  font-family: 'JetBrains Mono', 'Orbitron', monospace;
  color: #eaf6fb;

  ${media.maxMobile} {
    padding: ${spacing.lg};
    border-radius: 20px;
    margin: ${spacing.base};
  }

  /* Ambient glow effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at 70% 30%,
      rgba(255, 215, 0, 0.08) 0%,
      rgba(162, 89, 255, 0.05) 50%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  > * {
    position: relative;
    z-index: 2;
  }
`

const JackpotInner: React.FC = () => {
  const pool = useCurrentPool()
  const context = useGambaPlatformContext()
  const token = useCurrentToken()
  const { connected } = useWallet()
  const meta = useTokenMeta(token?.mint)
  const { currentColorScheme } = useColorScheme()

  // Calculate minimum wager in token amount ($1 USD for real tokens)
  const getMinimumWager = () => {
    if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
      return meta?.baseWager ?? 0 // For free tokens, use base wager
    }

    // For real tokens, minimum is $1 USD
    const tokenPrice = meta?.usdPrice ?? 0
    if (tokenPrice > 0) {
      const tokenAmount = 1 / tokenPrice // $1 worth of tokens
      return tokenAmount * (meta?.baseWager ?? Math.pow(10, meta?.decimals ?? 9))
    }

    return meta?.baseWager ?? 0
  }

  const minimumWager = getMinimumWager()
  const poolFeePercentage = (PLATFORM_CREATOR_FEE_BPS / BPS_PER_WHOLE * 100).toFixed(3)

  return (
    <ModernJackpotContainer $colorScheme={currentColorScheme}>
      <HeaderSection>
        <Title $colorScheme={currentColorScheme}>💰 JACKPOT SYSTEM</Title>
        <Subtitle $colorScheme={currentColorScheme}>Quantum Pool Mechanics</Subtitle>
      </HeaderSection>

      <PoolStatsContainer>
        <PoolStatsTitle>POOL STATISTICS</PoolStatsTitle>
        <PoolStatsGrid>
          <PoolStatItem>
            <PoolStatLabel>Pool Fee:</PoolStatLabel>
            <PoolStatValue>{(PLATFORM_JACKPOT_FEE_BPS / BPS_PER_WHOLE * 100).toFixed(2)}%</PoolStatValue>
          </PoolStatItem>

          <PoolStatItem>
            <PoolStatLabel>Jackpot:</PoolStatLabel>
            <PoolStatValue>
              <TokenValue amount={pool.jackpotBalance} />
            </PoolStatValue>
          </PoolStatItem>

          <PoolStatItem>
            <PoolStatLabel>Minimum Wager:</PoolStatLabel>
            <PoolStatValue>
              {token?.mint?.equals?.(FAKE_TOKEN_MINT) ? (
                <TokenValue amount={minimumWager} />
              ) : (
                "$1.00"
              )}
            </PoolStatValue>
          </PoolStatItem>

          <PoolStatItem>
            <PoolStatLabel>Maximum Payout:</PoolStatLabel>
            <PoolStatValue>
              <TokenValue amount={pool.maxPayout} />
            </PoolStatValue>
          </PoolStatItem>
        </PoolStatsGrid>
      </PoolStatsContainer>

      {connected && (
        <div style={{ 
          background: 'rgba(111, 250, 255, 0.08)',
          border: '1px solid rgba(111, 250, 255, 0.3)',
          borderRadius: '12px',
          padding: '1rem',
          margin: '1.2rem 0'
        }}>
          <div>
            <ControlText style={{ alignItems: 'center', textAlign: 'center' }}>
              <ControlTitle>Jackpot Participation</ControlTitle>
              <ControlSubtitle>
                {context.defaultJackpotFee === 0 
                  ? "Currently disabled – you won't contribute and are not eligible to win"
                  : 'Currently enabled – you contribute and are eligible to win'}
              </ControlSubtitle>
            </ControlText>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              <StatusBadge $enabled={context.defaultJackpotFee > 0}>
                {context.defaultJackpotFee === 0 ? 'DISABLED' : 'ENABLED'}
              </StatusBadge>
              <GambaUi.Switch
                checked={context.defaultJackpotFee > 0}
                onChange={(checked: boolean) =>
                  context.setDefaultJackpotFee(checked ? PLATFORM_JACKPOT_FEE : 0)
                }
              />
            </div>
          </div>
        </div>
      )}

      <InfoText style={{ marginTop: '1.5rem', fontSize: '0.95rem', textAlign: 'center' }}>
        May the odds be ever in your favor! 🍀
      </InfoText>
    </ModernJackpotContainer>
  )
}

export const JackpotContent = JackpotInner

const JackpotModal: React.FC<JackpotModalProps> = ({ isOpen, onClose }) => {
  const { currentColorScheme } = useColorScheme();
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <JackpotContent />
    </Modal>
  )
}

export default JackpotModal