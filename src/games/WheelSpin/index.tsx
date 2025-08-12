import { GambaUi, useWagerInput, useCurrentToken, useTokenBalance, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { TOKEN_METADATA } from '../../constants'
import { GameControls, GambaResultModal } from '../../components'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import React, { useContext, useRef } from 'react'
import { useIsCompact } from '../../hooks/useIsCompact'
import { GambaResultContext } from '../../context/GambaResultContext'
import WheelSpinPaytable, { WheelSpinPaytableRef } from './WheelSpinPaytable'

export default function WheelSpin() {
  const [resultModalOpen, setResultModalOpen] = React.useState(false);
  const { setGambaResult } = useContext(GambaResultContext)
  const [wager, setWager] = useWagerInput()
  const game = GambaUi.useGame()
  const [result, setResult] = React.useState<number | null>(null)
  const [payout, setPayout] = React.useState<number | null>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [spinning, setSpinning] = React.useState(false)
  const [spinAngle, setSpinAngle] = React.useState(0)
  const token = useCurrentToken()
  const { balance } = useTokenBalance()

  // Live paytable tracking
  const paytableRef = useRef<WheelSpinPaytableRef>(null)

  // Game outcome overlay state
  const {
    showOutcome,
    hasPlayedBefore,
    handleGameComplete,
    handlePlayAgain,
    isWin,
    profitAmount,
    resetGameState,
  } = useGameOutcome();

  // Dynamic play button text
  const playButtonText = hasPlayedBefore && !showOutcome ? "Play Again" : "Spin";

  // Find token metadata for symbol/decimals display
  const tokenMeta = token ? TOKEN_METADATA.find((t) => t.symbol === token.symbol) : undefined
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

  // Responsive scaling logic using useIsCompact
  const { compact } = useIsCompact();
  const [scale, setScale] = React.useState(compact ? 1 : 1.3);

  React.useEffect(() => {
    setScale(compact ? 1 : 1.3);
  }, [compact]);

  // 5 segments: one for all losses (0x), and one for each win multiplier
  // Each entry is equally likely to be selected by the Gamba engine
  const segments = [0, 1.2, 1.5, 2, 5];
  const wheelColors = ['#f00', '#00ffe1', '#ffd700', '#00ffe1', '#f00'] // Red, Cyan, Gold, Cyan, Red

  const play = async () => {
    // Reset overlay state when starting new game
    if (showOutcome) {
      handlePlayAgain()
      return
    }

    setIsPlaying(true)
    setResult(null)
    setPayout(null)
    setSpinning(true)
    const spinSegments = segments.length
    const spinRounds = 5
    await new Promise(res => setTimeout(res, 1200))
    await game.play({ wager, bet: segments })
    const res = await game.result()
  setGambaResult(res)
  setResultModalOpen(true)
    const segmentAngle = 360 / spinSegments
    const finalAngle = 360 * spinRounds + (segmentAngle * res.resultIndex) + segmentAngle / 2
    setSpinAngle(finalAngle)
    setTimeout(() => {
      setResult(res.resultIndex)
      setPayout(res.payout)
      setSpinning(false)
      setIsPlaying(false)

      // Track result in live paytable
      const segmentMultiplier = segments[res.resultIndex]
      const wasWin = res.payout > 0
      
      if (paytableRef.current) {
        paytableRef.current.trackGame({
          segmentIndex: res.resultIndex,
          multiplier: segmentMultiplier,
          wasWin,
          amount: res.payout
        })
      }

      // Handle game outcome for overlay
      handleGameComplete({
        payout: res.payout,
        wager: wager,
      });
    }, 1200)
  }

  const formatPayout = (payout: number | null) => {
    if (payout === null || !token) return '-'
    return (payout / Math.pow(10, token.decimals)).toLocaleString(undefined, {
      maximumFractionDigits: token.decimals,
    })
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <div style={{ display: 'flex', gap: 16, height: '100%', width: '100%' }}>
          {/* Main game area */}
          <div
            style={{
              flex: 1,
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #0f1419 0%, #1a1a2e 50%, #16213e 100%)',
              borderRadius: '20px',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              boxShadow: `
                0 20px 40px rgba(0, 0, 0, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.1),
                inset 0 -1px 0 rgba(0, 0, 0, 0.2)
              `,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div style={{
              textAlign: 'center',
              marginBottom: 20,
              zIndex: 10,
              position: 'relative'
            }}>
              <h2 style={{
                fontSize: 32,
                fontWeight: 800,
                margin: '0 0 8px 0',
                letterSpacing: 2,
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                color: '#fff'
              }}>
                🌀 WHEEL SPIN 🎯
              </h2>
              <div style={{
                fontSize: 16,
                color: '#888',
                fontWeight: 600
              }}>
                Spin the wheel of fortune for big wins!
              </div>
            </div>

            <GambaUi.Responsive>
              <div style={{
                transform: `scale(${scale})`,
                transformOrigin: 'center',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s ease-out',
                padding: '20px',
                position: 'relative',
                zIndex: 5
              }} className="wheelspin-game-scaler">
                <div style={{ textAlign: 'center', position: 'relative' }}>
                  {/* Wheel Display */}
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}>
                    <div style={{ width: 260, height: 260, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg
                        width="260"
                        height="260"
                        viewBox="0 0 260 260"
                        style={{
                          transition: spinning ? 'transform 1.2s cubic-bezier(.5,1.5,.5,1)' : 'none',
                          transform: spinning ? `rotate(${spinAngle}deg)` : result !== null ? `rotate(${spinAngle}deg)` : 'none',
                          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))'
                        }}
                      >
                        {segments.map((seg, i) => {
                          const startAngle = ((i / segments.length) * 2 * Math.PI) - Math.PI / 2
                          const endAngle = (((i + 1) / segments.length) * 2 * Math.PI) - Math.PI / 2
                          const x1 = 130 + 110 * Math.cos(startAngle)
                          const y1 = 130 + 110 * Math.sin(startAngle)
                          const x2 = 130 + 110 * Math.cos(endAngle)
                          const y2 = 130 + 110 * Math.sin(endAngle)
                          return (
                            <path
                              key={i}
                              d={`M130,130 L${x1},${y1} A110,110 0 0,1 ${x2},${y2} Z`}
                              fill={wheelColors[i]}
                              stroke="#222"
                              strokeWidth={2}
                              opacity={result === i ? 1 : 0.8}
                            />
                          )
                        })}
                        <circle cx="130" cy="130" r="90" fill="rgba(17, 17, 17, 0.9)" />
                        {segments.map((seg, i) => {
                          // Fix: reverse the label order so segment 1 (right) matches segments[0]
                          const labelIndex = (i === 0) ? 0 : segments.length - i
                          const segValue = segments[labelIndex]
                          const angle = ((i + 0.5) * 360 / segments.length) - 90
                          const rad = (angle * Math.PI) / 180
                          const x = 130 + 80 * Math.cos(rad)
                          const y = 130 + 80 * Math.sin(rad)
                          return (
                            <text
                              key={i}
                              x={x}
                              y={y}
                              textAnchor="middle"
                              alignmentBaseline="middle"
                              fontSize="24"
                              fontWeight="bold"
                              fill={segValue > 0 ? (segValue >= 5 ? '#ffd700' : '#00ffe1') : '#f00'}
                              stroke="#222"
                              strokeWidth="1"
                              style={{
                                filter: segValue >= 5 ? 'drop-shadow(0 0 4px #ffd700)' : undefined,
                              }}
                            >
                              {segValue === 0 ? '0' : `${segValue}x`}
                            </text>
                          )
                        })}
                        <text x="130" y="140" textAnchor="middle" fontSize="38" fill="#00ffe1" fontWeight="bold">
                          Spin
                        </text>
                      </svg>
                      
                      {/* Pointer */}
                      <div style={{
                        position: 'absolute',
                        left: '100%',
                        top: '50%',
                        transform: 'translate(-50%,-50%) rotate(180deg)',
                        width: 0,
                        height: 0,
                        borderTop: '18px solid transparent',
                        borderBottom: '18px solid transparent',
                        borderLeft: '38px solid #ffd700',
                        zIndex: 2,
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                      }} />
                      
                    </div>
                  </div>

                  {/* Game Info */}
                  <div style={{
                    marginTop: 20,
                    padding: '12px 20px',
                    borderRadius: '12px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    color: '#60a5fa',
                    fontWeight: 600,
                    fontSize: '14px',
                    textAlign: 'center'
                  }}>
                    <div>Wheel Segments: {segments.join(' | ')}</div>
                    <div style={{ marginTop: 4 }}>Expected Return: Variable based on segment hit</div>
                  </div>

                  {/* Result Display */}
                  {!spinning && result !== null && (
                    <div style={{
                      marginTop: 20,
                      padding: '16px 24px',
                      borderRadius: '12px',
                      background: payout && payout > 0 
                        ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.2))'
                        : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2))',
                      border: payout && payout > 0
                        ? '1px solid rgba(34, 197, 94, 0.4)'
                        : '1px solid rgba(239, 68, 68, 0.4)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '18px',
                      textAlign: 'center',
                      animation: 'resultGlow 1s ease-in-out'
                    }}>
                      {payout && payout > 0 ? (
                        <>
                          🎉 You Win!<br />
                          <span style={{ fontSize: '18px', fontWeight: 700 }}>
                            +{formatPayout(payout)} {token?.symbol}
                          </span>
                        </>
                      ) : (
                        <>😔 You Lost</>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </GambaUi.Responsive>
          </div>

          {/* Paytable sidebar */}
          <WheelSpinPaytable
            ref={paytableRef}
            wager={wager}
            segments={segments}
            wheelColors={wheelColors}
            currentResult={result !== null ? {
              segmentIndex: result,
              multiplier: segments[result],
              wasWin: payout !== null && payout > 0,
              amount: payout || 0
            } : undefined}
          />
        </div>
      </GambaUi.Portal>
      
      <GameControls
        wager={wager}
        setWager={setWager}
        onPlay={play}
        isPlaying={isPlaying}
        playButtonText={playButtonText}
      />
      
      <GambaResultModal open={showOutcome} onClose={handlePlayAgain} />
      
      <style>{`
        @keyframes resultGlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </>
  )
}
