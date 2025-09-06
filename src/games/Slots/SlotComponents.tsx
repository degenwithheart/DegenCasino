import React, { useEffect, useRef, useState } from 'react'
import { makeDeterministicRng } from '../../fairness/deterministicRng'
import { motion } from 'framer-motion'
import { Engine, Render, World, Bodies, Body } from 'matter-js'

interface SlotReelProps {
  symbols: string[]
  isSpinning: boolean
  finalSymbol?: string
  onSpinComplete: () => void
  delay?: number
}

export const SlotReel: React.FC<SlotReelProps> = ({
  symbols,
  isSpinning,
  finalSymbol,
  onSpinComplete,
  delay = 0
}) => {
  const [currentSymbol, setCurrentSymbol] = useState(symbols[0])

  useEffect(() => {
    if (isSpinning) {
      const baseSeed = `slotreel:${delay}:${symbols.join(',')}`
      let tick = 0
      const interval = setInterval(() => {
        const rng = makeDeterministicRng(baseSeed + ':' + tick++)
        setCurrentSymbol(symbols[Math.floor(rng() * symbols.length)])
      }, 100)

      setTimeout(() => {
        clearInterval(interval)
        if (finalSymbol) {
          setCurrentSymbol(finalSymbol)
        }
        onSpinComplete()
      }, 2500 + delay)

      return () => clearInterval(interval)
    }
  }, [isSpinning, symbols, finalSymbol, onSpinComplete, delay])

  return (
    <motion.div
      className="relative w-20 h-28 md:w-24 md:h-32 bg-gradient-to-br from-purple-800 to-blue-900 rounded-lg border-2 border-yellow-400 flex items-center justify-center overflow-hidden"
      whileHover={{ scale: 1.05 }}
      animate={isSpinning ? {
        rotateY: [0, 360],
        scale: [1, 1.1, 1]
      } : {}}
      transition={{
        duration: 0.5,
        repeat: isSpinning ? Infinity : 0,
        ease: "easeInOut"
      }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-yellow-400 opacity-20"
        animate={isSpinning ? {
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        } : {}}
        transition={{
          duration: 0.3,
          repeat: isSpinning ? Infinity : 0
        }}
      />
      
      <motion.div
        key={currentSymbol}
        className="text-3xl md:text-4xl z-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.1 }}
      >
        {currentSymbol}
      </motion.div>
      
      <motion.div
        className="absolute inset-0 rounded-lg bg-yellow-400 opacity-0 blur-md"
        animate={isSpinning ? {
          opacity: [0, 0.3, 0],
          scale: [1, 1.2, 1]
        } : {}}
        transition={{
          duration: 0.5,
          repeat: isSpinning ? Infinity : 0
        }}
      />
    </motion.div>
  )
}

interface CascadingCoinsProps {
  isActive: boolean
  winAmount?: number
}

export const CascadingCoins: React.FC<CascadingCoinsProps> = ({ isActive, winAmount }) => {
  const sceneRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<Engine>()
  const renderRef = useRef<Render>()
  const [coins, setCoins] = useState<Body[]>([])

  useEffect(() => {
    if (!isActive || !sceneRef.current) return

    const engine = Engine.create()
    engineRef.current = engine
    engine.world.gravity.y = 0.8

    const render = Render.create({
      element: sceneRef.current,
      engine,
      options: {
        width: 400,
        height: 300,
        wireframes: false,
        background: 'transparent'
      }
    })
    renderRef.current = render

    const ground = Bodies.rectangle(200, 280, 400, 20, { isStatic: true })
    World.add(engine.world, ground)

    const newCoins: Body[] = []
    const seed = `coins:${winAmount ?? 0}:${Date.now() - (Date.now()%1000)}`
    const rng = makeDeterministicRng(seed)
    for (let i = 0; i < 15; i++) {
      const coin = Bodies.circle(rng() * 350 + 25, -50 - (i * 30), 15, {
        restitution: 0.7,
        render: {
          fillStyle: '#FFD700'
        }
      })
      newCoins.push(coin)
      World.add(engine.world, coin)
    }
    setCoins(newCoins)

    Engine.run(engine)
    Render.run(render)

    const timeout = setTimeout(() => {
      if (renderRef.current) {
        Render.stop(renderRef.current)
        renderRef.current.canvas.remove()
      }
      if (engineRef.current) {
        Engine.clear(engineRef.current)
      }
    }, 5000)

    return () => {
      clearTimeout(timeout)
      if (renderRef.current) {
        Render.stop(renderRef.current)
        renderRef.current.canvas.remove()
      }
      if (engineRef.current) {
        Engine.clear(engineRef.current)
      }
    }
  }, [isActive])

  if (!isActive) return null

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div ref={sceneRef} className="absolute inset-0" />
      
      {winAmount && (
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-yellow-400 z-60"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, ease: "backOut" }}
        >
          💰 +{winAmount}
        </motion.div>
      )}
    </motion.div>
  )
}

interface SlotMachineProps {
  symbols: string[]
  isSpinning: boolean
  results?: string[]
  onAllSpinsComplete: () => void
  className?: string
}

export const SlotMachine: React.FC<SlotMachineProps> = ({ 
  symbols, 
  isSpinning, 
  results = [], 
  onAllSpinsComplete,
  className = '' 
}) => {
  const [completedReels, setCompletedReels] = useState(0)

  const handleReelComplete = () => {
    setCompletedReels(prev => {
      const newCount = prev + 1
      if (newCount === 3) {
        onAllSpinsComplete()
        return 0 // Reset for next spin
      }
      return newCount
    })
  }

  useEffect(() => {
    if (!isSpinning) {
      setCompletedReels(0)
    }
  }, [isSpinning])

  return (
    <motion.div
      className={`relative bg-gradient-to-br from-red-900 via-purple-900 to-blue-900 p-4 md:p-6 rounded-2xl border-4 border-yellow-500 shadow-2xl ${className}`}
      animate={isSpinning ? {
        boxShadow: [
          '0 0 20px #FFD700',
          '0 0 40px #FF6B35',
          '0 0 20px #FFD700'
        ]
      } : {}}
      transition={{
        duration: 0.5,
        repeat: isSpinning ? Infinity : 0
      }}
    >
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
      <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
      
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 opacity-10"
        animate={isSpinning ? {
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.02, 1]
        } : {}}
        transition={{
          duration: 1,
          repeat: isSpinning ? Infinity : 0
        }}
      />
      
      <div className="flex gap-4 items-center justify-center">
        {[0, 1, 2].map((index) => (
          <SlotReel
            key={index}
            symbols={symbols}
            isSpinning={isSpinning}
            finalSymbol={results[index]}
            onSpinComplete={handleReelComplete}
            delay={index * 500}
          />
        ))}
      </div>
    </motion.div>
  )
}

