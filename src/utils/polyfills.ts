// Browser polyfills for better compatibility

// Make Buffer available globally - this will be provided by Vite's buffer alias
if (typeof window !== 'undefined') {
  // The buffer will be available through the alias, so we don't need to import it directly
  
  // Polyfill for process.env if needed
  if (!window.process) {
    window.process = {
      env: {
        GAMBA_ENV: 'production',
        ...import.meta.env
      }
    } as any
  }

  // Fix for BigInt serialization issues
  if (typeof BigInt !== 'undefined' && !(BigInt.prototype as any).toJSON) {
    (BigInt.prototype as any).toJSON = function() {
      return this.toString()
    }
  }

  // Polyfill for crypto.getRandomValues if missing
  if (!window.crypto?.getRandomValues) {
    console.warn('crypto.getRandomValues not available, using fallback')
    if (!window.crypto) {
      window.crypto = {} as any
    }
    window.crypto.getRandomValues = (array: any) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256)
      }
      return array
    }
  }

  // Fix for potential ArrayBuffer issues
  if (typeof ArrayBuffer !== 'undefined' && !ArrayBuffer.prototype.slice) {
    ArrayBuffer.prototype.slice = function(start: number, end?: number) {
      const len = this.byteLength
      start = start || 0
      end = end === undefined ? len : end
      
      if (start < 0) start = Math.max(len + start, 0)
      if (end < 0) end = Math.max(len + end, 0)
      
      const newLen = Math.max(end - start, 0)
      const result = new ArrayBuffer(newLen)
      const resultView = new Uint8Array(result)
      const sourceView = new Uint8Array(this, start, newLen)
      
      resultView.set(sourceView)
      return result
    }
  }

  // Fix for Solana Web3.js BN.js compatibility issue
  // This addresses the "toArrayLike" error we're seeing
  const patchBNCompatibility = () => {
    try {
      // Check if BN is available globally
      const BN = (window as any).BN || (globalThis as any).BN
      if (BN && BN.prototype) {
        const originalToArrayLike = BN.prototype.toArrayLike
        
        if (originalToArrayLike && typeof originalToArrayLike === 'function') {
          BN.prototype.toArrayLike = function(ArrayType: any, endian?: string, length?: number) {
            try {
              return originalToArrayLike.call(this, ArrayType, endian, length)
            } catch (error) {
              // Fallback implementation for compatibility
              console.warn('BN.toArrayLike fallback used due to:', error instanceof Error ? error.message : String(error))
              const arr = this.toArray(endian, length)
              return new ArrayType(arr)
            }
          }
          console.log('BN.js compatibility patch applied')
        }
      }
    } catch (error) {
      console.warn('Failed to patch BN.js compatibility:', error)
    }
  }

  // Apply BN patch immediately if available
  patchBNCompatibility()
  
  // Also try after a delay in case BN.js loads later
  setTimeout(patchBNCompatibility, 1000)
  setTimeout(patchBNCompatibility, 3000)
}

export {}
