import styled, { keyframes } from 'styled-components'

// Degen dissolve animation for popup mode
export const degenDissolve = keyframes`
  0% { 
    opacity: 0; 
    filter: blur(20px) hue-rotate(180deg); 
    transform: scale(0.6) rotate(-15deg); 
  }
  30% { 
    opacity: 0.8; 
    filter: blur(8px) hue-rotate(90deg); 
    transform: scale(1.1) rotate(5deg); 
  }
  100% { 
    opacity: 1; 
    filter: blur(0) hue-rotate(0deg); 
    transform: scale(1) rotate(0deg); 
  }
`

// Degen viewport transition - slides into main content area
export const degenViewportTransition = keyframes`
  0% { 
    opacity: 0; 
    transform: translateX(100%) scale(0.9);
    filter: blur(20px) hue-rotate(180deg); 
  }
  30% { 
    opacity: 0.7; 
    transform: translateX(20%) scale(1.02);
    filter: blur(8px) hue-rotate(90deg); 
  }
  100% { 
    opacity: 1; 
    transform: translateX(0%) scale(1);
    filter: blur(0) hue-rotate(0deg); 
  }
`

// Degen content fade-in animation
export const degenContentFade = keyframes`
  0% { 
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  60% { 
    opacity: 0.8;
    transform: translateY(-5px) scale(1.01);
  }
  100% { 
    opacity: 1;
    transform: translateY(0px) scale(1);
  }
`

// Degen ring animation - faster, more chaotic
export const degenRing = keyframes`
  0% { 
    transform: rotate(0deg) scale(1); 
    opacity: 0.8;
    filter: hue-rotate(0deg);
  }
  25% { 
    transform: rotate(90deg) scale(1.1); 
    opacity: 1;
    filter: hue-rotate(45deg);
  }
  50% { 
    transform: rotate(180deg) scale(0.95); 
    opacity: 0.9;
    filter: hue-rotate(90deg);
  }
  75% { 
    transform: rotate(270deg) scale(1.05); 
    opacity: 1;
    filter: hue-rotate(135deg);
  }
  100% { 
    transform: rotate(360deg) scale(1); 
    opacity: 0.8;
    filter: hue-rotate(180deg);
  }
`

// Keep old exports for compatibility
export const quantumDissolve = degenViewportTransition;
export const rotateRing = degenRing;

export const Overlay = styled.div<{ $colorScheme?: any; $variant?: 'popup' | 'viewport' }>`
  position: ${({ $variant }) => $variant === 'popup' ? 'fixed' : 'absolute'};
  ${({ $variant }) => $variant === 'popup' ? 'inset: 0;' : 'top: 0; left: 0; right: 0; bottom: 0;'}
  width: 100%;
  height: 100%;
  background: ${({ $colorScheme, $variant }) => {
    if ($variant === 'popup') {
      return $colorScheme?.colors?.surface ? 
        `radial-gradient(ellipse at center, ${$colorScheme.colors.surface}60, ${$colorScheme.colors.background}95 100%)` :
        'radial-gradient(ellipse at center, rgba(10, 10, 10, 0.8) 60%, rgba(5, 5, 20, 0.95) 100%)';
    } else {
      return $colorScheme?.colors?.surface ? 
        `linear-gradient(135deg, ${$colorScheme.colors.surface}95, ${$colorScheme.colors.background}98 100%)` :
        'linear-gradient(135deg, rgba(15, 15, 25, 0.98) 0%, rgba(10, 10, 20, 0.99) 100%)';
    }
  }};
  backdrop-filter: ${({ $variant }) => $variant === 'popup' ? 'blur(15px) saturate(1.4) contrast(1.2)' : 'blur(8px) saturate(1.3)'};
  z-index: ${({ $variant }) => $variant === 'popup' ? '9999' : '1000'};
  display: flex;
  ${({ $variant }) => $variant === 'popup' ? 
    'align-items: center; justify-content: center;' : 
    'flex-direction: column;'
  }
  overflow: hidden;
  animation: ${({ $variant }) => $variant === 'popup' ? degenDissolve : degenViewportTransition} ${({ $variant }) => $variant === 'popup' ? '0.8s' : '0.6s'} cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border-radius: 0;
`;

