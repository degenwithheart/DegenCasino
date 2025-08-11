import styled, { keyframes } from 'styled-components'

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

export const ModalContent = styled.div`
  max-width: 380px;
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
    margin: 0.25rem;
    max-width: 98vw;
    border-radius: 10px;
  }
`
