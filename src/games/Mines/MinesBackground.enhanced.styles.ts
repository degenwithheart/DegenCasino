import styled from 'styled-components'

export const StyledMinesBackground = styled.div`
  perspective: 100px;
  user-select: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a0933 0%, #2d1b4e 15%, #4c1d95 30%, #6b21a8 45%, #7c3aed 60%, #8b5cf6 75%, #a78bfa 90%, #6b21a8 100%);
  border-radius: 24px;
  border: 3px solid rgba(139, 92, 246, 0.4);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.8),
    inset 0 2px 4px rgba(255, 255, 255, 0.1),
    inset 0 -2px 4px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(139, 92, 246, 0.3);
  overflow: hidden;
  
  /* Floating mine/gem background elements */
  &::before {
    content: '💎';
    position: absolute;
    top: 8%;
    left: 6%;
    font-size: 140px;
    opacity: 0.06;
    transform: rotate(-20deg);
    pointer-events: none;
    color: #7c3aed;
    z-index: 0;
    text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.6);
  }

  &::after {
    content: '⚡';
    position: absolute;
    bottom: 10%;
    right: 8%;
    font-size: 120px;
    opacity: 0.08;
    transform: rotate(25deg);
    pointer-events: none;
    color: #8b5cf6;
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

  /* Use min-height so internal layout (like grids) can expand without being constrained */
  & > * {
    position: relative;
    z-index: 1;
    width: 100%;
  }

  .mines-content {
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

  /* Additional danger elements */
  .chaos-bg-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

    &::before {
      content: '💥';
      position: absolute;
      top: 30%;
      right: 15%;
      font-size: 100px;
      opacity: 0.05;
      transform: rotate(-25deg);
      color: #a78bfa;
      filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.5));
    }

    &::after {
      content: '💖';
      position: absolute;
      bottom: 35%;
      left: 12%;
      font-size: 90px;
      opacity: 0.07;
      transform: rotate(30deg);
      color: #7c3aed;
      filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.5));
    }
  }

  /* Labyrinth overlay */
  .labyrinth-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(76, 29, 149, 0.12) 0%, transparent 60%),
      radial-gradient(circle at 50% 50%, rgba(107, 33, 168, 0.1) 0%, transparent 80%);
    pointer-events: none;
    z-index: 0;
  }

  @keyframes lover-test {
    0%, 100% {
      opacity: 0.8;
      filter: brightness(1);
    }
    50% {
      opacity: 1;
      filter: brightness(1.15);
    }
  }

  @keyframes danger-pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 0.9;
    }
    50% {
      transform: scale(1.03);
      opacity: 1;
    }
  }

  /* Enhanced styling for mines-specific elements */
  .chaos-board-area {
    background: 
      linear-gradient(135deg, 
        rgba(26, 9, 51, 0.9) 0%,
        rgba(45, 27, 78, 0.85) 50%,
        rgba(26, 9, 51, 0.9) 100%
      );
    border: 2px solid rgba(139, 92, 246, 0.4);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.6),
      inset 0 1px 2px rgba(255, 255, 255, 0.1);
    padding: 20px;
    color: #e9d5ff;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  }

  .fortune-display {
    background: 
      linear-gradient(135deg, 
        rgba(76, 29, 149, 0.9) 0%,
        rgba(124, 58, 237, 0.85) 50%,
        rgba(76, 29, 149, 0.9) 100%
      );
    border: 3px solid rgba(139, 92, 246, 0.6);
    border-radius: 20px;
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.5),
      inset 0 2px 4px rgba(255, 255, 255, 0.15),
      0 0 25px rgba(139, 92, 246, 0.3);
    padding: 25px;
    color: #f3e8ff;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
    animation: lover-test 4s ease-in-out infinite;
  }

  .mine-controls {
    background: 
      linear-gradient(135deg, 
        rgba(26, 9, 51, 0.8) 0%,
        rgba(45, 27, 78, 0.75) 50%,
        rgba(26, 9, 51, 0.8) 100%
      );
    border: 2px solid rgba(139, 92, 246, 0.3);
    border-radius: 12px;
    padding: 20px;
    backdrop-filter: blur(15px);
    box-shadow: 
      0 6px 24px rgba(0, 0, 0, 0.3),
      inset 0 1px 2px rgba(255, 255, 255, 0.05);
  }

  /* Danger indicator */
  .danger-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 400px;
    border: 1px solid rgba(139, 92, 246, 0.15);
    border-radius: 50%;
    animation: danger-pulse 6s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }

  /* Result area for consistent layout */
  .betrayal-result-area {
    background: 
      linear-gradient(135deg, 
        rgba(76, 29, 149, 0.9) 0%,
        rgba(107, 33, 168, 0.85) 50%,
        rgba(76, 29, 149, 0.9) 100%
      );
    border: 2px solid rgba(139, 92, 246, 0.4);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 10px 35px rgba(0, 0, 0, 0.4),
      inset 0 2px 4px rgba(255, 255, 255, 0.12),
      0 0 20px rgba(139, 92, 246, 0.3);
    padding: 25px;
    color: #f3e8ff;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  /* Board styling integration */
  .mines-board-container {
    background: 
      linear-gradient(135deg, 
        rgba(26, 9, 51, 0.6) 0%,
        rgba(45, 27, 78, 0.4) 50%,
        rgba(26, 9, 51, 0.6) 100%
      );
    border: 2px solid rgba(139, 92, 246, 0.25);
    border-radius: 20px;
    padding: 25px;
    backdrop-filter: blur(15px);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.5),
      inset 0 2px 4px rgba(255, 255, 255, 0.08),
      0 0 25px rgba(139, 92, 246, 0.2);
  }
`
