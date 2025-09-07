import styled, { keyframes } from 'styled-components'

const romanticMistAnimation = keyframes`
  0% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 0.15;
  }
  50% {
    transform: translate(-20px, -100px) rotate(10deg);
    opacity: 0.4;
    filter: hue-rotate(10deg);
  }
  100% {
    transform: translate(-40px, -200px) rotate(20deg);
    opacity: 0;
    filter: hue-rotate(20deg);
  }
`

const loveLetterDealAnimation = keyframes`
  0% {
    transform: translateY(-100px) scale(0.8) rotateY(180deg);
    opacity: 0;
    filter: brightness(0.8);
  }
  50% {
    transform: translateY(-20px) scale(0.9) rotateY(90deg);
    opacity: 0.7;
    filter: brightness(1.1);
  }
  100% {
    transform: translateY(0) scale(1) rotateY(0deg);
    opacity: 1;
    filter: brightness(1);
  }
`

const romanticPulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px var(--love-letter-gold);
  }
  33% {
    box-shadow: 0 0 30px var(--deep-crimson-rose);
  }
  66% {
    box-shadow: 0 0 25px var(--soft-purple-twilight);
  }
`

const candlestickTokenSlide = keyframes`
  0% {
    transform: translateY(-100px) scale(0.5);
    opacity: 0;
    filter: brightness(0.8);
  }
  50% {
    transform: translateY(-20px) scale(0.8);
    opacity: 0.8;
    filter: brightness(1.2);
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
    filter: brightness(1);
  }
`

const romanticTokenGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px var(--love-letter-gold);
  }
  33% {
    box-shadow: 0 0 30px var(--deep-crimson-rose);
  }
  66% {
    box-shadow: 0 0 25px var(--soft-purple-twilight);
  }
`

const loveLetterFlicker = keyframes`
  0%, 100% {
    opacity: 0.9;
    filter: brightness(1);
  }
  25% {
    opacity: 0.7;
    filter: brightness(0.9);
  }
  50% {
    opacity: 1;
    filter: brightness(1.1);
  }
  75% {
    opacity: 0.8;
    filter: brightness(0.95);
  }
`

