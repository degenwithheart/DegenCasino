import {
  GambaUi,
  useWagerInput,
  useCurrentToken,
  useCurrentPool,
  FAKE_TOKEN_MINT,
  useTokenBalance,
} from 'gamba-react-ui-v2';
import { TOKEN_METADATA } from '../../constants';
import React, { useContext } from 'react';
import { GambaResultContext } from '../../context/GambaResultContext';
import { GameControls, GameScreenLayout } from '../../components';
import { useGameOutcome } from '../../hooks/useGameOutcome';
import { useIsCompact } from '../../hooks/useIsCompact';

// Pure function, accepts isCompact as argument
const getResponsiveScale = (isCompact: boolean): number => {
  if (typeof window === 'undefined') return 1;

  if (isCompact) return 1;

  const width = window.innerWidth;
  if (width <= 400) return 0.95;
  if (width <= 600) return 1.08;
  if (width <= 900) return 1.18;
  if (width <= 1200) return 1.28;
  if (width <= 1600) return 1.38;
  return 1.2;
};

export default function LuckyNumber() {
  const { setGambaResult } = useContext(GambaResultContext);
  const scalerRef = React.useRef<HTMLDivElement>(null);
  const { compact: isCompact } = useIsCompact(); // <-- extract only the boolean value
  const [scale, setScale] = React.useState(1);
  const [pick, setPick] = React.useState(1);
  const [wager, setWager] = useWagerInput();

  // Improved scaling effect with hard cap (475px)
  const updateScale = React.useCallback(() => {
    const responsiveScale = getResponsiveScale(isCompact);
    if (scalerRef.current) {
      scalerRef.current.style.transform = 'scale(1)';
      const naturalHeight = scalerRef.current.offsetHeight;
      const maxScale = 475 / naturalHeight;
      const finalScale = Math.min(responsiveScale, maxScale);
      scalerRef.current.style.transform = `scale(${finalScale})`;
      setScale(finalScale);
    } else {
      setScale(responsiveScale);
    }
  }, [isCompact]);

  React.useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
    };
  }, [updateScale]);

  const game = GambaUi.useGame();
  const [result, setResult] = React.useState<number | null>(null);
  const [payout, setPayout] = React.useState<number | null>(null);
  const pool = useCurrentPool();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const token = useCurrentToken();
  const { balance } = useTokenBalance();

  const tokenMeta = token
    ? TOKEN_METADATA.find((t: any) => t.symbol === token.symbol)
    : undefined;
  const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals) : 1);
  const tokenPrice = tokenMeta?.usdPrice ?? 0;
  const maxWager = baseWager * 1000000;

  const {
    showOutcome,
    hasPlayedBefore,
    handleGameComplete,
    handlePlayAgain,
    isWin,
    profitAmount,
  } = useGameOutcome();

  // Set default wager: 1 for free tokens, 0 for real tokens
  React.useEffect(() => {
    if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
      setWager(baseWager); // 1 token for free token
    } else {
      setWager(0); // 0 for real tokens
    }
  }, [setWager, token, baseWager]);

  const play = async () => {
    setIsPlaying(true);
    setResult(null);
    setPayout(null);
    const bet = Array(10).fill(0);
    bet[pick - 1] = 10;
    await game.play({ wager, bet });
    const res = await game.result();
    setGambaResult(res);
    setResult(res.resultIndex + 1);
    setPayout(res.payout);
    setIsPlaying(false);
    // Handle game outcome for overlay
    handleGameComplete({ payout: res.payout, wager });
  };

  const formatPayout = (payout: number | null) => {
    if (payout === null || !token) return '-';
    return (payout / Math.pow(10, token.decimals)).toLocaleString(undefined, {
      maximumFractionDigits: token.decimals,
    });
  };

  return (
    <GameScreenLayout
      left={
        <GambaUi.Portal target="screen">
          <div
            ref={scalerRef}
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'center',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s ease-out',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              {/* Main Game UI */}
              <div style={{ flex: 1, textAlign: 'center', marginTop: 32 }}>
                <h2 style={{ fontWeight: 700, fontSize: 32, marginBottom: 16 }}>🎯 Lucky Number</h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 24 }}>
                  {[...Array(10)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPick(i + 1)}
                      disabled={isPlaying}
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        background: pick === i + 1 ? '#00ffe1' : '#222',
                        color: pick === i + 1 ? '#222' : '#fff',
                        border: pick === i + 1 ? '2px solid #00ffe1' : '2px solid #333',
                        fontWeight: 700,
                        fontSize: 18,
                        boxShadow: pick === i + 1 ? '0 0 8px #00ffe1' : 'none',
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                {/* Result with reveal animation */}
                {result !== null && (
                  <div
                    style={{
                      fontSize: 28,
                      margin: '24px 0',
                      fontWeight: 600,
                      animation: 'reveal 0.7s cubic-bezier(.5,1.5,.5,1)',
                    }}
                  >
                    <span style={{ fontSize: 40 }}>🎱</span> Result: <b>{result}</b>
                    <br />
                    <span
                      style={{
                        color: payout ? '#00ffe1' : '#f00',
                        fontWeight: 700,
                        fontSize: 22,
                      }}
                    >
                      {payout ? `You win ${formatPayout(payout)} ${token?.symbol}!` : 'You lose.'}
                    </span>
                    <style>{`
                      @keyframes reveal {
                        0% { opacity: 0; transform: scale(0.7) translateY(20px); }
                        60% { opacity: 0.7; transform: scale(1.1) translateY(-8px); }
                        100% { opacity: 1; transform: scale(1) translateY(0); }
                      }
                    `}</style>
                  </div>
                )}
              </div>
            </div>
          </div>
        </GambaUi.Portal>
      }
      right={
        <>
          {/* Right-side payout info panel */}
          <div
            style={{
              minWidth: 180,
              maxWidth: 200,
              marginLeft: 24,
              background: 'rgba(24,24,42,0.92)',
              borderRadius: 14,
              padding: '12px 10px',
              boxShadow: '0 2px 12px #0004',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                textAlign: 'center',
                marginBottom: 8,
                fontWeight: 700,
                color: '#ffe066',
                fontSize: '1rem',
              }}
            >
              Payouts
            </div>
            <table style={{ width: '100%', fontSize: 15, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: '#aaa', fontWeight: 700, fontSize: 13 }}>
                  <th style={{ textAlign: 'center', padding: 2 }}>Number</th>
                  <th style={{ textAlign: 'center', padding: 2 }}>Payout</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(10)].map((_, i) => (
                  <tr
                    key={i + 1}
                    style={{
                      background: pick === i + 1 ? '#00ffe133' : 'none',
                      fontWeight: pick === i + 1 ? 700 : 400,
                    }}
                  >
                    <td style={{ textAlign: 'center', padding: 2 }}>{i + 1}</td>
                    <td
                      style={{
                        textAlign: 'center',
                        padding: 2,
                        color: pick === i + 1 ? '#00ffe1' : '#ffe066',
                      }}
                    >
                      x10
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 8, color: '#aaa', fontSize: 12, textAlign: 'center' }}>
              Pick a number. If it matches, you win 10x your wager!
            </div>
          </div>
          <GameControls
            wager={wager}
            setWager={setWager}
            onPlay={play}
            isPlaying={isPlaying}
            playButtonText={hasPlayedBefore ? 'Play Again' : 'Play'}
          >
            {/* Number Selection Display */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 'bold' }}>Lucky Number:</span>
              <span
                style={{
                  padding: '6px 12px',
                  background: '#00ffe1',
                  color: '#222',
                  borderRadius: 20,
                  fontWeight: 'bold',
                  fontSize: 16,
                }}
              >
                #{pick}
              </span>
            </div>
          </GameControls>
        </>
      }
    />
  );
}
