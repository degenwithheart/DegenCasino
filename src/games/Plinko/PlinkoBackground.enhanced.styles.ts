import styled from 'styled-components'

export const StyledPlinkoBackground = styled.div`
  perspective: 100px;
  user-select: none;
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg, 
    var(--deep-romantic-night) 0%, 
    var(--deep-crimson-rose) 15%, 
    var(--soft-purple-twilight) 30%, 
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
    inset 0 -2px 4px rgba(10, 5, 17, 0.6),
    0 0 40px var(--deep-crimson-rose);
  overflow: hidden;
  animation: romanticPulse 4s ease-in-out infinite;
  
  /* Romantic Plinko elements */
  &::before {
    content: '💎';
    position: absolute;
    top: 8%;
    left: 6%;
    font-size: 140px;
    opacity: 0.1;
    transform: rotate(-15deg);
    pointer-events: none;
    color: var(--love-letter-gold);
    z-index: 0;
    text-shadow: 3px 3px 8px rgba(10, 5, 17, 0.7);
    animation: loveLetterFloat 8s ease-in-out infinite;
  }

  &::after {
    content: '�';
    position: absolute;
    bottom: 10%;
    right: 8%;
    font-size: 120px;
    opacity: 0.12;
    transform: rotate(25deg);
    pointer-events: none;
    color: var(--deep-crimson-rose);
    z-index: 0;
    text-shadow: 3px 3px 8px rgba(10, 5, 17, 0.7);
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
      transform: rotate(-15deg) translateY(0px);
      opacity: 0.1;
    }
    25% { 
      transform: rotate(-10deg) translateY(-8px);
      opacity: 0.15;
    }
    50% { 
      transform: rotate(-5deg) translateY(-15px);
      opacity: 0.2;
    }
    75% { 
      transform: rotate(-10deg) translateY(-8px);
      opacity: 0.15;
    }
  }

  @keyframes candlestickSparkle {
    0%, 100% { 
      transform: rotate(25deg) scale(1);
      opacity: 0.12;
    }
    20% { 
      transform: rotate(30deg) scale(1.05);
      opacity: 0.18;
    }
    40% { 
      transform: rotate(35deg) scale(1.1);
      opacity: 0.25;
    }
    60% { 
      transform: rotate(32deg) scale(1.08);
      opacity: 0.2;
    }
    80% { 
      transform: rotate(28deg) scale(1.03);
      opacity: 0.15;
    }
  }

  /* Allow internal layout to flow naturally without height constraints */
  & > * {
    position: relative;
    z-index: 1;
    width: 100%;
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

  /* Romantic floating elements */
  .romantic-bg-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

    &::before {
      content: '�';
      position: absolute;
      top: 30%;
      right: 15%;
      font-size: 100px;
      opacity: 0.08;
      transform: rotate(-20deg);
      color: var(--deep-crimson-rose);
      filter: drop-shadow(3px 3px 6px rgba(10, 5, 17, 0.6));
      animation: romanticFloat 7s ease-in-out infinite;
    }

    &::after {
      content: '✨';
      position: absolute;
      bottom: 35%;
      left: 12%;
      font-size: 90px;
      opacity: 0.1;
      transform: rotate(30deg);
      color: var(--love-letter-gold);
      filter: drop-shadow(3px 3px 6px rgba(10, 5, 17, 0.6));
      animation: loveLetterSparkle 5s ease-in-out infinite;
    }
  }

  @keyframes romanticFloat {
    0%, 100% { 
      transform: rotate(-20deg) translateY(0px);
      opacity: 0.08;
    }
    33% { 
      transform: rotate(-15deg) translateY(-12px);
      opacity: 0.12;
    }
    66% { 
      transform: rotate(-25deg) translateY(-6px);
      opacity: 0.15;
    }
  }

  @keyframes loveLetterSparkle {
    0%, 100% { 
      transform: rotate(30deg) scale(1);
      opacity: 0.1;
    }
    50% { 
      transform: rotate(35deg) scale(1.15);
      opacity: 0.18;
    }
  }

  /* Romantic melody overlay */
  .melody-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 25% 25%, var(--deep-crimson-rose) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, var(--soft-purple-twilight) 0%, transparent 60%),
      radial-gradient(circle at 50% 50%, var(--love-letter-gold) 0%, transparent 80%);
    opacity: 0.15;
    pointer-events: none;
    z-index: 0;
    animation: mysticalAura 10s ease-in-out infinite;
  }

  @keyframes mysticalAura {
    0%, 100% { 
      opacity: 0.15;
      filter: blur(0px);
    }
    25% { 
      opacity: 0.2;
      filter: blur(1px);
    }
    50% { 
      opacity: 0.25;
      filter: blur(2px);
    }
    75% { 
      opacity: 0.2;
      filter: blur(1px);
    }
  }

  /* Romantic inevitability indicator */
  .inevitability-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 400px;
    border: 1px solid var(--love-letter-gold);
    border-radius: 50%;
    animation: romanticHeartbeat 6s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
    box-shadow: 
      0 0 20px var(--deep-crimson-rose),
      inset 0 0 20px var(--soft-purple-twilight);
  }

  @keyframes romanticHeartbeat {
    0%, 100% {
      opacity: 0.4;
      transform: translate(-50%, -50%) scale(1);
      filter: brightness(1);
    }
    25% {
      opacity: 0.6;
      transform: translate(-50%, -50%) scale(1.02);
      filter: brightness(1.1);
    }
    50% {
      opacity: 0.8;
      transform: translate(-50%, -50%) scale(1.05);
      filter: brightness(1.2);
    }
    75% {
      opacity: 0.6;
      transform: translate(-50%, -50%) scale(1.02);
      filter: brightness(1.1);
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

  /* Enhanced styling for romantic plinko elements */
  .gravity-board-area {
    background: 
      linear-gradient(135deg, 
        var(--deep-romantic-night) 0%,
        var(--soft-purple-twilight) 50%,
        var(--deep-romantic-night) 100%
      );
    border: 2px solid var(--love-letter-gold);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 8px 32px rgba(10, 5, 17, 0.7),
      inset 0 1px 2px rgba(212, 165, 116, 0.2),
      0 0 15px var(--deep-crimson-rose);
    padding: 20px;
    color: var(--love-letter-gold);
    text-shadow: 1px 1px 2px rgba(10, 5, 17, 0.9);
  }

  .falling-display {
    background: 
      linear-gradient(135deg, 
        var(--deep-crimson-rose) 0%,
        var(--soft-purple-twilight) 50%,
        var(--deep-crimson-rose) 100%
      );
    border: 3px solid var(--love-letter-gold);
    border-radius: 20px;
    box-shadow: 
      0 12px 40px rgba(10, 5, 17, 0.7),
      inset 0 2px 4px rgba(212, 165, 116, 0.3),
      0 0 25px var(--deep-crimson-rose);
    padding: 25px;
    color: #fff;
    text-shadow: 2px 2px 4px rgba(10, 5, 17, 0.9);
    animation: romanticHeartbeat 4s ease-in-out infinite;
  }

  .physics-container {
    background: 
      linear-gradient(135deg, 
        var(--deep-romantic-night) 0%,
        var(--soft-purple-twilight) 50%,
        var(--deep-romantic-night) 100%
      );
    border: 2px solid var(--deep-crimson-rose);
    border-radius: 12px;
    padding: 20px;
    backdrop-filter: blur(15px);
    box-shadow: 
      0 6px 24px rgba(10, 5, 17, 0.5),
      inset 0 1px 2px rgba(139, 90, 158, 0.2),
      0 0 10px var(--soft-purple-twilight);
  }

  /* Romantic result area for consistent layout */
  .gravity-result-area {
    background: 
      linear-gradient(135deg, 
        var(--soft-purple-twilight) 0%,
        var(--deep-crimson-rose) 50%,
        var(--soft-purple-twilight) 100%
      );
    border: 2px solid var(--love-letter-gold);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 10px 35px rgba(10, 5, 17, 0.6),
      inset 0 2px 4px rgba(212, 165, 116, 0.3),
      0 0 20px var(--deep-crimson-rose);
    padding: 25px;
    color: #fff;
    text-shadow: 1px 1px 2px rgba(10, 5, 17, 0.9);
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  /* Enhanced Romantic Plinko Bucket Styling */
  .plinko-bucket {
    background: linear-gradient(135deg, 
      var(--deep-crimson-rose) 0%,
      var(--love-letter-gold) 50%,
      var(--soft-purple-twilight) 100%
    );
    border: 3px solid var(--love-letter-gold);
    border-radius: 8px 8px 16px 16px;
    box-shadow: 
      0 8px 25px rgba(10, 5, 17, 0.8),
      inset 0 2px 4px rgba(212, 165, 116, 0.4),
      0 0 15px var(--deep-crimson-rose),
      inset 0 -2px 8px rgba(10, 5, 17, 0.4);
    backdrop-filter: blur(15px);
    color: #ffffff;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(10, 5, 17, 0.9);
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
      rgba(212, 165, 116, 0.3) 50%, 
      transparent 70%
    );
    animation: romantic-bucket-shimmer 3s ease-in-out infinite;
  }

  @keyframes romantic-bucket-shimmer {
    0%, 100% { 
      transform: translateX(-100%);
      opacity: 0;
    }
    50% { 
      transform: translateX(100%);
      opacity: 1;
    }
  }

  .plinko-bucket::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, 
      rgba(212, 165, 116, 0.2) 0%,
      transparent 50%,
      rgba(10, 5, 17, 0.2) 100%
    );
    pointer-events: none;
  }

  .plinko-bucket:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 12px 35px rgba(10, 5, 17, 0.7),
      inset 0 2px 6px rgba(212, 165, 116, 0.5),
      0 0 25px var(--love-letter-gold);
    filter: brightness(1.1);
  }

  .plinko-bucket.high-multiplier {
    background: linear-gradient(135deg, 
      var(--love-letter-gold) 0%,
      var(--deep-crimson-rose) 50%,
      var(--soft-purple-twilight) 100%
    );
    border-color: var(--love-letter-gold);
    box-shadow: 
      0 10px 30px rgba(10, 5, 17, 0.7),
      inset 0 3px 6px rgba(212, 165, 116, 0.4),
      0 0 30px var(--love-letter-gold);
    animation: romanticHeartbeat 2s ease-in-out infinite;
  }

  .plinko-bucket.medium-multiplier {
    background: linear-gradient(135deg, 
      var(--soft-purple-twilight) 0%,
      var(--deep-crimson-rose) 50%,
      var(--love-letter-gold) 100%
    );
  }

  .plinko-bucket.low-multiplier {
    background: linear-gradient(135deg, 
      var(--deep-romantic-night) 0%,
      var(--soft-purple-twilight) 50%,
      var(--deep-crimson-rose) 100%
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

  /* Responsive Design for Romantic Plinko */
  @media (max-width: 479px) {
    .plinko-content {
      padding: 15px 10px;
      gap: 12px;
    }

    .gravity-board-area, .falling-display, .physics-container, .gravity-result-area {
      padding: 12px;
      border-radius: 8px;
      font-size: 14px;
    }

    .plinko-bucket {
      margin: 0 1px;
      min-height: 30px;
      font-size: 11px;
      padding: 4px;
    }

    .inevitability-indicator {
      width: 250px;
      height: 250px;
    }

    &::before, &::after {
      font-size: 80px;
    }

    .romantic-bg-elements {
      &::before, &::after {
        font-size: 60px;
      }
    }
  }

  @media (min-width: 480px) and (max-width: 768px) {
    .plinko-content {
      padding: 20px 15px;
      gap: 15px;
    }

    .gravity-board-area {
      padding: 15px;
      border-radius: 12px;
    }

    .falling-display {
      padding: 18px;
      border-radius: 16px;
    }

    .physics-container {
      padding: 15px;
      border-radius: 10px;
    }

    .gravity-result-area {
      padding: 18px;
      border-radius: 12px;
      min-height: 50px;
    }

    .plinko-bucket {
      margin: 0 1px;
      min-height: 35px;
      font-size: 12px;
    }

    .inevitability-indicator {
      width: 300px;
      height: 300px;
    }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    }

    .physics-container {
      padding: 18px;
    }

    .gravity-result-area {
      padding: 22px;
      min-height: 55px;
    }

    .plinko-bucket {
      margin: 0 1.5px;
      min-height: 38px;
      font-size: 13px;
    }

    .inevitability-indicator {
      width: 350px;
      height: 350px;
    }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    .plinko-content {
      padding: 25px 18px;
      gap: 18px;
    }

    .gravity-board-area {
      padding: 18px;
    }

    .falling-display {
      padding: 22px;
    }

    .physics-container {
      padding: 18px;
    }

    .gravity-result-area {
      padding: 22px;
      min-height: 55px;
    }

    .plinko-bucket {
      margin: 0 1.5px;
      min-height: 38px;
      font-size: 13px;
    }

    .inevitability-indicator {
      width: 350px;
      height: 350px;
    }
  }

  @media (min-width: 1025px) {
    .plinko-content {
      padding: 30px 20px;
      gap: 20px;
    }

    .gravity-board-area, .falling-display, .physics-container {
      padding: 20px;
    }

    .gravity-result-area {
      padding: 25px;
      min-height: 60px;
    }

    .plinko-bucket {
      margin: 0 2px;
      min-height: 40px;
      font-size: 14px;
    }

    .inevitability-indicator {
      width: 400px;
      height: 400px;
    }
  }
      padding: 25px;
      min-height: 60px;
    }

    .plinko-bucket {
      margin: 0 2px;
      min-height: 40px;
    }

    .inevitability-indicator {
      width: 400px;
      height: 400px;
    }
  }
`
