import React from 'react';
import { GambaUi, useCurrentToken } from 'gamba-react-ui-v2';
import styled, { keyframes, css } from 'styled-components';

// Casino animations
const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 5px #ffd700, 0 0 10px #ffd700; }
  50% { box-shadow: 0 0 20px #ffd700, 0 0 30px #ff0066, 0 0 40px #ff0066; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

// Main mobile controls container - completely redesigned for mobile-first
const MobileControlsWrapper = styled.div`
  display: none;
  @media (max-width: 800px) {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 18px;
    background: linear-gradient(145deg, 
      rgba(18, 18, 28, 0.98) 0%, 
      rgba(25, 25, 40, 0.98) 50%, 
      rgba(20, 20, 35, 0.98) 100%
    );
    border: 2px solid rgba(255, 215, 0, 0.3);
    border-radius: 20px;
    backdrop-filter: blur(15px);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      0 0 0 1px rgba(255, 215, 0, 0.1);
    gap: 16px;
    position: relative;
    overflow: hidden;
    
    /* Casino shine effect */
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
        rgba(255, 215, 0, 0.1),
        transparent
      );
      animation: ${shimmer} 3s infinite;
      pointer-events: none;
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

// Top row with wager and play button - modern mobile-first layout
const TopRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 14px;
  width: 100%;
`;

// Wager section (left side) - enhanced for mobile
const WagerSection = styled.div`
  flex: 2;
  min-width: 0;
`;

const WagerLabel = styled.div`
  color: #ffd700;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
`;

const WagerInputRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: linear-gradient(145deg, 
    rgba(8, 8, 15, 0.9) 0%, 
    rgba(12, 12, 20, 0.9) 100%
  );
  border: 2px solid rgba(255, 215, 0, 0.4);
  border-radius: 12px;
  padding: 12px;
  box-shadow: 
    inset 0 2px 8px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 215, 0, 0.1);
  
  input {
    all: unset;
    width: 100%;
    color: #fff;
    font-weight: 700;
    font-size: 16px;
    text-align: center;
    background: transparent;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.4);
      font-weight: 600;
    }
    
    &:focus {
      outline: none;
      animation: ${glow} 2s infinite;
    }
  }
  
  &:focus-within {
    border-color: #ffd700;
    box-shadow: 
      inset 0 2px 8px rgba(0, 0, 0, 0.3),
      0 0 0 3px rgba(255, 215, 0, 0.3),
      0 4px 12px rgba(255, 215, 0, 0.2);
  }
  
  &:hover:not(:focus-within) {
    border-color: rgba(255, 215, 0, 0.6);
    background: linear-gradient(145deg, 
      rgba(10, 10, 18, 0.9) 0%, 
      rgba(15, 15, 25, 0.9) 100%
    );
  }
`;

const PresetButtonsRow = styled.div`
  display: flex;
  gap: 6px;
  justify-content: center;
`;

const PresetButton = styled.button`
  background: linear-gradient(145deg, 
    rgba(0, 255, 225, 0.2) 0%, 
    rgba(0, 200, 180, 0.2) 100%
  );
  border: 1px solid rgba(0, 255, 225, 0.4);
  color: #fff;
  font-weight: 600;
  font-size: 11px;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 35px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  
  &:hover:not(:disabled) {
    background: linear-gradient(145deg, 
      rgba(0, 255, 225, 0.3) 0%, 
      rgba(0, 200, 180, 0.3) 100%
    );
    border-color: rgba(0, 255, 225, 0.6);
    transform: translateY(-1px) scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 255, 225, 0.3);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0) scale(1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Play button section (right side)
const PlaySection = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-end;
  min-width: 100px;
`;

const PlayButton = styled.button`
  width: 100%;
  height: 54px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  background: linear-gradient(145deg, 
    #ff0066 0%, 
    #ff3385 30%, 
    #ffd700 100%
  );
  border: 3px solid #ffd700;
  color: #fff;
  font-weight: 900;
  font-size: 16px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  box-shadow: 
    0 4px 20px rgba(255, 215, 0, 0.4),
    0 2px 10px rgba(255, 0, 102, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
  position: relative;
  overflow: hidden;

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
    transition: left 0.6s ease;
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
      0 6px 30px rgba(255, 215, 0, 0.6),
      0 4px 15px rgba(255, 0, 102, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    border-color: #ffe066;
    animation: ${pulse} 1.5s infinite;

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

// Game options section
const GameOptionsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OptionLabel = styled.div`
  color: #ffd700;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
`;

const OptionButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
`;

const OptionButton = styled.button<{ $selected?: boolean }>`
  background: ${props => props.$selected 
    ? 'linear-gradient(145deg, #ffd700 0%, #ffeb3b 100%)'
    : 'linear-gradient(145deg, rgba(0, 255, 225, 0.2) 0%, rgba(0, 200, 180, 0.2) 100%)'
  };
  border: 2px solid ${props => props.$selected ? '#ffd700' : 'rgba(0, 255, 225, 0.4)'};
  color: ${props => props.$selected ? '#000' : '#fff'};
  font-weight: 700;
  font-size: 13px;
  padding: 10px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 60px;
  text-shadow: ${props => props.$selected ? '0 1px 2px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.5)'};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  
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
  const presetAmounts = [0.1, 0.5, 1.0, 5.0];
  
  const handlePresetClick = (amount: number) => {
    const wagerAmount = amount * token.baseWager;
    setWager(wagerAmount);
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

  const handlePlayClick = () => {
    if (wager <= 0) {
      console.log('❌ BLOCKED: Cannot play with zero wager');
      return;
    }
    onPlay();
  };

  const displayValue = wager / token.baseWager;
  
  return (
    <MobileControlsWrapper>
      <TopRow>
        <WagerSection>
          <WagerLabel>💰 Bet Amount</WagerLabel>
          <WagerInputRow>
            <input
              type="text"
              value={displayValue === 0 ? '' : displayValue.toString()}
              onChange={handleInputChange}
              placeholder="0.00"
            />
            <PresetButtonsRow>
              {presetAmounts.map((amount) => (
                <PresetButton
                  key={amount}
                  onClick={() => handlePresetClick(amount)}
                >
                  {amount}
                </PresetButton>
              ))}
            </PresetButtonsRow>
          </WagerInputRow>
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

// Desktop wrapper component
export const DesktopControls: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <DesktopControlsWrapper>{children}</DesktopControlsWrapper>;
};
