import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useCurrentToken, useTokenBalance, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { TOKEN_METADATA } from '../../constants'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { useIsCompact } from '../../hooks/useIsCompact'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import GalacticSalvagePaytable, { GalacticSalvagePaytableRef } from './GalacticSalvagePaytable'
import GalacticSalvageOverlays from './GalacticSalvageOverlays'
import { GameControls } from '../../components'

// Bet arrays for different sectors
const SECTOR_CHOICES = {
  safe: [0, 2, 3, 10],     // Safe route with moderate rewards
  risky: [0, 0, 5, 15],    // Riskier route with higher rewards
  extreme: [0, 0, 0, 25],  // Extreme risk, extreme reward
}

type SectorChoice = keyof typeof SECTOR_CHOICES

export default function GalacticSalvage() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const [playing, setPlaying] = React.useState(false)
  const [win, setWin] = React.useState(false)
  const [resultIndex, setResultIndex] = React.useState(0)
  const [choice, setChoice] = React.useState<SectorChoice>('safe')
  const [wager, setWager] = useWagerInput()
  const token = useCurrentToken()
  const { balance } = useTokenBalance()
  const paytableRef = React.useRef<GalacticSalvagePaytableRef>(null)
  
  // Multi-phase states
  const [currentSector, setCurrentSector] = React.useState(0)
  const [scanningPhase, setScanningPhase] = React.useState(false)
  const [foundLoot, setFoundLoot] = React.useState(false)
  const [sectorResults, setSectorResults] = React.useState<('empty' | 'debris' | 'jackpot')[]>([])
  
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
      setCurrentSector(0)
      setScanningPhase(true)
      setFoundLoot(false)
      setSectorResults([])
      
      const selectedChoice = choice
      const selectedBet = SECTOR_CHOICES[choice]

      if (sounds.play) sounds.play('play', { playbackRate: 0.5 })

      await game.play({
        bet: selectedBet,
        wager,
        metadata: [choice],
      })

      // Get result first but don't reveal it
      const result = await game.result()
      const winResult = result.payout > 0
      const winSector = result.resultIndex
      const multiplier = winResult ? result.payout / wager : 0

      // Create sector scanning sequence
      const sectorCount = selectedBet.length
      const scanResults: ('empty' | 'debris' | 'jackpot')[] = []
      
      for (let sector = 0; sector < sectorCount; sector++) {
        setCurrentSector(sector + 1)
        
        // Simulate scanning delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        let sectorResult: 'empty' | 'debris' | 'jackpot'
        if (sector === winSector && winResult) {
          sectorResult = selectedBet[sector] >= 10 ? 'jackpot' : 'debris'
        } else if (sector < winSector || (!winResult && Math.random() < 0.3)) {
          sectorResult = Math.random() < 0.5 ? 'empty' : 'debris'
        } else {
          sectorResult = 'empty'
        }
        
        scanResults.push(sectorResult)
        setSectorResults([...scanResults])
        
        // If we found the jackpot, stop scanning
        if (sectorResult === 'jackpot') {
          setFoundLoot(true)
          break
        }
      }

      setScanningPhase(false)
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

  const getChoiceMultiplier = (choice: SectorChoice) => {
    const bet = SECTOR_CHOICES[choice]
    return Math.max(...bet)
  }

  const getChoiceChance = (choice: SectorChoice) => {
    const bet = SECTOR_CHOICES[choice]
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
            background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #0e4b99 100%)',
            borderRadius: '24px',
            border: '3px solid rgba(14, 75, 153, 0.3)',
            boxShadow: `
              0 25px 50px rgba(0, 0, 0, 0.8),
              inset 0 2px 4px rgba(255, 255, 255, 0.1),
              inset 0 -2px 4px rgba(0, 0, 0, 0.5),
              0 0 30px rgba(14, 75, 153, 0.3)
            `,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Space Background Effects */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(2px 2px at 20px 30px, white, transparent),
                radial-gradient(2px 2px at 40px 70px, white, transparent),
                radial-gradient(1px 1px at 90px 40px, white, transparent),
                radial-gradient(1px 1px at 130px 80px, white, transparent),
                radial-gradient(2px 2px at 160px 30px, white, transparent)
              `,
              backgroundRepeat: 'repeat',
              backgroundSize: '200px 100px',
              opacity: 0.6,
              animation: 'stars 20s linear infinite'
            }} />
            
            {/* Floating space debris */}
            <div style={{
              position: 'absolute',
              top: '15%',
              left: '10%',
              fontSize: '60px',
              opacity: 0.1,
              transform: 'rotate(-25deg)',
              pointerEvents: 'none',
              animation: 'float 6s ease-in-out infinite'
            }}>🛰️</div>
            <div style={{
              position: 'absolute',
              bottom: '20%',
              right: '15%',
              fontSize: '40px',
              opacity: 0.08,
              transform: 'rotate(15deg)',
              pointerEvents: 'none',
              animation: 'float 8s ease-in-out infinite reverse'
            }}>💫</div>
            <div style={{
              position: 'absolute',
              top: '60%',
              right: '25%',
              fontSize: '30px',
              opacity: 0.12,
              transform: 'rotate(-10deg)',
              pointerEvents: 'none',
              animation: 'float 7s ease-in-out infinite'
            }}>🌌</div>

            {/* Sector Selection UI */}
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
              {(['safe', 'risky', 'extreme'] as SectorChoice[]).map((sectorChoice) => (
                <button
                  key={sectorChoice}
                  onClick={() => setChoice(sectorChoice)}
                  disabled={playing}
                  style={{
                    background: choice === sectorChoice 
                      ? 'linear-gradient(135deg, rgba(14, 75, 153, 0.4) 0%, rgba(22, 33, 62, 0.4) 100%)'
                      : 'rgba(0, 0, 0, 0.6)',
                    border: choice === sectorChoice 
                      ? '2px solid rgba(14, 75, 153, 0.7)' 
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
                  {sectorChoice === 'safe' && '🛡️ SAFE'} 
                  {sectorChoice === 'risky' && '⚡ RISKY'} 
                  {sectorChoice === 'extreme' && '🔥 EXTREME'}
                  <br />
                  <span style={{ fontSize: '10px', opacity: 0.8 }}>
                    {getChoiceChance(sectorChoice)}% • {getChoiceMultiplier(sectorChoice)}x
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
                background: 'linear-gradient(45deg, #0e4b99, #16213e, #64b5f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(100, 181, 246, 0.5)'
              }}>
                🚀 GALACTIC SALVAGE 🛰️
              </h1>
              
              <div style={{
                fontSize: '20px',
                color: '#64b5f6',
                marginBottom: '32px',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
              }}>
                {playing && scanningPhase ? (
                  <span style={{ color: '#fbbf24' }}>🔍 Scanning Sector {currentSector}...</span>
                ) : playing ? (
                  <span style={{ color: '#22c55e' }}>📡 Analysis Complete</span>
                ) : (
                  'Deploy salvage drone to deep space sectors'
                )}
              </div>

              {/* Sector Display */}
              {(playing || hasPlayedBefore) && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '16px',
                  marginBottom: '24px',
                  flexWrap: 'wrap'
                }}>
                  {SECTOR_CHOICES[choice].map((multiplier, index) => {
                    const isCurrentSector = scanningPhase && currentSector === index + 1
                    const isScanned = index < sectorResults.length
                    const sectorResult = sectorResults[index]
                    
                    return (
                      <div
                        key={index}
                        style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '12px',
                          border: isCurrentSector ? '3px solid #fbbf24' : '2px solid rgba(100, 181, 246, 0.3)',
                          background: isScanned
                            ? (sectorResult === 'jackpot' ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                               : sectorResult === 'debris' ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                               : 'linear-gradient(135deg, #374151, #1f2937)')
                            : 'rgba(0, 0, 0, 0.4)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: '12px',
                          fontWeight: 600,
                          position: 'relative',
                          animation: isCurrentSector ? 'pulse 1s infinite' : 'none',
                          boxShadow: isCurrentSector ? '0 0 20px rgba(251, 191, 36, 0.5)' : 'none'
                        }}
                      >
                        <div style={{ fontSize: '20px', marginBottom: '4px' }}>
                          {isScanned 
                            ? (sectorResult === 'jackpot' ? '💎' 
                               : sectorResult === 'debris' ? '🔩' 
                               : '❌')
                            : isCurrentSector ? '🔍' : '❓'}
                        </div>
                        <div style={{ fontSize: '10px' }}>
                          SECTOR {index + 1}
                        </div>
                        {multiplier > 0 && (
                          <div style={{ fontSize: '10px', color: '#64b5f6' }}>
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
                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)',
                  border: `2px solid ${win ? '#22c55e' : '#ef4444'}`,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                  marginTop: '24px'
                }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: win ? '#22c55e' : '#ef4444',
                    marginBottom: '8px'
                  }}>
                    {win ? '🎉 SALVAGE SUCCESSFUL!' : '💥 MISSION FAILED'}
                  </div>
                  <div style={{ color: '#64b5f6', fontSize: '16px' }}>
                    {win ? `Recovered valuable cargo!` : 'No salvageable materials found'}
                  </div>
                </div>
              )}
            </div>

            {/* Mission Status */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0, 0, 0, 0.8)',
              borderRadius: '12px',
              padding: '12px 20px',
              border: '1px solid rgba(100, 181, 246, 0.2)',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                {playing ? 'SCANNING IN PROGRESS...' : `ROUTE: ${choice.toUpperCase()}`}
              </div>
              <div style={{ color: '#64b5f6', fontSize: '14px', fontWeight: 700 }}>
                {getChoiceMultiplier(choice)}.00x MAX SALVAGE VALUE
              </div>
            </div>
            
            {/* Overlays */}
            <GalacticSalvageOverlays
              scanningPhase={scanningPhase}
              currentSector={currentSector}
              foundLoot={foundLoot}
              win={win}
              choice={choice}
            />

            {/* Animations */}
            <style>
              {`
                @keyframes stars {
                  from { transform: translateX(0); }
                  to { transform: translateX(-200px); }
                }
                @keyframes float {
                  0%, 100% { transform: translateY(0px) rotate(0deg); }
                  50% { transform: translateY(-20px) rotate(5deg); }
                }
                @keyframes pulse {
                  0%, 100% { opacity: 1; transform: scale(1); }
                  50% { opacity: 0.7; transform: scale(1.05); }
                }
              `}
            </style>
          </div>

          {/* Live Paytable */}
          <GalacticSalvagePaytable
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
        playButtonText={hasPlayedBefore ? 'Deploy Again' : 'Deploy Drone'}
        onPlayAgain={handlePlayAgain}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 'bold' }}>Route:</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['safe', 'risky', 'extreme'] as SectorChoice[]).map((sectorChoice) => (
              <GambaUi.Button
                key={sectorChoice}
                onClick={() => setChoice(sectorChoice)}
                disabled={playing || showOutcome}
              >
                {choice === sectorChoice ? '✓ ' : ''}
                {sectorChoice === 'safe' && '🛡️ Safe'}
                {sectorChoice === 'risky' && '⚡ Risky'}
                {sectorChoice === 'extreme' && '🔥 Extreme'}
              </GambaUi.Button>
            ))}
          </div>
        </div>
      </GameControls>
    </>
  )
}
