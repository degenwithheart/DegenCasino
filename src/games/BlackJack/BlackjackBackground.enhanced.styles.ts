import styled from 'styled-components'

export const StyledBlackjackBackground = styled.div`
  perspective: 100px;
  user-select: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0f1419 0%, #1c2c1f 15%, #0d4f3c 30%, #065f46 45%, #047857 60%, #059669 75%, #10b981 90%, #065f46 100%);
  border-radius: 24px;
  border: 3px solid rgba(16, 185, 129, 0.3);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.7),
    inset 0 2px 4px rgba(255, 255, 255, 0.08),
    inset 0 -2px 4px rgba(0, 0, 0, 0.5),
    0 0 35px rgba(16, 185, 129, 0.2);
  overflow: hidden;
  
  /* Floating card suit background elements - Silent war style */
  &::before {
    content: '♠️';
    position: absolute;
    top: 10%;
    left: 6%;
    font-size: 130px;
    opacity: 0.05;
    transform: rotate(-18deg);
    pointer-events: none;
    color: #047857;
    z-index: 0;
    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
  }

  &::after {
    content: '♥️';
    position: absolute;
    bottom: 12%;
    right: 8%;
    font-size: 110px;
    opacity: 0.06;
    transform: rotate(22deg);
    pointer-events: none;
    color: #059669;
    z-index: 0;
    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
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

  .blackjack-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 25px;
    transform: rotateX(1deg) rotateY(0deg);
    position: relative;
    z-index: 2;
    padding: 40px 30px;
    max-width: 1400px;
    margin: 0 auto;
    min-height: 100%;
  }

  /* Additional casino table elements */
  .velvet-bg-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

    &::before {
      content: '♦️';
      position: absolute;
      top: 38%;
      right: 12%;
      font-size: 95px;
      opacity: 0.04;
      transform: rotate(-25deg);
      color: #10b981;
      filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.5));
    }

    &::after {
      content: '♣️';
      position: absolute;
      bottom: 28%;
      left: 10%;
      font-size: 85px;
      opacity: 0.05;
      transform: rotate(28deg);
      color: #047857;
      filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.5));
    }
  }

  /* Smoky velvet overlay */
  .smoke-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 30% 20%, rgba(0, 0, 0, 0.4) 0%, transparent 60%),
      radial-gradient(circle at 70% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 20% 70%, rgba(6, 95, 70, 0.12) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  @keyframes subtle-tension {
    0%, 100% {
      opacity: 0.7;
      filter: brightness(1);
    }
    50% {
      opacity: 0.9;
      filter: brightness(1.1);
    }
  }

  @keyframes card-table-pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 0.8;
    }
    50% {
      transform: scale(1.02);
      opacity: 1;
    }
  }

  /* Enhanced styling for blackjack-specific elements */
  .dealer-area {
    background: 
      linear-gradient(135deg, 
        rgba(15, 20, 25, 0.9) 0%,
        rgba(28, 44, 31, 0.85) 50%,
        rgba(15, 20, 25, 0.9) 100%
      );
    border: 2px solid rgba(16, 185, 129, 0.3);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.5),
      inset 0 1px 2px rgba(255, 255, 255, 0.08);
    padding: 20px;
    color: #d1fae5;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  }

  .player-area {
    background: 
      linear-gradient(135deg, 
        rgba(6, 95, 70, 0.85) 0%,
        rgba(4, 120, 87, 0.8) 50%,
        rgba(6, 95, 70, 0.85) 100%
      );
    border: 2px solid rgba(16, 185, 129, 0.4);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 10px 35px rgba(0, 0, 0, 0.4),
      inset 0 2px 4px rgba(255, 255, 255, 0.1),
      0 0 20px rgba(16, 185, 129, 0.2);
    padding: 25px;
    color: #ecfdf5;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.9);
    animation: subtle-tension 4s ease-in-out infinite;
  }

  .card-table {
    background: 
      linear-gradient(135deg, 
        rgba(15, 20, 25, 0.8) 0%,
        rgba(28, 44, 31, 0.75) 50%,
        rgba(15, 20, 25, 0.8) 100%
      );
    border: 2px solid rgba(16, 185, 129, 0.25);
    border-radius: 12px;
    padding: 20px;
    backdrop-filter: blur(15px);
    box-shadow: 
      0 6px 24px rgba(0, 0, 0, 0.3),
      inset 0 1px 2px rgba(255, 255, 255, 0.05);
  }

  /* Silent war tension effects */
  .tension-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 300px;
    border: 1px solid rgba(16, 185, 129, 0.1);
    border-radius: 50%;
    animation: card-table-pulse 6s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }

  /* Enhanced card styling integration */
  .enhanced-card-area {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    padding: 15px;
    border: 1px solid rgba(16, 185, 129, 0.2);
    backdrop-filter: blur(10px);
  }
`
