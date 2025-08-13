import {
  GambaUi,
  useWagerInput,
  useCurrentToken,
  useCurrentPool,
  FAKE_TOKEN_MINT,
  useTokenBalance,
} from 'gamba-react-ui-v2';
import { TOKEN_METADATA } from '../../constants';
import React, { useContext, useRef } from 'react';
import { GameControls } from '../../components';
import { useGameOutcome } from '../../hooks/useGameOutcome'
import { useGambaResult } from '../../hooks/useGambaResult';
import { useIsCompact } from '../../hooks/useIsCompact';
import LuckyNumberPaytable, { LuckyNumberPaytableRef } from './LuckyNumberPaytable'
import { LuckyNumberOverlays } from './LuckyNumberOverlays'
import { renderThinkingOverlay, getThinkingPhaseState, getGamePhaseState } from '../../utils/overlayUtils'

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
  const [resultModalOpen, setResultModalOpen] = React.useState(false);
  const scalerRef = React.useRef<HTMLDivElement>(null);
  const { compact: isCompact } = useIsCompact(); // <-- extract only the boolean value
  const [scale, setScale] = React.useState(1);
  const [pick, setPick] = React.useState(1);
  const [wager, setWager] = useWagerInput();

  // Live paytable tracking
  const paytableRef = useRef<LuckyNumberPaytableRef>(null)

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
  } = useGameOutcome()

  // Dynamic play button text
  const playButtonText = hasPlayedBefore && !showOutcome ? "Restart" : "Start"

  // Gamba result storage
  const { storeResult } = useGambaResult();

  // Overlay states
  const [gamePhase, setGamePhase] = React.useState<'idle' | 'thinking' | 'dramatic' | 'celebrating' | 'mourning'>('idle')
  const [thinkingPhase, setThinkingPhase] = React.useState(false)
  const [dramaticPause, setDramaticPause] = React.useState(false)
  const [celebrationIntensity, setCelebrationIntensity] = React.useState(1)
  const [thinkingEmoji, setThinkingEmoji] = React.useState('🍀')

  // Set default wager: 1 for free tokens, 0 for real tokens
  React.useEffect(() => {
    if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
      setWager(baseWager); // 1 token for free token
    } else {
      setWager(0); // 0 for real tokens
    }
  }, [setWager, token, baseWager]);

  const play = async () => {
    // Start thinking phase
    setGamePhase('thinking')
    setThinkingPhase(true)
    setThinkingEmoji(['🍀', '💭', '🎯', '✨'][Math.floor(Math.random() * 4)])
    
    setIsPlaying(true);
    setResult(null);
    setPayout(null);
    const bet = Array(10).fill(0);
    bet[pick - 1] = 9.5; // 95% RTP (5% house edge)
    await game.play({ wager, bet });
    const res = await game.result()

    // Store result in context for modal
    storeResult(res);
  setResultModalOpen(true);
  
    // Dramatic pause phase
    setGamePhase('dramatic')
    setDramaticPause(true)
    
    // Wait for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const resultNumber = res.resultIndex + 1
    setResult(resultNumber);
    setPayout(res.payout);
    setIsPlaying(false);
    
    // Track result in live paytable
    const wasWin = res.payout > 0
    const multiplier = wasWin ? 10 : 0
    
    if (paytableRef.current) {
      paytableRef.current.trackGame({
        selectedNumber: pick,
        resultNumber,
        wasWin,
        amount: res.payout,
        multiplier
      })
    }
    
    // Set celebration intensity based on win amount
    if (wasWin) {
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
    
    // Reset to idle after celebration/mourning
    setTimeout(() => {
      setGamePhase('idle')
    }, 3000)
  };

  const formatPayout = (payout: number | null) => {
    if (payout === null || !token) return '-';
    return (payout / Math.pow(10, token.decimals)).toLocaleString(undefined, {
      maximumFractionDigits: token.decimals,
    });
  };

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
              background: 'linear-gradient(135deg, #a16207 0%, #ca8a04 25%, #eab308 50%, #facc15 75%, #fef3c7 100%)',
              borderRadius: '24px',
              border: '3px solid rgba(234, 179, 8, 0.3)',
              boxShadow: `
                0 25px 50px rgba(0, 0, 0, 0.5),
                inset 0 2px 4px rgba(255, 255, 255, 0.1),
                inset 0 -2px 4px rgba(0, 0, 0, 0.3),
                0 0 30px rgba(234, 179, 8, 0.2)
              `,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Floating lucky number background elements */}
            <div style={{
              position: 'absolute',
              top: '10%',
              left: '8%',
              fontSize: '110px',
              opacity: 0.08,
              transform: 'rotate(-15deg)',
              pointerEvents: 'none',
              color: '#eab308'
            }}>🍀</div>
            <div style={{
              position: 'absolute',
              bottom: '15%',
              right: '10%',
              fontSize: '95px',
              opacity: 0.06,
              transform: 'rotate(20deg)',
              pointerEvents: 'none',
              color: '#facc15'
            }}>🎯</div>
            <div style={{
              position: 'absolute',
              top: '42%',
              right: '12%',
              fontSize: '85px',
              opacity: 0.07,
              transform: 'rotate(-25deg)',
              pointerEvents: 'none',
              color: '#ca8a04'
            }}>🔢</div>
            <div style={{
              position: 'absolute',
              bottom: '38%',
              left: '10%',
              fontSize: '75px',
              opacity: 0.05,
              transform: 'rotate(30deg)',
              pointerEvents: 'none',
              color: '#fef3c7'
            }}>⭐</div>
            
            <div style={{
              textAlign: 'center',
              marginBottom: 20,
              zIndex: 10,
              position: 'relative'
            }}>
              <h2 style={{
                fontSize: 32,
                fontWeight: 800,
                margin: '0 0 8px 0',
                letterSpacing: 2,
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                color: '#fff'
              }}>
                🎯 LUCKY NUMBER 🍀
              </h2>
              <div style={{
                fontSize: 16,
                color: '#888',
                fontWeight: 600
              }}>
                Pick your lucky number and win big!
              </div>
            </div>

            <GambaUi.Responsive>
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
                  padding: '20px',
                  position: 'relative',
                  zIndex: 5
                }}
              >
                <div style={{ textAlign: 'center', width: '100%', maxWidth: '600px' }}>
                  {/* Number Selection */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: 12, 
                    marginBottom: 32,
                    flexWrap: 'wrap'
                  }}>
                    {[...Array(10)].map((_, i) => {
                      const number = i + 1
                      const isSelected = pick === number
                      const isResult = result === number
                      
                      return (
                        <button
                          key={number}
                          onClick={() => setPick(number)}
                          disabled={isPlaying}
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            background: isSelected 
                              ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                              : isResult && result !== null
                              ? (payout && payout > 0 
                                ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                                : 'linear-gradient(135deg, #ef4444, #dc2626)')
                              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                            color: '#fff',
                            border: isSelected 
                              ? '2px solid #22c55e' 
                              : isResult && result !== null
                              ? (payout && payout > 0 ? '2px solid #22c55e' : '2px solid #ef4444')
                              : '2px solid rgba(255, 255, 255, 0.2)',
                            fontWeight: 700,
                            fontSize: 18,
                            boxShadow: isSelected 
                              ? '0 4px 16px rgba(34, 197, 94, 0.4)' 
                              : isResult && result !== null
                              ? (payout && payout > 0 
                                ? '0 4px 16px rgba(34, 197, 94, 0.4)'
                                : '0 4px 16px rgba(239, 68, 68, 0.4)')
                              : '0 2px 8px rgba(0,0,0,0.2)',
                            transition: 'all 0.2s ease',
                            cursor: isPlaying ? 'not-allowed' : 'pointer',
                            transform: isSelected || (isResult && result !== null) ? 'scale(1.1)' : 'scale(1)',
                            animation: isResult && result !== null ? 'resultPulse 1s ease-in-out' : undefined
                          }}
                        >
                          {number}
                        </button>
                      )
                    })}
                  </div>

                  {/* Expected Payout Display */}
                  <div style={{
                    marginTop: 20,
                    padding: '12px 20px',
                    borderRadius: '12px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    color: '#60a5fa',
                    fontWeight: 600,
                    fontSize: '14px',
                    textAlign: 'center'
                  }}>
                    <div>Selected Number: <span style={{ color: '#fff', fontWeight: 700 }}>{pick}</span></div>
                    <div style={{ marginTop: 4 }}>Expected Payout: <span style={{ color: '#22c55e' }}>{(wager * 10).toFixed(2)}</span> (10x multiplier)</div>
                  </div>

                  {/* Result Display */}
                  {result !== null && (
                    <div
                      style={{
                        fontSize: 24,
                        margin: '24px 0',
                        fontWeight: 600,
                        padding: '16px 24px',
                        borderRadius: '12px',
                        background: payout && payout > 0 
                          ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.2))'
                          : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2))',
                        border: payout && payout > 0
                          ? '1px solid rgba(34, 197, 94, 0.4)'
                          : '1px solid rgba(239, 68, 68, 0.4)',
                        color: '#fff',
                        animation: 'reveal 0.7s cubic-bezier(.5,1.5,.5,1)',
                      }}
                    >
                      Lucky Number: <span style={{ 
                        color: payout && payout > 0 ? '#22c55e' : '#ef4444',
                        fontSize: '32px',
                        fontWeight: 700
                      }}>{result}</span>
                      <br />
                      {payout && payout > 0 ? (
                        <>
                          🎉 You Win! <br />
                          <span style={{ color: '#22c55e', fontSize: '20px' }}>
                            +{formatPayout(payout)} {token?.symbol}
                          </span>
                        </>
                      ) : (
                        <>😔 Better luck next time!</>
                      )}
                    </div>
                  )}
                  
                  {/* Game Instructions */}
                  <div style={{
                    marginTop: 24,
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '14px',
                    color: '#9ca3af'
                  }}>
                    Pick a number from 1-10. Match it for a 10x payout!
                  </div>
                </div>
              </div>
            </GambaUi.Responsive>
          </div>

          {/* Paytable sidebar */}
          <LuckyNumberPaytable
            ref={paytableRef}
            wager={wager}
            selectedNumber={pick}
            currentResult={result !== null ? {
              selectedNumber: pick,
              resultNumber: result,
              wasWin: payout !== null && payout > 0,
              amount: payout || 0,
              multiplier: (payout !== null && payout > 0) ? 10 : 0
            } : undefined}
          />
        </div>
      </GambaUi.Portal>
      
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={play}
        isPlaying={isPlaying}
        showOutcome={showOutcome}
        playButtonText={hasPlayedBefore ? 'Restart' : 'Pick Number'}
        onPlayAgain={handlePlayAgain}
      >
        {/* Number Selection Display */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 'bold' }}>Lucky Number:</span>
          <span
            style={{
              padding: '6px 12px',
              background: '#22c55e',
              color: '#fff',
              borderRadius: 20,
              fontWeight: 'bold',
              fontSize: 16,
            }}
          >
            #{pick}
          </span>
        </div>
      </GameControls>
      
      <style>{`
        @keyframes reveal {
          0% { opacity: 0; transform: scale(0.7) translateY(20px); }
          60% { opacity: 0.7; transform: scale(1.1) translateY(-8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes resultPulse {
          0%, 100% { transform: scale(1.1); }
          50% { transform: scale(1.2); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
      {renderThinkingOverlay(
        <LuckyNumberOverlays 
        gamePhase={getGamePhaseState(gamePhase)}
        thinkingPhase={getThinkingPhaseState(thinkingPhase)}
        dramaticPause={dramaticPause}
        celebrationIntensity={celebrationIntensity}
        thinkingEmoji={thinkingEmoji}
      />
        )}
    </>
  );
}
