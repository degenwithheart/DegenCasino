import React from 'react';
import styled, { css, keyframes } from 'styled-components';

const gallop = keyframes`
  0% { transform: translateY(0) scaleX(1); }
  20% { transform: translateY(-8px) scaleX(1.05); }
  40% { transform: translateY(2px) scaleX(0.98); }
  60% { transform: translateY(-4px) scaleX(1.03); }
  80% { transform: translateY(1px) scaleX(0.97); }
  100% { transform: translateY(0) scaleX(1); }
`;

const winnerGlow = css`
  box-shadow: 0 0 32px 8px #ffe066, 0 2px 8px #0008;
  border: 3px solid #ffe066;
`;

const HorseSprite = styled.div<{
  color: string;
  left: number;
  top: number;
  stumbled: boolean;
  isWinner?: boolean;
}>`
  position: absolute;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}%;
  width: 72px;
  height: 72px;
  background: ${({ color }) => color};
  border-radius: 18px 18px 16px 16px;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px #0008;
  transition: left 0.08s linear, filter 0.2s, box-shadow 0.3s;
  filter: ${({ stumbled }) => (stumbled ? 'brightness(0.5) blur(2px)' : 'none')};
  display: flex;
  align-items: flex-end;
  justify-content: center;
  font-size: 2.5rem;
  z-index: 2;
  ${({ isWinner }) => isWinner && winnerGlow}
  animation: ${gallop} 0.7s infinite linear;
  opacity: ${({ stumbled }) => (stumbled ? 0.7 : 1)};
`;


export interface HorseProps {
  name: string;
  color: string;
  left: number; // 0-100
  top: number; // px offset for vertical stacking
  stumbled: boolean;
  isWinner?: boolean;
}

const Shadow = styled.div`
  position: absolute;
  left: 50%;
  bottom: 8px;
  width: 40px;
  height: 12px;
  background: radial-gradient(ellipse at center, #0006 60%, transparent 100%);
  border-radius: 50%;
  transform: translateX(-50%) scaleY(0.7);
  z-index: 1;
`;

export const Horse: React.FC<HorseProps> = ({ name, color, left, top, stumbled, isWinner }) => (
  <HorseSprite color={color} left={left} top={top} stumbled={stumbled}>
    <span style={{ position: 'relative', zIndex: 2 }}>
      {isWinner ? '🏆' : ''}🐎
    </span>
    <Shadow />
    <span
      style={{
        position: 'absolute',
        bottom: -28,
        left: '50%',
        transform: 'translateX(-50%)',
        color: isWinner ? '#ffe066' : '#fff',
        fontWeight: 'bold',
        fontSize: 17,
        textShadow: '0 0 6px #000, 0 0 2px #ffe066',
        letterSpacing: 0.5,
        zIndex: 3,
      }}
    >
      {name}
    </span>
  </HorseSprite>
);
