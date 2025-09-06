import styled, { keyframes, css } from 'styled-components';

// Dice rolling animation
const diceRoll = keyframes`
  0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
  25% { transform: rotateX(90deg) rotateY(180deg) rotateZ(45deg); }
  50% { transform: rotateX(180deg) rotateY(360deg) rotateZ(90deg); }
  75% { transform: rotateX(270deg) rotateY(540deg) rotateZ(135deg); }
  100% { transform: rotateX(360deg) rotateY(720deg) rotateZ(180deg); }
`;

// Glow pulse effect
const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.2); }
  50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.4); }
`;

// Number count animation
const numberCount = keyframes`
  0% { transform: scale(0.8) rotateY(0deg); opacity: 0; }
  50% { transform: scale(1.2) rotateY(180deg); opacity: 1; }
  100% { transform: scale(1) rotateY(360deg); opacity: 1; }
`;

// Main game container with casino atmosphere
export const DiceGameContainer = styled.div`
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 30% 30%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(0, 255, 225, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, rgba(20, 20, 35, 0.95) 0%, rgba(10, 10, 25, 0.98) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 20px;

  // Animated background particles
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(2px 2px at 20px 30px, rgba(255, 215, 0, 0.3), transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(0, 255, 225, 0.3), transparent),
      radial-gradient(1px 1px at 90px 40px, rgba(255, 255, 255, 0.4), transparent),
      radial-gradient(1px 1px at 130px 80px, rgba(255, 215, 0, 0.4), transparent);
    background-repeat: repeat;
    background-size: 150px 100px;
    animation: ${glowPulse} 4s ease-in-out infinite;
    opacity: 0.6;
  }
`;

// 3D Dice container
export const DiceContainer = styled.div<{ isRolling?: boolean }>`
  width: 120px;
  height: 120px;
  perspective: 1000px;
  margin: 40px 0;
  position: relative;
  z-index: 2;

  ${props => props.isRolling && css`
    animation: ${diceRoll} 2s ease-in-out;
  `}
`;

// Individual dice face
export const DiceFace = styled.div<{ face: number; result?: number; visible?: boolean }>`
  position: absolute;
  width: 120px;
  height: 120px;
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  border: 3px solid #333;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: 900;
  color: #333;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.4),
    inset 0 2px 5px rgba(255, 255, 255, 0.3);
  transform-style: preserve-3d;
  
  ${props => {
    const transforms: { [key: number]: string } = {
      1: 'rotateY(0deg) translateZ(60px)',
      2: 'rotateY(90deg) translateZ(60px)',
      3: 'rotateY(180deg) translateZ(60px)',
      4: 'rotateY(-90deg) translateZ(60px)',
      5: 'rotateX(90deg) translateZ(60px)',
      6: 'rotateX(-90deg) translateZ(60px)'
    };
    return css`
      transform: ${transforms[props.face]};
    `
  }}

  ${props => props.visible && css`
    background: linear-gradient(145deg, #ffd700, #ffeb3b);
    border-color: #ff6b6b;
    color: #fff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    animation: ${glowPulse} 1s ease-in-out;
  `}

  // Dice dots pattern
  &::before {
    content: '${props => props.result || props.face}';
    animation: ${props => props.visible ? numberCount : 'none'} 0.8s ease-out;
  }
`;

// Stats panel with neon styling
export const StatsPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 30px 0;
  width: 100%;
  max-width: 600px;
  z-index: 2;
  position: relative;
`;

export const StatCard = styled.div<{ highlight?: boolean }>`
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(20, 20, 35, 0.9) 100%);
  border: 2px solid ${props => props.highlight ? '#ffd700' : 'rgba(255, 215, 0, 0.3)'};
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-2px) scale(1.02);
    border-color: #ffd700;
    box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
  }

  ${props => props.highlight && css`
    animation: ${glowPulse} 2s ease-in-out infinite;
  `}
`;

export const StatValue = styled.div`
  font-size: 28px;
  font-weight: 900;
  color: #ffd700;
  margin-bottom: 8px;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
`;

export const StatLabel = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
`;

// Roll under indicator with arc design
export const RollUnderArc = styled.div`
  width: 300px;
  height: 150px;
  position: relative;
  margin: 20px 0;
  z-index: 2;
`;

export const ArcBackground = styled.div`
  width: 100%;
  height: 100%;
  border: 8px solid rgba(255, 255, 255, 0.1);
  border-bottom: none;
  border-radius: 150px 150px 0 0;
  position: relative;
  overflow: hidden;
`;

export const ArcProgress = styled.div<{ percentage: number }>`
  position: absolute;
  top: -8px;
  left: -8px;
  width: calc(100% + 16px);
  height: calc(100% + 8px);
  border: 8px solid transparent;
  border-bottom: none;
  border-radius: 150px 150px 0 0;
  background: conic-gradient(
    from 180deg,
    #ffd700 0deg,
    #ffd700 ${props => props.percentage * 1.8}deg,
    transparent ${props => props.percentage * 1.8}deg,
    transparent 180deg
  );
  mask: linear-gradient(#000, #000) content-box, linear-gradient(#000, #000);
  mask-composite: subtract;
`;

export const ArcLabel = styled.div`
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #ffd700, #ffeb3b);
  color: #000;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 800;
  font-size: 18px;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
`;

// Result explosion effect
export const ResultExplosion = styled.div<{ show?: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, transparent 70%);
  display: ${props => props.show ? 'block' : 'none'};
  animation: ${props => props.show ? css`${glowPulse} 0.5s ease-out` : 'none'};
  z-index: 1;
`;

// Floating particles effect
export const ParticleEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
`;

// Win/lose result display
export const ResultDisplay = styled.div<{ isWin?: boolean; show?: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(${props => props.show ? 1 : 0});
  background: ${props => props.isWin 
    ? 'linear-gradient(135deg, #4caf50, #81c784)'
    : 'linear-gradient(135deg, #f44336, #e57373)'
  };
  color: white;
  padding: 20px 30px;
  border-radius: 15px;
  font-size: 24px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease;
  z-index: 10;
  
  ${props => props.show && css`
    animation: ${numberCount} 0.6s ease-out;
  `}
`;
