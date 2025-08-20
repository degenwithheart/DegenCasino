import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { EnhancedWagerInput, EnhancedButton, EnhancedPlayButton, MobileControls, OptionSelector, DesktopControls } from '../../components'
import GameScreenFrame from '../../components/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'
import { BLOCK_STACK_CONFIG } from './constants'

const SIDES = BLOCK_STACK_CONFIG

type Side = keyof typeof SIDES


import { motion, AnimatePresence } from 'framer-motion'

function BlockStackIcon({ stacking, win, fail }: { stacking: boolean, win: boolean, fail: boolean }) {
  // Animated SVG: block stacking, block falls on fail
  return (
    <div className="flex items-center justify-center h-64">
      <motion.svg width="180" height="180" viewBox="0 0 180 180">
        {/* Base block */}
        <rect x="50" y="130" width="80" height="30" rx="6" fill="#444" stroke="#aaa" strokeWidth="4" />
        {/* Stacked block (animated) */}
        <motion.rect
          x="50"
          y={stacking ? 60 : win ? 90 : fail ? 160 : 90}
          width="80"
          height="30"
          rx="6"
          fill={win ? '#42ff78' : fail ? '#f87171' : '#888'}
          stroke="#eee"
          strokeWidth="3"
          animate={stacking ? { y: 90 } : {}}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        />
      </motion.svg>
    </div>
  )
}

function BlockStack() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const [stacking, setStacking] = React.useState(false)
  const [win, setWin] = React.useState(false)
  const [fail, setFail] = React.useState(false)
  const [resultIndex, setResultIndex] = React.useState<number|null>(null)
  const [side, setSide] = React.useState<Side>('stable')
  const [wager, setWager] = useWagerInput()

  const play = async () => {
    try {
      setWin(false)
      setFail(false)
      setStacking(true)
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
      setStacking(false)
    }
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <GameScreenFrame {...(useGameMeta('blockstack') && { title: useGameMeta('blockstack')!.name, description: useGameMeta('blockstack')!.description })}>
          <div className="flex flex-col items-center justify-center min-h-[320px]">
            <BlockStackIcon stacking={stacking} win={win} fail={fail} />
            <AnimatePresence>
              {stacking && (
                <motion.div
                  key="stacking"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-lg text-gray-300 mt-2"
                >
                  Stacking block...
                </motion.div>
              )}
              {win && !stacking && (
                <motion.div
                  key="win"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-xl text-green-400 font-bold mt-2"
                >
                  🟢 Block stable! You win!
                </motion.div>
              )}
              {fail && !stacking && (
                <motion.div
                  key="fail"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-xl text-red-400 font-bold mt-2"
                >
                  🔴 Block toppled! You lose.
                </motion.div>
              )}
              {!stacking && !win && !fail && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-gray-400 mt-2"
                >
                  Will your block stand or fall?
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
          playDisabled={gamba.isPlaying || stacking}
          playText="Stack Block"
        >
          <OptionSelector
            label="Outcome"
            options={[
              { value: 'stable', label: 'Stable' },
              { value: 'topple', label: 'Topple' }
            ]}
            selected={side}
            onSelect={setSide}
            disabled={gamba.isPlaying || stacking}
          />
        </MobileControls>
        <DesktopControls>
          <EnhancedWagerInput value={wager} onChange={setWager} />
          <EnhancedButton disabled={gamba.isPlaying || stacking} onClick={() => setSide(side === 'stable' ? 'topple' : 'stable')}>
            {side === 'stable' ? 'Stable' : 'Topple'}
          </EnhancedButton>
          <EnhancedPlayButton onClick={play} disabled={gamba.isPlaying || stacking}>Stack Block</EnhancedPlayButton>
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}

export default BlockStack
