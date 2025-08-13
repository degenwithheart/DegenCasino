import React, { useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { GambaResultContext } from '../context/GambaResultContext';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(10, 20, 40, 0.65);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(6px);
  animation: fadeIn 0.25s ease;
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: rgba(30, 34, 44, 0.85);
  border-radius: 22px;
  padding: 40px 32px 28px 32px;
  min-width: 340px;
  max-width: 95vw;
  box-shadow: 0 8px 40px 0 rgba(0,0,0,0.55), 0 1.5px 0 rgba(255,255,255,0.04) inset;
  font-family: 'JetBrains Mono', 'Fira Mono', 'monospace';
  color: #eaf6fb;
  position: relative;
  border: 1.5px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(12px);
  transition: box-shadow 0.2s;
  animation: popIn 0.25s cubic-bezier(.4,2,.6,1);
  @keyframes popIn {
    from { transform: scale(0.96); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  @media (max-width: 600px) {
    min-width: 0;
    width: 98vw;
    padding: 18px 4px 14px 4px;
    border-radius: 12px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  background: linear-gradient(135deg, rgba(255,255,255,0.10), rgba(0,0,0,0.10));
  border: none;
  color: #fff;
  font-size: 1.6rem;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.18s, transform 0.18s;
  &:hover {
    background: linear-gradient(135deg, rgba(255,255,255,0.18), rgba(0,0,0,0.18));
    transform: scale(1.08) rotate(8deg);
  }

  @media (max-width: 600px) {
    width: 44px;
    height: 44px;
    top: 8px;
    right: 8px;
    font-size: 2rem;
  }
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 1.45rem;
  color: #ffe066;
  margin-bottom: 18px;
  letter-spacing: 0.01em;
  text-shadow: 0 2px 8px rgba(0,0,0,0.22);
  text-align: center;
`;

const Pre = styled.pre`
  margin: 0;
  white-space: pre-wrap;
  line-height: 1.5;
  color: #aee9ff;
  font-size: 1.04rem;
  background: rgba(0,0,0,0.10);
  border-radius: 10px;
  padding: 18px 14px 14px 14px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08) inset;
  overflow-x: auto;
`;

export interface GambaResultModalProps {
  open: boolean;
  onClose: () => void;
}

export const GambaResultModal: React.FC<GambaResultModalProps> = ({ open, onClose }) => {
  const { gambaResult } = useContext(GambaResultContext);

  if (!open) return null;

  return ReactDOM.createPortal(
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 5L15 15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M15 5L5 15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </CloseButton>
        <Title>Gamba Result</Title>
        <Pre as="div">
          {!gambaResult ? (
            <div style={{ textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
              No game result available yet.<br />
              Play a game to see results here.
            </div>
          ) : (
            (() => {
            // Helper to safely get a string from a value (string, object, or undefined)
            const safeStr = (val: any) => {
              if (val == null) return 'N/A';
              if (typeof val === 'string') return val;
              if (typeof val === 'object' && typeof val.toString === 'function') return val.toString();
              return String(val);
            };
            const short = (val: any) => {
              const str = safeStr(val);
              return str.length > 10 ? str.slice(0, 6) + '...' + str.slice(-4) : str;
            };
            // Import TOKEN_METADATA dynamically to avoid circular deps
            let tokenMeta;
            try {
              // eslint-disable-next-line @typescript-eslint/no-var-requires
              tokenMeta = require('../constants').TOKEN_METADATA;
            } catch (e) {
              tokenMeta = [];
            }
            // Find token meta by mint (string or PublicKey)
            const getTokenMeta = (mint: any) => {
              if (!mint) return undefined;
              const mintStr = typeof mint === 'string' ? mint : (typeof mint.toBase58 === 'function' ? mint.toBase58() : mint.toString());
              return tokenMeta.find((t: any) => {
                const tMint = typeof t.mint === 'string' ? t.mint : (typeof t.mint.toBase58 === 'function' ? t.mint.toBase58() : t.mint.toString());
                return tMint === mintStr;
              });
            };
            const token = getTokenMeta(gambaResult.token);
            const decimals = token?.decimals ?? 9;
            const symbol = token?.symbol ?? '';
            const formatAmount = (amount: number | undefined) =>
              typeof amount === 'number'
                ? `${(amount / Math.pow(10, decimals)).toLocaleString(undefined, { maximumFractionDigits: decimals })} ${symbol}`
                : 'N/A';
            return <>
              <div><strong>User:</strong> {short(gambaResult.user)}</div>
              <div><strong>Creator:</strong> {short(gambaResult.creator)}</div>
              <div><strong>Token:</strong> {short(gambaResult.token)}</div>
              <div><strong>Bet Used:</strong> {
                Array.isArray(gambaResult.bet) && typeof gambaResult.resultIndex === 'number' && gambaResult.bet[gambaResult.resultIndex] !== undefined
                  ? gambaResult.bet[gambaResult.resultIndex]
                  : 'N/A'
              }</div>
              <div><strong>Result Index:</strong> {typeof gambaResult.resultIndex === 'number' ? gambaResult.resultIndex : 'N/A'}</div>
              <div><strong>Wager:</strong> {formatAmount(gambaResult.wager)}</div>
              <div><strong>Payout:</strong> {formatAmount(gambaResult.payout)}</div>
              <div><strong>Profit:</strong> {formatAmount(gambaResult.profit)}</div>
              <div><strong>Multiplier:</strong> {typeof gambaResult.multiplier === 'number' ? gambaResult.multiplier : 'N/A'}</div>
              <div><strong>Bonus Used:</strong> {typeof gambaResult.bonusUsed === 'number' ? gambaResult.bonusUsed : 'N/A'}</div>
              <div><strong>Jackpot Win:</strong> {typeof gambaResult.jackpotWin === 'number' ? gambaResult.jackpotWin : 'N/A'}</div>
              <div><strong>Client Seed:</strong> {safeStr(gambaResult.clientSeed)}</div>
              <div><strong>Nonce:</strong> {typeof gambaResult.nonce === 'number' ? gambaResult.nonce : 'N/A'}</div>
              <div><strong>RNG Seed:</strong> {safeStr(gambaResult.rngSeed)}</div>
            </>;
            })()
          )}
        </Pre>
      </ModalContent>
    </ModalOverlay>,
    document.body
  );
};
  export default GambaResultModal;
