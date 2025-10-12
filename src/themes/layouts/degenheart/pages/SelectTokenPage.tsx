import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageSEO } from '../../../../hooks/ui/useGameSEO';
import { useTokenBalance, useTokenMeta, useCurrentToken, FAKE_TOKEN_MINT, useGambaPlatformContext } from 'gamba-react-ui-v2';
import { useWallet } from '@solana/wallet-adapter-react';
import { POOLS } from '../../../../constants';
import styled from 'styled-components';

// Custom token selection components - no default theme dependencies
const TokenList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`;

const TokenOption = styled.button<{ $selected?: boolean; }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: ${props => props.$selected
        ? 'rgba(34, 197, 94, 0.15)'
        : 'rgba(255, 255, 255, 0.05)'
    };
  border-radius: 16px;
  border: 2px solid ${props => props.$selected
        ? 'rgba(34, 197, 94, 0.4)'
        : 'rgba(34, 197, 94, 0.1)'
    };
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    background: rgba(34, 197, 94, 0.1);
    border-color: rgba(34, 197, 94, 0.3);
    transform: translateY(-2px);
  }

  .token-info {
    display: flex;
    align-items: center;
    gap: 16px;

    .icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      background: linear-gradient(135deg, #22c55e, #16a34a);
      color: white;
    }

    .details {
      text-align: left;

      .name {
        font-weight: 700;
        color: #fff;
        margin-bottom: 4px;
        font-size: 1.1rem;
      }

      .symbol {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.6);
        font-family: monospace;
      }
    }
  }

  .balance {
    text-align: right;

    .amount {
      font-weight: 700;
      color: #22c55e;
      font-size: 1.2rem;
      margin-bottom: 4px;
    }

    .price {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.5);
    }
  }
`;

const SelectButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 24px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(34, 197, 94, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

// Token selection component to get real token data
function TokenItem({ pool, isSelected, onSelect }: { pool: any, isSelected: boolean, onSelect: () => void; }) {
    const balance = useTokenBalance(pool.token);
    const meta = useTokenMeta(pool.token);
    const { connected } = useWallet();

    const rawBalance = balance.balance ?? 0;
    const decimals = meta.decimals ?? 9;
    const tokenBalance = rawBalance / 10 ** decimals;
    const formattedBalance = tokenBalance.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
    });

    const isFreeToken = pool.token.equals(FAKE_TOKEN_MINT);

    return (
        <TokenOption $selected={isSelected} onClick={onSelect}>
            <div className="token-info">
                <div className="icon">
                    <img
                        src={meta.image}
                        alt={meta.symbol}
                        style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </div>
                <div className="details">
                    <div className="name">{meta.name || 'Unknown Token'}</div>
                    <div className="symbol">{meta.symbol || '???'}</div>
                </div>
            </div>
            <div className="balance">
                <div className="amount">
                    {connected ? formattedBalance : '0.00'}
                </div>
                <div className="price">
                    {isFreeToken ? 'Free Play' : meta.symbol}
                </div>
            </div>
        </TokenOption>
    );
}

export default function SelectTokenPage() {
    const navigate = useNavigate();
    const currentToken = useCurrentToken();
    const context = useGambaPlatformContext();
    const { connected } = useWallet();
    const [selectedTokenMint, setSelectedTokenMint] = useState(currentToken?.underlyingTokenMint || POOLS[0].token);

    // SEO optimization
    usePageSEO(
        'Select Token - DegenHeart Casino',
        'Choose your preferred token for playing games at DegenHeart Casino'
    );

    const handleClose = () => {
        navigate(-1);
    };

    const handleTokenSelect = (pool: any) => {
        setSelectedTokenMint(pool.token);
    };

    const handleConfirmSelection = () => {
        if (selectedTokenMint) {
            context.setToken(selectedTokenMint);
            navigate('/');
        }
    };

    return (
        <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px' }}>
                    Choose your preferred token for playing games
                </p>
            </div>

            <TokenList>
                {POOLS.map((pool, index) => (
                    <TokenItem
                        key={index}
                        pool={pool}
                        isSelected={selectedTokenMint && selectedTokenMint.equals(pool.token)}
                        onSelect={() => handleTokenSelect(pool)}
                    />
                ))}
            </TokenList>

            <SelectButton
                onClick={handleConfirmSelection}
                disabled={!selectedTokenMint}
            >
                💎 Confirm Selection
            </SelectButton>
        </>
    );
}