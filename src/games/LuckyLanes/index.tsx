import React, { useState, useContext } from 'react';
import { GambaUi, useWagerInput, useCurrentToken, useTokenBalance } from 'gamba-react-ui-v2';
import { TOKEN_METADATA } from '../../constants';
import { GameControls, GameScreenLayout } from '../../components';
import { useGameOutcome } from '../../hooks/useGameOutcome';
import { useIsCompact } from '../../hooks/useIsCompact';
import { GambaResultContext } from '../../context/GambaResultContext';
import { betArray } from './betArray';

const LANES = [
  { color: '#00ffe1', label: 'Lane 1' },
  { color: '#ff00c8', label: 'Lane 2' },
  { color: '#ffe066', label: 'Lane 3' },
  { color: '#00bfff', label: 'Lane 4' },
  { color: '#222', label: 'Lane 5' },
];

export default function LuckyLanes() {
  const { setGambaResult } = useContext(GambaResultContext);
  const [wager, setWager] = useWagerInput();
  const token = useCurrentToken();
  const { balance } = useTokenBalance();
  const game = GambaUi.useGame();
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLane, setSelectedLane] = useState<number | null>(null);
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
  const playButtonText = hasPlayedBefore && !showOutcome ? 'Play Again' : 'Roll';
  const tokenMeta = token ? TOKEN_METADATA.find((t) => t.symbol === token.symbol) : undefined;
  const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals) : 1);
  const { compact } = useIsCompact();
  const [scale, setScale] = useState(compact ? 1 : 1.3);
  React.useEffect(() => { setScale(compact ? 1 : 1.3); }, [compact]);

  const play = async () => {
    if (showOutcome) {
      handlePlayAgain();
      return;
    }
    if (selectedLane === null) return;
    setIsPlaying(true);
    setResult(null);
    setPayout(null);
    const bet = betArray.map((_, i) => (i === selectedLane ? 1 : 0));
    // Simulate result: pick a random lane (in real game, use Gamba RNG)
    const rngIndex = Math.floor(Math.random() * betArray.length);
    const win = rngIndex === selectedLane;
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
              Lucky Lanes 🏁
            </h2>
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              {LANES.map((lane, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedLane(i)}
                  disabled={isPlaying || showOutcome}
                  style={{
                    width: 60,
                    height: 120,
                    background: lane.color,
                    border: selectedLane === i ? '3px solid #fff' : '2px solid #333',
                    borderRadius: 16,
                    color: '#222',
                    fontWeight: 700,
                    fontSize: 18,
                    cursor: 'pointer',
                    boxShadow: selectedLane === i ? '0 0 12px #fff' : 'none',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: 24 }}>{lane.label}</span>
                  <span style={{ fontSize: 14, color: '#fff', fontWeight: 400 }}>x{betArray[i]}</span>
                </button>
              ))}
            </div>
            {result !== null && (
              <div style={{ fontSize: 20, marginTop: 16 }}>
                Result: <b>{LANES[result].label}</b> {payout && payout > 0 ? `✅ You won ${payout / Math.pow(10, token?.decimals || 0)} ${token?.symbol}` : '❌ You lost'}
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
          playButtonDisabled={selectedLane === null}
        />
      }
    />
  );
}
