import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useCurrentToken, useTokenBalance, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { TOKEN_METADATA } from '../../constants'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { useIsCompact } from '../../hooks/useIsCompact'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import AlienArtifactHuntPaytable, { AlienArtifactHuntPaytableRef } from './AlienArtifactHuntPaytable'
import AlienArtifactHuntOverlays from './AlienArtifactHuntOverlays'
import { GameControls } from '../../components'

// Bet arrays for different planet types
const PLANET_TYPES = {
  earth: [0, 2, 4, 8, 18],         // Earth-like - familiar terrain
  gas: [0, 0, 6, 12, 28],          // Gas giant - extreme conditions
  crystal: [0, 0, 0, 15, 40],      // Crystal world - alien technology
}

type PlanetType = keyof typeof PLANET_TYPES

export default function AlienArtifactHunt() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const [playing, setPlaying] = React.useState(false)
  const [win, setWin] = React.useState(false)
  const [resultIndex, setResultIndex] = React.useState(0)
  const [planet, setPlanet] = React.useState<PlanetType>('earth')
  const [wager, setWager] = useWagerInput()
  const token = useCurrentToken()
  const { balance } = useTokenBalance()
  const paytableRef = React.useRef<AlienArtifactHuntPaytableRef>(null)
  
  // Multi-phase states
  const [currentSite, setCurrentSite] = React.useState(0)
  const [excavationPhase, setExcavationPhase] = React.useState(false)
  const [artifactFound, setArtifactFound] = React.useState(false)
  const [siteResults, setSiteResults] = React.useState<('empty' | 'hostile' | 'artifact')[]>([])
  const [atmosphereLevel, setAtmosphereLevel] = React.useState(0)
  
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
      setCurrentSite(0)
      setExcavationPhase(true)
      setArtifactFound(false)
      setSiteResults([])
      setAtmosphereLevel(0)
      
      const selectedPlanet = planet
      const selectedBet = PLANET_TYPES[planet]

      if (sounds.play) sounds.play('play', { playbackRate: 0.8 })

      await game.play({
        bet: selectedBet,
        wager,
        metadata: [planet],
      })

      const result = await game.result()
      const winResult = result.payout > 0
      const artifactSite = result.resultIndex
      const multiplier = winResult ? result.payout / wager : 0

      // Create excavation sequence
      const maxSites = selectedBet.length
      const siteResults: ('empty' | 'hostile' | 'artifact')[] = []
      
      for (let site = 0; site < maxSites; site++) {
        setCurrentSite(site + 1)
        setAtmosphereLevel(((site + 1) / maxSites) * 100)
        
        // Simulate excavation time with increasing difficulty
        await new Promise(resolve => setTimeout(resolve, 2200 + (site * 600)))
        
        let siteResult: 'empty' | 'hostile' | 'artifact'
        if (site === artifactSite && winResult) {
          siteResult = selectedBet[site] >= 25 ? 'artifact' : 'hostile'
        } else if (site < artifactSite || (!winResult && Math.random() < 0.3)) {
          siteResult = Math.random() < 0.7 ? 'empty' : 'hostile'
        } else {
          siteResult = 'empty'
        }
        
        siteResults.push(siteResult)
        setSiteResults([...siteResults])
        
        if (siteResult === 'artifact') {
          setArtifactFound(true)
          break
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      setExcavationPhase(false)
      setWin(winResult)
      setResultIndex(result.resultIndex)

      paytableRef.current?.trackGame({
        planet: selectedPlanet,
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

  const getPlanetMultiplier = (planet: PlanetType) => {
    const bet = PLANET_TYPES[planet]
    return Math.max(...bet)
  }

  const getPlanetChance = (planet: PlanetType) => {
    const bet = PLANET_TYPES[planet]
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
            background: planet === 'earth' 
              ? 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 20%, #312e81 40%, #4c1d95 60%, #581c87 80%, #0f172a 100%)'
              : planet === 'gas'
              ? 'linear-gradient(135deg, #b45309 0%, #d97706 20%, #ea580c 40%, #dc2626 60%, #7c2d12 80%, #0f172a 100%)'
              : 'linear-gradient(135deg, #059669 0%, #10b981 20%, #34d399 40%, #6ee7b7 60%, #a7f3d0 80%, #0f172a 100%)',
            borderRadius: '24px',
            border: `3px solid ${planet === 'earth' ? 'rgba(30, 64, 175, 0.4)' : planet === 'gas' ? 'rgba(217, 119, 6, 0.4)' : 'rgba(5, 150, 105, 0.4)'}`,
            boxShadow: `
              0 25px 50px rgba(0, 0, 0, 0.9),
              inset 0 2px 4px rgba(255, 255, 255, 0.1),
              inset 0 -2px 4px rgba(0, 0, 0, 0.6),
              0 0 40px ${planet === 'earth' ? 'rgba(30, 64, 175, 0.3)' : planet === 'gas' ? 'rgba(217, 119, 6, 0.3)' : 'rgba(5, 150, 105, 0.3)'}
            `,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Enhanced Planet-specific atmospheric effects */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: planet === 'earth' 
                ? 'radial-gradient(circle at 30% 20%, rgba(30, 64, 175, 0.2) 0%, transparent 30%), radial-gradient(circle at 80% 60%, rgba(59, 130, 246, 0.1) 0%, transparent 40%)'
                : planet === 'gas'
                ? 'radial-gradient(circle at 70% 30%, rgba(217, 119, 6, 0.3) 0%, transparent 30%), radial-gradient(circle at 20% 70%, rgba(239, 68, 68, 0.15) 0%, transparent 45%)'
                : 'radial-gradient(circle at 50% 40%, rgba(5, 150, 105, 0.25) 0%, transparent 35%), radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)',
              animation: 'atmosphereShift 12s ease-in-out infinite alternate'
            }} />
            
            {/* Floating particle effects */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: planet === 'earth' 
                ? `repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 2px,
                    rgba(59, 130, 246, 0.05) 2px,
                    rgba(59, 130, 246, 0.05) 4px
                  )`
                : planet === 'gas'
                ? `repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 3px,
                    rgba(239, 68, 68, 0.06) 3px,
                    rgba(239, 68, 68, 0.06) 6px
                  )`
                : `repeating-linear-gradient(
                    135deg,
                    transparent,
                    transparent 4px,
                    rgba(16, 185, 129, 0.08) 4px,
                    rgba(16, 185, 129, 0.08) 8px
                  )`,
              animation: 'particleFlow 20s linear infinite'
            }} />
            
            {/* Enhanced floating celestial objects */}
            <div style={{
              position: 'absolute',
              top: '10%',
              left: '15%',
              fontSize: '50px',
              opacity: 0.3,
              animation: 'celestialFloat 15s ease-in-out infinite',
              filter: `drop-shadow(0 0 20px ${planet === 'earth' ? 'rgba(59, 130, 246, 0.4)' : planet === 'gas' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'})`
            }}>
              {planet === 'earth' ? '🌍' : planet === 'gas' ? '🪐' : '💎'}
            </div>
            
            <div style={{
              position: 'absolute',
              top: '60%',
              right: '10%',
              fontSize: '35px',
              opacity: 0.25,
              animation: 'celestialFloat 12s ease-in-out infinite reverse',
              filter: `drop-shadow(0 0 15px ${planet === 'earth' ? 'rgba(59, 130, 246, 0.3)' : planet === 'gas' ? 'rgba(217, 119, 6, 0.3)' : 'rgba(5, 150, 105, 0.3)'})`
            }}>
              {planet === 'earth' ? '🚀' : planet === 'gas' ? '⚡' : '✨'}
            </div>
            
            <div style={{
              position: 'absolute',
              bottom: '20%',
              left: '25%',
              fontSize: '40px',
              opacity: 0.22,
              animation: 'celestialFloat 18s ease-in-out infinite',
              filter: `drop-shadow(0 0 18px ${planet === 'earth' ? 'rgba(96, 165, 250, 0.4)' : planet === 'gas' ? 'rgba(251, 191, 36, 0.4)' : 'rgba(52, 211, 153, 0.4)'})`
            }}>
              {planet === 'earth' ? '🛸' : planet === 'gas' ? '🌪️' : '🔮'}
            </div>
            
            {/* Additional atmospheric creatures */}
            <div style={{
              position: 'absolute',
              top: '30%',
              right: '25%',
              fontSize: '25px',
              opacity: 0.15,
              animation: 'celestialFloat 25s ease-in-out infinite'
            }}>
              {planet === 'earth' ? '🌕' : planet === 'gas' ? '☄️' : '🌟'}
            </div>
            
            <div style={{
              position: 'absolute',
              bottom: '40%',
              right: '20%',
              fontSize: '30px',
              opacity: 0.18,
              animation: 'celestialFloat 22s ease-in-out infinite reverse'
            }}>
              {planet === 'earth' ? '🛰️' : planet === 'gas' ? '🌌' : '🔬'}
            </div>

            {/* Planet Selection */}
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
              {(['earth', 'gas', 'crystal'] as PlanetType[]).map((planetType) => (
                <button
                  key={planetType}
                  onClick={() => setPlanet(planetType)}
                  disabled={playing}
                  style={{
                    background: planet === planetType 
                      ? `linear-gradient(135deg, ${planetType === 'earth' ? 'rgba(30, 64, 175, 0.4)' : planetType === 'gas' ? 'rgba(217, 119, 6, 0.4)' : 'rgba(5, 150, 105, 0.4)'} 0%, ${planetType === 'earth' ? 'rgba(30, 58, 138, 0.4)' : planetType === 'gas' ? 'rgba(180, 83, 9, 0.4)' : 'rgba(16, 185, 129, 0.4)'} 100%)`
                      : 'rgba(0, 0, 0, 0.6)',
                    border: planet === planetType 
                      ? `2px solid ${planetType === 'earth' ? 'rgba(30, 64, 175, 0.7)' : planetType === 'gas' ? 'rgba(217, 119, 6, 0.7)' : 'rgba(5, 150, 105, 0.7)'}` 
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
                  {planetType === 'earth' && '🌍 EARTH-LIKE'} 
                  {planetType === 'gas' && '🪐 GAS GIANT'} 
                  {planetType === 'crystal' && '💎 CRYSTAL WORLD'}
                  <br />
                  <span style={{ fontSize: '10px', opacity: 0.8 }}>
                    {getPlanetChance(planetType)}% • {getPlanetMultiplier(planetType)}x
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
                background: `linear-gradient(45deg, ${planet === 'earth' ? '#1e40af, #3b82f6, #60a5fa' : planet === 'gas' ? '#d97706, #f59e0b, #fbbf24' : '#059669, #10b981, #34d399'})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: `0 0 30px ${planet === 'earth' ? 'rgba(30, 64, 175, 0.5)' : planet === 'gas' ? 'rgba(217, 119, 6, 0.5)' : 'rgba(5, 150, 105, 0.5)'}`
              }}>
                🛸 ALIEN ARTIFACT HUNT 👽
              </h1>
              
              <div style={{
                fontSize: '20px',
                color: planet === 'earth' ? '#60a5fa' : planet === 'gas' ? '#fbbf24' : '#34d399',
                marginBottom: '32px',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
              }}>
                {playing && excavationPhase ? (
                  <span style={{ color: '#fbbf24' }}>🔍 Excavating site {currentSite}...</span>
                ) : playing ? (
                  <span style={{ color: '#22c55e' }}>🛸 Excavation Complete</span>
                ) : (
                  'Search alien worlds for ancient artifacts'
                )}
              </div>

              {/* Excavation Site Display */}
              {(playing || hasPlayedBefore) && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '24px'
                }}>
                  {PLANET_TYPES[planet].map((multiplier, index) => {
                    const isCurrentSite = excavationPhase && currentSite === index + 1
                    const isExcavated = index < siteResults.length
                    const siteResult = siteResults[index]
                    
                    return (
                      <div
                        key={index}
                        style={{
                          width: '320px',
                          height: '60px',
                          borderRadius: '30px',
                          border: isCurrentSite ? '4px solid #fbbf24' : `3px solid ${planet === 'earth' ? 'rgba(60, 165, 250, 0.4)' : planet === 'gas' ? 'rgba(251, 191, 36, 0.4)' : 'rgba(52, 211, 153, 0.4)'}`,
                          background: isExcavated
                            ? (siteResult === 'artifact' ? `linear-gradient(135deg, ${planet === 'earth' ? '#1e40af, #1e3a8a, #312e81' : planet === 'gas' ? '#d97706, #b45309, #92400e' : '#059669, #047857, #065f46'})` 
                               : siteResult === 'hostile' ? 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)'
                               : `linear-gradient(135deg, ${planet === 'earth' ? '#475569, #334155, #1e293b' : planet === 'gas' ? '#78716c, #57534e, #44403c' : '#6b7280, #4b5563, #374151'})`)
                            : `linear-gradient(135deg, 
                               ${planet === 'earth' ? `rgba(30, 64, 175, ${0.4 + index * 0.12})` : planet === 'gas' ? `rgba(217, 119, 6, ${0.4 + index * 0.12})` : `rgba(5, 150, 105, ${0.4 + index * 0.12})`} 0%, 
                               ${planet === 'earth' ? `rgba(30, 58, 138, ${0.4 + index * 0.12})` : planet === 'gas' ? `rgba(180, 83, 9, ${0.4 + index * 0.12})` : `rgba(16, 185, 129, ${0.4 + index * 0.12})`} 50%,
                               ${planet === 'earth' ? `rgba(49, 46, 129, ${0.3 + index * 0.1})` : planet === 'gas' ? `rgba(146, 64, 14, ${0.3 + index * 0.1})` : `rgba(6, 95, 70, ${0.3 + index * 0.1})`} 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0 24px',
                          color: '#fff',
                          fontSize: '14px',
                          fontWeight: 600,
                          position: 'relative',
                          animation: isCurrentSite ? 'excavate 1.5s infinite' : 'none',
                          boxShadow: isCurrentSite 
                            ? `0 0 30px rgba(251, 191, 36, 0.7), inset 0 2px 8px rgba(255, 255, 255, 0.2)` 
                            : isExcavated && siteResult === 'artifact'
                            ? `0 0 25px ${planet === 'earth' ? 'rgba(30, 64, 175, 0.6)' : planet === 'gas' ? 'rgba(217, 119, 6, 0.6)' : 'rgba(5, 150, 105, 0.6)'}, inset 0 2px 8px rgba(255, 255, 255, 0.1)`
                            : 'inset 0 2px 4px rgba(255, 255, 255, 0.1), inset 0 -2px 4px rgba(0, 0, 0, 0.3)',
                          overflow: 'hidden',
                          transform: isExcavated && siteResult === 'artifact' ? 'scale(1.02)' : 'scale(1)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {/* Site background pattern */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: isCurrentSite
                            ? 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255, 255, 255, 0.1) 2px, rgba(255, 255, 255, 0.1) 4px)'
                            : 'none',
                          animation: isCurrentSite ? 'particleFlow 2s linear infinite' : 'none'
                        }} />
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2 }}>
                          <div style={{ 
                            fontSize: '24px',
                            animation: isCurrentSite ? 'excavationDrill 1.5s infinite' : isExcavated && siteResult === 'artifact' ? 'artifactDiscovered 2s ease-in-out' : 'none',
                            filter: isExcavated && siteResult === 'artifact' 
                              ? `drop-shadow(0 0 10px ${planet === 'earth' ? 'rgba(30, 64, 175, 0.8)' : planet === 'gas' ? 'rgba(217, 119, 6, 0.8)' : 'rgba(5, 150, 105, 0.8)'})`
                              : 'none'
                          }}>
                            {isExcavated 
                              ? (siteResult === 'artifact' ? '👽' 
                                 : siteResult === 'hostile' ? '💥' 
                                 : '🪨')
                              : isCurrentSite ? '🔍' : '📡'}
                          </div>
                          <span style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}>SITE {index + 1}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2 }}>
                          {multiplier > 0 && (
                            <span style={{ 
                              fontSize: '12px', 
                              color: planet === 'earth' ? '#60a5fa' : planet === 'gas' ? '#fbbf24' : '#34d399',
                              textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
                              fontWeight: 700
                            }}>
                              {multiplier}x ARTIFACT
                            </span>
                          )}
                          <div style={{ 
                            fontSize: '16px',
                            background: 'rgba(0, 0, 0, 0.3)',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'
                          }}>
                            {planet === 'earth' ? 
                              (index === 0 ? 'SURFACE' : index === 1 ? 'CAVERN' : index === 2 ? 'TEMPLE' : index === 3 ? 'CORE' : 'NEXUS') :
                            planet === 'gas' ?
                              (index === 0 ? 'CLOUD' : index === 1 ? 'STORM' : index === 2 ? 'VORTEX' : index === 3 ? 'EYE' : 'CENTER') :
                              (index === 0 ? 'SURFACE' : index === 1 ? 'CLUSTER' : index === 2 ? 'MATRIX' : index === 3 ? 'CORE' : 'HEART')
                            }
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Enhanced Excavation Progress */}
              {excavationPhase && (
                <div style={{
                  width: '240px',
                  margin: '24px auto',
                  textAlign: 'center',
                  background: 'rgba(0, 0, 0, 0.6)',
                  borderRadius: '20px',
                  padding: '20px',
                  border: `2px solid ${planet === 'earth' ? 'rgba(60, 165, 250, 0.4)' : planet === 'gas' ? 'rgba(251, 191, 36, 0.4)' : 'rgba(52, 211, 153, 0.4)'}`,
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{
                    fontSize: '80px',
                    animation: 'excavationDrill 1.8s ease-in-out infinite',
                    filter: `drop-shadow(0 0 25px ${planet === 'earth' ? 'rgba(60, 165, 250, 0.9)' : planet === 'gas' ? 'rgba(251, 191, 36, 0.9)' : 'rgba(52, 211, 153, 0.9)'})`
                  }}>
                    🔍
                  </div>
                  
                  {/* Atmosphere meter */}
                  <div style={{
                    width: '180px',
                    height: '12px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    borderRadius: '6px',
                    margin: '16px auto 8px',
                    overflow: 'hidden',
                    border: `1px solid ${planet === 'earth' ? 'rgba(60, 165, 250, 0.3)' : planet === 'gas' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(52, 211, 153, 0.3)'}`
                  }}>
                    <div style={{
                      width: `${atmosphereLevel}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${planet === 'earth' ? '#1e40af, #3b82f6' : planet === 'gas' ? '#d97706, #f59e0b' : '#059669, #10b981'})`,
                      borderRadius: '6px',
                      transition: 'width 0.3s ease',
                      boxShadow: `0 0 10px ${planet === 'earth' ? 'rgba(60, 165, 250, 0.6)' : planet === 'gas' ? 'rgba(251, 191, 36, 0.6)' : 'rgba(52, 211, 153, 0.6)'}`
                    }} />
                  </div>
                  
                  <div style={{
                    fontSize: '14px',
                    color: planet === 'earth' ? '#60a5fa' : planet === 'gas' ? '#fbbf24' : '#34d399',
                    fontWeight: 600,
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
                  }}>
                    Atmosphere Density: {atmosphereLevel.toFixed(0)}%
                  </div>
                  
                  <div style={{
                    fontSize: '12px',
                    color: '#9CA3AF',
                    marginTop: '8px'
                  }}>
                    Site {currentSite} of {PLANET_TYPES[planet].length}
                  </div>
                </div>
              )}

              {/* Result Display */}
              {!playing && hasPlayedBefore && (
                <div style={{
                  padding: '16px 32px',
                  borderRadius: '16px',
                  background: win 
                    ? `linear-gradient(135deg, ${planet === 'earth' ? 'rgba(30, 64, 175, 0.2)' : planet === 'gas' ? 'rgba(217, 119, 6, 0.2)' : 'rgba(5, 150, 105, 0.2)'} 0%, ${planet === 'earth' ? 'rgba(30, 58, 138, 0.1)' : planet === 'gas' ? 'rgba(180, 83, 9, 0.1)' : 'rgba(16, 185, 129, 0.1)'} 100%)`
                    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)',
                  border: `2px solid ${win ? (planet === 'earth' ? '#60a5fa' : planet === 'gas' ? '#fbbf24' : '#34d399') : '#ef4444'}`,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7)',
                  marginTop: '24px'
                }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: win ? (planet === 'earth' ? '#60a5fa' : planet === 'gas' ? '#fbbf24' : '#34d399') : '#ef4444',
                    marginBottom: '8px'
                  }}>
                    {win ? '👽 ALIEN ARTIFACT DISCOVERED!' : '💥 HOSTILE ALIEN ENCOUNTER'}
                  </div>
                  <div style={{ color: planet === 'earth' ? '#60a5fa' : planet === 'gas' ? '#fbbf24' : '#34d399', fontSize: '16px' }}>
                    {win ? `Ancient alien technology unearthed!` : 'The alien guardians defended their secrets'}
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
              border: `1px solid ${planet === 'earth' ? 'rgba(60, 165, 250, 0.3)' : planet === 'gas' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(52, 211, 153, 0.3)'}`,
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                {playing ? 'EXCAVATION IN PROGRESS...' : `PLANET: ${planet.toUpperCase()}`}
              </div>
              <div style={{ color: planet === 'earth' ? '#60a5fa' : planet === 'gas' ? '#fbbf24' : '#34d399', fontSize: '14px', fontWeight: 700 }}>
                {getPlanetMultiplier(planet)}.00x ARTIFACT VALUE
              </div>
            </div>
            
            <AlienArtifactHuntOverlays
              excavationPhase={excavationPhase}
              currentSite={currentSite}
              artifactFound={artifactFound}
              win={win}
              planet={planet}
              atmosphereLevel={atmosphereLevel}
            
                result={gambaResult}
                currentBalance={balance.balance ? balance.balance + balance.bonusBalance : balance}
                wager={wager}
              />

            <style>
              {`
                @keyframes atmosphereShift {
                  0%, 100% { opacity: 0.4; transform: scale(1) rotate(0deg); }
                  25% { opacity: 0.7; transform: scale(1.03) rotate(2deg); }
                  50% { opacity: 0.6; transform: scale(1.05) rotate(0deg); }
                  75% { opacity: 0.8; transform: scale(1.02) rotate(-2deg); }
                }
                @keyframes celestialFloat {
                  0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.3; }
                  25% { transform: translateY(-15px) rotate(90deg) scale(1.1); opacity: 0.5; }
                  50% { transform: translateY(-25px) rotate(180deg) scale(1.05); opacity: 0.4; }
                  75% { transform: translateY(-10px) rotate(270deg) scale(1.15); opacity: 0.6; }
                }
                @keyframes particleFlow {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(100%); }
                }
                @keyframes excavate {
                  0%, 100% { transform: scale(1); opacity: 1; border-radius: 25px; }
                  25% { transform: scale(1.02); opacity: 0.95; border-radius: 30px; }
                  50% { transform: scale(1.05); opacity: 0.9; border-radius: 35px; }
                  75% { transform: scale(1.03); opacity: 0.95; border-radius: 30px; }
                }
                @keyframes excavationDrill {
                  0%, 100% { transform: scale(1) rotate(0deg); filter: brightness(1); }
                  25% { transform: scale(1.15) rotate(45deg); filter: brightness(1.2); }
                  50% { transform: scale(1.2) rotate(90deg); filter: brightness(1.4); }
                  75% { transform: scale(1.1) rotate(135deg); filter: brightness(1.1); }
                }
                @keyframes pulseGlow {
                  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
                  50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6), 0 0 60px rgba(59, 130, 246, 0.4); }
                }
                @keyframes artifactDiscovered {
                  0% { transform: scale(1) rotate(0deg); opacity: 0.8; }
                  50% { transform: scale(1.3) rotate(180deg); opacity: 1; }
                  100% { transform: scale(1.1) rotate(360deg); opacity: 0.9; }
                }
              `}
            </style>
          </div>

          <AlienArtifactHuntPaytable
            ref={paytableRef}
            wager={wager}
            selectedPlanet={planet}
          />
        </div>
      </GambaUi.Portal>
      
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={play}
        isPlaying={playing}
        showOutcome={showOutcome}
        playButtonText={hasPlayedBefore ? 'Hunt Again' : 'Begin Excavation'}
        onPlayAgain={handlePlayAgain}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 'bold' }}>Planet:</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['earth', 'gas', 'crystal'] as PlanetType[]).map((planetType) => (
              <GambaUi.Button
                key={planetType}
                onClick={() => setPlanet(planetType)}
                disabled={playing || showOutcome}
              >
                {planet === planetType ? '✓ ' : ''}
                {planetType === 'earth' && '🌍 Earth-Like'}
                {planetType === 'gas' && '🪐 Gas Giant'}
                {planetType === 'crystal' && '💎 Crystal'}
              </GambaUi.Button>
            ))}
          </div>
        </div>
      </GameControls>
    </>
  )
}
