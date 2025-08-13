import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useCurrentToken, useTokenBalance, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { TOKEN_METADATA } from '../../constants'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { useIsCompact } from '../../hooks/useIsCompact';
import { useGameOutcome } from '../../hooks/useGameOutcome'
import HelloWorldPaytable, { HelloWorldPaytableRef } from './HelloWorldPaytable'
import HelloWorldOverlays from './HelloWorldOverlays'
import { renderThinkingOverlay, getThinkingPhaseState, getGamePhaseState } from '../../utils/overlayUtils'
import { GameControls } from '../../components';

// Import bet array for Hello World game
import { betArray } from './betArray'

const CHOICES = {
  lucky: [2, 0, 0],   // 33% chance to win 2x
  risky: [3, 0, 0, 0, 0], // 20% chance to win 3x
}

type Choice = keyof typeof CHOICES

export default function HelloWorld() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const [playing, setPlaying] = React.useState(false)
  const [win, setWin] = React.useState(false)
  const [resultIndex, setResultIndex] = React.useState(0)
  const [choice, setChoice] = React.useState<Choice>('lucky')
  const [wager, setWager] = useWagerInput()
  const token = useCurrentToken();
  const { balance } = useTokenBalance();
  const paytableRef = React.useRef<HelloWorldPaytableRef>(null)
  
  // Game phase management for overlays
  const [gamePhase, setGamePhase] = React.useState<'idle' | 'thinking' | 'dramatic' | 'celebrating' | 'mourning'>('idle')
  const [thinkingPhase, setThinkingPhase] = React.useState(false)
  const [dramaticPause, setDramaticPause] = React.useState(false)
  const [celebrationIntensity, setCelebrationIntensity] = React.useState(0)
  const [thinkingEmoji, setThinkingEmoji] = React.useState('🤔')
  
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

  // Find token metadata for symbol display
  const tokenMeta = token ? TOKEN_METADATA.find(t => t.symbol === token.symbol) : undefined
  const baseWager = tokenMeta?.baseWager ?? (token ? Math.pow(10, token.decimals) : 1)
  const maxWager = baseWager * 1000000
  const tokenPrice = tokenMeta?.usdPrice ?? 0

  // Set default wager: 1 for free tokens, 0 for real tokens
  React.useEffect(() => {
    if (token?.mint?.equals?.(FAKE_TOKEN_MINT)) {
      setWager(baseWager) // 1 token for free token
    } else {
      setWager(0) // 0 for real tokens
    }
  }, [setWager, token, baseWager])

  const sounds = useSound({
    win: '/sounds/win.mp3',
    lose: '/sounds/lose.mp3',
    play: '/sounds/play.mp3',
  })

  const play = async () => {
    try {
      // Reset states and start overlay sequence
      setWin(false)
      setPlaying(true)
      setGamePhase('thinking')
      setThinkingPhase(true)
      setDramaticPause(false)
      setCelebrationIntensity(0)
      
      // Random thinking emoji
      const thinkingEmojis = ['🤔', '🎯', '⚡', '💭', '🔮', '✨']
      setThinkingEmoji(thinkingEmojis[Math.floor(Math.random() * thinkingEmojis.length)])
      
      const selectedChoice = choice
      const selectedBet = CHOICES[choice]

      if (sounds.play) sounds.play('play', { playbackRate: .5 })

      await game.play({
        bet: selectedBet,
        wager,
        metadata: [choice],
      })

      // Thinking phase
      await new Promise(resolve => setTimeout(resolve, 1500))
      setThinkingPhase(false)
      
      // Dramatic pause
      setGamePhase('dramatic')
      setDramaticPause(true)
      await new Promise(resolve => setTimeout(resolve, 1200))
      setDramaticPause(false)

      if (sounds.play) sounds.play('play')

      const result = await game.result()

      const win = result.payout > 0
      const multiplier = win ? result.payout / wager : 0

      setResultIndex(result.resultIndex)
      setWin(win)

      // Track game result in paytable
      paytableRef.current?.trackGame({
        choice: selectedChoice,
        resultIndex: result.resultIndex,
        wasWin: win,
        amount: win ? result.payout - wager : 0,
        multiplier: multiplier,
      })

      // Handle celebration or mourning overlays
      if (win) {
        let intensity = 1
        if (multiplier >= 5) intensity = 3
        else if (multiplier >= 2.5) intensity = 2
        
        setCelebrationIntensity(intensity)
        setGamePhase('celebrating')
        if (sounds.play) sounds.play('win')
        
        // Auto-reset after celebration
        setTimeout(() => {
          setGamePhase('idle')
          setCelebrationIntensity(0)
        }, 4000)
      } else {
        setGamePhase('mourning')
        if (sounds.play) sounds.play('lose')
        
        // Auto-reset after mourning
        setTimeout(() => {
          setGamePhase('idle')
        }, 2500)
      }
      
      // Show outcome overlay
      handleGameComplete({ payout: result.payout, wager })
    } finally {
      setPlaying(false)
    }
  }

  // Responsive scaling logic using useIsCompact
  const isCompact = useIsCompact();
  const [scale, setScale] = React.useState(isCompact ? 1 : 1.2);

  React.useEffect(() => {
    setScale(isCompact ? 1 : 1.2);
  }, [isCompact]);

  const getChoiceMultiplier = (choice: Choice) => {
    const bet = CHOICES[choice]
    const winIndex = bet.findIndex(x => x > 0)
    return winIndex >= 0 ? bet[winIndex] : 0
  }

  const getChoiceChance = (choice: Choice) => {
    const bet = CHOICES[choice]
    const winCount = bet.filter(x => x > 0).length
    return Math.round((winCount / bet.length) * 100)
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <div style={{ display: 'flex', gap: 16, height: '100%', width: '100%' }}>
          {/* Main Game Area */}
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 25%, #60a5fa 50%, #93c5fd 75%, #dbeafe 100%)',
            borderRadius: '24px',
            border: '3px solid rgba(59, 130, 246, 0.3)',
            boxShadow: `
              0 25px 50px rgba(0, 0, 0, 0.5),
              inset 0 2px 4px rgba(255, 255, 255, 0.1),
              inset 0 -2px 4px rgba(0, 0, 0, 0.3),
              0 0 30px rgba(59, 130, 246, 0.2)
            `,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Floating background elements */}
            <div style={{
              position: 'absolute',
              top: '12%',
              left: '10%',
              fontSize: '130px',
              opacity: 0.08,
              transform: 'rotate(-18deg)',
              pointerEvents: 'none',
              color: '#60a5fa'
            }}>🎮</div>
            <div style={{
              position: 'absolute',
              bottom: '18%',
              right: '12%',
              fontSize: '110px',
              opacity: 0.06,
              transform: 'rotate(22deg)',
              pointerEvents: 'none',
              color: '#93c5fd'
            }}>⭐</div>
            <div style={{
              position: 'absolute',
              top: '50%',
              right: '18%',
              fontSize: '90px',
              opacity: 0.05,
              transform: 'rotate(-28deg)',
              pointerEvents: 'none',
              color: '#3b82f6'
            }}>✨</div>
            <div style={{
              position: 'absolute',
              bottom: '40%',
              left: '15%',
              fontSize: '85px',
              opacity: 0.07,
              transform: 'rotate(35deg)',
              pointerEvents: 'none',
              color: '#dbeafe'
            }}>🚀</div>
            
            {/* Background Effects */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(96, 165, 250, 0.1) 0%, transparent 50%)',
              opacity: playing ? 1 : 0.5,
              transition: 'opacity 0.5s ease'
            }} />

            {/* Choice Selection UI */}
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
              <button
                onClick={() => setChoice('lucky')}
                disabled={playing}
                style={{
                  background: choice === 'lucky' 
                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(22, 163, 74, 0.3) 100%)'
                    : 'rgba(0, 0, 0, 0.5)',
                  border: choice === 'lucky' 
                    ? '2px solid rgba(34, 197, 94, 0.5)' 
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: playing ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: playing ? 0.6 : 1
                }}
              >
                🍀 LUCKY ({getChoiceChance('lucky')}% • {getChoiceMultiplier('lucky')}x)
              </button>
              <button
                onClick={() => setChoice('risky')}
                disabled={playing}
                style={{
                  background: choice === 'risky' 
                    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.3) 100%)'
                    : 'rgba(0, 0, 0, 0.5)',
                  border: choice === 'risky' 
                    ? '2px solid rgba(239, 68, 68, 0.5)' 
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: playing ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: playing ? 0.6 : 1
                }}
              >
                🎯 RISKY ({getChoiceChance('risky')}% • {getChoiceMultiplier('risky')}x)
              </button>
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
                background: 'linear-gradient(45deg, #1e40af, #3b82f6, #60a5fa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(59, 130, 246, 0.5)'
              }}>
                Hello World! 🌍
              </h1>
              
              <div style={{
                fontSize: '24px',
                color: '#fff',
                marginBottom: '32px',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}>
                {playing ? (
                  <span style={{ color: '#fbbf24' }}>🎲 Playing...</span>
                ) : (
                  `Choose your luck level!`
                )}
              </div>

              {/* Result Display */}
              {!playing && hasPlayedBefore && (
                <div style={{
                  padding: '16px 32px',
                  borderRadius: '16px',
                  background: win 
                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)',
                  border: `2px solid ${win ? '#22c55e' : '#ef4444'}`,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  marginTop: '24px'
                }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: win ? '#22c55e' : '#ef4444',
                    marginBottom: '8px'
                  }}>
                    {win ? '🎉 YOU WON!' : '😔 TRY AGAIN'}
                  </div>
                  <div style={{ color: '#fff', fontSize: '16px' }}>
                    Result: {resultIndex} • Choice: {choice.toUpperCase()}
                  </div>
                </div>
              )}
            </div>

            {/* Game Status */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0, 0, 0, 0.7)',
              borderRadius: '12px',
              padding: '12px 20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                {playing ? 'THINKING...' : `SELECTED: ${choice.toUpperCase()}`}
              </div>
              <div style={{ color: '#60a5fa', fontSize: '14px', fontWeight: 700 }}>
                {getChoiceMultiplier(choice)}.00x MAX PAYOUT
              </div>
            </div>
            
            {/* Add the overlay component */}
            {renderThinkingOverlay(
              <HelloWorldOverlays
                gamePhase={getGamePhaseState(gamePhase)}
                thinkingPhase={getThinkingPhaseState(thinkingPhase)}
                dramaticPause={dramaticPause}
                celebrationIntensity={celebrationIntensity}
                currentWin={win && profitAmount ? { multiplier: (profitAmount + wager) / wager, amount: profitAmount } : undefined}
                thinkingEmoji={thinkingEmoji}
              />
            )}
          </div>

          {/* Live Paytable */}
          <HelloWorldPaytable
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
        playButtonText={hasPlayedBefore ? 'Restart' : 'Play'}
        onPlayAgain={handlePlayAgain}
      >
        {/* Choice Selection Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 'bold' }}>Strategy:</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <GambaUi.Button
              onClick={() => setChoice('lucky')}
              disabled={playing || showOutcome}
            >
              {choice === 'lucky' ? '✓ 🍀 Lucky' : '🍀 Lucky'}
            </GambaUi.Button>
            <GambaUi.Button
              onClick={() => setChoice('risky')}
              disabled={playing || showOutcome}
            >
              {choice === 'risky' ? '✓ 🎯 Risky' : '🎯 Risky'}
            </GambaUi.Button>
          </div>
        </div>
      </GameControls>
    </>
  )
}
