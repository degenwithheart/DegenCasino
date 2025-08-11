import React, { useContext, useState, useEffect } from 'react';
import {
  GambaUi,
  useWagerInput,
  useCurrentToken,
  useTokenBalance,
  FAKE_TOKEN_MINT,
} from 'gamba-react-ui-v2';
import { TOKEN_METADATA } from '../../constants';
import { GameControls, GameScreenLayout } from '../../components';
import { useGameOutcome } from '../../hooks/useGameOutcome';
import { useIsCompact } from '../../hooks/useIsCompact';
import { GambaResultContext } from '../../context/GambaResultContext';
import { betArray } from './betArray';

const TOTALS = [13, 14, 15, 16, 17, 18, 19, 20, 21];

export default function BlackJackRush() {
  const { setGambaResult } = useContext(GambaResultContext);
  const [wager, setWager] = useWagerInput();
  const token = useCurrentToken();
  const { balance } = useTokenBalance();
  const game = GambaUi.useGame();
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTotal, setSelectedTotal] = useState<number | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [payout, setPayout] = useState<number | null>(null);
  const {
    showOutcome,
    hasPlayedBefore,
    handleGameComplete,
    handlePlayAgain,
    isWin,
    profitAmount,
  } = useGameOutcome();
  const playButtonText = hasPlayedBefore && !showOutcome ? 'Play Again' : 'Play';
  const tokenMeta = token ? TOKEN_METADATA.find((t) => t.symbol === token.symbol) : undefined;
  const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals) : 1);
  useEffect(() => {
    if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
      setWager(baseWager);
    } else {
      setWager(0);
    }
  }, [setWager, token, baseWager]);
  const { compact } = useIsCompact();
  const [scale, setScale] = useState(compact ? 1 : 1.3);
  useEffect(() => { setScale(compact ? 1 : 1.3); }, [compact]);

  // Simulate a random result for demo; replace with Gamba RNG for production
  const play = async () => {
    if (showOutcome) {
      handlePlayAgain();
      return;
    }
    if (selectedTotal === null) return;
    setIsPlaying(true);
    setResult(null);
    setPayout(null);
    // Build bet array: 1 for selected, 0 for others
    const bet = betArray.map((_, i) => (i === selectedTotal - 13 ? 1 : 0));
    // Simulate result: pick a random total (in real game, use Gamba RNG)
    const rngIndex = Math.floor(Math.random() * betArray.length);
    const win = rngIndex === (selectedTotal - 13);
    const payoutAmount = win ? wager * betArray[rngIndex] : 0;
    setResult(rngIndex);
    setPayout(payoutAmount);
    setGambaResult({ resultIndex: rngIndex, payout: payoutAmount, bet });
    handleGameComplete({ payout: payoutAmount, wager });
    setIsPlaying(false);
  };

  return (
    <GameScreenLayout
      left={
        <GambaUi.Portal target="screen">
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'center',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              transition: 'transform 0.2s ease-out',
            }}
          >
            <h2 style={{ fontWeight: 700, fontSize: 32, marginBottom: 16 }}>
              BlackJack Rush 🃏
            </h2>
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              {TOTALS.map((total, i) => (
                <button
                  key={total}
                  onClick={() => setSelectedTotal(total)}
                  disabled={isPlaying || showOutcome}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: selectedTotal === total ? '2px solid #00ffe1' : '2px solid #333',
                    background: selectedTotal === total ? '#222' : '#111',
                    color: selectedTotal === total ? '#00ffe1' : '#fff',
                    fontWeight: 700,
                    fontSize: 18,
                    cursor: 'pointer',
                    boxShadow: selectedTotal === total ? '0 0 8px #00ffe1' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  {total}
                  <div style={{ fontSize: 12, color: '#ffe066' }}>x{betArray[i]}</div>
                </button>
              ))}
            </div>
            {result !== null && (
              <div style={{ fontSize: 20, marginTop: 16 }}>
                Result: <b>{TOTALS[result]}</b> {payout && payout > 0 ? `✅ You won ${payout / Math.pow(10, token?.decimals || 0)} ${token?.symbol}` : '❌ You lost'}
              </div>
            )}
          </div>
        </GambaUi.Portal>
      }
      right={
        <GameControls
          wager={wager}
          setWager={setWager}
          onPlay={play}
          isPlaying={isPlaying}
          playButtonText={playButtonText}
          playButtonDisabled={selectedTotal === null}
        />
      }
    />
  );
}
