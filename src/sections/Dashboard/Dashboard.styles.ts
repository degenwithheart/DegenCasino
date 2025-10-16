import styled, { keyframes, css } from "styled-components";

// Romantic Serenade Keyframe animations
export const romanticPulse = keyframes<{ $colorScheme?: any; }>`
  0% { 
    box-shadow: 
      0 0 30px rgba(212, 165, 116, 0.4), 
      0 0 60px rgba(184, 51, 106, 0.2);
    border-color: rgba(212, 165, 116, 0.3);
  }
  50% { 
    box-shadow: 
      0 0 50px rgba(212, 165, 116, 0.6), 
      0 0 100px rgba(184, 51, 106, 0.4),
      0 0 150px rgba(139, 90, 158, 0.2);
    border-color: rgba(212, 165, 116, 0.6);
  }
  100% { 
    box-shadow: 
      0 0 30px rgba(212, 165, 116, 0.4), 
      0 0 60px rgba(184, 51, 106, 0.2);
    border-color: rgba(212, 165, 116, 0.3);
  }
`;

export const loveLetterGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export const candlestickSparkle = keyframes`
  0%, 100% { 
    opacity: 0.6; 
    transform: scale(0.9) rotate(0deg); 
  }
  33% { 
    opacity: 1; 
    transform: scale(1.2) rotate(120deg); 
  }
  66% { 
    opacity: 0.8; 
    transform: scale(1.1) rotate(240deg); 
  }
`;

export const dreamlikeFloat = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
  }
  50% { 
    transform: translateY(-8px) rotate(2deg); 
  }
`;

// Romantic animated accent bar
export const AccentBar = styled.div<{ $colorScheme?: any; }>`
  height: 4px;
  width: 100%;
  border-radius: 8px;
  margin: 0.5rem 0 1.5rem;
  background: linear-gradient(90deg, 
    rgba(212, 165, 116, 0.8) 0%, 
    rgba(184, 51, 106, 0.6) 25%, 
    rgba(139, 90, 158, 0.7) 50%, 
    rgba(184, 51, 106, 0.6) 75%, 
    rgba(212, 165, 116, 0.8) 100%
  );
  background-size: 300% 100%;
  animation: ${loveLetterGradient} 6s ease-in-out infinite;
  box-shadow: 0 0 12px rgba(212, 165, 116, 0.3);
`;

// Romantic candlestick sparkle decoration
export const CasinoSparkles = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 1.5rem;
  animation: ${candlestickSparkle} 4s ease-in-out infinite;
  pointer-events: none;
  color: rgba(212, 165, 116, 0.7);
  filter: drop-shadow(0 0 8px rgba(212, 165, 116, 0.4));
`;

