import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useCurrentToken, useTokenBalance, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { TOKEN_METADATA } from '../../src/constants'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { useIsCompact } from '../../src/hooks/useIsCompact'
import { useGameOutcome } from '../../src/hooks/useGameOutcome'
import PiratesFortunePaytable, { PiratesFortunePaytableRef } from './PiratesFortunePaytable'
import PiratesFortuneOverlays from './PiratesFortuneOverlays'
import { GameControls } from '../../src/components'

// Bet arrays for different sailing routes
const ROUTE_CHOICES = {
  coastal: [0, 2, 3, 8],      // Safe coastal waters
  deep: [0, 0, 5, 12],        // Deep sea route
  storm: [0, 0, 0, 20],       // Through the storm
}

type RouteChoice = keyof typeof ROUTE_CHOICES

export default function PiratesFortune() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const [playing, setPlaying] = React.useState(false)
  const [win, setWin] = React.useState(false)
  const [resultIndex, setResultIndex] = React.useState(0)
  const [choice, setChoice] = React.useState<RouteChoice>('coastal')
  const [wager, setWager] = useWagerInput()
  const token = useCurrentToken()
  const { balance } = useTokenBalance()
  const paytableRef = React.useRef<PiratesFortunePaytableRef>(null)
  
  // Multi-phase states
  const [currentIsland, setCurrentIsland] = React.useState(0)
  const [sailingPhase, setSailingPhase] = React.useState(false)
  const [foundTreasure, setFoundTreasure] = React.useState(false)
  const [islandResults, setIslandResults] = React.useState<('empty' | 'bones' | 'treasure')[]>([])
  const [shipPosition, setShipPosition] = React.useState(0)
  
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

  const tokenMeta = token ? TOKEN_METADATA.find(t => t.symbol === token.symbol) : undefined
  const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals) : 1)
  const maxWager = baseWager * 1000000

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
      setCurrentIsland(0)
      setSailingPhase(true)
      setFoundTreasure(false)
      setIslandResults([])
      setShipPosition(0)
      
      const selectedChoice = choice
      const selectedBet = ROUTE_CHOICES[choice]

      if (sounds.play) sounds.play('play', { playbackRate: 0.6 })

      await game.play({
        bet: selectedBet,
        wager,
        metadata: [choice],
      })

      const result = await game.result()
      const winResult = result.payout > 0
      const treasureIsland = result.resultIndex
      const multiplier = winResult ? result.payout / wager : 0

      // Create island hopping sequence
      const islandCount = selectedBet.length
      const sailingResults: ('empty' | 'bones' | 'treasure')[] = []
      
      for (let island = 0; island < islandCount; island++) {
        setCurrentIsland(island + 1)
        setShipPosition(((island + 1) / islandCount) * 100)
        
        // Simulate sailing time
        await new Promise(resolve => setTimeout(resolve, 1800))
        
        let islandResult: 'empty' | 'bones' | 'treasure'
        if (island === treasureIsland && winResult) {
          islandResult = selectedBet[island] >= 12 ? 'treasure' : 'bones'
        } else if (island < treasureIsland || (!winResult && Math.random() < 0.35)) {
          islandResult = Math.random() < 0.6 ? 'empty' : 'bones'
        } else {
          islandResult = 'empty'
        }
        
        sailingResults.push(islandResult)
        setIslandResults([...sailingResults])
        
        if (islandResult === 'treasure') {
          setFoundTreasure(true)
          break
        }
        
        await new Promise(resolve => setTimeout(resolve, 600))
      }

      setSailingPhase(false)
      setWin(winResult)
      setResultIndex(result.resultIndex)

      paytableRef.current?.trackGame({
        choice: selectedChoice,
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

  const getChoiceMultiplier = (choice: RouteChoice) => {
    const bet = ROUTE_CHOICES[choice]
    return Math.max(...bet)
  }

  const getChoiceChance = (choice: RouteChoice) => {
    const bet = ROUTE_CHOICES[choice]
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
            background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 25%, #0284c7 50%, #0ea5e9 75%, #38bdf8 100%)',
            borderRadius: '24px',
            border: '3px solid rgba(14, 165, 233, 0.3)',
            boxShadow: `
              0 25px 50px rgba(0, 0, 0, 0.8),
              inset 0 2px 4px rgba(255, 255, 255, 0.1),
              inset 0 -2px 4px rgba(0, 0, 0, 0.5),
              0 0 30px rgba(14, 165, 233, 0.3)
            `,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Ocean waves animation */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60px',
              background: `
                repeating-linear-gradient(
                  90deg,
                  rgba(56, 189, 248, 0.3) 0px,
                  rgba(14, 165, 233, 0.3) 40px,
                  rgba(56, 189, 248, 0.3) 80px
                )
              `,
              animation: 'waves 4s linear infinite'
            }} />
            
            {/* Floating elements */}
            <div style={{
              position: 'absolute',
              top: '15%',
              left: '10%',
              fontSize: '40px',
              opacity: 0.15,
              transform: 'rotate(-20deg)',
              animation: 'float 8s ease-in-out infinite'
            }}>⚓</div>
            <div style={{
              position: 'absolute',
              bottom: '25%',
              right: '15%',
              fontSize: '50px',
              opacity: 0.1,
              transform: 'rotate(15deg)',
              animation: 'float 6s ease-in-out infinite reverse'
            }}>🦜</div>

            {/* Route Selection */}
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
              {(['coastal', 'deep', 'storm'] as RouteChoice[]).map((routeChoice) => (
                <button
                  key={routeChoice}
                  onClick={() => setChoice(routeChoice)}
                  disabled={playing}
                  style={{
                    background: choice === routeChoice 
                      ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.4) 0%, rgba(12, 74, 110, 0.4) 100%)'
                      : 'rgba(0, 0, 0, 0.6)',
                    border: choice === routeChoice 
                      ? '2px solid rgba(14, 165, 233, 0.7)' 
                      : '1px solid rgba(255, 255, 255, 0.1)',
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
                  {routeChoice === 'coastal' && '🏖️ COASTAL'} 
                  {routeChoice === 'deep' && '🌊 DEEP SEA'} 
                  {routeChoice === 'storm' && '⛈️ STORM'}
                  <br />
                  <span style={{ fontSize: '10px', opacity: 0.8 }}>
                    {getChoiceChance(routeChoice)}% • {getChoiceMultiplier(routeChoice)}x
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
                background: 'linear-gradient(45deg, #0c4a6e, #0ea5e9, #38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(56, 189, 248, 0.5)'
              }}>
                🏴‍☠️ PIRATE'S FORTUNE 🗺️
              </h1>
              
              <div style={{
                fontSize: '20px',
                color: '#38bdf8',
                marginBottom: '32px',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
              }}>
                {playing && sailingPhase ? (
                  <span style={{ color: '#fbbf24' }}>⛵ Sailing to Island {currentIsland}...</span>
                ) : playing ? (
                  <span style={{ color: '#22c55e' }}>🏝️ Voyage Complete</span>
                ) : (
                  'Follow the treasure map across the seven seas'
                )}
              </div>

              {/* Islands Display */}
              {(playing || hasPlayedBefore) && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '16px',
                  marginBottom: '24px',
                  flexWrap: 'wrap'
                }}>
                  {ROUTE_CHOICES[choice].map((multiplier, index) => {
                    const isCurrentIsland = sailingPhase && currentIsland === index + 1
                    const isVisited = index < islandResults.length
                    const islandResult = islandResults[index]
                    
                    return (
                      <div
                        key={index}
                        style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          border: isCurrentIsland ? '3px solid #fbbf24' : '2px solid rgba(56, 189, 248, 0.3)',
                          background: isVisited
                            ? (islandResult === 'treasure' ? 'linear-gradient(135deg, #eab308, #ca8a04)' 
                               : islandResult === 'bones' ? 'linear-gradient(135deg, #78716c, #57534e)'
                               : 'linear-gradient(135deg, #22c55e, #16a34a)')
                            : 'radial-gradient(circle, #16a34a 30%, #0ea5e9 70%)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: '12px',
                          fontWeight: 600,
                          position: 'relative',
                          animation: isCurrentIsland ? 'pulse 1s infinite' : 'none',
                          boxShadow: isCurrentIsland ? '0 0 20px rgba(251, 191, 36, 0.5)' : 'none'
                        }}
                      >
                        <div style={{ fontSize: '20px', marginBottom: '4px' }}>
                          {isVisited 
                            ? (islandResult === 'treasure' ? '💰' 
                               : islandResult === 'bones' ? '💀' 
                               : '🏝️')
                            : isCurrentIsland ? '⛵' : '🗺️'}
                        </div>
                        <div style={{ fontSize: '9px' }}>
                          ISLAND {index + 1}
                        </div>
                        {multiplier > 0 && (
                          <div style={{ fontSize: '10px', color: '#38bdf8' }}>
                            {multiplier}x
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Sailing Progress */}
              {sailingPhase && (
                <div style={{
                  width: '300px',
                  height: '4px',
                  background: 'rgba(56, 189, 248, 0.3)',
                  borderRadius: '2px',
                  margin: '20px auto',
                  position: 'relative'
                }}>
                  <div style={{
                    width: `${shipPosition}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
                    borderRadius: '2px',
                    transition: 'width 1s ease'
                  }} />
                  <div style={{
                    position: 'absolute',
                    left: `${shipPosition}%`,
                    top: '-15px',
                    fontSize: '20px',
                    transform: 'translateX(-50%)'
                  }}>
                    🚢
                  </div>
                </div>
              )}

              {/* Result Display */}
              {!playing && hasPlayedBefore && (
                <div style={{
                  padding: '16px 32px',
                  borderRadius: '16px',
                  background: win 
                    ? 'linear-gradient(135deg, rgba(234, 179, 8, 0.3) 0%, rgba(202, 138, 4, 0.2) 100%)'
                    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)',
                  border: `2px solid ${win ? '#eab308' : '#ef4444'}`,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                  marginTop: '24px'
                }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: win ? '#eab308' : '#ef4444',
                    marginBottom: '8px'
                  }}>
                    {win ? '🎉 TREASURE FOUND!' : '💀 DAVY JONES\' LOCKER'}
                  </div>
                  <div style={{ color: '#38bdf8', fontSize: '16px' }}>
                    {win ? `Captain's gold recovered!` : 'Lost to the depths of the ocean'}
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
              border: '1px solid rgba(56, 189, 248, 0.2)',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                {playing ? 'VOYAGE IN PROGRESS...' : `ROUTE: ${choice.toUpperCase()}`}
              </div>
              <div style={{ color: '#38bdf8', fontSize: '14px', fontWeight: 700 }}>
                {getChoiceMultiplier(choice)}.00x BURIED TREASURE
              </div>
            </div>
            
            <PiratesFortuneOverlays
              sailingPhase={sailingPhase}
              currentIsland={currentIsland}
              foundTreasure={foundTreasure}
              win={win}
              choice={choice}
            />

            <style>
              {`
                @keyframes waves {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-80px); }
                }
                @keyframes float {
                  0%, 100% { transform: translateY(0px) rotate(0deg); }
                  50% { transform: translateY(-15px) rotate(5deg); }
                }
                @keyframes pulse {
                  0%, 100% { opacity: 1; transform: scale(1); }
                  50% { opacity: 0.7; transform: scale(1.05); }
                }
              `}
            </style>
          </div>

          <PiratesFortunePaytable
            ref={paytableRef}
            wager={wager}
            selectedChoice={choice}
          />
        </div>
      </GambaUi.Portal>
      
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={play}
        isPlaying={playing}
        showOutcome={showOutcome}
        playButtonText={hasPlayedBefore ? 'Set Sail Again' : 'Hoist the Colors'}
        onPlayAgain={handlePlayAgain}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 'bold' }}>Route:</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['coastal', 'deep', 'storm'] as RouteChoice[]).map((routeChoice) => (
              <GambaUi.Button
                key={routeChoice}
                onClick={() => setChoice(routeChoice)}
                disabled={playing || showOutcome}
              >
                {choice === routeChoice ? '✓ ' : ''}
                {routeChoice === 'coastal' && '🏖️ Coastal'}
                {routeChoice === 'deep' && '🌊 Deep Sea'}
                {routeChoice === 'storm' && '⛈️ Storm'}
              </GambaUi.Button>
            ))}
          </div>
        </div>
      </GameControls>
    </>
  )
}
