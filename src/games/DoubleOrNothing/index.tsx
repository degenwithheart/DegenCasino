import { GambaUi, useSound, useWagerInput, useCurrentToken, useTokenBalance, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import React from 'react'
import { GameControls } from '../../components'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import { useGambaResult } from '../../hooks/useGambaResult'
import { GameStateProvider, useGameState } from '../../hooks/useGameState'
import { useIsCompact } from '../../hooks/useIsCompact';
import SOUND from './test.mp3'
import { ModernWagerInput } from '../../components/ModernWagerInput';
import { TOKEN_METADATA } from '../../constants'
import DoubleOrNothingPaytable, { DoubleOrNothingPaytableRef } from './DoubleOrNothingPaytable'
import { DoubleOrNothingOverlays } from './DoubleOrNothingOverlays'
import { renderThinkingOverlay, getThinkingPhaseState, getGamePhaseState } from '../../utils/overlayUtils'

const MODES = [
  { label: '2x', bet: [1.9, 0], labels: ['Double!', 'Nothing'] },
  { label: '3x', bet: [0, 0, 2.85], labels: ['Triple!', 'Nothing'] }, // 1/3 chance to win
  { label: '10x', bet: [0, 0, 0, 0, 0, 0, 0, 0, 0, 9.5], labels: ['Degen!', 'Nothing'] }, // 1/10 chance to win
];

function DoubleOrNothing() {
  return (
    <GameStateProvider>
      <DoubleOrNothingGame />
    </GameStateProvider>
  )
}

function DoubleOrNothingGame() {
  const { gamePhase, setGamePhase } = useGameState()
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
  const paytableRef = React.useRef<DoubleOrNothingPaytableRef>(null)
  const [currentRound, setCurrentRound] = React.useState(1)
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
  } = useGameOutcome()

  // Dynamic play button text
  const playButtonText = hasPlayedBefore && !showOutcome ? "Restart" : "Start"

  // Gamba result storage
  const { storeResult, gambaResult } = useGambaResult();

  // Overlay states
  const [thinkingPhase, setThinkingPhase] = React.useState(false)
  const [dramaticPause, setDramaticPause] = React.useState(false)
  const [celebrationIntensity, setCelebrationIntensity] = React.useState(1)
  const [thinkingEmoji, setThinkingEmoji] = React.useState('💰')

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
    // Start thinking phase
    setGamePhase('thinking')
    setThinkingPhase(true)
    setThinkingEmoji(['💰', '💭', '🎯', '💸'][Math.floor(Math.random() * 4)])
    
    setIsPlaying(true);
    setResult(null);
    setPayout(null);
    
    const selectedMode = mode
    const modeChoice = selectedMode === 0 ? 'double' : selectedMode === 1 ? 'triple' : 'degen'
    
    await game.play({ wager, bet: MODES[mode].bet });
    const res = await game.result()

    // Store result in context for modal
    storeResult(res);
    setResult(res.resultIndex);
    setPayout(res.payout);
    setIsPlaying(false);
    
    // Dramatic pause phase
    setGamePhase('dramatic')
    setDramaticPause(true)
    
    // Wait for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const win = res.resultIndex === 0
    const choiceType = mode === 0 ? 'double' : mode === 1 ? 'triple' : 'degen'
    
    // Track game result in paytable
    paytableRef.current?.trackGame({
      choice: choiceType,
      result: win ? choiceType : 'nothing',
      wasWin: win,
      amount: win ? res.payout - wager : 0,
      multiplier: win ? res.payout / wager : 0,
      currentRound: currentRound,
    })
    
    if (win) {
      setCurrentRound(prev => prev + 1)
    } else {
      setCurrentRound(1)
    }
    
    // Set celebration intensity based on win amount
    if (win) {
      const multiplier = res.payout / wager
      if (multiplier >= 10) {
        setCelebrationIntensity(3) // Epic win
      } else if (multiplier >= 3) {
        setCelebrationIntensity(2) // Big win
      } else {
        setCelebrationIntensity(1) // Regular win
      }
      setGamePhase('celebrating')
    } else {
      setGamePhase('mourning')
    }
    
    // Handle game outcome for overlay
    handleGameComplete({ payout: res.payout, wager });
    sound.play('test', { playbackRate: res.resultIndex === 0 ? 1.2 : 0.8 });
    
    // Reset to idle after celebration/mourning
    setTimeout(() => {
      setGamePhase('idle')
    }, 3000)
  };

  // Format payout using token decimals for real value
  const formatPayout = (payout: number | null) => {
    if (payout === null || !token) return '-';
    return (payout / Math.pow(10, token.decimals)).toLocaleString(undefined, { maximumFractionDigits: token.decimals });
  };

  return (
    <>
      <GambaUi.Portal target="screen">
        <div style={{ display: 'flex', gap: 16, height: '100%', width: '100%' }}>
          {/* Main Game Area */}
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 25%, #06b6d4 50%, #0ea5e9 75%, #bae6fd 100%)',
            borderRadius: '24px',
            border: '3px solid rgba(6, 182, 212, 0.3)',
            boxShadow: `
              0 25px 50px rgba(0, 0, 0, 0.5),
              inset 0 2px 4px rgba(255, 255, 255, 0.1),
              inset 0 -2px 4px rgba(0, 0, 0, 0.3),
              0 0 30px rgba(6, 182, 212, 0.2)
            `,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Floating double or nothing background elements */}
            <div style={{
              position: 'absolute',
              top: '10%',
              left: '8%',
              fontSize: '120px',
              opacity: 0.08,
              transform: 'rotate(-20deg)',
              pointerEvents: 'none',
              color: '#06b6d4'
            }}>💰</div>
            <div style={{
              position: 'absolute',
              bottom: '12%',
              right: '10%',
              fontSize: '100px',
              opacity: 0.06,
              transform: 'rotate(25deg)',
              pointerEvents: 'none',
              color: '#0ea5e9'
            }}>🎲</div>
            <div style={{
              position: 'absolute',
              top: '45%',
              right: '15%',
              fontSize: '90px',
              opacity: 0.07,
              transform: 'rotate(-30deg)',
              pointerEvents: 'none',
              color: '#14b8a6'
            }}>💎</div>
            <div style={{
              position: 'absolute',
              bottom: '40%',
              left: '12%',
              fontSize: '80px',
              opacity: 0.05,
              transform: 'rotate(35deg)',
              pointerEvents: 'none',
              color: '#bae6fd'
            }}>⚡</div>

            {/* Background Effects */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at 50% 50%, ${
                mode === 0 ? 'rgba(16, 185, 129, 0.1)' :
                mode === 1 ? 'rgba(251, 191, 36, 0.1)' :
                'rgba(239, 68, 68, 0.1)'
              } 0%, transparent 50%)`,
              opacity: isPlaying ? 1 : 0.5,
              transition: 'opacity 0.5s ease'
            }} />

            {/* Mode Selection */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              zIndex: 10
            }}>
              {MODES.map((modeOption, index) => (
                <button
                  key={index}
                  onClick={() => setMode(index)}
                  disabled={isPlaying}
                  style={{
                    background: mode === index 
                      ? index === 0 ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.3) 100%)'
                        : index === 1 ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(245, 158, 11, 0.3) 100%)'
                        : 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.3) 100%)'
                      : 'rgba(0, 0, 0, 0.5)',
                    border: mode === index 
                      ? index === 0 ? '2px solid rgba(16, 185, 129, 0.5)'
                        : index === 1 ? '2px solid rgba(251, 191, 36, 0.5)'
                        : '2px solid rgba(239, 68, 68, 0.5)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '8px 16px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: isPlaying ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: isPlaying ? 0.6 : 1
                  }}
                >
                  {modeOption.label} ({modeOption.bet[0]}x)
                </button>
              ))}
            </div>

            {/* Animated Canvas */}
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
                  { glow: 0.12, orb: 32, color: '#10B981', bg: [160, 80, 55], shadow: '#10B981' }, // Double
                  { glow: 0.18, orb: 40, color: '#FBBF24', bg: [45, 90, 60], shadow: '#FBBF24' }, // Triple
                  { glow: 0.28, orb: 52, color: '#EF4444', bg: [0, 100, 60], shadow: '#EF4444' }, // Degen
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

            {/* Result Display */}
            {result !== null && (
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0, 0, 0, 0.8)',
                borderRadius: '16px',
                padding: '16px 24px',
                border: `2px solid ${result === 0 ? '#10B981' : '#EF4444'}`,
                backdropFilter: 'blur(10px)',
                textAlign: 'center',
                minWidth: '200px'
              }}>
                <div style={{
                  color: result === 0 ? '#10B981' : '#EF4444',
                  fontSize: '24px',
                  fontWeight: 900,
                  marginBottom: '8px'
                }}>
                  {result === 0 ? MODES[mode].labels[0] + ' 🎉' : MODES[mode].labels[1] + ' 💀'}
                </div>
                <div style={{ 
                  color: '#9CA3AF', 
                  fontSize: '12px', 
                  fontWeight: 600,
                  marginBottom: '4px'
                }}>
                  PAYOUT
                </div>
                <div style={{ 
                  color: '#FCD34D', 
                  fontSize: '18px', 
                  fontWeight: 700 
                }}>
                  {formatPayout(payout)} {token?.symbol}
                </div>
              </div>
            )}

            {/* Round Counter */}
            <div style={{
              position: 'absolute',
              top: '80px',
              right: '20px',
              background: 'rgba(0, 0, 0, 0.7)',
              borderRadius: '12px',
              padding: '8px 16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 600 }}>
                ROUND
              </div>
              <div style={{ color: '#FCD34D', fontSize: '18px', fontWeight: 700 }}>
                {currentRound}
              </div>
            </div>
          </div>

          {/* Live Paytable */}
          <DoubleOrNothingPaytable
            ref={paytableRef}
            wager={wager}
            selectedChoice={mode === 0 ? 'double' : mode === 1 ? 'triple' : 'degen'}
            currentRound={currentRound}
          />
        </div>
      </GambaUi.Portal>
      
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={play}
        isPlaying={isPlaying}
        showOutcome={showOutcome}
        playButtonText={hasPlayedBefore ? 'Restart' : 'Play'}
        onPlayAgain={handlePlayAgain}
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
      {renderThinkingOverlay(
        <DoubleOrNothingOverlays 
        gamePhase={getGamePhaseState(gamePhase)}
        thinkingPhase={getThinkingPhaseState(thinkingPhase)}
        dramaticPause={dramaticPause}
        celebrationIntensity={celebrationIntensity}
        thinkingEmoji={thinkingEmoji}
      
                result={gambaResult}
                currentBalance={balance}
                wager={wager}
              />
        )}
    </>
  );
}

export default DoubleOrNothing;
