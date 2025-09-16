import styled, { keyframes } from 'styled-components'

// Romantic love letter dissolve animation
export const loveLetterDissolve = keyframes`
  0% { 
    opacity: 0; 
    filter: blur(12px); 
    transform: scale(0.8) rotate(-5deg); 
  }
  60% { 
    opacity: 1; 
    filter: blur(2px); 
    transform: scale(1.02) rotate(1deg); 
  }
  100% { 
    opacity: 1; 
    filter: blur(0); 
    transform: scale(1) rotate(0deg); 
  }
`

// Romantic candlelight ring animation
export const candlelightRing = keyframes`
  0% { 
    transform: rotate(0deg) scale(1); 
    opacity: 0.6;
  }
  50% { 
    transform: rotate(180deg) scale(1.05); 
    opacity: 1;
  }
  100% { 
    transform: rotate(360deg) scale(1); 
    opacity: 0.6;
  }
`

// Keep old exports for compatibility
export const quantumDissolve = loveLetterDissolve;
export const rotateRing = candlelightRing;

export const Overlay = styled.div<{ $colorScheme?: any }>`
  position: fixed;
  inset: 0;
  background: ${({ $colorScheme }) => $colorScheme?.colors?.surface ? 
    `radial-gradient(ellipse at center, ${$colorScheme.colors.surface}60, ${$colorScheme.colors.background}95 100%)` :
    'radial-gradient(ellipse at center, var(--deep-romantic-night) 60%, rgba(10, 5, 17, 0.95) 100%)'
  };
  backdrop-filter: blur(10px) saturate(1.2);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const ParticleField = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
`

export const Portal = styled.div`
  position: relative;
  width: min(500px, 90vw);
  height: min(500px, 90vw);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: radial-gradient(
    circle, 
    rgba(10, 5, 17, 0.9) 60%, 
    rgba(139, 90, 158, 0.2) 100%
  );
  box-shadow: 
    0 0 80px 20px rgba(212, 165, 116, 0.2),
    0 0 40px 10px rgba(184, 51, 106, 0.3),
    0 0 0 8px rgba(139, 90, 158, 0.4);
  animation: ${loveLetterDissolve} 0.8s cubic-bezier(0.7,0.2,0.2,1);
  overflow: visible;
  backdrop-filter: blur(20px) saturate(1.5);

  @media (max-width: 479px) {
    width: min(400px, 88vw);
    height: min(400px, 88vw);
  }

  @media (min-width: 768px) {
    width: min(550px, 85vw);
    height: min(550px, 85vw);
  }
`;

export const EnergyRing = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 50%;
  border: 4px solid rgba(212, 165, 116, 0.6);
  box-shadow: 
    0 0 32px 8px rgba(212, 165, 116, 0.4),
    0 0 16px 4px rgba(184, 51, 106, 0.3),
    0 0 0 2px rgba(255, 255, 255, 0.1);
  pointer-events: none;
  animation: ${candlelightRing} 6s ease-in-out infinite;
`;

export const EnergyRing2 = styled(EnergyRing)`
  border: 2px dashed rgba(139, 90, 158, 0.6);
  box-shadow: 
    0 0 24px 4px rgba(139, 90, 158, 0.4),
    0 0 12px 2px rgba(184, 51, 106, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  animation-duration: 9s;
  animation-direction: reverse;
`;

export const HoloText = styled.div`
  position: absolute;
  top: 18%;
  left: 50%;
  transform: translateX(-50%);
  color: var(--love-letter-gold);
  font-family: 'Libre Baskerville', serif;
  font-size: clamp(1rem, 3vw, 1.2rem);
  letter-spacing: 0.08em;
  text-shadow: 
    0 0 12px rgba(212, 165, 116, 0.6),
    0 0 4px rgba(212, 165, 116, 0.4),
    0 0 2px rgba(255, 255, 255, 0.3);
  pointer-events: none;
  user-select: none;
  font-weight: 500;
  text-align: center;
  
  @media (max-width: 479px) {
    top: 20%;
  }
`;

export const Content = styled.div`
  position: relative;
  z-index: 2;
  background: linear-gradient(
    135deg,
    rgba(10, 5, 17, 0.95) 0%,
    rgba(139, 90, 158, 0.15) 50%,
    rgba(10, 5, 17, 0.95) 100%
  );
  border-radius: 24px;
  box-shadow: 
    0 0 32px rgba(212, 165, 116, 0.2),
    0 0 16px rgba(184, 51, 106, 0.3),
    0 0 0 1px rgba(212, 165, 116, 0.3);
  padding: clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 3vw, 2rem);
  min-height: 120px;
  color: var(--love-letter-gold);
  font-family: 'DM Sans', sans-serif;
  animation: ${loveLetterDissolve} 0.8s cubic-bezier(0.7,0.2,0.2,1);
  box-sizing: border-box;
  backdrop-filter: blur(20px) saturate(1.3);

  @media (max-width: 479px) {
    border-radius: 18px;
    padding: 1.25rem 1rem;
  }

  @media (min-width: 768px) {
    border-radius: 28px;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  background: linear-gradient(
    135deg,
    rgba(212, 165, 116, 0.3) 0%,
    rgba(184, 51, 106, 0.2) 50%,
    rgba(139, 90, 158, 0.3) 100%
  );
  border: 1px solid rgba(212, 165, 116, 0.4);
  color: var(--love-letter-gold);
  font-size: 1.4rem;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  cursor: pointer;
  box-shadow: 
    0 4px 12px rgba(10, 5, 17, 0.4),
    0 2px 6px rgba(212, 165, 116, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
  backdrop-filter: blur(10px);
  font-family: 'DM Sans', sans-serif;

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(212, 165, 116, 0.5) 0%,
      rgba(184, 51, 106, 0.4) 50%,
      rgba(139, 90, 158, 0.5) 100%
    );
    transform: scale(1.1) rotate(90deg);
    box-shadow: 
      0 6px 16px rgba(10, 5, 17, 0.5),
      0 3px 8px rgba(212, 165, 116, 0.3);
    border-color: rgba(212, 165, 116, 0.6);
  }

  &:active {
    transform: scale(1.05) rotate(90deg);
    transition: all 0.2s ease;
  }

  @media (max-width: 479px) {
    top: 12px;
    right: 12px;
    width: 32px;
    height: 32px;
    font-size: 1.2rem;
  }
`;
