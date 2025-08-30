// src/components/LeaderboardsModal.styles.ts
import styled, { keyframes, css } from 'styled-components';

// Keyframe animations matching casino style
const neonPulse = keyframes`
  0% { 
    box-shadow: 0 0 24px rgba(111, 250, 255, 0.4), 0 0 48px rgba(162, 89, 255, 0.2);
    border-color: rgba(111, 250, 255, 0.4);
  }
  100% { 
    box-shadow: 0 0 48px rgba(111, 250, 255, 0.6), 0 0 96px rgba(162, 89, 255, 0.4);
    border-color: rgba(111, 250, 255, 0.6);
  }
`;

const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: rotate(0deg) scale(0.8); }
  50% { opacity: 1; transform: rotate(180deg) scale(1.2); }
`;

export const ModalContent = styled.div<{ $theme?: any }>`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  max-width: 480px;
  margin: auto;
  max-height: calc(90vh - 4rem);
  overflow-y: auto;
  position: relative;
  background: rgba(20, 30, 60, 0.92);
  border: 2px solid rgba(111, 250, 255, 0.3);
  border-radius: 18px;
  box-shadow: 0 0 32px rgba(111, 250, 255, 0.2);
  color: #eaf6fb;
  font-family: 'JetBrains Mono', 'Orbitron', monospace;

  /* Quantum portal effects */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 20%, rgba(111, 250, 255, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(162, 89, 255, 0.08) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
    border-radius: 18px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #6ffaff, #a259ff, #6ffaff);
    background-size: 300% 100%;
    animation: ${moveGradient} 4s linear infinite;
    border-radius: 18px 18px 0 0;
    z-index: 1;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  &::-webkit-scrollbar { 
    width: 8px; 
  }
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, #6ffaff, #a259ff);
    border-radius: 4px;
    box-shadow: 0 0 8px rgba(111, 250, 255, 0.3);
  }
  &::-webkit-scrollbar-track { 
    background: rgba(20, 30, 60, 0.6);
    border-radius: 4px;
  }

  @media (max-width: 600px) {
    padding: 0.75rem 0.5rem;
    max-width: calc(100vw - 2rem);
    max-height: calc(98vh - 1rem);
    font-size: 0.98rem;
    border-radius: 12px;
  }
