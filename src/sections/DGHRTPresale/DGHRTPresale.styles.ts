import styled, { keyframes } from 'styled-components'

// Heartbeat animation for the presale
export const heartbeatPulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

export const presaleGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(212, 165, 116, 0.3), 0 0 40px rgba(184, 54, 106, 0.2);
    border-color: rgba(212, 165, 116, 0.4);
  }
  50% { 
    box-shadow: 0 0 40px rgba(212, 165, 116, 0.6), 0 0 80px rgba(184, 54, 106, 0.4);
    border-color: rgba(212, 165, 116, 0.8);
  }
`;

export const floatLogo = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

interface ContainerProps {
  visible?: boolean;
  $theme?: any;
}

export const Container = styled.div<ContainerProps>`
  max-width: 600px;
  margin: 2rem auto;
  padding: 3rem;
  
  background: ${({ $theme }) => 
    $theme?.colors?.containerBackground || 
    `linear-gradient(135deg, 
      rgba(18, 18, 22, 0.95) 0%, 
      rgba(30, 20, 35, 0.9) 50%, 
      rgba(25, 15, 30, 0.95) 100%
    )`
  };
  
  backdrop-filter: blur(20px);
  border: 1px solid rgba(212, 165, 116, 0.2);
  border-radius: 24px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(212, 165, 116, 0.1);
  
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: translateY(${({ visible }) => (visible ? '0' : '20px')});
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${presaleGlow} 4s ease-in-out infinite;

  @media (max-width: 768px) {
    margin: 1rem;
    padding: 2rem 1.5rem;
  }
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  .logo {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin: 0 auto 2rem;
    display: block;
    animation: ${floatLogo} 3s ease-in-out infinite;
    box-shadow: 0 10px 30px rgba(212, 165, 116, 0.3);
    border: 3px solid rgba(212, 165, 116, 0.4);
  }

  h1 {
    font-size: 2.5rem;
    background: linear-gradient(135deg, #d4a574 0%, #b8366a 50%, #d4a574 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1rem;
    text-shadow: 0 4px 20px rgba(212, 165, 116, 0.3);
    animation: ${heartbeatPulse} 2s ease-in-out infinite;
  }

  .subtitle {
    color: #ccc;
    font-style: italic;
    opacity: 0.9;
    font-size: 1.1rem;
  }

  @media (max-width: 768px) {
    .logo {
      width: 100px;
      height: 100px;
    }
    
    h1 {
      font-size: 2rem;
    }
  }
`;

export const PresaleCard = styled.div<{ $theme?: any }>`
  background: ${({ $theme }) => 
    $theme?.colors?.cardBackground || 
    'linear-gradient(135deg, rgba(30, 20, 35, 0.8) 0%, rgba(25, 15, 30, 0.9) 100%)'
  };
  
  border: 1px solid rgba(212, 165, 116, 0.3);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2rem;
`;

export const WalletSection = styled.div`
  margin-bottom: 2rem;
  
  label {
    display: block;
    color: #d4a574;
    font-weight: 600;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }
`;

export const PaymentTokenSection = styled.div`
  margin-bottom: 2rem;
  
  label {
    display: block;
    color: #d4a574;
    font-weight: 600;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  .token-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: rgba(212, 165, 116, 0.1);
    border-radius: 12px;
    margin-top: 0.5rem;
    
    img {
      width: 24px;
      height: 24px;
    }
    
    .token-name {
      color: #fff;
      font-weight: 500;
    }
  }

  .token-note {
    color: #ccc;
    font-size: 0.9rem;
    margin-top: 0.5rem;
    opacity: 0.8;
  }
`;

export const AmountSection = styled.div`
  margin-bottom: 2rem;
  
  label {
    display: block;
    color: #d4a574;
    font-weight: 600;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  .amount-input-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    
    input {
      flex: 1;
      padding: 1rem;
      border: 1px solid rgba(212, 165, 116, 0.3);
      border-radius: 12px;
      background: rgba(0, 0, 0, 0.3);
      color: #fff;
      font-size: 1.1rem;
      
      &:focus {
        outline: none;
        border-color: rgba(212, 165, 116, 0.6);
        box-shadow: 0 0 10px rgba(212, 165, 116, 0.3);
      }
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
    }
    
    .token-symbol {
      color: #d4a574;
      font-weight: 600;
      min-width: 60px;
    }
  }

  .quick-amounts {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
`;

export const QuickAmountButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid rgba(212, 165, 116, 0.3);
  border-radius: 8px;
  background: rgba(212, 165, 116, 0.1);
  color: #d4a574;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(212, 165, 116, 0.6);
    background: rgba(212, 165, 116, 0.2);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const ReceiveSection = styled.div`
  margin-bottom: 2rem;
  
  label {
    display: block;
    color: #d4a574;
    font-weight: 600;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  .receive-amount {
    padding: 1rem;
    border: 1px solid rgba(212, 165, 116, 0.3);
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.2);
    color: #fff;
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const PurchaseButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: 1.5rem;
  border: none;
  border-radius: 16px;
  background: ${({ disabled }) => disabled 
    ? 'linear-gradient(135deg, rgba(100, 100, 100, 0.5) 0%, rgba(80, 80, 80, 0.5) 100%)'
    : 'linear-gradient(135deg, #d4a574 0%, #b8366a 50%, #d4a574 100%)'
  };
  color: ${({ disabled }) => disabled ? '#999' : '#fff'};
  font-size: 1.2rem;
  font-weight: bold;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  animation: ${({ disabled }) => disabled ? 'none' : heartbeatPulse} 2s ease-in-out infinite;
  
  &:hover {
    transform: ${({ disabled }) => disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${({ disabled }) => disabled ? 'none' : '0 10px 30px rgba(212, 165, 116, 0.4)'};
  }
  
  &:active {
    transform: ${({ disabled }) => disabled ? 'none' : 'translateY(0)'};
  }
`;

export const PresaleInfo = styled.div<{ $theme?: any }>`
  background: ${({ $theme }) => 
    $theme?.colors?.cardBackground || 
    'linear-gradient(135deg, rgba(30, 20, 35, 0.8) 0%, rgba(25, 15, 30, 0.9) 100%)'
  };
  
  border: 1px solid rgba(212, 165, 116, 0.2);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  
  h3 {
    color: #d4a574;
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }
  
  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(212, 165, 116, 0.1);
    color: #ccc;
    
    &:last-child {
      border-bottom: none;
    }
    
    .label {
      font-weight: 500;
    }
    
    .value {
      color: #fff;
      font-weight: bold;
    }
  }
`;

export const StatusMessage = styled.div<{ type: 'success' | 'error' | 'info' }>`
  padding: 1rem;
  border-radius: 12px;
  margin-top: 1rem;
  text-align: center;
  font-weight: 500;
  
  ${({ type }) => {
    switch (type) {
      case 'success':
        return `
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #22c55e;
        `;
      case 'error':
        return `
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
        `;
      case 'info':
        return `
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #3b82f6;
        `;
    }
  }}
`;

export const ResponsiveContainer = styled.div`
  @media (max-width: 768px) {
    ${QuickAmountButton} {
      flex: 1;
      min-width: calc(50% - 0.25rem);
    }
    
    ${AmountSection} .quick-amounts {
      gap: 0.5rem;
    }
  }
`;
