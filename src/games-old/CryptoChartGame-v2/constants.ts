// Sound imports
export { default as SOUND_LOSE } from './sounds/lose.mp3'
export { default as SOUND_PLAY } from './sounds/play.mp3'
export { default as SOUND_WIN } from './sounds/win.mp3'
export { default as SOUND_MOON } from './sounds/moon.mp3'
export { default as SOUND_RUG } from './sounds/rug.mp3'

// Canvas dimensions for CryptoChartGame-v2
export const CANVAS_WIDTH = 1200
export const CANVAS_HEIGHT = 800

// Chart dimensions and layout
export const CHART_WIDTH = 1000
export const CHART_HEIGHT = 600
export const CHART_PADDING = 50
export const CANDLE_WIDTH = 8
export const CANDLE_SPACING = 2

// Animation constants
export const ANIMATION_DURATION = 2000
export const PARTICLE_LIFETIME = 120
export const CHART_ANIMATION_SPEED = 0.03

// Romantic degen colors
export const ROMANTIC_COLORS = {
  gold: '#d4a574',
  crimson: '#b8336a',
  purple: '#8b5a9e',
  background: '#0a0511',
  light: '#f4e9e1',
  dark: '#1a1a1a',
  moon: '#00ff55',
  rug: '#ff4444',
  neutral: '#ffffff'
}

// Chart colors
export const CHART_COLORS = {
  bullish: '#00ff55',
  bearish: '#ff4444',
  grid: '#2e2e2e',
  text: '#bbbbbb',
  target: '#ffd700',
  sparkline: '#00ff55',
  background: '#000000'
}

// Price simulation constants
export const PRICE_CONFIG = {
  basePrice: 180,
  minPrice: 180,
  maxPrice: 1000000000,
  volatility: 0.02,
  trendStrength: 0.1
}

// Multiplier constraints
export const MULTIPLIER_CONFIG = {
  min: 1.1,
  max: 100,
  default: 2.0,
  step: 0.1
}