export const ParticleField = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`

export const Portal = styled.div<{ $variant?: 'popup' | 'viewport' }>`
  position: relative;
  width: ${({ $variant }) => $variant === 'popup' ? 'min(500px, 90vw)' : '100%'};
  height: ${({ $variant }) => $variant === 'popup' ? 'min(500px, 90vw)' : '100%'};
  display: flex;
  ${({ $variant }) => $variant === 'popup' ? 
    'align-items: center; justify-content: center; border-radius: 50%;' : 
    'flex-direction: column; justify-content: flex-start; align-items: center;'
  }
  padding: ${({ $variant }) => $variant === 'popup' ? '0' : '2rem'};
  background: ${({ $variant }) => $variant === 'popup' ? 
    `radial-gradient(circle, rgba(15, 15, 25, 0.95) 60%, rgba(255, 215, 0, 0.1) 80%, rgba(162, 89, 255, 0.15) 100%)` : 
    'transparent'
  };
  ${({ $variant }) => $variant === 'popup' ? `
    box-shadow: 
      0 0 100px 25px rgba(255, 215, 0, 0.3),
      0 0 50px 15px rgba(162, 89, 255, 0.4),
      0 0 0 10px rgba(255, 215, 0, 0.2),
      inset 0 0 50px rgba(162, 89, 255, 0.1);
    backdrop-filter: blur(25px) saturate(1.8);
  ` : ''}
  overflow: ${({ $variant }) => $variant === 'popup' ? 'visible' : 'auto'};
  z-index: 1;

  @media (max-width: 768px) {
    padding: ${({ $variant }) => $variant === 'popup' ? '0' : '1rem'};
    ${({ $variant }) => $variant === 'popup' ? `
      width: min(400px, 88vw);
      height: min(400px, 88vw);
    ` : ''}
  }

  @media (min-width: 768px) {
    ${({ $variant }) => $variant === 'popup' ? `
      width: min(550px, 85vw);
      height: min(550px, 85vw);
    ` : ''}
  }
`;

export const EnergyRing = styled.div<{ $variant?: 'popup' | 'viewport' }>`
  ${({ $variant }) => $variant === 'popup' ? `
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    border-radius: 50%;
    border: 6px solid rgba(255, 215, 0, 0.7);
    box-shadow: 
      0 0 40px 12px rgba(255, 215, 0, 0.5),
      0 0 20px 6px rgba(162, 89, 255, 0.4),
      0 0 0 3px rgba(255, 255, 255, 0.2);
    pointer-events: none;
    animation: ${degenRing} 4s ease-in-out infinite;
  ` : 'display: none;'}
`;

export const EnergyRing2 = styled(EnergyRing)<{ $variant?: 'popup' | 'viewport' }>`
  ${({ $variant }) => $variant === 'popup' ? `
    border: 3px dashed rgba(162, 89, 255, 0.8);
    box-shadow: 
      0 0 30px 8px rgba(162, 89, 255, 0.6),
      0 0 15px 4px rgba(255, 215, 0, 0.4),
      0 0 0 2px rgba(255, 255, 255, 0.1);
    animation-duration: 6s;
    animation-direction: reverse;
  ` : 'display: none;'}
`;

export const HoloText = styled.div<{ $variant?: 'popup' | 'viewport' }>`
  position: ${({ $variant }) => $variant === 'popup' ? 'absolute' : 'relative'};
  ${({ $variant }) => $variant === 'popup' ? `
    top: 18%;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
    user-select: none;
  ` : `
    width: 100%;
    text-align: center;
    margin-bottom: 2rem;
  `}
  color: #ffd700;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: ${({ $variant }) => $variant === 'popup' ? 'clamp(1rem, 3vw, 1.3rem)' : 'clamp(1.5rem, 4vw, 2.5rem)'};
  letter-spacing: 0.15em;
  text-shadow: 
    0 0 20px rgba(255, 215, 0, 0.8),
    0 0 8px rgba(255, 215, 0, 0.6),
    0 0 4px rgba(162, 89, 255, 0.4);
  font-weight: 700;
  text-transform: uppercase;
  animation: ${({ $variant }) => $variant === 'popup' ? 'none' : `${degenContentFade} 0.8s ease-out 0.2s both`};
  
  ${({ $variant }) => $variant === 'viewport' ? `
    &::before {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 60%;
      height: 2px;
      background: linear-gradient(90deg, transparent, #ffd700, transparent);
      box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
    }
  ` : ''}
  
  @media (max-width: 768px) {
    ${({ $variant }) => $variant === 'viewport' ? 'margin-bottom: 1.5rem; font-size: clamp(1.2rem, 5vw, 1.8rem);' : ''}
    ${({ $variant }) => $variant === 'popup' ? 'top: 20%;' : ''}
  }
