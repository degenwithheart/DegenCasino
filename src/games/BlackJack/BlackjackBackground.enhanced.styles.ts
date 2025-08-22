import styled, { keyframes } from 'styled-components'

const smokeAnimation = keyframes`
  0% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 0.1;
  }
  50% {
    transform: translate(-20px, -100px) rotate(10deg);
    opacity: 0.3;
  }
  100% {
    transform: translate(-40px, -200px) rotate(20deg);
    opacity: 0;
  }
`

const cardDealAnimation = keyframes`
  0% {
    transform: translateY(-100px) scale(0.8) rotateY(180deg);
    opacity: 0;
  }
  50% {
    transform: translateY(-20px) scale(0.9) rotateY(90deg);
    opacity: 0.7;
  }
  100% {
    transform: translateY(0) scale(1) rotateY(0deg);
    opacity: 1;
  }
`

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(255, 215, 0, 0.6);
  }
`

const betTokenSlide = keyframes`
  0% {
    transform: translateY(-100px) scale(0.5);
    opacity: 0;
  }
  50% {
    transform: translateY(-20px) scale(0.8);
    opacity: 0.8;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
`

const betTokenGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 40px rgba(255, 215, 0, 0.8);
  }
`

const tensionFlicker = keyframes`
  0%, 100% {
    opacity: 0.8;
  }
  25% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.9;
  }
  75% {
    opacity: 0.7;
  }
`

export const StyledBlackjackBackground = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: radial-gradient(circle at center, #0d4d3d 0%, #051f1a 40%, #000 100%);
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(139, 69, 19, 0.1) 0%, transparent 50%),
    linear-gradient(45deg, transparent 49%, rgba(255, 215, 0, 0.02) 50%, transparent 51%);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,215,0,0.1)"/></svg>') repeat;
    background-size: 50px 50px;
    opacity: 0.3;
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
      animation: ${smokeAnimation} 8s infinite linear;
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
    animation: ${tensionFlicker} 2s infinite;
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
    padding: 10px;
    font-family: 'Georgia', serif;
    overflow: hidden;
  }

  .table-header {
    text-align: center;
    margin-bottom: 20px;
    padding: 15px;
    background: linear-gradient(135deg, rgba(139, 69, 19, 0.3) 0%, rgba(101, 67, 33, 0.3) 100%);
    border: 2px solid rgba(255, 215, 0, 0.3);
    border-radius: 15px;
    backdrop-filter: blur(5px);
  }

  .table-rules {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .rule-text {
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    
    &.main {
      font-size: 18px;
      color: #FFD700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    &.sub {
      font-size: 12px;
      color: #FFFFFF;
      opacity: 0.9;
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
    gap: 10px;
    margin-bottom: 15px;
    padding: 8px 20px;
    background: linear-gradient(135deg, rgba(139, 69, 19, 0.4) 0%, rgba(101, 67, 33, 0.4) 100%);
    border: 1px solid rgba(255, 215, 0, 0.3);
    border-radius: 25px;
    color: #FFD700;
    font-weight: bold;
    font-size: 16px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(3px);
  }

  .dealer-icon,
  .player-icon {
    font-size: 20px;
  }

  .dealer-score,
  .player-score {
    margin-left: 10px;
    padding: 4px 12px;
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 215, 0, 0.3);
    border-radius: 15px;
    color: #FFFFFF;
    font-weight: bold;
    min-width: 30px;
    text-align: center;
    
    .bust {
      color: #ff4444;
      animation: ${pulseGlow} 1s infinite;
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
    justify-content: space-around;
    background: radial-gradient(ellipse at center, rgba(0, 100, 50, 0.4) 0%, rgba(0, 80, 40, 0.3) 70%, transparent 100%);
    border: 3px solid rgba(255, 215, 0, 0.4);
    border-radius: 30px;
    padding: 30px 50px;
    margin: 10px 0;
    position: relative;
    backdrop-filter: blur(2px);
    min-height: 300px;
  }

  .betting-areas {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 40px;
    margin: 20px 0;
  }

  .bet-circle {
    width: 100px;
    height: 100px;
    border: 3px solid #FFD700;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle, rgba(139, 69, 19, 0.6) 0%, rgba(101, 67, 33, 0.8) 100%);
    box-shadow: 
      0 0 25px rgba(255, 215, 0, 0.4),
      inset 0 2px 4px rgba(255, 215, 0, 0.2);
  }

  .bet-circle-inner {
    text-align: center;
    color: #FFD700;
    font-weight: bold;
    font-size: 14px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    transition: all 0.5s ease-in-out;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
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
    animation: ${betTokenSlide} 0.8s ease-out;
  }

  .bet-token-image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #FFD700;
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
    animation: ${betTokenGlow} 2s infinite;
  }

  .bet-amount {
    font-size: 12px;
    font-weight: bold;
    color: #FFD700;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    white-space: nowrap;
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
    min-height: 220px;
    flex: 1;
    justify-content: center;
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
    width: 100px;
    height: 140px;
    border: 3px dashed rgba(255, 215, 0, 0.3);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.2);
    font-size: 40px;
    color: rgba(255, 215, 0, 0.4);
  }

  .casino-card {
    animation: ${cardDealAnimation} 0.8s ease-out;
    transform-origin: center;
  }

  .playing-card {
    width: 100px;
    height: 140px;
    background: linear-gradient(135deg, #FFFFFF 0%, #F8F8F8 100%);
    border: 3px solid #333;
    border-radius: 12px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
    font-family: 'Georgia', serif;
    font-weight: bold;
    cursor: default;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
    }
    
    &.dealer-card {
      border-color: #8B4513;
    }
    
    &.player-card {
      border-color: #006400;
    }
  }

  .card-rank,
  .card-suit {
    font-size: 18px;
    font-weight: bold;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
    line-height: 1;
  }

  .card-corner {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .top-left {
    top: 8px;
    left: 8px;
  }

  .bottom-right {
    bottom: 8px;
    right: 8px;
    transform: rotate(180deg);
  }

  .center {
    font-size: 32px;
    opacity: 0.7;
  }

  .game-status {
    margin-top: 20px;
    text-align: center;
  }

  .result-banner {
    padding: 15px 25px;
    border-radius: 15px;
    backdrop-filter: blur(5px);
    border: 2px solid;
    
    &.win {
      background: linear-gradient(135deg, rgba(0, 255, 0, 0.2) 0%, rgba(0, 200, 0, 0.3) 100%);
      border-color: #00FF00;
      color: #00FF00;
      animation: ${pulseGlow} 2s infinite;
    }
    
    &.lose {
      background: linear-gradient(135deg, rgba(255, 0, 0, 0.2) 0%, rgba(200, 0, 0, 0.3) 100%);
      border-color: #FF4444;
      color: #FF4444;
    }
  }

  .result-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    font-weight: bold;
    font-size: 18px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  }

  .result-icon {
    font-size: 24px;
  }

  .result-text {
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .result-amount {
    color: #FFD700;
  }

  .waiting-banner {
    padding: 15px 25px;
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 165, 0, 0.3) 100%);
    border: 2px solid rgba(255, 215, 0, 0.5);
    border-radius: 15px;
    color: #FFD700;
    font-weight: bold;
    font-size: 16px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(3px);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .waiting-icon {
    font-size: 20px;
    animation: ${tensionFlicker} 1.5s infinite;
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
      width: 110px;
      height: 150px;
    }
    
    .empty-card-slot {
      width: 110px;
      height: 150px;
      font-size: 45px;
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
  @media (max-width: 768px) {
    .casino-table {
      padding: 10px;
      min-height: 500px;
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
      width: 85px;
      height: 120px;
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
      width: 85px;
      height: 120px;
      font-size: 32px;
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

  @media (max-width: 480px) {
    .casino-table {
      padding: 8px;
    }
    
    .playing-card {
      width: 70px;
      height: 95px;
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
