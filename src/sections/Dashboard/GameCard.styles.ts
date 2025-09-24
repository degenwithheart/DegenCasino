import styled, { keyframes, css } from 'styled-components'

export const romanticTileAnimation = keyframes`
  0% {
    background-position: -150px 150px;
  }
  100% {
    background-position: 150px -150px;
  }
`

export const candlestickFloat = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
  }
  50% { 
    transform: translateY(-8px) rotate(1deg); 
  }
`

export const romanticSpin = keyframes`
  0% { 
    transform: rotate(0deg) scale(1); 
  }
  50% { 
    transform: rotate(180deg) scale(1.05); 
  }
  100% { 
    transform: rotate(360deg) scale(1); 
  }
`

export const loveLetterFlip = keyframes`
  0% { 
    transform: rotateY(0deg); 
  }
  50% { 
    transform: rotateY(180deg) scale(1.1); 
  }
  100% { 
    transform: rotateY(360deg); 
  }
`

export const dreamlikeShake = keyframes`
  0%, 100% { 
    transform: translateX(0px) translateY(0px); 
  }
  25% { 
    transform: translateX(-3px) translateY(-2px); 
  }
  50% { 
    transform: translateX(3px) translateY(2px); 
  }
  75% { 
    transform: translateX(-2px) translateY(-1px); 
  }
`

export const effectAnimations = {
  bounce: candlestickFloat,
  spin: romanticSpin,
  flip: loveLetterFlip,
  shake: dreamlikeShake,
}

// Keep old exports for compatibility
export const tileAnimation = romanticTileAnimation;
export const bounce = candlestickFloat;
export const spin = romanticSpin;
export const flip = loveLetterFlip;
export const shake = dreamlikeShake;

export const StyledGameCard = styled.div<{ $small: boolean; $background: string; $effect?: string }>`
  width: 100%;
  height: 100%;
  background-size: cover;
  border-radius: 16px;
  color: var(--love-letter-gold);
  font-size: clamp(16px, 4vw, 24px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: ${(props) => props.$background};
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  background-size: 100% auto;
  background-position: center;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid rgba(212, 165, 116, 0.3);
  box-shadow: 
    0 8px 32px rgba(10, 5, 17, 0.6),
    0 4px 16px rgba(212, 165, 116, 0.1),
    inset 0 1px 0 rgba(212, 165, 116, 0.2);
  backdrop-filter: blur(20px) saturate(1.5);
  font-family: 'DM Sans', sans-serif;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(212, 165, 116, 0.1) 0%,
      rgba(184, 51, 106, 0.05) 50%,
      rgba(139, 90, 158, 0.1) 100%
    );
    border-radius: inherit;
    z-index: 1;
    transition: opacity 0.4s ease;
    opacity: 0.6;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at center,
      rgba(212, 165, 116, 0.15) 0%,
      transparent 50%
    );
    animation: ${romanticTileAnimation} 8s linear infinite;
    z-index: 0;
    opacity: 0;
    transition: opacity 0.6s ease;
  }

  & > .background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: url(/webp/stuff.webp);
    background-size: 120%;
    background-position: center;
    background-repeat: repeat;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    animation: ${romanticTileAnimation} 12s linear infinite;
    opacity: 0;
    pointer-events: none;
    z-index: 2;
    filter: sepia(0.3) hue-rotate(320deg) saturate(1.2);
  }

  & > .image {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-size: 100% auto;
    background-position: center;
    background-repeat: no-repeat;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 3;
    filter: contrast(1.1) brightness(1.05);
  }

  .play {
    font-size: clamp(10px, 2.5vw, 14px);
    border-radius: 12px;
    padding: 8px 16px;
    background: linear-gradient(
      135deg,
      var(--love-letter-gold) 0%,
      var(--deep-crimson-rose) 50%,
      var(--soft-purple-twilight) 100%
    );
    color: var(--deep-romantic-night);
    font-weight: 600;
    position: absolute;
    right: 12px;
    bottom: 12px;
    opacity: 0;
    text-transform: uppercase;
    backdrop-filter: blur(20px) saturate(1.5);
    box-shadow: 
      0 4px 16px rgba(212, 165, 116, 0.4),
      0 2px 8px rgba(184, 51, 106, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    font-family: 'Libre Baskerville', serif;
    letter-spacing: 1px;
    border: 1px solid rgba(212, 165, 116, 0.4);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10;
    text-shadow: 0 1px 2px rgba(10, 5, 17, 0.3);

    &:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 
        0 8px 24px rgba(212, 165, 116, 0.6),
        0 4px 12px rgba(184, 51, 106, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.5);
    }
  }

  &:hover {
    transform: translateY(-4px) scale(1.02);
    border-color: rgba(212, 165, 116, 0.6);
    box-shadow: 
      0 16px 48px rgba(10, 5, 17, 0.8),
      0 8px 24px rgba(212, 165, 116, 0.2),
      0 4px 16px rgba(184, 51, 106, 0.15),
      inset 0 1px 0 rgba(212, 165, 116, 0.4);

    &::before {
      opacity: 1;
    }

    &::after {
      opacity: 0.6;
    }

    & > .background {
      opacity: 0.3;
      transform: scale(1.1);
      animation-duration: 8s;
    }

    & > .image {
      transform: scale(1.05);
      filter: contrast(1.2) brightness(1.1) saturate(1.1);
    }

    .play {
      opacity: 1;
      transform: translateY(-2px) scale(1.05);
    }
  }

  &:active {
    transform: translateY(-2px) scale(1.01);
    transition: all 0.2s ease;
  }

  ${(props) => props.$effect && css`
    animation: ${effectAnimations[props.$effect as keyof typeof effectAnimations]} 0.6s ease-in-out;
  `}

  /* Mobile-first responsive design */
  @media (max-width: 479px) {
    border-radius: 12px;
    
    .play {
      font-size: 10px;
      border-radius: 8px;
      padding: 6px 12px;
      right: 8px;
      bottom: 8px;
      letter-spacing: 0.5px;
    }
  }

  @media (min-width: 768px) {
    border-radius: 20px;
    
    &:hover {
      transform: translateY(-6px) scale(1.03);
    }
    
    .play {
      font-size: 14px;
      padding: 10px 18px;
      border-radius: 14px;
    }
  }

  @media (min-width: 1024px) {
    font-size: 24px;
    
    .play {
      font-size: 15px;
      padding: 12px 20px;
    }
  }

  /* Prevent overlays from shifting card size */
  .mode-overlay {
    position: absolute;
    bottom: 8px;
    right: 8px;
    z-index: 10;
    font-size: 1.1rem;
    background: rgba(0,0,0,0.7);
    border-radius: 8px;
    padding: 0.25em 0.7em;
    color: #ffd700;
    font-weight: 700;
    letter-spacing: 1px;
    box-shadow: 0 2px 8px #000a;
    pointer-events: none;
    user-select: none;
    min-width: 48px;
    text-align: center;
  }
