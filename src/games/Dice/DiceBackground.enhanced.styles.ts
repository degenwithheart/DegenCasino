import styled from 'styled-components'

export const StyledDiceBackground = styled.div`
  perspective: 100px;
  user-select: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #92400e 0%, #d97706 15%, #f59e0b 30%, #fbbf24 45%, #fcd34d 60%, #fde68a 75%, #fffbeb 90%, #fbbf24 100%);
  border-radius: 24px;
  border: 3px solid rgba(251, 191, 36, 0.4);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.6),
    inset 0 2px 4px rgba(255, 255, 255, 0.15),
    inset 0 -2px 4px rgba(0, 0, 0, 0.4),
    0 0 40px rgba(251, 191, 36, 0.3);
  overflow: hidden;
  
  /* Floating dice background elements - Ancient mystical style */
  &::before {
    content: '⚃';
    position: absolute;
    top: 12%;
    left: 8%;
    font-size: 120px;
    opacity: 0.08;
    transform: rotate(-15deg);
    pointer-events: none;
    color: #92400e;
    z-index: 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  &::after {
    content: '⚄';
    position: absolute;
    bottom: 15%;
    right: 10%;
    font-size: 100px;
    opacity: 0.09;
    transform: rotate(25deg);
    pointer-events: none;
    color: #d97706;
    z-index: 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  /* Override GameScreenFrame's dark background */
  & .absolute.inset-\\[2px\\].rounded-\\[0\\.65rem\\].bg-\\[\\#0c0c11\\] {
    background: transparent !important;
  }

  /* General override for any dark background in the frame */
  & [class*="bg-[#0c0c11]"] {
    background: transparent !important;
  }

  & > * {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
  }

  .dice-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
    transform: rotateX(2deg) rotateY(0deg);
    position: relative;
    z-index: 2;
    padding: 60px 40px;
    max-width: 1200px;
    margin: 0 auto;
    min-height: 100%;
  }

  /* Additional mystical background elements */
  .mystical-bg-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

    &::before {
      content: '🔮';
      position: absolute;
      top: 35%;
      right: 15%;
      font-size: 90px;
      opacity: 0.06;
      transform: rotate(-18deg);
      color: #f59e0b;
      filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.4));
    }

    &::after {
      content: '🪙';
      position: absolute;
      bottom: 35%;
      left: 12%;
      font-size: 85px;
      opacity: 0.08;
      transform: rotate(30deg);
      color: #fbbf24;
      filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.4));
    }
  }

  /* Sacred temple overlay */
  .sacred-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.12) 0%, transparent 60%),
      radial-gradient(circle at 75% 75%, rgba(218, 165, 32, 0.1) 0%, transparent 60%),
      radial-gradient(circle at 50% 50%, rgba(184, 134, 11, 0.05) 0%, transparent 80%);
    pointer-events: none;
    z-index: 0;
  }

  @keyframes mystical-glow {
    0%, 100% {
      opacity: 0.6;
      filter: brightness(1);
    }
    50% {
      opacity: 0.8;
      filter: brightness(1.2);
    }
  }

  @keyframes sacred-pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 0.7;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.9;
    }
  }

  /* Enhanced styling for dice-specific elements */
  .ancient-stats {
    background: 
      linear-gradient(135deg, 
        rgba(20, 20, 20, 0.85) 0%,
        rgba(40, 30, 10, 0.8) 50%,
        rgba(20, 20, 20, 0.85) 100%
      );
    border: 2px solid rgba(251, 191, 36, 0.4);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.4),
      inset 0 1px 2px rgba(255, 255, 255, 0.1);
    padding: 20px;
    color: #fbbf24;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  }

  .roll-under-display {
    background: 
      linear-gradient(135deg, 
        rgba(146, 64, 14, 0.9) 0%,
        rgba(217, 119, 6, 0.85) 50%,
        rgba(146, 64, 14, 0.9) 100%
      );
    border: 3px solid rgba(251, 191, 36, 0.6);
    border-radius: 20px;
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.5),
      inset 0 2px 4px rgba(255, 255, 255, 0.2),
      0 0 20px rgba(251, 191, 36, 0.3);
    padding: 25px;
    color: #fffbeb;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
    animation: mystical-glow 3s ease-in-out infinite;
  }

  .sacred-slider-container {
    background: 
      linear-gradient(135deg, 
        rgba(20, 20, 20, 0.8) 0%,
        rgba(40, 30, 10, 0.75) 50%,
        rgba(20, 20, 20, 0.8) 100%
      );
    border: 2px solid rgba(251, 191, 36, 0.3);
    border-radius: 12px;
    padding: 20px;
    backdrop-filter: blur(15px);
    box-shadow: 
      0 6px 24px rgba(0, 0, 0, 0.3),
      inset 0 1px 2px rgba(255, 255, 255, 0.05);
  }
`
