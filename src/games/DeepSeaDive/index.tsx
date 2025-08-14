import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useCurrentToken, useTokenBalance, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { TOKEN_METADATA } from '../../constants'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { useIsCompact } from '../../hooks/useIsCompact'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import DeepSeaDivePaytable, { DeepSeaDivePaytableRef } from './DeepSeaDivePaytable'
import DeepSeaDiveOverlays from './DeepSeaDiveOverlays'
import { GameControls } from '../../components'

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
            {/* Enhanced underwater light rays and atmospheric effects */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '15%',
              width: '70%',
              height: '100%',
              background: `
                linear-gradient(
                  180deg,
                  rgba(14, 165, 233, 0.3) 0%,
                  rgba(14, 165, 233, 0.15) 20%,
                  rgba(3, 105, 161, 0.1) 40%,
                  rgba(30, 64, 175, 0.05) 60%,
                  transparent 80%
                )
              `,
              animation: 'oceanCurrents 18s ease-in-out infinite alternate',
              zIndex: 1
            }} />
            
            {/* Multiple light ray beams */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '30%',
              width: '3px',
              height: '60%',
              background: 'linear-gradient(180deg, rgba(14, 165, 233, 0.6) 0%, transparent 100%)',
              animation: 'lightRay1 12s ease-in-out infinite alternate',
              zIndex: 2
            }} />
            
            <div style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              width: '4px',
              height: '70%',
              background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.5) 0%, transparent 100%)',
              animation: 'lightRay2 15s ease-in-out infinite alternate-reverse',
              zIndex: 2
            }} />
            
            <div style={{
              position: 'absolute',
              top: 0,
              left: '70%',
              width: '2px',
              height: '50%',
              background: 'linear-gradient(180deg, rgba(14, 165, 233, 0.4) 0%, transparent 100%)',
              animation: 'lightRay3 10s ease-in-out infinite alternate',
              zIndex: 2
            }} />
            
            {/* Floating sea life and bubbles */}
            <div style={{
              position: 'absolute',
              top: '15%',
              left: '10%',
              fontSize: '40px',
              opacity: 0.3,
              animation: 'seaFloat 20s ease-in-out infinite',
              filter: 'drop-shadow(0 0 15px rgba(14, 165, 233, 0.4))',
              zIndex: 3
            }}>
              🐠
            </div>
            
            <div style={{
              position: 'absolute',
              top: '45%',
              right: '15%',
              fontSize: '35px',
              opacity: 0.25,
              animation: 'seaFloat 25s ease-in-out infinite reverse',
              filter: 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.3))',
              zIndex: 3
            }}>
              🐢
            </div>
            
            <div style={{
              position: 'absolute',
              top: '70%',
              left: '20%',
              fontSize: '30px',
              opacity: 0.2,
              animation: 'seaFloat 18s ease-in-out infinite',
              filter: 'drop-shadow(0 0 10px rgba(14, 165, 233, 0.3))',
              zIndex: 3
            }}>
              🦈
            </div>
            
            <div style={{
              position: 'absolute',
              bottom: '25%',
              right: '25%',
              fontSize: '25px',
              opacity: 0.15,
              animation: 'seaFloat 22s ease-in-out infinite reverse',
              zIndex: 3
            }}>
              🐙
            </div>
            
            {/* Animated bubble effects */}
            <div style={{
              position: 'absolute',
              bottom: '10%',
              left: '25%',
              fontSize: '20px',
              opacity: 0.4,
              animation: 'bubbleRise 8s linear infinite',
              zIndex: 4
            }}>
              🫧
            </div>
            
            <div style={{
              position: 'absolute',
              bottom: '15%',
              right: '30%',
              fontSize: '15px',
              opacity: 0.3,
              animation: 'bubbleRise 12s linear infinite',
              animationDelay: '3s',
              zIndex: 4
            }}>
              🫧
            </div>
            
            <div style={{
              position: 'absolute',
              bottom: '20%',
              left: '60%',
              fontSize: '18px',
              opacity: 0.35,
              animation: 'bubbleRise 10s linear infinite',
              animationDelay: '6s',
              zIndex: 4
            }}>
              🫧
            </div>
            
            {/* Underwater coral/seaweed effect */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '20%',
              background: `
                radial-gradient(ellipse at bottom, 
                  rgba(5, 150, 105, 0.2) 0%, 
                  rgba(16, 185, 129, 0.1) 30%, 
                  transparent 70%
                )
              `,
              animation: 'seaweedSway 14s ease-in-out infinite alternate',
              zIndex: 1
            }} />

            {/* Depth Selection Interface */}
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
                      : '1px solid rgba(107, 114, 128, 0.3)',
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
                  {depthChoice === 'shallow' && '🏊 SHALLOW DIVE'} 
                  {depthChoice === 'deep' && '🤿 DEEP DIVE'} 
                  {depthChoice === 'abyss' && '🌊 ABYSSAL DIVE'}
                  <br />
                  <span style={{ fontSize: '10px', opacity: 0.8 }}>
                    {getChoiceChance(depthChoice)}% • {getChoiceMultiplier(depthChoice)}x
                  </span>
                </button>
              ))}
            </div>
            
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
            
                result={gambaResult}
                currentBalance={balance.balance ? balance.balance + balance.bonusBalance : balance}
                wager={wager}
              />

            <style>
              {`
                @keyframes oceanCurrents {
                  0%, 100% { opacity: 0.4; transform: scaleY(1) translateX(-5px); }
                  25% { opacity: 0.6; transform: scaleY(1.02) translateX(3px); }
                  50% { opacity: 0.5; transform: scaleY(1.05) translateX(-2px); }
                  75% { opacity: 0.7; transform: scaleY(1.03) translateX(4px); }
                }
                @keyframes lightRay1 {
                  0%, 100% { opacity: 0.3; transform: translateX(-8px) scaleY(0.8); }
                  50% { opacity: 0.6; transform: translateX(8px) scaleY(1.2); }
                }
                @keyframes lightRay2 {
                  0%, 100% { opacity: 0.25; transform: translateX(6px) scaleY(0.9); }
                  50% { opacity: 0.5; transform: translateX(-6px) scaleY(1.1); }
                }
                @keyframes lightRay3 {
                  0%, 100% { opacity: 0.2; transform: translateX(-4px) scaleY(0.7); }
                  50% { opacity: 0.4; transform: translateX(4px) scaleY(1.0); }
                }
                @keyframes seaFloat {
                  0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.3; }
                  25% { transform: translateY(-15px) translateX(10px) rotate(5deg); opacity: 0.4; }
                  50% { transform: translateY(-25px) translateX(-5px) rotate(-3deg); opacity: 0.35; }
                  75% { transform: translateY(-10px) translateX(8px) rotate(7deg); opacity: 0.45; }
                }
                @keyframes bubbleRise {
                  0% { transform: translateY(0px) scale(1); opacity: 0.4; }
                  50% { transform: translateY(-50vh) scale(1.2); opacity: 0.6; }
                  100% { transform: translateY(-100vh) scale(0.8); opacity: 0; }
                }
                @keyframes seaweedSway {
                  0%, 100% { transform: scaleX(1) skewX(0deg); opacity: 0.2; }
                  50% { transform: scaleX(1.1) skewX(3deg); opacity: 0.3; }
                }
                @keyframes dive {
                  0%, 100% { transform: translateY(0px) scale(1); opacity: 1; }
                  25% { transform: translateY(3px) scale(1.02); opacity: 0.95; }
                  50% { transform: translateY(8px) scale(1.05); opacity: 0.9; }
                  75% { transform: translateY(5px) scale(1.03); opacity: 0.95; }
                }
                @keyframes submarine {
                  0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
                  25% { transform: translateY(-8px) rotate(-1deg) scale(1.05); }
                  50% { transform: translateY(-15px) rotate(0deg) scale(1.1); }
                  75% { transform: translateY(-10px) rotate(1deg) scale(1.05); }
                }
                @keyframes pearlGlow {
                  0%, 100% { filter: drop-shadow(0 0 15px rgba(14, 165, 233, 0.5)) brightness(1); }
                  50% { filter: drop-shadow(0 0 30px rgba(14, 165, 233, 0.8)) brightness(1.3); }
                }
                @keyframes treasureFound {
                  0% { transform: scale(1) rotate(0deg); opacity: 0.8; }
                  50% { transform: scale(1.4) rotate(180deg); opacity: 1; }
                  100% { transform: scale(1.2) rotate(360deg); opacity: 0.9; }
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
