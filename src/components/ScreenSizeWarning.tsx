import React from 'react'
import styled, { keyframes } from 'styled-components'
import { GambaUi } from 'gamba-react-ui-v2'

interface ScreenSizeWarningProps {
  onDismiss: () => void
}

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

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(24, 24, 24, 0.95);
  backdrop-filter: blur(20px);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;

  @media (max-width: 600px) {
    padding: 6px;
    align-items: flex-start;
  }

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: 
      radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(162, 89, 255, 0.08) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
  }
`

const Container = styled.div`
  background: rgba(24, 24, 24, 0.8);
  backdrop-filter: blur(20px);
  padding: 2.5rem;
  border-radius: 20px;
  max-width: 600px;
  text-align: center;
  border: 2px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.4);
  position: relative;

  @media (max-width: 600px) {
    padding: 1.1rem 0.5rem;
    border-radius: 8px;
    max-width: 100vw;
    box-shadow: none;
    border-width: 1px;
  }

  /* Casino gradient border effect */
  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(45deg, #ffd700, #a259ff, #ff00cc, #ffd700);
    background-size: 300% 100%;
    border-radius: 20px;
    opacity: 0.4;
    z-index: -1;
    animation: ${moveGradient} 4s linear infinite;
    @media (max-width: 600px) {
      border-radius: 8px;
    }
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
    @media (max-width: 600px) {
      border-radius: 8px;
    }
  }

  > * {
    position: relative;
    z-index: 1;
  }
`

const Title = styled.h2`
  font-size: 2.2rem;
  margin-bottom: 1rem;
  color: #ffd700;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  text-shadow: 0 0 12px #ffd700, 0 0 24px #a259ff;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  @media (max-width: 600px) {
    font-size: 1.3rem;
    margin-bottom: 0.7rem;
  }

  &::before {
    content: '📱';
    font-size: 1.2em;
    filter: drop-shadow(0 0 8px #ffd700);
    animation: ${sparkle} 2s infinite;
  }
`

const Description = styled.p`
  font-size: 1.3rem;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
  font-weight: 500;

  @media (max-width: 600px) {
    font-size: 1.05rem;
    margin-bottom: 1.1rem;
  }
`

const AccentBar = styled.div`
  height: 4px;
  width: 80%;
  max-width: 300px;
  border-radius: 2px;
  margin: 1.5rem auto 2rem;
  background: linear-gradient(90deg, #ffd700, #a259ff, #ff00cc, #ffd700);
  background-size: 300% 100%;
  animation: ${moveGradient} 3s linear infinite;
  box-shadow: 0 0 16px rgba(255, 215, 0, 0.5);
`

const ButtonWrapper = styled.div`
  .gamba-button {
    background: linear-gradient(90deg, #ffd700, #a259ff) !important;
    border: 2px solid transparent !important;
    border-radius: 16px !important;
    padding: 1rem 2rem !important;
    font-weight: 700 !important;
    font-size: 1.1rem !important;
    color: #222 !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 0 24px rgba(255, 215, 0, 0.3) !important;
    animation: ${neonPulse} 2s infinite alternate !important;
    
    &:hover {
      transform: scale(1.05) !important;
      box-shadow: 0 0 36px rgba(255, 215, 0, 0.5) !important;
    }
  }
`

const ScreenSizeWarning: React.FC<ScreenSizeWarningProps> = ({ onDismiss }) => {
  return (
    <Overlay>
      <Container>
        <Title>Screen Size Too Small</Title>
        <AccentBar />
        <Description>
          For the best casino experience, please use a larger screen.<br />
          <strong>Note:</strong> Mobile browsers may display the site incorrectly or with limited functionality.<br />
          Stay tuned. our mobile app is coming soon!
        </Description>
        <ButtonWrapper>
          <GambaUi.Button main onClick={onDismiss}>
            🚀 I Understand
          </GambaUi.Button>
        </ButtonWrapper>
      </Container>
    </Overlay>
  )
}

export default ScreenSizeWarning
