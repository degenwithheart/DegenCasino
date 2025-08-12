
import React, { useContext, useRef } from 'react';
import { useIsCompact } from '../../hooks/useIsCompact';
import { GambaResultContext } from '../../context/GambaResultContext'
import { GambaUi, useWagerInput } from 'gamba-react-ui-v2';
import { GameControls, GambaResultModal } from '../../components';
import { useGameOutcome } from '../../hooks/useGameOutcome';
import DiceRollPaytable, { DiceRollPaytableRef } from './DiceRollPaytable'


export default function DiceRoll() {
  const { setGambaResult } = useContext(GambaResultContext)

  const scalerRef = React.useRef<HTMLDivElement>(null);
  const [pick, setPick] = React.useState(1)
  const [wager, setWager] = useWagerInput()
  const isCompact = useIsCompact();
  const [scale, setScale] = React.useState(isCompact ? 1 : 1.2);

  // Live paytable tracking
  const paytableRef = useRef<DiceRollPaytableRef>(null)

  React.useEffect(() => {
    setScale(isCompact ? 1 : 1.2);
  }, [isCompact]);
  const game = GambaUi.useGame()
  const [result, setResult] = React.useState<number | null>(null)
  const [payout, setPayout] = React.useState<number | null>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [rolling, setRolling] = React.useState(false)
  const [rollValue, setRollValue] = React.useState<number | null>(null)
  
  // Game outcome overlay state
  const {
    showOutcome,
    hasPlayedBefore,
    handleGameComplete,
    handlePlayAgain,
    isWin,
    profitAmount,
    resetGameState,
  } = useGameOutcome()

  const play = async () => {
    setIsPlaying(true)
    setResult(null)
    setPayout(null)
    setRolling(true)
    setRollValue(null)
    
    // Simulate dice rolling animation
    let rollTimes = 15;
    for (let i = 0; i < rollTimes; i++) {
      setRollValue(Math.floor(Math.random() * 6) + 1);
      await new Promise(res => setTimeout(res, 60 + i * 10));
    }
    
    const bet = [0, 0, 0, 1.2, 1.5, 2];
    await game.play({ wager, bet })
    const res = await game.result()
    setGambaResult(res)
    setResult(res.resultIndex + 1)
    setPayout(res.payout)
    setRolling(false)
    setIsPlaying(false)
    
    // Track result in live paytable
    const resultFace = res.resultIndex + 1
    const wasWin = res.payout > 0
    
    if (paytableRef.current) {
      paytableRef.current.trackGame({
        selectedFace: pick,
        resultFace,
        wasWin,
        amount: res.payout
      })
    }
    
    // Show outcome overlay
    handleGameComplete({ payout: res.payout, wager })
  }

  // Dice face multipliers (should match the bet array used in play)
  const diceMultipliers = [0, 0, 0, 1.2, 1.5, 2];

  return (
    <>
      <GambaUi.Portal target="screen">
        <GambaUi.Responsive>
          <div style={{ 
            display: 'flex', 
            gap: 16, 
            height: '100%', 
            width: '100%',
            background: 'linear-gradient(135deg, rgba(20, 20, 40, 0.95), rgba(10, 10, 25, 0.95))',
            borderRadius: '16px',
            overflow: 'hidden'
          }}>
            {/* Game Area */}
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              position: 'relative',
              minHeight: '400px'
            }}>
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
                  padding: '20px'
                }}
                className="diceroll-game-scaler"
              >
                <div style={{ 
                  textAlign: 'center',
                  width: '100%',
                  maxWidth: '500px'
                }}>
                  <h2 style={{ 
                    fontWeight: 700, 
                    fontSize: 32, 
                    marginBottom: 24,
                    color: '#fff',
                    textShadow: '0 4px 8px rgba(0,0,0,0.5)'
                  }}>
                    🎲 Dice Roll
                  </h2>
                  
                  {/* Dice Display */}
                  <div style={{
                    margin: '24px auto',
                    width: '120px',
                    height: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(145deg, #2a2a3a, #1a1a2a)',
                    borderRadius: '20px',
                    border: '3px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                    fontSize: '48px',
                    color: '#fff',
                    animation: rolling ? 'diceRoll 0.1s infinite' : undefined
                  }}>
                    {rollValue || result || '?'}
                  </div>

                  {/* Face Selection */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ 
                      fontSize: '16px', 
                      fontWeight: 600, 
                      color: '#fbbf24', 
                      marginBottom: 12 
                    }}>
                      Select Your Face
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                      {[1,2,3,4,5,6].map(n => (
                        <button
                          key={n}
                          onClick={() => setPick(n)}
                          disabled={isPlaying || showOutcome}
                          style={{
                            width: 52,
                            height: 52,
                            fontSize: 24,
                            borderRadius: 12,
                            border: pick === n ? '2px solid #3b82f6' : '2px solid rgba(255, 255, 255, 0.2)',
                            background: pick === n 
                              ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
                              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                            color: '#fff',
                            boxShadow: pick === n 
                              ? '0 4px 16px rgba(59, 130, 246, 0.4)' 
                              : '0 2px 8px rgba(0,0,0,0.2)',
                            transition: 'all 0.2s ease',
                            cursor: isPlaying ? 'not-allowed' : 'pointer',
                            fontWeight: 700,
                            transform: pick === n ? 'scale(1.05)' : 'scale(1)',
                          }}
                        >{n}</button>
                      ))}
                    </div>
                  </div>

                  {/* Result Display */}
                  {result !== null && (
                    <div style={{
                      marginTop: 20,
                      padding: '16px 24px',
                      borderRadius: '12px',
                      background: payout && payout > 0 
                        ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.2))'
                        : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2))',
                      border: payout && payout > 0
                        ? '1px solid rgba(34, 197, 94, 0.4)'
                        : '1px solid rgba(239, 68, 68, 0.4)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '18px',
                      animation: 'resultGlow 1s ease-in-out'
                    }}>
                      {payout && payout > 0 ? (
                        <>🎉 You Won! +{payout.toFixed(2)}</>
                      ) : (
                        <>😔 You Lost</>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Live Paytable */}
            <DiceRollPaytable
              ref={paytableRef}
              wager={wager}
              selectedFace={pick}
              currentResult={result !== null ? {
                selectedFace: pick,
                resultFace: result,
                wasWin: payout !== null && payout > 0,
                amount: payout || 0
              } : undefined}
            />
          </div>
        </GambaUi.Responsive>
      </GambaUi.Portal>
      
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={play}
        isPlaying={isPlaying}
        playButtonText={hasPlayedBefore && !showOutcome ? 'Roll Again' : 'Roll Dice'}
      />
      
      <GambaResultModal open={showOutcome} onClose={handlePlayAgain} />
      
      <style>{`
        @keyframes diceRoll {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(90deg); }
          50% { transform: rotate(180deg); }
          75% { transform: rotate(270deg); }
        }
        @keyframes resultGlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </>
  )
}
