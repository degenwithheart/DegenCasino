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
  /* Mobile-first: Start with mobile styles - prevent overflow */
  margin: 0 0.5rem;
  max-width: calc(100vw - 1rem);
  width: 100%;
  position: relative;
  display: grid;
  gap: 5px;
  box-sizing: border-box;
  
  /* Small mobile devices */
  @media (min-width: 375px) {
    margin: 0 0.75rem;
    max-width: calc(100vw - 1.5rem);
  }
  
  /* Small tablets (640px - 767px) */
  @media (min-width: 640px) {
    margin: 0 1rem;
    max-width: calc(100vw - 2rem);
  }
  
  /* Tablets (768px - 899px) */
  @media (min-width: 768px) {
    margin: 0 1.5rem;
    max-width: calc(100vw - 3rem);
  }
  
  /* Large tablets/small laptops (900px - 1023px) */
  @media (min-width: 900px) {
    margin: 0 2rem;
    max-width: calc(100vw - 4rem);
  }
  
  /* Desktop and up */
  @media (min-width: 1024px) {
    margin: 0 2.5rem;
    max-width: calc(100vw - 5rem);
  }
  
  /* Large desktop */
  @media (min-width: 1440px) {
    margin: 0 auto;
    max-width: min(calc(100vw - 6rem), 1400px);
  }
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
  /* Mobile-first: Start with smaller font size */
  font-size: 24px;
  font-weight: bold;
  
  /* Tablet and up */
  @media (min-width: 768px) {
    font-size: 32px;
  }
  
  /* Desktop and up */
  @media (min-width: 1024px) {
    font-size: 42px;
  }
`

export const Screen = styled.div`
  position: relative;
  flex-grow: 1;
  background: #0c0c11;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.2s ease;
  
  /* Standard responsive sizing - not affected by game scaling system */
  width: 100%;
  
  /* Mobile-first: Start with mobile viewport optimized height using dynamic viewport units */
  height: clamp(300px, calc(100dvh - 160px), 450px);
  
  /* Small mobile devices (portrait) */
  @media (max-width: 479px) {
    height: clamp(280px, calc(100dvh - 140px), 400px);
  }
  
  /* Small tablets (640px - 767px) */
  @media (min-width: 640px) {
    height: clamp(350px, calc(100dvh - 200px), 550px);
  }
  
  /* Tablets (768px - 899px) */
  @media (min-width: 768px) {
    height: clamp(400px, calc(100dvh - 240px), 650px);
  }
  
  /* Large tablets/small laptops (900px - 1023px) */
  @media (min-width: 900px) {
    height: clamp(420px, calc(100dvh - 260px), 750px);
  }
  
  /* Desktop */
  @media (min-width: 1024px) {
    height: clamp(450px, calc(100dvh - 280px), 850px);
  }
  
  /* Large desktop */
  @media (min-width: 1440px) {
    height: clamp(500px, calc(100dvh - 300px), 900px);
  }
  
  /* Game content should utilize full container space */
  & > * {
    width: 100%;
    height: 100%;
  }
