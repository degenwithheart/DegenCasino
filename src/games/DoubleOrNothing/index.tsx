import { GambaUi, useSound, useWagerInput, useCurrentToken, useTokenBalance, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import React from 'react'
import { GameControls, GameScreenLayout } from '../../components'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import { useIsCompact } from '../../hooks/useIsCompact';
import SOUND from './test.mp3'
import { ModernWagerInput } from '../../components/ModernWagerInput';
import { TOKEN_METADATA } from '../../constants'

const MODES = [
  { label: '2x', bet: [2, 0], labels: ['Double!', 'Nothing'] },
  { label: '3x', bet: [3, 0], labels: ['Triple!', 'Nothing'] },
  { label: '10x', bet: [10, 0], labels: ['Degen!', 'Nothing'] },
];

function DoubleOrNothing() {
  const isCompact = useIsCompact();
  const scalerRef = React.useRef<HTMLDivElement>(null);
  const _hue = React.useRef(0);
  const [wager, setWager] = useWagerInput();
  const [scale, setScale] = React.useState(isCompact ? 1 : 1.2);

  React.useEffect(() => {
    setScale(isCompact ? 1 : 1.2);
  }, [isCompact]);
  const game = GambaUi.useGame();
  const sound = useSound({ test: SOUND });
  const [result, setResult] = React.useState<number | null>(null);
  const [payout, setPayout] = React.useState<number | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [mode, setMode] = React.useState(0);
  const token = useCurrentToken();
  const { balance } = useTokenBalance();
  const tokenMeta = token ? TOKEN_METADATA.find(t => t.symbol === token.symbol) : undefined;
  const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals) : 1);
  const maxWager = baseWager * 1000000;
  const tokenPrice = tokenMeta?.usdPrice ?? 0;

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

  const click = () => {
    _hue.current = (_hue.current + 30) % 360;
    sound.play('test', { playbackRate: .75 + Math.random() * .5 });
  };

  const play = async () => {
    setIsPlaying(true);
    setResult(null);
    setPayout(null);
    await game.play({ wager, bet: MODES[mode].bet });
    const res = await game.result();
    setResult(res.resultIndex);
    setPayout(res.payout);
    setIsPlaying(false);
    // Handle game outcome for overlay
    handleGameComplete({ payout: res.payout, wager });
    sound.play('test', { playbackRate: res.resultIndex === 0 ? 1.2 : 0.8 });
  };

  // Format payout using token decimals for real value
  const formatPayout = (payout: number | null) => {
    if (payout === null || !token) return '-';
    return (payout / Math.pow(10, token.decimals)).toLocaleString(undefined, { maximumFractionDigits: token.decimals });
  };

  return (
    <>
      <GambaUi.Portal target="screen">
        <GameScreenLayout
          left={
            <div
              ref={scalerRef}
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'center',
                width: '100%',
                height: '100%',
                minHeight: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s ease-out',
              }}
              className="doubleornothing-game-scaler"
            >
              <div className="doubleornothing-container" style={{ width: isCompact ? '100%' : 600 }}>
                <div style={{
                  flex: 1,
                  position: 'relative',
                  height: '100%',
                  minHeight: 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <GambaUi.Canvas
                    style={{
                      width: '100%',
                      height: '100%',
                      minHeight: 400,
                      display: 'block',
                    }}
                    render={({ ctx, size }, clock) => {
                      const scale = 3 + Math.cos(clock.time) * .5;
                      const hue = _hue.current;
                      ctx.clearRect(0, 0, size.width, size.height);
                      // Mode-based intensity
                      const modeIntensity = [
                        { glow: 0.12, orb: 32, color: '#00ffe1', bg: [hue, 80, 55], shadow: '#00ffe1' }, // Double
                        { glow: 0.18, orb: 40, color: '#ffb300', bg: [hue + 40, 90, 60], shadow: '#ffb300' }, // Triple
                        { glow: 0.28, orb: 52, color: '#ff0055', bg: [hue + 80, 100, 60], shadow: '#ff0055' }, // Degen
                      ][mode];
                      // Animated glowing background, more layers for higher intensity
                      for (let i = 0; i < 8 + mode * 4; i++) {
                        ctx.save();
                        ctx.globalAlpha = modeIntensity.glow + 0.04 * Math.sin(clock.time * (2 + mode) + i);
                        ctx.fillStyle = `hsla(${modeIntensity.bg[0] + i * 20}, ${modeIntensity.bg[1]}%, ${modeIntensity.bg[2]}%, 1)`;
                        ctx.beginPath();
                        ctx.arc(size.width / 2, size.height / 2, 60 + i * (18 + mode * 2) + Math.sin(clock.time + i) * (8 + mode * 2), 0, Math.PI * 2);
                        ctx.fill();
                        ctx.restore();
                      }
                      ctx.save();
                      ctx.translate(size.width / 2, size.height / 2);
                      // Central glowing orb, bigger and more vibrant for harder modes
                      ctx.shadowColor = modeIntensity.shadow;
                      ctx.shadowBlur = modeIntensity.orb;
                      ctx.fillStyle = modeIntensity.color;
                      ctx.beginPath();
                      ctx.arc(0, 0, modeIntensity.orb + Math.sin(clock.time * (2 + mode)) * (4 + mode * 2), 0, Math.PI * 2);
                      ctx.fill();
                      ctx.shadowBlur = 0;
                      // Result text
                      ctx.textAlign = 'center';
                      ctx.textBaseline = 'middle';
                      ctx.font = result !== null ? `bold ${48 + mode * 8}px Arial` : '32px Arial';
                      ctx.fillStyle = result === 0 ? modeIntensity.color : result === 1 ? '#f00' : '#fff';
                      if (isPlaying || result === null) {
                        ctx.fillStyle = '#fff';
                        ctx.font = '32px Arial';
                        ctx.fillText('Spinning...', 0, 0);
                      }
                      ctx.restore();
                    }}
                  />
                  {result !== null && (
                    <div style={{
                      position: 'absolute',
                      top: '62%',
                      left: '50%',
                      transform: 'translate(-50%, 0)',
                      color: result === 0 ? '#00ffe1' : '#f00',
                      fontSize: 32,
                      fontWeight: 'bold',
                      textShadow: '0 2px 16px #000, 0 0 8px #00ffe1',
                      textAlign: 'center',
                      padding: '12px 0',
                      borderRadius: 8,
                      background: 'rgba(24,24,24,0.7)',
                      minWidth: 180,
                    }}>
                      {result === 0 ? MODES[mode].labels[0] + ' 🎉' : MODES[mode].labels[1] + ' 💀'}
                      <br />
                      <span style={{ fontSize: 22, color: '#fff', fontWeight: 500 }}>
                        Payout: <span style={{ color: '#00ffe1', fontWeight: 700 }}>{formatPayout(payout)} {token?.symbol}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          }
          right={
            <div style={{ minWidth: 200, maxWidth: 220, marginLeft: 16, background: 'rgba(24,24,42,0.92)', borderRadius: 14, padding: '8px 4px', boxShadow: '0 2px 12px #0004', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ textAlign: 'center', marginBottom: 8, fontWeight: 700, color: '#ffe066', fontSize: '1rem' }}>Payouts</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                {MODES.map((m, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', background: idx === mode ? '#23234a' : 'transparent', borderRadius: 6, padding: '4px 8px', fontWeight: idx === mode ? 900 : 500, color: idx === mode ? '#ffe066' : '#fff', fontSize: 15 }}>
                    <span>{m.label}</span>
                    <span style={{ fontWeight: 900 }}>{m.bet[0]}x</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 12, color: '#bbb', textAlign: 'center', marginTop: 8 }}>
                Select a mode and try to double, triple, or 10x your wager!
              </div>
            </div>
          }
        />
      </GambaUi.Portal>
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={play}
        isPlaying={isPlaying}
        playButtonText={hasPlayedBefore ? 'Play Again' : 'Play'}
      >
        {/* Mode Selection */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold' }}>Mode:</span>
          {MODES.map((modeOption, index) => (
            <GambaUi.Button
              key={index}
              onClick={() => setMode(index)}
              disabled={isPlaying || showOutcome}
            >
              {mode === index ? `[${modeOption.label}]` : modeOption.label}
            </GambaUi.Button>
          ))}
        </div>
      </GameControls>
    </>
  );
}

export default DoubleOrNothing;
