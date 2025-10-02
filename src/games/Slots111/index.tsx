import { GameResult } from 'gamba-core-v2'
import { EffectTest, GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import React, { useEffect, useRef } from 'react'
import { EnhancedWagerInput, EnhancedButton, MobileControls, DesktopControls, GameControlsSection, GameRecentPlaysHorizontal } from '../../components'
import { GameStatsHeader } from '../../components/Game/GameStatsHeader'
import GameplayFrame, { GameplayEffectsRef } from '../../components/Game/GameplayFrame'
import { useGraphics } from '../../components/Game/GameScreenFrame'
import { useGameStats } from '../../hooks/game/useGameStats'
import { useIsCompact } from '../../hooks/ui/useIsCompact'
import { useGameMeta } from '../useGameMeta'
import { ItemPreview } from './ItemPreview'
import { Reel } from './Reel'
import { Slot } from './Slot'
import { StyledSlots, StyledSlotsBackground } from './Slots.styles'
import {
  FINAL_DELAY,
  GRID_HEIGHT,
  GRID_WIDTH,
  LEGENDARY_THRESHOLD,
  NUM_SLOTS,
  REVEAL_SLOT_DELAY,
  SLOT_ITEMS,
  SOUND_LOSE,
  SOUND_PLAY,
  SOUND_REVEAL,
  SOUND_REVEAL_LEGENDARY,
  SOUND_SPIN,
  SOUND_WIN,
  SPIN_DELAY,
  SlotItem,
} from './constants'
import { generateBetArray, getSlotCombination } from './utils'

function Messages({ messages }: {messages: string[]}) {
  const [messageIndex, setMessageIndex] = React.useState(0)
  React.useEffect(
    () => {
      const timeout = setInterval(() => {
        setMessageIndex((x) => (x + 1) % messages.length)
      }, 2500)
      return () => clearInterval(timeout)
    },
    [messages],
  )
  return (
    <>
      {messages[messageIndex]}
    </>
  )
}

export default function Slots() {
  const gamba = GambaUi.useGame()
  const game = GambaUi.useGame()
  const pool = useCurrentPool()
  const stats = useGameStats('slots')
  const effectsRef = useRef<GameplayEffectsRef>(null)
  const { mobile } = useIsCompact()
  const [spinning, setSpinning] = React.useState(false)
  const [result, setResult] = React.useState<GameResult>()
  const [good, setGood] = React.useState(false)
  const [revealedSlots, setRevealedSlots] = React.useState(NUM_SLOTS)
  const [wager, setWager] = useWagerInput()
  const [winningSymbol, setWinningSymbol] = React.useState<SlotItem | undefined>()
  const [combination, setCombination] = React.useState(
    Array.from({ length: NUM_SLOTS }).map(() => SLOT_ITEMS[0]),
  )
  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    reveal: SOUND_REVEAL,
    revealLegendary: SOUND_REVEAL_LEGENDARY,
    spin: SOUND_SPIN,
    play: SOUND_PLAY,
  })
  const bet = React.useMemo(
    () => generateBetArray(pool.maxPayout, wager),
    [pool.maxPayout, wager],
  )
  const timeout = useRef<any>()

  const isValid = bet.some((x) => x > 1)

  useEffect(
    () => {
      // Clear timeout when user leaves
      return () => {
        timeout.current && clearTimeout(timeout.current)
      }
    },
    [],
  )

  const revealSlot = (combination: SlotItem[], slot = 0) => {
    sounds.play('reveal', { playbackRate: 1.1 })

    const allSame = combination.slice(0, slot + 1).every((item, index, arr) => !index || item === arr[index - 1])

    if (combination[slot].multiplier >= LEGENDARY_THRESHOLD) {
      if (allSame) {
        sounds.play('revealLegendary')
      }
    }

    setRevealedSlots(slot + 1)

    if (slot < NUM_SLOTS - 1) {
      // Reveal next slot
      timeout.current = setTimeout(
        () => revealSlot(combination, slot + 1),
        REVEAL_SLOT_DELAY,
      )
    } else if (slot === NUM_SLOTS - 1) {
      // Show final results
      sounds.sounds.spin.player.stop()
      timeout.current = setTimeout(() => {
        setSpinning(false)
        if (allSame) {
          setGood(true)
          sounds.play('win')
        } else {
          sounds.play('lose')
        }
      }, FINAL_DELAY)
    }
  }

  const play = async () => {
    try {
      setSpinning(true)
      setResult(undefined)

      await game.play({
        wager,
        bet,
      })

      sounds.play('play')

      setRevealedSlots(0)
      setGood(false)

      const startTime = Date.now()

      sounds.play('spin', { playbackRate: .5 })

      const result = await gamba.result()

      // Make sure we wait a minimum time of SPIN_DELAY before slots are revealed:
      const resultDelay = Date.now() - startTime
      const revealDelay = Math.max(0, SPIN_DELAY - resultDelay)

      const combination = getSlotCombination(NUM_SLOTS, result.multiplier, bet)

      setCombination(combination)

      setResult(result)

      timeout.current = setTimeout(() => revealSlot(combination), revealDelay)
    } catch (err) {
      // Reset if there's an error
      setSpinning(false)
      setRevealedSlots(NUM_SLOTS)
      throw err
    }
  }

  return (
    <>
      {/* Recent Plays Portal - positioned above stats */}
      <GambaUi.Portal target="recentplays">
        <GameRecentPlaysHorizontal gameId="slots" />
      </GambaUi.Portal>

      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName="Slots"
          gameMode="Classic"
          stats={stats.stats}
          onReset={stats.resetStats}
          isMobile={mobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <StyledSlotsBackground>
          {/* Enhanced background for Slots game */}
          <div className="slots-bg-elements" />
          <div className="casino-bg-elements" />
          <div className="decorative-overlay" />
          
          <StyledSlots>
            <GameplayFrame 
              ref={effectsRef}
              {...(useGameMeta('slots') && { 
                title: useGameMeta('slots')!.name, 
                description: useGameMeta('slots')!.description 
              })}
              disableContainerTransforms={true}
              style={{
                width: '100%',
                height: '100%',
                minHeight: '600px',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              {good && <EffectTest src={winningSymbol?.image || combination[0].image} />}
              <GambaUi.Responsive>
                <div className="slots-content">
                  <div className={'slots'}>
                    <div className="winning-line-display">
                      <ItemPreview 
                        betArray={[...bet]} 
                        isWinning={good}
                      />
                    </div>
                    <div className="slots-reels-container">
                      {Array.from({ length: GRID_WIDTH }).map((_, colIndex) => {
                        const reelItems = Array.from({ length: GRID_HEIGHT }).map((_, rowIndex) => {
                          const slotIndex = rowIndex * GRID_WIDTH + colIndex
                          return combination[slotIndex] || SLOT_ITEMS[0]
                        })
                        
                        const reelGoodSlots = reelItems.map((item) => good && item.multiplier >= LEGENDARY_THRESHOLD)
                        const reelRevealed = revealedSlots > colIndex * GRID_HEIGHT
                        
                        return (
                          <Reel
                            key={colIndex}
                            reelIndex={colIndex}
                            revealed={reelRevealed}
                            good={reelGoodSlots}
                            items={reelItems}
                            isSpinning={spinning && !reelRevealed}
                            enableMotion={true}
                          />
                        )
                      })}
                    </div>
                  </div>
                </div>
              </GambaUi.Responsive>
            </GameplayFrame>
          </StyledSlots>
        </StyledSlotsBackground>
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <MobileControls
          wager={wager}
          setWager={setWager}
          onPlay={play}
          playDisabled={!isValid}
          playText="Spin"
        />
        
        <DesktopControls
          onPlay={play}
          playDisabled={!isValid}
          playText="Spin"
        >
          <EnhancedWagerInput value={wager} onChange={setWager} />
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}
