import { useState, useEffect, useRef } from "react";
import PriceIndicator from "../UI/PriceIndicator";
import { GambaUi, useCurrentToken } from 'gamba-react-ui-v2';
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
} from '../../sections/Game/Game.styles';

// Wrapper for GambaUi.WagerInput with enhanced styling
const StyledWagerInputWrapper = styled.div`
  .gamba-wager-input {
    all: unset;
    display: flex;
    align-items: center;
    width: 100%;
  }
  
  .gamba-wager-input input,
  input {
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
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.4);
      font-weight: 600;
    }
    /* add right padding to make room for token symbol affix */
    padding-right: 72px;
    
    @media (max-width: 800px) {
      font-size: 16px;
      padding: 8px 12px;
    }
  }

  /* place token symbol as an affix inside the input */
  position: relative;

  .symbol {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 56px;
    height: 36px;
    padding: 0 10px;
    color: rgba(255, 215, 0, 0.95);
    font-weight: 800;
    font-size: 14px;
    background: rgba(0,0,0,0.12);
    border-radius: 8px;
    pointer-events: none;
  }
`;

// Enhanced WagerInput component
export const EnhancedWagerInput: React.FC<{
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  options?: number[];
}> = ({ value, onChange, disabled, options }) => {
  const token = useCurrentToken();
  // Local input state so users can type leading zeros and decimals without the
  // parent value immediately clearing the field when it's 0.
  const displayValue = value / token.baseWager;
  const initial = displayValue === 0 ? '' : String(displayValue);
  const [inputValue, setInputValue] = useState<string>(initial);
  const focusedRef = useRef(false);

  // Keep local input in sync when external value changes (only when not focused)
  useEffect(() => {
    if (!focusedRef.current) {
      const formatted = displayValue === 0 ? '' : String(displayValue);
      setInputValue(formatted);
    }
  }, [displayValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    // allow empty, digits, and decimal point while typing
    if (v === '' || /^\d*\.?\d*$/.test(v)) {
      setInputValue(v);
      // only commit numeric values that parse to a number (avoid '.' or trailing '.')
      if (v !== '' && v !== '.' && !v.endsWith('.')) {
        const numericValue = parseFloat(v);
        if (!isNaN(numericValue)) {
          const wagerAmount = numericValue * token.baseWager;
          onChange(wagerAmount);
        }
      } else if (v === '') {
        // empty means zero
        onChange(0);
      }
    }
  };

  const handleFocus = () => { focusedRef.current = true; };
  const handleBlur = () => {
    focusedRef.current = false;
    // normalize incomplete entries like '.' -> '0'
    if (inputValue === '.' || inputValue === '') {
      setInputValue(inputValue === '.' ? '0' : '');
      onChange(0);
    } else {
      // ensure the displayed value matches the parsed numeric value formatting
      const numericValue = parseFloat(inputValue);
      if (!isNaN(numericValue)) {
        const formatted = String(numericValue);
        setInputValue(formatted);
        onChange(numericValue * token.baseWager);
      }
    }
  };

  return (
    <WagerInputContainer>
      <WagerLabel>Bet Amount</WagerLabel>
      <StyledWagerInputWrapper>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder="0.00"
        />
        <div className="symbol">{token?.symbol ?? ''}</div>
      </StyledWagerInputWrapper>
      <div style={{ marginTop: 8 }}>
        {/* display live USD conversion (displayValue is token amount) */}
        <PriceIndicator token={token} showRefresh={false} amount={displayValue} compact />
      </div>
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
  wager?: number; // Add wager prop for validation
  requireWager?: boolean; // Flag to enable/disable wager validation
}> = ({ onClick, disabled, variant = 'secondary', children, wager, requireWager = false }) => {
  
  const handleClick = () => {
    // Check wager validation if required
    if (requireWager && wager !== undefined && wager <= 0) {
      console.log('❌ BLOCKED: Cannot play with zero wager');
      return;
    }
    
    // If onClick is provided and wager is valid (or not required), call it
    if (onClick) {
      onClick();
    }
  };
  
  // Disable if explicitly disabled OR if requireWager is true and wager is 0 or less
  const isDisabled = disabled || (requireWager && wager !== undefined && wager <= 0);
  
  return (
    <StyledButtonWrapper variant={variant}>
      <GambaUi.Button onClick={handleClick} disabled={isDisabled}>
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
  wager?: number; // Add wager prop for validation
}> = ({ onClick, disabled, children, wager }) => {
  
  const handleClick = () => {
    // Check wager validation first
    if (wager !== undefined && wager <= 0) {
      console.log('❌ BLOCKED: Cannot play with zero wager');
      return;
    }
    
    // If onClick is provided and wager is valid, call it
    if (onClick) {
      onClick();
    }
  };
  
  // Disable if explicitly disabled OR if wager is 0 or less
  const isDisabled = disabled || (wager !== undefined && wager <= 0);
  
  return (
    <StyledPlayButtonWrapper>
      <GambaUi.PlayButton onClick={handleClick} disabled={isDisabled}>
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
