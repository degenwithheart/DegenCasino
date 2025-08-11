import { GambaUi, useWagerInput, useCurrentToken, useTokenBalance, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { TOKEN_METADATA } from '../../constants'
import { GameControls, GameScreenLayout } from '../../components'
import { useGameOutcome } from '../../hooks/useGameOutcome'
import React, { useContext } from 'react'
import { useIsCompact } from '../../hooks/useIsCompact'
import { GambaResultContext } from '../../context/GambaResultContext'

export default function WheelSpin() {
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
    const segmentAngle = 360 / spinSegments
    const finalAngle = 360 * spinRounds + (segmentAngle * res.resultIndex) + segmentAngle / 2
    setSpinAngle(finalAngle)
    setTimeout(() => {
      setResult(res.resultIndex)
      setPayout(res.payout)
      setSpinning(false)
      setIsPlaying(false)

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
    <GameScreenLayout
      left={
        <GambaUi.Portal target="screen">
          <div style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s ease-out'
          }} className="wheelspin-game-scaler">
            <div style={{ textAlign: 'center', marginTop: 32, position: 'relative' }}>
              <h2 style={{ fontWeight: 700, fontSize: 32, marginBottom: 16 }}>🌀 Wheel Spin</h2>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}>
                <div style={{ width: 260, height: 260, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg
                    width="260"
                    height="260"
                    viewBox="0 0 260 260"
                    style={{
                      transition: spinning ? 'transform 1.2s cubic-bezier(.5,1.5,.5,1)' : 'none',
                      transform: spinning ? `rotate(${spinAngle}deg)` : result !== null ? `rotate(${spinAngle}deg)` : 'none',
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
                          opacity={result === i ? 1 : 0.7}
                        />
                      )
                    })}
                    <circle cx="130" cy="130" r="90" fill="#111" />
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
                          fill={segValue > 0 ? (segValue >= 10 ? '#ffd700' : '#00ffe1') : '#f00'}
                          stroke="#222"
                          strokeWidth="1"
                          style={{
                            filter: segValue >= 10 ? 'drop-shadow(0 0 4px #ffd700)' : undefined,
                          }}
                        >
                          {segValue === 10 ? '10x' : segValue === 0 ? '0' : `${segValue}x`}
                        </text>
                      )
                    })}
                    <text x="130" y="140" textAnchor="middle" fontSize="38" fill="#00ffe1" fontWeight="bold">Spin</text>
                  </svg>
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
                  }} />
                  {!spinning && result !== null && (
                    <div style={{
                      position: 'absolute',
                      left: 'calc(100% + 24px)',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      minWidth: 160,
                      background: 'rgba(0,0,0,0.85)',
                      borderRadius: 12,
                      padding: '18px 20px',
                      fontSize: 28,
                      fontWeight: 600,
                      boxShadow: '0 2px 16px #0008',
                      textAlign: 'center',
                      zIndex: 3,
                    }}>
                      <span style={{ color: payout ? '#00ffe1' : '#f00', fontWeight: 700, fontSize: 22 }}>
                        {payout ? `You win ${formatPayout(payout)} ${token?.symbol}!` : 'You lose.'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </GambaUi.Portal>
      }
      right={
        <GameControls
          wager={wager}
          setWager={setWager}
          onPlay={play}
          isPlaying={isPlaying}
          playButtonText={playButtonText}
        />
      }
    />
  )
}
