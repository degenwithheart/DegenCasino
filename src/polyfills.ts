import { Buffer } from 'buffer'

// Create a basic process polyfill
const processPolyfill = {
  env: { DEBUG: undefined, NODE_ENV: 'development' },
  version: '',
  nextTick: (fn: any) => setTimeout(fn, 0),
  browser: true
}

// Polyfill global variables for browser compatibility
;(globalThis as any).global = globalThis
;(globalThis as any).Buffer = Buffer
;(globalThis as any).process = processPolyfill

// Additional polyfills
if (typeof (globalThis as any).process === 'undefined') {
  ;(globalThis as any).process = processPolyfill
}

if (typeof (globalThis as any).Buffer === 'undefined') {
  ;(globalThis as any).Buffer = Buffer
}

export {}
