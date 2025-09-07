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
import { useWagerLimits, validateWager } from '../../utils/general/wagerUtils';

// Wrapper for GambaUi.WagerInput with romantic styling
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
    background: linear-gradient(
      135deg,
      rgba(10, 5, 17, 0.9) 0%,
      rgba(139, 90, 158, 0.15) 50%,
      rgba(10, 5, 17, 0.9) 100%
    );
    border: 1px solid rgba(212, 165, 116, 0.3);
    border-radius: 16px;
    padding: 12px 16px;
    color: var(--love-letter-gold);
    font-weight: 500;
    font-size: clamp(16px, 3vw, 18px);
    text-align: center;
    box-shadow: 
      0 4px 16px rgba(10, 5, 17, 0.4),
      inset 0 1px 0 rgba(212, 165, 116, 0.1);
    backdrop-filter: blur(15px) saturate(1.2);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-family: 'DM Sans', sans-serif;
    
    &:hover {
      border-color: rgba(212, 165, 116, 0.5);
      background: linear-gradient(
        135deg,
        rgba(10, 5, 17, 0.95) 0%,
        rgba(139, 90, 158, 0.2) 50%,
        rgba(10, 5, 17, 0.95) 100%
      );
      box-shadow: 
        0 6px 20px rgba(10, 5, 17, 0.5),
        inset 0 1px 0 rgba(212, 165, 116, 0.2);
    }
    
    &:focus {
      outline: none;
      border-color: rgba(212, 165, 116, 0.7);
      box-shadow: 
        0 0 0 2px rgba(212, 165, 116, 0.3),
        0 6px 20px rgba(10, 5, 17, 0.5),
        inset 0 1px 0 rgba(212, 165, 116, 0.2);
    }
    
    &::placeholder {
      color: rgba(212, 165, 116, 0.5);
      font-weight: 500;
    }
    /* add right padding to make room for token symbol affix */
    padding-right: 72px;
    
    @media (max-width: 479px) {
      font-size: 16px;
      padding: 10px 14px;
      border-radius: 12px;
      padding-right: 64px;
    }

    @media (min-width: 768px) {
      border-radius: 18px;
      padding: 14px 18px;
    }
  }

  /* place token symbol as an affix inside the input */
  position: relative;

  .symbol {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 56px;
    height: 36px;
    padding: 0 12px;
    color: var(--love-letter-gold);
    font-weight: 600;
    font-size: 14px;
    background: linear-gradient(
      135deg,
      rgba(212, 165, 116, 0.15) 0%,
      rgba(184, 51, 106, 0.1) 100%
    );
    border-radius: 10px;
    pointer-events: none;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(212, 165, 116, 0.2);
    font-family: 'DM Sans', sans-serif;

    @media (max-width: 479px) {
      right: 12px;
      min-width: 48px;
      height: 32px;
      font-size: 12px;
      border-radius: 8px;
    }
  }
