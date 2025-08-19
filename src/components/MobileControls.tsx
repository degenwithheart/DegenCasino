import React from 'react';
import { GambaUi } from 'gamba-react-ui-v2';
import styled from 'styled-components';

// Main mobile controls container
const MobileControlsWrapper = styled.div`
  display: none;
  @media (max-width: 800px) {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 16px 18px 18px;
    background: linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(20, 20, 35, 0.95) 100%);
    border: 1px solid rgba(255, 215, 0, 0.25);
    border-radius: 18px;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,0.12);
    gap: 12px;
  }
`;

// Desktop controls (hidden on mobile)
const DesktopControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  
  @media (max-width: 800px) {
    display: none;
  }
  
  /* Better spacing for wager controls vs game controls */
  > *:first-child {
    margin-right: 16px;
  }
`;

// Top row with wager and play button
const TopRow = styled.div`
  display: flex;
  align-items: flex-end; /* Align bottoms so label sits above input without stretching play button */
  gap: 14px;
  width: 100%;
`;

// Wager section (left side)
const WagerSection = styled.div`
  flex: 1;
  min-width: 0;
`;

const WagerLabel = styled.div`
  color: #ffd700;
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  opacity: .9;
`;

const WagerInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(12, 12, 17, 0.85);
  border: 1px solid rgba(255, 215, 0, 0.35);
  border-radius: 12px;
  padding: 0 12px;
  height: 54px; /* Fixed height to align with play button */
  
  .gamba-wager-input {
    all: unset;
    flex: 1;
    min-width: 0;
  }
  
  .gamba-wager-input input {
    all: unset;
    width: 100%;
    color: #fff;
    font-weight: 600;
    font-size: 14px;
    text-align: center;
    background: transparent;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
    
    &:focus {
      outline: none;
    }
  }
`;

const WagerButton = styled.button`
  background: linear-gradient(135deg, rgba(0, 255, 225, 0.2) 0%, rgba(0, 212, 170, 0.2) 100%);
  border: 1px solid rgba(0, 255, 225, 0.3);
  color: #fff;
  font-weight: 600;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 32px;
  
  &:hover {
    background: linear-gradient(135deg, rgba(0, 255, 225, 0.3) 0%, rgba(0, 212, 170, 0.3) 100%);
    border-color: rgba(0, 255, 225, 0.5);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// Play button section (right side)
const PlaySection = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: flex-end;
`;

const PlayButton = styled.button`
  height: 54px; /* Match wager input */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 26px;
  min-width: 120px;
  background: linear-gradient(135deg,#ffae00 0%,#ff0066 100%);
  border: 2px solid #ffd700;
  color: #fff;
  font-weight: 800;
  font-size: 15px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  box-shadow: 0 4px 18px -4px #ff006688, 0 2px 10px -2px #ffd70066;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 26px -6px #ff0066aa, 0 3px 14px -2px #ffd70088;
  }
  
  &:active:not(:disabled) {
    transform: translateY(0) scale(1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
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
  font-weight: 600;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
`;

const OptionButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
`;

const OptionButton = styled.button<{ $selected?: boolean }>`
  background: ${props => props.$selected 
    ? 'linear-gradient(135deg, #ffd700 0%, #ffeb3b 100%)'
    : 'linear-gradient(135deg, rgba(0, 255, 225, 0.2) 0%, rgba(0, 212, 170, 0.2) 100%)'
  };
  border: 2px solid ${props => props.$selected ? '#ffd700' : 'rgba(0, 255, 225, 0.3)'};
  color: ${props => props.$selected ? '#000' : '#fff'};
  font-weight: 600;
  font-size: 13px;
  padding: 10px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 50px;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px) scale(1.02);
    border-color: ${props => props.$selected ? '#ffe066' : '#33ffec'};
    background: ${props => props.$selected 
      ? 'linear-gradient(135deg, #ffe066 0%, #ffeb3b 100%)'
      : 'linear-gradient(135deg, rgba(0, 255, 225, 0.3) 0%, rgba(0, 212, 170, 0.3) 100%)'
    };
  }
  
  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SwitchRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px;
  background: rgba(12, 12, 17, 0.5);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 12px;
`;

const SwitchLabel = styled.div`
  color: #ffd700;
  font-size: 13px;
  font-weight: 600;
`;

const SliderContainer = styled.div`
  padding: 12px;
  background: rgba(12, 12, 17, 0.5);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 12px;
`;

const SliderLabel = styled.div`
  color: #ffd700;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 8px;
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
  return (
    <MobileControlsWrapper>
  <TopRow>
        <WagerSection>
          <WagerLabel>Bet Amount</WagerLabel>
          <WagerInputRow>
            <GambaUi.WagerInput value={wager} onChange={setWager} />
          </WagerInputRow>
        </WagerSection>
        
        <PlaySection>
          <PlayButton onClick={onPlay} disabled={playDisabled}>
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
      <OptionLabel>{label}</OptionLabel>
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
      <SwitchLabel>{label}</SwitchLabel>
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
      <SliderLabel>{label}: {value.toFixed(2)}x</SliderLabel>
      {children}
    </SliderContainer>
  );
};

// Desktop wrapper component
export const DesktopControls: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <DesktopControlsWrapper>{children}</DesktopControlsWrapper>;
};
