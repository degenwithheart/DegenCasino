import styled, { css, keyframes } from 'styled-components'

const splashAnimation = keyframes`
  0% {
    opacity: 1;
  }
  30%, 75% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`

export const loadingAnimation = keyframes`
  0% { left: 0%; transform: translateX(-100%); }
  100% { left: 100%; transform: translateX(50%); }
`

export const Container = styled.div`
  margin: auto 3rem;
  position: relative;
  display: grid;
  gap: 5px;
`

export const SettingControls = styled.div`
  & > button {
    all: unset;
    cursor: pointer;
    opacity: .2;
    transition: opacity .2s;
    padding: 5px;
    text-shadow: 0 0 1px #00000066;
    &:hover {
      opacity: 1;
    }
  }
`

export const Splash = styled.div`
  pointer-events: none;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  animation: ${splashAnimation} .75s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
  background: #0c0c11;
  font-size: 42px;
  font-weight: bold;
`

export const Screen = styled.div`
  position: relative;
  flex-grow: 1;
  background: #0c0c11;
  border-radius: 10px;
  overflow: hidden;
  transition: height 0.2s ease;
  /* Responsive game screen height: min/max bounds around available viewport space.
     Allows tall screens to show a larger playfield (needed for Plinko board) while
     preventing tiny viewports from collapsing below a usable size. */
  height: clamp(480px, calc(100vh - 300px), 900px);
  @media (max-width: 900px) {
    /* On shorter mobile viewports keep original size bias but still allow some growth */
    height: clamp(420px, calc(100vh - 260px), 720px);
  }
  @media (max-width: 700px) {
    height: clamp(380px, calc(100vh - 220px), 600px);
  }
`

export const IconButton = styled.button`
  background: linear-gradient(135deg, #ffd700 0%, #ff0066 100%);
  border: 2px solid #ffd700;
  box-shadow: 0 2px 12px #ffd70044, 0 0px 0px #ff006688;
  padding: 0;
  width: 54px;
  height: 54px;
  justify-content: center;
  align-items: center;
  display: flex;
  margin: 0;
  cursor: pointer;
  font-size: 20px;
  border-radius: 50%;
  color: #fffbe6;
  transition: box-shadow 0.2s, transform 0.15s, background 0.2s;
  position: relative;
  overflow: hidden;
  &:hover {
    background: linear-gradient(135deg, #ffe066 0%, #ff3385 100%);
    box-shadow: 0 4px 24px #ffd70099, 0 0px 0px #ff0066cc;
    transform: scale(1.08);
  }
  &:active {
    transform: scale(0.98);
    box-shadow: 0 1px 6px #ffd70066;
  }
  
  /* Hide the play button portal on mobile since games have their own play buttons */
  &.play-button-portal {
    @media (max-width: 800px) {
      display: none;
    }
  }
`;

export const StyledLoadingIndicator = styled.div<{$active: boolean}>`
  position: relative;
  height: 3px;
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
  &:after {
    content: " ";
    position: absolute;
    width: 25%;
    height: 100%;
    animation: ${loadingAnimation} ease infinite .5s;
    opacity: 0;
    background: #9564ff;
    transition: opacity .5s;
    ${(props) => props.$active && css`
      opacity: 1;
    `}
  }
`

export const Controls = styled.div`
  background: linear-gradient(120deg, #18181f 60%, #2d0036 100%);
  border: 2px solid #ffd70044;
  box-shadow: 0 6px 32px #ffd70022, 0 1.5px 0px #ff006622;
  padding: 22px 28px;
  color: #fffbe6;
  border-radius: 18px;
  z-index: 6;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: visible;
  /* Casino glow */
  &:before {
    content: '';
    position: absolute;
    inset: -6px;
    border-radius: 22px;
    background: radial-gradient(circle, #ffd70055 0%, transparent 80%);
    z-index: 0;
    pointer-events: none;
  }
  > * {
    position: relative;
    z-index: 1;
  }
  @media (max-width: 800px) {
    flex-direction: column;
    gap: 18px;
    padding: 14px 8px;
  }
  @media (min-width: 800px) {
    gap: 24px;
    height: 70px;
  }
  .control-buttons {
    display: flex;
    gap: 20px;
    justify-content: flex-start;
    align-items: center;
    flex: 1;
    
    /* Desktop: Better spacing for single-tier layout */
    @media (min-width: 801px) {
      gap: 24px;
      
      /* Give more space to wager controls */
      > *:first-child {
        margin-right: 12px;
      }
    }
    
    /* Mobile: Keep existing layout */
    @media (max-width: 800px) {
      justify-content: center;
      gap: 18px;
    }
  }
`;