`;

// Enhanced WagerInput component
export const EnhancedWagerInput: React.FC<{
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  options?: number[];
  minWager?: number;
  maxWager?: number;
  multiplier?: number;
}> = ({ value, onChange, disabled, options, minWager, maxWager, multiplier = 1 }) => {
  const token = useCurrentToken();
  const wagerLimits = useWagerLimits(multiplier);
  
  // Use provided limits or fall back to calculated ones
  const effectiveMinWager = minWager ?? wagerLimits.minWager;
  const effectiveMaxWager = maxWager ?? wagerLimits.maxWager;
  // Local input state so users can type leading zeros and decimals without the
  // parent value immediately clearing the field when it's 0.
  const displayValue = value / token.baseWager;
  const initial = displayValue === 0 ? '' : String(displayValue);
  const [inputValue, setInputValue] = useState<string>(initial);
  const focusedRef = useRef(false);

  // Helper to check if a value is within min/max wager
  const isWagerInRange = (wager: number) => {
    return wager >= effectiveMinWager && wager <= effectiveMaxWager;
  };

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
          // Only allow if in range
          if (isWagerInRange(wagerAmount)) {
            onChange(wagerAmount);
          } else if (wagerAmount < effectiveMinWager) {
            // Clamp and format to 4 decimals
            const minDisplay = (effectiveMinWager / token.baseWager).toFixed(4);
            setInputValue(minDisplay);
            onChange(effectiveMinWager);
          } else if (wagerAmount > effectiveMaxWager) {
            // Clamp and format to 4 decimals
            const maxDisplay = (effectiveMaxWager / token.baseWager).toFixed(4);
            setInputValue(maxDisplay);
            onChange(effectiveMaxWager);
          }
        }
      } else if (v === '') {
        // empty means zero, but enforce minimum wager
        const minDisplay = (effectiveMinWager / token.baseWager).toFixed(4);
        setInputValue(minDisplay);
        onChange(effectiveMinWager);
      }
    }
  };

  const handleFocus = () => { focusedRef.current = true; };
  const handleBlur = () => {
    focusedRef.current = false;
    // normalize incomplete entries like '.' -> '0'
    if (inputValue === '.' || inputValue === '') {
      const minDisplay = (effectiveMinWager / token.baseWager).toFixed(4);
      setInputValue(minDisplay);
      onChange(effectiveMinWager);
    } else {
      // ensure the displayed value matches the parsed numeric value formatting
      const numericValue = parseFloat(inputValue);
      if (!isNaN(numericValue)) {
        const wagerAmount = numericValue * token.baseWager;
        // Clamp the wager amount within min/max limits
        let clampedWager = wagerAmount;
        if (wagerAmount < effectiveMinWager) clampedWager = effectiveMinWager;
        if (wagerAmount > effectiveMaxWager) clampedWager = effectiveMaxWager;
        const clampedDisplayValue = (clampedWager / token.baseWager).toFixed(4);
        setInputValue(clampedDisplayValue);
        onChange(clampedWager);
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
      <div style={{ marginTop: 4, fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center' }}>
        Min: {(effectiveMinWager / token.baseWager).toFixed(4)} {token?.symbol} | 
        Max: {effectiveMaxWager === Infinity ? '∞' : (effectiveMaxWager / token.baseWager).toFixed(4)} {token?.symbol}
      </div>
    </WagerInputContainer>
  );
};

// Wrapper for GambaUi.Button with romantic styling
const StyledButtonWrapper = styled.div<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  .gamba-button {
    all: unset;
    background: ${props => {
      switch (props.variant) {
        case 'primary':
          return 'linear-gradient(135deg, var(--love-letter-gold) 0%, var(--deep-crimson-rose) 50%, var(--soft-purple-twilight) 100%)';
        case 'danger':
          return 'linear-gradient(135deg, rgba(184, 51, 106, 0.9) 0%, rgba(139, 90, 158, 0.9) 100%)';
        default:
          return 'linear-gradient(135deg, var(--soft-purple-twilight) 0%, var(--deep-crimson-rose) 50%, var(--love-letter-gold) 100%)';
      }
    }};
    border: 1px solid ${props => {
      switch (props.variant) {
        case 'primary':
          return 'rgba(212, 165, 116, 0.5)';
        case 'danger':
          return 'rgba(184, 51, 106, 0.5)';
        default:
          return 'rgba(139, 90, 158, 0.5)';
      }
    }};
    color: ${props => props.variant === 'primary' ? 'var(--deep-romantic-night)' : 'var(--love-letter-gold)'};
    font-weight: 600;
    font-size: clamp(12px, 2.5vw, 14px);
    padding: 10px 16px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 
      0 4px 12px ${props => {
        switch (props.variant) {
          case 'primary':
            return 'rgba(212, 165, 116, 0.3)';
          case 'danger':
            return 'rgba(184, 51, 106, 0.3)';
          default:
            return 'rgba(139, 90, 158, 0.3)';
        }
      }},
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    min-width: 60px;
    text-shadow: ${props => props.variant === 'primary' ? '0 1px 2px rgba(10, 5, 17, 0.3)' : '0 1px 2px rgba(10, 5, 17, 0.5)'};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px) saturate(1.2);
    font-family: 'DM Sans', sans-serif;

    &:hover:not(:disabled) {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 
        0 6px 20px ${props => {
          switch (props.variant) {
            case 'primary':
              return 'rgba(212, 165, 116, 0.4)';
            case 'danger':
              return 'rgba(184, 51, 106, 0.4)';
            default:
              return 'rgba(139, 90, 158, 0.4)';
          }
        }},
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
      border-color: ${props => {
        switch (props.variant) {
          case 'primary':
            return 'rgba(212, 165, 116, 0.7)';
          case 'danger':
            return 'rgba(184, 51, 106, 0.7)';
          default:
            return 'rgba(139, 90, 158, 0.7)';
        }
      }};
    }

    &:active:not(:disabled) {
      transform: translateY(-1px) scale(1.02);
      transition: all 0.2s ease;
      box-shadow: 
        0 3px 8px ${props => {
          switch (props.variant) {
            case 'primary':
              return 'rgba(212, 165, 116, 0.3)';
            case 'danger':
              return 'rgba(184, 51, 106, 0.3)';
            default:
              return 'rgba(139, 90, 158, 0.3)';
          }
        }},
        inset 0 2px 4px rgba(10, 5, 17, 0.2);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: 
        0 2px 6px rgba(10, 5, 17, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 479px) {
      padding: 8px 12px;
      border-radius: 10px;
      min-width: 50px;
    }

    @media (min-width: 768px) {
      padding: 12px 18px;
      border-radius: 14px;
      min-width: 70px;
    }
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

// Wrapper for GambaUi.PlayButton with romantic styling
const StyledPlayButtonWrapper = styled.div`
  .gamba-play-button {
    all: unset;
    background: linear-gradient(
      135deg, 
      var(--deep-crimson-rose) 0%, 
      var(--love-letter-gold) 50%, 
      var(--soft-purple-twilight) 100%
    );
    border: 2px solid rgba(212, 165, 116, 0.6);
    color: var(--deep-romantic-night);
    font-weight: 700;
    font-size: clamp(16px, 4vw, 18px);
    padding: 16px 32px;
    border-radius: 24px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    box-shadow: 
      0 8px 24px rgba(212, 165, 116, 0.4),
      0 4px 12px rgba(184, 51, 106, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    text-shadow: 0 1px 2px rgba(10, 5, 17, 0.3);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px) saturate(1.2);
    font-family: 'Libre Baskerville', serif;

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
        rgba(255, 255, 255, 0.25), 
        transparent
      );
      transition: left 0.6s ease;
      z-index: 0;
    }

    &:hover:not(:disabled) {
      transform: translateY(-3px) scale(1.08);
      box-shadow: 
        0 12px 36px rgba(212, 165, 116, 0.6),
        0 6px 18px rgba(184, 51, 106, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.4);
      border-color: rgba(212, 165, 116, 0.8);

      &::before {
        left: 100%;
      }
    }

    &:active:not(:disabled) {
      transform: translateY(-1px) scale(1.05);
      transition: all 0.2s ease;
      box-shadow: 
        0 6px 20px rgba(212, 165, 116, 0.5),
        0 3px 10px rgba(184, 51, 106, 0.3),
        inset 0 2px 4px rgba(10, 5, 17, 0.2);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: 
        0 4px 12px rgba(10, 5, 17, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      
      &::before {
        display: none;
      }
    }

    @media (max-width: 479px) {
      font-size: 14px;
      padding: 12px 24px;
      border-radius: 18px;
      border-width: 1px;
      letter-spacing: 1px;
    }

    @media (min-width: 768px) {
      font-size: 20px;
      padding: 18px 36px;
      border-radius: 28px;
      letter-spacing: 1.5px;
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
    // If onClick is provided, call it
    if (onClick) {
      onClick();
    }
  };

  return (
    <StyledPlayButtonWrapper>
      <GambaUi.PlayButton onClick={handleClick} disabled={disabled}>
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
