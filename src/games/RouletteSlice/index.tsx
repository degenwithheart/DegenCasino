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
import SliceWheel from './SliceWheel';


export default function RouletteSlice() {
  const { setGambaResult } = useContext(GambaResultContext);
  const [wager, setWager] = useWagerInput();
  const token = useCurrentToken();
  const { balance } = useTokenBalance();
  const game = GambaUi.useGame();
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSlice, setSelectedSlice] = useState<number | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [payout, setPayout] = useState<number | null>(null);

  // Ensure the wheel spins every time a wager is placed
  const handleWager = (i: number) => {
    setSelectedSlice(i);
    setResult(null); // Reset result to trigger spin
  };
  const {
    showOutcome,
    hasPlayedBefore,
    handleGameComplete,
    handlePlayAgain,
    isWin,
    profitAmount,
  } = useGameOutcome();
  const playButtonText = hasPlayedBefore && !showOutcome ? 'Play Again' : 'Spin';
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
  const [scale, setScale] = useState(compact ? 0.7 : 1);
  useEffect(() => { setScale(compact ? 0.7 : 1); }, [compact]);

  // Simulate a random result for demo; replace with Gamba RNG for production
  const play = async () => {
    if (showOutcome) {
      handlePlayAgain();
      return;
    }
    if (selectedSlice === null) return;
    setIsPlaying(true);
    setResult(null);
    setPayout(null);
    // Build bet array: 1 for selected, 0 for others
    const bet = betArray.map((_, i) => (i === selectedSlice ? 1 : 0));
    // Simulate result: pick a random slice (in real game, use Gamba RNG)
    const rngIndex = Math.floor(Math.random() * betArray.length);
    const win = rngIndex === selectedSlice;
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
              Roulette Slice 🎯
            </h2>
            {/* Wheel visualization and slice selection */}
            <div style={{ marginBottom: 24 }}>
              <SliceWheel winningNumber={result ?? 0} />
              <div style={{
                display: 'flex',
                gap: 8,
                marginTop: 16,
                justifyContent: 'center',
                flexWrap: 'wrap',
                maxWidth: 400,
              }}>
                {Array.from({ length: 37 }, (_, i: number) => i).map((number: number, i: number) => (
                  <button
                    key={number}
                    onClick={() => handleWager(i)}
                    disabled={isPlaying || showOutcome}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: selectedSlice === i ? '2px solid #00ffe1' : '2px solid #333',
                      background: selectedSlice === i ? '#222' : '#111',
                      color: selectedSlice === i ? '#00ffe1' : '#fff',
                      fontWeight: 700,
                      fontSize: 16,
                      cursor: 'pointer',
                      boxShadow: selectedSlice === i ? '0 0 8px #00ffe1' : 'none',
                      transition: 'all 0.2s',
                      marginBottom: 8,
                    }}
                  >
                    {number}
                    <div style={{ fontSize: 12, color: '#ffe066' }}>
                      x{betArray[i] ?? 1}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            {result !== null && (
              <div style={{ fontSize: 20, marginTop: 16 }}>
                Result: <b>Slice {result + 1}</b> {payout && payout > 0 ? `✅ You won ${payout / Math.pow(10, token?.decimals || 0)} ${token?.symbol}` : '❌ You lost'}
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
          playButtonDisabled={selectedSlice === null}
        />
      }
    />
  );
}
