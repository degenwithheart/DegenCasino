import React, { useState, useRef, useEffect } from 'react';
import { GambaUi, useCurrentToken } from 'gamba-react-ui-v2';
import styled, { keyframes, css } from 'styled-components';
import { tokenPriceService } from '../../services/TokenPriceService';
import PriceIndicator from "../UI/PriceIndicator";

// Romantic animations for the mobile experience
const romanticPulse = keyframes`
  0%, 100% { 
    transform: scale(1);
    box-shadow: 
      0 0 20px rgba(212, 165, 116, 0.4),
      0 8px 32px rgba(10, 5, 17, 0.3);
  }
  50% { 
    transform: scale(1.02);
    box-shadow: 
      0 0 32px rgba(212, 165, 116, 0.6),
      0 12px 48px rgba(10, 5, 17, 0.5);
  }
`;

const loveLetterFloat = keyframes`
  0% { 
    background-position: -200px 0; 
    opacity: 0.3;
  }
  50% {
    opacity: 0.7;
  }
  100% { 
    background-position: calc(200px + 100%) 0;
    opacity: 0.3;
  }
`;

const candlestickSparkle = keyframes`
  0%, 100% { 
    box-shadow: 
      0 0 15px rgba(212, 165, 116, 0.3),
      0 0 30px rgba(184, 51, 106, 0.2),
      inset 0 0 20px rgba(139, 90, 158, 0.1);
  }
  50% { 
    box-shadow: 
      0 0 25px rgba(212, 165, 116, 0.5),
      0 0 50px rgba(184, 51, 106, 0.3),
      inset 0 0 30px rgba(139, 90, 158, 0.2);
  }
`;

const dreamlikeFadeInOut = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const fadeOut = keyframes`
  0% { opacity: 0; }
  100% { opacity: 0; }
`;

const popupSlideIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const popupSlideOut = keyframes`
  0% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  100% {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 
      inset 0 2px 8px rgba(0, 0, 0, 0.3),
      0 0 0 3px rgba(255, 215, 0, 0.3);
  }
  50% {
    box-shadow: 
      inset 0 2px 8px rgba(0, 0, 0, 0.3),
      0 0 0 3px rgba(255, 215, 0, 0.5);
  }
`;

// Main mobile controls container - romantic degen aesthetic
const MobileControlsWrapper = styled.div`
  display: none;
  @media (max-width: 800px) {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 20px;
    background: linear-gradient(135deg, 
      rgba(10, 5, 17, 0.95) 0%, 
      rgba(139, 90, 158, 0.15) 30%,
      rgba(184, 51, 106, 0.08) 70%,
      rgba(10, 5, 17, 0.95) 100%
    );
    border: 1px solid rgba(212, 165, 116, 0.3);
    border-radius: 24px;
    backdrop-filter: blur(20px) saturate(1.3);
    box-shadow: 
      0 8px 32px rgba(10, 5, 17, 0.6),
      inset 0 1px 0 rgba(212, 165, 116, 0.2),
      0 0 0 1px rgba(212, 165, 116, 0.1);
    gap: 18px;
    position: relative;
    overflow: hidden;
    animation: ${candlestickSparkle} 6s ease-in-out infinite;
    color: var(--love-letter-gold);
    font-family: 'DM Sans', sans-serif;
    
    /* Romantic glow effect like candlelight */
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
        rgba(212, 165, 116, 0.12),
        rgba(184, 51, 106, 0.08),
        transparent
      );
      animation: ${loveLetterFloat} 4s infinite ease-in-out;
      pointer-events: none;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, 
        var(--love-letter-gold), 
        var(--deep-crimson-rose), 
        var(--soft-purple-twilight),
        var(--love-letter-gold)
      );
      background-size: 300% 100%;
      animation: ${loveLetterFloat} 3s infinite ease-in-out;
    }
  }
`;

// Desktop controls (hidden on mobile)
const DesktopControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  
  @media (max-width: 800px) {
    display: none;
  }
`;

// Top row with wager and play button - romantic mobile layout
const TopRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 16px;
  width: 100%;
`;

// Wager section (left side) - romantic degen aesthetic
const WagerSection = styled.div`
  flex: 2;
  min-width: 0;
`;

const WagerLabel = styled.div`
  color: var(--love-letter-gold);
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  text-align: center;
  text-shadow: 0 2px 4px rgba(10, 5, 17, 0.8);
  font-family: 'Libre Baskerville', serif;
  opacity: 0.9;
`;

const WagerInputRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: linear-gradient(135deg, 
    rgba(10, 5, 17, 0.85) 0%, 
    rgba(139, 90, 158, 0.1) 50%,
    rgba(10, 5, 17, 0.85) 100%
  );
  border: 1px solid rgba(212, 165, 116, 0.4);
  border-radius: 16px;
  padding: 14px;
  box-shadow: 
    inset 0 2px 8px rgba(10, 5, 17, 0.4),
    0 4px 16px rgba(212, 165, 116, 0.1),
    0 0 0 1px rgba(212, 165, 116, 0.15);
  backdrop-filter: blur(12px);
  animation: ${romanticPulse} 8s ease-in-out infinite;
  
  input {
    all: unset;
    width: 100%;
    color: var(--love-letter-gold);
    font-weight: 600;
    font-size: 16px;
    text-align: center;
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    
    &::placeholder {
      color: rgba(212, 165, 116, 0.5);
      font-family: 'DM Sans', sans-serif;
    }
    
    &:focus {
      outline: none;
      color: var(--love-letter-gold);
    }
  }
`;

const PresetButtonsRow = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;

const PresetButton = styled.button`
  background: linear-gradient(135deg, 
    rgba(184, 51, 106, 0.2) 0%, 
    rgba(139, 90, 158, 0.2) 100%
  );
  border: 1px solid rgba(212, 165, 116, 0.4);
  color: var(--love-letter-gold);
  font-weight: 600;
  font-size: 11px;
  padding: 8px 14px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 40px;
  text-shadow: 0 1px 3px rgba(10, 5, 17, 0.8);
  box-shadow: 
    0 2px 8px rgba(10, 5, 17, 0.3),
    inset 0 1px 0 rgba(212, 165, 116, 0.1);
  font-family: 'DM Sans', sans-serif;
  backdrop-filter: blur(8px);
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, 
      rgba(184, 51, 106, 0.3) 0%, 
      rgba(139, 90, 158, 0.3) 100%
    );
    border-color: rgba(212, 165, 116, 0.6);
    transform: translateY(-2px) scale(1.05);
    box-shadow: 
      0 6px 16px rgba(184, 51, 106, 0.3),
      inset 0 1px 0 rgba(212, 165, 116, 0.2);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0) scale(1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Play button section (right side) - romantic degen aesthetic
const PlaySection = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-end;
  min-width: 100px;
`;

const PlayButton = styled.button`
  width: 100%;
  height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  background: linear-gradient(135deg, 
    var(--deep-crimson-rose) 0%, 
    var(--soft-purple-twilight) 30%, 
    var(--love-letter-gold) 100%
  );
  border: 2px solid var(--love-letter-gold);
  color: var(--deep-romantic-night);
  font-weight: 700;
  font-size: 16px;
  border-radius: 18px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 
    0 6px 24px rgba(212, 165, 116, 0.4),
    0 3px 12px rgba(184, 51, 106, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  text-shadow: 0 2px 4px rgba(10, 5, 17, 0.8);
  position: relative;
  overflow: hidden;
  font-family: 'Libre Baskerville', serif;
  animation: ${romanticPulse} 6s ease-in-out infinite;

  /* Romantic shine effect like candlelight */
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
      rgba(212, 165, 116, 0.4),
      transparent
    );
    animation: ${loveLetterFloat} 2s ease-in-out;
    z-index: 1;
  }

  /* Text content above shine */
  & > * {
    position: relative;
    z-index: 2;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 
      0 8px 32px rgba(212, 165, 116, 0.6),
      0 4px 16px rgba(184, 51, 106, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.4);
    border-color: var(--love-letter-gold);
    animation: ${candlestickSparkle} 2s infinite;

    &::before {
      left: 100%;
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(-1px) scale(1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    animation: none;
  }
`;

// Game options section - romantic degen aesthetic
const GameOptionsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const OptionLabel = styled.div`
  color: var(--love-letter-gold);
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
  text-shadow: 0 2px 4px rgba(10, 5, 17, 0.8);
  font-family: 'Libre Baskerville', serif;
  opacity: 0.9;
`;

const OptionButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
`;

const OptionButton = styled.button<{ $selected?: boolean }>`
  background: ${props => props.$selected 
    ? 'linear-gradient(135deg, var(--love-letter-gold) 0%, rgba(255, 235, 59, 0.9) 100%)'
    : 'linear-gradient(135deg, rgba(184, 51, 106, 0.2) 0%, rgba(139, 90, 158, 0.2) 100%)'
  };
  border: 2px solid ${props => props.$selected ? 'var(--love-letter-gold)' : 'rgba(212, 165, 116, 0.4)'};
  color: ${props => props.$selected ? 'var(--deep-romantic-night)' : 'var(--love-letter-gold)'};
  font-weight: 600;
  font-size: 13px;
  padding: 12px 18px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 65px;
  text-shadow: ${props => props.$selected ? '0 1px 3px rgba(10,5,17,0.5)' : '0 2px 4px rgba(10,5,17,0.8)'};
  box-shadow: 
    0 4px 12px rgba(10, 5, 17, 0.3),
    inset 0 1px 0 rgba(212, 165, 116, 0.1);
  position: relative;
  overflow: hidden;
  font-family: 'DM Sans', sans-serif;
  backdrop-filter: blur(8px);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: ${props => props.$selected ? '0' : '-100%'};
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s ease;
    pointer-events: none;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.05);
    border-color: ${props => props.$selected ? '#ffe066' : '#33ffec'};
    background: ${props => props.$selected 
      ? 'linear-gradient(145deg, #ffe066 0%, #ffeb3b 100%)'
      : 'linear-gradient(145deg, rgba(0, 255, 225, 0.3) 0%, rgba(0, 200, 180, 0.3) 100%)'
    };
    box-shadow: 0 4px 12px ${props => props.$selected ? 'rgba(255, 215, 0, 0.4)' : 'rgba(0, 255, 225, 0.4)'};
    
    &::before {
      left: 100%;
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(0) scale(1.02);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SwitchRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(145deg, 
    rgba(8, 8, 15, 0.6) 0%, 
    rgba(12, 12, 20, 0.6) 100%
  );
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const SwitchLabel = styled.div`
  color: #ffd700;
  font-size: 13px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
`;

const SliderContainer = styled.div`
  padding: 12px 16px;
  background: linear-gradient(145deg, 
    rgba(8, 8, 15, 0.6) 0%, 
    rgba(12, 12, 20, 0.6) 100%
  );
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const SliderLabel = styled.div`
  color: #ffd700;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 8px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
`;

// Popup overlay
const PopupOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  animation: ${props => props.$isOpen ? fadeIn : fadeOut} 0.3s ease;
`;

// Popup container
const PopupContainer = styled.div<{ $isOpen: boolean }>`
  background: linear-gradient(145deg, 
    rgba(18, 18, 28, 0.98) 0%, 
    rgba(25, 25, 40, 0.98) 50%, 
    rgba(20, 20, 35, 0.98) 100%
  );
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 20px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 215, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  animation: ${props => props.$isOpen ? popupSlideIn : popupSlideOut} 0.3s ease;
  transform-origin: center;
`;

// Compact wager trigger button (devtools style: inner black rounded input with caret)
const CompactWagerTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  background: transparent;
  color: #fff;
  border: none;
  cursor: pointer;
  min-width: 160px;
  justify-content: center;

  /* inner value box to match devtools black rounded input */
  .value-box {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 18px;
    background: #0b0b0f; /* dark inner */
    border-radius: 12px;
    border: 2px solid rgba(0,0,0,0.6);
    box-shadow: inset 0 2px 6px rgba(0,0,0,0.6), 0 6px 18px rgba(0,0,0,0.45);
  }

  .value {
    color: #fff;
    font-weight: 800;
    font-size: 16px;
    line-height: 1;
    min-width: 48px;
    text-align: right;
    padding-right: 2px;
  }

  .symbol {
    color: rgba(255,215,0,0.95);
    font-weight: 800;
    font-size: 12px;
    margin-left: 8px;
  }

  .caret {
    display: inline-block;
    width: 18px;
    height: 18px;
    border-radius: 6px;
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.9);
    font-size: 12px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 6px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.5);
  }

  &:hover .value-box {
    border-color: rgba(255,215,0,0.12);
  }
`;

// Popup close button
const PopupCloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 71, 87, 0.2);
  border: 1px solid rgba(255, 71, 87, 0.4);
  color: #ff4757;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 71, 87, 0.3);
    border-color: rgba(255, 71, 87, 0.6);
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

// Enhanced wager input for popup
const PopupWagerInput = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
  align-items: center;
  
  input {
    flex: 1;
    width: 100%;
    padding: 16px 12px;
    background: linear-gradient(145deg, 
      rgba(8, 8, 15, 0.9) 0%, 
      rgba(12, 12, 20, 0.9) 100%
    );
    border: 2px solid rgba(255, 215, 0, 0.4);
    border-radius: 12px;
    color: #fff;
    font-weight: 700;
    font-size: 18px;
    text-align: center;
    outline: none;
    transition: all 0.2s ease;
    box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.4);
      font-weight: 600;
    }
    
    &:focus {
      border-color: #ffd700;
      box-shadow: 
        inset 0 2px 8px rgba(0, 0, 0, 0.3),
        0 0 0 3px rgba(255, 215, 0, 0.3);
      animation: ${glow} 2s infinite;
    }
  }