export const MetaControls = styled.div`
  display: flex;
  flex-direction: row; /* Horizontal on all viewports */
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border: 2px solid #333;
  border-radius: 16px;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
  box-shadow: inset 0 1px 0 #ffffff08, 0 4px 12px #00000066;
  
  /* Subtle separation when many buttons */
  & > * { flex: 0 0 auto; }

  /* Allow wrapping on very small widths */
  flex-wrap: nowrap;
  @media (max-width: 520px) {
    flex-wrap: wrap;
    justify-content: center;
  }
  @media (max-width: 800px) {
    width: 100%;
    justify-content: space-between;
    gap: 14px;
    padding: 4px 4px 8px;
    background: transparent;
    border: none;
    box-shadow: none;
    & > * { flex: 1 1 0; }
    & > button, & > div > button { /* target IconButton (direct or wrapped) */
      width: 100%;
      height: 54px;
      border-radius: 16px;
      background: linear-gradient(135deg,#ffae00 0%,#ff0066 100%);
      border: 2px solid #ffd700;
      box-shadow: 0 4px 18px -4px #ff006688, 0 2px 10px -2px #ffd70066;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      transition: transform .25s, box-shadow .25s;
      padding: 0;
    }
    & > button:hover, & > div > button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 26px -6px #ff0066aa, 0 3px 14px -2px #ffd70088;
    }
    & > button:active, & > div > button:active {
      transform: translateY(0);
    }
  }
`;

export const spinnerAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

export const Spinner = styled.div<{$small?: boolean}>`
  --spinner-size: 1em;
  --spinner-border: 2px;
  --color: white;
  animation: ${spinnerAnimation} 1s ease infinite;
  transform: translateZ(0);

  border-top: var(--spinner-border) solid var(--color);
  border-right: var(--spinner-border) solid var(--color);
  border-bottom: var(--spinner-border) solid var(--color);
  border-left: var(--spinner-border) solid transparent;
  background: transparent;
  height: var(--spinner-size);
  aspect-ratio: 1 / 1;
  border-radius: 50%;
`

// Enhanced Wager Input Styles
export const WagerInputContainer = styled.div`
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, rgba(24, 24, 31, 0.95) 0%, rgba(45, 0, 54, 0.8) 100%);
  border: 2px solid rgba(255, 215, 0, 0.4);
  border-radius: 16px;
  padding: 12px 18px;
  margin: 8px 0;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 4px 20px rgba(255, 215, 0, 0.15),
    0 2px 8px rgba(162, 89, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(255, 215, 0, 0.6);
    box-shadow: 
      0 6px 24px rgba(255, 215, 0, 0.25),
      0 2px 12px rgba(162, 89, 255, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
  }

  &:focus-within {
    border-color: #ffd700;
    box-shadow: 
      0 0 0 4px rgba(255, 215, 0, 0.2),
      0 6px 24px rgba(255, 215, 0, 0.3),
      0 2px 12px rgba(162, 89, 255, 0.2);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(162, 89, 255, 0.08) 0%, transparent 50%);
    pointer-events: none;
    border-radius: 14px;
  }

  @media (max-width: 800px) {
    flex-direction: column;
    align-items: stretch;
    padding: 12px 14px;
    gap: 8px;
  }
`;

export const WagerLabel = styled.span`
  color: #ffd700;
  font-weight: 700;
  font-size: 16px;
  min-width: 100px;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
  position: relative;
  z-index: 1;
  letter-spacing: 0.5px;

  @media (max-width: 800px) {
    font-size: 14px;
    min-width: auto;
    text-align: center;
  }
`;

