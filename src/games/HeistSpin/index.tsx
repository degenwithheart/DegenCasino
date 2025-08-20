import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { EnhancedWagerInput, EnhancedButton, EnhancedPlayButton, MobileControls, OptionSelector, DesktopControls } from '../../components'
import GameScreenFrame from '../../components/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'
import { HEIST_SPIN_CONFIG } from './constants'

const SIDES = HEIST_SPIN_CONFIG

type Side = keyof typeof SIDES


import { motion, AnimatePresence } from 'framer-motion'

function HeistSpinIcon({ spinning, win, fail }: { spinning: boolean, win: boolean, fail: boolean }) {
  // Animated SVG: wheel with loot bag and police light
  return (
    <div className="flex items-center justify-center h-64">
      <motion.svg width="180" height="180" viewBox="0 0 180 180">
        {/* Wheel */}
        <motion.circle
          cx="90" cy="90" r="70"
          fill="#23232a"
          stroke="#aaa"
          strokeWidth="8"
          animate={spinning ? { rotate: 360 } : { rotate: 0 }}
          style={{ transformOrigin: '90px 90px' }}
          transition={{ repeat: spinning ? Infinity : 0, duration: 1, ease: 'linear' }}
        />
        {/* Loot bag (win) */}
        {win && (
          <g>
            <ellipse cx="90" cy="110" rx="18" ry="22" fill="#42ff78" stroke="#222" strokeWidth="3" />
            <rect x="80" y="90" width="20" height="12" rx="6" fill="#222" />
            <rect x="86" y="80" width="8" height="10" rx="3" fill="#222" />
          </g>
        )}
        {/* Police light (fail) */}
        {fail && (
          <g>
            <rect x="78" y="110" width="24" height="16" rx="6" fill="#f87171" stroke="#222" strokeWidth="3" />
            <rect x="86" y="104" width="8" height="8" rx="2" fill="#fff" />
          </g>
        )}
      </motion.svg>
    </div>
  )
}

function HeistSpin() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const [spinning, setSpinning] = React.useState(false)
  const [win, setWin] = React.useState(false)
  const [fail, setFail] = React.useState(false)
  const [resultIndex, setResultIndex] = React.useState<number|null>(null)
  const [side, setSide] = React.useState<Side>('escape')
  const [wager, setWager] = useWagerInput()

  const play = async () => {
    try {
      setWin(false)
      setFail(false)
      setSpinning(true)
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
      setSpinning(false)
    }
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <GameScreenFrame {...(useGameMeta('heistspin') && { title: useGameMeta('heistspin')!.name, description: useGameMeta('heistspin')!.description })}>
          <div className="flex flex-col items-center justify-center min-h-[320px]">
            <HeistSpinIcon spinning={spinning} win={win} fail={fail} />
            <AnimatePresence>
              {spinning && (
                <motion.div
                  key="spinning"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-lg text-gray-300 mt-2"
                >
                  Spinning the wheel...
                </motion.div>
              )}
              {win && !spinning && (
                <motion.div
                  key="win"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-xl text-green-400 font-bold mt-2"
                >
                  🟢 You escaped with the loot!
                </motion.div>
              )}
              {fail && !spinning && (
                <motion.div
                  key="fail"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-xl text-red-400 font-bold mt-2"
                >
                  🔴 Caught by security!
                </motion.div>
              )}
              {!spinning && !win && !fail && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-gray-400 mt-2"
                >
                  Will you escape or get caught?
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
          playDisabled={gamba.isPlaying || spinning}
          playText="Spin Heist"
        >
          <OptionSelector
            label="Outcome"
            options={[
              { value: 'escape', label: 'Escape' },
              { value: 'caught', label: 'Caught' }
            ]}
            selected={side}
            onSelect={setSide}
            disabled={gamba.isPlaying || spinning}
          />
        </MobileControls>
        <DesktopControls>
          <EnhancedWagerInput value={wager} onChange={setWager} />
          <EnhancedButton disabled={gamba.isPlaying || spinning} onClick={() => setSide(side === 'escape' ? 'caught' : 'escape')}>
            {side === 'escape' ? 'Escape' : 'Caught'}
          </EnhancedButton>
          <EnhancedPlayButton onClick={play} disabled={gamba.isPlaying || spinning}>Spin Heist</EnhancedPlayButton>
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}

export default HeistSpin
