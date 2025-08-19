import { createGlobalStyle } from 'styled-components'

export const WagerControlsGlobalStyles = createGlobalStyle`
  /* Enhanced but clean styles for GambaUi wager components */
  [class*="WagerInput"],
  [class*="wager-input"],
  [data-testid*="wager"] {
    input {
      background: rgba(12, 12, 17, 0.95) !important;
      border: 2px solid rgba(255, 215, 0, 0.4) !important;
      border-radius: 10px !important;
      padding: 12px 16px !important;
      color: #ffffff !important;
      font-size: 16px !important;
      font-weight: 500 !important;
      text-align: center !important;
      min-width: 100px !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
      transition: all 0.2s ease !important;
      
      &:focus {
        outline: none !important;
        border-color: #ffd700 !important;
        box-shadow: 0 4px 16px rgba(255, 215, 0, 0.2), 0 0 0 2px rgba(255, 215, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15) !important;
      }
      
      &:hover {
        border-color: rgba(255, 215, 0, 0.6) !important;
        box-shadow: 0 3px 12px rgba(255, 215, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.12) !important;
      }
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.5) !important;
      }
    }
  }
  
  [class*="PlayButton"],
  [data-testid*="play-button"] {
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%) !important;
    border: 2px solid #22c55e !important;
    border-radius: 10px !important;
    padding: 12px 24px !important;
    color: #ffffff !important;
    font-size: 16px !important;
    font-weight: 600 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    cursor: pointer !important;
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
    transition: all 0.2s ease !important;
    
    &:hover {
      background: linear-gradient(135deg, #16a34a 0%, #15803d 100%) !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 6px 16px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.25) !important;
    }
    
    &:active {
      transform: translateY(0) !important;
      box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3), inset 0 2px 4px rgba(0, 0, 0, 0.1) !important;
    }
    
    &:disabled {
      background: rgba(100, 100, 100, 0.5) !important;
      border-color: rgba(100, 100, 100, 0.5) !important;
      color: rgba(255, 255, 255, 0.4) !important;
      cursor: not-allowed !important;
      transform: none !important;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
    }
  }
  
  /* Secondary buttons styling */
  [class*="Button"]:not([class*="PlayButton"]) {
    background: rgba(24, 24, 31, 0.8) !important;
    border: 2px solid rgba(255, 215, 0, 0.4) !important;
    border-radius: 10px !important;
    padding: 10px 16px !important;
    color: #ffffff !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    cursor: pointer !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
    transition: all 0.2s ease !important;
    
    &:hover {
      background: rgba(24, 24, 31, 0.9) !important;
      border-color: rgba(255, 215, 0, 0.6) !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 12px rgba(255, 215, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15) !important;
    }
    
    &:active {
      transform: translateY(0) !important;
      box-shadow: 0 2px 6px rgba(255, 215, 0, 0.15), inset 0 2px 4px rgba(0, 0, 0, 0.1) !important;
    }
  }
`;
