import React, { useEffect, useRef, useState } from 'react'
import { Engine, Render, World, Bodies, Body, Events } from 'matter-js'
import { makeDeterministicRng } from '../../fairness/deterministicRng'

interface RouletteWheelProps {
  start: boolean
  winningBet: number
  onSpinningEnd: () => void
  withAnimation?: boolean
}

const WHEEL_NUMBERS = Array.from({ length: 18 }, (_, i) => i + 1) // 1-18 as per game config
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18] // Red numbers from constants
const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17] // Black numbers from constants

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
  start,
  winningBet,
  onSpinningEnd,
  withAnimation = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Engine>()
  const renderRef = useRef<Render>()
  const wheelRef = useRef<Body>()
  const ballRef = useRef<Body>()
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<number | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Create engine
    const engine = Engine.create()
    engine.world.gravity.y = 0
    engineRef.current = engine

    // Create renderer
    const render = Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: 400,
        height: 400,
        wireframes: false,
        background: '#0a0a0a',
        showAngleIndicator: false,
        showVelocity: false,
      }
    })
    renderRef.current = render

    // Add after render event to draw numbers
    Events.on(render, 'afterRender', () => {
      if (render.context) {
        const ctx = render.context
        ctx.save()
        ctx.font = 'bold 16px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        segments.forEach((segment: any) => {
          if (segment.number) {
            ctx.fillStyle = segment.isRed ? '#ffffff' : segment.isBlack ? '#ffffff' : '#000000'
            ctx.fillText(
              segment.number.toString(),
              segment.labelX,
              segment.labelY
            )
          }
        })

        ctx.restore()
      }
    })

    // Create wheel
    const wheel = Bodies.circle(200, 200, 180, {
      isStatic: true,
      render: {
        fillStyle: '#1a1a1a',
        strokeStyle: '#333',
        lineWidth: 2
      }
    })
    wheelRef.current = wheel

    // Create number segments on the wheel
    const segments: any[] = []
    const segmentAngle = (2 * Math.PI) / WHEEL_NUMBERS.length

    for (let i = 0; i < WHEEL_NUMBERS.length; i++) {
      const angle = i * segmentAngle
      const number = WHEEL_NUMBERS[i]
      const isRed = RED_NUMBERS.includes(number)
      const isBlack = BLACK_NUMBERS.includes(number)

      // Create segment body
      const segment = Bodies.polygon(200, 200, 3, 170, {
        isStatic: true,
        angle: angle,
        render: {
          fillStyle: isRed ? '#ff0000' : isBlack ? '#000000' : '#ffffff',
          strokeStyle: '#333',
          lineWidth: 1
        }
      })
      segments.push(segment)

      // Add number label (we'll render this in the canvas manually)
      const labelX = 200 + Math.cos(angle + segmentAngle / 2) * 130
      const labelY = 200 + Math.sin(angle + segmentAngle / 2) * 130

      // Store label info for rendering
      ;(segment as any).number = number
      ;(segment as any).labelX = labelX
      ;(segment as any).labelY = labelY
      ;(segment as any).isRed = isRed
      ;(segment as any).isBlack = isBlack
    }

    // Create ball
    const ball = Bodies.circle(200, 200, 8, {
      restitution: 0.8,
      friction: 0.001,
      frictionAir: 0.001,
      render: {
        fillStyle: '#ffffff',
        strokeStyle: '#333',
        lineWidth: 1
      }
    })
    ballRef.current = ball

    // Add collision detection
    Events.on(engine, 'collisionStart', (event) => {
      const pairs = event.pairs
      pairs.forEach((pair) => {
        if ((pair.bodyA === ball && pair.bodyB === wheel) ||
            (pair.bodyA === wheel && pair.bodyB === ball)) {
          // Ball hit the wheel edge
        }
      })
    })

    // Add all bodies to world
    World.add(engine.world, [wheel, ball, ...segments])

    // Start the engine
    Engine.run(engine)
    Render.run(render)

    return () => {
      if (renderRef.current) {
        Render.stop(renderRef.current)
        renderRef.current.canvas.remove()
      }
      if (engineRef.current) {
        World.clear(engineRef.current.world, false)
        Engine.clear(engineRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (start && !isSpinning && wheelRef.current && ballRef.current) {
      setIsSpinning(true)
      setResult(null)

      // Reset ball position
      Body.setPosition(ballRef.current, { x: 200, y: 200 })
      Body.setVelocity(ballRef.current, { x: 0, y: 0 })

      // Calculate target angle for winning number
      const winningIndex = WHEEL_NUMBERS.indexOf(winningBet)
      const targetAngle = (winningIndex * (2 * Math.PI) / WHEEL_NUMBERS.length) + Math.PI / 2

      // Add some randomness to make it more realistic
      const rng = makeDeterministicRng(`roulette:${winningBet}:${Date.now()}`)
      const randomOffset = (rng() - 0.5) * 0.3 // Small random offset
      const finalAngle = targetAngle + randomOffset

      // Apply force to ball with some randomness
      const forceMagnitude = 0.015 + rng() * 0.005
      const force = {
        x: Math.cos(finalAngle) * forceMagnitude,
        y: Math.sin(finalAngle) * forceMagnitude
      }

      Body.applyForce(ballRef.current, ballRef.current.position, force)

      // Add some spin to the wheel for visual effect
      if (withAnimation) {
        Body.setAngularVelocity(wheelRef.current, (rng() - 0.5) * 0.2)
      }

      // Stop after some time and show result
      setTimeout(() => {
        setIsSpinning(false)
        setResult(winningBet)
        onSpinningEnd()
      }, 4000)
    }
  }, [start, winningBet, isSpinning, onSpinningEnd, withAnimation])

  return (
    <div style={{ position: 'relative', width: 400, height: 400 }}>
      <canvas
        ref={canvasRef}
        style={{
          border: '2px solid #333',
          borderRadius: '50%',
          background: '#0a0a0a'
        }}
      />
      {result !== null && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '48px',
          fontWeight: 'bold',
          color: RED_NUMBERS.includes(result) ? '#ff0000' : BLACK_NUMBERS.includes(result) ? '#ffffff' : '#ffffff',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          zIndex: 10
        }}>
          {result}
        </div>
      )}
    </div>
  )
}