import React from 'react'
import { TokenValue, useUserBalance } from 'gamba-react-ui-v2'
import { Modal } from '../Modal/Modal'
import { 
  HeaderSection, 
  Title, 
  Subtitle, 
  BonusAmount, 
  FeatureList 
} from './Bonus.styles'
import { useTheme } from '../../themes/ThemeContext'

interface BonusModalProps {
  onClose: () => void
}

const BonusInner: React.FC = () => {
  const balance = useUserBalance()
  const { currentTheme } = useTheme()

  return (
    <div style={{ 
      maxWidth: '420px', 
      margin: '0 auto',
      padding: '1.5rem',
      color: '#eaf6fb',
      fontFamily: "'JetBrains Mono', 'Orbitron', 'monospace'"
    }}>
      <HeaderSection>
        <Title $theme={currentTheme}>BONUS SYSTEM</Title>
        <Subtitle $theme={currentTheme}>Free Play Quantum Mechanics</Subtitle>
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
    </div>
  )
}

export const BonusContent = BonusInner

const BonusModal: React.FC<BonusModalProps> = ({ onClose }) => {
  const { currentTheme } = useTheme();
  return (
    <Modal onClose={onClose}>
      <BonusContent />
    </Modal>
  )
}

export default BonusModal
