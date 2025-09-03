import styled, { keyframes, css } from "styled-components";

// Keyframe animations
export const neonPulse = keyframes<{ $theme?: any }>`
  0% { 
    box-shadow: 0 0 24px ${({ $theme }) => $theme?.colors?.secondary || '#a259ff'}88, 0 0 48px ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}44;
    border-color: ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}44;
  }
  100% { 
    box-shadow: 0 0 48px ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}cc, 0 0 96px ${({ $theme }) => $theme?.colors?.secondary || '#a259ff'}88;
    border-color: ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}aa;
  }
`;

export const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

export const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
`;

// Animated accent bar
export const AccentBar = styled.div<{ $theme?: any; $particles?: boolean }>`
  height: 6px;
  width: 100%;
  border-radius: 3px;
  margin: 0.5rem 0 1.5rem;
  background: linear-gradient(90deg, ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}, ${({ $theme }) => $theme?.colors?.secondary || '#a259ff'}, ${({ $theme }) => $theme?.colors?.accent || '#ff00cc'}, ${({ $theme }) => $theme?.colors?.primary || '#ffd700'});
  ${({ $particles }) => !$particles && css`filter: grayscale(0.2) brightness(0.85);`}
`;

// Casino sparkle decoration
export const CasinoSparkles = styled.div<{ $particles?: boolean }>`
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 1.5rem;
  ${({ $particles }) => $particles && css`animation: ${sparkle} 2s infinite;`}
  pointer-events: none;
`;

// Global Dashboard wrapper with enhanced casino styling
interface CompactDivProps {
  $compact?: boolean;
  $theme?: any;
}
export const DashboardWrapper = styled.div<CompactDivProps>`
  max-width: none; /* Let main handle max-width */
  margin: 2rem 0; /* Only vertical margins */
  padding: ${({ $compact }) => ($compact ? '2rem' : '3rem')};
  background: ${({ $theme }) => $theme?.colors?.background || '#0f0f23'};
  border-radius: 12px;
  border: 1px solid ${({ $theme }) => $theme?.colors?.border || '#2a2a4a'};
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ $theme }) => $theme?.colors?.primary || '#ffd700'};
    box-shadow: ${({ $theme }) => $theme?.effects?.glow || '0 0 24px rgba(255, 215, 0, 0.2)'};
    transform: translateY(-2px);
  }

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: 
      radial-gradient(circle at 20% 80%, ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}11 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, ${({ $theme }) => $theme?.colors?.secondary || '#a259ff'}11 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
  }

  @media (max-width: 1200px) {
    margin: 1.5rem 0;
    padding: ${({ $compact }) => ($compact ? '1.5rem' : '2rem')};
  }
  @media (max-width: 900px) {
    margin: 1rem 0;
    padding: ${({ $compact }) => ($compact ? '1rem' : '1.5rem')};
  }
  @media (max-width: 700px) {
    margin: 0.5rem 0;
    padding: ${({ $compact }) => ($compact ? '0.8rem' : '1rem')};
    border-radius: ${({ $compact }) => ($compact ? '0.8rem' : '1rem')};
    max-width: 100vw;
  }
  @media (max-width: 480px) {
    margin: 0;
    padding: ${({ $compact }) => ($compact ? '0.6rem' : '0.8rem')};
    border-radius: 0.8rem;
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

export const GameSliderWrapper = styled.div<{ $theme?: any }>`
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
  scrollbar-color: ${({ $theme }) => `rgba(255, 255, 255, 0.1) ${$theme?.colors?.surface || 'transparent'}`};
  scroll-behavior: smooth;

  /* Ensure minimum touch target size */
  min-height: 200px;

  /* Prevent games from extending outside container */
  contain: layout style paint;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ $theme }) => $theme?.colors?.primary || '#ffd700'};
    border-radius: 4px;
    border: 1px solid ${({ $theme }) => $theme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ $theme }) => $theme?.colors?.secondary || '#a259ff'};
  }

  &::-webkit-scrollbar-track {
    background: ${({ $theme }) => $theme?.colors?.surface || 'rgba(255, 255, 255, 0.05)'};
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
export const GameCardWrapper = styled.div<CompactProps & { $theme?: any }>`
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
    box-shadow: 0 0 32px ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}cc, 0 0 64px ${({ $theme }) => $theme?.colors?.secondary || '#a259ff'}88;
    border: 2px solid ${({ $theme }) => $theme?.colors?.primary || '#ffd700'};
    z-index: 10;
  }

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}, ${({ $theme }) => $theme?.colors?.secondary || '#a259ff'}, ${({ $theme }) => $theme?.colors?.accent || '#ff00cc'}, ${({ $theme }) => $theme?.colors?.primary || '#ffd700'});
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
    border-color: ${({ $theme }) => $theme?.colors?.primary || '#ffd700'};
    box-shadow: 0 0 24px ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}22;
    transform: translateY(-2px);
  }

  /* Ensure game cards don't overflow outside section */
  overflow: hidden;

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    font-family: 'Luckiest Guy', cursive, sans-serif;
    font-size: ${({ $compact }) => ($compact ? '1.2rem' : '2rem')};
    color: ${({ $theme }) => $theme?.colors?.primary || '#ffd700'};
    text-shadow: 0 0 8px ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}, 0 0 24px ${({ $theme }) => $theme?.colors?.secondary || '#a259ff'};
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

export const ConnectButton = styled.button<CompactDivProps & { $theme?: any }>`
  margin: 2rem auto 0;
  display: block;
  padding: ${({ $compact }) => ($compact ? '0.7rem 1.2rem' : '1rem 2.5rem')};
  font-size: ${({ $compact }) => ($compact ? '1rem' : '1.3rem')};
  font-weight: 700;
  border-radius: ${({ $compact }) => ($compact ? '1.2rem' : '2rem')};
  background: linear-gradient(90deg, ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}, ${({ $theme }) => $theme?.colors?.secondary || '#a259ff'});
  color: ${({ $theme }) => $theme?.colors?.background || '#222'};
  box-shadow: 0 0 24px ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}88;
  border: none;
  cursor: pointer;
  animation: ${neonPulse} 1.5s infinite alternate;
  transition: all 0.3s ease-in-out;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  letter-spacing: 1px;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 48px ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}cc;
  }
`;

export const ToggleButton = styled.button<{ $active: boolean; $compact?: boolean; $theme?: any }>`
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  font-size: ${({ $compact }) => ($compact ? '1.1rem' : '1.3rem')};
  color: ${({ $active, $theme }) => $active ? ($theme?.colors?.primary || '#ffd700') : 'rgba(255, 255, 255, 0.7)'};
  text-shadow: ${({ $active, $theme }) => $active
    ? `0 0 8px ${$theme?.colors?.primary || '#ffd700'}, 0 0 24px ${$theme?.colors?.secondary || '#a259ff'}`
    : `0 0 4px ${$theme?.colors?.primary || '#ffd700'}44`
  };
  letter-spacing: 1px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.2s;
  outline: none;
  filter: ${({ $active, $theme }) => $active ? `drop-shadow(0 0 8px ${$theme?.colors?.primary || '#ffd700'})` : 'none'};
  opacity: ${({ $active }) => $active ? 1 : 0.5};
  border-bottom: ${({ $active, $theme }) => $active ? `3px solid ${$theme?.colors?.primary || '#ffd700'}` : '3px solid transparent'};
  padding-bottom: 0.2em;

  &:hover {
    opacity: 0.8;
    color: ${({ $theme }) => $theme?.colors?.primary || '#ffd700'};
  }
`;
