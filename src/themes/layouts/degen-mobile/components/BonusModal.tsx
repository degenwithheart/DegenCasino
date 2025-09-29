import React from 'react'
import { TokenValue, useUserBalance } from 'gamba-react-ui-v2'
import styled from 'styled-components'
import { Modal } from './Modal'
import { 
  HeaderSection, 
  Title, 
  Subtitle, 
  BonusAmount, 
  FeatureList 
} from './Bonus.styles'
import { useColorScheme } from '../../../../themes/ColorSchemeContext'
import { spacing, animations, media } from '../breakpoints'

interface BonusModalProps {
  isOpen: boolean;
  onClose: () => void
}

// Modern TikTok/Instagram style container
const ModernBonusContainer = styled.div<{ $colorScheme?: any }>`
  max-width: 420px;
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
      circle at 50% 0%,
      rgba(255, 215, 0, 0.1) 0%,
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

const BonusInner: React.FC = () => {
  const balance = useUserBalance()
  const { currentColorScheme } = useColorScheme()

  return (
    <ModernBonusContainer $colorScheme={currentColorScheme}>
      <HeaderSection>
        <Title $colorScheme={currentColorScheme}>BONUS SYSTEM</Title>
        <Subtitle $colorScheme={currentColorScheme}>Free Play Quantum Mechanics</Subtitle>
      </HeaderSection>

      <BonusAmount>
        <TokenValue amount={balance.bonusBalance} />
        <span>FREE PLAYS</span>
      </BonusAmount>

      <FeatureList>
        <li>Bonus applies automatically when you play</li>
        <li>Small wallet fee still required for transactions</li>
        <li>No expiration on bonus funds</li>
        <li>Use on any game in the casino</li>
      </FeatureList>
    </ModernBonusContainer>
  )
}

export const BonusContent = BonusInner

const BonusModal: React.FC<BonusModalProps> = ({ isOpen, onClose }) => {
  const { currentColorScheme } = useColorScheme();
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <BonusContent />
    </Modal>
  )
}

export default BonusModal
