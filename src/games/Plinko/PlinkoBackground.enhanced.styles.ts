import styled from 'styled-components'

export const StyledPlinkoBackground = styled.div`
  perspective: 100px;
  user-select: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0c4a6e 0%, #0e7490 15%, #0891b2 30%, #06b6d4 45%, #22d3ee 60%, #67e8f9 75%, #a5f3fc 90%, #06b6d4 100%);
  border-radius: 24px;
  border: 3px solid rgba(34, 211, 238, 0.4);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.7),
    inset 0 2px 4px rgba(255, 255, 255, 0.1),
    inset 0 -2px 4px rgba(0, 0, 0, 0.4),
    0 0 40px rgba(34, 211, 238, 0.3);
  overflow: hidden;
  
  /* Floating gravity/physics elements */
  &::before {
    content: '⚪';
    position: absolute;
    top: 8%;
    left: 6%;
    font-size: 140px;
    opacity: 0.06;
    transform: rotate(-15deg);
    pointer-events: none;
    color: #22d3ee;
    z-index: 0;
    text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.5);
  }

  &::after {
    content: '🌀';
    position: absolute;
    bottom: 10%;
    right: 8%;
    font-size: 120px;
    opacity: 0.08;
    transform: rotate(25deg);
    pointer-events: none;
    color: #67e8f9;
    z-index: 0;
    text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.5);
  }

  /* Use min-height so internal layout can expand without being constrained */
  & > * {
    position: relative;
    z-index: 1;
    width: 100%;
    min-height: 100%;
  }

  .plinko-content {
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

  /* Additional gravity elements */
  .gravity-bg-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

    &::before {
      content: '🔵';
      position: absolute;
      top: 30%;
      right: 15%;
      font-size: 100px;
      opacity: 0.05;
      transform: rotate(-20deg);
      color: #a5f3fc;
      filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.4));
    }

    &::after {
      content: '💫';
      position: absolute;
      bottom: 35%;
      left: 12%;
      font-size: 90px;
      opacity: 0.07;
      transform: rotate(30deg);
      color: #22d3ee;
      filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.4));
    }
  }

  /* Melody overlay for flowing movement */
  .melody-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 25% 25%, rgba(34, 211, 238, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(14, 116, 144, 0.12) 0%, transparent 60%),
      radial-gradient(circle at 50% 50%, rgba(8, 145, 178, 0.1) 0%, transparent 80%);
    pointer-events: none;
    z-index: 0;
  }

  /* Inevitability indicator for gravity's pull */
  .inevitability-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 400px;
    border: 1px solid rgba(34, 211, 238, 0.2);
    border-radius: 50%;
    animation: gravity-pulse 6s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }

  @keyframes gravity-pulse {
    0%, 100% {
      opacity: 0.8;
      filter: brightness(1);
    }
    50% {
      opacity: 1;
      filter: brightness(1.15);
    }
  }

  @keyframes falling-motion {
    0%, 100% {
      transform: scale(1);
      opacity: 0.9;
    }
    50% {
      transform: scale(1.03);
      opacity: 1;
    }
  }

  /* Enhanced styling for plinko-specific elements */
  .gravity-board-area {
    background: 
      linear-gradient(135deg, 
        rgba(12, 74, 110, 0.9) 0%,
        rgba(14, 116, 144, 0.85) 50%,
        rgba(12, 74, 110, 0.9) 100%
      );
    border: 2px solid rgba(34, 211, 238, 0.4);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.5),
      inset 0 1px 2px rgba(255, 255, 255, 0.1);
    padding: 20px;
    color: #a5f3fc;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  }

  .falling-display {
    background: 
      linear-gradient(135deg, 
        rgba(8, 145, 178, 0.9) 0%,
        rgba(6, 182, 212, 0.85) 50%,
        rgba(8, 145, 178, 0.9) 100%
      );
    border: 3px solid rgba(34, 211, 238, 0.6);
    border-radius: 20px;
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.5),
      inset 0 2px 4px rgba(255, 255, 255, 0.15),
      0 0 25px rgba(34, 211, 238, 0.3);
    padding: 25px;
    color: #f0fdff;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
    animation: gravity-pulse 4s ease-in-out infinite;
  }

  .physics-container {
    background: 
      linear-gradient(135deg, 
        rgba(12, 74, 110, 0.8) 0%,
        rgba(14, 116, 144, 0.75) 50%,
        rgba(12, 74, 110, 0.8) 100%
      );
    border: 2px solid rgba(34, 211, 238, 0.3);
    border-radius: 12px;
    padding: 20px;
    backdrop-filter: blur(15px);
    box-shadow: 
      0 6px 24px rgba(0, 0, 0, 0.3),
      inset 0 1px 2px rgba(255, 255, 255, 0.05);
  }

  /* Result area for consistent layout */
  .gravity-result-area {
    background: 
      linear-gradient(135deg, 
        rgba(14, 116, 144, 0.9) 0%,
        rgba(8, 145, 178, 0.85) 50%,
        rgba(14, 116, 144, 0.9) 100%
      );
    border: 2px solid rgba(34, 211, 238, 0.4);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 10px 35px rgba(0, 0, 0, 0.4),
      inset 0 2px 4px rgba(255, 255, 255, 0.12),
      0 0 20px rgba(34, 211, 238, 0.3);
    padding: 25px;
    color: #f0fdff;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  /* Enhanced Plinko Bucket Styling */
  .plinko-bucket {
    background: linear-gradient(135deg, 
      rgba(6, 182, 212, 0.95) 0%,
      rgba(34, 211, 238, 0.9) 50%,
      rgba(103, 232, 249, 0.95) 100%
    );
    border: 3px solid rgba(255, 255, 255, 0.4);
    border-radius: 8px 8px 16px 16px;
    box-shadow: 
      0 8px 25px rgba(0, 0, 0, 0.6),
      inset 0 2px 4px rgba(255, 255, 255, 0.3),
      0 0 15px rgba(34, 211, 238, 0.5),
      inset 0 -2px 8px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(15px);
    color: #ffffff;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    margin: 0 2px;
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .plinko-bucket::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, 
      transparent 30%, 
      rgba(255, 255, 255, 0.2) 50%, 
      transparent 70%
    );
    animation: bucket-shimmer 3s ease-in-out infinite;
  }

  .plinko-bucket::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, 
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%,
      rgba(0, 0, 0, 0.1) 100%
    );
    pointer-events: none;
  }

  .plinko-bucket:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 12px 35px rgba(0, 0, 0, 0.5),
      inset 0 2px 6px rgba(255, 255, 255, 0.25),
      0 0 25px rgba(34, 211, 238, 0.6);
  }

  .plinko-bucket.high-multiplier {
    background: linear-gradient(135deg, 
      rgba(34, 211, 238, 0.95) 0%,
      rgba(103, 232, 249, 0.9) 50%,
      rgba(165, 243, 252, 0.95) 100%
    );
    border-color: rgba(103, 232, 249, 0.8);
    box-shadow: 
      0 10px 30px rgba(0, 0, 0, 0.5),
      inset 0 3px 6px rgba(255, 255, 255, 0.3),
      0 0 30px rgba(103, 232, 249, 0.7);
    animation: gravity-pulse 2s ease-in-out infinite;
  }

  .plinko-bucket.medium-multiplier {
    background: linear-gradient(135deg, 
      rgba(14, 116, 144, 0.9) 0%,
      rgba(6, 182, 212, 0.85) 50%,
      rgba(34, 211, 238, 0.9) 100%
    );
  }

  .plinko-bucket.low-multiplier {
    background: linear-gradient(135deg, 
      rgba(12, 74, 110, 0.85) 0%,
      rgba(14, 116, 144, 0.8) 50%,
      rgba(8, 145, 178, 0.85) 100%
    );
    opacity: 0.8;
  }

  @keyframes bucket-shimmer {
    0%, 100% {
      transform: translateX(-100%);
    }
    50% {
      transform: translateX(100%);
    }
  }
`