// Global Dashboard wrapper with romantic glassmorphism styling
interface CompactDivProps {
  $compact?: boolean;
  $colorScheme?: any;
}
export const DashboardWrapper = styled.div<CompactDivProps>`
  max-width: none; /* Let main handle max-width */
  margin: 2rem 0; /* Only vertical margins */
  padding: ${({ $compact }) => ($compact ? '2rem' : '3rem')};
  
  /* Romantic glassmorphism background */
  background: rgba(10, 5, 17, 0.7);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  border: 1px solid rgba(212, 165, 116, 0.18);
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Love letter paper texture */
  box-shadow: 
    0 8px 32px rgba(139, 90, 158, 0.15),
    0 0 40px rgba(212, 165, 116, 0.08),
    inset 0 1px 2px rgba(244, 233, 225, 0.05);

  &:hover {
    border-color: rgba(212, 165, 116, 0.4);
    box-shadow: 
      0 12px 48px rgba(139, 90, 158, 0.2),
      0 0 60px rgba(212, 165, 116, 0.15),
      inset 0 1px 4px rgba(244, 233, 225, 0.08);
    transform: translateY(-4px);
  }

  /* Romantic atmosphere overlay */
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: 
      radial-gradient(circle at 20% 80%, rgba(212, 165, 116, 0.04) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(184, 51, 106, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(139, 90, 158, 0.02) 0%, transparent 60%);
    pointer-events: none;
    z-index: -1;
  }

  /* Candlestick constellation effect */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(1px 1px at 15% 25%, rgba(212, 165, 116, 0.2), transparent),
      radial-gradient(1px 1px at 85% 75%, rgba(184, 51, 106, 0.15), transparent),
      radial-gradient(1px 1px at 55% 15%, rgba(139, 90, 158, 0.15), transparent);
    background-size: 150px 150px, 200px 200px, 175px 175px;
    animation: ${dreamlikeFloat} 20s infinite ease-in-out;
    pointer-events: none;
    border-radius: 16px;
  }

  /* Responsive mobile-first scaling */
  @media (max-width: 1200px) {
    margin: 1.5rem 0;
    padding: ${({ $compact }) => ($compact ? '1.5rem' : '2rem')};
    border-radius: 14px;
  }
  
  @media (max-width: 900px) {
    margin: 1rem 0;
    padding: ${({ $compact }) => ($compact ? '1rem' : '1.5rem')};
    border-radius: 12px;
  }
  
  @media (max-width: 700px) {
    margin: 0.5rem 0;
    padding: ${({ $compact }) => ($compact ? '0.8rem' : '1rem')};
    border-radius: 10px;
    max-width: 100vw;
  }
  
  @media (max-width: 480px) {
    margin: 0.25rem 0;
    padding: ${({ $compact }) => ($compact ? '0.6rem' : '0.8rem')};
    border-radius: 8px;
    max-width: 100vw;
  }
  
  @media (max-width: 400px) {
    margin: 0;
    padding: ${({ $compact }) => ($compact ? '0.4rem' : '0.6rem')};
    border-radius: 0.6rem;
    max-width: 100vw;
  }
`;

// Type for compact prop used in styled components
export type CompactProps = {
  $compact?: boolean;
};

export const GameSliderWrapper = styled.div<{ $colorScheme?: any; }>`
  width: 100%;
  display: flex;
  gap: 1.5rem;
  justify-content: flex-start;
  flex-wrap: nowrap;
  padding-bottom: 1rem;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: ${({ $colorScheme }) => `rgba(255, 255, 255, 0.1) ${$colorScheme?.colors?.surface || 'transparent'}`};
  scroll-behavior: smooth;

  /* Fixed height to prevent container floating */
  height: 200px;

  /* Prevent games from extending outside container */
  contain: layout style paint;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
    border-radius: 4px;
    border: 1px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ $colorScheme }) => $colorScheme?.colors?.secondary || '#a259ff'};
  }

  &::-webkit-scrollbar-track {
    background: ${({ $colorScheme }) => $colorScheme?.colors?.surface || 'rgba(255, 255, 255, 0.05)'};
    border-radius: 4px;
  }

  & > * {
    flex: 0 0 auto;
    min-width: 0; /* Allow flex items to shrink below their minimum content size */
    /* Ensure hover effects don't break out of container */
    transform-origin: center;
  }

  /* Ensure all games are accessible by making the container scrollable */
  @media (max-width: 768px) {
    gap: 1rem;
    padding: 0.75rem 1.5rem 1.5rem 1.5rem;
    justify-content: flex-start; /* Always left-align for better scrolling */
  }

  @media (max-width: 480px) {
    gap: 0.75rem;
    padding: 0.5rem 1rem 1rem 1rem;

    &::-webkit-scrollbar {
      height: 6px;
    }
  }

  /* Add scroll snap for better UX */
  scroll-snap-type: x mandatory;

  & > * {
    scroll-snap-align: start;
  }
`;

