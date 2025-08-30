import React from 'react'
import { GambaUi, TokenValue, useCurrentPool, useGambaPlatformContext, useCurrentToken, useTokenMeta, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import styled, { keyframes } from 'styled-components'
import { Modal } from './Modal'
import { PLATFORM_JACKPOT_FEE, PLATFORM_CREATOR_FEE } from '../constants'
import { useWallet } from '@solana/wallet-adapter-react'

// Casino animations
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

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: rotate(0deg) scale(0.8); }
  50% { opacity: 1; transform: rotate(180deg) scale(1.2); }
`;

const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
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

const ModalContent = styled.div`
  max-width: 380px;
  margin: auto;
  padding: 1.1rem 1rem;
  border-radius: 18px;
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 215, 0, 0.3);
  color: white;
  position: relative;
  animation: ${neonPulse} 3s ease-in-out infinite alternate;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 149, 0, 0.08) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
    border-radius: 24px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ffd700, #ff9500, #ffd700);
    background-size: 300% 100%;
    animation: ${moveGradient} 4s linear infinite;
    border-radius: 24px 24px 0 0;
    z-index: 1;
  }

  @media (max-width: 600px) {
    padding: 0.75rem 0.5rem;
    margin: 1rem;
    max-width: calc(100vw - 2rem);
    border-radius: 10px;
  }
`

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 1.1rem;
  position: relative;

  &::before {
    content: '💰';
    position: absolute;
    top: -10px;
    right: 20%;
    font-size: 2rem;
    animation: ${sparkle} 3s infinite;
  }

  &::after {
    content: '🎰';
    position: absolute;
    top: 10px;
    left: 15%;
    font-size: 1.5rem;
    animation: ${sparkle} 2s infinite reverse;
  }
`

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 0.2rem;
  text-shadow: 0 0 16px #ffd700, 0 0 32px #ff9500;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  letter-spacing: 2px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 180px;
    height: 3px;
    background: linear-gradient(90deg, transparent, #ffd700, #ff9500, #ffd700, transparent);
    background-size: 200% 100%;
    animation: ${moveGradient} 3s linear infinite;
    border-radius: 2px;
  }

  @media (max-width: 600px) {
    font-size: 1.3rem;
    margin-bottom: 0.1rem;
  }
`

const JackpotAmount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.12), rgba(255, 149, 0, 0.08));
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 14px;
  padding: 0.75rem 1rem;
  margin: 0.7rem 0 0.8rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffd700;
  text-shadow: 0 0 8px #ffd700;
  box-shadow: 0 0 16px rgba(255, 215, 0, 0.18);
  transition: all 0.2s ease;
  animation: ${jackpotGlow} 2s ease-in-out infinite alternate;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  letter-spacing: 0.5px;
  width: 100%;
  justify-content: center;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 0 24px rgba(255, 215, 0, 0.3);
    border-color: rgba(255, 215, 0, 0.6);
  }

  &::before {
    content: '🏆';
    font-size: 1.3rem;
    animation: ${sparkle} 3s infinite;
  }

  @media (max-width: 600px) {
    padding: 0.5rem 0.5rem;
    font-size: 0.95rem;
    border-radius: 8px;
  }
`

const InfoText = styled.p`
  font-size: 0.93rem;
  line-height: 1.32;
  color: #e0e0e0;
  margin-bottom: 0.4rem;
  text-align: center;

  strong {
    color: #ffd700;
    font-weight: 700;
    text-shadow: 0 0 6px #ffd700;
  }
`

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0.7rem 0;

  li {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.28rem 0;
    color: #c0c0c0;
    font-size: 0.91rem;

    &::before {
      content: '🎯';
      font-size: 1rem;
      background: rgba(255, 215, 0, 0.13);
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 5px rgba(255, 215, 0, 0.18);
    }
  }
`

const ControlSection = styled.div`
  background: rgba(255, 215, 0, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 16px;
  padding: 0.8rem 1rem;
  margin-top: 1.1rem;
`

const ControlLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 215, 0, 0.1);
    border-radius: 12px;
    padding: 0.5rem;
    margin: -0.5rem;
  }
`

const ControlText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const ControlTitle = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #ffd700;
  text-shadow: 0 0 8px #ffd700;
`

const ControlSubtitle = styled.span`
  font-size: 0.85rem;
  color: #c0c0c0;
`

const StatusBadge = styled.span<{ $enabled: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.7rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 2px solid;
  
  ${({ $enabled }) => $enabled ? `
    background: rgba(16, 185, 129, 0.2);
    color: #6ee7b7;
    border-color: rgba(16, 185, 129, 0.5);
  ` : `
    background: rgba(220, 38, 127, 0.2);
    color: #fca5a5;
    border-color: rgba(220, 38, 127, 0.5);
  `}

  &::before {
    content: '${({ $enabled }) => $enabled ? '✅' : '❌'}';
    font-size: 1rem;
  }
`

const PoolStatsContainer = styled.div`
  background: rgba(255, 215, 0, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 16px;
  padding: 0.8rem 1rem;
  margin: 1rem 0;
`

const PoolStatsTitle = styled.h4`
  color: #ffd700;
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 12px 0;
  text-align: center;
  letter-spacing: 0.5px;
  text-shadow: 0 0 8px #ffd700;
`

const PoolStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 6px;
  }
`

const PoolStatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const PoolStatLabel = styled.span`
  color: #c0c0c0;
  font-size: 0.85rem;
  font-weight: 500;
`

const PoolStatValue = styled.span`
  color: #ffd700;
  font-size: 0.85rem;
  font-weight: 700;
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
    <ModalContent>
      <HeaderSection>
        <Title>Jackpot 💰</Title>
      </HeaderSection>

      <FeatureList>
        <li>Jackpot grows with every bet placed</li>
        <li>Winner takes all - jackpot resets after win</li>
      </FeatureList>

      <PoolStatsContainer>
        <PoolStatsTitle>Pool Statistics</PoolStatsTitle>
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

      <InfoText style={{ marginTop: '1.5rem', fontSize: '0.95rem' }}>
        Good luck and may the odds be ever in your favor! 🍀
      </InfoText>
    </ModalContent>
  )
}

export const JackpotContent = JackpotInner

const JackpotModal: React.FC<JackpotModalProps> = ({ onClose }) => {
  return (
    <Modal onClose={onClose}>
      <JackpotContent />
    </Modal>
  )
}

export default JackpotModal
