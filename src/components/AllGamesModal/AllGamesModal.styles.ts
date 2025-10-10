import styled, { keyframes } from 'styled-components';

// Romantic animations for all games modal
export const loveLetterSparkle = keyframes`
  0%, 100% { 
    opacity: 0; 
    transform: rotate(0deg) scale(0.8); 
  }
  50% { 
    opacity: 1; 
    transform: rotate(180deg) scale(1.2); 
  }
`;

export const romanticGradientMove = keyframes`
  0% { 
    background-position: 0% 50%; 
  }
  100% { 
    background-position: 100% 50%; 
  }
`;

export const candlestickGlow = keyframes`
  0%, 100% {
    box-shadow: 
      0 0 20px rgba(212, 165, 116, 0.3),
      0 0 40px rgba(184, 51, 106, 0.2),
      inset 0 1px 0 rgba(212, 165, 116, 0.2);
  }
  50% {
    box-shadow: 
      0 0 30px rgba(212, 165, 116, 0.5),
      0 0 60px rgba(184, 51, 106, 0.3),
      inset 0 1px 0 rgba(212, 165, 116, 0.4);
  }
`;

// Keep old exports for compatibility
export const sparkle = loveLetterSparkle;
export const moveGradient = romanticGradientMove;

export const ModalContent = styled.div<{ $colorScheme?: any; }>`
  /* Desktop/base: cap at 700px while respecting dynamic viewport (handles mobile browser UI) */
  width: min(700px, 96dvw);
  min-width: 0;
  min-height: 200px;
  max-height: 80vh;
  margin-bottom: 1rem;
  margin-top: 1rem;
  padding: clamp(1rem, 4vw, 2rem);
  background: ${({ $colorScheme }) => $colorScheme?.colors?.surface || 'linear-gradient(135deg, rgba(10, 5, 17, 0.95) 0%, rgba(139, 90, 158, 0.15) 50%, rgba(10, 5, 17, 0.95) 100%)'};
  border-radius: 24px;
  border: 1px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(212, 165, 116, 0.3)'};
  box-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.glow || '0 16px 48px rgba(10, 5, 17, 0.8), 0 8px 24px rgba(212, 165, 116, 0.1), inset 0 1px 0 rgba(212, 165, 116, 0.2)'};
  backdrop-filter: blur(30px) saturate(1.5);
  position: relative;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.text || 'var(--love-letter-gold)'};
  font-family: 'DM Sans', sans-serif;
  animation: ${candlestickGlow} 4s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 20%, rgba(212, 165, 116, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(184, 51, 106, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(139, 90, 158, 0.05) 0%, transparent 70%);
    pointer-events: none;
    z-index: -1;
    border-radius: 24px;
    opacity: 0.8;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      transparent 30%,
      rgba(212, 165, 116, 0.03) 50%,
      transparent 70%
    );
    background-size: 200% 200%;
    animation: ${romanticGradientMove} 8s ease-in-out infinite;
    pointer-events: none;
    z-index: 1;
    border-radius: 24px;
    opacity: 0.6;
  }

  /* Mobile-first responsive design */
  @media (max-width: 479px) {
    padding: 1rem;
    border-radius: 16px;
    width: min(380px, 94vw);
    margin: 8px auto 12px;
  }

  @media (min-width: 480px) and (max-width: 767px) {
    padding: 1.25rem;
    border-radius: 18px;
    width: min(500px, 92vw);
  }

  @media (min-width: 768px) {
    padding: 1.5rem;
    border-radius: 20px;
  }

  @media (min-width: 1024px) {
    padding: 2rem;
    border-radius: 24px;
  }
`;

export const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  z-index: 10;

  &::before {
    content: '💕';
    position: absolute;
    top: -15px;
    right: 15%;
    font-size: 2.5rem;
    animation: ${loveLetterSparkle} 4s infinite;
    filter: drop-shadow(0 0 8px var(--love-letter-gold));
    opacity: 0.8;
  }

  @media (max-width: 479px) {
    margin-bottom: 1.5rem;
    
    &::before {
      font-size: 2rem;
      top: -12px;
      right: 10%;
    }
  }
`;

export const Title = styled.h1<{ $colorScheme?: any; }>`
  color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || 'var(--love-letter-gold)'};
  font-size: clamp(1.4rem, 5vw, 2.2rem);
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  letter-spacing: 0.1em;
  text-shadow: 
    0 0 16px ${({ $colorScheme }) => $colorScheme?.colors?.primary || 'rgba(212, 165, 116, 0.6)'},
    0 0 4px ${({ $colorScheme }) => $colorScheme?.colors?.primary || 'rgba(212, 165, 116, 0.4)'};
  font-family: 'Libre Baskerville', serif;
  position: relative;
  z-index: 10;

  @media (max-width: 479px) {
    margin-bottom: 0.25rem;
    letter-spacing: 0.05em;
  }
`;

export const HorizontalScroll = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 0.75rem;
  padding: 0.5rem 0 1rem 0;
  max-width: 100%;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
  position: relative;
  z-index: 10;
  
  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ffd700;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #a259ff;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  @media (max-width: 479px) {
    gap: 0.5rem;
    padding: 0.25rem 0 0.25rem 0;
  }
`;

// Card wrapper to match Dashboard GameCard sizing
export const MenuCardWrapper = styled.div`
  width: 180px;
  height: 162px;
  min-width: 160px;
  max-width: 200px;
  display: flex;
  align-items: stretch;
  justify-content: center;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 
      0 8px 24px rgba(10, 5, 17, 0.6),
      0 4px 12px rgba(212, 165, 116, 0.2);
  }

  @media (max-width: 479px) {
    width: 160px;
    height: 144px;
    min-width: 140px;
    border-radius: 10px;
  }

  @media (min-width: 768px) {
    width: 200px;
    height: 180px;
    min-width: 180px;
    border-radius: 14px;
  }
`;
