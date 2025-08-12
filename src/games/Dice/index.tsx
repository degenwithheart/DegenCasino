import { BPS_PER_WHOLE } from 'gamba-core-v2';
import {
  FAKE_TOKEN_MINT,
  GambaUi,
  TokenValue,
  useCurrentPool,
  useCurrentToken,
  useSound,
  useWagerInput,
  useTokenBalance,
} from 'gamba-react-ui-v2';
import { TOKEN_METADATA } from '../../constants';
import { useGamba } from 'gamba-react-v2';
import React, { useRef } from 'react';
import Slider from './Slider';
import DiceOverlays from './DiceOverlays';
import DicePaytable, { DicePaytableRef } from './DicePaytable';
import { SOUND_LOSE, SOUND_PLAY, SOUND_TICK, SOUND_WIN } from './constants';
import { Container, Result, RollUnder, Stats } from './styles';
import { GameControls } from '../../components';
import { useIsCompact } from '../../hooks/useIsCompact';
import { renderThinkingOverlay, getThinkingPhaseState, getGamePhaseState } from '../../utils/overlayUtils'

const calculateArraySize = (odds: number): number => {
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  return 100 / gcd(100, odds);
};

export const outcomes = (odds: number) => {
  const arraySize = calculateArraySize(odds);
  const payout = (100 / odds).toFixed(4);

  let payoutArray = Array.from({ length: arraySize }).map((_, index) =>
    index < arraySize * (odds / 100) ? parseFloat(payout) : 0
  );

  const totalValue = payoutArray.reduce((acc, curr) => acc + curr, 0);

  if (totalValue > arraySize) {
    for (let i = payoutArray.length - 1; i >= 0; i--) {
      if (payoutArray[i] > 0) {
        payoutArray[i] -= totalValue - arraySize;
        payoutArray[i] = parseFloat(payoutArray[i].toFixed(4));
        break;
      }
    }
  }

  return payoutArray;
};

// Styled payout info panel (like Mines) - REMOVED, replaced with live paytable

