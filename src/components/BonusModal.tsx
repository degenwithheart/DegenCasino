import React from 'react'
import { TokenValue, useUserBalance } from 'gamba-react-ui-v2'
import styled, { keyframes } from 'styled-components'
import { Modal } from './Modal'
import { sparkle } from '../themes/globalThemes'

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

const Title = styled.h2`
  color: #6ffaff;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  letter-spacing: 0.15em;
  text-shadow: 0 0 16px #6ffaffcc, 0 0 4px #fff;
  font-family: 'Orbitron', 'JetBrains Mono', monospace;
`

const Subtitle = styled.p`
  color: #a259ff;
  font-size: 0.9rem;
  margin: 0;
  letter-spacing: 0.1em;
  text-shadow: 0 0 8px #a259ff88;
  font-family: 'JetBrains Mono', monospace;
`

const BonusAmount = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(111, 250, 255, 0.08);
  border: 2px solid rgba(111, 250, 255, 0.3);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #6ffaff;
  text-shadow: 0 0 8px #6ffaff;
  box-shadow: 0 0 16px rgba(111, 250, 255, 0.15);
  transition: all 0.3s ease;
  font-family: 'JetBrains Mono', monospace;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 24px rgba(111, 250, 255, 0.25);
    border-color: rgba(111, 250, 255, 0.5);
  }

  &::before {
    content: '⚛️';
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
  color: #eaf6fb;
  font-size: 0.9rem;
  font-family: 'JetBrains Mono', monospace;
  text-align: center;
  margin: 1rem 0;
  line-height: 1.5;
  opacity: 0.9;

  strong, b {
    color: #6ffaff;
    font-weight: 700;
    text-shadow: 0 0 6px #6ffaff88;
  }
`

const FeatureList = styled.ul`
  background: rgba(111, 250, 255, 0.08);
  border: 1px solid rgba(111, 250, 255, 0.3);
  border-radius: 12px;
  padding: 1rem;
  margin: 1rem 0;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0;
    color: #eaf6fb;
    font-size: 0.95rem;
    font-family: 'JetBrains Mono', monospace;

    &::before {
      content: '⚛️';
      font-size: 1.2rem;
      background: rgba(111, 250, 255, 0.15);
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 8px rgba(111, 250, 255, 0.25);
      filter: drop-shadow(0 0 4px #6ffaff);
    }

    @media (max-width: 600px) {
      font-size: 0.9rem;
      gap: 0.4rem;
      padding: 0.3rem 0;
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

const BonusInner: React.FC = () => {
  const balance = useUserBalance()

  return (
    <div style={{ 
      maxWidth: '420px', 
      margin: '0 auto',
      padding: '1.5rem',
      color: '#eaf6fb',
      fontFamily: "'JetBrains Mono', 'Orbitron', 'monospace'"
    }}>
      <HeaderSection>
        <Title>BONUS SYSTEM</Title>
        <Subtitle>Free Play Quantum Mechanics</Subtitle>
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
    </div>
  )
}

export const BonusContent = BonusInner

const BonusModal: React.FC<BonusModalProps> = ({ onClose }) => {
  return (
    <Modal onClose={onClose}>
      <BonusContent />
    </Modal>
  )
}

export default BonusModal
