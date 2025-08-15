import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useCurrentToken, useTokenBalance, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { TOKEN_METADATA } from '../../constants'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { useIsCompact } from '../../hooks/useIsCompact'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import { GameStateProvider, useGameState } from '../../hooks/useGameState'
import NeonCyberHackPaytable, { NeonCyberHackPaytableRef } from './NeonCyberHackPaytable'
import NeonCyberHackOverlays from './NeonCyberHackOverlays'
import { GameControls } from '../../components'

// Bet arrays for different hacking approaches
const HACK_CHOICES = {
  stealth: [0, 0, 2, 5, 10],    // Stealth approach - multiple small wins
  brute: [0, 0, 0, 15],         // Brute force - moderate risk
  elite: [0, 0, 0, 0, 25],      // Elite hacking - extreme risk/reward
}

type HackChoice = keyof typeof HACK_CHOICES

export default function NeonCyberHack() {
  return (
    <GameStateProvider>
      <NeonCyberHackGame />
    </GameStateProvider>
  )
}

function NeonCyberHackGame() {
  const { gamePhase, setGamePhase } = useGameState()
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const [playing, setPlaying] = React.useState(false)
  const [win, setWin] = React.useState(false)
  const [resultIndex, setResultIndex] = React.useState(0)
  const [choice, setChoice] = React.useState<HackChoice>('stealth')
  const [wager, setWager] = useWagerInput()
  const token = useCurrentToken()
  const { balance } = useTokenBalance()
  const paytableRef = React.useRef<NeonCyberHackPaytableRef>(null)
  
  // Multi-phase states
  const [currentServer, setCurrentServer] = React.useState(0)
  const [hackingPhase, setHackingPhase] = React.useState(false)
  const [accessGranted, setAccessGranted] = React.useState(false)
  const [serverResults, setServerResults] = React.useState<('blocked' | 'honeypot' | 'access')[]>([])
  const [hackingProgress, setHackingProgress] = React.useState(0)
  
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
      setCurrentServer(0)
      setHackingPhase(true)
      setAccessGranted(false)
      setServerResults([])
      setHackingProgress(0)
      
      const selectedChoice = choice
      const selectedBet = HACK_CHOICES[choice]

      if (sounds.play) sounds.play('play', { playbackRate: 0.8 })

      await game.play({
        bet: selectedBet,
        wager,
        metadata: [choice],
      })

      const result = await game.result()
      const winResult = result.payout > 0
      const targetServer = result.resultIndex
      const multiplier = winResult ? result.payout / wager : 0

      // Create server hacking sequence
      const serverCount = selectedBet.length
      const hackResults: ('blocked' | 'honeypot' | 'access')[] = []
      
      for (let server = 0; server < serverCount; server++) {
        setCurrentServer(server + 1)
        setHackingProgress(0)
        
        // Simulate hacking progress
        for (let progress = 0; progress <= 100; progress += 20) {
          setHackingProgress(progress)
          await new Promise(resolve => setTimeout(resolve, 150))
        }
        
        await new Promise(resolve => setTimeout(resolve, 500))
        
        let serverResult: 'blocked' | 'honeypot' | 'access'
        if (server === targetServer && winResult) {
          serverResult = selectedBet[server] >= 15 ? 'access' : 'honeypot'
        } else if (server < targetServer || (!winResult && Math.random() < 0.4)) {
          serverResult = Math.random() < 0.7 ? 'blocked' : 'honeypot'
        } else {
          serverResult = 'blocked'
        }
        
        hackResults.push(serverResult)
        setServerResults([...hackResults])
        
        if (serverResult === 'access') {
          setAccessGranted(true)
          break
        }
        
        await new Promise(resolve => setTimeout(resolve, 800))
      }

      setHackingPhase(false)
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

  const getChoiceMultiplier = (choice: HackChoice) => {
    const bet = HACK_CHOICES[choice]
    return Math.max(...bet)
  }

  const getChoiceChance = (choice: HackChoice) => {
    const bet = HACK_CHOICES[choice]
    const winCount = bet.filter(x => x > 0).length
    return Math.round((winCount / bet.length) * 100)
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <div style={{ display: 'flex', gap: 16, height: '100%', width: '100%' }}>
          <div style={{ 
            flex: 1, 
            minHeight: '400px',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)',
            borderRadius: '24px',
            border: '3px solid rgba(83, 52, 131, 0.5)',
            boxShadow: `
              0 25px 50px rgba(0, 0, 0, 0.9),
              inset 0 2px 4px rgba(147, 51, 234, 0.1),
              inset 0 -2px 4px rgba(0, 0, 0, 0.5),
              0 0 40px rgba(83, 52, 131, 0.4)
            `,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Advanced Matrix Effects */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                repeating-linear-gradient(
                  90deg,
                  rgba(34, 197, 94, 0.05) 0px,
                  rgba(34, 197, 94, 0.05) 1px,
                  transparent 1px,
                  transparent 30px
                ),
                repeating-linear-gradient(
                  0deg,
                  rgba(34, 197, 94, 0.05) 0px,
                  rgba(34, 197, 94, 0.05) 1px,
                  transparent 1px,
                  transparent 30px
                ),
                repeating-linear-gradient(
                  45deg,
                  rgba(147, 51, 234, 0.02) 0px,
                  rgba(147, 51, 234, 0.02) 1px,
                  transparent 1px,
                  transparent 60px
                )
              `,
              animation: 'matrix 15s linear infinite'
            }} />

            {/* Digital Circuit Patterns */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.06) 0%, transparent 50%),
                radial-gradient(circle at 60% 20%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)
              `,
              animation: 'circuitPulse 8s ease-in-out infinite'
            }} />

            {/* Vertical Data Streams */}
            {[...Array(8)].map((_, i) => (
              <div
                key={`stream-${i}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: `${15 + i * 12}%`,
                  width: '2px',
                  height: '100%',
                  background: `linear-gradient(to bottom, 
                    transparent 0%, 
                    ${i % 3 === 0 ? '#22c55e' : i % 3 === 1 ? '#9333ea' : '#06b6d4'}40 20%, 
                    ${i % 3 === 0 ? '#22c55e' : i % 3 === 1 ? '#9333ea' : '#06b6d4'}80 50%, 
                    transparent 100%
                  )`,
                  animation: `dataStream ${3 + i * 0.5}s linear infinite`,
                  animationDelay: `${i * 0.3}s`,
                  opacity: 0.6
                }}
              />
            ))}

            {/* Enhanced Floating Cyber Elements */}
            <div style={{
              position: 'absolute',
              top: '10%',
              left: '8%',
              fontSize: '70px',
              opacity: 0.15,
              transform: 'rotate(-25deg)',
              color: '#22c55e',
              animation: 'float 12s ease-in-out infinite',
              filter: 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.3))'
            }}>⚡</div>
            
            <div style={{
              position: 'absolute',
              bottom: '15%',
              right: '12%',
              fontSize: '50px',
              opacity: 0.12,
              transform: 'rotate(30deg)',
              color: '#9333ea',
              animation: 'float 10s ease-in-out infinite reverse',
              filter: 'drop-shadow(0 0 15px rgba(147, 51, 234, 0.4))'
            }}>🔒</div>
            
            <div style={{
              position: 'absolute',
              top: '65%',
              right: '20%',
              fontSize: '60px',
              opacity: 0.14,
              transform: 'rotate(-20deg)',
              color: '#06b6d4',
              animation: 'float 9s ease-in-out infinite',
              filter: 'drop-shadow(0 0 18px rgba(6, 182, 212, 0.3))'
            }}>💾</div>

            {/* Additional Cyber Icons */}
            <div style={{
              position: 'absolute',
              top: '25%',
              right: '8%',
              fontSize: '45px',
              opacity: 0.1,
              transform: 'rotate(15deg)',
              color: '#f59e0b',
              animation: 'float 8s ease-in-out infinite',
              filter: 'drop-shadow(0 0 12px rgba(245, 158, 11, 0.3))'
            }}>🌐</div>
            
            <div style={{
              position: 'absolute',
              bottom: '40%',
              left: '15%',
              fontSize: '40px',
              opacity: 0.09,
              transform: 'rotate(-10deg)',
              color: '#ef4444',
              animation: 'float 11s ease-in-out infinite reverse',
              filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.3))'
            }}>🛡️</div>

            <div style={{
              position: 'absolute',
              top: '45%',
              left: '5%',
              fontSize: '35px',
              opacity: 0.08,
              transform: 'rotate(20deg)',
              color: '#8b5cf6',
              animation: 'float 7s ease-in-out infinite',
              filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.3))'
            }}>�</div>

            {/* Pulsing Connection Nodes */}
            {[...Array(6)].map((_, i) => (
              <div
                key={`node-${i}`}
                style={{
                  position: 'absolute',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: i % 2 === 0 ? '#22c55e' : '#9333ea',
                  boxShadow: `0 0 ${8 + i * 2}px ${i % 2 === 0 ? '#22c55e' : '#9333ea'}`,
                  top: `${20 + i * 15}%`,
                  left: `${10 + i * 10}%`,
                  animation: `nodePulse ${2 + i * 0.3}s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}

            {/* Scanning Lines */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent 0%, #22c55e 50%, transparent 100%)',
              animation: 'scanLine 4s linear infinite',
              opacity: 0.6
            }} />

            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent 0%, #9333ea 50%, transparent 100%)',
              animation: 'scanLine 6s linear infinite reverse',
              opacity: 0.4
            }} />

            {/* Enhanced Approach Selection */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              zIndex: 10
            }}>
              {(['stealth', 'brute', 'elite'] as HackChoice[]).map((hackChoice) => (
                <button
                  key={hackChoice}
                  onClick={() => setChoice(hackChoice)}
                  disabled={playing}
                  style={{
                    background: choice === hackChoice 
                      ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.4) 0%, rgba(22, 163, 74, 0.3) 100%)'
                      : 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(26, 26, 46, 0.6) 100%)',
                    border: choice === hackChoice 
                      ? '2px solid rgba(34, 197, 94, 0.8)' 
                      : '1px solid rgba(147, 51, 234, 0.4)',
                    borderRadius: '16px',
                    padding: '16px 24px',
                    color: choice === hackChoice ? '#22c55e' : '#9333ea',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: playing ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: playing ? 0.6 : 1,
                    textTransform: 'uppercase',
                    fontFamily: 'monospace',
                    backdropFilter: 'blur(10px)',
                    boxShadow: choice === hackChoice 
                      ? '0 8px 32px rgba(34, 197, 94, 0.3), inset 0 2px 4px rgba(34, 197, 94, 0.1)'
                      : '0 4px 16px rgba(0, 0, 0, 0.5)',
                    position: 'relative',
                    overflow: 'hidden',
                    minWidth: '140px'
                  }}
                >
                  {/* Button glow effect */}
                  {choice === hackChoice && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, rgba(34, 197, 94, 0.1), rgba(6, 182, 212, 0.1))',
                      animation: 'buttonGlow 2s ease-in-out infinite',
                      borderRadius: '14px'
                    }} />
                  )}
                  
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: '16px', marginBottom: '4px' }}>
                      {hackChoice === 'stealth' && '🥷 STEALTH'} 
                      {hackChoice === 'brute' && '💥 BRUTE'} 
                      {hackChoice === 'elite' && '🎯 ELITE'}
                    </div>
                    <div style={{ 
                      fontSize: '10px', 
                      opacity: 0.9,
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '8px'
                    }}>
                      <span>{getChoiceChance(hackChoice)}% WIN</span>
                      <span>{getChoiceMultiplier(hackChoice)}x MAX</span>
                    </div>
                  </div>
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
                background: 'linear-gradient(45deg, #22c55e, #06b6d4, #9333ea)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(34, 197, 94, 0.5)',
                fontFamily: 'monospace'
              }}>
                💻 NEON CYBER HACK 🔓
              </h1>
              
              <div style={{
                fontSize: '20px',
                color: '#22c55e',
                marginBottom: '32px',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                fontFamily: 'monospace'
              }}>
                {playing && hackingPhase ? (
                  <span style={{ color: '#fbbf24' }}>
                    &gt; HACKING SERVER_{currentServer.toString().padStart(2, '0')}...
                  </span>
                ) : playing ? (
                  <span style={{ color: '#22c55e' }}>&gt; OPERATION_COMPLETE</span>
                ) : (
                  '&gt; SELECT_INFILTRATION_METHOD'
                )}
              </div>

              {/* Enhanced Servers Display */}
              {(playing || hasPlayedBefore) && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '20px',
                  marginBottom: '32px',
                  flexWrap: 'wrap'
                }}>
                  {HACK_CHOICES[choice].map((multiplier, index) => {
                    const isCurrentServer = hackingPhase && currentServer === index + 1
                    const isHacked = index < serverResults.length
                    const serverResult = serverResults[index]
                    
                    return (
                      <div
                        key={index}
                        style={{
                          width: '90px',
                          height: '90px',
                          borderRadius: '12px',
                          border: isCurrentServer 
                            ? '3px solid #22c55e' 
                            : isHacked 
                              ? `2px solid ${serverResult === 'access' ? '#22c55e' : serverResult === 'honeypot' ? '#f59e0b' : '#ef4444'}`
                              : '2px solid rgba(147, 51, 234, 0.4)',
                          background: isHacked
                            ? (serverResult === 'access' ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                               : serverResult === 'honeypot' ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                               : 'linear-gradient(135deg, #ef4444, #dc2626)')
                            : isCurrentServer
                              ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(6, 182, 212, 0.2))'
                              : 'linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(26, 26, 46, 0.6))',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isHacked ? '#fff' : isCurrentServer ? '#22c55e' : '#9333ea',
                          fontSize: '12px',
                          fontWeight: 700,
                          fontFamily: 'monospace',
                          position: 'relative',
                          animation: isCurrentServer ? 'serverHack 0.6s infinite' : 'none',
                          boxShadow: isCurrentServer 
                            ? '0 0 30px rgba(34, 197, 94, 0.6), inset 0 2px 8px rgba(34, 197, 94, 0.2)' 
                            : isHacked 
                              ? `0 8px 24px ${serverResult === 'access' ? 'rgba(34, 197, 94, 0.4)' : serverResult === 'honeypot' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`
                              : '0 4px 16px rgba(0, 0, 0, 0.5)',
                          backdropFilter: 'blur(10px)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {/* Server icon with enhanced visuals */}
                        <div style={{ 
                          fontSize: '20px', 
                          marginBottom: '6px',
                          filter: isCurrentServer ? 'drop-shadow(0 0 8px #22c55e)' : 'none',
                          animation: isCurrentServer ? 'iconPulse 1s ease-in-out infinite' : 'none'
                        }}>
                          {isHacked 
                            ? (serverResult === 'access' ? '🔓' 
                               : serverResult === 'honeypot' ? '🍯' 
                               : '🚫')
                            : isCurrentServer ? '⚡' : '🖥️'}
                        </div>
                        
                        {/* Server label */}
                        <div style={{ 
                          fontSize: '9px',
                          marginBottom: '2px',
                          letterSpacing: '0.5px'
                        }}>
                          SRV_{(index + 1).toString().padStart(2, '0')}
                        </div>
                        
                        {/* Multiplier display */}
                        {multiplier > 0 && (
                          <div style={{ 
                            fontSize: '10px', 
                            color: isHacked ? '#fff' : '#22c55e',
                            fontWeight: 800,
                            textShadow: '0 0 8px currentColor'
                          }}>
                            {multiplier}x
                          </div>
                        )}
                        
                        {/* Enhanced progress bar for current server */}
                        {isCurrentServer && (
                          <div style={{
                            position: 'absolute',
                            bottom: '6px',
                            left: '6px',
                            right: '6px',
                            height: '4px',
                            background: 'rgba(0, 0, 0, 0.7)',
                            borderRadius: '2px',
                            overflow: 'hidden',
                            border: '1px solid rgba(34, 197, 94, 0.5)'
                          }}>
                            <div style={{
                              width: `${hackingProgress}%`,
                              height: '100%',
                              background: 'linear-gradient(90deg, #22c55e, #06b6d4)',
                              borderRadius: '1px',
                              transition: 'width 0.15s ease',
                              boxShadow: '0 0 6px #22c55e'
                            }} />
                          </div>
                        )}

                        {/* Status indicator particles */}
                        {isCurrentServer && (
                          <>
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={`particle-${i}`}
                                style={{
                                  position: 'absolute',
                                  width: '2px',
                                  height: '2px',
                                  borderRadius: '50%',
                                  background: '#22c55e',
                                  top: `${30 + i * 10}%`,
                                  left: `${20 + i * 20}%`,
                                  animation: `particle ${1 + i * 0.3}s ease-in-out infinite`,
                                  animationDelay: `${i * 0.2}s`
                                }}
                              />
                            ))}
                          </>
                        )}

                        {/* Connection lines between servers */}
                        {index < HACK_CHOICES[choice].length - 1 && (
                          <div style={{
                            position: 'absolute',
                            right: '-22px',
                            top: '50%',
                            width: '20px',
                            height: '2px',
                            background: isHacked || (hackingPhase && currentServer > index + 1)
                              ? 'linear-gradient(90deg, #22c55e, #06b6d4)'
                              : 'rgba(147, 51, 234, 0.3)',
                            transform: 'translateY(-50%)',
                            borderRadius: '1px',
                            zIndex: -1
                          }} />
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Result Display */}
              {!playing && hasPlayedBefore && (
                <div style={{
                  padding: '16px 32px',
                  borderRadius: '12px',
                  background: win 
                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)',
                  border: `2px solid ${win ? '#22c55e' : '#ef4444'}`,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7)',
                  marginTop: '24px',
                  fontFamily: 'monospace'
                }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: win ? '#22c55e' : '#ef4444',
                    marginBottom: '8px'
                  }}>
                    {win ? '&gt; ACCESS_GRANTED' : '&gt; SECURITY_BREACH_DETECTED'}
                  </div>
                  <div style={{ color: '#9333ea', fontSize: '16px' }}>
                    {win ? 'Data extracted successfully!' : 'Firewall blocked all attempts'}
                  </div>
                </div>
              )}
            </div>


            
            <NeonCyberHackOverlays
              hackingPhase={hackingPhase}
              currentServer={currentServer}
              accessGranted={accessGranted}
              win={win}
              choice={choice}
              hackingProgress={hackingProgress}
            
                currentBalance={balance}
                wager={wager}
              />

            <style>
              {`
                @keyframes matrix {
                  0% { transform: translateY(0); opacity: 1; }
                  100% { transform: translateY(-30px); opacity: 0.8; }
                }
                
                @keyframes circuitPulse {
                  0%, 100% { opacity: 0.6; transform: scale(1); }
                  50% { opacity: 1; transform: scale(1.05); }
                }
                
                @keyframes dataStream {
                  0% { 
                    transform: translateY(-100%); 
                    opacity: 0; 
                    filter: blur(2px);
                  }
                  10% { 
                    opacity: 1; 
                    filter: blur(0px);
                  }
                  90% { 
                    opacity: 1; 
                    filter: blur(0px);
                  }
                  100% { 
                    transform: translateY(100vh); 
                    opacity: 0; 
                    filter: blur(2px);
                  }
                }
                
                @keyframes float {
                  0%, 100% { 
                    transform: translateY(0px) rotate(0deg); 
                    opacity: 0.15; 
                  }
                  33% { 
                    transform: translateY(-20px) rotate(5deg); 
                    opacity: 0.25; 
                  }
                  66% { 
                    transform: translateY(-10px) rotate(-3deg); 
                    opacity: 0.20; 
                  }
                }
                
                @keyframes nodePulse {
                  0%, 100% { 
                    transform: scale(1); 
                    opacity: 0.6; 
                  }
                  50% { 
                    transform: scale(1.5); 
                    opacity: 1; 
                  }
                }
                
                @keyframes scanLine {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(100vw); }
                }
                
                @keyframes buttonGlow {
                  0%, 100% { opacity: 0.1; }
                  50% { opacity: 0.3; }
                }
                
                @keyframes serverHack {
                  0%, 100% { 
                    box-shadow: 0 0 30px rgba(34, 197, 94, 0.6), inset 0 2px 8px rgba(34, 197, 94, 0.2);
                    border-color: #22c55e;
                    transform: scale(1);
                  }
                  50% { 
                    box-shadow: 0 0 40px rgba(34, 197, 94, 0.9), inset 0 2px 12px rgba(34, 197, 94, 0.4);
                    border-color: #16a34a;
                    transform: scale(1.02);
                  }
                }
                
                @keyframes iconPulse {
                  0%, 100% { 
                    transform: scale(1); 
                    filter: drop-shadow(0 0 8px #22c55e); 
                  }
                  50% { 
                    transform: scale(1.1); 
                    filter: drop-shadow(0 0 12px #22c55e); 
                  }
                }
                
                @keyframes particle {
                  0%, 100% { 
                    opacity: 0; 
                    transform: scale(0); 
                  }
                  50% { 
                    opacity: 1; 
                    transform: scale(1); 
                  }
                }
                
                @keyframes hack {
                  0%, 100% { 
                    box-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
                    border-color: #22c55e;
                  }
                  50% { 
                    box-shadow: 0 0 30px rgba(34, 197, 94, 0.8);
                    border-color: #16a34a;
                  }
                }
              `}
            </style>
          </div>

          <NeonCyberHackPaytable
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
        playButtonText={hasPlayedBefore ? 'Hack Again' : 'Initialize Hack'}
        onPlayAgain={handlePlayAgain}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 'bold' }}>Method:</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['stealth', 'brute', 'elite'] as HackChoice[]).map((hackChoice) => (
              <GambaUi.Button
                key={hackChoice}
                onClick={() => setChoice(hackChoice)}
                disabled={playing || showOutcome}
              >
                {choice === hackChoice ? '✓ ' : ''}
                {hackChoice === 'stealth' && '🥷 Stealth'}
                {hackChoice === 'brute' && '💥 Brute'}
                {hackChoice === 'elite' && '🎯 Elite'}
              </GambaUi.Button>
            ))}
          </div>
        </div>
      </GameControls>
    </>
  )
}