export default function Dice() {
  const gamba = useGamba();
  const [wager, setWager] = useWagerInput();
  const token = useCurrentToken();
  const { balance } = useTokenBalance();
  const isCompact = useIsCompact();

  // Find token metadata for symbol display
  const tokenMeta = token
    ? TOKEN_METADATA.find((t: any) => t.symbol === token.symbol)
    : undefined;

  const pool = useCurrentPool();
  const [resultIndex, setResultIndex] = React.useState(-1);
  const [rollUnderIndex, setRollUnderIndex] = React.useState(Math.floor(100 / 2));
  const [isWin, setIsWin] = React.useState<boolean | null>(null);
  const [profitAmount, setProfitAmount] = React.useState(0);
  
  // Game phase management for overlays
  const [gamePhase, setGamePhase] = React.useState<'idle' | 'thinking' | 'dramatic' | 'celebrating' | 'mourning'>('idle');
  const [thinkingPhase, setThinkingPhase] = React.useState(false);
  const [dramaticPause, setDramaticPause] = React.useState(false);
  const [celebrationIntensity, setCelebrationIntensity] = React.useState(0);
  const [thinkingEmoji, setThinkingEmoji] = React.useState('🤔');
  
  // Live paytable tracking
  const paytableRef = useRef<DicePaytableRef>(null)
  const [currentResult, setCurrentResult] = React.useState<{
    rollValue: number
    targetValue: number
    multiplier: number
    wasWin: boolean
  } | undefined>()

  const sounds = useSound({
    win: SOUND_WIN,
    play: SOUND_PLAY,
    lose: SOUND_LOSE,
    tick: SOUND_TICK,
  });

  const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals ?? 0) : 1);

  // Set default wager: 1 for free tokens, 0 for real tokens
  React.useEffect(() => {
    if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
      setWager(baseWager); // 1 token for free token
    } else {
      setWager(0); // 0 for real tokens
    }
  }, [setWager, token, baseWager]);

  const multiplier =
    Number(BigInt(100 * BPS_PER_WHOLE) / BigInt(rollUnderIndex)) / BPS_PER_WHOLE;

  const maxWager = React.useMemo(() => {
    if (!pool?.maxPayout || !multiplier) return balance;
    return Math.min(pool.maxPayout / multiplier, balance, baseWager * 1000000);
  }, [pool?.maxPayout, multiplier, balance, baseWager]);

  const odds = Math.floor((rollUnderIndex / 100) * 100);

  const bet = React.useMemo(() => outcomes(odds), [odds]);

  const maxWin = multiplier * wager;

  const game = GambaUi.useGame();

  const play = async () => {
    // Reset states
    setGamePhase('thinking');
    setThinkingPhase(true);
    setDramaticPause(false);
    setCelebrationIntensity(0);
    setIsWin(null);
    setResultIndex(-1);
    
    // Random thinking emoji
    const thinkingEmojis = ['🤔', '🎯', '🔮', '⚡', '🎲', '💭'];
    setThinkingEmoji(thinkingEmojis[Math.floor(Math.random() * thinkingEmojis.length)]);
    
    sounds.play('play');

    await game.play({
      wager,
      bet,
    });

    // Thinking phase
    await new Promise(resolve => setTimeout(resolve, 1500));
    setThinkingPhase(false);
    
    // Dramatic pause
    setGamePhase('dramatic');
    setDramaticPause(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setDramaticPause(false);

    const result = await game.result();
    const win = result.payout > 0;

    const resultNum = win
      ? Math.floor(Math.random() * rollUnderIndex)
      : Math.floor(Math.random() * (100 - rollUnderIndex) + rollUnderIndex);

    setResultIndex(resultNum);
    setIsWin(win);
    setProfitAmount(result.payout - wager);

    // Track result in paytable
    const rollMultiplier = 99 / rollUnderIndex;
    const resultData = {
      rollValue: resultNum + 1,
      targetValue: rollUnderIndex,
      multiplier: rollMultiplier,
      wasWin: win
    };
    setCurrentResult(resultData);
    
    if (paytableRef.current) {
      paytableRef.current.trackRoll({
        rollValue: resultNum + 1,
        targetValue: rollUnderIndex,
        multiplier: rollMultiplier,
        wasWin: win,
        amount: result.payout
      });
    }

    // Handle celebration or mourning
    if (win) {
      const multiplier = result.payout / wager;
      let intensity = 1;
      if (multiplier >= 10) intensity = 3;
      else if (multiplier >= 3) intensity = 2;
      
      setCelebrationIntensity(intensity);
      setGamePhase('celebrating');
      sounds.play('win');
      
      // Auto-reset after celebration
      setTimeout(() => {
        setGamePhase('idle');
        setCelebrationIntensity(0);
      }, 4000);
    } else {
      setGamePhase('mourning');
      sounds.play('lose');
      
      // Auto-reset after mourning
      setTimeout(() => {
        setGamePhase('idle');
      }, 2500);
    }
  };

  const test = async () => {
    if (gamba.isPlaying) return;
    await play();
  };

  const simulate = async () => {
    if (gamba.isPlaying) return;
    for (let i = 0; i < 10; i++) {
      await play();
    }
  };

  const playButtonText = "Play";

  return (
    <>
      <GambaUi.Portal target="screen">
        <div style={{ display: 'flex', gap: 16, height: '100%', width: '100%' }}>
          {/* Main game area */}
          <div
            style={{
              flex: 1,
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 25%, #0f3460 50%, #0e4b99 75%, #2e86ab 100%)',
              borderRadius: '24px',
              border: '3px solid rgba(255, 255, 255, 0.15)',
              boxShadow: `
                0 25px 50px rgba(0, 0, 0, 0.5),
                inset 0 2px 4px rgba(255, 255, 255, 0.1),
                inset 0 -2px 4px rgba(0, 0, 0, 0.3),
                0 0 30px rgba(46, 134, 171, 0.2)
              `,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Container>
              {/* Floating dice background elements */}
              <div style={{
                position: 'absolute',
                top: '10%',
                left: '5%',
                fontSize: '120px',
                opacity: 0.05,
                transform: 'rotate(-15deg)',
                pointerEvents: 'none',
                color: '#00ffe1'
              }}>🎲</div>
              <div style={{
                position: 'absolute',
                bottom: '10%',
                right: '5%',
                fontSize: '80px',
                opacity: 0.08,
                transform: 'rotate(25deg)',
                pointerEvents: 'none',
                color: '#ffd700'
              }}>🎲</div>
              
              {/* Modern Game Header */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '30px',
                animation: 'fadeInDown 0.8s ease-out'
              }}>
                <div
                  style={{
                    fontWeight: 900,
                    fontSize: 36,
                    color: '#fff',
                    marginBottom: 8,
                    letterSpacing: 4,
                    textShadow: '0 4px 20px rgba(0,255,225,0.5), 0 0 40px rgba(255,215,0,0.3)',
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #00ffe1, #ffd700, #00ffe1)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 3s ease-in-out infinite'
                  }}
                >
                  DICE MASTER
                </div>
                <div style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: 16,
                  fontWeight: 600,
                  textAlign: 'center',
                  letterSpacing: 1
                }}>
                  Roll under your target number to win big!
                </div>
              </div>
              
              <RollUnder>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(0, 255, 225, 0.2), rgba(0, 212, 255, 0.2))',
                  borderRadius: '20px',
                  padding: '20px 30px',
                  border: '2px solid rgba(0, 255, 225, 0.4)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0, 255, 225, 0.15)'
                }}>
                  <div
                    style={{ 
                      fontSize: 48, 
                      color: '#00ffe1', 
                      fontWeight: 900,
                      textShadow: '0 0 30px rgba(0, 255, 225, 0.8), 0 0 60px rgba(0, 255, 225, 0.4)',
                      marginBottom: 8
                    }}
                  >
                    {rollUnderIndex + 1}
                  </div>
                  <div style={{ fontSize: 18, color: '#e0e0e0', fontWeight: 700, letterSpacing: 1 }}>
                    ROLL UNDER
                  </div>
                </div>
              </RollUnder>
              
              <Stats>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.25), rgba(16, 185, 129, 0.25))',
                  borderRadius: '16px',
                  padding: '12px 18px',
                  border: '2px solid rgba(34, 197, 94, 0.4)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 6px 24px rgba(34, 197, 94, 0.15)'
                }}>
                  <div style={{ color: '#22c55e', fontWeight: 800, fontSize: 20, textShadow: '0 0 10px rgba(34, 197, 94, 0.5)' }}>
                    {((rollUnderIndex / 100) * 100).toFixed(2)}%
                  </div>
                  <div style={{ color: '#d1d5db', fontSize: 13, fontWeight: 600, letterSpacing: 0.5 }}>WIN CHANCE</div>
                </div>
                
                <div style={{
                  background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.25), rgba(255, 193, 7, 0.25))',
                  borderRadius: '16px',
                  padding: '12px 18px',
                  border: '2px solid rgba(255, 215, 0, 0.4)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 6px 24px rgba(255, 215, 0, 0.15)'
                }}>
                  <div style={{ color: '#ffd700', fontWeight: 800, fontSize: 20, textShadow: '0 0 10px rgba(255, 215, 0, 0.5)' }}>
                    {multiplier.toFixed(2)}x
                  </div>
                  <div style={{ color: '#d1d5db', fontSize: 13, fontWeight: 600, letterSpacing: 0.5 }}>MULTIPLIER</div>
                </div>
                
                <div style={{
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(139, 92, 246, 0.25))',
                  borderRadius: '16px',
                  padding: '12px 18px',
                  border: '2px solid rgba(168, 85, 247, 0.4)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 6px 24px rgba(168, 85, 247, 0.15)'
                }}>
                  <div style={{ color: '#a855f7', fontWeight: 800, fontSize: 20, textShadow: '0 0 10px rgba(168, 85, 247, 0.5)' }}>
                    <TokenValue suffix="" amount={maxWin} />
                  </div>
                  <div style={{ color: '#d1d5db', fontSize: 13, fontWeight: 600, letterSpacing: 0.5 }}>PAYOUT</div>
                </div>
              </Stats>
              
              <div style={{ position: 'relative', marginTop: 20 }}>
                {resultIndex > -1 && (
                  <Result
                    style={{
                      left: `${(resultIndex / 100) * 100}%`,
                      background: isWin === true
                        ? 'linear-gradient(135deg, #00ffb0, #00d4aa)'
                        : isWin === false
                        ? 'linear-gradient(135deg, #ff5252, #f44336)'
                        : 'linear-gradient(135deg, #ffe066, #ffcc02)',
                      color: '#000',
                      fontWeight: 800,
                      borderRadius: 12,
                      padding: '8px 16px',
                      fontSize: 22,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.3), 0 0 0 2px rgba(255,255,255,0.2)',
                      transition: 'all 0.4s ease',
                    }}
                  >
                    <div key={resultIndex}>{resultIndex + 1}</div>
                  </Result>
                )}
                <Slider
                  disabled={gamba.isPlaying}
                  range={[0, 100]}
                  min={1}
                  max={95}
                  value={rollUnderIndex}
                  onChange={(value) => {
                    setRollUnderIndex(value);
                    sounds.play('tick');
                  }}
                />
              </div>
            </Container>
            
            {/* Add the overlay component - conditionally rendered based on ENABLE_THINKING_OVERLAY */}
            {renderThinkingOverlay(
              <DiceOverlays
                gamePhase={getGamePhaseState(gamePhase)}
                thinkingPhase={getThinkingPhaseState(thinkingPhase)}
                dramaticPause={dramaticPause}
                celebrationIntensity={celebrationIntensity}
                currentWin={isWin ? { multiplier: multiplier, amount: profitAmount } : undefined}
                thinkingEmoji={thinkingEmoji}
              />
            )}
          </div>

          {/* Paytable sidebar */}
          <DicePaytable
            ref={paytableRef}
            odds={99 / rollUnderIndex}
            rollUnder={true}
            wager={wager}
            currentResult={currentResult}
          />
        </div>
      </GambaUi.Portal>
      {/* Controls */}
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={play}
        isPlaying={gamba.isPlaying}
        showOutcome={false}
        playButtonText={playButtonText}
      >
      </GameControls>
    </>
  );
}