// Glassy wrapper for game cards in slider with neon effects
export const GameCardWrapper = styled.div<CompactProps & { $colorScheme?: any; }>`
  width: ${({ $compact }) => ($compact ? '180px' : '200px')};
  height: ${({ $compact }) => ($compact ? '162px' : '180px')};
  max-width: 220px;
  min-width: 160px;
  display: flex;
  align-items: stretch;
  justify-content: center;
  background: rgba(24, 24, 24, 0.6);
  backdrop-filter: blur(15px);
  border-radius: ${({ $compact }) => ($compact ? '0.8rem' : '1rem')};
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  padding: ${({ $compact }) => ($compact ? '0.5rem' : '0.75rem')};
  transition: all 0.3s ease-in-out;
  position: relative;

  /* Ensure hover effects stay within container bounds */
  transform-origin: center;
  will-change: transform;

  &:hover {
    transform: scale(1.03) rotate(-1deg);
    box-shadow: 0 0 32px ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'}cc, 0 0 64px ${({ $colorScheme }) => $colorScheme?.colors?.secondary || '#a259ff'}88;
    border: 2px solid ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
    z-index: 10;
  }

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'}, ${({ $colorScheme }) => $colorScheme?.colors?.secondary || '#a259ff'}, ${({ $colorScheme }) => $colorScheme?.colors?.accent || '#ff00cc'}, ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'});
    border-radius: 1rem;
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease-in-out;
  }

  &:hover::before {
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    width: ${({ $compact }) => ($compact ? '160px' : '180px')};
    height: ${({ $compact }) => ($compact ? '144px' : '162px')};
    min-width: 140px;
    max-width: 200px;
    padding: ${({ $compact }) => ($compact ? '0.4rem' : '0.6rem')};
  }

  @media (max-width: 480px) {
    width: 140px;
    height: 126px;
    min-width: 120px;
    max-width: 160px;
    padding: 0.3rem;
    border-radius: 0.6rem;
  }

  @media (max-width: 400px) {
    width: 120px;
    height: 108px;
    min-width: 100px;
    max-width: 140px;
  }
`;

export const Grid = styled.div<CompactDivProps>`
  display: grid;
  gap: 1.25rem;
  grid-template-columns: ${({ $compact }) => ($compact ? '1fr' : 'repeat(auto-fit, minmax(180px, 1fr))')};
  padding: 1rem;

  @media (min-width: 600px) {
    grid-template-columns: ${({ $compact }) => ($compact ? '2fr' : 'repeat(3, 1fr)')};
  }

  @media (min-width: 800px) {
    grid-template-columns: ${({ $compact }) => ($compact ? '3fr' : 'repeat(4, 1fr)')};
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
`;

export const SectionWrapper = styled.div<CompactDivProps>`
  max-width: none; /* Let main handle max-width */
  margin-bottom: 3rem;
  margin-top: 3rem;
  padding: ${({ $compact }) => ($compact ? '1rem' : '2rem')};
  background: #0f0f23;
  border-radius: 12px;
  border: 1px solid #2a2a4a;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
    box-shadow: 0 0 24px ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'}22;
    transform: translateY(-2px);
  }

  /* Ensure game cards don't overflow outside section */
  overflow: hidden;

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    font-family: 'Luckiest Guy', cursive, sans-serif;
    font-size: ${({ $compact }) => ($compact ? '1.2rem' : '2rem')};
    color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
    text-shadow: 0 0 8px ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'}, 0 0 24px ${({ $colorScheme }) => $colorScheme?.colors?.secondary || '#a259ff'};
    letter-spacing: 1px;
  }

  @media (max-width: 900px) {
    margin-bottom: 1rem;
    margin-top: 1rem;
    padding: ${({ $compact }) => ($compact ? '0.5rem' : '1rem')};
    border-radius: 12px;
  }
  @media (max-width: 700px) {
    margin-left: 0;
    border-radius: 12px;
  }
  @media (max-width: 480px) {
    margin: 0.5rem 0;
    padding: ${({ $compact }) => ($compact ? '0.5rem' : '0.75rem')};
    border-radius: 12px;
  }
  @media (max-width: 400px) {
    margin: 0.25rem 0;
    padding: ${({ $compact }) => ($compact ? '0.25rem' : '0.5rem')};
    border-radius: 8px;
  }
`;

