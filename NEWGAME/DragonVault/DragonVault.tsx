import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useCurrentToken, useTokenBalance, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { TOKEN_METADATA } from '../../src/constants'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { useIsCompact } from '../../src/hooks/useIsCompact'
import { useGameOutcome } from '../../src/hooks/useGameOutcome'
import DragonVaultPaytable, { DragonVaultPaytableRef } from './DragonVaultPaytable'
import DragonVaultOverlays from './DragonVaultOverlays'
import { GameControls } from '../../src/components'

// Bet arrays for different dragon types
const DRAGON_TYPES = {
  fire: [0, 2, 5, 10, 22],          // Fire dragon - aggressive guardian
  ice: [0, 0, 6, 14, 30],           // Ice dragon - cold calculator
  shadow: [0, 0, 0, 18, 45],        // Shadow dragon - ancient evil
}

type DragonType = keyof typeof DRAGON_TYPES

export default function DragonVault() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const [playing, setPlaying] = React.useState(false)
  const [win, setWin] = React.useState(false)
  const [resultIndex, setResultIndex] = React.useState(0)
  const [dragon, setDragon] = React.useState<DragonType>('fire')
  const [wager, setWager] = useWagerInput()
  const token = useCurrentToken()
  const { balance } = useTokenBalance()
  const paytableRef = React.useRef<DragonVaultPaytableRef>(null)
  
  // Multi-phase states
  const [currentDepth, setCurrentDepth] = React.useState(0)
  const [delving, setDelving] = React.useState(false)
  const [treasureFound, setTreasureFound] = React.useState(false)
  const [depthResults, setDepthResults] = React.useState<('empty' | 'trap' | 'treasure')[]>([])
  const [dragonAwareness, setDragonAwareness] = React.useState(0)
  const [vaultTemperature, setVaultTemperature] = React.useState(50)
  
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
      setDelving(true)
      setTreasureFound(false)
      setDepthResults([])
      setDragonAwareness(0)
      setVaultTemperature(dragon === 'fire' ? 90 : dragon === 'ice' ? 10 : 50)
      
      const selectedDragon = dragon
      const selectedBet = DRAGON_TYPES[dragon]

      if (sounds.play) sounds.play('play', { playbackRate: 0.7 })

      await game.play({
        bet: selectedBet,
        wager,
        metadata: [dragon],
      })

      const result = await game.result()
      const winResult = result.payout > 0
      const treasureDepth = result.resultIndex
      const multiplier = winResult ? result.payout / wager : 0

      // Create delving sequence
      const maxDepths = selectedBet.length
      const depthResults: ('empty' | 'trap' | 'treasure')[] = []
      
      for (let depth = 0; depth < maxDepths; depth++) {
        setCurrentDepth(depth + 1)
        setDragonAwareness(((depth + 1) / maxDepths) * 100)
        
        // Adjust temperature based on dragon type and depth
        if (dragon === 'fire') {
          setVaultTemperature(90 + (depth * 10))
        } else if (dragon === 'ice') {
          setVaultTemperature(10 - (depth * 2))
        } else {
          setVaultTemperature(50 + (Math.random() - 0.5) * 20)
        }
        
        // Simulate delving time with increasing danger
        await new Promise(resolve => setTimeout(resolve, 2600 + (depth * 900)))
        
        let depthResult: 'empty' | 'trap' | 'treasure'
        if (depth === treasureDepth && winResult) {
          depthResult = selectedBet[depth] >= 30 ? 'treasure' : 'trap'
        } else if (depth < treasureDepth || (!winResult && Math.random() < 0.35)) {
          depthResult = Math.random() < 0.65 ? 'empty' : 'trap'
        } else {
          depthResult = 'empty'
        }
        
        depthResults.push(depthResult)
        setDepthResults([...depthResults])
        
        if (depthResult === 'treasure') {
          setTreasureFound(true)
          break
        }
        
        await new Promise(resolve => setTimeout(resolve, 1400))
      }

      setDelving(false)
      setWin(winResult)
      setResultIndex(result.resultIndex)

      paytableRef.current?.trackGame({
        dragon: selectedDragon,
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

  const getDragonMultiplier = (dragon: DragonType) => {
    const bet = DRAGON_TYPES[dragon]
    return Math.max(...bet)
  }

  const getDragonChance = (dragon: DragonType) => {
    const bet = DRAGON_TYPES[dragon]
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
            background: dragon === 'fire' 
              ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 20%, #991b1b 40%, #7f1d1d 60%, #450a0a 80%, #0f172a 100%)'
              : dragon === 'ice'
              ? 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 20%, #0369a1 40%, #075985 60%, #0c4a6e 80%, #0f172a 100%)'
              : 'linear-gradient(135deg, #7c2d12 0%, #92400e 20%, #a16207 40%, #ca8a04 60%, #eab308 80%, #0f172a 100%)',
            borderRadius: '24px',
            border: `3px solid ${dragon === 'fire' ? 'rgba(220, 38, 38, 0.4)' : dragon === 'ice' ? 'rgba(14, 165, 233, 0.4)' : 'rgba(124, 45, 18, 0.4)'}`,
            boxShadow: `
              0 25px 50px rgba(0, 0, 0, 0.9),
              inset 0 2px 4px rgba(255, 255, 255, 0.1),
              inset 0 -2px 4px rgba(0, 0, 0, 0.6),
              0 0 40px ${dragon === 'fire' ? 'rgba(220, 38, 38, 0.3)' : dragon === 'ice' ? 'rgba(14, 165, 233, 0.3)' : 'rgba(124, 45, 18, 0.3)'}
            `,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Vault atmospheric effects */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: dragon === 'fire' 
                ? 'radial-gradient(circle at 30% 20%, rgba(220, 38, 38, 0.15) 0%, transparent 50%)'
                : dragon === 'ice'
                ? 'radial-gradient(circle at 70% 30%, rgba(14, 165, 233, 0.12) 0%, transparent 50%)'
                : 'radial-gradient(circle at 50% 60%, rgba(124, 45, 18, 0.1) 0%, transparent 50%)',
              animation: 'vaultAmbience 14s ease-in-out infinite alternate'
            }} />
            
            {/* Floating vault elements */}
            <div style={{
              position: 'absolute',
              top: '12%',
              left: '8%',
              fontSize: '40px',
              opacity: 0.2,
              animation: 'vaultFloat 16s ease-in-out infinite'
            }}>
              {dragon === 'fire' ? '🔥' : dragon === 'ice' ? '❄️' : '👑'}
            </div>
            
            <div style={{
              position: 'absolute',
              top: '70%',
              right: '12%',
              fontSize: '35px',
              opacity: 0.18,
              animation: 'vaultFloat 14s ease-in-out infinite reverse'
            }}>
              {dragon === 'fire' ? '💎' : dragon === 'ice' ? '🧊' : '💰'}
            </div>
            
            <div style={{
              position: 'absolute',
              bottom: '20%',
              left: '15%',
              fontSize: '32px',
              opacity: 0.15,
              animation: 'vaultFloat 18s ease-in-out infinite'
            }}>
              {dragon === 'fire' ? '🌋' : dragon === 'ice' ? '🌨️' : '✨'}
            </div>

            {/* Dragon Selection */}
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
              {(['fire', 'ice', 'shadow'] as DragonType[]).map((dragonType) => (
                <button
                  key={dragonType}
                  onClick={() => setDragon(dragonType)}
                  disabled={playing}
                  style={{
                    background: dragon === dragonType 
                      ? `linear-gradient(135deg, ${dragonType === 'fire' ? 'rgba(220, 38, 38, 0.4)' : dragonType === 'ice' ? 'rgba(14, 165, 233, 0.4)' : 'rgba(124, 45, 18, 0.4)'} 0%, ${dragonType === 'fire' ? 'rgba(185, 28, 28, 0.4)' : dragonType === 'ice' ? 'rgba(2, 132, 199, 0.4)' : 'rgba(146, 64, 14, 0.4)'} 100%)`
                      : 'rgba(0, 0, 0, 0.6)',
                    border: dragon === dragonType 
                      ? `2px solid ${dragonType === 'fire' ? 'rgba(220, 38, 38, 0.7)' : dragonType === 'ice' ? 'rgba(14, 165, 233, 0.7)' : 'rgba(124, 45, 18, 0.7)'}` 
                      : '1px solid rgba(107, 114, 128, 0.3)',
                    borderRadius: '12px',
                    padding: '10px 18px',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: playing ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: playing ? 0.6 : 1,
                    textTransform: 'uppercase'
                  }}
                >
                  {dragonType === 'fire' && '🔥 FIRE'} 
                  {dragonType === 'ice' && '❄️ ICE'} 
                  {dragonType === 'shadow' && '🌑 SHADOW'}
                  <br />
                  <span style={{ fontSize: '10px', opacity: 0.8 }}>
                    {getDragonChance(dragonType)}% • {getDragonMultiplier(dragonType)}x
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
                background: `linear-gradient(45deg, ${dragon === 'fire' ? '#f87171, #fca5a5, #fecaca' : dragon === 'ice' ? '#38bdf8, #7dd3fc, #bae6fd' : '#fbbf24, #fcd34d, #fde68a'})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: `0 0 30px ${dragon === 'fire' ? 'rgba(220, 38, 38, 0.5)' : dragon === 'ice' ? 'rgba(14, 165, 233, 0.5)' : 'rgba(124, 45, 18, 0.5)'}`
              }}>
                🐉 DRAGON'S VAULT 💎
              </h1>
              
              <div style={{
                fontSize: '20px',
                color: dragon === 'fire' ? '#fca5a5' : dragon === 'ice' ? '#7dd3fc' : '#fcd34d',
                marginBottom: '32px',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
              }}>
                {playing && delving ? (
                  <span style={{ color: '#fbbf24' }}>⛏️ Delving depth {currentDepth}...</span>
                ) : playing ? (
                  <span style={{ color: '#22c55e' }}>🏆 Delving Complete</span>
                ) : (
                  'Brave the dragon\'s treasure vault'
                )}
              </div>

              {/* Vault Depth Display */}
              {(playing || hasPlayedBefore) && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '24px'
                }}>
                  {DRAGON_TYPES[dragon].map((multiplier, index) => {
                    const isCurrentDepth = delving && currentDepth === index + 1
                    const isExplored = index < depthResults.length
                    const depthResult = depthResults[index]
                    
                    return (
                      <div
                        key={index}
                        style={{
                          width: '340px',
                          height: '50px',
                          borderRadius: '25px',
                          border: isCurrentDepth ? '3px solid #fbbf24' : `2px solid ${dragon === 'fire' ? 'rgba(248, 113, 113, 0.3)' : dragon === 'ice' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(251, 191, 36, 0.3)'}`,
                          background: isExplored
                            ? (depthResult === 'treasure' ? `linear-gradient(135deg, ${dragon === 'fire' ? '#dc2626, #b91c1c' : dragon === 'ice' ? '#0ea5e9, #0284c7' : '#ca8a04, #a16207'})` 
                               : depthResult === 'trap' ? 'linear-gradient(135deg, #7c2d12, #92400e)'
                               : `linear-gradient(135deg, ${dragon === 'fire' ? '#991b1b, #7f1d1d' : dragon === 'ice' ? '#0369a1, #075985' : '#a16207, #92400e'})`)
                            : `linear-gradient(135deg, 
                               ${dragon === 'fire' ? `rgba(220, 38, 38, ${0.3 + index * 0.12})` : dragon === 'ice' ? `rgba(14, 165, 233, ${0.3 + index * 0.12})` : `rgba(124, 45, 18, ${0.3 + index * 0.12})`} 0%, 
                               ${dragon === 'fire' ? `rgba(185, 28, 28, ${0.3 + index * 0.12})` : dragon === 'ice' ? `rgba(2, 132, 199, ${0.3 + index * 0.12})` : `rgba(146, 64, 14, ${0.3 + index * 0.12})`} 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0 20px',
                          color: '#fff',
                          fontSize: '14px',
                          fontWeight: 600,
                          position: 'relative',
                          animation: isCurrentDepth ? 'vaultDelving 1s infinite' : 'none',
                          boxShadow: isCurrentDepth ? '0 0 20px rgba(251, 191, 36, 0.5)' : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ fontSize: '20px' }}>
                            {isExplored 
                              ? (depthResult === 'treasure' ? '💎' 
                                 : depthResult === 'trap' ? '🪤' 
                                 : '🪨')
                              : isCurrentDepth ? '⛏️' : '🗝️'}
                          </div>
                          <span>DEPTH {index + 1}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {multiplier > 0 && (
                            <span style={{ fontSize: '12px', color: dragon === 'fire' ? '#fca5a5' : dragon === 'ice' ? '#7dd3fc' : '#fcd34d' }}>
                              {multiplier}x TREASURE
                            </span>
                          )}
                          <div style={{ fontSize: '12px' }}>
                            {dragon === 'fire' ? 
                              (index === 0 ? 'EMBERS' : index === 1 ? 'FLAMES' : index === 2 ? 'INFERNO' : index === 3 ? 'CORE' : 'HEART') :
                            dragon === 'ice' ?
                              (index === 0 ? 'FROST' : index === 1 ? 'FREEZE' : index === 2 ? 'GLACIER' : index === 3 ? 'CORE' : 'HEART') :
                              (index === 0 ? 'DUSK' : index === 1 ? 'VOID' : index === 2 ? 'ABYSS' : index === 3 ? 'CORE' : 'HEART')
                            }
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Vault Status */}
              {delving && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '30px',
                  margin: '20px auto',
                  width: '350px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '60px',
                      animation: 'vaultPulse 2.2s ease-in-out infinite',
                      filter: `drop-shadow(0 0 20px ${dragon === 'fire' ? 'rgba(248, 113, 113, 0.8)' : dragon === 'ice' ? 'rgba(56, 189, 248, 0.8)' : 'rgba(251, 191, 36, 0.8)'})`
                    }}>
                      ⛏️
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: dragon === 'fire' ? '#fca5a5' : dragon === 'ice' ? '#7dd3fc' : '#fcd34d',
                      marginTop: '8px'
                    }}>
                      Dragon Alert: {dragonAwareness.toFixed(0)}%
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '60px',
                      animation: 'vaultPulse 2.8s ease-in-out infinite',
                      filter: `drop-shadow(0 0 20px ${vaultTemperature > 80 ? 'rgba(239, 68, 68, 0.8)' : vaultTemperature < 20 ? 'rgba(56, 189, 248, 0.8)' : 'rgba(251, 191, 36, 0.8)'})`
                    }}>
                      🌡️
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: vaultTemperature > 80 ? '#ef4444' : vaultTemperature < 20 ? '#38bdf8' : '#fbbf24',
                      marginTop: '8px'
                    }}>
                      Vault Temp: {vaultTemperature.toFixed(0)}°C
                    </div>
                  </div>
                </div>
              )}

              {/* Result Display */}
              {!playing && hasPlayedBefore && (
                <div style={{
                  padding: '16px 32px',
                  borderRadius: '16px',
                  background: win 
                    ? `linear-gradient(135deg, ${dragon === 'fire' ? 'rgba(220, 38, 38, 0.2)' : dragon === 'ice' ? 'rgba(14, 165, 233, 0.2)' : 'rgba(124, 45, 18, 0.2)'} 0%, ${dragon === 'fire' ? 'rgba(185, 28, 28, 0.1)' : dragon === 'ice' ? 'rgba(2, 132, 199, 0.1)' : 'rgba(146, 64, 14, 0.1)'} 100%)`
                    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)',
                  border: `2px solid ${win ? (dragon === 'fire' ? '#fca5a5' : dragon === 'ice' ? '#7dd3fc' : '#fcd34d') : '#ef4444'}`,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7)',
                  marginTop: '24px'
                }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: win ? (dragon === 'fire' ? '#fca5a5' : dragon === 'ice' ? '#7dd3fc' : '#fcd34d') : '#ef4444',
                    marginBottom: '8px'
                  }}>
                    {win ? '💎 TREASURE CLAIMED!' : '🐉 DRAGON AWAKENED'}
                  </div>
                  <div style={{ color: dragon === 'fire' ? '#fca5a5' : dragon === 'ice' ? '#7dd3fc' : '#fcd34d', fontSize: '16px' }}>
                    {win ? `Ancient ${dragon} dragon treasure secured!` : 'The mighty dragon guards its hoard jealously'}
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
              border: `1px solid ${dragon === 'fire' ? 'rgba(248, 113, 113, 0.3)' : dragon === 'ice' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(251, 191, 36, 0.3)'}`,
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                {playing ? 'DELVING IN PROGRESS...' : `DRAGON: ${dragon.toUpperCase()}`}
              </div>
              <div style={{ color: dragon === 'fire' ? '#fca5a5' : dragon === 'ice' ? '#7dd3fc' : '#fcd34d', fontSize: '14px', fontWeight: 700 }}>
                {getDragonMultiplier(dragon)}.00x ANCIENT TREASURE
              </div>
            </div>
            
            <DragonVaultOverlays
              delving={delving}
              currentDepth={currentDepth}
              treasureFound={treasureFound}
              win={win}
              dragon={dragon}
              dragonAwareness={dragonAwareness}
              vaultTemperature={vaultTemperature}
            />

            <style>
              {`
                @keyframes vaultAmbience {
                  0%, 100% { opacity: 0.4; transform: scale(1); }
                  50% { opacity: 0.7; transform: scale(1.02); }
                }
                @keyframes vaultFloat {
                  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
                  50% { transform: translateY(-18px) rotate(180deg); opacity: 0.35; }
                }
                @keyframes vaultDelving {
                  0%, 100% { transform: scale(1); opacity: 1; }
                  50% { transform: scale(1.015); opacity: 0.95; }
                }
                @keyframes vaultPulse {
                  0%, 100% { transform: scale(1) rotate(0deg); }
                  50% { transform: scale(1.08) rotate(8deg); }
                }
              `}
            </style>
          </div>

          <DragonVaultPaytable
            ref={paytableRef}
            wager={wager}
            selectedDragon={dragon}
          />
        </div>
      </GambaUi.Portal>
      
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={play}
        isPlaying={playing}
        showOutcome={showOutcome}
        playButtonText={hasPlayedBefore ? 'Delve Again' : 'Enter Vault'}
        onPlayAgain={handlePlayAgain}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 'bold' }}>Dragon:</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['fire', 'ice', 'shadow'] as DragonType[]).map((dragonType) => (
              <GambaUi.Button
                key={dragonType}
                onClick={() => setDragon(dragonType)}
                disabled={playing || showOutcome}
              >
                {dragon === dragonType ? '✓ ' : ''}
                {dragonType === 'fire' && '🔥 Fire'}
                {dragonType === 'ice' && '❄️ Ice'}
                {dragonType === 'shadow' && '🌑 Shadow'}
              </GambaUi.Button>
            ))}
          </div>
        </div>
      </GameControls>
    </>
  )
}
