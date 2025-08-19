import styled from 'styled-components'

export const StyledFlipBackground = styled.div`
  perspective: 100px;
  user-select: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1e293b 0%, #334155 15%, #475569 30%, #64748b 45%, #94a3b8 60%, #cbd5e1 75%, #f1f5f9 90%, #94a3b8 100%);
  border-radius: 24px;
  border: 3px solid rgba(203, 213, 225, 0.4);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.6),
    inset 0 2px 4px rgba(255, 255, 255, 0.2),
    inset 0 -2px 4px rgba(0, 0, 0, 0.3),
    0 0 40px rgba(148, 163, 184, 0.3);
  overflow: hidden;
  
  /* Floating coin background elements - Silver poetry style */
  &::before {
    content: '🪙';
    position: absolute;
    top: 8%;
    left: 7%;
    font-size: 140px;
    opacity: 0.06;
    transform: rotate(-20deg);
    pointer-events: none;
    color: #64748b;
    z-index: 0;
    text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.4);
    filter: blur(1px);
  }

  &::after {
    content: '🪙';
    position: absolute;
    bottom: 10%;
    right: 8%;
    font-size: 120px;
    opacity: 0.08;
    transform: rotate(25deg);
    pointer-events: none;
    color: #94a3b8;
    z-index: 0;
    text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.4);
    filter: blur(0.5px);
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

  .flip-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    transform: rotateX(1deg) rotateY(0deg);
    position: relative;
    z-index: 2;
    padding: 40px 30px;
    max-width: 1200px;
    margin: 0 auto;
    min-height: 100%;
  }

  /* Additional silver elements */
  .silver-bg-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

    &::before {
      content: '💫';
      position: absolute;
      top: 25%;
      right: 15%;
      font-size: 100px;
      opacity: 0.05;
      transform: rotate(-15deg);
      color: #cbd5e1;
      filter: drop-shadow(2px 2px 6px rgba(0, 0, 0, 0.3));
    }

    &::after {
      content: '✨';
      position: absolute;
      bottom: 40%;
      left: 12%;
      font-size: 90px;
      opacity: 0.07;
      transform: rotate(30deg);
      color: #f1f5f9;
      filter: drop-shadow(2px 2px 6px rgba(0, 0, 0, 0.3));
    }
  }

  /* Crystalline overlay - representing the moment of truth */
  .crystal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 40% 30%, rgba(241, 245, 249, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 60% 70%, rgba(203, 213, 225, 0.08) 0%, transparent 60%),
      radial-gradient(circle at 20% 80%, rgba(148, 163, 184, 0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  @keyframes silver-shimmer {
    0%, 100% {
      opacity: 0.8;
      filter: brightness(1) contrast(1);
    }
    50% {
      opacity: 1;
      filter: brightness(1.15) contrast(1.1);
    }
  }

  @keyframes suspended-moment {
    0%, 100% {
      transform: scale(1);
      opacity: 0.9;
    }
    50% {
      transform: scale(1.03);
      opacity: 1;
    }
  }

  /* Enhanced styling for flip-specific elements */
  .destiny-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 400px;
    border: 1px solid rgba(203, 213, 225, 0.15);
    border-radius: 50%;
    animation: suspended-moment 8s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }

  .silver-truth-area {
    background: 
      linear-gradient(135deg, 
        rgba(30, 41, 59, 0.85) 0%,
        rgba(51, 65, 85, 0.8) 50%,
        rgba(30, 41, 59, 0.85) 100%
      );
    border: 2px solid rgba(203, 213, 225, 0.3);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.4),
      inset 0 1px 2px rgba(255, 255, 255, 0.1);
    padding: 20px;
    color: #f1f5f9;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
    animation: silver-shimmer 5s ease-in-out infinite;
  }

  /* Raw instinct canvas enhancement */
  .instinct-canvas-container {
    background: 
      linear-gradient(135deg, 
        rgba(15, 23, 42, 0.6) 0%,
        rgba(30, 41, 59, 0.4) 50%,
        rgba(15, 23, 42, 0.6) 100%
      );
    border: 2px solid rgba(148, 163, 184, 0.25);
    border-radius: 20px;
    padding: 30px;
    backdrop-filter: blur(15px);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.5),
      inset 0 2px 4px rgba(255, 255, 255, 0.08),
      0 0 25px rgba(148, 163, 184, 0.2);
  }

  /* Result area for consistent layout */
  .fate-result-area {
    background: 
      linear-gradient(135deg, 
        rgba(71, 85, 105, 0.9) 0%,
        rgba(100, 116, 139, 0.85) 50%,
        rgba(71, 85, 105, 0.9) 100%
      );
    border: 2px solid rgba(203, 213, 225, 0.4);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 10px 35px rgba(0, 0, 0, 0.4),
      inset 0 2px 4px rgba(255, 255, 255, 0.15),
      0 0 20px rgba(148, 163, 184, 0.3);
    padding: 25px;
    color: #f8fafc;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
`
