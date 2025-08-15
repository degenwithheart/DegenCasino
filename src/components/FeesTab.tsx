import React from 'react'
import styled from 'styled-components'
import { useGambaPlatformContext, useTokenMeta } from 'gamba-react-ui-v2';

// SOL fee presets in SOL (not lamports)
export const SOL_PRESETS = [0, 0.002, 0.01, 0.025, 0.05];

// Convert SOL to lamports
export function getLamportsForSol(sol: number, decimals: number = 9): number {
  return Math.round(sol * 10 ** decimals);
}

// Props type for FeesTab
type FeesTabProps = {
  value: number;
  onChange: (value: number) => void;
};
const FeeOptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  @media (max-width: 768px) {
    gap: 0.25rem;
    padding-bottom: 0.25rem;
    margin-bottom: 0.5rem;
  }
`;

const FeeOptionButton = styled.button<{ selected: boolean }>`
  flex: 1 0 100px;
  min-width: 100px;
  max-width: 120px;
  padding: 14px 12px;
  background: ${({ selected }) => (selected ? 'rgba(255, 215, 0, 0.18)' : 'rgba(24, 24, 24, 0.8)')};
  color: ${({ selected }) => (selected ? '#181818' : '#ffd700')};
  border: 2px solid ${({ selected }) => (selected ? '#ffd700' : 'rgba(255, 215, 0, 0.3)')};
  border-radius: 14px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1.05rem;
  box-shadow: ${({ selected }) => (selected ? '0 0 8px #ffd70088' : 'none')};
  outline: none;
  transition: background 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
  margin-bottom: 0;
  position: relative;
  z-index: 1;
  white-space: nowrap;
  &:hover {
    background: ${({ selected }) => (selected ? 'rgba(255, 215, 0, 0.28)' : 'rgba(255, 215, 0, 0.08)')};
    color: #181818;
    border-color: #ffd700;
  }
`

const CustomInput = styled.input`
  width: 120px;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ffd700;
  background: rgba(24, 24, 24, 0.8);
  color: #ffd700;
  transition: background 0.2s, color 0.2s, border-color 0.2s;

  &:disabled {
    background: rgba(40, 40, 40, 0.5);
    color: #888;
    border-color: #888;
    cursor: not-allowed;
  }
`;

export function FeesTab({ value, onChange }: FeesTabProps) {
  const { selectedPool } = useGambaPlatformContext()
  const meta = useTokenMeta(selectedPool?.token)
  const price = meta?.usdPrice ?? 0
  const decimals = meta?.decimals ?? 9
  const symbol = meta?.symbol ?? ''

  // Convert SOL presets to lamports for Gamba
  const presetLamports = SOL_PRESETS.map(sol => getLamportsForSol(sol, decimals));

  // Default to 0.01 SOL unless a value is set in localStorage or via props
  React.useEffect(() => {
    if (!value || (!presetLamports.includes(value) && value < getLamportsForSol(0.002, decimals))) {
      onChange(getLamportsForSol(0.01, decimals));
    }
    // eslint-disable-next-line
  }, [decimals]);

  // Determine if value is a preset or custom
  const isPreset = presetLamports.includes(value);

  const handleCustomSelect = () => {
    if (isPreset) {
      // No-op, custom selection is disabled
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{
        background: 'rgba(162, 89, 255, 0.10)',
        color: '#a259ff',
        borderRadius: 10,
        padding: '10px 16px',
        marginBottom: 14,
        fontSize: 15,
        fontWeight: 500,
        border: '1px solid #a259ff44',
        textAlign: 'center',
        maxWidth: 480,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        <span role="img" aria-label="info" style={{marginRight: 6}}>ℹ️</span>
        <span>
          <b>Priority Fee</b> lets you increase the speed of your Solana transactions by paying a higher network fee. Higher fees can help your bets confirm faster during network congestion. Choose a preset.
        </span>
      </div>
      <h3 style={{ color: '#ffd700', marginBottom: 16 }}>Transaction Priority Fee</h3>
      <FeeOptionsContainer>
        {SOL_PRESETS.filter(sol => sol !== 0).map((sol, idx) => {
          const lamports = getLamportsForSol(sol, decimals);
          return (
            <FeeOptionButton
              key={sol}
              selected={value === lamports}
              onClick={() => onChange(lamports)}
              type="button"
              aria-pressed={value === lamports}
            >
              {sol.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} SOL
            </FeeOptionButton>
          );
        })}
      </FeeOptionsContainer>
      <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
        1 {symbol} = ${price ? price.toFixed(4) : '...'} (live)
      </div>
    </div>
  )
}