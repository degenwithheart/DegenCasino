import React, { useState, useContext } from 'react';
import { GambaUi, useWagerInput, useCurrentToken, useTokenBalance } from 'gamba-react-ui-v2';
import { TOKEN_METADATA } from '../../constants';
import { GameControls, GameScreenLayout } from '../../components';
import { useGameOutcome } from '../../hooks/useGameOutcome';
import { useIsCompact } from '../../hooks/useIsCompact';
import { GambaResultContext } from '../../context/GambaResultContext';
import { betArray } from './betArray';

const SHARDS = [
  { color: '#FFD700', label: 'Gold' },
  { color: '#00BFFF', label: 'Blue' },
  { color: '#FF69B4', label: 'Pink' },
  { color: '#7CFC00', label: 'Green' },
  { color: '#A9A9A9', label: 'Gray' },
];

export default function PrismPicker() {
  const { setGambaResult } = useContext(GambaResultContext);
  const [wager, setWager] = useWagerInput();
  const token = useCurrentToken();
  const { balance } = useTokenBalance();
  const game = GambaUi.useGame();
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedShard, setSelectedShard] = useState<number | null>(null);
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
  const playButtonText = hasPlayedBefore && !showOutcome ? 'Play Again' : 'Pick';
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
    if (selectedShard === null) return;
    setIsPlaying(true);
    setResult(null);
    setPayout(null);
    const bet = betArray.map((_, i) => (i === selectedShard ? 1 : 0));
    // Simulate result: pick a random shard (in real game, use Gamba RNG)
    const rngIndex = Math.floor(Math.random() * betArray.length);
    const win = rngIndex === selectedShard;
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
              Prism Picker 🔮
            </h2>
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              {SHARDS.map((shard, i) => {
                // Create a vertical gradient for depth
                const gradient = `linear-gradient(135deg, ${shard.color} 70%, #fff3 100%)`;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedShard(i)}
                    disabled={isPlaying || showOutcome}
                    style={{
                      width: 60,
                      height: 100,
                      background: gradient,
                      border: selectedShard === i ? '3px solid #fff' : '2px solid #333',
                      color: '#222',
                      fontWeight: 700,
                      fontSize: 18,
                      cursor: 'pointer',
                      boxShadow: selectedShard === i ? '0 0 18px 4px #fff8' : '0 2px 8px #0003',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      clipPath: 'polygon(50% 0%, 90% 15%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 15%)',
                      WebkitClipPath: 'polygon(50% 0%, 90% 15%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 15%)',
                      borderRadius: 12,
                      overflow: 'hidden',
                    }}
                  >
                    <span style={{
                      fontSize: 22,
                      fontWeight: 700,
                      textShadow: '0 1px 4px #fff8, 0 0px 2px #0006',
                      marginBottom: 2,
                    }}>{shard.label}</span>
                    <span style={{
                      fontSize: 14,
                      color: '#fff',
                      fontWeight: 400,
                      textShadow: '0 1px 4px #0008',
                    }}>x{betArray[i]}</span>
                  </button>
                );
              })}
            </div>
            {result !== null && (
              <div style={{ fontSize: 20, marginTop: 16 }}>
                Result: <b>{SHARDS[result].label}</b> {payout && payout > 0 ? `✅ You won ${payout / Math.pow(10, token?.decimals || 0)} ${token?.symbol}` : '❌ You lost'}
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
          playButtonDisabled={selectedShard === null}
        />
      }
    />
  );
}
