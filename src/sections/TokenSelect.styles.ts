import styled, { keyframes, css } from 'styled-components'

// Animations
export const neonPulse = keyframes`
  0% { 
    box-shadow: 0 0 24px #a259ff88, 0 0 48px #ffd70044;
    border-color: #ffd70044;
  }
  100% { 
    box-shadow: 0 0 48px #ffd700cc, 0 0 96px #a259ff88;
    border-color: #ffd700aa;
  }
`

export const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

export const GridContainer = styled.div<{ $isSingleToken: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isSingleToken }) => ($isSingleToken ? '1fr' : 'repeat(2, 1fr)')};
  gap: 16px;
  background: rgba(24, 24, 24, 0.8);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(255, 215, 0, 0.15);
  border: 1px solid #ffd700;
  padding: 16px;
  ${css`animation: ${fadeIn} 0.5s ease-out;`}

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 8px 2px;
    border-radius: 8px;
  }
`

export const TokenCard = styled.button<{ $selected?: boolean }>`
  width: 100%;
  background: ${({ $selected }) => ($selected ? 'rgba(255, 215, 0, 0.2)' : 'rgba(24, 24, 24, 0.8)')};
  border: 1px solid ${({ $selected }) => ($selected ? '#ffd700' : 'rgba(255, 255, 255, 0.2)')};
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    background: ${({ $selected }) => ($selected ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)')};
    border-color: #ffd700;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(255, 215, 0, 0.2);
  }

  ${({ $selected }) => $selected && css`
    animation: ${neonPulse} 2s ease-in-out infinite alternate;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      ${css`animation: ${shimmer} 2s infinite;`}
    }
  `}

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 600px) {
    padding: 8px 12px;
    gap: 8px;
  }
`

export const ToggleContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 600px) {
    gap: 8px;
    margin-bottom: 12px;
  }
`

export const ToggleButton = styled.button<{ $active: boolean }>`
  flex: 1;
  min-width: 100px;
  padding: 12px 16px;
  background: ${({ $active }) => ($active ? '#ffd700' : 'rgba(24, 24, 24, 0.8)')};
  color: ${({ $active }) => ($active ? '#222' : '#ffd700')};
  border: 1px solid #ffd700;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: ${({ $active }) => ($active ? '#ffd700' : 'rgba(255, 215, 0, 0.1)')};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 600px) {
    padding: 10px 12px;
    font-size: 13px;
    min-width: 80px;
  }
`

export const SectionHeading = styled.h2`
  color: #ffd700;
  margin: 24px 0 12px 8px;
  font-size: 1.2rem;
  font-weight: 700;
  text-align: center;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);

  @media (max-width: 600px) {
    margin: 16px 0 8px 0;
    font-size: 1.1rem;
  }
`

export const TokenIcon = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(255, 215, 0, 0.3);
  transition: all 0.3s ease;

  ${TokenCard}:hover & {
    border-color: #ffd700;
    box-shadow: 0 0 12px rgba(255, 215, 0, 0.4);
  }

  @media (max-width: 600px) {
    width: 28px;
    height: 28px;
  }
`

export const TokenInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  flex: 1;
`

export const TokenName = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  text-align: left;

  @media (max-width: 600px) {
    font-size: 0.85rem;
  }
`

export const TokenSymbol = styled.span`
  font-size: 0.75rem;
  color: #999;
  text-transform: uppercase;
  font-weight: 500;

  @media (max-width: 600px) {
    font-size: 0.7rem;
  }
`

export const TokenBalance = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
`

export const BalanceAmount = styled.span<{ $selected?: boolean }>`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ $selected }) => $selected ? '#ffd700' : '#00ff88'};

  @media (max-width: 600px) {
    font-size: 0.8rem;
  }
`

export const BalanceUSD = styled.span`
  font-size: 0.7rem;
  color: #999;

  @media (max-width: 600px) {
    font-size: 0.65rem;
  }
`

export const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-top: 2px solid #ffd700;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

export const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 32px 16px;
  color: #999;
  font-size: 0.9rem;
`

export const ErrorState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 24px 16px;
  color: #ff4545;
  font-size: 0.85rem;
  background: rgba(255, 69, 69, 0.1);
  border: 1px solid rgba(255, 69, 69, 0.3);
  border-radius: 8px;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`

export const Title = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffd700;
  background: linear-gradient(90deg, #ffd700, #a259ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

export const RefreshButton = styled.button`
  background: none;
  border: 1px solid rgba(255, 215, 0, 0.3);
  color: #ffd700;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 215, 0, 0.1);
    border-color: #ffd700;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const ReferralSection = styled.div`
  margin-top: 20px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 10px;
`

export const ReferralHeader = styled.h4`
  margin: 0 0 12px 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffd700;
`

export const ReferralStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
  margin-bottom: 12px;
`

export const StatItem = styled.div`
  text-align: center;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
`

export const StatValue = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffd700;
`

export const StatLabel = styled.div`
  font-size: 0.7rem;
  color: #999;
  margin-top: 2px;
`

export const ReferralControls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

export const ReferralInput = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 6px;
  padding: 8px 12px;
  color: #fff;
  font-size: 0.8rem;

  &:focus {
    outline: none;
    border-color: #ffd700;
    box-shadow: 0 0 8px rgba(255, 215, 0, 0.2);
  }

  &::placeholder {
    color: #666;
  }
`

export const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  background: ${({ $variant }) => 
    $variant === 'primary' 
      ? 'linear-gradient(135deg, #ffd700, #a259ff)' 
      : 'rgba(255, 255, 255, 0.1)'
  };
  border: 1px solid ${({ $variant }) => 
    $variant === 'primary' ? '#ffd700' : 'rgba(255, 255, 255, 0.2)'
  };
  color: ${({ $variant }) => $variant === 'primary' ? '#000' : '#fff'};
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`
