import React, { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'

interface Props {
  colors: [string, string, string?]
  intensity?: number
}

export const CasinoAmbientFX: React.FC<Props> = ({ colors, intensity = 1 }) => {
  const controls = useAnimation()
  useEffect(() => {
    controls.start({
      backgroundPosition: ['0% 0%', '200% 200%'],
      transition: { duration: 40 / intensity, repeat: Infinity, ease: 'linear' },
    })
  }, [controls, intensity])

  return (
    <div className="pointer-events-none absolute inset-0 rounded-xl overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-40"
        animate={controls}
        style={{
          backgroundImage: `radial-gradient(at 20% 30%, ${colors[0]}33, transparent 60%),
            radial-gradient(at 80% 70%, ${colors[1]}33, transparent 65%),
            radial-gradient(at 50% 50%, ${colors[2] ?? colors[0]}22, transparent 70%)`,
          backgroundSize: '300% 300%',
          mixBlendMode: 'screen',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(transparent 95%, rgba(255,255,255,0.15) 96%),
            linear-gradient(90deg, transparent 95%, rgba(255,255,255,0.15) 96%)`,
          backgroundSize: '42px 42px',
        }}
      />
      <motion.div
        className="absolute -inset-x-10 h-1/3 -top-1/3 bg-gradient-to-b from-white/10 via-white/5 to-transparent"
        animate={{ y: ['-60%', '140%'] }}
        transition={{ duration: 12 / intensity, repeat: Infinity, ease: 'easeInOut' }}
      />
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            filter: 'drop-shadow(0 0 6px white)',
            opacity: 0,
          }}
          animate={{ opacity: [0, 1, 0], scale: [0.2, 1.05, 0.2] }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            repeatDelay: 2 + Math.random() * 4,
            delay: i * 0.3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
