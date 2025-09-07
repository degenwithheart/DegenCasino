import styled from 'styled-components'

export const StyledProgressivePokerBackground = styled.div`
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
    0 25px 50px rgba(10, 5, 17, 0.8),
    inset 0 2px 4px rgba(212, 165, 116, 0.2),
    inset 0 -2px 4px rgba(10, 5, 17, 0.7),
    0 0 40px var(--deep-crimson-rose);
  overflow: hidden;
  animation: romanticPulse 4s ease-in-out infinite;
  
  /* Romantic poker card elements */
  &::before {
    content: '�';
    position: absolute;
    top: 8%;
    left: 5%;
    font-size: 140px;
    opacity: 0.12;
    transform: rotate(-20deg);
    pointer-events: none;
    color: var(--deep-crimson-rose);
    z-index: 1;
    text-shadow: 3px 3px 8px rgba(10, 5, 17, 0.7);
    filter: blur(0.5px);
    animation: loveLetterFloat 8s ease-in-out infinite;
  }

  &::after {
    content: '💝';
    position: absolute;
    bottom: 10%;
    right: 7%;
    font-size: 120px;
    opacity: 0.15;
    transform: rotate(25deg);
    pointer-events: none;
    color: var(--love-letter-gold);
    z-index: 1;
    text-shadow: 3px 3px 8px rgba(10, 5, 17, 0.7);
    filter: blur(0.5px);
    animation: candlestickSparkle 6s ease-in-out infinite;
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

  @keyframes loveLetterFloat {
    0%, 100% { 
      transform: rotate(-20deg) translateY(0px);
      opacity: 0.12;
    }
    25% { 
      transform: rotate(-15deg) translateY(-8px);
      opacity: 0.18;
    }
    50% { 
      transform: rotate(-10deg) translateY(-15px);
      opacity: 0.25;
    }
    75% { 
      transform: rotate(-15deg) translateY(-8px);
      opacity: 0.18;
    }
  }

  @keyframes candlestickSparkle {
    0%, 100% { 
      transform: rotate(25deg) scale(1);
      opacity: 0.15;
    }
    20% { 
      transform: rotate(30deg) scale(1.05);
      opacity: 0.22;
    }
    40% { 
      transform: rotate(35deg) scale(1.1);
      opacity: 0.3;
    }
    60% { 
      transform: rotate(32deg) scale(1.08);
      opacity: 0.25;
    }
    80% { 
      transform: rotate(28deg) scale(1.03);
      opacity: 0.18;
    }
  }

  @keyframes romanticFloat {
    0%, 100% { 
      transform: rotate(-12deg) translateY(0px);
      opacity: 0.08;
    }
    33% { 
      transform: rotate(-8deg) translateY(-10px);
      opacity: 0.12;
    }
    66% { 
      transform: rotate(-16deg) translateY(-5px);
      opacity: 0.15;
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

  /* Don't interfere with child content */
  & > * {
    position: relative;
    z-index: 10;
  }

  /* Additional romantic poker elements */
  .progressive-bg-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2;

    &::before {
      content: '💕';
      position: absolute;
      top: 30%;
      right: 15%;
      font-size: 100px;
      opacity: 0.08;
      transform: rotate(-12deg);
      color: var(--deep-crimson-rose);
      text-shadow: 2px 2px 6px rgba(10, 5, 17, 0.6);
      animation: romanticFloat 7s ease-in-out infinite;
      filter: blur(0.3px);
    }

    &::after {
      content: '🂫';
      position: absolute;
      bottom: 35%;
      left: 10%;
      font-size: 90px;
      opacity: 0.04;
      transform: rotate(18deg);
      color: #c4b5fd;
      text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
      filter: blur(0.3px);
    }
  }

  /* Floating secondary elements */
  .floating-cards {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 3;

    &::before {
      content: '🃏';
      position: absolute;
      top: 60%;
      left: 20%;
      font-size: 80px;
      opacity: 0.03;
      transform: rotate(-8deg);
      color: #8b5cf6;
      animation: float 8s ease-in-out infinite;
    }

    &::after {
      content: '🎰';
      position: absolute;
      top: 20%;
      right: 25%;
      font-size: 70px;
      opacity: 0.04;
      transform: rotate(15deg);
      color: #a78bfa;
      animation: float 10s ease-in-out infinite reverse;
    }
  }

  /* Progressive jackpot symbols */
  .jackpot-symbols {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 4;

    &::before {
      content: '💎';
      position: absolute;
      bottom: 25%;
      right: 30%;
      font-size: 60px;
      opacity: 0.06;
      transform: rotate(-25deg);
      animation: sparkle 6s ease-in-out infinite;
    }

    &::after {
      content: '👑';
      position: absolute;
      top: 45%;
      left: 5%;
      font-size: 65px;
      opacity: 0.05;
      transform: rotate(12deg);
      animation: sparkle 7s ease-in-out infinite reverse;
    }
  }

  /* Floating animation */
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-15px) rotate(5deg);
    }
  }

  /* Sparkle animation for jackpot symbols */
  @keyframes sparkle {
    0%, 100% {
      opacity: 0.03;
      transform: scale(1) rotate(0deg);
    }
    50% {
      opacity: 0.08;
      transform: scale(1.1) rotate(180deg);
    }
  }

  /* Royal flush animation */
  @keyframes royal-glow {
    0%, 100% {
      filter: blur(0.5px) brightness(1);
    }
    50% {
      filter: blur(0.2px) brightness(1.2);
    }
  }

  /* Apply royal glow to certain elements when jackpot is hit */
  &.jackpot-mode {
    &::before,
    &::after {
      animation: royal-glow 2s ease-in-out infinite;
    }

    .progressive-bg-elements::before,
    .progressive-bg-elements::after {
      animation: royal-glow 2.5s ease-in-out infinite;
    }
  }

  /* Mobile responsiveness */
  @media (max-width: 640px) {
    .poker-content {
      padding: 20px 15px;
      gap: 15px;
    }

    &::before {
      font-size: 80px;
      top: 5%;
      left: 3%;
    }

    &::after {
      font-size: 60px;
      bottom: 8%;
      right: 5%;
    }

    .progressive-bg-elements::before {
      font-size: 50px;
    }

    .progressive-bg-elements::after {
      font-size: 45px;
    }

    .floating-cards::before {
      font-size: 35px;
    }

    .floating-cards::after {
      font-size: 30px;
    }

    .jackpot-symbols::before {
      font-size: 30px;
    }

    .jackpot-symbols::after {
      font-size: 35px;
    }
  }

  @media (min-width: 641px) and (max-width: 768px) {
    .poker-content {
      padding: 25px 18px;
      gap: 18px;
    }

    &::before {
      font-size: 90px;
      top: 5%;
      left: 3%;
    }

    &::after {
      font-size: 70px;
      bottom: 8%;
      right: 5%;
    }

    .progressive-bg-elements::before {
      font-size: 60px;
    }

    .progressive-bg-elements::after {
      font-size: 55px;
    }

    .floating-cards::before {
      font-size: 45px;
    }

    .floating-cards::after {
      font-size: 40px;
    }

    .jackpot-symbols::before {
      font-size: 35px;
    }

    .jackpot-symbols::after {
      font-size: 40px;
    }
  }

  @media (min-width: 769px) and (max-width: 899px) {
    .poker-content {
      padding: 35px 25px;
      gap: 25px;
    }

    &::before {
      font-size: 110px;
      top: 5%;
      left: 3%;
    }

    &::after {
      font-size: 90px;
      bottom: 8%;
      right: 5%;
    }

    .progressive-bg-elements::before {
      font-size: 75px;
    }

    .progressive-bg-elements::after {
      font-size: 65px;
    }

    .floating-cards::before {
      font-size: 55px;
    }

    .floating-cards::after {
      font-size: 50px;
    }

    .jackpot-symbols::before {
      font-size: 45px;
    }

    .jackpot-symbols::after {
      font-size: 50px;
    }
  }

  @media (min-width: 900px) {
    .poker-content {
      padding: 40px 30px;
      gap: 30px;
    }

    &::before {
      font-size: 120px;
      top: 5%;
      left: 3%;
    }

    &::after {
      font-size: 100px;
      bottom: 8%;
      right: 5%;
    }

    .progressive-bg-elements::before {
      font-size: 80px;
    }

    .progressive-bg-elements::after {
      font-size: 70px;
    }

    .floating-cards::before {
      font-size: 60px;
    }

    .floating-cards::after {
      font-size: 55px;
    }

    .jackpot-symbols::before {
      font-size: 50px;
    }

    .jackpot-symbols::after {
      font-size: 55px;
    }
  }
`
