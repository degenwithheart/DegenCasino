// src/components/LobbyBackground.tsx
import React, { useEffect, useRef } from 'react'
import { makeDeterministicRng } from '../../../fairness/deterministicRng'
import Matter, { Bodies, Composite, Body } from 'matter-js'
import { PhysicsWorld } from '../engine/PhysicsWorld'
import { GambaUi } from 'gamba-react-ui-v2'
import styled, { keyframes } from 'styled-components'
import {
  WIDTH,
  HEIGHT,
  BALL_RADIUS,
  PEG_RADIUS,
  BUCKET_HEIGHT,
  BUCKET_DEFS,
} from '../engine/constants'

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2);
  }
`

const CanvasContainer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(135deg, rgba(24, 24, 24, 0.95) 0%, rgba(40, 40, 40, 0.95) 100%);
  animation: ${glowPulse} 4s ease-in-out infinite;
`

const SPAWN_INTERVAL = 300
const SPAWN_BUCKET = 750 // ms grouping for deterministic lobby spawn seed
const BALL_COLORS = ['#ff9aa2','#ffb7b2','#ffdac1','#e2f0cb','#b5ead7','#c7ceea']

export default function LobbyBackground() {
  const worldRef      = useRef<PhysicsWorld>()
  const ballsRef      = useRef<Body[]>([])
  const lastSpawn     = useRef(0)
  const bucketHitsRef = useRef<Record<number, number>>({})

  useEffect(() => {
    const w = new PhysicsWorld()
    worldRef.current = w
    return () => w.cleanup()
  }, [])

  useEffect(() => {
    let raf: number
    const step = (time: number) => {
      const w = worldRef.current!
      // spawn a new ball
      if (time - lastSpawn.current > SPAWN_INTERVAL) {
        lastSpawn.current = time
        // Seed uses spawn interval bucket so multiple clients render same sequence
  const seed = `lobbyspawn:${Math.floor(time/ SPAWN_BUCKET)}`
        const rng = makeDeterministicRng(seed + ':' + (ballsRef.current.length))
        const x = WIDTH/2 + (rng()*200 - 100)
        const color = BALL_COLORS[Math.floor(rng()*BALL_COLORS.length)]
        const ball = Bodies.circle(x, -BALL_RADIUS, BALL_RADIUS, {
          restitution: 0.4,
          label: 'Ball',
          plugin: { color },
        })
        ballsRef.current.push(ball)
        Composite.add(w.world, ball)
      }
      // advance physics
      w.tick(16)
      // remove fallen balls
      ballsRef.current = ballsRef.current.filter(b => {
        if (b.position.y > HEIGHT + 80) {
          Composite.remove(w.world, b)
          return false
        }
        return true
      })
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <CanvasContainer>
      <GambaUi.Canvas
  render={({ ctx, size }: { ctx: any; size: any }) => {
          const w = worldRef.current
          if (!w) return

          const scale = Math.min(size.width / WIDTH, size.height / HEIGHT)
          ctx.clearRect(0, 0, size.width, size.height)
          ctx.save()
          ctx.translate(
            (size.width  - WIDTH  * scale) / 2,
            (size.height - HEIGHT * scale) / 2
          )
          ctx.scale(scale, scale)

          // Enhanced background gradient
          const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT)
          gradient.addColorStop(0, 'rgba(24, 24, 24, 0.9)')
          gradient.addColorStop(0.5, 'rgba(40, 40, 40, 0.8)')
          gradient.addColorStop(1, 'rgba(24, 24, 24, 0.9)')
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, WIDTH, HEIGHT)

          // draw pegs with glow
          const bodies = w.getBodies()
          const pegs   = bodies.filter(b => b.label === 'Peg')
          ctx.shadowColor = '#ffd700'
          ctx.shadowBlur = 10
          ctx.fillStyle = '#555'
          pegs.forEach(p => {
            ctx.beginPath()
            ctx.arc(p.position.x, p.position.y, PEG_RADIUS, 0, 2*Math.PI)
            ctx.fill()
          })
          ctx.shadowBlur = 0

          // draw barriers
          const barriers = bodies.filter(b => b.label === 'Barrier')
          ctx.fillStyle = '#333'
          barriers.forEach(b => {
            ctx.beginPath()
            b.vertices.forEach((v,i) =>
              i ? ctx.lineTo(v.x,v.y) : ctx.moveTo(v.x,v.y)
            )
            ctx.closePath()
            ctx.fill()
          })

          // bucket hit detection
          const now   = performance.now()
          const balls = bodies.filter(b => b.label === 'Ball')
          const count = BUCKET_DEFS.length
          const bw    = WIDTH / count
          balls.forEach(ball => {
            const bx = ball.position.x
            const by = ball.position.y + BALL_RADIUS
            if (by >= HEIGHT - BUCKET_HEIGHT) {
              const idx = Math.floor(bx / bw)
              if (idx >= 0 && idx < count) {
                bucketHitsRef.current[idx] = now
              }
            }
          })

          // draw buckets with enhanced colors and glow
          for (let i = 0; i < count; i++) {
            const x0   = i * bw
            const y0   = HEIGHT - BUCKET_HEIGHT
            const hit  = bucketHitsRef.current[i] || 0
            const age  = now - hit
            const glow = Math.max(0, 1 - age / 250) // 250ms fade

            // pick a hue per bucket (rainbow spread)
            const hue = (i / count) * 360

            // bucket base with gradient
            const bucketGradient = ctx.createLinearGradient(x0, y0, x0, y0 + BUCKET_HEIGHT)
            bucketGradient.addColorStop(0, `hsla(${hue}, 70%, 50%, 0.6)`)
            bucketGradient.addColorStop(1, `hsla(${hue}, 70%, 30%, 0.8)`)
            ctx.fillStyle = bucketGradient
            ctx.fillRect(x0, y0, bw, BUCKET_HEIGHT)

            // upward glow gradient
            if (glow > 0) {
              const g = ctx.createLinearGradient(0, y0, 0, y0 - BUCKET_HEIGHT * 3)
              g.addColorStop(0, `hsla(${hue}, 80%, 70%, ${0.4 * glow})`)
              g.addColorStop(1, 'rgba(0,0,0,0)')
              ctx.fillStyle = g
              ctx.fillRect(x0, y0 - BUCKET_HEIGHT * 3, bw, BUCKET_HEIGHT * 3)
            }
          }

          // draw balls with enhanced colors and glow
          balls.forEach(b => {
            const col = (b as any).plugin.color || '#ffb74d'
            ctx.shadowColor = col
            ctx.shadowBlur = 15
            ctx.fillStyle = col
            ctx.beginPath()
            ctx.arc(b.position.x, b.position.y, BALL_RADIUS, 0, 2*Math.PI)
            ctx.fill()
          })
          ctx.shadowBlur = 0

          ctx.restore()
        }}
      />
    </CanvasContainer>
  )
}