`;

const ConfirmButton = styled.button`
  min-width: 88px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 2px solid rgba(34,197,94,0.15);
  background: linear-gradient(145deg, #10b981 0%, #059669 100%);
  color: #fff;
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(5,150,105,0.18);
  transition: transform .12s ease, box-shadow .12s ease;

  &:hover { transform: translateY(-2px); }
  &:active { transform: translateY(0); }
`;

// Enhanced preset buttons for popup
const PopupPresetButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
`;

const PopupPresetButton = styled.button`
  padding: 14px 20px;
  background: linear-gradient(145deg, 
    rgba(0, 255, 225, 0.2) 0%, 
    rgba(0, 200, 180, 0.2) 100%
  );
  border: 2px solid rgba(0, 255, 225, 0.4);
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  
  &:hover:not(:disabled) {
    background: linear-gradient(145deg, 
      rgba(0, 255, 225, 0.3) 0%, 
      rgba(0, 200, 180, 0.3) 100%
    );
    border-color: rgba(0, 255, 225, 0.6);
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 16px rgba(0, 255, 225, 0.4);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Popup title
const PopupTitle = styled.h3`
  color: #ffd700;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 20px 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

// Component interfaces
interface MobileControlsProps {
  wager: number;
  setWager: (value: number) => void;
  onPlay: () => void;
  playDisabled?: boolean;
  playText?: string;
  children?: React.ReactNode;
}

interface OptionSelectorProps {
  label: string;
  options: Array<{ value: any; label: string }>;
  selected: any;
  onSelect: (value: any) => void;
  disabled?: boolean;
}

interface SwitchControlProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

interface SliderControlProps {
  label: string;
  value: number;
  children: React.ReactNode;
}

// Main mobile controls component
export const MobileControls: React.FC<MobileControlsProps> = ({
  wager,
  setWager,
  onPlay,
  playDisabled = false,
  playText = "Play",
  children
}) => {
  const token = useCurrentToken();
  const [priceAgeMs, setPriceAgeMs] = useState<number | null>(null);
  const [isPriceFetching, setIsPriceFetching] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [hasAutoRefreshed, setHasAutoRefreshed] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupInput, setPopupInput] = useState<string>('');
  // Preset amounts are USD values; display will show equivalent crypto amount
  const presetAmounts = [1, 5, 10, 25, 50, 100];
  
  // Handle click outside to close popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsPopupOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPopupOpen(false);
      }
    };

    if (isPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isPopupOpen]);

  const handlePresetClick = (amount: number) => {
    // amount is USD; convert to crypto units using token.usdPrice
    const usdPrice = token?.usdPrice;
    const cryptoAmount = usdPrice ? (amount / usdPrice) : amount;
    const wagerAmount = cryptoAmount * token.baseWager;
    setWager(wagerAmount);
    setIsPopupOpen(false); // Close popup after selection
  };

  // Track price age and fetching state so UI can show "updated Xs ago" and disable presets while price updates
  useEffect(() => {
    const mintAddress = token?.mint?.toBase58();
    if (!mintAddress) {
      setPriceAgeMs(null);
      return;
    }

    // Seed from cached price if available (does not trigger network fetch)
    const cached = tokenPriceService.getCachedTokenPrice(mintAddress);
    if (cached) {
      setPriceAgeMs(Date.now() - cached.lastUpdated);
    } else {
      setPriceAgeMs(Infinity);
    }

    // Poll cache age every second
    let cancelled = false;
    const iv = setInterval(() => {
      const age = tokenPriceService.getPriceAge(mintAddress);
      if (!cancelled) setPriceAgeMs(age);
    }, 1000);

    return () => { cancelled = true; clearInterval(iv); };
  }, [token?.mint?.toBase58()]);

  // Manual refresh handler
  const handleRefreshPrices = async () => {
    const mintAddress = token?.mint?.toBase58();
    if (!mintAddress) return;
    setIsPriceFetching(true);
    try {
      await tokenPriceService.forceUpdate();
      setHasAutoRefreshed(true);
      const age = tokenPriceService.getPriceAge(mintAddress);
      setPriceAgeMs(age);
    } catch (err) {
      console.error('Failed to refresh prices', err);
    } finally {
      setIsPriceFetching(false);
    }
  };

  const formatCryptoFromUsd = (usdAmount: number) => {
    const usdPrice = token?.usdPrice;
    const cryptoAmount = usdPrice ? (usdAmount / usdPrice) : usdAmount;
    const decimals = (token && typeof token.decimals === 'number') ? token.decimals : 6;
    const factor = Math.pow(10, Math.min(decimals, 8));
    const rounded = Math.round(cryptoAmount * factor) / factor;
    if (!rounded) return `0 ${token?.symbol ?? ''}`;
    const s = rounded.toFixed(Math.min(decimals, 8)).replace(/(?:\.0+|(\.\d+?)0+)$/, '$1');
    return `${s} ${token?.symbol ?? ''}`;
  };

  // Short, user-friendly crypto formatter for preset buttons.
  // Uses 3-4 significant digits for compactness (good for newbies).
  const formatCryptoShort = (usdAmount: number) => {
    const usdPrice = token?.usdPrice;
    const cryptoAmount = usdPrice ? (usdAmount / usdPrice) : usdAmount;
    if (!cryptoAmount) return `0 ${token?.symbol ?? ''}`;

    // Use 4 significant digits for compact display
    let s = cryptoAmount.toPrecision(4);
    // Avoid scientific notation for small numbers by using Number()
    try { s = Number(s).toString(); } catch (e) { /* keep s */ }

    // Trim trailing zeros and dot
    s = s.replace(/(?:\.0+|(\.\d+?)0+)$/, '$1');
    return `≈${s} ${token?.symbol ?? ''}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
      const numericValue = inputValue === '' ? 0 : parseFloat(inputValue);
      if (!isNaN(numericValue)) {
        const wagerAmount = numericValue * token.baseWager;
        setWager(wagerAmount);
      }
    }
  };

  const handlePopupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v === '' || /^\d*\.?\d*$/.test(v)) {
      setPopupInput(v);
    }
  };

  const confirmPopup = () => {
    // If the popup input is empty, just close the popup — don't reset the wager to 0
    if (popupInput.trim() === '') {
      setIsPopupOpen(false);
      return;
    }

    const numericValue = parseFloat(popupInput);
    if (!isNaN(numericValue)) {
      const wagerAmount = numericValue * token.baseWager;
      setWager(wagerAmount);
    }

    setIsPopupOpen(false);
    // keep popupInput so reopening the popup preserves what the user typed
  };

  const handlePopupKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      confirmPopup();
    }
  };

  const handlePlayClick = () => {
    if (wager <= 0) {
      console.log('❌ BLOCKED: Cannot play with zero wager');
      return;
    }
    onPlay();
  };

  const displayValue = wager / token.baseWager;
  // Format as crypto value: use token.decimals when available, fallback to 6
  const decimals = (token && typeof token.decimals === 'number') ? token.decimals : 6;
  const factor = Math.pow(10, Math.min(decimals, 8)); // cap at 8 for UI
  const rounded = Math.round(displayValue * factor) / factor;

  const formattedDisplayValue = (() => {
    if (!rounded) return '0';
    // Convert to string with up to `decimals` places, then trim unnecessary zeros
    const s = rounded.toFixed(Math.min(decimals, 8));
    return s.replace(/(?:\.0+|(\.\d+?)0+)$/, '$1');
  })();

  return (
    <>
      <MobileControlsWrapper>
        <TopRow>
          <WagerSection>
            <WagerLabel>💰 Bet Amount</WagerLabel>
            <CompactWagerTrigger onClick={() => setIsPopupOpen(true)}>
              <div className="value-box">
                <div className="value">{formattedDisplayValue}</div>
                <div className="symbol">{token?.symbol ?? ''}</div>
                <div className="caret">▼</div>
              </div>
            </CompactWagerTrigger>
          </WagerSection>
          
          <PlaySection>
            <PlayButton onClick={handlePlayClick} disabled={playDisabled}>
              {playText}
            </PlayButton>
          </PlaySection>
        </TopRow>
        
        {children && (
          <GameOptionsSection>
            {children}
          </GameOptionsSection>
        )}
      </MobileControlsWrapper>

      {/* Popup Overlay */}
      <PopupOverlay $isOpen={isPopupOpen}>
        <PopupContainer $isOpen={isPopupOpen} ref={popupRef}>
          <PopupCloseButton onClick={() => setIsPopupOpen(false)}>
            ×
          </PopupCloseButton>
          
          <PopupTitle>💰 Set Bet Amount</PopupTitle>
          
            <PopupWagerInput>
            <input
              type="text"
              value={popupInput === '' ? (displayValue === 0 ? '' : displayValue.toString()) : popupInput}
              onChange={handlePopupInputChange}
              onKeyDown={handlePopupKey}
              placeholder="Enter amount..."
              autoFocus
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ color: 'rgba(255,215,0,0.95)', fontWeight: 800 }}>{token?.symbol ?? ''}</div>
                <ConfirmButton onClick={confirmPopup}>Confirm</ConfirmButton>
              </div>
              <PriceIndicator token={token} showRefresh amount={undefined} />
            </div>
          </PopupWagerInput>
          
          <PopupPresetButtons>
    {presetAmounts.map((amount) => {
              const exact = formatCryptoFromUsd(amount);
              const short = formatCryptoShort(amount);
              return (
                <PopupPresetButton
                  key={amount}
                  onClick={() => handlePresetClick(amount)}
      disabled={!token?.usdPrice || isPriceFetching}
      title={isPriceFetching ? 'Updating prices...' : (token?.usdPrice ? exact : 'Price unavailable')}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>${amount}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.9)', fontSize: 13 }}>
                      {token?.image ? (
                        <img
                          src={token.image}
                          alt={token?.symbol ?? 'token'}
                          style={{ width: 18, height: 18, borderRadius: 5, objectFit: 'cover' }}
                        />
                      ) : null}
                      <div style={{ opacity: 0.95 }}>{short}</div>
                    </div>
                  </div>
                </PopupPresetButton>
              );
            })}
          </PopupPresetButtons>
        </PopupContainer>
      </PopupOverlay>
    </>
  );
};

// Option selector component
export const OptionSelector: React.FC<OptionSelectorProps> = ({
  label,
  options,
  selected,
  onSelect,
  disabled = false
}) => {
  return (
    <>
      <OptionLabel>🎯 {label}</OptionLabel>
      <OptionButtonGroup>
        {options.map((option) => (
          <OptionButton
            key={String(option.value)}
            $selected={option.value === selected}
            onClick={() => onSelect(option.value)}
            disabled={disabled}
          >
            {option.label}
          </OptionButton>
        ))}
      </OptionButtonGroup>
    </>
  );
};

// Switch control component
export const SwitchControl: React.FC<SwitchControlProps> = ({
  label,
  checked,
  onChange,
  disabled = false
}) => {
  return (
    <SwitchRow>
      <SwitchLabel>⚙️ {label}</SwitchLabel>
      <GambaUi.Switch checked={checked} onChange={onChange} disabled={disabled} />
    </SwitchRow>
  );
};

// Slider control component
export const SliderControl: React.FC<SliderControlProps> = ({
  label,
  value,
  children
}) => {
  return (
    <SliderContainer>
      <SliderLabel>🎚️ {label}: {value.toFixed(2)}x</SliderLabel>
      {children}
    </SliderContainer>
  );
};

// Desktop wrapper component - now uses the comprehensive DesktopGameControls
export const DesktopControls: React.FC<{
  wager: number;
  setWager: (value: number) => void;
  onPlay: () => void;
  playDisabled?: boolean;
  playText?: string;
  gameDetails?: {
    title: string;
    description: string;
    rules?: string[];
    tips?: string[];
  };
  minWager?: number;
  maxWager?: number;
  children?: React.ReactNode;
}> = ({
  wager,
  setWager,
  onPlay,
  playDisabled = false,
  playText = "Play",
  gameDetails,
  minWager,
  maxWager,
  children
}) => {
  // If children are provided (legacy usage), use the simple wrapper
  if (children) {
    return <DesktopControlsWrapper>{children}</DesktopControlsWrapper>;
  }

  // Otherwise, use the new comprehensive component
  return (
    <DesktopGameControls
      wager={wager}
      setWager={setWager}
      onPlay={onPlay}
      playDisabled={playDisabled}
      playText={playText}
      gameDetails={gameDetails}
      minWager={minWager}
      maxWager={maxWager}
    />
  );
};