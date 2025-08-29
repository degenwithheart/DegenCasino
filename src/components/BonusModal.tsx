import React from 'react'
import { TokenValue, useUserBalance } from 'gamba-react-ui-v2'
import styled, { keyframes } from 'styled-components'
import { Modal } from './Modal'

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

const ModalContent = styled.div`
  max-width: 360px;
  margin: auto;
  padding: 1.5rem 1.25rem;
  border-radius: 18px;
  background: rgba(24, 24, 24, 0.95);
  backdrop-filter: blur(20px);
  box-shadow: 0 0 48px rgba(0, 0, 0, 0.6);
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
      radial-gradient(circle at 80% 80%, rgba(162, 89, 255, 0.08) 0%, transparent 50%);
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
    background: linear-gradient(90deg, #ffd700, #a259ff, #ff00cc, #ffd700);
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
  margin-bottom: 2rem;
  position: relative;

  &::before {
    content: '✨';
    position: absolute;
    top: -10px;
    right: 20%;
    font-size: 2rem;
    animation: ${sparkle} 3s infinite;
  }

  &::after {
    content: '🎁';
    position: absolute;
    top: 10px;
    left: 15%;
    font-size: 1.5rem;
    animation: ${sparkle} 2s infinite reverse;
  }
`

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 16px #ffd700, 0 0 32px #a259ff;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  letter-spacing: 2px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
    height: 3px;
    background: linear-gradient(90deg, transparent, #ffd700, #a259ff, #ffd700, transparent);
    background-size: 200% 100%;
    animation: ${moveGradient} 3s linear infinite;
    border-radius: 2px;
  }

  @media (max-width: 600px) {
    font-size: 1.6rem;
    margin-bottom: 0.25rem;
  }
`

const BonusAmount = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 215, 0, 0.1);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 16px;
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffd700;
  text-shadow: 0 0 8px #ffd700;
  box-shadow: 0 0 24px rgba(255, 215, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 32px rgba(255, 215, 0, 0.4);
    border-color: rgba(255, 215, 0, 0.6);
  }

  &::before {
    content: '💰';
    font-size: 1.5rem;
  }

  @media (max-width: 600px) {
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    margin: 1rem 0;
    border-radius: 10px;
  }
`

const InfoText = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #e0e0e0;
  margin-bottom: 1rem;
  text-align: center;

  strong, b {
    color: #ffd700;
    font-weight: 700;
    text-shadow: 0 0 8px #ffd700;
  }
`

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;

  li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 0;
    color: #c0c0c0;
    font-size: 1rem;

    &::before {
      content: '✓';
      color: #10b981;
      font-weight: bold;
      font-size: 1.2rem;
      background: rgba(16, 185, 129, 0.2);
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 8px rgba(16, 185, 129, 0.3);
    }

    @media (max-width: 600px) {
      font-size: 0.95rem;
      gap: 0.5rem;
      padding: 0.5rem 0;
      &::before {
        width: 20px;
        height: 20px;
        font-size: 1rem;
      }
    }
  }
`

interface BonusModalProps {
  onClose: () => void
}

const BonusModal: React.FC<BonusModalProps> = ({ onClose }) => {
  const balance = useUserBalance()

  return (
    <Modal onClose={onClose}>
      <ModalContent>
        <HeaderSection>
          <Title>Bonus ✨</Title>
        </HeaderSection>

        <BonusAmount>
          <TokenValue amount={balance.bonusBalance} />
          <span>FREE PLAYS</span>
        </BonusAmount>

        <InfoText>
          You have <strong><TokenValue amount={balance.bonusBalance} /></strong> worth of free plays available!
        </InfoText>

        <FeatureList>
          <li>Bonus applies automatically when you play</li>
          <li>Small wallet fee still required for transactions</li>
          <li>No expiration on bonus funds</li>
          <li>Use on any game in the casino</li>
        </FeatureList>

        <InfoText>
          Start playing any game and your bonus will be applied automatically. 
          The house edge works in your favor with these free plays!
        </InfoText>
      </ModalContent>
    </Modal>
  )
}

export default BonusModal
