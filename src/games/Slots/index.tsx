import { GameResult } from 'gamba-core-v2'
import { EffectTest, GambaUi, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import React, { useEffect, useRef } from 'react'
import { EnhancedWagerInput, EnhancedPlayButton, MobileControls, DesktopControls } from '../../components'
import GameScreenFrame from '../../components/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'
import { ItemPreview } from './ItemPreview'
import { Slot } from './Slot'
import { Reel } from './Reel'
import { StyledSlots } from './Slots.styles'
import { StyledSlotsBackground } from './SlotsBackground.enhanced.styles'
import {
  FINAL_DELAY,
  LEGENDARY_THRESHOLD,
  NUM_SLOTS,
  NUM_REELS,
  NUM_ROWS,
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
import { generateBetArray, getSlotCombination, getWinningPaylines } from './utils'

export default function Slots() {
  const game = GambaUi.useGame()
  const pool = useCurrentPool()
  const [spinning, setSpinning] = React.useState(false)
  const [result, setResult] = React.useState<GameResult>()
  const [good, setGood] = React.useState(false)
  const [revealedSlots, setRevealedSlots] = React.useState<number>(NUM_SLOTS)
  const [wager, setWager] = useWagerInput()
  const [combination, setCombination] = React.useState(
    Array.from({ length: NUM_SLOTS }).map(() => SLOT_ITEMS[0]),
  )
  const [winningPaylines, setWinningPaylines] = React.useState<{ payline: number[], symbol: SlotItem }[]>([])
  const [winningSymbol, setWinningSymbol] = React.useState<SlotItem | null>(null)
  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    reveal: SOUND_REVEAL,
    revealLegendary: SOUND_REVEAL_LEGENDARY,
    spin: SOUND_SPIN,
    play: SOUND_PLAY,
  })
  const bet = React.useMemo(
    () => {
      // Cap maxPayout to reasonable limit matching game design (max 7x multiplier)
      // Using pool.maxPayout directly can create unrealistic bet arrays with 1000x+ multipliers
      const cappedMaxPayout = Math.min(pool.maxPayout, wager * 7)
      return generateBetArray(cappedMaxPayout, wager)
    },
    [pool.maxPayout, wager],
  )
  const timeout = useRef<any>()

  const isValid = bet.some((x: number) => x > 1)

  useEffect(
    () => {
      // Clear timeout when user leaves
      return () => {
        timeout.current && clearTimeout(timeout.current)
      }
    },
    [],
  )

  const revealReel = (combination: SlotItem[], reel = 0) => {
    sounds.play('reveal', { playbackRate: 1.1 })

    // Reveal entire reel (column) at once
    const revealedSlotCount = (reel + 1) * NUM_ROWS
    setRevealedSlots(revealedSlotCount)

    // Check for winning paylines after each reel reveal
    const currentGrid = combination.slice(0, revealedSlotCount).concat(
      Array.from({ length: NUM_SLOTS - revealedSlotCount }).map(() => SLOT_ITEMS[0])
    )
    const winningLines = getWinningPaylines(currentGrid)
    
    // Check if current reel has any legendary wins
    for (let row = 0; row < NUM_ROWS; row++) {
      const slotIndex = reel * NUM_ROWS + row
      if (slotIndex < combination.length && combination[slotIndex].multiplier >= LEGENDARY_THRESHOLD) {
        if (winningLines.some(line => line.payline.includes(slotIndex))) {
          sounds.play('revealLegendary')
          break
        }
      }
    }

    if (reel < NUM_REELS - 1) {
      // Reveal next reel
      timeout.current = setTimeout(
        () => revealReel(combination, reel + 1),
        REVEAL_SLOT_DELAY,
      )
    } else if (reel === NUM_REELS - 1) {
      // Show final results
      sounds.sounds.spin.player.stop()
      const finalWinningLines = getWinningPaylines(combination)
      setWinningPaylines(finalWinningLines)
      
      timeout.current = setTimeout(() => {
        setSpinning(false)
        if (finalWinningLines.length > 0) {
          setGood(true)
          setWinningSymbol(finalWinningLines[0].symbol)
          sounds.play('win')
        } else {
          setGood(false)
          setWinningSymbol(null)
          sounds.play('lose')
        }
      }, FINAL_DELAY)
    }
  }

  const play = async () => {
    // CRITICAL SECURITY: Prevent zero wager gameplay
    if (wager <= 0) {
      console.error('❌ BLOCKED: Cannot play with zero wager');
      return;
    }
    
    setSpinning(true)
    setResult(undefined)

    await game.play({
      wager,
      bet: [...bet],
    })

    sounds.play('play')

    setRevealedSlots(0)
    setGood(false)
    setWinningPaylines([])
    setWinningSymbol(null)

    const startTime = Date.now()

    sounds.play('spin', { playbackRate: .5 })

const result = await game.result()

    // Make sure we wait a minimum time of SPIN_DELAY before slots are revealed:
    const resultDelay = Date.now() - startTime
    const revealDelay = Math.max(0, SPIN_DELAY - resultDelay)

    const seed = `${result.resultIndex}:${result.multiplier}:${result.payout}`
    const combination = getSlotCombination(
      NUM_SLOTS,
      result.multiplier,
      [...bet],
      seed,
    )

    setCombination(combination)

    setResult(result)

    timeout.current = setTimeout(() => revealReel(combination), revealDelay)
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <StyledSlotsBackground>
          {/* Enhanced background for Slots game */}
          <div className="slots-bg-elements" />
          <div className="casino-bg-elements" />
          <div className="decorative-overlay" />
          
          <StyledSlots>
            <GameScreenFrame 
              {...(useGameMeta('slots') && { title: useGameMeta('slots')!.name, description: useGameMeta('slots')!.description })}
            >
              {good && <EffectTest src={winningSymbol?.image || combination[0].image} />}
              <GambaUi.Responsive>
                <div className="slots-content">
                  <div className={'slots'}>
                    <div className="winning-line-display">
                      <ItemPreview 
                        betArray={[...bet]} 
                        winningMultiplier={winningSymbol?.multiplier}
                        isWinning={good}
                      />
                    </div>
                    <div className="slots-reels">
                      {/* Left Arrow */}
                      <div className="winning-line-arrow winning-line-arrow-left">
                        <div className="arrow-icon">▶</div>
                      </div>
                      
                      {Array.from({ length: NUM_REELS }).map((_, reelIndex) => {
                        const reelItems = Array.from({ length: NUM_ROWS }).map((_, rowIndex) => {
                          const slotIndex = reelIndex * NUM_ROWS + rowIndex
                          return combination[slotIndex]
                        })
                        
                        const reelGoodSlots = Array.from({ length: NUM_ROWS }).map((_, rowIndex) => {
                          const slotIndex = reelIndex * NUM_ROWS + rowIndex
                          return good && winningPaylines.some(line => line.payline.includes(slotIndex))
                        })
                        
                        const reelRevealed = revealedSlots > reelIndex * NUM_ROWS
                        
                        return (
                          <Reel
                            key={reelIndex}
                            reelIndex={reelIndex}
                            revealed={reelRevealed}
                            good={reelGoodSlots}
                            items={reelItems}
                            isSpinning={spinning && !reelRevealed}
                          />
                        )
                      })}
                      
                      {/* Right Arrow */}
                      <div className="winning-line-arrow winning-line-arrow-right">
                        <div className="arrow-icon">◀</div>
                      </div>
                    </div>
                  </div>
                </div>
              </GambaUi.Responsive>
            </GameScreenFrame>
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
        
        <DesktopControls>
          <EnhancedWagerInput value={wager} onChange={setWager} />
          <EnhancedPlayButton disabled={!isValid} onClick={play}>
            Spin
          </EnhancedPlayButton>
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}
