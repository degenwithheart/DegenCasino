import React from 'react'
import { GambaUi, TokenValue, useCurrentPool, useGambaPlatformContext, useCurrentToken, useTokenMeta, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import styled, { keyframes } from 'styled-components'
import { Modal } from '../Modal/Modal'
import { PLATFORM_JACKPOT_FEE, PLATFORM_CREATOR_FEE } from '../../constants'
import { useWallet } from '@solana/wallet-adapter-react'
import { useColorScheme } from '../../themes/ColorSchemeContext'

// Quantum animations
const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: rotate(0deg) scale(0.8); }
  50% { opacity: 1; transform: rotate(180deg) scale(1.2); }
`;

const jackpotGlow = keyframes`
  0% { 
    box-shadow: 0 0 32px #ffd70088;
    transform: scale(1);
  }
  100% { 
    box-shadow: 0 0 64px #ffd700cc, 0 0 96px #ff9500aa;
    transform: scale(1.02);
  }
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  position: relative;

  &::before {
    content: '⚛️';
    position: absolute;
    top: -15px;
    right: 15%;
    font-size: 2.5rem;
    animation: ${sparkle} 4s infinite;
    filter: drop-shadow(0 0 8px #6ffaff);
  }
`

const Title = styled.h2<{ $colorScheme?: any }>`
  color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#6ffaff'};
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  letter-spacing: 0.15em;
  text-shadow: 0 0 16px ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#6ffaff'}cc, 0 0 4px #fff;
  font-family: 'Orbitron', 'JetBrains Mono', monospace;
`

const Subtitle = styled.p<{ $colorScheme?: any }>`
  color: ${({ $colorScheme }) => $colorScheme?.colors?.secondary || '#a259ff'};
  font-size: 0.9rem;
  margin: 0;
  letter-spacing: 0.1em;
  text-shadow: 0 0 8px ${({ $colorScheme }) => $colorScheme?.colors?.secondary || '#a259ff'}88;
  font-family: 'JetBrains Mono', monospace;
`

const ControlSection = styled.div`
  background: rgba(111, 250, 255, 0.08);
  border: 1px solid rgba(111, 250, 255, 0.3);
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1.2rem;
  box-shadow: 0 0 16px rgba(111, 250, 255, 0.15);
`

const ControlLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 8px;

  &:hover {
    background: rgba(111, 250, 255, 0.12);
    box-shadow: 0 0 12px rgba(111, 250, 255, 0.2);
  }
`

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
  onClose: () => void
}

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
  const poolFeePercentage = (PLATFORM_CREATOR_FEE * 100).toFixed(3)

  return (
    <div style={{ 
      maxWidth: '420px', 
      margin: '0 auto',
      padding: '1.5rem',
      color: '#eaf6fb',
      fontFamily: "'JetBrains Mono', 'Orbitron', 'monospace'"
    }}>
      <HeaderSection>
        <Title $colorScheme={currentColorScheme}>💰 JACKPOT SYSTEM</Title>
        <Subtitle $colorScheme={currentColorScheme}>Quantum Pool Mechanics</Subtitle>
      </HeaderSection>

      <PoolStatsContainer>
        <PoolStatsTitle>POOL STATISTICS</PoolStatsTitle>
        <PoolStatsGrid>
          <PoolStatItem>
            <PoolStatLabel>Pool Fee:</PoolStatLabel>
            <PoolStatValue>{(PLATFORM_JACKPOT_FEE * 100).toFixed(2)}%</PoolStatValue>
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
        <ControlSection>
          <ControlLabel>
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
                onChange={(checked) =>
                  context.setDefaultJackpotFee(checked ? PLATFORM_JACKPOT_FEE : 0)
                }
              />
            </div>
          </ControlLabel>
        </ControlSection>
      )}

      <InfoText style={{ marginTop: '1.5rem', fontSize: '0.95rem', textAlign: 'center' }}>
        May the odds be ever in your favor! 🍀
      </InfoText>
    </div>
  )
}

export const JackpotContent = JackpotInner

const JackpotModal: React.FC<JackpotModalProps> = ({ onClose }) => {
  const { currentColorScheme } = useColorScheme();
  return (
    <Modal onClose={onClose}>
      <JackpotContent />
    </Modal>
  )
}

export default JackpotModal