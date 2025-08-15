import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useCurrentToken, useTokenBalance, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { TOKEN_METADATA } from '../../constants'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { useIsCompact } from '../../hooks/useIsCompact'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import { GameStateProvider, useGameState } from '../../hooks/useGameState'
import PyramidQuestPaytable, { PyramidQuestPaytableRef } from './PyramidQuestPaytable'
import PyramidQuestOverlays from './PyramidQuestOverlays'
import { GameControls } from '../../components'

// Bet arrays for different entrance paths
const ENTRANCE_CHOICES = {
  main: [0, 0, 5, 15],     // Main entrance - moderate risk
  secret: [0, 0, 0, 25],   // Secret passage - high risk, high reward
  side: [0, 2, 8, 12],     // Side entrance - balanced approach
}

type EntranceChoice = keyof typeof ENTRANCE_CHOICES

export default function PyramidQuest() {
  return (
    <GameStateProvider>
      <PyramidQuestGame />
    </GameStateProvider>
  )
}

function PyramidQuestGame() {
  const { gamePhase, setGamePhase } = useGameState()
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const [playing, setPlaying] = React.useState(false)
  const [win, setWin] = React.useState(false)
  const [resultIndex, setResultIndex] = React.useState(0)
  const [choice, setChoice] = React.useState<EntranceChoice>('main')
  const [wager, setWager] = useWagerInput()
  const token = useCurrentToken()
  const { balance } = useTokenBalance()
  const paytableRef = React.useRef<PyramidQuestPaytableRef>(null)
  
  // Multi-phase states
  const [currentChamber, setCurrentChamber] = React.useState(0)
  const [exploringPhase, setExploringPhase] = React.useState(false)
  const [foundTreasure, setFoundTreasure] = React.useState(false)
  const [chamberResults, setChamberResults] = React.useState<('empty' | 'trap' | 'treasure')[]>([])
  const [torchFlicker, setTorchFlicker] = React.useState(true)
  
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
  const maxWager = baseWager * 1000000
  const tokenPrice = tokenMeta?.usdPrice ?? 0

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
      setCurrentChamber(0)
      setExploringPhase(true)
      setFoundTreasure(false)
      setChamberResults([])
      setTorchFlicker(true)
      
      const selectedChoice = choice
      const selectedBet = ENTRANCE_CHOICES[choice]

      if (sounds.play) sounds.play('play', { playbackRate: 0.7 })

      await game.play({
        bet: selectedBet,
        wager,
        metadata: [choice],
      })

      // Get result first but don't reveal it
      const result = await game.result()
      const winResult = result.payout > 0
      const treasureChamber = result.resultIndex
      const multiplier = winResult ? result.payout / wager : 0

      // Create chamber exploration sequence
      const chamberCount = selectedBet.length
      const explorationResults: ('empty' | 'trap' | 'treasure')[] = []
      
      for (let chamber = 0; chamber < chamberCount; chamber++) {
        setCurrentChamber(chamber + 1)
        
        // Simulate exploration with torch lighting effect
        setTorchFlicker(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setTorchFlicker(false)
        await new Promise(resolve => setTimeout(resolve, 800))
        
        let chamberResult: 'empty' | 'trap' | 'treasure'
        if (chamber === treasureChamber && winResult) {
          chamberResult = selectedBet[chamber] >= 15 ? 'treasure' : 'trap'
        } else if (chamber < treasureChamber || (!winResult && Math.random() < 0.4)) {
          chamberResult = Math.random() < 0.6 ? 'empty' : 'trap'
        } else {
          chamberResult = 'empty'
        }
        
        explorationResults.push(chamberResult)
        setChamberResults([...explorationResults])
        
        // If we found the treasure, stop exploring
        if (chamberResult === 'treasure') {
          setFoundTreasure(true)
          break
        }
        
        // Brief pause between chambers
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      setExploringPhase(false)
      setWin(winResult)
      setResultIndex(result.resultIndex)

      // Track result
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

  const getChoiceMultiplier = (choice: EntranceChoice) => {
    const bet = ENTRANCE_CHOICES[choice]
    return Math.max(...bet)
  }

  const getChoiceChance = (choice: EntranceChoice) => {
    const bet = ENTRANCE_CHOICES[choice]
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
            background: 'linear-gradient(135deg, #451a03 0%, #78350f 25%, #a16207 50%, #ca8a04 75%, #eab308 100%)',
            borderRadius: '24px',
            border: '3px solid rgba(202, 138, 4, 0.3)',
            boxShadow: `
              0 25px 50px rgba(0, 0, 0, 0.8),
              inset 0 2px 4px rgba(255, 255, 255, 0.1),
              inset 0 -2px 4px rgba(0, 0, 0, 0.5),
              0 0 30px rgba(202, 138, 4, 0.3)
            `,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Ancient wall texture */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                repeating-linear-gradient(
                  45deg,
                  rgba(120, 53, 15, 0.1) 0px,
                  rgba(120, 53, 15, 0.1) 2px,
                  transparent 2px,
                  transparent 20px
                ),
                repeating-linear-gradient(
                  -45deg,
                  rgba(161, 98, 7, 0.1) 0px,
                  rgba(161, 98, 7, 0.1) 2px,
                  transparent 2px,
                  transparent 20px
                )
              `,
              opacity: 0.4
            }} />
            
            {/* Floating hieroglyphs */}
            <div style={{
              position: 'absolute',
              top: '12%',
              left: '8%',
              fontSize: '80px',
              opacity: 0.1,
              transform: 'rotate(-15deg)',
              pointerEvents: 'none',
              color: '#eab308'
            }}>𓂀</div>
            <div style={{
              position: 'absolute',
              bottom: '15%',
              right: '10%',
              fontSize: '70px',
              opacity: 0.08,
              transform: 'rotate(20deg)',
              pointerEvents: 'none',
              color: '#ca8a04'
            }}>𓋹</div>
            <div style={{
              position: 'absolute',
              top: '55%',
              right: '20%',
              fontSize: '60px',
              opacity: 0.12,
              transform: 'rotate(-10deg)',
              pointerEvents: 'none',
              color: '#a16207'
            }}>𓅓</div>

            {/* Entrance Selection UI */}
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
              {(['main', 'secret', 'side'] as EntranceChoice[]).map((entranceChoice) => (
                <button
                  key={entranceChoice}
                  onClick={() => setChoice(entranceChoice)}
                  disabled={playing}
                  style={{
                    background: choice === entranceChoice 
                      ? 'linear-gradient(135deg, rgba(202, 138, 4, 0.4) 0%, rgba(161, 98, 7, 0.4) 100%)'
                      : 'rgba(0, 0, 0, 0.6)',
                    border: choice === entranceChoice 
                      ? '2px solid rgba(202, 138, 4, 0.7)' 
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
                  {entranceChoice === 'main' && '🚪 MAIN'} 
                  {entranceChoice === 'secret' && '🕳️ SECRET'} 
                  {entranceChoice === 'side' && '📍 SIDE'}
                  <br />
                  <span style={{ fontSize: '10px', opacity: 0.8 }}>
                    {getChoiceChance(entranceChoice)}% • {getChoiceMultiplier(entranceChoice)}x
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
                background: 'linear-gradient(45deg, #451a03, #ca8a04, #eab308)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(234, 179, 8, 0.5)'
              }}>
                ⛰️ PYRAMID QUEST 🏺
              </h1>
              
              <div style={{
                fontSize: '20px',
                color: '#eab308',
                marginBottom: '32px',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
              }}>
                {playing && exploringPhase ? (
                  <span style={{ 
                    color: torchFlicker ? '#fbbf24' : '#eab308',
                    transition: 'color 0.3s ease'
                  }}>
                    🔥 Exploring Chamber {currentChamber}...
                  </span>
                ) : playing ? (
                  <span style={{ color: '#22c55e' }}>🏛️ Exploration Complete</span>
                ) : (
                  'Choose your entrance to the ancient pyramid'
                )}
              </div>

              {/* Chamber Display */}
              {(playing || hasPlayedBefore) && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '16px',
                  marginBottom: '24px',
                  flexWrap: 'wrap'
                }}>
                  {ENTRANCE_CHOICES[choice].map((multiplier, index) => {
                    const isCurrentChamber = exploringPhase && currentChamber === index + 1
                    const isExplored = index < chamberResults.length
                    const chamberResult = chamberResults[index]
                    
                    return (
                      <div
                        key={index}
                        style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '12px',
                          border: isCurrentChamber ? '3px solid #fbbf24' : '2px solid rgba(234, 179, 8, 0.3)',
                          background: isExplored
                            ? (chamberResult === 'treasure' ? 'linear-gradient(135deg, #eab308, #ca8a04)' 
                               : chamberResult === 'trap' ? 'linear-gradient(135deg, #dc2626, #991b1b)'
                               : 'linear-gradient(135deg, #6b7280, #374151)')
                            : 'rgba(0, 0, 0, 0.4)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: '12px',
                          fontWeight: 600,
                          position: 'relative',
                          animation: isCurrentChamber && torchFlicker ? 'flicker 0.5s infinite' : 'none',
                          boxShadow: isCurrentChamber ? '0 0 20px rgba(251, 191, 36, 0.5)' : 'none'
                        }}
                      >
                        <div style={{ fontSize: '20px', marginBottom: '4px' }}>
                          {isExplored 
                            ? (chamberResult === 'treasure' ? '💰' 
                               : chamberResult === 'trap' ? '💀' 
                               : '🕳️')
                            : isCurrentChamber ? '🔥' : '❓'}
                        </div>
                        <div style={{ fontSize: '10px' }}>
                          CHAMBER {index + 1}
                        </div>
                        {multiplier > 0 && (
                          <div style={{ fontSize: '10px', color: '#eab308' }}>
                            {multiplier}x
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
                    {win ? '🎉 TREASURE DISCOVERED!' : '💀 TRAPPED IN THE PYRAMID'}
                  </div>
                  <div style={{ color: '#eab308', fontSize: '16px' }}>
                    {win ? `Ancient gold recovered!` : 'The pharaoh\'s curse claims another explorer'}
                  </div>
                </div>
              )}
            </div>

            {/* Expedition Status */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0, 0, 0, 0.8)',
              borderRadius: '12px',
              padding: '12px 20px',
              border: '1px solid rgba(234, 179, 8, 0.2)',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                {playing ? 'EXPEDITION IN PROGRESS...' : `ENTRANCE: ${choice.toUpperCase()}`}
              </div>
              <div style={{ color: '#eab308', fontSize: '14px', fontWeight: 700 }}>
                {getChoiceMultiplier(choice)}.00x PHARAOH'S GOLD
              </div>
            </div>
            
            {/* Overlays */}
            <PyramidQuestOverlays
              exploringPhase={exploringPhase}
              currentChamber={currentChamber}
              foundTreasure={foundTreasure}
              win={win}
              choice={choice}
              torchFlicker={torchFlicker}
            
              currentBalance={balance}
              wager={wager}
              />

            {/* Animations */}
            <style>
              {`
                @keyframes flicker {
                  0%, 100% { 
                    box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
                    filter: brightness(1);
                  }
                  50% { 
                    box-shadow: 0 0 30px rgba(251, 191, 36, 0.8);
                    filter: brightness(1.2);
                  }
                }
              `}
            </style>
          </div>

          {/* Live Paytable */}
          <PyramidQuestPaytable
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
        playButtonText={hasPlayedBefore ? 'Explore Again' : 'Enter Pyramid'}
        onPlayAgain={handlePlayAgain}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 'bold' }}>Entrance:</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['main', 'secret', 'side'] as EntranceChoice[]).map((entranceChoice) => (
              <GambaUi.Button
                key={entranceChoice}
                onClick={() => setChoice(entranceChoice)}
                disabled={playing || showOutcome}
              >
                {choice === entranceChoice ? '✓ ' : ''}
                {entranceChoice === 'main' && '🚪 Main'}
                {entranceChoice === 'secret' && '🕳️ Secret'}
                {entranceChoice === 'side' && '📍 Side'}
              </GambaUi.Button>
            ))}
          </div>
        </div>
      </GameControls>
    </>
  )
}
