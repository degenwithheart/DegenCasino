// Centralized requestAnimationFrame scheduler respecting background throttling
// Components can subscribe to a tick with a desired fps. When document is hidden
// and bg-throttled class is present, we downgrade to a low FPS (e.g., 4fps) unless
// forceForeground is true.

export type RafSubscriber = {
  id: number
  callback: (dt: number, now: number) => void
  fps: number
  forceForeground?: boolean
  accumulator: number
  frameInterval: number
}

const subs: RafSubscriber[] = []
let last = performance.now()
let running = false
let idCounter = 0
let reduced = false
// Adaptive FPS control
let adaptiveEnabled = true
let recentFrameTimes: number[] = []
const MAX_HISTORY = 60
let dynamicScale = 1 // 1 = full speed, >1 slows
const BASE_TARGET_FPS = 60
const MIN_TARGET_FPS = 20
const MAX_TARGET_FPS = 60

function computeAdaptiveInterval(baseInterval: number) {
  if (!adaptiveEnabled) return baseInterval
  // Calculate average frame time
  const avg = recentFrameTimes.length ? (recentFrameTimes.reduce((a,b)=>a+b,0) / recentFrameTimes.length) : baseInterval
  // If average frame time > 32ms ( ~31fps ), slow global frequency a bit
  if (avg > 40) dynamicScale = Math.min(4, dynamicScale * 1.25) // very slow, escalate quickly
  else if (avg > 28) dynamicScale = Math.min(3, dynamicScale * 1.1)
  else if (avg > 20) dynamicScale = Math.min(2, dynamicScale * 1.05)
  else if (avg < 18) dynamicScale = Math.max(1, dynamicScale * 0.96) // recover

  const targetFps = Math.min(MAX_TARGET_FPS, Math.max(MIN_TARGET_FPS, BASE_TARGET_FPS / dynamicScale))
  return 1000 / targetFps
}

function loop(now: number) {
  if (!running) return
  const dt = now - last
  last = now
  recentFrameTimes.push(dt)
  if (recentFrameTimes.length > MAX_HISTORY) recentFrameTimes.shift()
  reduced = document.documentElement.classList.contains('bg-throttled')
  const adaptiveGlobalInterval = computeAdaptiveInterval(1000/60)
  subs.forEach(s => {
    const baseInterval = s.frameInterval
    const intervalWithAdaptive = Math.max(baseInterval, adaptiveGlobalInterval)
    const targetInterval = (reduced && !s.forceForeground) ? Math.max(250, intervalWithAdaptive * 4) : intervalWithAdaptive
    s.accumulator += dt
    if (s.accumulator >= targetInterval) {
      s.accumulator = 0
      try { s.callback(dt, now) } catch { /* ignore */ }
    }
  })
  requestAnimationFrame(loop)
}

export function startRafScheduler() {
  if (running) return
  running = true
  last = performance.now()
  requestAnimationFrame(loop)
}

export function stopRafScheduler() {
  running = false
}

// Allow components to toggle adaptive scheduling (e.g., when running critical animations)
export function setAdaptiveRaf(enabled: boolean) { adaptiveEnabled = enabled }
export function getAdaptiveState() { return { adaptiveEnabled, dynamicScale, avgFrame: recentFrameTimes.reduce((a,b)=>a+b,0)/(recentFrameTimes.length||1) } }

export function subscribeRaf(callback: (dt: number, now: number) => void, fps = 60, opts: { forceForeground?: boolean } = {}) {
  const frameInterval = 1000 / fps
  const sub: RafSubscriber = { id: ++idCounter, callback, fps, frameInterval, accumulator: 0, forceForeground: opts.forceForeground }
  subs.push(sub)
  if (!running) startRafScheduler()
  return () => {
    const idx = subs.findIndex(x => x.id === sub.id)
    if (idx >= 0) subs.splice(idx, 1)
    if (!subs.length) stopRafScheduler()
  }
}

// Auto start lazily when first subscriber arrives. Components should import subscribeRaf.
