import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { BET_ARRAYS_V2 } from '../rtpConfig-v2'
import { BPS_PER_WHOLE } from 'gamba-core-v2'
import { EnhancedWagerInput, EnhancedPlayButton, EnhancedButton, MobileControls, DesktopControls } from '../../components'
import { useIsCompact } from '../../hooks/ui/useIsCompact'
import { useGameMeta } from '../useGameMeta'
import { useGameStats } from '../../hooks/game/useGameStats'
import { GameStatsHeader } from '../../components/Game/GameStatsHeader'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGraphics } from '../../components/Game/GameScreenFrame'
import { 
  CANVAS_WIDTH, CANVAS_HEIGHT, ROMANTIC_COLORS, FLIP_SETTINGS
} from './constants'

// Import local sounds
import SOUND_COIN_FLIP from './sounds/coin.mp3'
import SOUND_WIN_FLIP from './sounds/win.mp3'
import SOUND_LOSE_FLIP from './sounds/lose.mp3'
import SOUND_PLAY_FLIP from './sounds/play.mp3'

// Import coin images
import HEADS_IMAGE from './images/heads.webp'
import TAILS_IMAGE from './images/tails.webp'

export default function FlipV2_3D() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const pool = useCurrentPool()
  const [initialWager, setInitialWager] = useWagerInput()
  const { settings } = useGraphics()
  const { mobile: isMobile } = useIsCompact()
  const effectsRef = React.useRef<GameplayEffectsRef>(null)
  
  const sounds = useSound({
    win: SOUND_WIN_FLIP,
    lose: SOUND_LOSE_FLIP,
    coin: SOUND_COIN_FLIP,
    play: SOUND_PLAY_FLIP,
  })

  // Canvas ref
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const animationRef = React.useRef<number>()
  
  // Game state - SAME AS 2D
  const [side, setSide] = React.useState<'heads' | 'tails'>('heads')
  const [numCoins, setNumCoins] = React.useState(1) // 1 to FLIP_SETTINGS.MAX_COINS coins
  const [atLeastK, setAtLeastK] = React.useState(1) // at least K wins
  const [totalProfit, setTotalProfit] = React.useState(0)
  const [gameCount, setGameCount] = React.useState(0)
  const [winCount, setWinCount] = React.useState(0)
  const [lossCount, setLossCount] = React.useState(0)
  const [inProgress, setInProgress] = React.useState(false)
  const [hasPlayed, setHasPlayed] = React.useState(false)
  const [flipping, setFlipping] = React.useState(false)
  const [coinResults, setCoinResults] = React.useState<number[]>(Array(FLIP_SETTINGS.MAX_COINS).fill(0))

  // Game statistics with localStorage persistence
  const gameStats = useGameStats('flip-v2')

  const handleResetStats = () => {
    // Stats are now reset through gameStats.resetStats in GameStatsHeader
  }

  // DISABLED play function for 3D mode
  const play = () => {
    console.log('🪙 3D Flip - Coming Soon! This mode is not yet available.')
  }

  // Helper functions (same as 2D)
  const isValid = !flipping && !!pool
  const totalWager = initialWager * numCoins
  const poolExceeded = totalWager > (pool?.maxPayout || 0)
  
  // Calculate multiplier based on current settings
  const getMultiplier = () => {
    try {
      const config = BET_ARRAYS_V2['flip-v2']
      const betArray = config.calculateBetArray(numCoins, atLeastK, side)
      return Math.max(...betArray)
    } catch {
      return 2.0
    }
  }

  const maxMultiplier = getMultiplier()

  const getPlayAction = () => play
  const getPlayText = () => "Coming Soon"

  // Make sure atLeastK doesn't exceed numCoins
  React.useEffect(() => {
    if (atLeastK > numCoins) {
      setAtLeastK(numCoins)
    }
  }, [numCoins, atLeastK])

  return (
    <>
      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Flip"
          gameMode="3D Mode (Coming Soon)"
          rtp="95"
          stats={gameStats.stats}
          onReset={gameStats.resetStats}
          isMobile={isMobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: `linear-gradient(135deg, ${ROMANTIC_COLORS.purple} 0%, ${ROMANTIC_COLORS.background} 100%)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          overflow: 'hidden'
        }}>
          {/* 3D Mode Coming Soon Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            backdropFilter: 'blur(5px)',
          }}>
            <div style={{
              color: 'white',
              fontSize: '2rem',
              fontWeight: 'bold',
              textAlign: 'center',
              padding: '2rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '1rem',
              border: '2px solid rgba(255, 255, 255, 0.2)',
            }}>
              🪙 3D Mode<br />
              <span style={{ fontSize: '1.2rem', opacity: 0.8 }}>Coming Soon!</span>
            </div>
          </div>

          {/* Game Controls - SIMPLIFIED */}
          <div style={{ zIndex: 3, display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', maxWidth: '400px' }}>
            {/* Side selection */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <EnhancedButton 
                onClick={() => setSide('heads')}
                variant={side === 'heads' ? 'primary' : 'secondary'}
                disabled={true}
              >
                <img src={HEADS_IMAGE} alt="Heads" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                Heads
              </EnhancedButton>
              <EnhancedButton 
                onClick={() => setSide('tails')}
                variant={side === 'tails' ? 'primary' : 'secondary'}
                disabled={true}
              >
                <img src={TAILS_IMAGE} alt="Tails" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                Tails
              </EnhancedButton>
            </div>

            {/* Number of coins */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <span style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>
                Number of Coins:
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <EnhancedButton
                  onClick={() => setNumCoins(Math.max(1, numCoins - 1))}
                  disabled={true}
                >
                  -
                </EnhancedButton>
                <span style={{ 
                  color: 'white', 
                  fontSize: '16px', 
                  fontWeight: 'bold',
                  minWidth: '24px',
                  textAlign: 'center'
                }}>
                  {numCoins}
                </span>
                <EnhancedButton
                  onClick={() => setNumCoins(Math.min(FLIP_SETTINGS.MAX_COINS, numCoins + 1))}
                  disabled={true}
                >
                  +
                </EnhancedButton>
              </div>
            </div>

            {/* At least K wins */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <span style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>
                At Least Wins:
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <EnhancedButton
                  onClick={() => setAtLeastK(Math.max(1, atLeastK - 1))}
                  disabled={true}
                >
                  -
                </EnhancedButton>
                <span style={{ 
                  color: 'white', 
                  fontSize: '16px', 
                  fontWeight: 'bold',
                  minWidth: '24px',
                  textAlign: 'center'
                }}>
                  {atLeastK}
                </span>
                <EnhancedButton
                  onClick={() => setAtLeastK(Math.min(numCoins, atLeastK + 1))}
                  disabled={true}
                >
                  +
                </EnhancedButton>
              </div>
            </div>

            {/* Multiplier display */}
            <div style={{
              padding: '12px',
              background: 'rgba(76, 175, 80, 0.1)',
              borderRadius: '8px',
              border: '2px solid rgba(76, 175, 80, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#4caf50',
                marginBottom: '4px'
              }}>
                MULTIPLIER
              </div>
              <div style={{
                fontSize: '18px',
                color: 'rgba(76, 175, 80, 0.9)',
                fontWeight: '600'
              }}>
                {`${getMultiplier().toFixed(2)}x`}
              </div>
            </div>
          </div>

          <GameplayFrame
            ref={effectsRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              zIndex: 1000
            }}
          />
        </div>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        {/* EXACT SAME CONTROLS AS 2D BUT DISABLED */}
        <MobileControls
          wager={initialWager}
          setWager={setInitialWager}
          onPlay={getPlayAction()}
          playDisabled={true}
          playText={getPlayText()}
        />
        
        <DesktopControls>
          <EnhancedWagerInput value={initialWager} onChange={setInitialWager} />
          <EnhancedPlayButton disabled={true} onClick={getPlayAction()}>
            {getPlayText()}
          </EnhancedPlayButton>
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}