import styled from 'styled-components'

export const StyledCrashBackground = styled.div`
  perspective: 100px;
  user-select: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #431407 0%, #7c2d12 15%, #ea580c 30%, #f97316 45%, #fb923c 60%, #fed7aa 75%, #ffedd5 90%, #f97316 100%);
  border-radius: 24px;
  border: 3px solid rgba(251, 146, 60, 0.4);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.8),
    inset 0 2px 4px rgba(255, 255, 255, 0.1),
    inset 0 -2px 4px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(251, 146, 60, 0.4);
  overflow: hidden;
  
  /* Floating fire elements */
  &::before {
    content: '🚀';
    position: absolute;
    top: 8%;
    left: 6%;
    font-size: 140px;
    opacity: 0.08;
    transform: rotate(-15deg);
    pointer-events: none;
    color: #ea580c;
    z-index: 0;
    text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.6);
  }

  &::after {
    content: '🔥';
    position: absolute;
    bottom: 10%;
    right: 8%;
    font-size: 120px;
    opacity: 0.09;
    transform: rotate(20deg);
    pointer-events: none;
    color: #fb923c;
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

  & > * {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
  }

  .crash-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    transform: rotateX(1deg) rotateY(0deg);
    position: relative;
    z-index: 2;
    padding: 30px 20px;
    max-width: 1400px;
    margin: 0 auto;
    min-height: 100%;
  }

  /* Additional fire elements */
  .fire-bg-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

    &::before {
      content: '⭐';
      position: absolute;
      top: 25%;
      right: 15%;
      font-size: 105px;
      opacity: 0.06;
      transform: rotate(-18deg);
      color: #fed7aa;
      filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.5));
    }

    &::after {
      content: '💥';
      position: absolute;
      bottom: 40%;
      left: 12%;
      font-size: 95px;
      opacity: 0.07;
      transform: rotate(25deg);
      color: #ea580c;
      filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.5));
    }
  }

  /* Fiery passion overlay */
  .passion-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 30% 20%, rgba(251, 146, 60, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 70% 80%, rgba(234, 88, 12, 0.12) 0%, transparent 60%),
      radial-gradient(circle at 20% 70%, rgba(124, 45, 18, 0.1) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  @keyframes fire-pulse {
    0%, 100% {
      opacity: 0.8;
      filter: brightness(1);
    }
    50% {
      opacity: 1;
      filter: brightness(1.25);
    }
  }

  @keyframes rocket-ascent {
    0%, 100% {
      transform: scale(1);
      opacity: 0.9;
    }
    50% {
      transform: scale(1.05);
      opacity: 1;
    }
  }

  /* Enhanced styling for crash-specific elements */
  .rocket-launch-area {
    background: 
      linear-gradient(135deg, 
        rgba(67, 20, 7, 0.9) 0%,
        rgba(124, 45, 18, 0.85) 50%,
        rgba(67, 20, 7, 0.9) 100%
      );
    border: 2px solid rgba(251, 146, 60, 0.4);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.6),
      inset 0 1px 2px rgba(255, 255, 255, 0.1);
    padding: 20px;
    color: #ffedd5;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  }

  .trajectory-display {
    background: 
      linear-gradient(135deg, 
        rgba(234, 88, 12, 0.9) 0%,
        rgba(249, 115, 22, 0.85) 50%,
        rgba(234, 88, 12, 0.9) 100%
      );
    border: 3px solid rgba(251, 146, 60, 0.6);
    border-radius: 20px;
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.5),
      inset 0 2px 4px rgba(255, 255, 255, 0.15),
      0 0 25px rgba(251, 146, 60, 0.4);
    padding: 25px;
    color: #fff7ed;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
    animation: fire-pulse 3s ease-in-out infinite;
  }

  .crash-controls {
    background: 
      linear-gradient(135deg, 
        rgba(67, 20, 7, 0.8) 0%,
        rgba(124, 45, 18, 0.75) 50%,
        rgba(67, 20, 7, 0.8) 100%
      );
    border: 2px solid rgba(251, 146, 60, 0.3);
    border-radius: 12px;
    padding: 20px;
    backdrop-filter: blur(15px);
    box-shadow: 
      0 6px 24px rgba(0, 0, 0, 0.3),
      inset 0 1px 2px rgba(255, 255, 255, 0.05);
  }

  /* Ascent indicator */
  .ascent-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: 500px;
    border: 1px solid rgba(251, 146, 60, 0.2);
    border-radius: 50%;
    animation: rocket-ascent 4s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }

  /* Result area for consistent layout */
  .tragedy-result-area {
    background: 
      linear-gradient(135deg, 
        rgba(234, 88, 12, 0.9) 0%,
        rgba(124, 45, 18, 0.85) 50%,
        rgba(234, 88, 12, 0.9) 100%
      );
    border: 2px solid rgba(251, 146, 60, 0.4);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 10px 35px rgba(0, 0, 0, 0.4),
      inset 0 2px 4px rgba(255, 255, 255, 0.12),
      0 0 20px rgba(251, 146, 60, 0.4);
    padding: 25px;
    color: #fff7ed;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  /* Rocket graph styling integration */
  .crash-graph-container {
    background: 
      linear-gradient(135deg, 
        rgba(67, 20, 7, 0.6) 0%,
        rgba(124, 45, 18, 0.4) 50%,
        rgba(67, 20, 7, 0.6) 100%
      );
    border: 2px solid rgba(251, 146, 60, 0.25);
    border-radius: 20px;
    padding: 25px;
    backdrop-filter: blur(15px);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.5),
      inset 0 2px 4px rgba(255, 255, 255, 0.08),
      0 0 25px rgba(251, 146, 60, 0.3);
  }
`