`

export const IconButton = styled.button`
  background: linear-gradient(135deg, #ffd700 0%, #ff0066 100%);
  border: 2px solid #ffd700;
  box-shadow: 0 2px 12px #ffd70044, 0 0px 0px #ff006688;
  padding: 0;
  /* Mobile-first: Start with mobile-optimized size */
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
  display: flex;
  margin: 0;
  cursor: pointer;
  font-size: 18px;
  border-radius: 50%;
  color: #fffbe6;
  transition: box-shadow 0.2s, transform 0.15s, background 0.2s;
  position: relative;
  overflow: hidden;
  
  /* Tablet and up */
  @media (min-width: 768px) {
    width: 54px;
    height: 54px;
    font-size: 20px;
  }
  
  &:hover {
    background: linear-gradient(135deg, #ffe066 0%, #ff3385 100%);
    box-shadow: 0 4px 24px #ffd70099, 0 0px 0px #ff0066cc;
    transform: scale(1.08);
  }
  &:active {
    transform: scale(0.98);
    box-shadow: 0 1px 6px #ffd70066;
  }
  
  /* Hide the play button portal on mobile and tablets since games have their own play buttons */
  &.play-button-portal {
    display: none;
    
    /* Show on large tablets/small laptops and up */
    @media (min-width: 900px) {
      display: flex;
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
  /* Mobile-first: Start with mobile styles */
  padding: 12px 6px;
  color: #fffbe6;
  border-radius: 16px;
  z-index: 6;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  gap: 14px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  
  /* Casino glow */
  &:before {
    content: '';
    position: absolute;
    inset: -6px;
    border-radius: 20px;
    background: radial-gradient(circle, #ffd70055 0%, transparent 80%);
    z-index: 0;
    pointer-events: none;
  }
  > * {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 100%;
  }
  
  /* Small mobile adjustments */
  @media (min-width: 375px) {
    padding: 14px 8px;
    gap: 16px;
  }
  
  /* Small tablets: Still column layout but with more padding */
  @media (min-width: 640px) {
    padding: 16px 12px;
    gap: 18px;
    border-radius: 18px;
  }
  
  /* Tablets: Still column layout but optimized for tablets */
  @media (min-width: 768px) {
    padding: 18px 16px;
    gap: 20px;
  }
  
  /* Large tablets/small laptops: Transition to hybrid layout */
  @media (min-width: 900px) {
    flex-direction: row;
    gap: 20px;
    height: 80px;
    padding: 20px 24px;
    overflow: visible;
  }
  
  /* Desktop and up: Full desktop layout */
  @media (min-width: 1024px) {
    gap: 24px;
    height: 70px;
    padding: 22px 28px;
  }
  
  .control-buttons {
    display: flex;
    /* Mobile-first: Center layout with smaller gaps */
    justify-content: center;
    gap: 18px;
    align-items: center;
    flex: 1;
    
    /* Small tablets: Better spacing */
    @media (min-width: 640px) {
      gap: 20px;
    }
    
    /* Tablets: More spacing */
    @media (min-width: 768px) {
      gap: 22px;
    }
    
    /* Large tablets/small laptops: Start transitioning to desktop layout */
    @media (min-width: 900px) {
      justify-content: flex-start;
      gap: 20px;
      
      /* Give more space to wager controls */
      > *:first-child {
        margin-right: 10px;
      }
    }
    
    /* Desktop: Full desktop spacing */
    @media (min-width: 1024px) {
      gap: 24px;
      > *:first-child {
        margin-right: 12px;
      }
    }
  }
`;

export const MetaControls = styled.div`
  display: flex;
  /* Mobile-first: Start with mobile-optimized layout */
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  gap: 14px;
  padding: 4px 4px 8px;
  background: transparent;
  border: none;
  box-shadow: none;
  flex-wrap: wrap;
  
  /* Very small screens: Allow wrapping */
  @media (max-width: 420px) {
    justify-content: center;
  }
  
  /* Small tablets: Better spacing */
  @media (min-width: 640px) {
    gap: 16px;
    padding: 6px 6px 10px;
  }
  
  /* Tablets: More spacing and start transitioning */
  @media (min-width: 768px) {
    gap: 18px;
    padding: 8px 8px 12px;
  }
  
  /* Large tablets/small laptops: Start desktop-style layout */
  @media (min-width: 900px) {
    width: auto;
    gap: 14px;
    padding: 10px 16px;
    flex-wrap: nowrap;
    justify-content: flex-start;
  }
  
  /* Desktop and up: Full desktop layout */
  @media (min-width: 1024px) {
    gap: 12px;
    padding: 10px 14px;
  }
  
  /* Subtle separation when many buttons */
  & > * { 
    /* Mobile-first: Equal flex for mobile */
    flex: 1 1 0;
    
    /* Large tablets/small laptops: Start transitioning */
    @media (min-width: 900px) {
      flex: 0 0 auto;
    }
  }

  & > button, & > div > button { /* target IconButton (direct or wrapped) */
    /* Mobile-first: Full width mobile buttons */
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
    
    /* Small tablets: Slightly smaller buttons */
    @media (min-width: 640px) {
      height: 52px;
      font-size: 20px;
    }
    
    /* Tablets: More refined buttons */
    @media (min-width: 768px) {
      height: 50px;
      font-size: 19px;
    }
    
    /* Large tablets/small laptops: Start desktop-style buttons */
    @media (min-width: 900px) {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ffd700 0%, #ff0066 100%);
      font-size: 17px;
    }
    
    /* Desktop and up: Full desktop button styles */
    @media (min-width: 1024px) {
      width: 48px;
      height: 48px;
      font-size: 18px;
    }
  }
  
  & > button:hover, & > div > button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 26px -6px #ff0066aa, 0 3px 14px -2px #ffd70088;
    
    /* Large tablets/small laptops: Start desktop hover effects */
    @media (min-width: 900px) {
      transform: scale(1.08);
      box-shadow: 0 4px 24px #ffd70099, 0 0px 0px #ff0066cc;
    }
  }
  
  & > button:active, & > div > button:active {
    transform: translateY(0);
    
    /* Large tablets/small laptops: Desktop active effects */
    @media (min-width: 900px) {
      transform: scale(0.98);
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
  /* Mobile-first: Start with mobile layout */
  flex-direction: column;
  align-items: stretch;
  padding: 12px 14px;
  gap: 8px;
  margin: 8px 0;
  position: relative;
  transition: all 0.3s ease;

  /* Tablet and up: Switch to row layout */
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    padding: 12px 18px;
    gap: 0;
  }
`;

export const WagerLabel = styled.span`
  color: #ffd700;
  font-weight: 700;
  /* Mobile-first: Start with mobile font size */
  font-size: 14px;
  min-width: auto;
  text-align: center;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
  position: relative;
  z-index: 1;
  letter-spacing: 0.5px;

  /* Tablet and up: Larger font and left alignment */
  @media (min-width: 768px) {
    font-size: 16px;
    min-width: 100px;
    text-align: left;
  }
`;

export const WagerDisplay = styled.div`
  flex: 1;
  background: rgba(12, 12, 17, 0.8);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 10px;
  /* Mobile-first: Start with mobile padding and font */
  padding: 8px 12px;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  position: relative;
  z-index: 1;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;

  /* Tablet and up: Larger padding and font */
  @media (min-width: 768px) {
    padding: 10px 14px;
    font-size: 18px;
  }

  &:hover {
    border-color: rgba(255, 215, 0, 0.5);
    background: rgba(12, 12, 17, 0.9);
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
  /* Mobile-first: Start with mobile sizes */
  font-size: 12px;
  padding: 6px 12px;
  min-width: 40px;
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
  text-shadow: ${props => props.variant === 'primary' ? '0 1px 2px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.5)'};

  /* Tablet and up: Larger sizes */
  @media (min-width: 768px) {
    font-size: 14px;
    padding: 8px 16px;
    min-width: 50px;
  }

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
`;

export const WagerButtonGroup = styled.div`
  display: flex;
  /* Mobile-first: Start with mobile layout */
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  align-items: center;
  position: relative;
  z-index: 1;

  /* Tablet and up: Less wrapping, larger gaps */
  @media (min-width: 768px) {
    gap: 8px;
    flex-wrap: nowrap;
    justify-content: flex-start;
  }
`;

export const PlayButton = styled.button<{ disabled?: boolean }>`
  background: linear-gradient(135deg, #ff0066 0%, #ff3385 50%, #ffd700 100%);
  border: 3px solid #ffd700;
  color: #fff;
  font-weight: 900;
  /* Mobile-first: Start with mobile sizes */
  font-size: 16px;
  padding: 12px 24px;
  border-width: 2px;
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

  /* Tablet and up: Larger sizes */
  @media (min-width: 768px) {
    font-size: 18px;
    padding: 14px 28px;
    border-width: 3px;
  }

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
`;

export const PresetButton = styled(WagerButton)`
  /* Mobile-first: Start with mobile sizes */
  min-width: 50px;
  font-size: 11px;
  padding: 5px 10px;
  
  /* Tablet and up: Larger sizes */
  @media (min-width: 768px) {
    min-width: 60px;
    font-size: 13px;
    padding: 6px 12px;
  }
`;

export const PresetContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  /* Mobile-first: Start with mobile spacing */
  gap: 4px;
  margin-top: 6px;
  justify-content: center;

  /* Tablet and up: Larger spacing */
  @media (min-width: 768px) {
    gap: 6px;
    margin-top: 8px;
  }
`;

// Mobile-first wrapper - shows by default
export const MobileControlsContainer = styled.div`
  /* Mobile-first: Display by default */
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;

  /* Desktop: Hide on larger screens */
  @media (min-width: 800px) {
    display: none;
  }
`;

// Desktop-only wrapper - hidden on mobile
export const DesktopControlsContainer = styled.div`
  /* Mobile-first: Hidden by default */
  display: none;
  
  /* Desktop: Show on larger screens */
  @media (min-width: 800px) {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }
`;

export const TopControlsRow = styled.div`
  display: flex;
  justify-content: space-between;
  /* Mobile-first: Center alignment and smaller gaps */
  align-items: center;
  gap: 12px;
  width: 100%;

  /* Tablet and up: Stretch alignment and larger gaps */
  @media (min-width: 768px) {
    align-items: stretch;
    gap: 16px;
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
  /* Mobile-first: Smaller minimum width */
  min-width: 80px;
  
  /* Tablet and up: Larger minimum width */
  @media (min-width: 768px) {
    min-width: 100px;
  }
`;

export const GameSpecificSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Mobile-first: Smaller gaps and padding */
  gap: 8px;
  padding: 8px 0;
  
  /* Tablet and up: Larger gaps and padding */
  @media (min-width: 768px) {
    gap: 12px;
    padding: 12px 0;
  }
`;

export const GameControlRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  /* Mobile-first: Smaller gaps */
  gap: 6px;
  width: 100%;

  /* Tablet and up: Larger gaps */
  @media (min-width: 768px) {
    gap: 8px;
  }
`;

export const GameControlLabel = styled.div`
  color: #ffd700;
  font-weight: 600;
  /* Mobile-first: Smaller font and margin */
  font-size: 13px;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
  margin-bottom: 4px;
  text-align: center;

  /* Tablet and up: Larger font and margin */
  @media (min-width: 768px) {
    font-size: 14px;
    margin-bottom: 6px;
  }
`;

export const MetaControlsRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  /* Mobile-first: Smaller gaps and padding, allow wrapping */
  gap: 8px;
  padding-top: 6px;
  flex-wrap: wrap;

  /* Tablet and up: Larger gaps and padding, no wrapping */
  @media (min-width: 768px) {
    gap: 12px;
    padding-top: 8px;
    flex-wrap: nowrap;
  }
`;

// Compact Wager Input for Mobile Layout
export const CompactWagerInput = styled(WagerInputContainer)`
  margin: 0;
  /* Mobile-first: Start with mobile styles */
  padding: 8px 12px;
  border-radius: 12px;
  gap: 6px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  
  /* Tablet and up: Larger padding and border radius */
  @media (min-width: 768px) {
    padding: 10px 14px;
    border-radius: 16px;
    gap: 8px;
  }
`;

export const CompactWagerLabel = styled(WagerLabel)`
  /* Mobile-first: Start with mobile font size */
  font-size: 13px;
  text-align: left;
  margin-bottom: 0;
  
  /* Tablet and up: Larger font size */
  @media (min-width: 768px) {
    font-size: 14px;
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
  /* Mobile-first: Start with mobile sizes */
  font-size: 12px;
  padding: 6px 12px;
  min-width: 40px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  text-shadow: ${props => props.selected ? '0 1px 2px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.5)'};

  /* Tablet and up: Larger sizes */
  @media (min-width: 768px) {
    font-size: 14px;
    padding: 8px 16px;
    min-width: 50px;
  }

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
`;
