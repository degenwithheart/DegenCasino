import React from 'react'
import { Modal } from '../Modal/Modal'
import { TOS_HTML } from '../../constants'
import styled, { keyframes } from 'styled-components'
import { useColorScheme } from '../../themes/ColorSchemeContext'

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  position: relative;
`

const Title = styled.h2<{ $colorScheme?: any }>`
  color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  letter-spacing: 0.15em;
  text-shadow: 0 0 16px #ffd700cc, 0 0 4px #fff;
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

const TOSContentWrapper = styled.div`
  background: rgba(255, 215, 0, 0.08);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
  animation: ${fadeIn} 0.5s ease-out;
  box-shadow: 0 0 16px rgba(255, 215, 0, 0.15);

  p {
    color: #eaf6fb;
    font-size: 0.95rem;
    font-family: 'JetBrains Mono', monospace;
    margin: 1rem 0;
    line-height: 1.6;

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }

    b {
      color: #ffd700;
      font-weight: 700;
      text-shadow: 0 0 8px #ffd70088;
    }

    a {
      color: #6ffaff;
      text-decoration: none;
      text-shadow: 0 0 8px #6ffaff88;
      transition: all 0.2s ease;

      &:hover {
        color: #ffd700;
        text-shadow: 0 0 12px #ffd700;
      }
    }
  }
`

const ComplianceText = styled.p`
  color: #a259ff;
  font-size: 1.1rem;
  font-family: 'JetBrains Mono', monospace;
  text-align: center;
  margin: 1.5rem 0 2rem;
  line-height: 1.7;
  text-shadow: 0 0 8px #a259ff;
`

const AcceptButton = styled.button`
  margin: 0 auto;
  display: block;
  padding: 1rem 2.5rem;
  font-size: 1.3rem;
  font-weight: 700;
  border-radius: 2rem;
  background: linear-gradient(90deg, #ffd700, #a259ff);
  color: #222;
  box-shadow: 0 0 24px #ffd70088;
  border: none;
  cursor: pointer;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  letter-spacing: 1px;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 32px #ffd700bb;
  }

  &:active {
    transform: scale(0.98);
  }
`

interface TOSModalProps {
  onClose: () => void
  onAccept: () => void
}

const TOSInner: React.FC<{ onAccept: () => void }> = ({ onAccept }) => {
  const { currentColorScheme } = useColorScheme();
  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '0 auto',
      padding: '1.5rem',
      color: '#eaf6fb',
      fontFamily: "'JetBrains Mono', 'Orbitron', 'monospace'"
    }}>
      <HeaderSection>
        <Title $colorScheme={currentColorScheme}>📜 TERMS OF SERVICE</Title>
        <Subtitle>Legal Compliance & Guidelines</Subtitle>
      </HeaderSection>

      <TOSContentWrapper dangerouslySetInnerHTML={{ __html: TOS_HTML }} />

      <ComplianceText>
        By playing on our platform, you confirm your compliance.
      </ComplianceText>

      <AcceptButton onClick={onAccept}>
        I UNDERSTAND & ACCEPT
      </AcceptButton>
    </div>
  )
}

export const TOSContent: React.FC<{ onAccept: () => void }> = ({ onAccept }) => (
  <TOSInner onAccept={onAccept} />
)

const TOSModal: React.FC<TOSModalProps> = ({ onClose, onAccept }) => {
  const { currentColorScheme } = useColorScheme();
  const handleAccept = () => {
    onAccept()
    onClose()
  }

  return (
    <Modal onClose={onClose}>
      <TOSContent onAccept={handleAccept} />
    </Modal>
  )
}

export default TOSModal
