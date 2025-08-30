import styled, { keyframes } from 'styled-components'

const jackpotGradient = keyframes`
  0% {
    background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.4);
  }
  15% {
    background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%);
    box-shadow: 0 0 20px rgba(240, 147, 251, 0.4);
  }
  30% {
    background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
    box-shadow: 0 0 20px rgba(79, 172, 254, 0.4);
  }
  45% {
    background: linear-gradient(45deg, #43e97b 0%, #38f9d7 100%);
    box-shadow: 0 0 20px rgba(67, 233, 123, 0.4);
  }
  60% {
    background: linear-gradient(45deg, #fa709a 0%, #fee140 100%);
    box-shadow: 0 0 20px rgba(250, 112, 154, 0.4);
  }
  75% {
    background: linear-gradient(45deg, #a8edea 0%, #fed6e3 100%);
    box-shadow: 0 0 20px rgba(168, 237, 234, 0.4);
  }
  90% {
    background: linear-gradient(45deg, #ff9a9e 0%, #fecfef 100%);
    box-shadow: 0 0 20px rgba(255, 154, 158, 0.4);
  }
  100% {
    background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.4);
  }
`

const skeletonAnimation = keyframes`
  0%, 100% {
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 100%);
    transform: translateX(-100%);
  }
  50% {
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 100%);
    transform: translateX(0%);
  }
`

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.3), 0 0 10px rgba(255, 215, 0, 0.2), 0 0 15px rgba(255, 215, 0, 0.1);
  }
  50% {
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3), 0 0 30px rgba(255, 215, 0, 0.2);
  }
`

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, rgba(15, 18, 27, 0.95) 0%, rgba(24, 24, 24, 0.95) 100%);
  border-radius: 20px;
  border: 1px solid rgba(255, 215, 0, 0.1);
  backdrop-filter: blur(20px);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
`

export const Profit = styled.div<{$win: boolean}>`
  display: flex;
  gap: 6px;
  align-items: center;
  background: ${props => props.$win
    ? 'linear-gradient(135deg, rgba(0, 255, 64, 0.15) 0%, rgba(0, 255, 128, 0.1) 100%)'
    : 'linear-gradient(135deg, rgba(255, 64, 64, 0.15) 0%, rgba(255, 128, 128, 0.1) 100%)'
  };
  border: 1px solid ${props => props.$win ? 'rgba(0, 255, 64, 0.3)' : 'rgba(255, 64, 64, 0.3)'};
  border-radius: 12px;
  padding: 6px 10px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px ${props => props.$win ? 'rgba(0, 255, 64, 0.2)' : 'rgba(255, 64, 64, 0.2)'};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.$win ? 'rgba(0, 255, 64, 0.3)' : 'rgba(255, 64, 64, 0.3)'};
  }
`

export const Jackpot = styled.div`
  animation: ${jackpotGradient} 2s linear 0s infinite;
  display: flex;
  gap: 6px;
  align-items: center;
  color: white;
  border-radius: 12px;
  padding: 4px 8px;
  font-weight: 700;
  font-size: 0.85rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
`

export const Recent = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  text-wrap: nowrap;
  padding: 16px 20px;
  color: unset;
  text-decoration: none;
  justify-content: space-between;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(24, 24, 24, 0.8) 0%, rgba(15, 18, 27, 0.8) 100%);
  border: 1px solid rgba(255, 215, 0, 0.08);
  backdrop-filter: blur(15px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
    transition: left 0.5s;
  }

  &:hover {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(24, 24, 24, 0.9) 100%);
    border-color: rgba(255, 215, 0, 0.2);
    transform: translateY(-2px);
    box-shadow:
      0 8px 25px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(255, 215, 0, 0.1),
      0 0 20px rgba(255, 215, 0, 0.05);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
    transition: all 0.1s;
  }
`

export const Skeleton = styled.div`
  height: 56px;
  width: 100%;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(24, 24, 24, 0.6) 0%, rgba(15, 18, 27, 0.6) 100%);
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    animation: ${skeletonAnimation} 2s infinite;
  }
`
