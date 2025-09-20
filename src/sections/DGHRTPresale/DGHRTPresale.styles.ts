import styled from 'styled-components'

// Header section for the presale page
export const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  .logo {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 3px solid #ffd700;
    margin-bottom: 2rem;
  }

  .subtitle {
    font-size: 1.2rem;
    color: var(--text-secondary);
    margin-top: 1rem;
  }
`

// Wallet connection section
export const WalletSection = styled.div`
  margin-bottom: 2rem;

  label {
    display: block;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }
`

// Payment token selection section  
export const PaymentTokenSection = styled.div`
  margin-bottom: 2rem;

  label {
    display: block;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .token-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: var(--slate-1);
    border: 1px solid var(--slate-6);
    border-radius: 8px;
    margin-bottom: 0.5rem;

    img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }

    .token-name {
      font-weight: 600;
      color: var(--text-primary);
    }
  }

  .token-note {
    font-size: 0.9rem;
    color: var(--text-secondary);
    font-style: italic;
  }
`

// Amount input section
export const AmountSection = styled.div`
  margin-bottom: 2rem;

  label {
    display: block;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .amount-input-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: var(--slate-1);
    border: 1px solid var(--slate-6);
    border-radius: 8px;
    margin-bottom: 1rem;

    input {
      flex: 1;
      background: none;
      border: none;
      color: var(--text-primary);
      font-size: 1.2rem;
      font-weight: 600;
      outline: none;

      &::placeholder {
        color: var(--text-secondary);
      }
    }

    img {
      width: 24px;
      height: 24px;
    }

    .token-symbol {
      font-weight: 600;
      color: var(--text-primary);
    }
  }

  .quick-amounts {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
`

// Quick amount buttons
export const QuickAmountButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid var(--slate-6);
  border-radius: 6px;
  background: var(--slate-1);
  color: var(--text-primary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #ffd700;
    background: rgba(255, 215, 0, 0.1);
  }
`

// Receive amount section
export const ReceiveSection = styled.div`
  margin-bottom: 2rem;

  label {
    display: block;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .receive-amount {
    font-size: 1.5rem;
    font-weight: 700;
    color: #ffd700;
    text-align: center;
    padding: 1rem;
    background: rgba(255, 215, 0, 0.1);
    border: 1px solid rgba(255, 215, 0, 0.3);
    border-radius: 8px;
  }
`

// Status message for feedback
export const StatusMessage = styled.div<{ type: 'success' | 'error' | 'info' }>`
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
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
      default:
        return `
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #3b82f6;
        `;
    }
  }}
`