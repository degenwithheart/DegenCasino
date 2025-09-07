import styled, { keyframes } from 'styled-components'

// Romantic degen trader animations for slots gameplay
const romanticSparkle = keyframes`
  0%, 100% { 
    transform: rotate(-15deg) scale(1);
    text-shadow: 
      0 0 20px rgba(212, 165, 116, 0.5),
      3px 3px 8px rgba(10, 5, 17, 0.8);
  }
  50% { 
    transform: rotate(-10deg) scale(1.05);
    text-shadow: 
      0 0 30px rgba(212, 165, 116, 0.7),
      3px 3px 12px rgba(10, 5, 17, 0.9);
  }
`;

const loveLetterTwinkle = keyframes`
  0%, 100% { 
    transform: rotate(18deg) scale(1);
    text-shadow: 
      0 0 25px rgba(184, 51, 106, 0.6),
      3px 3px 8px rgba(10, 5, 17, 0.8);
  }
  50% { 
    transform: rotate(25deg) scale(1.08);
    text-shadow: 
      0 0 35px rgba(184, 51, 106, 0.8),
      3px 3px 12px rgba(10, 5, 17, 0.9);
  }
`;

const mysticalAura = keyframes`
  0% { 
    background-position: 0% 50%; 
    opacity: 0.3;
  }
  50% { 
    background-position: 100% 50%;
    opacity: 0.6;
  }
  100% { 
    background-position: 0% 50%;
    opacity: 0.3;
  }
`;

export const StyledSlotsBackground = styled.div`
  perspective: 100px;
  user-select: none;
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    rgba(10, 5, 17, 0.95) 0%, 
    rgba(139, 90, 158, 0.2) 25%,
    rgba(184, 51, 106, 0.15) 50%,
    rgba(139, 90, 158, 0.2) 75%,
    rgba(10, 5, 17, 0.95) 100%
  );
  background-size: 400% 400%;
  animation: ${mysticalAura} 12s ease-in-out infinite;
  border-radius: 20px;
  border: 2px solid rgba(212, 165, 116, 0.3);
  box-shadow: 
    0 25px 50px rgba(10, 5, 17, 0.8),
    inset 0 2px 4px rgba(212, 165, 116, 0.15),
    inset 0 -2px 4px rgba(10, 5, 17, 0.6),
    0 0 35px rgba(212, 165, 116, 0.2);
  overflow: hidden;
  z-index: 0;

  /* Romantic glow overlay */
  &::before {
    content: '🎰';
    position: absolute;
    top: 12%;
    left: 7%;
    font-size: 100px;
    opacity: 0.12;
    color: rgba(212, 165, 116, 0.4);
    z-index: 0;
    pointer-events: none;
    animation: ${romanticSparkle} 8s ease-in-out infinite;

    @media (max-width: 768px) {
      font-size: 80px;
      top: 8%;
      left: 5%;
    }

    @media (max-width: 479px) {
      font-size: 60px;
      opacity: 0.08;
    }
  }

  &::after {
    content: '💝';
    position: absolute;
    bottom: 10%;
    right: 8%;
    font-size: 90px;
    opacity: 0.15;
    color: rgba(184, 51, 106, 0.5);
    z-index: 0;
    pointer-events: none;
    animation: ${loveLetterTwinkle} 6s ease-in-out infinite;

    @media (max-width: 768px) {
      font-size: 70px;
      bottom: 8%;
      right: 5%;
    }

    @media (max-width: 479px) {
      font-size: 50px;
      opacity: 0.1;
    }
  }

  /* Romantic mystical particles */
  &:before:nth-child(3) {
    content: '';
    position: absolute;
    top: 30%;
    right: 20%;
    width: 4px;
    height: 4px;
    background: var(--love-letter-gold);
    border-radius: 50%;
    box-shadow: 
      0 0 10px rgba(212, 165, 116, 0.8),
      20px 30px 0 rgba(184, 51, 106, 0.6),
      -30px 20px 0 rgba(139, 90, 158, 0.5),
      40px -20px 0 rgba(212, 165, 116, 0.4);
    animation: ${loveLetterTwinkle} 10s ease-in-out infinite;
  }

  /* Override GameScreenFrame's backgrounds to show romantic theme */
  & .absolute.inset-\\[2px\\].rounded-\\[0\\.65rem\\].bg-\\[\\#0c0c11\\] {
    background: transparent !important;
  }

  & [class*="bg-[#0c0c11]"] {
    background: transparent !important;
  }

  /* Mobile responsive adjustments */
  @media (max-width: 768px) {
    border-radius: 16px;
    background-size: 300% 300%;
  }

  @media (max-width: 479px) {
    border-radius: 12px;
    background-size: 200% 200%;
    box-shadow: 
      0 15px 30px rgba(10, 5, 17, 0.7),
      inset 0 1px 2px rgba(212, 165, 116, 0.1),
      0 0 20px rgba(212, 165, 116, 0.15);
  }
`;
