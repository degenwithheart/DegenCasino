import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

interface GameScreenFrameProps {
  /** Optional text values kept only to deterministically seed gradient colors (no direct rendering here). */
  title?: string
  description?: string
  colors?: [string, string, string?]
  children: React.ReactNode
  /** Hide the "Provably Fair" badge for specific games that have positioning conflicts */
  hideProvablyFairBadge?: boolean
}

function hashHue(input: string) {
  let h = 0
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0
  }
  return h % 360
}

function buildGradient(description: string, fallback?: [string, string, string?]) {
  if (fallback) return fallback
  const hue = hashHue(description)
  const h2 = (hue + 45) % 360
  const h3 = (hue + 300) % 360
  return [
    `hsla(${hue},75%,55%,1)`,
    `hsla(${h2},85%,60%,1)`,
    `hsla(${h3},70%,50%,1)`,
  ] as [string, string, string]
}

export const GameScreenFrame: React.FC<GameScreenFrameProps> = ({ title, description = '', colors, children, hideProvablyFairBadge = false }) => {
  // We intentionally no longer render the title/description here; they moved to the Info modal (MetaControls).
  // Still use description/title text (fallback empty) solely to seed a consistent gradient per game.
  const seed = description || title || 'game'
  const gradient = useMemo(() => buildGradient(seed, colors), [seed, colors])

  return (
    <div className="relative w-full h-full group font-sans text-white/90">
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl p-[2px]"
        style={{ background: `linear-gradient(130deg, ${gradient[0]}, ${gradient[1]}, ${gradient[2] ?? gradient[0]})` }}
        initial={{ opacity: .4 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-[2px] rounded-[0.65rem] bg-[#0c0c11]" />
      </motion.div>

      {[0,1,2,3].map(i => (
        <motion.div
          key={i}
            className="pointer-events-none absolute w-20 h-20 rounded-full blur-2xl opacity-25"
            style={{
              background: gradient[i % gradient.length],
              top: i < 2 ? -30 : 'auto',
              bottom: i >= 2 ? -30 : 'auto',
              left: i % 2 === 0 ? -30 : 'auto',
              right: i % 2 === 1 ? -30 : 'auto',
            }}
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 10 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i * .75 }}
        />
      ))}

      {/* Decorative top-right badge retained; primary meta text removed (handled via Info modal) */}
      <motion.div
        className="absolute pointer-events-none hidden md:block text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm shadow-inner z-20"
        style={{ 
          top: '8px', 
          right: '8px',
          position: 'absolute'
        }}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: .6 }}
      >
        Provably Fair
      </motion.div>

      <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          style={{ background: `linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)` }}
          animate={{ y: ['-100%', '100%'] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative z-10 w-full h-full p-2 sm:p-4 flex flex-col">
        <div className="flex-1 relative rounded-lg overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}

export default GameScreenFrame
