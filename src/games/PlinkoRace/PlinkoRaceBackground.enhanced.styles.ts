import styled from 'styled-components'

export const StyledPlinkoRaceBackground = styled.div`
  perspective: 100px;
  user-select: none;
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg, 
    var(--deep-romantic-night) 0%, 
    var(--soft-purple-twilight) 15%, 
    var(--deep-crimson-rose) 30%, 
    var(--love-letter-gold) 45%, 
    var(--deep-crimson-rose) 60%, 
    var(--soft-purple-twilight) 75%, 
    var(--deep-romantic-night) 90%
  );
  border-radius: 24px;
  border: 3px solid var(--love-letter-gold);
  box-shadow: 
    0 25px 50px rgba(10, 5, 17, 0.9),
    inset 0 2px 4px rgba(212, 165, 116, 0.2),
    inset 0 -2px 4px rgba(10, 5, 17, 0.7),
    0 0 40px var(--deep-crimson-rose);
  overflow: hidden;
  animation: romanticPulse 5s ease-in-out infinite;
  
  /* Romantic racing elements */
  &::before {
    content: '💫';
    position: absolute;
    top: 8%;
    left: 6%;
    font-size: 150px;
    opacity: 0.12;
    transform: rotate(-18deg);
    pointer-events: none;
    color: var(--love-letter-gold);
    z-index: 0;
    text-shadow: 3px 3px 8px rgba(10, 5, 17, 0.8);
    animation: romantic-velocity-float 8s ease-in-out infinite;
  }

  &::after {
    content: '💖';
    position: absolute;
    bottom: 10%;
    right: 8%;
    font-size: 130px;
    opacity: 0.15;
    transform: rotate(25deg);
    pointer-events: none;
    color: var(--deep-crimson-rose);
    z-index: 0;
    text-shadow: 3px 3px 8px rgba(10, 5, 17, 0.8);
    animation: romantic-heartbeat-float 10s ease-in-out infinite reverse;
  }

  @keyframes romanticPulse {
    0%, 100% { 
      filter: brightness(1) saturate(1) hue-rotate(0deg);
      border-color: var(--love-letter-gold);
    }
    25% { 
      filter: brightness(1.05) saturate(1.1) hue-rotate(5deg);
      border-color: var(--deep-crimson-rose);
    }
    50% { 
      filter: brightness(1.1) saturate(1.2) hue-rotate(10deg);
      border-color: var(--soft-purple-twilight);
    }
    75% { 
      filter: brightness(1.05) saturate(1.1) hue-rotate(5deg);
      border-color: var(--deep-crimson-rose);
    }
  }

  @keyframes romantic-velocity-float {
    0%, 100% { 
      transform: rotate(-18deg) translateY(0px) scale(1);
      opacity: 0.12;
    }
    25% { 
      transform: rotate(-15deg) translateY(-15px) scale(1.05);
      opacity: 0.18;
    }
    50% { 
      transform: rotate(-12deg) translateY(-25px) scale(1.1);
      opacity: 0.25;
    }
    75% { 
      transform: rotate(-15deg) translateY(-15px) scale(1.05);
      opacity: 0.18;
    }
  }

  @keyframes romantic-heartbeat-float {
    0%, 100% { 
      transform: rotate(25deg) translateY(0px) scale(1);
      opacity: 0.15;
    }
    33% { 
      transform: rotate(30deg) translateY(-12px) scale(1.08);
      opacity: 0.22;
    }
    66% { 
      transform: rotate(35deg) translateY(-20px) scale(1.15);
      opacity: 0.3;
    }
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

  /* Allow internal layout to flow naturally without height constraints */
  & > * {
    position: relative;
    z-index: 1;
    width: 100%;
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
  @media (max-width: 640px) {
    &::before {
      font-size: 80px;
      top: 5%;
      left: 3%;
    }

    &::after {
      font-size: 70px;
      bottom: 5%;
      right: 3%;
    }

    .velocity-bg-elements {
      &::before {
        font-size: 60px;
        top: 15%;
        right: 10%;
      }

      &::after {
        font-size: 50px;
        bottom: 20%;
        left: 8%;
      }
    }

    .lightning-speed-indicator {
      width: 120px;
      height: 120px;

      &::before {
        width: 80px;
        height: 80px;
      }

      &::after {
        width: 50px;
        height: 50px;
      }
    }
  }

  @media (min-width: 641px) and (max-width: 768px) {
    &::before {
      font-size: 90px;
      top: 5%;
      left: 3%;
    }

    &::after {
      font-size: 80px;
      bottom: 5%;
      right: 3%;
    }

    .velocity-bg-elements {
      &::before {
        font-size: 70px;
        top: 15%;
        right: 10%;
      }

      &::after {
        font-size: 60px;
        bottom: 20%;
        left: 8%;
      }
    }

    .lightning-speed-indicator {
      width: 140px;
      height: 140px;

      &::before {
        width: 90px;
        height: 90px;
      }

      &::after {
        width: 60px;
        height: 60px;
      }
    }
  }

  @media (min-width: 769px) and (max-width: 899px) {
    &::before {
      font-size: 110px;
      top: 5%;
      left: 3%;
    }

    &::after {
      font-size: 95px;
      bottom: 5%;
      right: 3%;
    }

    .velocity-bg-elements {
      &::before {
        font-size: 85px;
        top: 15%;
        right: 10%;
      }

      &::after {
        font-size: 75px;
        bottom: 20%;
        left: 8%;
      }
    }

    .lightning-speed-indicator {
      width: 160px;
      height: 160px;

      &::before {
        width: 110px;
        height: 110px;
      }

      &::after {
        width: 75px;
        height: 75px;
      }
    }
  }

  @media (min-width: 900px) {
    &::before {
      font-size: 120px;
      top: 5%;
      left: 3%;
    }

    &::after {
      font-size: 100px;
      bottom: 5%;
      right: 3%;
    }

    .velocity-bg-elements {
      &::before {
        font-size: 90px;
        top: 15%;
        right: 10%;
      }

      &::after {
        font-size: 80px;
        bottom: 20%;
        left: 8%;
      }
    }

    .lightning-speed-indicator {
      width: 180px;
      height: 180px;

      &::before {
        width: 120px;
        height: 120px;
      }

      &::after {
        width: 80px;
        height: 80px;
      }
    }
  }
`
