import styled, { keyframes, css } from 'styled-components';

// Animations
const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(252, 211, 77, 0.3); }
  50% { box-shadow: 0 0 30px rgba(252, 211, 77, 0.6); }
`;

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
  40%, 43% { transform: translate3d(0, -15px, 0); }
  70% { transform: translate3d(0, -7px, 0); }
  90% { transform: translate3d(0, -2px, 0); }
`;

// Main container
export const Container = styled.div<{ $isCompact: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  width: 100%;
  padding: 20px;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.3) 0%, rgba(15, 23, 42, 0.5) 100%);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 50%, rgba(252, 211, 77, 0.1) 0%, transparent 50%);
    opacity: 0.5;
    pointer-events: none;
  }

  ${({ $isCompact }) => $isCompact && css`
    padding: 16px;
    gap: 16px;
  `}
`;

// Main game area with player vs computer
export const GameArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  min-height: 300px;
  background: linear-gradient(135deg, #7e22ce 0%, #9333ea 25%, #a855f7 50%, #c084fc 75%, #e9d5ff 100%);
  border-radius: 24px;
  border: 3px solid rgba(147, 51, 234, 0.3);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.5),
    inset 0 2px 4px rgba(255, 255, 255, 0.1),
    inset 0 -2px 4px rgba(0, 0, 0, 0.3),
    0 0 30px rgba(147, 51, 234, 0.2);
  padding: 40px 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 8%;
    left: 10%;
    font-size: 90px;
    opacity: 0.08;
    transform: rotate(-15deg);
    pointer-events: none;
    color: #9333ea;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' font-size='50'%3E✂️%3C/text%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    width: 90px;
    height: 90px;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 15%;
    right: 8%;
    font-size: 80px;
    opacity: 0.06;
    transform: rotate(20deg);
    pointer-events: none;
    color: #a855f7;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' font-size='50'%3E🪨%3C/text%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    width: 80px;
    height: 80px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    min-height: 250px;
  }
`;

// Animated choice display
export const AnimatedChoice = styled.div<{ $animate: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.1);
  min-width: 120px;
  min-height: 120px;
  transition: all 0.3s ease;

  ${({ $animate }) => $animate && css`
    animation: ${shake} 0.5s ease-in-out infinite;
  `}

  &:hover {
    border-color: rgba(252, 211, 77, 0.3);
    background: rgba(252, 211, 77, 0.1);
  }
`;

// Choice selection grid
export const ChoiceGrid = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    gap: 12px;
    padding: 16px;
  }
`;

// Individual choice button
export const ChoiceButton = styled.button<{ $selected: boolean; $disabled: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 16px;
  border: 2px solid;
  background: ${({ $selected }) => 
    $selected 
      ? 'linear-gradient(135deg, rgba(252, 211, 77, 0.3) 0%, rgba(245, 158, 11, 0.3) 100%)'
      : 'rgba(0, 0, 0, 0.5)'
  };
  border-color: ${({ $selected }) => 
    $selected 
      ? 'rgba(252, 211, 77, 0.5)' 
      : 'rgba(255, 255, 255, 0.1)'
  };
  color: #fff;
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  opacity: ${({ $disabled }) => $disabled ? 0.6 : 1};
  min-width: 100px;
  min-height: 100px;

  ${({ $selected }) => $selected && css`
    animation: ${glow} 2s ease-in-out infinite;
  `}

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    border-color: rgba(252, 211, 77, 0.7);
    background: linear-gradient(135deg, rgba(252, 211, 77, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    min-width: 80px;
    min-height: 80px;
    padding: 16px;
  }
`;

// VS text with animation
export const VersusText = styled.div<{ $playing: boolean }>`
  font-size: 32px;
  font-weight: 900;
  color: #FCD34D;
  text-shadow: 0 0 20px rgba(252, 211, 77, 0.5);
  letter-spacing: 4px;

  ${({ $playing }) => $playing && css`
    animation: ${bounce} 1s ease-in-out infinite;
    color: #EF4444;
    text-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
  `}

  @media (max-width: 768px) {
    font-size: 24px;
    letter-spacing: 2px;
  }
`;

// Result display area
export const ResultDisplay = styled.div<{ $result: 'win' | 'lose' | 'tie' | null }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 16px;
  border: 2px solid;
  background: ${({ $result }) => {
    switch ($result) {
      case 'win': return 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.3))';
      case 'lose': return 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.3))';
      case 'tie': return 'linear-gradient(135deg, rgba(156, 163, 175, 0.2), rgba(107, 114, 128, 0.3))';
      default: return 'rgba(0, 0, 0, 0.3)';
    }
  }};
  border-color: ${({ $result }) => {
    switch ($result) {
      case 'win': return '#22C55E';
      case 'lose': return '#EF4444';
      case 'tie': return '#9CA3AF';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};

  ${({ $result }) => $result === 'win' && css`
    animation: ${pulse} 1s ease-in-out infinite;
  `}
`;

// Game status bar
export const GameStatus = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  text-align: center;
`;

// Responsive adjustments
export const ResponsiveWrapper = styled.div`
  @media (max-width: 768px) {
    .choice-emoji {
      font-size: 60px !important;
    }
    
    .vs-text {
      font-size: 20px !important;
    }
    
    .status-text {
      font-size: 12px !important;
    }
  }

  @media (max-width: 480px) {
    .choice-emoji {
      font-size: 50px !important;
    }
    
    .choice-button {
      min-width: 70px !important;
      min-height: 70px !important;
      padding: 12px !important;
    }
  }
`;