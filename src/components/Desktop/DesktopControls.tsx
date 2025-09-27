import React from 'react';
import styled, { keyframes } from 'styled-components';

// Desktop glow animation for play button
const desktopGlow = keyframes`
  0%, 100% { box-shadow: 0 0 8px #ffd700, 0 0 16px #ffd700; }
  50% { box-shadow: 0 0 24px #ffd700, 0 0 36px #ff0066, 0 0 48px #ff0066; }
`;

const desktopPulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Desktop controls wrapper (hidden on mobile)
const DesktopControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  
  @media (max-width: 800px) {
    display: none;
  }
`;

// Desktop play button
const DesktopPlayButton = styled.button`
  padding: 12px 24px;
  background: linear-gradient(145deg, 
    #ff0066 0%, 
    #ff3385 30%, 
    #ffd700 100%
  );
  border: 2px solid #ffd700;
  color: #fff;
  font-weight: 800;
  font-size: 14px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 
    0 4px 16px rgba(255, 215, 0, 0.3),
    0 2px 8px rgba(255, 0, 102, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
  min-width: 80px;

  /* Shine effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.5s ease;
    z-index: 1;
  }

  /* Text content above shine */
  & > * {
    position: relative;
    z-index: 2;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 
      0 6px 24px rgba(255, 215, 0, 0.5),
      0 4px 12px rgba(255, 0, 102, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    border-color: #ffe066;
    animation: ${desktopPulse} 1.5s infinite;

    &::before {
      left: 100%;
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(0) scale(1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    animation: none;
  }
`;

// Component interfaces
interface DesktopControlsProps {
  children?: React.ReactNode;
  onPlay?: () => void;
  playDisabled?: boolean;
  playText?: string;
  hidePlayButton?: boolean;
}

// Desktop wrapper component with integrated play button
export const DesktopControls: React.FC<DesktopControlsProps> = ({ 
  children, 
  onPlay,
  playDisabled = false,
  playText = "Play",
  hidePlayButton = false
}) => {
  const handlePlayClick = () => {
    if (onPlay) {
      onPlay();
    }
  };

  return (
    <DesktopControlsWrapper>
      {children}
      {!hidePlayButton && onPlay && (
        <DesktopPlayButton onClick={handlePlayClick} disabled={playDisabled}>
          {playText}
        </DesktopPlayButton>
      )}
    </DesktopControlsWrapper>
  );
};

export default DesktopControls;