`;

export const Content = styled.div<{ $variant?: 'popup' | 'viewport' }>`
  position: relative;
  z-index: 2;
  width: ${({ $variant }) => $variant === 'popup' ? 'auto' : '100%'};
  max-width: ${({ $variant }) => $variant === 'popup' ? 'none' : '800px'};
  background: linear-gradient(
    135deg,
    rgba(15, 15, 25, 0.95) 0%,
    rgba(255, 215, 0, 0.08) 25%,
    rgba(162, 89, 255, 0.12) 75%,
    rgba(15, 15, 25, 0.95) 100%
  );
  border-radius: ${({ $variant }) => $variant === 'popup' ? '20px' : '16px'};
  border: 2px solid rgba(255, 215, 0, 0.3);
  box-shadow: 
    0 0 40px rgba(255, 215, 0, ${({ $variant }) => $variant === 'popup' ? '0.3' : '0.2'}),
    0 0 20px rgba(162, 89, 255, ${({ $variant }) => $variant === 'popup' ? '0.4' : '0.3'}),
    0 0 0 1px rgba(255, 215, 0, 0.4),
    inset 0 0 30px rgba(162, 89, 255, 0.05);
  padding: ${({ $variant }) => $variant === 'popup' ? 'clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 3vw, 2rem)' : '2rem'};
  ${({ $variant }) => $variant === 'popup' ? 'min-height: 120px;' : ''}
  color: #ffd700;
  font-family: 'Inter', 'Arial', sans-serif;
  animation: ${({ $variant }) => $variant === 'popup' ? `${degenDissolve} 0.8s cubic-bezier(0.68,-0.55,0.265,1.55)` : `${degenContentFade} 0.8s ease-out 0.4s both`};
  backdrop-filter: blur(${({ $variant }) => $variant === 'popup' ? '25px' : '20px'}) saturate(1.5);
  ${({ $variant }) => $variant === 'viewport' ? `
    overflow-y: auto;
    max-height: calc(100vh - 200px);
  ` : ''}

  @media (max-width: 768px) {
    border-radius: ${({ $variant }) => $variant === 'popup' ? '16px' : '12px'};
    padding: ${({ $variant }) => $variant === 'popup' ? '1.25rem 1rem' : '1.5rem'};
    ${({ $variant }) => $variant === 'viewport' ? 'max-height: calc(100vh - 120px);' : ''}
  }
  
  @media (max-width: 479px) {
    ${({ $variant }) => $variant === 'viewport' ? `
      padding: 1rem;
      max-height: calc(100vh - 80px);
    ` : ''}
  }

  @media (min-width: 768px) {
    border-radius: ${({ $variant }) => $variant === 'popup' ? '24px' : '16px'};
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: linear-gradient(
    135deg,
    rgba(255, 215, 0, 0.2) 0%,
    rgba(162, 89, 255, 0.3) 50%,
    rgba(255, 215, 0, 0.2) 100%
  );
  border: 2px solid rgba(255, 215, 0, 0.5);
  color: #ffd700;
  font-size: 1.5rem;
  border-radius: 8px;
  width: 44px;
  height: 44px;
  cursor: pointer;
  box-shadow: 
    0 4px 15px rgba(15, 15, 25, 0.6),
    0 2px 8px rgba(255, 215, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
  backdrop-filter: blur(10px);
  font-family: 'Inter', 'Arial', sans-serif;
  font-weight: 700;

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(255, 215, 0, 0.4) 0%,
      rgba(162, 89, 255, 0.5) 50%,
      rgba(255, 215, 0, 0.4) 100%
    );
    transform: scale(1.1) rotate(90deg);
    box-shadow: 
      0 6px 20px rgba(15, 15, 25, 0.7),
      0 3px 12px rgba(255, 215, 0, 0.4),
      0 0 15px rgba(162, 89, 255, 0.3);
    border-color: rgba(255, 215, 0, 0.8);
  }

  &:active {
    transform: scale(1.05) rotate(90deg);
    transition: all 0.1s ease;
  }

  @media (max-width: 768px) {
    top: 1rem;
    right: 1rem;
    width: 40px;
    height: 40px;
    font-size: 1.3rem;
  }
  
  @media (max-width: 479px) {
    top: 0.5rem;
    right: 0.5rem;
    width: 36px;
    height: 36px;
    font-size: 1.2rem;
  }
`;