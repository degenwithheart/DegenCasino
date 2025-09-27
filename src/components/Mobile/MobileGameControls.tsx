import React from 'react';
import { GambaUi, useCurrentToken } from 'gamba-react-ui-v2';
import styled, { keyframes } from 'styled-components';
import { 
  MobileControlsContainer,
  TopControlsRow,
  WagerSection,
  PlaySection,
  GameSpecificSection,
  GameControlRow,
  GameControlLabel,
  MetaControlsRow,
  CompactWagerInput,
  CompactWagerLabel,
  GameOptionButton,
  WagerDisplay,
  WagerButtonGroup,
  WagerButton
  } from "../../sections/Game/Game.styles";

// Romantic animations for mobile game controls
const romanticPulse = keyframes`
  0%, 100% { 
    transform: scale(1);
    box-shadow: 
      0 0 20px rgba(212, 165, 116, 0.4),
      0 8px 32px rgba(10, 5, 17, 0.3);
  }
  50% { 
    transform: scale(1.01);
    box-shadow: 
      0 0 30px rgba(212, 165, 116, 0.6),
      0 12px 48px rgba(10, 5, 17, 0.5);
  }
`;

const loveLetterGlow = keyframes`
  0%, 100% { 
    box-shadow: 
      0 0 15px rgba(212, 165, 116, 0.3),
      inset 0 0 20px rgba(139, 90, 158, 0.1);
  }
  50% { 
    box-shadow: 
      0 0 25px rgba(212, 165, 116, 0.5),
      inset 0 0 30px rgba(139, 90, 158, 0.2);
  }
`;

