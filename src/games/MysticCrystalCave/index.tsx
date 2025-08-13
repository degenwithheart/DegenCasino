import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useCurrentToken, useTokenBalance, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { TOKEN_METADATA } from '../../constants'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { useIsCompact } from '../../hooks/useIsCompact'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import MysticCrystalCavePaytable, { MysticCrystalCavePaytableRef } from './MysticCrystalCavePaytable'
import MysticCrystalCaveOverlays from './MysticCrystalCaveOverlays'
import { GameControls } from '../../components'

// Bet arrays for different cave paths
const CAVE_PATHS = {
  crystal: [0, 2, 5, 10, 25],      // Crystal path - balanced magic
  shadow: [0, 0, 8, 18, 35],       // Shadow path - darker magic, higher risk
  light: [0, 0, 0, 15, 50],        // Light path - pure magic, extreme risk
}

type CavePath = keyof typeof CAVE_PATHS

export default function MysticCrystalCave() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const [playing, setPlaying] = React.useState(false)
  const [win, setWin] = React.useState(false)
  const [resultIndex, setResultIndex] = React.useState(0)
  const [path, setPath] = React.useState<CavePath>('crystal')
  const [wager, setWager] = useWagerInput()
  const token = useCurrentToken()
  const { balance } = useTokenBalance()
  const paytableRef = React.useRef<MysticCrystalCavePaytableRef>(null)
  
  // Multi-phase states
  const [currentChamber, setCurrentChamber] = React.useState(0)
  const [exploringPhase, setExploringPhase] = React.useState(false)
  const [foundCrystal, setFoundCrystal] = React.useState(false)
  const [chamberResults, setChamberResults] = React.useState<('empty' | 'trap' | 'crystal')[]>([])
  const [magicEnergy, setMagicEnergy] = React.useState(0)
  
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
      setCurrentChamber(0)
      setExploringPhase(true)
      setFoundCrystal(false)
      setChamberResults([])
      setMagicEnergy(0)
      
      const selectedPath = path
      const selectedBet = CAVE_PATHS[path]

      if (sounds.play) sounds.play('play', { playbackRate: 0.7 })

      await game.play({
        bet: selectedBet,
        wager,
        metadata: [path],
      })

      const result = await game.result()
      const winResult = result.payout > 0
      const crystalChamber = result.resultIndex
      const multiplier = winResult ? result.payout / wager : 0

      // Create cave exploration sequence
      const maxChambers = selectedBet.length
      const chamberResults: ('empty' | 'trap' | 'crystal')[] = []
      
      for (let chamber = 0; chamber < maxChambers; chamber++) {
        setCurrentChamber(chamber + 1)
        setMagicEnergy(((chamber + 1) / maxChambers) * 100)
        
        // Simulate exploration time with increasing tension
        await new Promise(resolve => setTimeout(resolve, 1800 + (chamber * 400)))
        
        let chamberResult: 'empty' | 'trap' | 'crystal'
        if (chamber === crystalChamber && winResult) {
          chamberResult = selectedBet[chamber] >= 25 ? 'crystal' : 'trap'
        } else if (chamber < crystalChamber || (!winResult && Math.random() < 0.4)) {
          chamberResult = Math.random() < 0.7 ? 'empty' : 'trap'
        } else {
          chamberResult = 'empty'
        }
        
        chamberResults.push(chamberResult)
        setChamberResults([...chamberResults])
        
        if (chamberResult === 'crystal') {
          setFoundCrystal(true)
          break
        }
        
        await new Promise(resolve => setTimeout(resolve, 800))
      }

      setExploringPhase(false)
      setWin(winResult)
      setResultIndex(result.resultIndex)

      paytableRef.current?.trackGame({
        path: selectedPath,
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

  const getPathMultiplier = (path: CavePath) => {
    const bet = CAVE_PATHS[path]
    return Math.max(...bet)
  }

  const getPathChance = (path: CavePath) => {
    const bet = CAVE_PATHS[path]
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
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 20%, #4c1d95 40%, #581c87 60%, #6b21a8 80%, #7c2d12 100%)',
            borderRadius: '24px',
            border: '3px solid rgba(147, 51, 234, 0.4)',
            boxShadow: `
              0 25px 50px rgba(0, 0, 0, 0.9),
              inset 0 2px 4px rgba(255, 255, 255, 0.1),
              inset 0 -2px 4px rgba(0, 0, 0, 0.6),
              0 0 40px rgba(147, 51, 234, 0.3)
            `,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Crystal formations in background */}
            <div style={{
              position: 'absolute',
              top: '10%',
              left: '10%',
              width: '0',
              height: '0',
              borderLeft: '15px solid transparent',
              borderRight: '15px solid transparent',
              borderBottom: '40px solid rgba(147, 51, 234, 0.3)',
              transform: 'rotate(15deg)',
              animation: 'crystalGlow 4s ease-in-out infinite alternate'
            }} />
            
            <div style={{
              position: 'absolute',
              top: '20%',
              right: '15%',
              width: '0',
              height: '0',
              borderLeft: '20px solid transparent',
              borderRight: '20px solid transparent',
              borderBottom: '50px solid rgba(168, 85, 247, 0.3)',
              transform: 'rotate(-25deg)',
              animation: 'crystalGlow 5s ease-in-out infinite alternate'
            }} />
            
            <div style={{
              position: 'absolute',
              bottom: '15%',
              left: '20%',
              width: '0',
              height: '0',
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderBottom: '35px solid rgba(192, 132, 252, 0.3)',
              transform: 'rotate(45deg)',
              animation: 'crystalGlow 3.5s ease-in-out infinite alternate'
            }} />

            {/* Mystical particles */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none'
            }}>
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: '3px',
                    height: '3px',
                    background: `rgba(${147 + Math.random() * 100}, ${51 + Math.random() * 200}, 234, 0.6)`,
                    borderRadius: '50%',
                    animation: `mysticalFloat ${3 + Math.random() * 4}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>

            {/* Path Selection */}
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
              {(['crystal', 'shadow', 'light'] as CavePath[]).map((cavePath) => (
                <button
                  key={cavePath}
                  onClick={() => setPath(cavePath)}
                  disabled={playing}
                  style={{
                    background: path === cavePath 
                      ? 'linear-gradient(135deg, rgba(147, 51, 234, 0.4) 0%, rgba(168, 85, 247, 0.4) 100%)'
                      : 'rgba(0, 0, 0, 0.6)',
                    border: path === cavePath 
                      ? '2px solid rgba(147, 51, 234, 0.7)' 
                      : '1px solid rgba(168, 85, 247, 0.3)',
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
                  {cavePath === 'crystal' && '💎 CRYSTAL'} 
                  {cavePath === 'shadow' && '🌑 SHADOW'} 
                  {cavePath === 'light' && '✨ LIGHT'}
                  <br />
                  <span style={{ fontSize: '10px', opacity: 0.8 }}>
                    {getPathChance(cavePath)}% • {getPathMultiplier(cavePath)}x
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
                background: 'linear-gradient(45deg, #9333ea, #a855f7, #c084fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(168, 85, 247, 0.5)'
              }}>
                🔮 MYSTIC CRYSTAL CAVE 💎
              </h1>
              
              <div style={{
                fontSize: '20px',
                color: '#a855f7',
                marginBottom: '32px',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
              }}>
                {playing && exploringPhase ? (
                  <span style={{ color: '#fbbf24' }}>✨ Exploring chamber {currentChamber}...</span>
                ) : playing ? (
                  <span style={{ color: '#22c55e' }}>🔮 Exploration Complete</span>
                ) : (
                  'Navigate the mystical caves to find legendary crystals'
                )}
              </div>

              {/* Chamber Levels Display */}
              {(playing || hasPlayedBefore) && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '24px'
                }}>
                  {CAVE_PATHS[path].map((multiplier, index) => {
                    const isCurrentChamber = exploringPhase && currentChamber === index + 1
                    const isExplored = index < chamberResults.length
                    const chamberResult = chamberResults[index]
                    
                    return (
                      <div
                        key={index}
                        style={{
                          width: '300px',
                          height: '50px',
                          borderRadius: '25px',
                          border: isCurrentChamber ? '3px solid #fbbf24' : '2px solid rgba(168, 85, 247, 0.3)',
                          background: isExplored
                            ? (chamberResult === 'crystal' ? 'linear-gradient(135deg, #c084fc, #a855f7)' 
                               : chamberResult === 'trap' ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                               : 'linear-gradient(135deg, #6b21a8, #581c87)')
                            : `linear-gradient(135deg, 
                               rgba(147, 51, 234, ${0.3 + index * 0.15}) 0%, 
                               rgba(168, 85, 247, ${0.3 + index * 0.15}) 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0 20px',
                          color: '#fff',
                          fontSize: '14px',
                          fontWeight: 600,
                          position: 'relative',
                          animation: isCurrentChamber ? 'explore 1s infinite' : 'none',
                          boxShadow: isCurrentChamber ? '0 0 20px rgba(251, 191, 36, 0.5)' : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ fontSize: '20px' }}>
                            {isExplored 
                              ? (chamberResult === 'crystal' ? '💎' 
                                 : chamberResult === 'trap' ? '⚡' 
                                 : '🌟')
                              : isCurrentChamber ? '🔮' : '✨'}
                          </div>
                          <span>CHAMBER {index + 1}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {multiplier > 0 && (
                            <span style={{ fontSize: '12px', color: '#c084fc' }}>
                              {multiplier}x CRYSTAL
                            </span>
                          )}
                          <div style={{ fontSize: '16px' }}>
                            {path === 'crystal' ? 'BALANCED' : path === 'shadow' ? 'DARK' : 'PURE'}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Magic Energy Display */}
              {exploringPhase && (
                <div style={{
                  width: '200px',
                  margin: '20px auto',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '60px',
                    animation: 'magicPulse 2s ease-in-out infinite',
                    filter: 'drop-shadow(0 0 15px rgba(168, 85, 247, 0.8))'
                  }}>
                    🔮
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#a855f7',
                    marginTop: '10px'
                  }}>
                    Magic Energy: {magicEnergy.toFixed(0)}%
                  </div>
                </div>
              )}

              {/* Result Display */}
              {!playing && hasPlayedBefore && (
                <div style={{
                  padding: '16px 32px',
                  borderRadius: '16px',
                  background: win 
                    ? 'linear-gradient(135deg, rgba(192, 132, 252, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)',
                  border: `2px solid ${win ? '#c084fc' : '#ef4444'}`,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7)',
                  marginTop: '24px'
                }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: win ? '#c084fc' : '#ef4444',
                    marginBottom: '8px'
                  }}>
                    {win ? '✨ LEGENDARY CRYSTAL FOUND!' : '⚡ LOST IN THE MYSTICAL DEPTHS'}
                  </div>
                  <div style={{ color: '#a855f7', fontSize: '16px' }}>
                    {win ? `Ancient magic crystal discovered!` : 'The caves claimed another seeker'}
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
              border: '1px solid rgba(168, 85, 247, 0.3)',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                {playing ? 'EXPLORATION IN PROGRESS...' : `PATH: ${path.toUpperCase()}`}
              </div>
              <div style={{ color: '#a855f7', fontSize: '14px', fontWeight: 700 }}>
                {getPathMultiplier(path)}.00x CRYSTAL POWER
              </div>
            </div>
            
            <MysticCrystalCaveOverlays
              exploringPhase={exploringPhase}
              currentChamber={currentChamber}
              foundCrystal={foundCrystal}
              win={win}
              path={path}
              magicEnergy={magicEnergy}
            />

            <style>
              {`
                @keyframes crystalGlow {
                  0%, 100% { opacity: 0.3; filter: brightness(1); }
                  50% { opacity: 0.8; filter: brightness(1.5); }
                }
                @keyframes mysticalFloat {
                  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
                  50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
                }
                @keyframes explore {
                  0%, 100% { transform: scale(1); opacity: 1; }
                  50% { transform: scale(1.05); opacity: 0.9; }
                }
                @keyframes magicPulse {
                  0%, 100% { transform: scale(1) rotate(0deg); }
                  50% { transform: scale(1.1) rotate(10deg); }
                }
              `}
            </style>
          </div>

          <MysticCrystalCavePaytable
            ref={paytableRef}
            wager={wager}
            selectedPath={path}
          />
        </div>
      </GambaUi.Portal>
      
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={play}
        isPlaying={playing}
        showOutcome={showOutcome}
        playButtonText={hasPlayedBefore ? 'Explore Again' : 'Enter Cave'}
        onPlayAgain={handlePlayAgain}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 'bold' }}>Path:</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['crystal', 'shadow', 'light'] as CavePath[]).map((cavePath) => (
              <GambaUi.Button
                key={cavePath}
                onClick={() => setPath(cavePath)}
                disabled={playing || showOutcome}
              >
                {path === cavePath ? '✓ ' : ''}
                {cavePath === 'crystal' && '💎 Crystal'}
                {cavePath === 'shadow' && '🌑 Shadow'}
                {cavePath === 'light' && '✨ Light'}
              </GambaUi.Button>
            ))}
          </div>
        </div>
      </GameControls>
    </>
  )
}
