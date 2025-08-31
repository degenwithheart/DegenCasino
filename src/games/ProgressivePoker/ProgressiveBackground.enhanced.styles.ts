import styled from 'styled-components'

export const StyledProgressivePokerBackground = styled.div`
  user-select: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a0d2e 0%, #2d1b45 15%, #4c1d95 30%, #6d28d9 45%, #8b5cf6 60%, #a78bfa 75%, #c4b5fd 90%, #6d28d9 100%);
  border-radius: 24px;
  border: 3px solid rgba(139, 92, 246, 0.4);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.7),
    inset 0 2px 4px rgba(255, 255, 255, 0.1),
    inset 0 -2px 4px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(139, 92, 246, 0.3);
  overflow: hidden;
  
  /* Floating poker card background elements - Progressive style */
  &::before {
    content: '🂡';
    position: absolute;
    top: 8%;
    left: 5%;
    font-size: 140px;
    opacity: 0.06;
    transform: rotate(-20deg);
    pointer-events: none;
    color: #6d28d9;
    z-index: 1;
    text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.5);
    filter: blur(0.5px);
  }

  &::after {
    content: '🂱';
    position: absolute;
    bottom: 10%;
    right: 7%;
    font-size: 120px;
    opacity: 0.07;
    transform: rotate(25deg);
    pointer-events: none;
    color: #8b5cf6;
    z-index: 1;
    text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.5);
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

  /* Don't interfere with child content */
  & > * {
    position: relative;
    z-index: 10;
  }

  /* Additional progressive poker elements */
  .progressive-bg-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2;

    &::before {
      content: '🂮';
      position: absolute;
      top: 30%;
      right: 15%;
      font-size: 100px;
      opacity: 0.05;
      transform: rotate(-12deg);
      color: #a78bfa;
      text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
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
