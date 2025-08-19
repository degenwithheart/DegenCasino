import styled from 'styled-components'

export const StyledRouletteBackground = styled.div`
  perspective: 100px;
  user-select: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4a1e3a 0%, #6b2c5c 15%, #8b3f7a 30%, #a855a8 45%, #c084c0 60%, #d4a4d4 75%, #e8c5e8 90%, #a855a8 100%);
  border-radius: 24px;
  border: 3px solid rgba(168, 85, 168, 0.4);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.8),
    inset 0 2px 4px rgba(255, 255, 255, 0.1),
    inset 0 -2px 4px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(168, 85, 168, 0.3);
  overflow: hidden;
  
  /* Floating velvet elegance elements */
  &::before {
    content: '🍾';
    position: absolute;
    top: 8%;
    left: 6%;
    font-size: 150px;
    opacity: 0.06;
    transform: rotate(-18deg);
    pointer-events: none;
    color: #c084c0;
    z-index: 0;
    text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.6);
  }

  &::after {
    content: '🎭';
    position: absolute;
    bottom: 10%;
    right: 8%;
    font-size: 130px;
    opacity: 0.08;
    transform: rotate(25deg);
    pointer-events: none;
    color: #d4a4d4;
    z-index: 0;
    text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.6);
  }

  /* Override GameScreenFrame's dark background */
  & .absolute.inset-\\[2px\\].rounded-\\[0\\.65rem\\].bg-\\[\\#0c0c11\\] {
    background: transparent !important;
  }

  /* General override for any dark background in the frame */
  & [class*="bg-[#0c0c11]"] {
    background: transparent !important;
  }

  /* Override GameScreenFrame wrapper */
  & > div[class*="absolute"][class*="inset"][class*="bg-"] {
    background: transparent !important;
  }

  /* Use min-height so internal layout can expand without being constrained */
  & > * {
    position: relative;
    z-index: 1;
    width: 100%;
    min-height: 100%;
    pointer-events: auto;
  }

  /* Ensure game content is interactive */
  & [data-component="GameScreenFrame"] {
    z-index: 10;
    position: relative;
    pointer-events: auto;
  }

  /* Ensure the wrapper inside GameScreenFrame is interactive */
  & [data-component="GameScreenFrame"] > * {
    pointer-events: auto;
    z-index: 11;
  }

  .roulette-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    transform: rotateX(1deg) rotateY(0deg);
    position: relative;
    z-index: 2;
    padding: 30px 20px;
    max-width: 1200px;
    margin: 0 auto;
    min-height: 100%;
  }

  /* Additional velvet romance elements */
  .velvet-bg-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

    &::before {
      content: '🥂';
      position: absolute;
      top: 30%;
      right: 15%;
      font-size: 110px;
      opacity: 0.05;
      transform: rotate(-22deg);
      color: #e8c5e8;
      filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.5));
    }

    &::after {
      content: '💜';
      position: absolute;
      bottom: 35%;
      left: 12%;
      font-size: 100px;
      opacity: 0.07;
      transform: rotate(30deg);
      color: #a855a8;
      filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.5));
    }
  }

  /* Whispers overlay for elegance */
  .whispers-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 25% 25%, rgba(168, 85, 168, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(107, 44, 92, 0.12) 0%, transparent 60%),
      radial-gradient(circle at 50% 50%, rgba(139, 63, 122, 0.1) 0%, transparent 80%);
    pointer-events: none;
    z-index: 0;
  }

  /* Eternal romance indicator */
  .eternal-romance-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 450px;
    border: 1px solid rgba(168, 85, 168, 0.2);
    border-radius: 50%;
    animation: velvet-pulse 7s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }

  @keyframes velvet-pulse {
    0%, 100% {
      opacity: 0.8;
      filter: brightness(1);
    }
    50% {
      opacity: 1;
      filter: brightness(1.2);
    }
  }

  @keyframes champagne-bubbles {
    0%, 100% {
      transform: scale(1);
      opacity: 0.9;
    }
    50% {
      transform: scale(1.05);
      opacity: 1;
    }
  }

  /* Enhanced styling for roulette-specific elements */
  .velvet-table-area {
    background: 
      linear-gradient(135deg, 
        rgba(74, 30, 58, 0.9) 0%,
        rgba(107, 44, 92, 0.85) 50%,
        rgba(74, 30, 58, 0.9) 100%
      );
    border: 2px solid rgba(168, 85, 168, 0.4);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.6),
      inset 0 1px 2px rgba(255, 255, 255, 0.1);
    padding: 20px;
    color: #e8c5e8;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  }

  .elegance-display {
    background: 
      linear-gradient(135deg, 
        rgba(139, 63, 122, 0.9) 0%,
        rgba(168, 85, 168, 0.85) 50%,
        rgba(139, 63, 122, 0.9) 100%
      );
    border: 3px solid rgba(168, 85, 168, 0.6);
    border-radius: 20px;
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.6),
      inset 0 2px 4px rgba(255, 255, 255, 0.15),
      0 0 25px rgba(168, 85, 168, 0.3);
    padding: 25px;
    color: #faf5ff;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
    animation: velvet-pulse 5s ease-in-out infinite;
  }

  .champagne-container {
    background: 
      linear-gradient(135deg, 
        rgba(74, 30, 58, 0.8) 0%,
        rgba(107, 44, 92, 0.75) 50%,
        rgba(74, 30, 58, 0.8) 100%
      );
    border: 2px solid rgba(168, 85, 168, 0.3);
    border-radius: 12px;
    padding: 20px;
    backdrop-filter: blur(15px);
    box-shadow: 
      0 6px 24px rgba(0, 0, 0, 0.4),
      inset 0 1px 2px rgba(255, 255, 255, 0.05);
  }

  /* Result area for consistent layout */
  .velvet-result-area {
    background: 
      linear-gradient(135deg, 
        rgba(107, 44, 92, 0.9) 0%,
        rgba(139, 63, 122, 0.85) 50%,
        rgba(107, 44, 92, 0.9) 100%
      );
    border: 2px solid rgba(168, 85, 168, 0.4);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 10px 35px rgba(0, 0, 0, 0.5),
      inset 0 2px 4px rgba(255, 255, 255, 0.12),
      0 0 20px rgba(168, 85, 168, 0.3);
    padding: 25px;
    color: #faf5ff;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
`