export const ConnectButton = styled.button<CompactDivProps & { $colorScheme?: any; }>`
  margin: 2rem auto 0;
  display: block;
  padding: ${({ $compact }) => ($compact ? '0.7rem 1.2rem' : '1rem 2.5rem')};
  font-size: ${({ $compact }) => ($compact ? '1rem' : '1.3rem')};
  font-weight: 700;
  border-radius: ${({ $compact }) => ($compact ? '1.2rem' : '2rem')};
  background: linear-gradient(135deg, 
    rgba(212, 165, 116, 0.9) 0%, 
    rgba(184, 51, 106, 0.8) 50%, 
    rgba(139, 90, 158, 0.9) 100%
  );
  color: rgba(244, 233, 225, 0.95);
  box-shadow: 
    0 8px 24px rgba(139, 90, 158, 0.3),
    0 0 40px rgba(212, 165, 116, 0.2);
  border: 1px solid rgba(212, 165, 116, 0.3);
  cursor: pointer;
  animation: ${romanticPulse} 3s infinite ease-in-out;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Libre Baskerville', 'DM Sans', serif;
  letter-spacing: 0.5px;
  backdrop-filter: blur(8px);

  &:hover {
    transform: scale(1.05) translateY(-2px);
    box-shadow: 
      0 12px 36px rgba(139, 90, 158, 0.4),
      0 0 60px rgba(212, 165, 116, 0.3);
    background: linear-gradient(135deg, 
      rgba(212, 165, 116, 1) 0%, 
      rgba(184, 51, 106, 0.9) 50%, 
      rgba(139, 90, 158, 1) 100%
    );
  }
`;

export const ToggleButton = styled.button<{ $active: boolean; $compact?: boolean; $colorScheme?: any; }>`
  /* Romantic glassmorphism toggle button */
  background: ${({ $active }) => $active
    ? 'rgba(212, 165, 116, 0.15)'
    : 'rgba(139, 90, 158, 0.08)'
  };
  backdrop-filter: blur(8px);
  border: 1px solid ${({ $active }) => $active
    ? 'rgba(212, 165, 116, 0.4)'
    : 'rgba(139, 90, 158, 0.2)'
  };
  border-radius: ${({ $compact }) => ($compact ? '10px' : '12px')};
  padding: ${({ $compact }) => ($compact ? '8px 16px' : '10px 20px')};
  margin: 0;
  font-family: 'DM Sans', sans-serif;
  font-size: ${({ $compact }) => ($compact ? '0.9rem' : '1rem')};
  font-weight: 600;
  color: ${({ $active }) => $active
    ? 'rgba(212, 165, 116, 1)'
    : 'rgba(244, 233, 225, 0.7)'
  };
  text-shadow: ${({ $active }) => $active
    ? '0 0 12px rgba(212, 165, 116, 0.4), 0 0 24px rgba(184, 51, 106, 0.2)'
    : '0 0 8px rgba(139, 90, 158, 0.3)'
  };
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  position: relative;
  overflow: hidden;

  /* Love letter shimmer effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(212, 165, 116, 0.2), 
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover {
    background: ${({ $active }) => $active
    ? 'rgba(212, 165, 116, 0.25)'
    : 'rgba(139, 90, 158, 0.15)'
  };
    border-color: ${({ $active }) => $active
    ? 'rgba(212, 165, 116, 0.6)'
    : 'rgba(139, 90, 158, 0.4)'
  };
    color: ${({ $active }) => $active
    ? 'rgba(212, 165, 116, 1)'
    : 'rgba(244, 233, 225, 0.9)'
  };
    transform: translateY(-2px);
    box-shadow: 
      0 8px 24px rgba(139, 90, 158, 0.15),
      0 0 30px ${({ $active }) => $active
    ? 'rgba(212, 165, 116, 0.3)'
    : 'rgba(139, 90, 158, 0.2)'
  };
  }

  &:hover::before {
    left: 100%;
  }

  &:active {
    transform: translateY(-1px);
  }
`;
