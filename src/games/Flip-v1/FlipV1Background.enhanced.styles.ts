import styled, { keyframes } from 'styled-components'

// Flip-v1 multiplayer background styles

const silverPulse = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
`

const duelGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(192, 192, 192, 0.3); }
  50% { box-shadow: 0 0 40px rgba(192, 192, 192, 0.6); }
`

const whisperFloat = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
  33% { transform: translateY(-10px) rotate(2deg); opacity: 0.4; }
  66% { transform: translateY(-5px) rotate(-1deg); opacity: 0.3; }
`

const destinyShimmer = keyframes`
  0% { background-position: -100% 0; }
  100% { background-position: 100% 0; }
`

export const StyledFlipV1Background = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: radial-gradient(ellipse at center, 
    rgba(25, 25, 35, 0.95) 0%, 
    rgba(15, 15, 25, 0.98) 60%, 
    rgba(5, 5, 15, 1) 100%);

  /* Multiplayer duel background elements */
  .duel-bg-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    
    &::before {
      content: '';
      position: absolute;
      top: 20%;
      left: 10%;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(192, 192, 192, 0.1) 0%, transparent 70%);
      border-radius: 50%;
      animation: ${silverPulse} 4s ease-in-out infinite;
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 60%;
      right: 15%;
      width: 150px;
      height: 150px;
      background: radial-gradient(circle, rgba(255, 215, 0, 0.08) 0%, transparent 70%);
      border-radius: 50%;
      animation: ${silverPulse} 3.5s ease-in-out infinite reverse;
    }
  }

  /* Silver whispers overlay for multiplayer tension */
  .silver-whispers-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2;
    
    &::before {
      content: '';
      position: absolute;
      top: 30%;
      left: 20%;
      width: 3px;
      height: 60px;
      background: linear-gradient(to bottom, 
        rgba(192, 192, 192, 0.4), 
        rgba(192, 192, 192, 0.1), 
        transparent);
      animation: ${whisperFloat} 6s ease-in-out infinite;
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      right: 25%;
      width: 2px;
      height: 40px;
      background: linear-gradient(to bottom, 
        rgba(255, 215, 0, 0.3), 
        rgba(255, 215, 0, 0.1), 
        transparent);
      animation: ${whisperFloat} 5s ease-in-out infinite reverse;
    }
  }

  /* Destiny duel indicator for 1v1 feel */
  .destiny-duel-indicator {
    position: absolute;
    bottom: 10%;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    height: 4px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(192, 192, 192, 0.3) 25%, 
      rgba(255, 215, 0, 0.4) 50%, 
      rgba(192, 192, 192, 0.3) 75%, 
      transparent 100%);
    background-size: 200% 100%;
    animation: ${destinyShimmer} 3s linear infinite;
    pointer-events: none;
    z-index: 2;
  }

  /* Enhanced header styling */
  .flip-header {
    background: rgba(0, 0, 0, 0.7);
    border-radius: 12px;
    padding: 16px 24px;
    border: 1px solid rgba(192, 192, 192, 0.2);
    animation: ${duelGlow} 4s ease-in-out infinite;
    backdrop-filter: blur(10px);
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .flip-header {
      padding: 12px 16px;
      
      h2 {
        font-size: 20px !important;
      }
      
      p {
        font-size: 12px !important;
      }
    }
    
    .duel-bg-elements {
      &::before {
        width: 150px;
        height: 150px;
      }
      
      &::after {
        width: 100px;
        height: 100px;
      }
    }
    
    .destiny-duel-indicator {
      width: 200px;
    }
  }
`
