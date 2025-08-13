import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useCurrentToken, useTokenBalance, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { TOKEN_METADATA } from '../../src/constants'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { useIsCompact } from '../../src/hooks/useIsCompact'
import { useGameOutcome } from '../../src/hooks/useGameOutcome'
import NeonCyberHackPaytable, { NeonCyberHackPaytableRef } from './NeonCyberHackPaytable'
import NeonCyberHackOverlays from './NeonCyberHackOverlays'
import { GameControls } from '../../src/components'

// Bet arrays for different hacking approaches
const HACK_CHOICES = {
  stealth: [0, 0, 2, 5, 10],    // Stealth approach - multiple small wins
  brute: [0, 0, 0, 15],         // Brute force - moderate risk
  elite: [0, 0, 0, 0, 25],      // Elite hacking - extreme risk/reward
}

type HackChoice = keyof typeof HACK_CHOICES

export default function NeonCyberHack() {
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
            {/* Matrix-style background */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                repeating-linear-gradient(
                  90deg,
                  rgba(34, 197, 94, 0.03) 0px,
                  rgba(34, 197, 94, 0.03) 1px,
                  transparent 1px,
                  transparent 40px
                ),
                repeating-linear-gradient(
                  0deg,
                  rgba(34, 197, 94, 0.03) 0px,
                  rgba(34, 197, 94, 0.03) 1px,
                  transparent 1px,
                  transparent 40px
                )
              `,
              animation: 'matrix 10s linear infinite'
            }} />
            
            {/* Floating cyber elements */}
            <div style={{
              position: 'absolute',
              top: '15%',
              left: '10%',
              fontSize: '60px',
              opacity: 0.1,
              transform: 'rotate(-20deg)',
              color: '#22c55e',
              animation: 'float 8s ease-in-out infinite'
            }}>⚡</div>
            <div style={{
              position: 'absolute',
              bottom: '20%',
              right: '15%',
              fontSize: '40px',
              opacity: 0.08,
              transform: 'rotate(25deg)',
              color: '#9333ea',
              animation: 'float 6s ease-in-out infinite reverse'
            }}>🔒</div>
            <div style={{
              position: 'absolute',
              top: '60%',
              right: '25%',
              fontSize: '50px',
              opacity: 0.12,
              transform: 'rotate(-15deg)',
              color: '#06b6d4',
              animation: 'float 7s ease-in-out infinite'
            }}>💾</div>

            {/* Approach Selection */}
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
              {(['stealth', 'brute', 'elite'] as HackChoice[]).map((hackChoice) => (
                <button
                  key={hackChoice}
                  onClick={() => setChoice(hackChoice)}
                  disabled={playing}
                  style={{
                    background: choice === hackChoice 
                      ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(22, 163, 74, 0.3) 100%)'
                      : 'rgba(0, 0, 0, 0.7)',
                    border: choice === hackChoice 
                      ? '2px solid rgba(34, 197, 94, 0.7)' 
                      : '1px solid rgba(147, 51, 234, 0.3)',
                    borderRadius: '12px',
                    padding: '10px 20px',
                    color: choice === hackChoice ? '#22c55e' : '#9333ea',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: playing ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: playing ? 0.6 : 1,
                    textTransform: 'uppercase',
                    fontFamily: 'monospace'
                  }}
                >
                  {hackChoice === 'stealth' && '🥷 STEALTH'} 
                  {hackChoice === 'brute' && '💥 BRUTE'} 
                  {hackChoice === 'elite' && '🎯 ELITE'}
                  <br />
                  <span style={{ fontSize: '10px', opacity: 0.8 }}>
                    {getChoiceChance(hackChoice)}% • {getChoiceMultiplier(hackChoice)}x
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

              {/* Servers Display */}
              {(playing || hasPlayedBefore) && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '16px',
                  marginBottom: '24px',
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
                          width: '80px',
                          height: '80px',
                          borderRadius: '8px',
                          border: isCurrentServer ? '2px solid #22c55e' : '1px solid rgba(147, 51, 234, 0.3)',
                          background: isHacked
                            ? (serverResult === 'access' ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                               : serverResult === 'honeypot' ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                               : 'linear-gradient(135deg, #ef4444, #dc2626)')
                            : 'rgba(0, 0, 0, 0.5)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isHacked ? '#fff' : '#9333ea',
                          fontSize: '12px',
                          fontWeight: 600,
                          fontFamily: 'monospace',
                          position: 'relative',
                          animation: isCurrentServer ? 'hack 0.5s infinite' : 'none',
                          boxShadow: isCurrentServer ? '0 0 20px rgba(34, 197, 94, 0.5)' : 'none'
                        }}
                      >
                        <div style={{ fontSize: '16px', marginBottom: '4px' }}>
                          {isHacked 
                            ? (serverResult === 'access' ? '✅' 
                               : serverResult === 'honeypot' ? '🍯' 
                               : '🚫')
                            : isCurrentServer ? '⚡' : '🖥️'}
                        </div>
                        <div style={{ fontSize: '8px' }}>
                          SRV_{(index + 1).toString().padStart(2, '0')}
                        </div>
                        {multiplier > 0 && (
                          <div style={{ fontSize: '9px', color: '#22c55e' }}>
                            {multiplier}x
                          </div>
                        )}
                        
                        {/* Progress bar for current server */}
                        {isCurrentServer && (
                          <div style={{
                            position: 'absolute',
                            bottom: '2px',
                            left: '4px',
                            right: '4px',
                            height: '3px',
                            background: 'rgba(0, 0, 0, 0.5)',
                            borderRadius: '1px'
                          }}>
                            <div style={{
                              width: `${hackingProgress}%`,
                              height: '100%',
                              background: '#22c55e',
                              borderRadius: '1px',
                              transition: 'width 0.15s ease'
                            }} />
                          </div>
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

            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0, 0, 0, 0.8)',
              borderRadius: '12px',
              padding: '12px 20px',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
              fontFamily: 'monospace'
            }}>
              <div style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                {playing ? 'INFILTRATION_IN_PROGRESS...' : `METHOD: ${choice.toUpperCase()}`}
              </div>
              <div style={{ color: '#22c55e', fontSize: '14px', fontWeight: 700 }}>
                MAX_PAYOUT: {getChoiceMultiplier(choice)}.00x
              </div>
            </div>
            
            <NeonCyberHackOverlays
              hackingPhase={hackingPhase}
              currentServer={currentServer}
              accessGranted={accessGranted}
              win={win}
              choice={choice}
              hackingProgress={hackingProgress}
            />

            <style>
              {`
                @keyframes matrix {
                  0% { transform: translateY(0); }
                  100% { transform: translateY(-40px); }
                }
                @keyframes float {
                  0%, 100% { transform: translateY(0px) rotate(0deg); }
                  50% { transform: translateY(-15px) rotate(5deg); }
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
