
import React, { useContext } from 'react';
import { useIsCompact } from '../../hooks/useIsCompact';
import { GambaResultContext } from '../../context/GambaResultContext'
import { GambaUi, useWagerInput } from 'gamba-react-ui-v2';
import { GameControls, GameScreenLayout } from '../../components';
import { useGameOutcome } from '../../hooks/useGameOutcome';
// Improved responsive scaling with hard cap at 475px height (from Slots)


export default function DiceRoll() {
  const { setGambaResult } = useContext(GambaResultContext)

  const scalerRef = React.useRef<HTMLDivElement>(null);
  const [pick, setPick] = React.useState(1)
  const [wager, setWager] = useWagerInput()
  const isCompact = useIsCompact();
  const [scale, setScale] = React.useState(isCompact ? 1 : 1.2);

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
    
    // Show outcome overlay
    handleGameComplete({ payout: res.payout, wager })
  }

  // Dice face multipliers (should match the bet array used in play)
  const diceMultipliers = [0, 0, 0, 1.2, 1.5, 2];

  return (
    <>
      <GambaUi.Portal target="screen">
        <GameScreenLayout
          left={
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
                }}
                className="diceroll-game-scaler"
              >
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      textAlign: 'center', 
                      marginTop: 32, 
                      position: 'relative', 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'center',
                      minHeight: '400px',
                      padding: '20px'
                    }}>
                      <h2 style={{ fontWeight: 700, fontSize: 32, marginBottom: 16 }}>
                        🎲 Dice Roll
                      </h2>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
                        {[1,2,3,4,5,6].map(n => (
                          <button
                            key={n}
                            onClick={() => setPick(n)}
                            disabled={isPlaying || showOutcome}
                            style={{
                              width: 48,
                              height: 48,
                              fontSize: 24,
                              borderRadius: 12,
                              border: pick === n ? '2px solid #00ffe1' : '2px solid #333',
                              background: pick === n ? '#222' : '#111',
                              color: pick === n ? '#00ffe1' : '#fff',
                              boxShadow: pick === n ? '0 0 8px #00ffe1' : 'none',
                              transition: 'all 0.2s',
                              cursor: 'pointer',
                            }}
                          >{n}</button>
                        ))}
                      </div>
                      <div style={{ textAlign: 'center', marginBottom: 8, fontWeight: 700, color: '#ffe066', fontSize: '1rem' }}>Payouts</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8, width: '100%' }}>
                        {[1,2,3,4,5,6].map((n, idx) => (
                          <div key={n} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: pick === n ? '#ffe06622' : '#23234a', borderRadius: 4, padding: '4px 8px', fontWeight: pick === n ? 700 : 400 }}>
                            <span style={{ color: pick === n ? '#ffe066' : '#fff', fontSize: 14 }}>Face {n}</span>
                            <span style={{ color: pick === n ? '#ffe066' : '#ffe066cc', fontWeight: 900, fontSize: 15 }}>{diceMultipliers[idx]}x</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: 12, color: '#bbb', textAlign: 'center', marginTop: 8 }}>
                        Select a dice face. Payouts are shown for each face.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GambaUi.Responsive>
          }
          right={null}
        />
      </GambaUi.Portal>
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={play}
        isPlaying={isPlaying}
        playButtonText={hasPlayedBefore && !showOutcome ? 'Play Again' : 'Play'}
      />
    </>
  )
}
