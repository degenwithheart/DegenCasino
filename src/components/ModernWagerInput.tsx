import React from 'react';
import styled from 'styled-components';
import { PublicKey } from '@solana/web3.js';
import { TOKEN_METADATA, POOLS } from '../constants';

const WagerInputContainer = styled.div`
  display: flex;
  align-items: center;
  background: rgba(24, 24, 24, 0.7);
  border-radius: 12px;
  padding: 10px 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 16px #000, 0 0 8px #00ffe1;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    padding: 8px 6px;
    gap: 8px;
    border-radius: 8px;
  }
`;

const Label = styled.span`
  color: #00ffe1;
  font-weight: 600;
  font-size: 18px;
  min-width: 120px;

  @media (max-width: 600px) {
    font-size: 16px;
    min-width: 0;
    margin-bottom: 2px;
  }
`;

const Display = styled.div`
  background: transparent;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: 0 0 0 1px #00ffe1;
  min-width: 100px;
  text-align: right;
  user-select: none;

  @media (max-width: 600px) {
    font-size: 17px;
    padding: 7px 10px;
    border-radius: 6px;
    min-width: 0;
    text-align: left;
  }
`;

const Button = styled.button<{ disabled?: boolean }>`
  background: #222;
  color: #00ffe1;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-weight: 600;
  font-size: 16px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  box-shadow: 0 0 0 1px #00ffe1;
  transition: box-shadow 0.2s;
  min-width: 48px;

  &:hover:not(:disabled) {
    box-shadow: 0 0 8px #00ffe1;
  }

  @media (max-width: 600px) {
    font-size: 15px;
    padding: 7px 8px;
    border-radius: 6px;
    min-width: 38px;
  }
`;

function formatNumber(value: number): string {
  // Format with up to 6 decimals, strip trailing zeros
  return parseFloat(value.toFixed(6)).toString();
}

interface ModernWagerInputProps {
  value: number; // in base units (e.g., lamports)
  onChange: (value: number) => void; // emits base unit
  disabled?: boolean;
  label?: string;
  conversionFactor?: number; // e.g. 1e9 for lamports->SOL
  selectedMint?: PublicKey | null; // pass selected token mint to show wager info
}

export function ModernWagerInput({
  value,
  onChange,
  disabled,
  label = 'Bet Amount',
  conversionFactor = 1,
  selectedMint = null,
}: ModernWagerInputProps) {
  const displayValue = value / conversionFactor;

  // Find token metadata by mint (PublicKey equals)
  const selectedTokenMeta = selectedMint
    ? TOKEN_METADATA.find((t) => t.mint.equals(selectedMint))
    : null;

  const handleHalf = () => {
    if (disabled) return;
    onChange(Math.max(0, Math.round((displayValue / 2) * conversionFactor)));
  };

  const handleDouble = () => {
    if (disabled) return;
    onChange(Math.round(displayValue * 2 * conversionFactor));
  };

  const handleAdd = (amount: number) => {
    if (disabled) return;
    onChange(Math.round((displayValue + amount) * conversionFactor));
  };

  return (
    <WagerInputContainer>
      <Label>{label}</Label>
      <Display>{formatNumber(displayValue)}</Display>
      <Button onClick={handleHalf} disabled={disabled} title="Half">
        ½
      </Button>
      <Button onClick={handleDouble} disabled={disabled} title="Double">
        2×
      </Button>
      <Button onClick={() => handleAdd(0.01)} disabled={disabled} title="Add 0.01">
        +0.01
      </Button>
      <Button onClick={() => handleAdd(0.1)} disabled={disabled} title="Add 0.1">
        +0.1
      </Button>
      <Button onClick={() => handleAdd(1)} disabled={disabled} title="Add 1">
        +1
      </Button>

      {/* Show base wager for selected token */}
      {selectedTokenMeta && (
        <div style={{ color: '#00ffe1', fontWeight: '600', marginLeft: 'auto' }}>
          Base Wager: {(selectedTokenMeta.baseWager ?? 0).toLocaleString()}
        </div>
      )}
    </WagerInputContainer>
  );
}
