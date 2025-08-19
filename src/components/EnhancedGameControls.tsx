import React from 'react';
import { GambaUi } from 'gamba-react-ui-v2';
import styled from 'styled-components';
import { 
  WagerInputContainer, 
  WagerLabel, 
  WagerDisplay, 
  WagerButton, 
  WagerButtonGroup, 
  PlayButton,
  PresetButton,
  PresetContainer
} from '../sections/Game/Game.styles';

// Wrapper for GambaUi.WagerInput with enhanced styling
const StyledWagerInputWrapper = styled.div`
  .gamba-wager-input {
    all: unset;
    display: flex;
    align-items: center;
    width: 100%;
  }
  
  .gamba-wager-input input {
    all: unset;
    flex: 1;
    background: rgba(12, 12, 17, 0.8);
    border: 1px solid rgba(255, 215, 0, 0.3);
    border-radius: 10px;
    padding: 10px 14px;
    color: #fff;
    font-weight: 600;
    font-size: 18px;
    text-align: center;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
    transition: all 0.2s ease;
    
    &:hover {
      border-color: rgba(255, 215, 0, 0.5);
      background: rgba(12, 12, 17, 0.9);
    }
    
    &:focus {
      outline: none;
      border-color: #ffd700;
      box-shadow: 
        0 0 0 2px rgba(255, 215, 0, 0.3),
        inset 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    
    @media (max-width: 800px) {
      font-size: 16px;
      padding: 8px 12px;
    }
  }
`;

// Enhanced WagerInput component
export const EnhancedWagerInput: React.FC<{
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  options?: number[];
}> = ({ value, onChange, disabled, options }) => {
  return (
    <WagerInputContainer>
      <WagerLabel>Bet Amount</WagerLabel>
      <StyledWagerInputWrapper>
        <GambaUi.WagerInput 
          value={value} 
          onChange={onChange} 
          disabled={disabled}
          options={options}
        />
      </StyledWagerInputWrapper>
    </WagerInputContainer>
  );
};

// Wrapper for GambaUi.Button with enhanced styling
const StyledButtonWrapper = styled.div<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  .gamba-button {
    all: unset;
    background: ${props => {
      switch (props.variant) {
        case 'primary':
          return 'linear-gradient(135deg, #ffd700 0%, #ffeb3b 100%)';
        case 'danger':
          return 'linear-gradient(135deg, #ff4757 0%, #ff3742 100%)';
        default:
          return 'linear-gradient(135deg, #00ffe1 0%, #00d4aa 100%)';
      }
    }};
    border: 2px solid ${props => {
      switch (props.variant) {
        case 'primary':
          return '#ffd700';
        case 'danger':
          return '#ff4757';
        default:
          return '#00ffe1';
      }
    }};
    color: ${props => props.variant === 'primary' ? '#000' : '#fff'};
    font-weight: 700;
    font-size: 14px;
    padding: 8px 16px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 
      0 2px 8px ${props => {
        switch (props.variant) {
          case 'primary':
            return 'rgba(255, 215, 0, 0.3)';
          case 'danger':
            return 'rgba(255, 71, 87, 0.3)';
          default:
            return 'rgba(0, 255, 225, 0.3)';
        }
      }},
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    min-width: 50px;
    text-shadow: ${props => props.variant === 'primary' ? '0 1px 2px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.5)'};
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:hover:not(:disabled) {
      transform: translateY(-1px) scale(1.02);
      box-shadow: 
        0 4px 12px ${props => {
          switch (props.variant) {
            case 'primary':
              return 'rgba(255, 215, 0, 0.4)';
            case 'danger':
              return 'rgba(255, 71, 87, 0.4)';
            default:
              return 'rgba(0, 255, 225, 0.4)';
          }
        }},
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
      border-color: ${props => {
        switch (props.variant) {
          case 'primary':
            return '#ffe066';
          case 'danger':
            return '#ff5975';
          default:
            return '#33ffec';
        }
      }};
    }

    &:active:not(:disabled) {
      transform: translateY(0) scale(0.98);
      box-shadow: 
        0 1px 4px ${props => {
          switch (props.variant) {
            case 'primary':
              return 'rgba(255, 215, 0, 0.3)';
            case 'danger':
              return 'rgba(255, 71, 87, 0.3)';
            default:
              return 'rgba(0, 255, 225, 0.3)';
          }
        }},
        inset 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: 
        0 1px 4px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 800px) {
      font-size: 12px;
      padding: 6px 12px;
      min-width: 40px;
    }
  }
`;

// Enhanced Button component
export const EnhancedButton: React.FC<{
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}> = ({ onClick, disabled, variant = 'secondary', children }) => {
  return (
    <StyledButtonWrapper variant={variant}>
      <GambaUi.Button onClick={onClick} disabled={disabled}>
        {children}
      </GambaUi.Button>
    </StyledButtonWrapper>
  );
};

// Wrapper for GambaUi.PlayButton with enhanced styling
const StyledPlayButtonWrapper = styled.div`
  .gamba-play-button {
    all: unset;
    background: linear-gradient(135deg, #ff0066 0%, #ff3385 50%, #ffd700 100%);
    border: 3px solid #ffd700;
    color: #fff;
    font-weight: 900;
    font-size: 18px;
    padding: 14px 28px;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 
      0 4px 20px rgba(255, 215, 0, 0.4),
      0 2px 10px rgba(255, 0, 102, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s ease;
      z-index: 0;
    }

    &:hover:not(:disabled) {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 
        0 6px 30px rgba(255, 215, 0, 0.6),
        0 4px 15px rgba(255, 0, 102, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
      border-color: #ffe066;

      &::before {
        left: 100%;
      }
    }

    &:active:not(:disabled) {
      transform: translateY(-1px) scale(1.02);
      box-shadow: 
        0 4px 20px rgba(255, 215, 0, 0.5),
        0 2px 10px rgba(255, 0, 102, 0.3),
        inset 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: 
        0 2px 8px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      
      &::before {
        display: none;
      }
    }

    @media (max-width: 800px) {
      font-size: 16px;
      padding: 12px 24px;
      border-width: 2px;
    }
  }
`;

// Enhanced PlayButton component
export const EnhancedPlayButton: React.FC<{
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ onClick, disabled, children }) => {
  return (
    <StyledPlayButtonWrapper>
      <GambaUi.PlayButton onClick={onClick} disabled={disabled}>
        {children}
      </GambaUi.PlayButton>
    </StyledPlayButtonWrapper>
  );
};

// Preset buttons for common bet amounts
export const PresetButtons: React.FC<{
  amounts: number[];
  onSelect: (amount: number) => void;
  disabled?: boolean;
}> = ({ amounts, onSelect, disabled }) => {
  return (
    <PresetContainer>
      {amounts.map((amount) => (
        <PresetButton
          key={amount}
          onClick={() => onSelect(amount)}
          disabled={disabled}
        >
          ${amount}
        </PresetButton>
      ))}
    </PresetContainer>
  );
};
