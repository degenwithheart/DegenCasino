import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

interface GameScreenFrameProps {
  /** Game title for gradient seeding */
  title?: string
  /** Game description for gradient seeding */
  description?: string
  /** Custom gradient colors [primary, secondary, tertiary?] */
  colors?: [string, string, string?]
  /** Game state for visual indicators */
  gameState?: 'loading' | 'playing' | 'finished' | 'error'
  /** Enable visual effects (screen shake, win flashes) */
  enableEffects?: boolean
  /** Disable animations for performance */
  reducedMotion?: boolean
  children: React.ReactNode
}

// Deterministic color generation from text
function hashHue(input: string) {
  let h = 0
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0
  }
  return h % 360
}

function buildGradient(seed: string, fallback?: [string, string, string?]) {
  if (fallback) return fallback
  const hue = hashHue(seed)
  const h2 = (hue + 45) % 360
  const h3 = (hue + 300) % 360
  return [
    `hsla(${hue},75%,55%,1)`,
    `hsla(${h2},85%,60%,1)`,
    `hsla(${h3},70%,50%,1)`,
  ] as [string, string, string]
}

export default function GameScreenFrame({ 
  title, 
  description, 
  colors, 
  gameState,
  enableEffects = true,
  reducedMotion = false,
  children
}: GameScreenFrameProps) {
  // Generate consistent gradient from game metadata
  const seed = description || title || 'game'
  const gradient = useMemo(() => buildGradient(seed, colors), [seed, colors])
  
  // State-based styling
  const stateStyles = useMemo(() => {
    switch (gameState) {
      case 'loading':
        return { opacity: 0.7, filter: 'blur(1px)' }
      case 'error':
        return { borderColor: '#ff4444' }
      case 'finished':
        return { borderColor: '#44ff44' }
      default:
        return {}
    }
  }, [gameState])

  return (
    <div 
      className="relative w-full h-full group font-sans text-white/90"
      style={stateStyles}
      data-game-state={gameState}
    >
      {/* Animated gradient border - ENHANCED FOR VISIBILITY */}
      {!reducedMotion && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-xl p-[4px]"
          style={{ 
            background: `linear-gradient(130deg, ${gradient[0]}, ${gradient[1]}, ${gradient[2] ?? gradient[0]})` 
          }}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute inset-[4px] rounded-[0.5rem] bg-[#0c0c11]" />
        </motion.div>
      )}

      {/* Static border for reduced motion - ENHANCED FOR VISIBILITY */}
      {reducedMotion && (
        <div
          className="pointer-events-none absolute inset-0 rounded-xl p-[4px]"
          style={{ 
            background: `linear-gradient(130deg, ${gradient[0]}, ${gradient[1]}, ${gradient[2] ?? gradient[0]})` 
          }}
        >
          <div className="absolute inset-[4px] rounded-[0.5rem] bg-[#0c0c11]" />
        </div>
      )}

      {/* Corner glow effects - ENHANCED FOR VISIBILITY */}
      {enableEffects && !reducedMotion && [0,1,2,3].map(i => (
        <motion.div
          key={i}
          className="pointer-events-none absolute w-32 h-32 rounded-full blur-2xl opacity-60"
          style={{
            background: gradient[i % gradient.length],
            top: i < 2 ? -40 : 'auto',
            bottom: i >= 2 ? -40 : 'auto',
            left: i % 2 === 0 ? -40 : 'auto',
            right: i % 2 === 1 ? -40 : 'auto',
          }}
          animate={{ scale: [1, 1.6, 1] }}
          transition={{ 
            duration: 6 + i * 1, 
            repeat: Infinity, 
            ease: 'easeInOut', 
            delay: i * 0.5 
          }}
        />
      ))}

      {/* Scanning light effect - ENHANCED FOR VISIBILITY */}
      {enableEffects && !reducedMotion && (
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            style={{ 
              background: `linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)` 
            }}
            animate={{ y: ['-100%', '100%'] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      )}

      {/* Responsive content container */}
      <div className="relative z-10 w-full h-full p-2 sm:p-4 flex flex-col">
        <div className="flex-1 relative rounded-lg overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}
