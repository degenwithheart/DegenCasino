// Prefetch utilities (hover, idle, intersection, heuristic)
// Focus: keep tiny, resilient, cancellable.
export type PrefetchTask = () => Promise<unknown>

const scheduled = new Set<string>()
const controllers: Record<string, AbortController> = {}
let prefetchAllowed: boolean | null = null
let userOverride: boolean | null = null // false => force disable, true => force enable

export function setPrefetchUserOverride(value: boolean | null) {
  userOverride = value
  // Reset internal evaluation so next prefetch call re-evaluates
  prefetchAllowed = null
}

function evaluateNetworkConditions() {
  try {
    const nav = (navigator as any).connection
    if (!nav) return true
    if (nav.saveData) return false
    const effective = nav.effectiveType || ''
    if (/^(slow-2g|2g)$/.test(effective)) return false
    return true
  } catch (_) {
    return true
  }
}

function idle(cb: () => void) {
  if (typeof (window as any).requestIdleCallback === 'function') {
    ;(window as any).requestIdleCallback(cb, { timeout: 2000 })
  } else {
    setTimeout(cb, 120)
  }
}

// Lightweight dynamic access to user store (lazy require to avoid cycle)
function getUserSettings() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { useUserStore } = require('../hooks/useUserStore')
    return useUserStore.getState()
  } catch { return {} as any }
}

export function prefetch(id: string, task: PrefetchTask) {
  if (prefetchAllowed === null) {
    prefetchAllowed = userOverride != null ? userOverride : evaluateNetworkConditions()
  }
  if (!prefetchAllowed) return
  const settings = getUserSettings()
  const level = settings.prefetchLevel || 'conservative'
  if (level === 'off') return
  if (scheduled.has(id)) return
  scheduled.add(id)
  const controller = new AbortController()
  controllers[id] = controller
  idle(() => {
    if (controller.signal.aborted) return
    try { task().catch(() => {}) } catch (_) {}
  })
}

export function cancelPrefetch(id: string) {
  const c = controllers[id]
  if (c && !c.signal.aborted) c.abort()
  delete controllers[id]
  if (scheduled.has(id)) scheduled.delete(id)
}

export function useHoverPrefetch(id: string, task: PrefetchTask) {
  return () => prefetch(id, task)
}

export function prefetchBatch(entries: Array<[string, PrefetchTask]>) {
  idle(() => { entries.forEach(([id, task]) => prefetch(id, task)) })
}

export function useIOPrefetch(id: string, task: PrefetchTask, options?: IntersectionObserverInit) {
  return (el: HTMLElement | null) => {
    if (!el) return
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(es => {
        es.forEach(e => { if (e.isIntersecting) { prefetch(id, task); obs.disconnect() } })
      }, options)
      obs.observe(el)
    } else {
      prefetch(id, task)
    }
  }
}

export function heuristicPrefetch(pathname: string) {
  if (prefetchAllowed === null) {
    prefetchAllowed = userOverride != null ? userOverride : evaluateNetworkConditions()
  }
  if (!prefetchAllowed) return
  const settings = getUserSettings()
  const level = settings.prefetchLevel || 'conservative'
  if (level === 'off') return
  const rules: Array<[RegExp, Array<[string, PrefetchTask]>]> = [
    [/^\/$/, [
      ['game-core', () => import('../../sections/Game/Game')],
      ['explorer-index', () => import('../../components/Explorer/ExplorerIndex')],
    ]],
    [/^\/game\//, [
      ['explorer-transaction', () => import('../../components/Transaction/Transaction')],
    ]],
    [/^\/explorer/, [
      ['platform-view', () => import('../../components/Platform/PlatformView')],
      ['player-view', () => import('../../components/Platform/PlayerView')],
    ]],
  ]
  rules.forEach(([re, list]) => { if (re.test(pathname)) {
    // Scale batch size by level
    const limited = level === 'conservative' ? list.slice(0, 1) : list
    prefetchBatch(limited)
  } })
}

export function preloadAssets(urls: string[]) {
  urls.forEach(u => {
    try {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = u.match(/\.(woff2?|otf|ttf)$/) ? 'font' : 'image'
      if (link.as === 'font') link.crossOrigin = 'anonymous'
      link.href = u
      document.head.appendChild(link)
    } catch (_) {}
  })
}

// Dynamic font subset preloading (Google Fonts style). Only loads minimal glyphs early.
interface FontSubsetConfig {
  family: string
  weights?: string[]
  sample?: string // optional custom sample text
}

function createFontSubsetUrl(cfg: FontSubsetConfig, text: string) {
  const fam = cfg.family.trim().replace(/ /g, '+')
  const weights = cfg.weights && cfg.weights.length ? `:wght@${cfg.weights.join(';')}` : ''
  const base = `https://fonts.googleapis.com/css2?family=${fam}${weights}&display=swap&text=${encodeURIComponent(text)}`
  return base
}

export function scheduleFontSubsetPreload(configs: FontSubsetConfig[], opts: {maxChars?: number, idleDelay?: number} = {}) {
  const { maxChars = 120, idleDelay = 800 } = opts
  idle(() => {
    setTimeout(() => {
      const root = document.getElementById('root')
      let chars = new Set<string>()
      if (root) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
        let node: any
        while ((node = walker.nextNode()) && chars.size < maxChars) {
          const text = (node.textContent || '').replace(/\s+/g, ' ').slice(0, maxChars - chars.size)
            .replace(/[^A-Za-z0-9$€¥£.,!?:;@#%&*()\-_'"+/= ]/g, '')
          for (const ch of text) chars.add(ch)
        }
      }
      // Ensure basic ASCII if not enough collected
      if (chars.size < 30) 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$,.!'.split('').forEach(c => chars.add(c))
      const subset = Array.from(chars).join('').slice(0, maxChars)
      configs.forEach(cfg => {
        try {
          const url = createFontSubsetUrl(cfg, cfg.sample || subset)
          if (Array.from(document.styleSheets).some(s => (s as CSSStyleSheet).href === url)) return
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = url
          document.head.appendChild(link)
        } catch(_) {}
      })
    }, idleDelay)
  })
}

// Network idle detection to prefetch low-priority chunks.
export function scheduleNetworkIdlePrefetch(entries: Array<[string, PrefetchTask]>, opts: {idleMs?: number, timeoutMs?: number} = {}) {
  const { idleMs = 2000, timeoutMs = 10000 } = opts
  let lastActivity = performance.now()
  let fired = false
  function maybeFire() {
    if (fired) return
    if (performance.now() - lastActivity >= idleMs) {
      fired = true
      prefetchBatch(entries)
      observer && observer.disconnect()
      clearInterval(poller)
    }
  }
  const poller = setInterval(maybeFire, 500)
  const timeout = setTimeout(() => { if (!fired) maybeFire() }, timeoutMs)
  let observer: PerformanceObserver | null = null
  if ('PerformanceObserver' in window) {
    try {
      observer = new PerformanceObserver(list => {
        if (fired) return
        const newEntries = list.getEntries()
        if (newEntries.length) lastActivity = performance.now()
        maybeFire()
      })
      observer.observe({ entryTypes: ['resource'] })
    } catch (_) { /* ignore */ }
  }
  // Also treat visibility change (user hidden) as idle trigger
  const vis = () => { if (document.visibilityState === 'hidden') maybeFire() }
  document.addEventListener('visibilitychange', vis, { once: true })
  return () => {
    clearInterval(poller)
    clearTimeout(timeout)
    document.removeEventListener('visibilitychange', vis)
    observer && observer.disconnect()
  }
}