`

export const HeaderSection = styled.div`
  text-align: center;
  position: relative;

  &::before {
    content: '⚛️';
    position: absolute;
    top: -15px;
    right: 15%;
    font-size: 2.5rem;
    animation: ${sparkle} 4s infinite;
    filter: drop-shadow(0 0 8px #6ffaff);
  }
`

export const Title = styled.h1<{ $theme?: any }>`
  color: #6ffaff;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  letter-spacing: 0.15em;
  text-shadow: 0 0 16px #6ffaffcc, 0 0 4px #fff;
  font-family: 'Orbitron', 'JetBrains Mono', monospace;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &::before {
    content: '🏆';
    font-size: 1.2em;
    filter: drop-shadow(0 0 8px #6ffaff);
    animation: ${sparkle} 2s infinite;
  }
`

export const Subtitle = styled.p<{ $theme?: any }>`
  color: #a259ff;
  font-size: 1rem;
  margin: 0;
  font-weight: 500;
  font-family: 'JetBrains Mono', monospace;
  text-shadow: 0 0 8px #a259ff88;
`

export const TabRow = styled.div<{ $theme?: any }>`
  display: flex;
  gap: 8px;
  background: rgba(20, 30, 60, 0.6);
  border-radius: 16px;
  padding: 6px;
  border: 1px solid rgba(111, 250, 255, 0.2);
  margin: 1rem 0 1.5rem;
  backdrop-filter: blur(15px);
  box-shadow: 0 0 16px rgba(111, 250, 255, 0.1);
`

export const TabButton = styled.button<{ $selected: boolean; $theme?: any }>`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: ${({ $selected }) => 
    $selected 
      ? 'linear-gradient(90deg, #6ffaff, #a259ff)' 
      : 'rgba(20, 30, 60, 0.6)'
  };
  color: ${({ $selected }) => ($selected ? '#1a1a2e' : '#eaf6fb')};
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  font-family: 'JetBrains Mono', monospace;

  &:hover:not(:disabled) {
    ${({ $selected }) => !$selected && css`
      background: rgba(111, 250, 255, 0.1);
      color: #6ffaff;
      transform: scale(1.02);
    `}
  }

  ${({ $selected }) => $selected && css`
    box-shadow: 0 0 20px rgba(111, 250, 255, 0.3);
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

export const ListHeader = styled.div<{ $theme?: any }>`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  color: #6ffaff;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
  border-bottom: 2px solid rgba(111, 250, 255, 0.3);
  margin-bottom: 0.75rem;
  background: rgba(111, 250, 255, 0.05);
  border-radius: 12px;
  font-family: 'JetBrains Mono', monospace;
  text-shadow: 0 0 8px #6ffaff88;
`

export const HeaderRank = styled.div`flex: 0 0 60px; text-align: center;`
export const HeaderPlayer = styled.div`flex: 1; padding-left: 0.5rem;`
export const HeaderVolume = styled.div`flex: 0 0 120px; text-align: right;`

export const RankItem = styled.div<{ $isTop3?: boolean; $theme?: any }>`
  display: flex;
  align-items: center;
  padding: 1rem;
  background: rgba(20, 30, 60, 0.6);
  border: 2px solid rgba(111, 250, 255, 0.2);
  border-radius: 16px;
  transition: all 0.3s ease;
  backdrop-filter: blur(15px);
  position: relative;
  font-family: 'JetBrains Mono', monospace;

  &:hover {
    background: rgba(111, 250, 255, 0.1);
    border-color: rgba(111, 250, 255, 0.4);
    transform: scale(1.02);
    box-shadow: 0 0 20px rgba(111, 250, 255, 0.2);
  }

  ${({ $isTop3 }) => $isTop3 && css`
    border-color: rgba(111, 250, 255, 0.4);
    background: rgba(111, 250, 255, 0.05);
    box-shadow: 0 0 16px rgba(111, 250, 255, 0.2);
  `}
`

export const RankNumber = styled.div<{ rank: number; $theme?: any }>`
  flex: 0 0 60px;
  font-weight: 700;
  font-size: 1.1rem;
  color: #eaf6fb;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono', monospace;

  ${({ rank }) => rank === 1 && css`
    &:before { content: '🥇'; margin-right: 0.5em; font-size: 1.3em; }
    color: #6ffaff;
    text-shadow: 0 0 12px rgba(111, 250, 255, 0.6);
    font-size: 1.2rem;
  `}
  ${({ rank }) => rank === 2 && css`
    &:before { content: '🥈'; margin-right: 0.5em; font-size: 1.3em; }
    color: #a259ff;
    text-shadow: 0 0 12px rgba(162, 89, 255, 0.5);
    font-size: 1.1rem;
  `}
  ${({ rank }) => rank === 3 && css`
    &:before { content: '🥉'; margin-right: 0.5em; font-size: 1.3em; }
    color: #ff9500;
    text-shadow: 0 0 12px rgba(255, 149, 0, 0.5);
    font-size: 1.1rem;
  `}
`

export const PlayerInfo = styled.div<{ $theme?: any }>`
  flex: 1;
  padding-left: 0.75rem;
  font-size: 1rem;
  color: #eaf6fb;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  text-shadow: 0 0 8px rgba(234, 246, 251, 0.3);
  font-family: 'JetBrains Mono', monospace;
`

export const VolumeAmount = styled.div<{ $theme?: any }>`
  flex: 0 0 120px;
  text-align: right;
  font-size: 1rem;
  font-weight: 700;
  color: #6ffaff;
  text-shadow: 0 0 8px rgba(111, 250, 255, 0.5);
  font-family: 'JetBrains Mono', monospace;
`

export const LoadingText = styled.p<{ $theme?: any }>`
  text-align: center;
  color: #6ffaff;
  padding: 3rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  text-shadow: 0 0 8px rgba(111, 250, 255, 0.5);
  font-family: 'JetBrains Mono', monospace;

  &::before {
    content: '⏳';
    margin-right: 0.5rem;
    font-size: 1.5rem;
    animation: ${sparkle} 1.5s infinite;
  }
`

export const ErrorText = styled.p<{ $theme?: any }>`
  text-align: center;
  color: #ef4444;
  padding: 3rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  text-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
  font-family: 'JetBrains Mono', monospace;
`

export const EmptyStateText = styled.p<{ $theme?: any }>`
  text-align: center;
  color: #a259ff;
  padding: 3rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  text-shadow: 0 0 8px rgba(162, 89, 255, 0.5);
  font-family: 'JetBrains Mono', monospace;
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
