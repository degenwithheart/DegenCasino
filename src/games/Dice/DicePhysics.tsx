import React, { useEffect, useRef } from 'react'
import { Engine, Render, World, Bodies, Body, Events } from 'matter-js'

interface DicePhysicsProps {
  isRolling: boolean
  onResult: (result: number) => void
  rollUnderIndex: number
}

export const DicePhysics: React.FC<DicePhysicsProps> = ({ 
  isRolling, 
  onResult, 
  rollUnderIndex 
}) => {
  const sceneRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<Engine>()
  const renderRef = useRef<Render>()
  const diceRef = useRef<Body>()

  useEffect(() => {
    if (!sceneRef.current) return

    // Create engine
    const engine = Engine.create()
    engine.world.gravity.y = 0.8

    // Create renderer
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 400,
        height: 300,
        wireframes: false,
        background: 'transparent',
        showAngleIndicator: false,
        showVelocity: false,
      }
    })

    // Create boundaries
    const ground = Bodies.rectangle(200, 290, 400, 20, { 
      isStatic: true,
      render: { fillStyle: 'transparent' }
    })
    const leftWall = Bodies.rectangle(10, 150, 20, 300, { 
      isStatic: true,
      render: { fillStyle: 'transparent' }
    })
    const rightWall = Bodies.rectangle(390, 150, 20, 300, { 
      isStatic: true,
      render: { fillStyle: 'transparent' }
    })

    // Create dice
    const dice = Bodies.rectangle(200, 50, 40, 40, {
      render: {
        fillStyle: '#ffffff',
        strokeStyle: '#ffd700',
        lineWidth: 2
      },
      frictionAir: 0.01,
      restitution: 0.6
    })

    // Add all bodies to world
    World.add(engine.world, [ground, leftWall, rightWall, dice])

    // Store references
    engineRef.current = engine
    renderRef.current = render
    diceRef.current = dice

    // Run the engine
    Engine.run(engine)
    Render.run(render)

    return () => {
      if (renderRef.current) {
        Render.stop(renderRef.current)
      }
      if (engineRef.current) {
        Engine.clear(engineRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isRolling && diceRef.current) {
      // Apply random force to dice
      const force = {
        x: (Math.random() - 0.5) * 0.02,
        y: -0.05
      }
      Body.applyForce(diceRef.current, diceRef.current.position, force)
      Body.setAngularVelocity(diceRef.current, (Math.random() - 0.5) * 0.3)

      // Simulate result after animation
      setTimeout(() => {
        const result = Math.floor(Math.random() * 100) + 1
        onResult(result)
      }, 2000)
    }
  }, [isRolling, onResult])

  return (
    <div 
      ref={sceneRef} 
      className="absolute inset-0 pointer-events-none opacity-30"
    />
  )
}
