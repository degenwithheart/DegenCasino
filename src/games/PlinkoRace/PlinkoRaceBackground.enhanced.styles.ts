import styled from 'styled-components'

export const StyledPlinkoRaceBackground = styled.div`
  perspective: 100px;
  user-select: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3a 15%, #2d2d5a 30%, #3a3a7a 45%, #4d4d9a 60%, #6060ba 75%, #7070da 90%, #3a3a7a 100%);
  border-radius: 24px;
  border: 3px solid rgba(112, 112, 218, 0.4);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.8),
    inset 0 2px 4px rgba(255, 255, 255, 0.1),
    inset 0 -2px 4px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(112, 112, 218, 0.3);
  overflow: hidden;
  
  /* Floating velocity elements */
  &::before {
    content: '⚡';
    position: absolute;
    top: 8%;
    left: 6%;
    font-size: 150px;
    opacity: 0.06;
    transform: rotate(-18deg);
    pointer-events: none;
    color: #7070da;
    z-index: 0;
    text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.6);
    animation: float-velocity 8s ease-in-out infinite;
  }

  &::after {
    content: '🎯';
    position: absolute;
    bottom: 10%;
    right: 8%;
    font-size: 130px;
    opacity: 0.08;
    transform: rotate(25deg);
    pointer-events: none;
    color: #6060ba;
    z-index: 0;
    text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.6);
    animation: float-velocity 10s ease-in-out infinite reverse;
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

  /* Additional velocity vortex elements */
  .velocity-bg-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

    &::before {
      content: '🏁';
      position: absolute;
      top: 20%;
      right: 15%;
      font-size: 120px;
      opacity: 0.05;
      transform: rotate(-25deg);
      color: #4d4d9a;
      animation: float-velocity 12s ease-in-out infinite;
    }

    &::after {
      content: '⚡';
      position: absolute;
      bottom: 25%;
      left: 12%;
      font-size: 110px;
      opacity: 0.07;
      transform: rotate(30deg);
      color: #2d2d5a;
      animation: float-velocity 9s ease-in-out infinite reverse;
    }
  }

  .race-whispers-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 25% 25%, rgba(112, 112, 218, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(77, 77, 154, 0.06) 0%, transparent 50%),
      radial-gradient(circle at 50% 0%, rgba(58, 58, 122, 0.04) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .lightning-speed-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 200px;
    border: 2px solid rgba(112, 112, 218, 0.1);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    animation: pulse-speed 4s ease-in-out infinite;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 150px;
      height: 150px;
      border: 1px solid rgba(96, 96, 186, 0.08);
      border-radius: 50%;
      animation: pulse-speed 6s ease-in-out infinite reverse;
    }

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100px;
      height: 100px;
      border: 1px solid rgba(45, 45, 90, 0.06);
      border-radius: 50%;
      animation: pulse-speed 8s ease-in-out infinite;
    }
  }

  @keyframes float-velocity {
    0%, 100% { 
      transform: translateY(0px) rotate(-18deg); 
      opacity: 0.06; 
    }
    25% { 
      transform: translateY(-10px) rotate(-15deg); 
      opacity: 0.08; 
    }
    50% { 
      transform: translateY(-20px) rotate(-22deg); 
      opacity: 0.04; 
    }
    75% { 
      transform: translateY(-5px) rotate(-20deg); 
      opacity: 0.07; 
    }
  }

  @keyframes pulse-speed {
    0%, 100% { 
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.1;
    }
    50% { 
      transform: translate(-50%, -50%) scale(1.1);
      opacity: 0.05;
    }
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    &::before {
      font-size: 100px;
      top: 5%;
      left: 3%;
    }
    
    &::after {
      font-size: 90px;
      bottom: 5%;
      right: 3%;
    }

    .velocity-bg-elements {
      &::before {
        font-size: 80px;
        top: 15%;
        right: 10%;
      }

      &::after {
        font-size: 70px;
        bottom: 20%;
        left: 8%;
      }
    }

    .lightning-speed-indicator {
      width: 150px;
      height: 150px;

      &::before {
        width: 100px;
        height: 100px;
      }

      &::after {
        width: 70px;
        height: 70px;
      }
    }
  }
`
