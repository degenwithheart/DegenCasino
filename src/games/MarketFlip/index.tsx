import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { EnhancedWagerInput, EnhancedButton, EnhancedPlayButton, MobileControls, OptionSelector, DesktopControls } from '../../components'
import GameScreenFrame from '../../components/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'
import { MARKET_FLIP_CONFIG } from './constants'

const SIDES = MARKET_FLIP_CONFIG

type Side = keyof typeof SIDES


import { motion, AnimatePresence } from 'framer-motion'

function MarketFlipIcon({ flipping, win, fail }: { flipping: boolean, win: boolean, fail: boolean }) {
  // Animated SVG: coin with up/down arrows, color feedback
  return (
    <div className="flex items-center justify-center h-64">
      <motion.svg width="180" height="180" viewBox="0 0 180 180">
        {/* Coin */}
        <motion.circle
          cx="90" cy="90" r="70"
          fill="#23232a"
          stroke="#aaa"
          strokeWidth="8"
          animate={flipping ? { scale: 1.1 } : { scale: 1 }}
        />
        {/* Up arrow (bull) */}
        <motion.polygon
          points="90,40 110,80 70,80"
          fill={win ? '#42ff78' : '#888'}
          animate={flipping ? { y: -10 } : { y: 0 }}
        />
        {/* Down arrow (bear) */}
        <motion.polygon
          points="90,140 110,100 70,100"
          fill={fail ? '#f87171' : '#888'}
          animate={flipping ? { y: 10 } : { y: 0 }}
        />
      </motion.svg>
    </div>
  )
}

function MarketFlip() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const [flipping, setFlipping] = React.useState(false)
  const [win, setWin] = React.useState(false)
  const [fail, setFail] = React.useState(false)
  const [resultIndex, setResultIndex] = React.useState<number|null>(null)
  const [side, setSide] = React.useState<Side>('bull')
  const [wager, setWager] = useWagerInput()

  const play = async () => {
    try {
      setWin(false)
      setFail(false)
      setFlipping(true)
      await game.play({
        bet: [...(SIDES[side] as number[])],
        wager,
        metadata: [side],
      })
      const result = await game.result()
      setResultIndex(result.resultIndex)
      if (result.payout > 0) {
        setWin(true)
      } else {
        setFail(true)
      }
    } finally {
      setFlipping(false)
    }
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <GameScreenFrame {...(useGameMeta('marketflip') && { title: useGameMeta('marketflip')!.name, description: useGameMeta('marketflip')!.description })}>
          <div className="flex flex-col items-center justify-center min-h-[320px]">
            <MarketFlipIcon flipping={flipping} win={win} fail={fail} />
            <AnimatePresence>
              {flipping && (
                <motion.div
                  key="flipping"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-lg text-gray-300 mt-2"
                >
                  Market event in progress...
                </motion.div>
              )}
              {win && !flipping && (
                <motion.div
                  key="win"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-xl text-green-400 font-bold mt-2"
                >
                  🟢 Bull run! You win!
                </motion.div>
              )}
              {fail && !flipping && (
                <motion.div
                  key="fail"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-xl text-red-400 font-bold mt-2"
                >
                  🔴 Bear market! You lose.
                </motion.div>
              )}
              {!flipping && !win && !fail && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-gray-400 mt-2"
                >
                  Will the market go up or down?
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GameScreenFrame>
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <MobileControls
          wager={wager}
          setWager={setWager}
          onPlay={play}
          playDisabled={gamba.isPlaying || flipping}
          playText="Flip Market"
        >
          <OptionSelector
            label="Direction"
            options={[
              { value: 'bull', label: 'Bull' },
              { value: 'bear', label: 'Bear' }
            ]}
            selected={side}
            onSelect={setSide}
            disabled={gamba.isPlaying || flipping}
          />
        </MobileControls>
        <DesktopControls>
          <EnhancedWagerInput value={wager} onChange={setWager} />
          <EnhancedButton disabled={gamba.isPlaying || flipping} onClick={() => setSide(side === 'bull' ? 'bear' : 'bull')}>
            {side === 'bull' ? 'Bull' : 'Bear'}
          </EnhancedButton>
          <EnhancedPlayButton onClick={play} disabled={gamba.isPlaying || flipping}>Flip Market</EnhancedPlayButton>
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}

export default MarketFlip