// Compact Wager Input for Mobile Layout - romantic degen aesthetic
const CompactStyledWagerInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  .gamba-wager-input {
    all: unset;
    display: flex;
    align-items: center;
    flex: 1;
  }
  
  .gamba-wager-input,
  input {
    all: unset;
    flex: 1;
    background: linear-gradient(135deg, 
      rgba(10, 5, 17, 0.85) 0%, 
      rgba(139, 90, 158, 0.1) 50%,
      rgba(10, 5, 17, 0.85) 100%
    );
    border: 1px solid rgba(212, 165, 116, 0.4);
    border-radius: 12px;
    padding: 10px 14px;
    color: var(--love-letter-gold);
    font-weight: 600;
    font-size: 14px;
    text-align: center;
    box-shadow: 
      inset 0 2px 8px rgba(10, 5, 17, 0.4),
      0 4px 16px rgba(212, 165, 116, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    min-width: 85px;
    font-family: 'DM Sans', sans-serif;
    backdrop-filter: blur(12px);
    animation: ${loveLetterGlow} 6s ease-in-out infinite;
    
    &:hover {
      border-color: rgba(212, 165, 116, 0.6);
      background: linear-gradient(135deg, 
        rgba(10, 5, 17, 0.9) 0%, 
        rgba(139, 90, 158, 0.15) 50%,
        rgba(10, 5, 17, 0.9) 100%
      );
      transform: translateY(-1px);
    }
    
    &:focus {
      outline: none;
      border-color: var(--love-letter-gold);
      box-shadow: 
        0 0 0 2px rgba(212, 165, 116, 0.3),
        inset 0 2px 8px rgba(10, 5, 17, 0.4),
        0 6px 20px rgba(212, 165, 116, 0.2);
      transform: translateY(-1px) scale(1.02);
    }
    
    &::placeholder {
      color: rgba(212, 165, 116, 0.5);
      font-weight: 500;
      font-family: 'DM Sans', sans-serif;
    }
    
    @media (max-width: 800px) {
      font-size: 13px;
      padding: 8px 12px;
      min-width: 75px;
    }
  }
`;

// Enhanced PlayButton for mobile layout - romantic degen aesthetic
const CompactPlayButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  
  .gamba-play-button {
    all: unset;
    background: linear-gradient(135deg, #ff0066 0%, #ff3385 50%, #ffd700 100%);
    border: 2px solid #ffd700;
    color: #fff;
    font-weight: 800;
    font-size: 16px;
    padding: 12px 24px;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 
      0 3px 15px rgba(255, 215, 0, 0.4),
      0 2px 8px rgba(255, 0, 102, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    min-width: 80px;

    &:hover:not(:disabled) {
      transform: translateY(-1px) scale(1.02);
      box-shadow: 
        0 4px 20px rgba(255, 215, 0, 0.5),
        0 3px 12px rgba(255, 0, 102, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
      border-color: #ffe066;
    }

    &:active:not(:disabled) {
      transform: translateY(0) scale(1);
      box-shadow: 
        0 2px 10px rgba(255, 215, 0, 0.4),
        0 1px 6px rgba(255, 0, 102, 0.3),
        inset 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: 
        0 2px 8px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 800px) {
      font-size: 14px;
      padding: 10px 20px;
      border-width: 2px;
      min-width: 70px;
    }
  }
`;

// Message section for when wager/play are hidden
const MessageSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const MessageText = styled.div`
  color: #ffd700;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

// Mobile-optimized controls wrapper
export const MobileGameControls: React.FC<{
  wager: number;
  setWager: (value: number) => void;
  onPlay: () => void;
  playDisabled?: boolean;
  playText?: string;
  hidePlayButton?: boolean; // Hide button entirely when not needed
  hideWager?: boolean; // Hide wager input entirely when not needed
  hideMessage?: string; // Message to show when wager/play are hidden
  children?: React.ReactNode; // Game-specific controls
  disabled?: boolean;
}> = ({ 
  wager, 
  setWager, 
  onPlay, 
  playDisabled = false, 
  playText = "Play",
  hidePlayButton = false,
  hideWager = false,
  hideMessage = "Good Luck! 🍀",
  children,
  disabled = false
}) => {
  const token = useCurrentToken();

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

  const handlePlayClick = () => {
    if (wager <= 0) {
      console.log('❌ BLOCKED: Cannot play with zero wager');
      return;
    }
    onPlay();
  };

  const displayValue = wager / token.baseWager;

  return (
    <MobileControlsContainer>
      {/* Top Row: Wager Input (left) + Play Button (right) */}
      <TopControlsRow>
        {hideWager || hidePlayButton ? (
          <MessageSection>
            <MessageText>{hideMessage}</MessageText>
          </MessageSection>
        ) : (
          <>
            <WagerSection>
              <CompactWagerInput>
                <CompactWagerLabel>Bet</CompactWagerLabel>
                <CompactStyledWagerInputWrapper>
                  <input
                    type="text"
                    value={displayValue === 0 ? '' : displayValue.toString()}
                    onChange={handleInputChange}
                    disabled={disabled}
                    placeholder="0.00"
                  />
                </CompactStyledWagerInputWrapper>
              </CompactWagerInput>
            </WagerSection>
            
            {!hidePlayButton && (
              <PlaySection>
                <CompactPlayButtonWrapper>
                  <GambaUi.PlayButton onClick={handlePlayClick} disabled={playDisabled || disabled}>
                    {playText}
                  </GambaUi.PlayButton>
                </CompactPlayButtonWrapper>
              </PlaySection>
            )}
          </>
        )}
      </TopControlsRow>
      
      {/* Middle Section: Game-specific controls */}
      {children && (
        <GameSpecificSection>
          {children}
        </GameSpecificSection>
      )}
    </MobileControlsContainer>
  );
};

// Game option selector (replaces dropdowns on mobile)
export const GameOptionSelector: React.FC<{
  label: string;
  options: Array<{ value: any; label: string }>;
  selected: any;
  onSelect: (value: any) => void;
  disabled?: boolean;
}> = ({ label, options, selected, onSelect, disabled = false }) => {
  return (
    <>
      <GameControlLabel>{label}</GameControlLabel>
      <GameControlRow>
        {options.map((option) => (
          <GameOptionButton
            key={String(option.value)}
            selected={option.value === selected}
            onClick={() => onSelect(option.value)}
            disabled={disabled}
          >
            {option.label}
          </GameOptionButton>
        ))}
      </GameControlRow>
    </>
  );
};

// Switch control for mobile
export const MobileSwitch: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}> = ({ label, checked, onChange, disabled = false }) => {
  return (
    <GameControlRow>
      <GameControlLabel>{label}:</GameControlLabel>
      <GambaUi.Switch 
        checked={checked} 
        onChange={onChange} 
        disabled={disabled}
      />
    </GameControlRow>
  );
};
