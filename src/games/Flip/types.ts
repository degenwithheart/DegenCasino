export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

export interface CoinAnimation {
  rotation: number
  targetRotation: number
  scale: number
  targetScale: number
  x: number
  y: number
  startTime: number
  duration: number
  complete: boolean
  // Optional: visual face to display when settled
  showing?: 'heads' | 'tails'
}

export interface GameState {
  particles: Particle[]
  coinAnimations: CoinAnimation[]
  flipping: boolean
  win: boolean | null
  hasPlayed: boolean
}

export interface RenderContext {
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  timestamp: number
  deltaTime: number
}

export interface QualitySettings {
  particleCount: number
  enableEffects: boolean
  enableMotion: boolean
  quality: 'low' | 'medium' | 'high' | 'ultra'
}