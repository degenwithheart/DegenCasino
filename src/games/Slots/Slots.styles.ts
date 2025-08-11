import styled from 'styled-components'

export const StyledSlots = styled.div`
  perspective: 100px;
  user-select: none;
  width: 100%;
  max-width: 1000px; /* Increased to accommodate wider reel layout */
  margin: 0 auto;

  & > div {
    display: grid;
    gap: 24px;
    transform: rotateX(3deg) rotateY(0deg);
    padding: 20px;
  }

  @keyframes pulse {
    0%, 30% {
      transform: scale(1)
    }
    10% {
      transform: scale(1.3)
    }
  }

  @keyframes reveal-glow {
    0%, 30% {
      border-color: #2d2d57;
      background: #ffffff00;
    }
    10% {
      border-color: white;
      background: #ffffff33;
    }
  }

  @keyframes shine {
    0%, 30% {
      background: #ffffff00;
    }
    10% {
      background: #ffffff33;
    }
  }

  @keyframes result-flash {
    25%, 75% {
      background-color: #ffec63;
      color: #333;
    }
    50% {
      background-color: #ffec6311;
      color: #ffec63;
    }
  }
  @keyframes result-flash-2 {
    0%, 50% {
      background-color: #ffec6388;
      filter: brightness(2.5) contrast(1.5) saturate(10);
    }
    100% {
      background-color: #ffec6300;
      filter: brightness(1) contrast(1);
    }
  }

  .result {
    border: none;
    padding: 16px; /* Increased padding */
    text-transform: uppercase;
    position: relative;
    width: 100%;
    border-radius: 12px; /* Increased border radius */
    border-spacing: 10px;
    border: 1px solid #ffec63;
    background-color: #ffec6311;
    color: #ffec63;
    font-size: 16px; /* Increased font size */
    font-weight: bold;
    text-align: center;
    margin-top: 8px; /* Add some top margin */
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      padding: 12px;
      font-size: 14px;
    }
    
    @media (max-width: 480px) {
      padding: 10px;
      font-size: 12px;
    }
  }

  .result[data-good="true"] {
    animation: result-flash 5s infinite;
  }

  @keyframes machine-idle {
    0%, 100% {
      box-shadow: 
        inset 0 0 10px rgba(0,0,0,0.5),
        0 4px 8px rgba(0,0,0,0.3),
        0 0 20px rgba(45,45,87,0.2);
    }
    50% {
      box-shadow: 
        inset 0 0 10px rgba(0,0,0,0.5),
        0 4px 8px rgba(0,0,0,0.3),
        0 0 25px rgba(45,45,87,0.3);
    }
  }

  .slots-grid {
    position: relative;
    display: flex;
    flex-direction: row; /* Changed to row for horizontal reel layout */
    gap: 8px; /* Gap between individual reels */
    justify-content: center;
    box-sizing: border-box;
    border-radius: 12px;
    padding: 20px;
    background: linear-gradient(145deg, #1a1a2e, #0f0f1a);
    border: 3px solid #2d2d57;
    min-width: 100%;
    overflow: visible; /* Allow reel shadows to show */
    
    /* Add subtle machine glow animation */
    animation: machine-idle 4s ease-in-out infinite;
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      padding: 15px;
      gap: 6px;
    }
    
    @media (max-width: 480px) {
      padding: 12px;
      gap: 4px;
    }
  }

  .slots-reel {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    max-width: 120px;
    background: linear-gradient(180deg, #2a2a3e, #1a1a2e);
    border: 2px solid #3d3d57;
    border-radius: 8px;
    padding: 8px;
    box-shadow: 
      inset 0 0 10px rgba(0,0,0,0.5),
      0 4px 8px rgba(0,0,0,0.3),
      0 0 20px rgba(45,45,87,0.2);
    position: relative;
    
    /* Add reel window effect */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        180deg, 
        rgba(255,255,255,0.1) 0%, 
        transparent 10%, 
        transparent 90%, 
        rgba(0,0,0,0.2) 100%
      );
      border-radius: 6px;
      pointer-events: none;
      z-index: 2;
    }
    
    /* Add chrome/metal effect to top and bottom */
    &::after {
      content: '';
      position: absolute;
      top: -3px;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% + 6px);
      height: 6px;
      background: linear-gradient(90deg, #666, #999, #666);
      border-radius: 3px;
      box-shadow: 
        0 -2px 4px rgba(0,0,0,0.3),
        inset 0 1px 0 rgba(255,255,255,0.2);
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      max-width: 100px;
      padding: 6px;
    }
    
    @media (max-width: 480px) {
      max-width: 80px;
      padding: 4px;
    }
  }

  .reel-label {
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(90deg, #666, #999, #666);
    color: #fff;
    font-size: 10px;
    font-weight: bold;
    padding: 2px 8px;
    border-radius: 4px;
    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    box-shadow: 
      0 1px 3px rgba(0,0,0,0.3),
      inset 0 1px 0 rgba(255,255,255,0.2);
    z-index: 3;
    
    @media (max-width: 480px) {
      font-size: 8px;
      padding: 1px 6px;
    }
  }

  .slots-row {
    display: flex;
    gap: 14px; /* This is now deprecated but kept for compatibility */
    justify-content: center;
    align-items: center;
    width: 100%;
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      gap: 10px;
    }
    
    @media (max-width: 480px) {
      gap: 6px;
    }
  }

  .slots {
    display: flex;
    gap: 20px;
    justify-content: center;
    box-sizing: border-box;
    border-radius: 10px;
  }

  .slot::after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
  }

  @keyframes reveal {
    0% {
      transform: translateY(100%);
      opacity: 0;
    }
    100% {
      transform: translateY(0%);
      opacity: 1;
    }
  }

  .slotImage {
    aspect-ratio: 1/1;
    max-width: 100%;
    max-height: 100%;
  }
`
