import React from 'react'
import { TokenValue, useUserBalance } from 'gamba-react-ui-v2'
import { Modal } from '../Modal/Modal'
import { 
  HeaderSection, 
  Title, 
  Subtitle, 
  BonusAmount, 
  InfoText, 
  FeatureList 
} from './Bonus.styles'

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
