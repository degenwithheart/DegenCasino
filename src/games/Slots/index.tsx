import { GameResult } from 'gamba-core-v2'
import { EffectTest, GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import React, { useEffect, useRef } from 'react'
import { EnhancedWagerInput, EnhancedPlayButton, MobileControls, DesktopControls } from '../../components'
import GameScreenFrame from '../../components/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'
import { ItemPreview } from './ItemPreview'
import { Slot } from './Slot'
import { StyledSlots } from './Slots.styles'
import { StyledSlotsBackground } from './SlotsBackground.enhanced.styles'
import {
  FINAL_DELAY,
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
  // Message sets
  const spinningMessages = [
    '✨ Spinning the Symphony ✨',
    '🎭 Dance of Fortune 🎭',
    '💫 Poetry in Motion 💫',
  ]
  const idleMessages = [
    '🎪 SPIN THE SYMPHONY! 🎪',
    '❤️ FEELING THE ROMANCE? ❤️',
    '🌹 ALIGN THE MEMORIES 🌹',
  ]
  const goodMessages = [
    '🎉 JACKPOT! You aligned the stars! 🎉',
    '🌈 Unbelievable! All matched! 🌈',
    '💎 Legendary Win! Fortune smiles! 💎',
    '🔥 You hit the big one! 🔥',
    '🍀 Lucky streak! Congratulations! 🍀',
  ]
  const badMessages = [
    '😢 Not this time. Try again! 😢',
    '💔 The reels didn’t align. 💔',
    '🕳️ No luck, spin again! 🕳️',
    '🙈 Missed it! Maybe next spin. 🙈',
    '🌀 The dance continues... 🌀',
  ]
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
    setSpinning(true)
    setResult(undefined)

    await game.play({
      wager,
      bet: [...bet],
    })

    sounds.play('play')

    setRevealedSlots(0)
    setGood(false)

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

    timeout.current = setTimeout(() => revealSlot(combination), revealDelay)
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
              hideProvablyFairBadge={true}
            >
              {good && <EffectTest src={combination[0].image} />}
              <GambaUi.Responsive>
                <div className="slots-content">
                  <ItemPreview betArray={[...bet]} />
                  <div className={'slots'}>
                    {combination.map((slot, i) => (
                      <Slot
                        key={i}
                        index={i}
                        revealed={revealedSlots > i}
                        item={slot}
                        good={good}
                      />
                    ))}
                  </div>
                  <div className="result" data-good={good}>
                    {spinning ? (
                      <Messages messages={spinningMessages} />
                    ) : result ? (
                      <>
                        💰 Payout: <TokenValue mint={result.token} amount={result.payout} />
                        <Messages messages={result.multiplier > 0 ? goodMessages : badMessages} />
                      </>
                    ) : (
                      <Messages messages={idleMessages} />
                    )}
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
