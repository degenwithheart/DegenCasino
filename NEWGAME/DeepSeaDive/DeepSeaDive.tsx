import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useCurrentToken, useTokenBalance, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { TOKEN_METADATA } from '../../src/constants'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { useIsCompact } from '../../src/hooks/useIsCompact'
import { useGameOutcome } from '../../src/hooks/useGameOutcome'
import DeepSeaDivePaytable, { DeepSeaDivePaytableRef } from './DeepSeaDivePaytable'
import DeepSeaDiveOverlays from './DeepSeaDiveOverlays'
import { GameControls } from '../../src/components'

// Bet arrays for different dive depths
const DEPTH_CHOICES = {
  shallow: [0, 0, 3, 7, 15],    // Shallow dive - multiple opportunities
  deep: [0, 0, 0, 12, 20],      // Deep dive - better rewards, higher risk
  abyss: [0, 0, 0, 0, 30],      // Abyssal dive - extreme risk/reward
}

type DepthChoice = keyof typeof DEPTH_CHOICES

export default function DeepSeaDive() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const [playing, setPlaying] = React.useState(false)
  const [win, setWin] = React.useState(false)
  const [resultIndex, setResultIndex] = React.useState(0)
  const [choice, setChoice] = React.useState<DepthChoice>('shallow')
  const [wager, setWager] = useWagerInput()
  const token = useCurrentToken()
  const { balance } = useTokenBalance()
  const paytableRef = React.useRef<DeepSeaDivePaytableRef>(null)
  
  // Multi-phase states
  const [currentDepth, setCurrentDepth] = React.useState(0)
  const [divingPhase, setDivingPhase] = React.useState(false)
  const [foundPearl, setFoundPearl] = React.useState(false)
  const [depthResults, setDepthResults] = React.useState<('empty' | 'creature' | 'pearl')[]>([])
  const [submarineDepth, setSubmarineDepth] = React.useState(0)
  
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
      setCurrentDepth(0)
      setDivingPhase(true)
      setFoundPearl(false)
      setDepthResults([])
      setSubmarineDepth(0)
      
      const selectedChoice = choice
      const selectedBet = DEPTH_CHOICES[choice]

      if (sounds.play) sounds.play('play', { playbackRate: 0.5 })

      await game.play({
        bet: selectedBet,
        wager,
        metadata: [choice],
      })

      const result = await game.result()
      const winResult = result.payout > 0
      const pearlDepth = result.resultIndex
      const multiplier = winResult ? result.payout / wager : 0

      // Create diving sequence
      const maxDepth = selectedBet.length
      const diveResults: ('empty' | 'creature' | 'pearl')[] = []
      
      for (let depth = 0; depth < maxDepth; depth++) {
        setCurrentDepth(depth + 1)
        setSubmarineDepth(((depth + 1) / maxDepth) * 100)
        
        // Simulate diving time - deeper takes longer
        await new Promise(resolve => setTimeout(resolve, 1500 + (depth * 300)))
        
        let depthResult: 'empty' | 'creature' | 'pearl'
        if (depth === pearlDepth && winResult) {
          depthResult = selectedBet[depth] >= 20 ? 'pearl' : 'creature'
        } else if (depth < pearlDepth || (!winResult && Math.random() < 0.3)) {
          depthResult = Math.random() < 0.6 ? 'empty' : 'creature'
        } else {
          depthResult = 'empty'
        }
        
        diveResults.push(depthResult)
        setDepthResults([...diveResults])
        
        if (depthResult === 'pearl') {
          setFoundPearl(true)
          break
        }
        
        await new Promise(resolve => setTimeout(resolve, 600))
      }

      setDivingPhase(false)
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

  const getChoiceMultiplier = (choice: DepthChoice) => {
    const bet = DEPTH_CHOICES[choice]
    return Math.max(...bet)
  }

  const getChoiceChance = (choice: DepthChoice) => {
    const bet = DEPTH_CHOICES[choice]
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
            background: 'linear-gradient(180deg, #0ea5e9 0%, #0284c7 20%, #0369a1 40%, #1e40af 60%, #1e3a8a 80%, #0f172a 100%)',
            borderRadius: '24px',
            border: '3px solid rgba(14, 165, 233, 0.4)',
            boxShadow: `
              0 25px 50px rgba(0, 0, 0, 0.9),
              inset 0 2px 4px rgba(255, 255, 255, 0.1),
              inset 0 -2px 4px rgba(0, 0, 0, 0.6),
              0 0 40px rgba(14, 165, 233, 0.3)
            `,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Underwater light rays */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '20%',
              width: '60%',
              height: '100%',
              background: `
                linear-gradient(
                  180deg,
                  rgba(56, 189, 248, 0.1) 0%,
                  rgba(14, 165, 233, 0.05) 50%,
                  transparent 100%
                )
              `,
              clipPath: 'polygon(40% 0%, 60% 0%, 80% 100%, 20% 100%)',
              animation: 'lightRays 8s ease-in-out infinite alternate'
            }} />
            
            {/* Sea creatures */}
            <div style={{
              position: 'absolute',
              top: '20%',
              left: '15%',
              fontSize: '30px',
              opacity: 0.2,
              animation: 'swim 12s linear infinite'
            }}>🐠</div>
            <div style={{
              position: 'absolute',
              top: '60%',
              right: '20%',
              fontSize: '40px',
              opacity: 0.15,
              animation: 'swim 15s linear infinite reverse'
            }}>🐙</div>
            <div style={{
              position: 'absolute',
              bottom: '30%',
              left: '25%',
              fontSize: '25px',
              opacity: 0.18,
              animation: 'swim 10s linear infinite'
            }}>🦈</div>

            {/* Depth Selection */}
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
              {(['shallow', 'deep', 'abyss'] as DepthChoice[]).map((depthChoice) => (
                <button
                  key={depthChoice}
                  onClick={() => setChoice(depthChoice)}
                  disabled={playing}
                  style={{
                    background: choice === depthChoice 
                      ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.4) 0%, rgba(3, 105, 161, 0.4) 100%)'
                      : 'rgba(0, 0, 0, 0.6)',
                    border: choice === depthChoice 
                      ? '2px solid rgba(14, 165, 233, 0.7)' 
                      : '1px solid rgba(56, 189, 248, 0.3)',
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
                  {depthChoice === 'shallow' && '🏊 SHALLOW'} 
                  {depthChoice === 'deep' && '🤿 DEEP'} 
                  {depthChoice === 'abyss' && '🌊 ABYSS'}
                  <br />
                  <span style={{ fontSize: '10px', opacity: 0.8 }}>
                    {getChoiceChance(depthChoice)}% • {getChoiceMultiplier(depthChoice)}x
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
                background: 'linear-gradient(45deg, #0ea5e9, #38bdf8, #7dd3fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(56, 189, 248, 0.5)'
              }}>
                🌊 DEEP SEA DIVE 🦪
              </h1>
              
              <div style={{
                fontSize: '20px',
                color: '#38bdf8',
                marginBottom: '32px',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
              }}>
                {playing && divingPhase ? (
                  <span style={{ color: '#fbbf24' }}>🚤 Diving to depth {currentDepth}...</span>
                ) : playing ? (
                  <span style={{ color: '#22c55e' }}>🐚 Dive Complete</span>
                ) : (
                  'Search the ocean depths for rare pearls'
                )}
              </div>

              {/* Depth Levels Display */}
              {(playing || hasPlayedBefore) && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '24px'
                }}>
                  {DEPTH_CHOICES[choice].map((multiplier, index) => {
                    const isCurrentDepth = divingPhase && currentDepth === index + 1
                    const isExplored = index < depthResults.length
                    const depthResult = depthResults[index]
                    
                    return (
                      <div
                        key={index}
                        style={{
                          width: '300px',
                          height: '50px',
                          borderRadius: '25px',
                          border: isCurrentDepth ? '3px solid #fbbf24' : '2px solid rgba(56, 189, 248, 0.3)',
                          background: isExplored
                            ? (depthResult === 'pearl' ? 'linear-gradient(135deg, #f8fafc, #e2e8f0)' 
                               : depthResult === 'creature' ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                               : 'linear-gradient(135deg, #0284c7, #0369a1)')
                            : `linear-gradient(135deg, 
                               rgba(14, 165, 233, ${0.3 + index * 0.15}) 0%, 
                               rgba(3, 105, 161, ${0.3 + index * 0.15}) 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0 20px',
                          color: '#fff',
                          fontSize: '14px',
                          fontWeight: 600,
                          position: 'relative',
                          animation: isCurrentDepth ? 'dive 1s infinite' : 'none',
                          boxShadow: isCurrentDepth ? '0 0 20px rgba(251, 191, 36, 0.5)' : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ fontSize: '20px' }}>
                            {isExplored 
                              ? (depthResult === 'pearl' ? '🦪' 
                                 : depthResult === 'creature' ? '🦈' 
                                 : '🌊')
                              : isCurrentDepth ? '🚤' : '💧'}
                          </div>
                          <span>DEPTH {index + 1}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {multiplier > 0 && (
                            <span style={{ fontSize: '12px', color: '#38bdf8' }}>
                              {multiplier}x PEARL
                            </span>
                          )}
                          <div style={{ fontSize: '16px' }}>
                            {index * 100 + 100}m
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Diving Progress */}
              {divingPhase && (
                <div style={{
                  width: '200px',
                  margin: '20px auto',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '60px',
                    animation: 'submarine 2s ease-in-out infinite',
                    filter: 'drop-shadow(0 0 10px rgba(56, 189, 248, 0.5))'
                  }}>
                    🚤
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#38bdf8',
                    marginTop: '10px'
                  }}>
                    Depth: {(currentDepth * 100)}m
                  </div>
                </div>
              )}

              {/* Result Display */}
              {!playing && hasPlayedBefore && (
                <div style={{
                  padding: '16px 32px',
                  borderRadius: '16px',
                  background: win 
                    ? 'linear-gradient(135deg, rgba(248, 250, 252, 0.2) 0%, rgba(226, 232, 240, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)',
                  border: `2px solid ${win ? '#e2e8f0' : '#ef4444'}`,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7)',
                  marginTop: '24px'
                }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: win ? '#e2e8f0' : '#ef4444',
                    marginBottom: '8px'
                  }}>
                    {win ? '🎉 PEARL DISCOVERED!' : '🦈 LOST IN THE DEPTHS'}
                  </div>
                  <div style={{ color: '#38bdf8', fontSize: '16px' }}>
                    {win ? `Rare pearl found in giant clam!` : 'The deep claimed another treasure hunter'}
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
              border: '1px solid rgba(56, 189, 248, 0.3)',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                {playing ? 'DIVE IN PROGRESS...' : `DEPTH: ${choice.toUpperCase()}`}
              </div>
              <div style={{ color: '#38bdf8', fontSize: '14px', fontWeight: 700 }}>
                {getChoiceMultiplier(choice)}.00x PEARL VALUE
              </div>
            </div>
            
            <DeepSeaDiveOverlays
              divingPhase={divingPhase}
              currentDepth={currentDepth}
              foundPearl={foundPearl}
              win={win}
              choice={choice}
              submarineDepth={submarineDepth}
            />

            <style>
              {`
                @keyframes lightRays {
                  0%, 100% { opacity: 0.1; transform: translateX(-10px); }
                  50% { opacity: 0.3; transform: translateX(10px); }
                }
                @keyframes swim {
                  0% { transform: translateX(-100px); }
                  100% { transform: translateX(calc(100vw + 100px)); }
                }
                @keyframes dive {
                  0%, 100% { transform: translateY(0px); opacity: 1; }
                  50% { transform: translateY(5px); opacity: 0.8; }
                }
                @keyframes submarine {
                  0%, 100% { transform: translateY(0px) rotate(0deg); }
                  50% { transform: translateY(-10px) rotate(-2deg); }
                }
              `}
            </style>
          </div>

          <DeepSeaDivePaytable
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
        playButtonText={hasPlayedBefore ? 'Dive Again' : 'Begin Descent'}
        onPlayAgain={handlePlayAgain}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 'bold' }}>Depth:</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['shallow', 'deep', 'abyss'] as DepthChoice[]).map((depthChoice) => (
              <GambaUi.Button
                key={depthChoice}
                onClick={() => setChoice(depthChoice)}
                disabled={playing || showOutcome}
              >
                {choice === depthChoice ? '✓ ' : ''}
                {depthChoice === 'shallow' && '🏊 Shallow'}
                {depthChoice === 'deep' && '🤿 Deep'}
                {depthChoice === 'abyss' && '🌊 Abyss'}
              </GambaUi.Button>
            ))}
          </div>
        </div>
      </GameControls>
    </>
  )
}