export const WagerDisplay = styled.div`
  flex: 1;
  background: rgba(12, 12, 17, 0.8);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 10px;
  padding: 10px 14px;
  color: #fff;
  font-weight: 600;
  font-size: 18px;
  text-align: center;
  position: relative;
  z-index: 1;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(255, 215, 0, 0.5);
    background: rgba(12, 12, 17, 0.9);
  }

  @media (max-width: 800px) {
    font-size: 16px;
    padding: 8px 12px;
  }
`;

export const WagerButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
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
  position: relative;
  z-index: 1;
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
`;

export const WagerButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  position: relative;
  z-index: 1;

  @media (max-width: 800px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px;
  }
`;

export const PlayButton = styled.button<{ disabled?: boolean }>`
  background: linear-gradient(135deg, #ff0066 0%, #ff3385 50%, #ffd700 100%);
  border: 3px solid #ffd700;
  color: #fff;
  font-weight: 900;
  font-size: 18px;
  padding: 14px 28px;
  border-radius: 50px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
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
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
    z-index: -1;
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
`;

export const PresetButton = styled(WagerButton)`
  min-width: 60px;
  font-size: 13px;
  padding: 6px 12px;
  
  @media (max-width: 800px) {
    min-width: 50px;
    font-size: 11px;
    padding: 5px 10px;
  }
`;

export const PresetContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
  justify-content: center;

  @media (max-width: 800px) {
    gap: 4px;
    margin-top: 6px;
  }
`;

// Desktop-only wrapper - hides on mobile
export const DesktopControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;

  @media (max-width: 800px) {
    display: none;
  }
`;

// Mobile-Optimized Control Layout
export const MobileControlsContainer = styled.div`
  display: none;
  flex-direction: column;
  gap: 16px;
  width: 100%;

  @media (max-width: 800px) {
    display: flex;
    gap: 12px;
  }
`;

export const TopControlsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 16px;
  width: 100%;

  @media (max-width: 800px) {
    gap: 12px;
    align-items: center;
  }
`;

export const WagerSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
`;

export const PlaySection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 100px;
  
  @media (max-width: 800px) {
    min-width: 80px;
  }
`;

export const GameSpecificSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  
  @media (max-width: 800px) {
    gap: 8px;
    padding: 8px 0;
  }
`;

export const GameControlRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 100%;

  @media (max-width: 800px) {
    gap: 6px;
  }
`;

export const GameControlLabel = styled.div`
  color: #ffd700;
  font-weight: 600;
  font-size: 14px;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
  margin-bottom: 6px;
  text-align: center;

  @media (max-width: 800px) {
    font-size: 13px;
    margin-bottom: 4px;
  }
`;

export const MetaControlsRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 215, 0, 0.2);

  @media (max-width: 800px) {
    gap: 8px;
    padding-top: 6px;
    flex-wrap: wrap;
  }
`;

// Compact Wager Input for Mobile Layout
export const CompactWagerInput = styled(WagerInputContainer)`
  margin: 0;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  
  @media (max-width: 800px) {
    padding: 8px 12px;
    border-radius: 12px;
    gap: 6px;
  }
`;

export const CompactWagerLabel = styled(WagerLabel)`
  font-size: 14px;
  text-align: left;
  margin-bottom: 0;
  
  @media (max-width: 800px) {
    font-size: 13px;
  }
`;

// Game-specific control buttons (for things like mine count, multipliers, etc.)
export const GameOptionButton = styled.button<{ selected?: boolean }>`
  background: ${props => props.selected 
    ? 'linear-gradient(135deg, #ffd700 0%, #ffeb3b 100%)'
    : 'linear-gradient(135deg, rgba(0, 255, 225, 0.2) 0%, rgba(0, 212, 170, 0.2) 100%)'
  };
  border: 2px solid ${props => props.selected ? '#ffd700' : 'rgba(0, 255, 225, 0.3)'};
  color: ${props => props.selected ? '#000' : '#fff'};
  font-weight: 600;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  min-width: 50px;
  text-shadow: ${props => props.selected ? '0 1px 2px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.5)'};

  &:hover:not(:disabled) {
    transform: translateY(-1px) scale(1.02);
    border-color: ${props => props.selected ? '#ffe066' : '#33ffec'};
    background: ${props => props.selected 
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
    transform: none;
  }

  @media (max-width: 800px) {
    font-size: 12px;
    padding: 6px 12px;
    min-width: 40px;
  }
`;
