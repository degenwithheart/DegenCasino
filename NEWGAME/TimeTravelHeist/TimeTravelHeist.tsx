import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useCurrentToken, useTokenBalance, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { TOKEN_METADATA } from '../../src/constants'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { useIsCompact } from '../../src/hooks/useIsCompact'
import { useGameOutcome } from '../../src/hooks/useGameOutcome'
import TimeTravelHeistPaytable, { TimeTravelHeistPaytableRef } from './TimeTravelHeistPaytable'
import TimeTravelHeistOverlays from './TimeTravelHeistOverlays'
import { GameControls } from '../../src/components'

// Bet arrays for different time periods
const TIME_PERIODS = {
  medieval: [0, 1, 4, 8, 20],      // Medieval times - simpler security
  modern: [0, 0, 6, 15, 30],       // Modern era - advanced security
  future: [0, 0, 0, 12, 45],       // Future - quantum security
}

type TimePeriod = keyof typeof TIME_PERIODS

export default function TimeTravelHeist() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const [playing, setPlaying] = React.useState(false)
  const [win, setWin] = React.useState(false)
  const [resultIndex, setResultIndex] = React.useState(0)
  const [period, setPeriod] = React.useState<TimePeriod>('medieval')
  const [wager, setWager] = useWagerInput()
  const token = useCurrentToken()
  const { balance } = useTokenBalance()
  const paytableRef = React.useRef<TimeTravelHeistPaytableRef>(null)
  
  // Multi-phase states
  const [currentLocation, setCurrentLocation] = React.useState(0)
  const [heistPhase, setHeistPhase] = React.useState(false)
  const [treasureFound, setTreasureFound] = React.useState(false)
  const [locationResults, setLocationResults] = React.useState<('empty' | 'guard' | 'treasure')[]>([])
  const [timelineProgress, setTimelineProgress] = React.useState(0)
  
  // Game outcome state
  const {
    showOutcome,
    hasPlayedBefore,
    handleGameComplete,
    handlePlayAgain,
    isWin,
    profitAmount,
    resetGameState,
  } = useGameOutcome()

  // Dynamic play button text
  const playButtonText = hasPlayedBefore && !showOutcome ? "Play Again" : "Start"

  const tokenMeta = token ? TOKEN_METADATA.find(t => t.symbol === token.symbol) : undefined
  const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals) : 1)

  React.useEffect(() => {
    if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
      setWager(baseWager)
    } else {
      setWager(0)
    }
  }, [setWager, token, baseWager])

  const sounds = useSound({
    win: '/sounds/win.mp3',
    lose: '/sounds/lose.mp3',
    play: '/sounds/play.mp3',
  })

  const play = async () => {
    try {
      setWin(false)
      setPlaying(true)
      setCurrentLocation(0)
      setHeistPhase(true)
      setTreasureFound(false)
      setLocationResults([])
      setTimelineProgress(0)
      
      const selectedPeriod = period
      const selectedBet = TIME_PERIODS[period]

      if (sounds.play) sounds.play('play', { playbackRate: 0.6 })

      await game.play({
        bet: selectedBet,
        wager,
        metadata: [period],
      })

      const result = await game.result()
      const winResult = result.payout > 0
      const treasureLocation = result.resultIndex
      const multiplier = winResult ? result.payout / wager : 0

      // Create time heist sequence
      const maxLocations = selectedBet.length
      const locationResults: ('empty' | 'guard' | 'treasure')[] = []
      
      for (let location = 0; location < maxLocations; location++) {
        setCurrentLocation(location + 1)
        setTimelineProgress(((location + 1) / maxLocations) * 100)
        
        // Simulate heist time with increasing tension
        await new Promise(resolve => setTimeout(resolve, 2000 + (location * 500)))
        
        let locationResult: 'empty' | 'guard' | 'treasure'
        if (location === treasureLocation && winResult) {
          locationResult = selectedBet[location] >= 20 ? 'treasure' : 'guard'
        } else if (location < treasureLocation || (!winResult && Math.random() < 0.35)) {
          locationResult = Math.random() < 0.65 ? 'empty' : 'guard'
        } else {
          locationResult = 'empty'
        }
        
        locationResults.push(locationResult)
        setLocationResults([...locationResults])
        
        if (locationResult === 'treasure') {
          setTreasureFound(true)
          break
        }
        
        await new Promise(resolve => setTimeout(resolve, 900))
      }

      setHeistPhase(false)
      setWin(winResult)
      setResultIndex(result.resultIndex)

      paytableRef.current?.trackGame({
        period: selectedPeriod,
        resultIndex: result.resultIndex,
        wasWin: winResult,
        amount: winResult ? result.payout - wager : 0,
        multiplier: multiplier,
      })

      if (winResult && sounds.play) {
        sounds.play('win')
      } else if (!winResult && sounds.play) {
        sounds.play('lose')
      }
      
      handleGameComplete({ payout: result.payout, wager })
    } finally {
      setPlaying(false)
    }
  }

  const isCompact = useIsCompact()
  const [scale, setScale] = React.useState(isCompact ? 1 : 1.2)

  React.useEffect(() => {
    setScale(isCompact ? 1 : 1.2)
  }, [isCompact])

  const getPeriodMultiplier = (period: TimePeriod) => {
    const bet = TIME_PERIODS[period]
    return Math.max(...bet)
  }

  const getPeriodChance = (period: TimePeriod) => {
    const bet = TIME_PERIODS[period]
    const winCount = bet.filter(x => x > 0).length
    return Math.round((winCount / bet.length) * 100)
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <div style={{ display: 'flex', gap: 16, height: '100%', width: '100%' }}>
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 20%, #334155 40%, #475569 60%, #64748b 80%, #94a3b8 100%)',
            borderRadius: '24px',
            border: '3px solid rgba(100, 116, 139, 0.4)',
            boxShadow: `
              0 25px 50px rgba(0, 0, 0, 0.9),
              inset 0 2px 4px rgba(255, 255, 255, 0.1),
              inset 0 -2px 4px rgba(0, 0, 0, 0.6),
              0 0 40px rgba(100, 116, 139, 0.3)
            `,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Time portal effects */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '200px',
              height: '200px',
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              background: 'radial-gradient(circle, transparent 40%, rgba(100, 116, 139, 0.1) 60%, rgba(71, 85, 105, 0.2) 80%)',
              border: '2px solid rgba(100, 116, 139, 0.2)',
              animation: 'timePortal 8s linear infinite',
              opacity: 0.3
            }} />
            
            {/* Floating time symbols */}
            <div style={{
              position: 'absolute',
              top: '15%',
              left: '10%',
              fontSize: '30px',
              opacity: 0.2,
              animation: 'timeFloat 10s ease-in-out infinite'
            }}>⏰</div>
            
            <div style={{
              position: 'absolute',
              top: '70%',
              right: '15%',
              fontSize: '35px',
              opacity: 0.15,
              animation: 'timeFloat 12s ease-in-out infinite reverse'
            }}>⚗️</div>
            
            <div style={{
              position: 'absolute',
              bottom: '20%',
              left: '20%',
              fontSize: '25px',
              opacity: 0.18,
              animation: 'timeFloat 8s ease-in-out infinite'
            }}>🔮</div>

            {/* Era Selection */}
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
              {(['medieval', 'modern', 'future'] as TimePeriod[]).map((timePeriod) => (
                <button
                  key={timePeriod}
                  onClick={() => setPeriod(timePeriod)}
                  disabled={playing}
                  style={{
                    background: period === timePeriod 
                      ? 'linear-gradient(135deg, rgba(100, 116, 139, 0.4) 0%, rgba(71, 85, 105, 0.4) 100%)'
                      : 'rgba(0, 0, 0, 0.6)',
                    border: period === timePeriod 
                      ? '2px solid rgba(100, 116, 139, 0.7)' 
                      : '1px solid rgba(100, 116, 139, 0.3)',
                    borderRadius: '12px',
                    padding: '10px 20px',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: playing ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: playing ? 0.6 : 1,
                    textTransform: 'uppercase'
                  }}
                >
                  {timePeriod === 'medieval' && '🏰 MEDIEVAL'} 
                  {timePeriod === 'modern' && '🏙️ MODERN'} 
                  {timePeriod === 'future' && '🚀 FUTURE'}
                  <br />
                  <span style={{ fontSize: '10px', opacity: 0.8 }}>
                    {getPeriodChance(timePeriod)}% • {getPeriodMultiplier(timePeriod)}x
                  </span>
                </button>
              ))}
            </div>

            {/* Main Game Visual */}
            <div style={{
              textAlign: 'center',
              transform: `scale(${scale})`,
              transition: 'transform 0.2s ease-out',
            }}>
              <h1 style={{
                fontSize: '48px',
                fontWeight: 800,
                margin: '0 0 16px 0',
                background: 'linear-gradient(45deg, #64748b, #94a3b8, #cbd5e1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(100, 116, 139, 0.5)'
              }}>
                ⏰ TIME TRAVEL HEIST 💎
              </h1>
              
              <div style={{
                fontSize: '20px',
                color: '#94a3b8',
                marginBottom: '32px',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
              }}>
                {playing && heistPhase ? (
                  <span style={{ color: '#fbbf24' }}>⚡ Infiltrating location {currentLocation}...</span>
                ) : playing ? (
                  <span style={{ color: '#22c55e' }}>🎯 Mission Complete</span>
                ) : (
                  'Travel through time to steal legendary treasures'
                )}
              </div>

              {/* Location Levels Display */}
              {(playing || hasPlayedBefore) && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '24px'
                }}>
                  {TIME_PERIODS[period].map((multiplier, index) => {
                    const isCurrentLocation = heistPhase && currentLocation === index + 1
                    const isInfiltrated = index < locationResults.length
                    const locationResult = locationResults[index]
                    
                    return (
                      <div
                        key={index}
                        style={{
                          width: '300px',
                          height: '50px',
                          borderRadius: '25px',
                          border: isCurrentLocation ? '3px solid #fbbf24' : '2px solid rgba(100, 116, 139, 0.3)',
                          background: isInfiltrated
                            ? (locationResult === 'treasure' ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' 
                               : locationResult === 'guard' ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                               : 'linear-gradient(135deg, #64748b, #475569)')
                            : `linear-gradient(135deg, 
                               rgba(100, 116, 139, ${0.3 + index * 0.15}) 0%, 
                               rgba(71, 85, 105, ${0.3 + index * 0.15}) 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0 20px',
                          color: '#fff',
                          fontSize: '14px',
                          fontWeight: 600,
                          position: 'relative',
                          animation: isCurrentLocation ? 'infiltrate 1s infinite' : 'none',
                          boxShadow: isCurrentLocation ? '0 0 20px rgba(251, 191, 36, 0.5)' : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ fontSize: '20px' }}>
                            {isInfiltrated 
                              ? (locationResult === 'treasure' ? '💎' 
                                 : locationResult === 'guard' ? '👮' 
                                 : '🔍')
                              : isCurrentLocation ? '🕵️' : '⏰'}
                          </div>
                          <span>LOCATION {index + 1}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {multiplier > 0 && (
                            <span style={{ fontSize: '12px', color: '#cbd5e1' }}>
                              {multiplier}x TREASURE
                            </span>
                          )}
                          <div style={{ fontSize: '16px' }}>
                            {period === 'medieval' ? 
                              (index === 0 ? 'VILLAGE' : index === 1 ? 'CASTLE' : index === 2 ? 'VAULT' : index === 3 ? 'TOWER' : 'THRONE') :
                            period === 'modern' ?
                              (index === 0 ? 'BANK' : index === 1 ? 'MUSEUM' : index === 2 ? 'VAULT' : index === 3 ? 'TOWER' : 'PENTHOUSE') :
                              (index === 0 ? 'STATION' : index === 1 ? 'LAB' : index === 2 ? 'VAULT' : index === 3 ? 'CORE' : 'NEXUS')
                            }
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Time Machine Display */}
              {heistPhase && (
                <div style={{
                  width: '200px',
                  margin: '20px auto',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '60px',
                    animation: 'timeMachine 2s ease-in-out infinite',
                    filter: 'drop-shadow(0 0 15px rgba(100, 116, 139, 0.8))'
                  }}>
                    {period === 'medieval' ? '🏰' : period === 'modern' ? '🏙️' : '🚀'}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#94a3b8',
                    marginTop: '10px'
                  }}>
                    Timeline: {timelineProgress.toFixed(0)}%
                  </div>
                </div>
              )}

              {/* Result Display */}
              {!playing && hasPlayedBefore && (
                <div style={{
                  padding: '16px 32px',
                  borderRadius: '16px',
                  background: win 
                    ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)',
                  border: `2px solid ${win ? '#fbbf24' : '#ef4444'}`,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7)',
                  marginTop: '24px'
                }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: win ? '#fbbf24' : '#ef4444',
                    marginBottom: '8px'
                  }}>
                    {win ? '🎯 HEIST SUCCESSFUL!' : '🚨 CAUGHT BY TIME GUARDS'}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '16px' }}>
                    {win ? `Legendary treasure stolen from ${period} era!` : 'The timeline security proved too strong'}
                  </div>
                </div>
              )}
            </div>

            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0, 0, 0, 0.8)',
              borderRadius: '12px',
              padding: '12px 20px',
              border: '1px solid rgba(100, 116, 139, 0.3)',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                {playing ? 'HEIST IN PROGRESS...' : `ERA: ${period.toUpperCase()}`}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 700 }}>
                {getPeriodMultiplier(period)}.00x TREASURE VALUE
              </div>
            </div>
            
            <TimeTravelHeistOverlays
              heistPhase={heistPhase}
              currentLocation={currentLocation}
              treasureFound={treasureFound}
              win={win}
              period={period}
              timelineProgress={timelineProgress}
            />

            <style>
              {`
                @keyframes timePortal {
                  0% { transform: translate(-50%, -50%) rotate(0deg); }
                  100% { transform: translate(-50%, -50%) rotate(360deg); }
                }
                @keyframes timeFloat {
                  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
                  50% { transform: translateY(-15px) rotate(180deg); opacity: 0.4; }
                }
                @keyframes infiltrate {
                  0%, 100% { transform: scale(1); opacity: 1; }
                  50% { transform: scale(1.03); opacity: 0.9; }
                }
                @keyframes timeMachine {
                  0%, 100% { transform: scale(1) rotate(0deg); }
                  50% { transform: scale(1.1) rotate(5deg); }
                }
              `}
            </style>
          </div>

          <TimeTravelHeistPaytable
            ref={paytableRef}
            wager={wager}
            selectedPeriod={period}
          />
        </div>
      </GambaUi.Portal>
      
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={play}
        isPlaying={playing}
        showOutcome={showOutcome}
        playButtonText={hasPlayedBefore ? 'Time Travel Again' : 'Begin Heist'}
        onPlayAgain={handlePlayAgain}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 'bold' }}>Era:</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['medieval', 'modern', 'future'] as TimePeriod[]).map((timePeriod) => (
              <GambaUi.Button
                key={timePeriod}
                onClick={() => setPeriod(timePeriod)}
                disabled={playing || showOutcome}
              >
                {period === timePeriod ? '✓ ' : ''}
                {timePeriod === 'medieval' && '🏰 Medieval'}
                {timePeriod === 'modern' && '🏙️ Modern'}
                {timePeriod === 'future' && '🚀 Future'}
              </GambaUi.Button>
            ))}
          </div>
        </div>
      </GameControls>
    </>
  )
}
