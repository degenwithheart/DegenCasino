// src/components/LeaderboardsModal.styles.ts
import styled, { css, keyframes } from 'styled-components'

// Keyframe animations matching casino style
const neonPulse = keyframes`
  0% { 
    box-shadow: 0 0 24px #a259ff88, 0 0 48px #ffd70044;
    border-color: #ffd70044;
  }
  100% { 
    box-shadow: 0 0 48px #ffd700cc, 0 0 96px #a259ff88;
    border-color: #ffd700aa;
  }
`;

const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  width: 100%;
  max-width: 480px;
  margin: auto;
  max-height: calc(90vh - 4rem);
  overflow-y: auto;
  position: relative;

  /* Enhanced glassmorphism */
  background: rgba(24, 24, 24, 0.8);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.4);
  
  /* Casino gradient border effect */
  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(45deg, #ffd700, #a259ff, #ff00cc, #ffd700);
    background-size: 300% 100%;
    border-radius: 20px;
    opacity: 0.3;
    z-index: -1;
    animation: ${moveGradient} 4s linear infinite;
  }
  
  /* Inner glow effect */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 20px;
    background: 
      radial-gradient(circle at 30% 20%, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 70% 80%, rgba(162, 89, 255, 0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
  
  > * {
    position: relative;
    z-index: 1;
  }

  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, #ffd700, #a259ff);
    border-radius: 4px;
    box-shadow: 0 0 8px rgba(255, 215, 0, 0.3);
  }
  &::-webkit-scrollbar-track { 
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  @media (max-width: 600px) {
    padding: 0.75rem 0.5rem;
    max-width: 98vw;
    max-height: calc(98vh - 1rem);
    font-size: 0.98rem;
    border-radius: 12px;
  }
`

export const HeaderSection = styled.div`
  text-align: center;
  position: relative;
`

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 0.5rem;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  text-shadow: 0 0 12px #ffd700, 0 0 24px #a259ff;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &::before {
    content: '🏆';
    font-size: 1.2em;
    filter: drop-shadow(0 0 8px #ffd700);
    animation: ${sparkle} 2s infinite;
  }
`

export const Subtitle = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-weight: 500;
`

export const TabRow = styled.div`
  display: flex;
  gap: 8px;
  background: rgba(24, 24, 24, 0.6);
  border-radius: 16px;
  padding: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin: 1rem 0 1.5rem;
  backdrop-filter: blur(15px);
`

export const TabButton = styled.button<{ $selected: boolean }>`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: ${({ $selected }) => 
    $selected 
      ? 'linear-gradient(90deg, #ffd700, #a259ff)' 
      : 'rgba(24, 24, 24, 0.6)'
  };
  color: ${({ $selected }) => ($selected ? '#222' : '#ffffff')};
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover:not(:disabled) {
    ${({ $selected }) => !$selected && css`
      background: rgba(255, 215, 0, 0.1);
      color: #ffd700;
      transform: scale(1.02);
    `}
  }

  ${({ $selected }) => $selected && css`
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
    animation: ${neonPulse} 2s infinite alternate;
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const LeaderboardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const ListHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  color: #ffd700;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
  border-bottom: 2px solid rgba(255, 215, 0, 0.3);
  margin-bottom: 0.75rem;
  background: rgba(255, 215, 0, 0.05);
  border-radius: 12px;
`

export const HeaderRank = styled.div`flex: 0 0 60px; text-align: center;`
export const HeaderPlayer = styled.div`flex: 1; padding-left: 0.5rem;`
export const HeaderVolume = styled.div`flex: 0 0 120px; text-align: right;`

export const RankItem = styled.div<{ $isTop3?: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem;
  background: rgba(24, 24, 24, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  transition: all 0.3s ease;
  backdrop-filter: blur(15px);
  position: relative;

  &:hover {
    background: rgba(255, 215, 0, 0.1);
    border-color: rgba(255, 215, 0, 0.3);
    transform: scale(1.02);
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.2);
  }

  ${({ $isTop3 }) => $isTop3 && css`
    border-color: rgba(255, 215, 0, 0.4);
    background: rgba(255, 215, 0, 0.05);
    box-shadow: 0 0 16px rgba(255, 215, 0, 0.2);
  `}
`

export const RankNumber = styled.div<{ rank: number }>`
  flex: 0 0 60px;
  font-weight: 700;
  font-size: 1.1rem;
  color: #fff;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ rank }) => rank === 1 && css`
    &:before { content: '🥇'; margin-right: 0.5em; font-size: 1.3em; }
    color: #ffd700;
    text-shadow: 0 0 12px rgba(255, 215, 0, 0.6);
    font-size: 1.2rem;
  `}
  ${({ rank }) => rank === 2 && css`
    &:before { content: '🥈'; margin-right: 0.5em; font-size: 1.3em; }
    color: #c0c0c0;
    text-shadow: 0 0 12px rgba(192, 192, 192, 0.5);
    font-size: 1.1rem;
  `}
  ${({ rank }) => rank === 3 && css`
    &:before { content: '🥉'; margin-right: 0.5em; font-size: 1.3em; }
    color: #cd7f32;
    text-shadow: 0 0 12px rgba(205, 127, 50, 0.5);
    font-size: 1.1rem;
  `}
`

export const PlayerInfo = styled.div`
  flex: 1;
  padding-left: 0.75rem;
  font-size: 1rem;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
`

export const VolumeAmount = styled.div`
  flex: 0 0 120px;
  text-align: right;
  font-size: 1rem;
  font-weight: 700;
  color: #00ff88;
  text-shadow: 0 0 8px rgba(0, 255, 136, 0.5);
`

export const LoadingText = styled.p`
  text-align: center;
  color: #ffd700;
  padding: 3rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
  
  &::before {
    content: '⏳';
    margin-right: 0.5rem;
    font-size: 1.5rem;
    animation: ${sparkle} 1.5s infinite;
  }
`

export const ErrorText = styled.p`
  text-align: center;
  color: #ff6b6b;
  padding: 3rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  text-shadow: 0 0 8px rgba(255, 107, 107, 0.5);
  
  &::before {
    content: '⚠️';
    margin-right: 0.5rem;
    font-size: 1.5rem;
  }
`

export const EmptyStateText = styled.div`
  text-align: center;
  padding: 3rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
  font-weight: 500;
  
  &::before {
    content: '🚀';
    display: block;
    font-size: 2rem;
    margin-bottom: 1rem;
    animation: ${sparkle} 2s infinite;
  }
`

export const formatVolume = (v: number): string =>
  typeof v !== 'number' || isNaN(v)
    ? '$NaN'
    : v.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