`;

// Romantic tag styling for special game badges
export const Tag = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 6px 12px;
  font-size: clamp(10px, 2vw, 12px);
  font-weight: 600;
  background: linear-gradient(
    135deg,
    rgba(212, 165, 116, 0.9) 0%,
    rgba(184, 51, 106, 0.9) 100%
  );
  color: var(--deep-romantic-night);
  border-radius: 8px;
  text-transform: uppercase;
  z-index: 10;
  backdrop-filter: blur(20px) saturate(1.5);
  border: 1px solid rgba(212, 165, 116, 0.4);
  box-shadow: 
    0 4px 12px rgba(10, 5, 17, 0.4),
    0 2px 6px rgba(212, 165, 116, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  font-family: 'DM Sans', sans-serif;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(10, 5, 17, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-1px) scale(1.05);
    box-shadow: 
      0 6px 16px rgba(10, 5, 17, 0.5),
      0 3px 8px rgba(212, 165, 116, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  /* Mobile responsive adjustments */
  @media (max-width: 479px) {
    top: 8px;
    left: 8px;
    padding: 4px 8px;
    font-size: 10px;
    border-radius: 6px;
  }

  @media (min-width: 768px) {
    top: 16px;
    left: 16px;
    padding: 8px 14px;
    font-size: 12px;
    border-radius: 10px;
  }
`;
