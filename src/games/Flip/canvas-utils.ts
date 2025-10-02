import { ROMANTIC_COLORS, CANVAS_WIDTH, CANVAS_HEIGHT, FLIP_SETTINGS } from './constants'
import { Particle, CoinAnimation, RenderContext } from './types'

export function createParticleBurst(
  x: number,
  y: number,
  color: string,
  count: number
): Particle[] {
  const particles: Particle[] = []
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count
    const velocity = 2 + Math.random() * 2
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      life: 1,
      maxLife: 60 + Math.random() * 20,
      color,
      size: 2 + Math.random() * 2
    })
  }
  return particles
}

export function updateParticles(particles: Particle[]): Particle[] {
  return particles
    .map(particle => ({
      ...particle,
      x: particle.x + particle.vx,
      y: particle.y + particle.vy,
      life: particle.life - 1
    }))
    .filter(particle => particle.life > 0)
}

export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  particles.forEach(particle => {
    const alpha = particle.life / particle.maxLife
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.fillStyle = particle.color
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  })
}

export function drawCoin(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rotation: number,
  scale: number,
  img: HTMLImageElement,
  size: number = 80
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.scale(scale, scale)

  // Create temporary canvas for circular mask
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')
  if (!tempCtx) return
  
  tempCanvas.width = size
  tempCanvas.height = size
  
  // Draw perfect circle by using arc with fill
  tempCtx.beginPath()
  tempCtx.arc(size/2, size/2, size/2, 0, Math.PI * 2)
  tempCtx.fill()
  
  // Set composite operation to use the circle as a mask
  tempCtx.globalCompositeOperation = 'source-in'
  
  // Draw the coin image onto the circular mask
  tempCtx.drawImage(img, 0, 0, size, size)
  
  // Draw the circular result onto main canvas
  ctx.drawImage(tempCanvas, -size/2, -size/2)
  
  ctx.restore()
}

export function updateCoinAnimations(animations: CoinAnimation[], deltaTime: number): CoinAnimation[] {
  return animations.map(anim => {
    const progress = Math.min(1, (performance.now() - anim.startTime) / anim.duration)
    const easeProgress = easeOutBack(progress)
    
    return {
      ...anim,
      rotation: lerp(anim.rotation, anim.targetRotation, easeProgress * 0.1),
      scale: lerp(anim.scale, anim.targetScale, easeProgress * 0.1),
      complete: progress >= 1
    }
  })
}

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

function easeOutBack(x: number): number {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

export function drawBackground(ctx: CanvasRenderingContext2D, timestamp: number) {
  // Draw gradient background
  const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  gradient.addColorStop(0, ROMANTIC_COLORS.background)
  gradient.addColorStop(1, ROMANTIC_COLORS.dark)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  
  // Add subtle animated patterns
  ctx.save()
  ctx.globalAlpha = 0.1
  ctx.fillStyle = ROMANTIC_COLORS.purple
  
  for (let i = 0; i < 5; i++) {
    const x = Math.sin(timestamp * 0.001 + i) * 100 + CANVAS_WIDTH / 2
    const y = Math.cos(timestamp * 0.001 + i) * 100 + CANVAS_HEIGHT / 2
    ctx.beginPath()
    ctx.arc(x, y, 50 + Math.sin(timestamp * 0.002 + i) * 20, 0, Math.PI * 2)
    ctx.fill()
  }
  
  ctx.restore()
}