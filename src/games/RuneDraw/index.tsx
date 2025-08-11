import React, { useState, useContext } from 'react';
import { GambaUi, useWagerInput, useCurrentToken, useTokenBalance } from 'gamba-react-ui-v2';
import { TOKEN_METADATA } from '../../constants';
import { GameControls, GameScreenLayout } from '../../components';
import { useGameOutcome } from '../../hooks/useGameOutcome';
import { useIsCompact } from '../../hooks/useIsCompact';
import { GambaResultContext } from '../../context/GambaResultContext';
import { betArray } from './betArray';

const RUNES = [
  { color: '#FFD700', label: 'Sun' },
  { color: '#00BFFF', label: 'Water' },
  { color: '#FF69B4', label: 'Heart' },
  { color: '#7CFC00', label: 'Leaf' },
  { color: '#A9A9A9', label: 'Stone' },
];

export default function RuneDraw() {
  const { setGambaResult } = useContext(GambaResultContext);
  const [wager, setWager] = useWagerInput();
  const token = useCurrentToken();
  const { balance } = useTokenBalance();
  const game = GambaUi.useGame();
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedRune, setSelectedRune] = useState<number | null>(null);
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
  const playButtonText = hasPlayedBefore && !showOutcome ? 'Play Again' : 'Draw';
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
    if (selectedRune === null) return;
    setIsPlaying(true);
    setResult(null);
    setPayout(null);
    const bet = betArray.map((_, i) => (i === selectedRune ? 1 : 0));
    // Simulate result: pick a random rune (in real game, use Gamba RNG)
    const rngIndex = Math.floor(Math.random() * betArray.length);
    const win = rngIndex === selectedRune;
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
              Rune Draw ✨
            </h2>
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              {RUNES.map((rune, i) => {
                // Use a rune-like polygon and add a rune symbol for each
                const gradient = `radial-gradient(ellipse at 60% 40%, #fff6 0%, ${rune.color} 80%, #222 100%)`;
                // SVGs for rune-like engravings, centered and styled for a rune look
                const symbol = [
                  // Sun
                  <svg width="32" height="32" viewBox="0 0 32 32" key="sun"><ellipse cx="16" cy="16" rx="8" ry="8" fill="#FFD700" stroke="#fff" strokeWidth="2"/><g stroke="#fff" strokeWidth="2">{Array.from({length:8}).map((_,j)=>(<line key={j} x1={16} y1={4} x2={16} y2={10} transform={`rotate(${j*45} 16 16)`}/>))}</g></svg>,
                  // Water
                  <svg width="32" height="32" viewBox="0 0 32 32" key="water"><ellipse cx="16" cy="20" rx="7" ry="6" fill="#00BFFF" stroke="#fff" strokeWidth="2"/><path d="M10 18 Q16 10 22 18" fill="none" stroke="#fff" strokeWidth="2"/></svg>,
                  // Heart
                  <svg width="32" height="32" viewBox="0 0 32 32" key="heart"><ellipse cx="16" cy="20" rx="7" ry="8" fill="#FF69B4" stroke="#fff" strokeWidth="2"/><path d="M12 18 Q16 12 20 18" fill="none" stroke="#fff" strokeWidth="2"/></svg>,
                  // Leaf
                  <svg width="32" height="32" viewBox="0 0 32 32" key="leaf"><ellipse cx="16" cy="20" rx="7" ry="8" fill="#7CFC00" stroke="#fff" strokeWidth="2"/><path d="M16 12 Q18 16 16 28 Q14 16 16 12 Z" fill="#fff6" stroke="#fff" strokeWidth="1"/></svg>,
                  // Stone
                  <svg width="32" height="32" viewBox="0 0 32 32" key="stone"><ellipse cx="16" cy="20" rx="8" ry="9" fill="#A9A9A9" stroke="#fff" strokeWidth="2"/></svg>,
                ];
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedRune(i)}
                    disabled={isPlaying || showOutcome}
                    style={{
                      width: 64,
                      height: 90,
                      background: gradient,
                      border: selectedRune === i ? '3px solid #fff' : '2px solid #333',
                      color: '#222',
                      fontWeight: 700,
                      fontSize: 18,
                      cursor: 'pointer',
                      boxShadow: selectedRune === i ? '0 0 18px 4px #fff8' : '0 2px 8px #0003',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      clipPath: 'ellipse(48% 44% at 50% 55%)',
                      WebkitClipPath: 'ellipse(48% 44% at 50% 55%)',
                      borderRadius: '50% / 45%',
                      overflow: 'hidden',
                    }}
                  >
                    <span style={{ marginBottom: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{symbol[i]}</span>
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
                Result: <b>{RUNES[result].label}</b> {payout && payout > 0 ? `✅ You won ${payout / Math.pow(10, token?.decimals || 0)} ${token?.symbol}` : '❌ You lost'}
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
          playButtonDisabled={selectedRune === null}
        />
      }
    />
  );
}
