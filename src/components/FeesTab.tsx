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
  const [customValue, setCustomValue] = React.useState(
    !isPreset && value ? value : getLamportsForSol(0.01, decimals)
  );

  React.useEffect(() => {
    if (!isPreset && value !== customValue) {
      setCustomValue(value);
    }
    // eslint-disable-next-line
  }, [value]);

  const handleCustomSelect = () => {
    if (isPreset) {
      onChange(customValue);
    }
  };

  // Set a real-world range for the slider: 0.0005 to 0.05 SOL in lamports
  const minCustom = getLamportsForSol(0.0005, decimals);
  const maxCustom = getLamportsForSol(0.05, decimals);

  // Keep slider and input in sync, clamp to min/max
  const handleCustomChange = (v: number) => {
    const clamped = Math.max(minCustom, Math.min(maxCustom, v));
    setCustomValue(clamped);
    onChange(clamped);
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
          <b>Priority Fee</b> lets you increase the speed of your Solana transactions by paying a higher network fee. Higher fees can help your bets confirm faster during network congestion. Choose a preset or set your own.
        </span>
      </div>
      <h3 style={{ color: '#ffd700', marginBottom: 16 }}>Transaction Priority Fee</h3>
      <FeeOptionsContainer>
        {SOL_PRESETS.map((sol, idx) => {
          const lamports = getLamportsForSol(sol, decimals);
          return (
            <FeeOptionButton
              key={sol}
              selected={value === lamports}
              onClick={() => onChange(lamports)}
              type="button"
              aria-pressed={value === lamports}
            >
              {sol === 0 ? '0' : sol.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} SOL
            </FeeOptionButton>
          );
        })}
        <FeeOptionButton
          selected={!isPreset}
          onClick={handleCustomSelect}
          type="button"
          aria-pressed={!isPreset}
        >
          Custom
        </FeeOptionButton>
      </FeeOptionsContainer>
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: '#ffd700', fontWeight: 700 }}>Custom:</span>
        <input
          type="range"
          min={minCustom}
          max={maxCustom}
          step={1}
          value={customValue}
          onChange={e => handleCustomChange(Number(e.target.value))}
          disabled={isPreset}
          style={{ flex: 1, accentColor: '#ffd700' }}
        />
        <CustomInput
          type="text"
          min={minCustom}
          max={maxCustom}
          value={
            (customValue / 10 ** decimals).toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 9 })
          }
          readOnly
          disabled={isPreset}
        />
        <span style={{ color: '#ffd700', fontWeight: 700 }}>{symbol}</span>
      </div>
      <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
        1 {symbol} = ${price ? price.toFixed(4) : '...'} (live)
      </div>
    </div>
  )
}