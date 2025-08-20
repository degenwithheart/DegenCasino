import { GambaUi, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import {
  EnhancedWagerInput,
  EnhancedButton,
  EnhancedPlayButton,
  MobileControls,
  OptionSelector,
  DesktopControls,
} from '../../components'
import GameScreenFrame from '../../components/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'
import { VAULT_CRACK_CONFIG } from './constants'
import { motion, AnimatePresence } from 'framer-motion'

const SIDES = VAULT_CRACK_CONFIG
type Side = keyof typeof SIDES

function VaultDoor({ cracking, win, fail }: { cracking: boolean, win: boolean, fail: boolean }) {
  const vaultState = win ? 'open' : fail ? 'locked' : 'idle'

  return (
    <div className="relative flex items-center justify-center h-64 w-full">
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1a1a1f] to-[#2d2d33] shadow-inner border-8 border-gray-800"
        animate={{
          scale: cracking ? 1.05 : 1,
          rotate: cracking ? 10 : 0,
          boxShadow: cracking
            ? '0px 0px 25px rgba(255,255,255,0.2)'
            : '0px 0px 5px rgba(255,255,255,0.05)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />

      <motion.svg
        width="220"
        height="220"
        viewBox="0 0 220 220"
        animate={
          vaultState === 'open'
            ? { rotate: 90 }
            : vaultState === 'locked'
            ? { rotate: -10 }
            : { rotate: 0 }
        }
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        className="z-10"
      >
        <defs>
          <radialGradient id="vaultMetal" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#666" />
            <stop offset="100%" stopColor="#222" />
          </radialGradient>
        </defs>

        {/* Outer ring */}
        <circle cx="110" cy="110" r="100" fill="#23232a" stroke="#aaa" strokeWidth="10" />
        {/* Inner gradient door */}
        <circle cx="110" cy="110" r="80" fill="url(#vaultMetal)" stroke="#eee" strokeWidth="5" />

        {/* Bolts */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * 2 * Math.PI
          const x = 110 + 90 * Math.cos(angle)
          const y = 110 + 90 * Math.sin(angle)
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="5"
              fill="#bbb"
              stroke="#888"
              strokeWidth="2"
            />
          )
        })}

        {/* Handle */}
        <motion.g
          animate={cracking ? { rotate: 120 } : { rotate: 0 }}
          style={{ transformOrigin: '110px 110px' }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <circle cx="110" cy="110" r="22" fill="#bbb" stroke="#888" strokeWidth="3" />
          {Array.from({ length: 5 }).map((_, i) => {
            const angle = (i / 5) * 2 * Math.PI
            const x2 = 110 + 32 * Math.cos(angle)
            const y2 = 110 + 32 * Math.sin(angle)
            return (
              <line
                key={i}
                x1={110}
                y1={110}
                x2={x2}
                y2={y2}
                stroke="#888"
                strokeWidth="5"
              />
            )
          })}
        </motion.g>

        {/* Status light */}
        <motion.circle
          cx="110"
          cy="110"
          r="14"
          fill={win ? '#42ff78' : fail ? '#f87171' : '#888'}
          stroke="#fff"
          strokeWidth="3"
          animate={win ? { scale: 1.4 } : fail ? { scale: 0.8 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />

        {/* Keyhole */}
        <ellipse cx="110" cy="120" rx="3" ry="7" fill="#111" />
        <rect x="107" y="128" width="6" height="12" rx="2" fill="#111" />
      </motion.svg>
    </div>
  )
}

function VaultCrack() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const [cracking, setCracking] = React.useState(false)
  const [win, setWin] = React.useState(false)
  const [fail, setFail] = React.useState(false)
  const [resultIndex, setResultIndex] = React.useState<number | null>(null)
  const [side, setSide] = React.useState<Side>('crack')
  const [wager, setWager] = useWagerInput()

  const play = async () => {
    try {
      setWin(false)
      setFail(false)
      setCracking(true)

      // 🔊 Optional: Insert sound effect hooks here
      // playSound('vault-spin')

      await game.play({
        bet: [...(SIDES[side] as number[])],
        wager,
        metadata: [side],
      })

      const result = await game.result()
      setResultIndex(result.resultIndex)

      if (result.payout > 0) {
        // playSound('vault-open')
        setWin(true)
      } else {
        // playSound('alarm')
        setFail(true)
      }
    } finally {
      setCracking(false)
    }
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <GameScreenFrame
          {...(useGameMeta('vaultcrack') && {
            title: useGameMeta('vaultcrack')!.name,
            description: useGameMeta('vaultcrack')!.description,
          })}
        >
          <div className="flex flex-col items-center justify-center min-h-[320px]">
            <VaultDoor cracking={cracking} win={win} fail={fail} />

            <AnimatePresence>
              {cracking && (
                <motion.div
                  key="cracking"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-lg text-blue-400 mt-3 font-mono"
                >
                  🔓 Hacking sequence initiated...
                </motion.div>
              )}
              {win && !cracking && (
                <motion.div
                  key="win"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-xl text-green-500 font-bold mt-3"
                >
                  ✅ Vault cracked! Loot secured.
                </motion.div>
              )}
              {fail && !cracking && (
                <motion.div
                  key="fail"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-xl text-red-500 font-bold mt-3"
                >
                  🚨 Access denied. System lockdown!
                </motion.div>
              )}
              {!cracking && !win && !fail && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-gray-400 mt-3 italic"
                >
                  Ready to attempt entry?
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
          playDisabled={gamba.isPlaying || cracking}
          playText="Crack Vault"
        >
          <OptionSelector
            label="Action"
            options={[
              { value: 'crack', label: 'Crack' },
              { value: 'fail', label: 'Fail' },
            ]}
            selected={side}
            onSelect={setSide}
            disabled={gamba.isPlaying || cracking}
          />
        </MobileControls>

        <DesktopControls>
          <EnhancedWagerInput value={wager} onChange={setWager} />
          <EnhancedButton
            disabled={gamba.isPlaying || cracking}
            onClick={() => setSide(side === 'crack' ? 'fail' : 'crack')}
          >
            {side === 'crack' ? 'Crack' : 'Fail'}
          </EnhancedButton>
          <EnhancedPlayButton onClick={play} disabled={gamba.isPlaying || cracking}>
            Crack Vault
          </EnhancedPlayButton>
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}

export default VaultCrack