export const StyledBlackjackBackground = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(
    135deg, 
    var(--deep-romantic-night) 0%, 
    var(--soft-purple-twilight) 25%, 
    var(--deep-crimson-rose) 50%, 
    var(--love-letter-gold) 75%, 
    var(--deep-romantic-night) 100%
  );
  background-attachment: fixed;
  animation: romanticPulseGlow 6s ease-in-out infinite;

  /* Romantic casino pattern overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(255, 215, 0, 0.02) 0%, transparent 50%),
      linear-gradient(45deg, transparent 49%, rgba(255, 215, 0, 0.01) 50%, transparent 51%);
    background-size: 60px 60px, 80px 80px, 40px 40px;
    pointer-events: none;
  }

  /* Subtle animated particles */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(138, 43, 226, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(255, 20, 147, 0.06) 0%, transparent 50%);
    animation: ${romanticMistAnimation} 20s infinite linear;
    pointer-events: none;
  }

  .velvet-bg-elements {
    position: absolute;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(ellipse at center top, rgba(0, 100, 50, 0.2) 0%, transparent 60%),
      linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
    pointer-events: none;
  }

  .smoke-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    
    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 60px;
      height: 60px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
      border-radius: 50%;
      animation: ${romanticMistAnimation} 8s infinite linear;
    }
    
    &::before {
      top: 80%;
      left: 10%;
      animation-delay: 0s;
    }
    
    &::after {
      top: 75%;
      right: 15%;
      animation-delay: 4s;
    }
  }

  .tension-indicator {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 8px;
    height: 8px;
    background: #ff4444;
    border-radius: 50%;
    animation: ${loveLetterFlicker} 2s infinite;
    box-shadow: 0 0 10px #ff4444;
  }

  .casino-table {
    display: flex;
    flex-direction: column;
    height: 100vh;
    min-height: 700px;
    width: 100%;
    margin: 0;
    position: relative;
    padding: 20px;
    font-family: 'Segoe UI', 'Roboto', sans-serif;
    overflow: hidden;
  }

  .table-header {
    text-align: center;
    margin-bottom: 25px;
    padding: 20px 30px;
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%),
      linear-gradient(45deg, rgba(138, 43, 226, 0.3) 0%, rgba(30, 144, 255, 0.3) 100%);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    backdrop-filter: blur(10px);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .table-rules {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .rule-text {
    font-weight: 600;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    letter-spacing: 0.5px;

    &.main {
      font-size: 22px;
      color: #ffffff;
      text-transform: uppercase;
      letter-spacing: 2px;
      background: linear-gradient(45deg, #ffd700, #ffed4e, #ffd700);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 8px;
    }

    &.sub {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 400;
      letter-spacing: 0.3px;
    }
  }

  .dealer-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    min-height: 220px;
    flex: 1;
    justify-content: center;
  }

  .dealer-label {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding: 12px 24px;
    background:
      linear-gradient(135deg, rgba(255, 69, 0, 0.3) 0%, rgba(255, 140, 0, 0.3) 100%),
      linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 25px;
    color: #ffffff;
    font-weight: 600;
    font-size: 18px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    box-shadow:
      0 4px 16px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .player-label {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding: 12px 24px;
    background:
      linear-gradient(135deg, rgba(30, 144, 255, 0.3) 0%, rgba(138, 43, 226, 0.3) 100%),
      linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 25px;
    color: #ffffff;
    font-weight: 600;
    font-size: 18px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    box-shadow:
      0 4px 16px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .dealer-icon,
  .player-icon {
    font-size: 20px;
  }

  .dealer-score,
  .player-score {
    margin-left: 12px;
    padding: 6px 14px;
    background:
      linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.4) 100%),
      linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 18px;
    color: #ffffff;
    font-weight: 700;
    min-width: 35px;
    text-align: center;
    font-size: 16px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(6px);
    box-shadow:
      0 2px 8px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);

    .bust {
      color: #ff4757;
      animation: ${romanticPulseGlow} 1s infinite;
      text-shadow: 0 2px 4px rgba(255, 71, 87, 0.5);
    }
  }

  .dealer-cards {
    display: flex;
    align-items: center;
    gap: 20px;
    width: 100%;
    justify-content: center;
  }

  .card-deck-area {
    display: flex;
    align-items: center;
  }

  .deck-stack {
    position: relative;
    width: 60px;
    height: 80px;
  }

  .deck-card {
    position: absolute;
    width: 60px;
    height: 80px;
    background: linear-gradient(135deg, #8B4513 0%, #654321 100%);
    border: 2px solid #FFD700;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    
    &:nth-child(1) {
      top: 0;
      left: 0;
      z-index: 3;
    }
    
    &:nth-child(2) {
      top: -2px;
      left: -2px;
      z-index: 2;
    }
    
    &:nth-child(3) {
      top: -4px;
      left: -4px;
      z-index: 1;
    }
  }

  .dealer-hand,
  .player-cards {
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  .table-surface {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 20px;
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%),
      linear-gradient(45deg, rgba(138, 43, 226, 0.1) 0%, rgba(30, 144, 255, 0.1) 100%);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 25px;
    padding: 25px 35px;
    margin: 15px 0;
    position: relative;
    backdrop-filter: blur(12px);
    box-shadow:
      0 12px 40px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      inset 0 -1px 0 rgba(0, 0, 0, 0.1);
    min-height: auto;
  }

  .betting-areas {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 40px;
    margin-bottom: 50px;
    flex-shrink: 0;
  }

  .bet-circle {
    width: 110px;
    height: 110px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background:
      radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, rgba(255, 140, 0, 0.3) 50%, rgba(255, 69, 0, 0.4) 100%),
      linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
    box-shadow:
      0 8px 25px rgba(255, 215, 0, 0.2),
      inset 0 2px 4px rgba(255, 215, 0, 0.1),
      inset 0 -2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: scale(1.05);
      box-shadow:
        0 12px 35px rgba(255, 215, 0, 0.3),
        inset 0 2px 4px rgba(255, 215, 0, 0.15),
        inset 0 -2px 4px rgba(0, 0, 0, 0.15);
    }
  }

  .bet-circle-inner {
    text-align: center;
    color: #ffffff;
    font-weight: 600;
    font-size: 15px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 4px;
  }

  .bet-label {
    display: block;
    transition: opacity 0.5s ease-in-out;
  }

  .bet-token-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    animation: ${candlestickTokenSlide} 0.8s ease-out;
  }

  .bet-token-image {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.3);
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.3),
      0 0 20px rgba(255, 215, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    animation: ${romanticTokenGlow} 2s infinite;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: scale(1.1);
      box-shadow:
        0 6px 18px rgba(0, 0, 0, 0.4),
        0 0 30px rgba(255, 215, 0, 0.6),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }
  }

  .bet-amount {
    font-size: 13px;
    font-weight: 700;
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    white-space: nowrap;
    letter-spacing: 0.5px;
  }

  .insurance-area {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 15px;
    border: 2px solid rgba(255, 215, 0, 0.3);
  }

  .insurance-line {
    color: #FFFFFF;
    font-size: 14px;
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    text-align: center;
  }

  .player-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: auto;
    flex-shrink: 0;
    justify-content: flex-start;
  }

  .player-position {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .player-label {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
    padding: 8px 20px;
    background: linear-gradient(135deg, rgba(0, 100, 50, 0.4) 0%, rgba(0, 80, 40, 0.4) 100%);
    border: 1px solid rgba(255, 215, 0, 0.3);
    border-radius: 25px;
    color: #FFD700;
    font-weight: bold;
    font-size: 16px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(3px);
  }

  .empty-card-slot {
    width: 120px;
    height: 168px;
    border: 2px dashed rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%),
      linear-gradient(45deg, rgba(138, 43, 226, 0.1) 0%, rgba(30, 144, 255, 0.1) 100%);
    font-size: 44px;
    color: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(8px);
    box-shadow:
      0 4px 16px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      border-color: rgba(255, 215, 0, 0.5);
      background:
        linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 140, 0, 0.05) 100%),
        linear-gradient(45deg, rgba(138, 43, 226, 0.15) 0%, rgba(30, 144, 255, 0.15) 100%);
      color: rgba(255, 215, 0, 0.6);
      transform: scale(1.02);
    }
  }  .casino-card {
    animation: ${loveLetterDealAnimation} 0.8s ease-out;
    transform-origin: center;
  }

  .playing-card {
    width: 120px;
    height: 168px;
    background:
      linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%),
      linear-gradient(45deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%);
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow:
      0 8px 25px rgba(0, 0, 0, 0.15),
      0 4px 12px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.8),
      inset 0 -1px 0 rgba(0, 0, 0, 0.05);
    font-family: 'Segoe UI', 'Roboto', sans-serif;
    font-weight: bold;
    cursor: default;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow:
        0 12px 35px rgba(0, 0, 0, 0.2),
        0 6px 18px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.9),
        inset 0 -1px 0 rgba(0, 0, 0, 0.03);
    }

    &.dealer-card {
      border-color: rgba(220, 20, 60, 0.3);
      box-shadow:
        0 8px 25px rgba(220, 20, 60, 0.1),
        0 4px 12px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.8),
        inset 0 -1px 0 rgba(0, 0, 0, 0.05);
    }

    &.player-card {
      border-color: rgba(30, 144, 255, 0.3);
      box-shadow:
        0 8px 25px rgba(30, 144, 255, 0.1),
        0 4px 12px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.8),
        inset 0 -1px 0 rgba(0, 0, 0, 0.05);
    }
  }

  .card-rank,
  .card-suit {
    font-size: 20px;
    font-weight: 700;
    text-shadow:
      0 1px 2px rgba(0, 0, 0, 0.3),
      0 0 4px rgba(255, 255, 255, 0.1);
    line-height: 1;
    letter-spacing: -0.5px;
  }

  .card-corner {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1px;
  }

  .top-left {
    top: 10px;
    left: 10px;
  }

  .bottom-right {
    bottom: 10px;
    right: 10px;
    transform: rotate(180deg);
  }

  .center {
    font-size: 36px;
    opacity: 0.8;
    text-shadow:
      0 2px 4px rgba(0, 0, 0, 0.4),
      0 0 8px rgba(255, 255, 255, 0.2);
    font-weight: 800;
  }
  }

  .game-status {
    margin-top: 20px;
    text-align: center;
  }

  .result-banner {
    padding: 18px 28px;
    border-radius: 20px;
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow:
      0 8px 25px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);

    &.win {
      background:
        linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(22, 163, 74, 0.4) 100%),
        linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
      border-color: rgba(34, 197, 94, 0.4);
      color: #ffffff;
      animation: ${romanticPulseGlow} 2s infinite;
    }

    &.lose {
      background:
        linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.4) 100%),
        linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
      border-color: rgba(239, 68, 68, 0.4);
      color: #ffffff;
    }
  }

  .result-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    font-weight: 600;
    font-size: 18px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  .result-icon {
    font-size: 24px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }

  .result-text {
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .result-amount {
    color: #ffd700;
    font-weight: 700;
    text-shadow: 0 2px 6px rgba(255, 215, 0, 0.5);
  }

  .waiting-banner {
    padding: 18px 28px;
    background:
      linear-gradient(135deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 140, 0, 0.4) 100%),
      linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
    border: 1px solid rgba(255, 215, 0, 0.4);
    border-radius: 20px;
    color: #ffffff;
    font-weight: 600;
    font-size: 16px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    box-shadow:
      0 8px 25px rgba(255, 215, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  .waiting-icon {
    font-size: 20px;
    animation: ${loveLetterFlicker} 1.5s infinite;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }

  .waiting-text {
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  /* Wide Screen Optimizations */
  @media (min-width: 1200px) {
    .casino-table {
      padding: 25px;
    }
    
    .table-surface {
      display: grid;
      grid-template-columns: 1fr 2fr 1fr;
      grid-template-areas: 
        "betting-left player-area betting-right";
      align-items: center;
      gap: 40px;
      padding: 50px;
    }
    
    .betting-areas {
      grid-area: betting-left;
      justify-self: center;
    }
    
    .player-area {
      grid-area: player-area;
      justify-self: center;
    }
    
    .dealer-hand,
    .player-cards {
      gap: 25px;
    }
    
    .playing-card {
      width: 175px;
      height: 250px;
    }
    
    .empty-card-slot {
      width: 175px;
      height: 250px;
      font-size: 56px;
    }
    
    .card-rank,
    .card-suit {
      font-size: 20px;
    }
    
    .center {
      font-size: 36px;
    }
    
    .bet-token-image {
      width: 40px;
      height: 40px;
    }
    
    .bet-amount {
      font-size: 12px;
    }
  }

  /* Mobile Responsive */
  @media (max-width: 640px) {
    .casino-table {
      padding: 8px;
      min-height: 450px;
    }
    
    .betting-areas {
      display: none;
    }
    
    .table-header {
      margin-bottom: 12px;
      padding: 8px;
    }
    
    .rule-text {
      &.main {
        font-size: 14px;
      }
      
      &.sub {
        font-size: 9px;
      }
    }
    
    .dealer-area,
    .player-area {
      min-height: 100px;
    }
    
    .playing-card {
      width: 90px;
      height: 126px;
      border-width: 2px;
    }
    
    .card-rank,
    .card-suit {
      font-size: 14px;
    }
    
    .center {
      font-size: 24px;
    }
    
    .empty-card-slot {
      width: 90px;
      height: 126px;
      font-size: 32px;
      border-width: 2px;
    }
    
    .result-content {
      font-size: 14px;
      gap: 8px;
    }
    
    .table-surface {
      padding: 20px;
      margin: 12px 0;
    }
    
    .dealer-hand,
    .player-cards {
      gap: 12px;
    }
    
    .bet-token-image {
      width: 24px;
      height: 24px;
    }
    
    .bet-amount {
      font-size: 8px;
    }
  }

  @media (min-width: 641px) and (max-width: 768px) {
    .casino-table {
      padding: 10px;
      min-height: 500px;
    }
    
    .betting-areas {
      display: none;
    }
    
    .table-header {
      margin-bottom: 15px;
      padding: 10px;
    }
    
    .rule-text {
      &.main {
        font-size: 16px;
      }
      
      &.sub {
        font-size: 10px;
      }
    }
    
    .dealer-area,
    .player-area {
      min-height: 120px;
    }
    
    .playing-card {
      width: 100px;
      height: 140px;
      border-width: 2px;
    }
    
    .card-rank,
    .card-suit {
      font-size: 16px;
    }
    
    .center {
      font-size: 28px;
    }
    
    .empty-card-slot {
      width: 100px;
      height: 140px;
      font-size: 36px;
      border-width: 2px;
    }
    
    .result-content {
      font-size: 16px;
      gap: 10px;
    }
    
    .table-surface {
      padding: 25px;
      margin: 15px 0;
    }
    
    .dealer-hand,
    .player-cards {
      gap: 15px;
    }
    
    .bet-token-image {
      width: 28px;
      height: 28px;
    }
    
    .bet-amount {
      font-size: 9px;
    }
  }

  @media (min-width: 769px) and (max-width: 899px) {
    .casino-table {
      padding: 12px;
      min-height: 550px;
    }
    
    .betting-areas {
      opacity: 0.7;
    }
    
    .table-header {
      margin-bottom: 18px;
      padding: 12px;
    }
    
    .rule-text {
      &.main {
        font-size: 18px;
      }
      
      &.sub {
        font-size: 11px;
      }
    }
    
    .dealer-area,
    .player-area {
      min-height: 140px;
    }
    
    .playing-card {
      width: 110px;
      height: 154px;
      border-width: 2px;
    }
    
    .card-rank,
    .card-suit {
      font-size: 18px;
    }
    
    .center {
      font-size: 32px;
    }
    
    .empty-card-slot {
      width: 110px;
      height: 154px;
      font-size: 40px;
      border-width: 2px;
    }
    
    .result-content {
      font-size: 18px;
      gap: 12px;
    }
    
    .table-surface {
      padding: 30px;
      margin: 18px 0;
    }
    
    .dealer-hand,
    .player-cards {
      gap: 18px;
    }
    
    .bet-token-image {
      width: 32px;
      height: 32px;
    }
    
    .bet-amount {
      font-size: 10px;
    }
  }

  @media (min-width: 900px) {
    .casino-table {
      padding: 15px;
      min-height: 600px;
    }
    
    .betting-areas {
      opacity: 1;
    }
    
    .table-header {
      margin-bottom: 20px;
      padding: 15px;
    }
    
    .rule-text {
      &.main {
        font-size: 20px;
      }
      
      &.sub {
        font-size: 12px;
      }
    }
    
    .dealer-area,
    .player-area {
      min-height: 160px;
    }
    
    .playing-card {
      width: 120px;
      height: 168px;
      border-width: 3px;
    }
    
    .card-rank,
    .card-suit {
      font-size: 20px;
    }
    
    .center {
      font-size: 36px;
    }
    
    .empty-card-slot {
      width: 120px;
      height: 168px;
      font-size: 44px;
      border-width: 3px;
    }
    
    .result-content {
      font-size: 20px;
      gap: 15px;
    }
    
    .table-surface {
      padding: 35px;
      margin: 20px 0;
    }
    
    .dealer-hand,
    .player-cards {
      gap: 20px;
    }
    
    .bet-token-image {
      width: 36px;
      height: 36px;
    }
    
    .bet-amount {
      font-size: 11px;
    }
  }
    
    .center {
      font-size: 24px;
    }
    
    .empty-card-slot {
      width: 70px;
      height: 95px;
      font-size: 28px;
      border-width: 2px;
    }
    
    .dealer-hand,
    .player-cards {
      gap: 12px;
    }
    
    .table-surface {
      padding: 20px;
    }
    
    .bet-token-image {
      width: 24px;
      height: 24px;
    }
    
    .bet-amount {
      font-size: 8px;
    }
  }
`
