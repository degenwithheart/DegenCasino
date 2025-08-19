import styled from 'styled-components'

export const StyledSlots = styled.div`
  perspective: 100px;
  user-select: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #581c87 0%, #7c3aed 25%, #a855f7 50%, #c084fc 75%, #e879f9 100%);
  border-radius: 24px;
  border: 3px solid rgba(168, 85, 247, 0.3);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.5),
    inset 0 2px 4px rgba(255, 255, 255, 0.1),
    inset 0 -2px 4px rgba(0, 0, 0, 0.3),
    0 0 30px rgba(168, 85, 247, 0.2);
  overflow: hidden;
  
  /* Floating slot machine background elements */
  &::before {
    content: '🎰';
    position: absolute;
    top: 8%;
    left: 6%;
    font-size: 110px;
    opacity: 0.06;
    transform: rotate(-12deg);
    pointer-events: none;
    color: #a855f7;
    z-index: 0;
  }

  &::after {
    content: '💎';
    position: absolute;
    bottom: 12%;
    right: 8%;
    font-size: 95px;
    opacity: 0.08;
    transform: rotate(20deg);
    pointer-events: none;
    color: #c084fc;
    z-index: 0;
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

  .slots-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
    transform: rotateX(3deg) rotateY(0deg);
    position: relative;
    z-index: 2;
    padding: 60px 40px;
    max-width: 1200px;
    margin: 0 auto;
    min-height: 100%;
  }

  /* Additional casino background elements */
  .casino-bg-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

    &::before {
      content: '🍒';
      position: absolute;
      top: 40%;
      right: 12%;
      font-size: 85px;
      opacity: 0.05;
      transform: rotate(-20deg);
      color: #7c3aed;
    }

    &::after {
      content: '🔔';
      position: absolute;
      bottom: 30%;
      left: 10%;
      font-size: 75px;
      opacity: 0.07;
      transform: rotate(25deg);
      color: #e879f9;
    }
  }

  /* Decorative corner elements */
  .decorative-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 20, 147, 0.08) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
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
    padding: 30px 40px;
    text-transform: uppercase;
    position: relative;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    border-radius: 20px;
    background: 
      linear-gradient(135deg, 
        rgba(30, 30, 50, 0.9) 0%,
        rgba(40, 25, 60, 0.85) 50%,
        rgba(25, 35, 55, 0.9) 100%
      );
    border: 3px solid transparent;
    background-image: 
      linear-gradient(135deg, rgba(30, 30, 50, 0.9), rgba(25, 35, 55, 0.9)),
      linear-gradient(135deg, 
        rgba(255, 236, 99, 0.7) 0%,
        rgba(255, 215, 0, 0.5) 50%,
        rgba(255, 236, 99, 0.7) 100%
      );
    background-origin: border-box;
    background-clip: content-box, border-box;
    color: #ffe066;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    letter-spacing: 1.5px;
    box-shadow: 
      0 12px 35px rgba(0, 0, 0, 0.4),
      0 6px 20px rgba(255, 236, 99, 0.15),
      inset 0 2px 0 rgba(255, 255, 255, 0.15);
    text-shadow: 
      0 0 15px rgba(255, 236, 99, 0.6),
      0 3px 6px rgba(0, 0, 0, 0.4);
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        45deg,
        transparent 30%,
        rgba(255, 255, 255, 0.15) 50%,
        transparent 70%
      );
      border-radius: 20px;
      animation: shimmer 3s ease-in-out infinite;
    }
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .result[data-good="true"] {
    animation: result-flash 2s infinite, victoryPulse 1s ease-in-out infinite alternate;
    background: 
      linear-gradient(135deg, 
        rgba(255, 215, 0, 0.2) 0%,
        rgba(255, 140, 0, 0.15) 50%,
        rgba(255, 215, 0, 0.2) 100%
      );
    border-image: linear-gradient(
      45deg,
      rgba(255, 215, 0, 0.8) 0%,
      rgba(255, 140, 0, 0.6) 50%,
      rgba(255, 215, 0, 0.8) 100%
    ) 1;
    box-shadow: 
      0 0 30px rgba(255, 215, 0, 0.4),
      0 0 60px rgba(255, 215, 0, 0.2),
      0 8px 25px rgba(0, 0, 0, 0.3);
  }

  @keyframes victoryPulse {
    0% { transform: scale(1); }
    100% { transform: scale(1.02); }
  }

  .slots {
    display: flex;
    gap: 35px;
    justify-content: center;
    box-sizing: border-box;
    border-radius: 25px;
    background: 
      linear-gradient(145deg, 
        rgba(30, 30, 30, 0.9) 0%,
        rgba(15, 15, 25, 0.95) 50%,
        rgba(20, 20, 30, 0.9) 100%
      );
    padding: 50px 40px;
    border: 3px solid transparent;
    background-image: 
      linear-gradient(145deg, rgba(30, 30, 30, 0.9), rgba(15, 15, 25, 0.95)),
      linear-gradient(145deg, 
        rgba(255, 215, 0, 0.4) 0%,
        rgba(220, 38, 127, 0.3) 25%,
        rgba(147, 51, 234, 0.4) 50%,
        rgba(59, 130, 246, 0.3) 75%,
        rgba(255, 215, 0, 0.4) 100%
      );
    background-origin: border-box;
    background-clip: content-box, border-box;
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.5),
      0 15px 30px rgba(147, 51, 234, 0.15),
      inset 0 2px 0 rgba(255, 255, 255, 0.1),
      inset 0 -2px 0 rgba(0, 0, 0, 0.2);
    position: relative;
    min-height: 300px;
    
    &::before {
      content: '';
      position: absolute;
      top: -3px;
      left: -3px;
      right: -3px;
      bottom: -3px;
      background: linear-gradient(45deg, 
        rgba(255, 215, 0, 0.3) 0%,
        rgba(220, 38, 127, 0.2) 25%,
        rgba(147, 51, 234, 0.3) 50%,
        rgba(59, 130, 246, 0.2) 75%,
        rgba(255, 215, 0, 0.3) 100%
      );
      border-radius: 28px;
      z-index: -1;
      animation: borderGlow 3s ease-in-out infinite alternate;
    }
  }

  @keyframes borderGlow {
    0% { opacity: 0.6; }
    100% { opacity: 1; }
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
