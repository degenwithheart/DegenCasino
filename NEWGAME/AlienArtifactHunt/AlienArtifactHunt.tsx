import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useCurrentToken, useTokenBalance, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { TOKEN_METADATA } from '../../src/constants'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { useIsCompact } from '../../src/hooks/useIsCompact'
import { useGameOutcome } from '../../src/hooks/useGameOutcome'
import AlienArtifactHuntPaytable, { AlienArtifactHuntPaytableRef } from './AlienArtifactHuntPaytable'
import AlienArtifactHuntOverlays from './AlienArtifactHuntOverlays'
import { GameControls } from '../../src/components'

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
            {/* Planet-specific atmospheric effects */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: planet === 'earth' 
                ? 'radial-gradient(circle at 30% 20%, rgba(30, 64, 175, 0.1) 0%, transparent 50%)'
                : planet === 'gas'
                ? 'radial-gradient(circle at 70% 30%, rgba(217, 119, 6, 0.2) 0%, transparent 50%)'
                : 'radial-gradient(circle at 50% 40%, rgba(5, 150, 105, 0.15) 0%, transparent 50%)',
              animation: 'atmosphereShift 10s ease-in-out infinite alternate'
            }} />
            
            {/* Floating celestial objects */}
            <div style={{
              position: 'absolute',
              top: '10%',
              left: '15%',
              fontSize: '40px',
              opacity: 0.2,
              animation: 'celestialFloat 15s ease-in-out infinite'
            }}>
              {planet === 'earth' ? '🌍' : planet === 'gas' ? '🪐' : '💎'}
            </div>
            
            <div style={{
              position: 'absolute',
              top: '60%',
              right: '10%',
              fontSize: '30px',
              opacity: 0.15,
              animation: 'celestialFloat 12s ease-in-out infinite reverse'
            }}>
              {planet === 'earth' ? '🚀' : planet === 'gas' ? '⚡' : '✨'}
            </div>
            
            <div style={{
              position: 'absolute',
              bottom: '20%',
              left: '25%',
              fontSize: '35px',
              opacity: 0.18,
              animation: 'celestialFloat 18s ease-in-out infinite'
            }}>
              {planet === 'earth' ? '🛸' : planet === 'gas' ? '🌪️' : '🔮'}
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
                          width: '300px',
                          height: '50px',
                          borderRadius: '25px',
                          border: isCurrentSite ? '3px solid #fbbf24' : `2px solid ${planet === 'earth' ? 'rgba(60, 165, 250, 0.3)' : planet === 'gas' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(52, 211, 153, 0.3)'}`,
                          background: isExcavated
                            ? (siteResult === 'artifact' ? `linear-gradient(135deg, ${planet === 'earth' ? '#1e40af, #1e3a8a' : planet === 'gas' ? '#d97706, #b45309' : '#059669, #047857'})` 
                               : siteResult === 'hostile' ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                               : `linear-gradient(135deg, ${planet === 'earth' ? '#475569, #334155' : planet === 'gas' ? '#78716c, #57534e' : '#6b7280, #4b5563'})`)
                            : `linear-gradient(135deg, 
                               ${planet === 'earth' ? `rgba(30, 64, 175, ${0.3 + index * 0.15})` : planet === 'gas' ? `rgba(217, 119, 6, ${0.3 + index * 0.15})` : `rgba(5, 150, 105, ${0.3 + index * 0.15})`} 0%, 
                               ${planet === 'earth' ? `rgba(30, 58, 138, ${0.3 + index * 0.15})` : planet === 'gas' ? `rgba(180, 83, 9, ${0.3 + index * 0.15})` : `rgba(16, 185, 129, ${0.3 + index * 0.15})`} 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0 20px',
                          color: '#fff',
                          fontSize: '14px',
                          fontWeight: 600,
                          position: 'relative',
                          animation: isCurrentSite ? 'excavate 1s infinite' : 'none',
                          boxShadow: isCurrentSite ? '0 0 20px rgba(251, 191, 36, 0.5)' : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ fontSize: '20px' }}>
                            {isExcavated 
                              ? (siteResult === 'artifact' ? '👽' 
                                 : siteResult === 'hostile' ? '💥' 
                                 : '🪨')
                              : isCurrentSite ? '🔍' : '📡'}
                          </div>
                          <span>SITE {index + 1}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {multiplier > 0 && (
                            <span style={{ fontSize: '12px', color: planet === 'earth' ? '#60a5fa' : planet === 'gas' ? '#fbbf24' : '#34d399' }}>
                              {multiplier}x ARTIFACT
                            </span>
                          )}
                          <div style={{ fontSize: '16px' }}>
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

              {/* Excavation Progress */}
              {excavationPhase && (
                <div style={{
                  width: '200px',
                  margin: '20px auto',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '60px',
                    animation: 'excavationDrill 2s ease-in-out infinite',
                    filter: `drop-shadow(0 0 15px ${planet === 'earth' ? 'rgba(60, 165, 250, 0.8)' : planet === 'gas' ? 'rgba(251, 191, 36, 0.8)' : 'rgba(52, 211, 153, 0.8)'})`
                  }}>
                    🔍
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: planet === 'earth' ? '#60a5fa' : planet === 'gas' ? '#fbbf24' : '#34d399',
                    marginTop: '10px'
                  }}>
                    Atmosphere: {atmosphereLevel.toFixed(0)}%
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
            />

            <style>
              {`
                @keyframes atmosphereShift {
                  0%, 100% { opacity: 0.3; transform: scale(1); }
                  50% { opacity: 0.6; transform: scale(1.05); }
                }
                @keyframes celestialFloat {
                  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
                  50% { transform: translateY(-20px) rotate(180deg); opacity: 0.4; }
                }
                @keyframes excavate {
                  0%, 100% { transform: scale(1); opacity: 1; }
                  50% { transform: scale(1.02); opacity: 0.9; }
                }
                @keyframes excavationDrill {
                  0%, 100% { transform: scale(1) rotate(0deg); }
                  50% { transform: scale(1.1) rotate(15deg); }
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
