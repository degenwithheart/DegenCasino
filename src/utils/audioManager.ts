// Audio Context Manager to handle browser autoplay policies
export class AudioContextManager {
  private static instance: AudioContextManager
  private audioContext: AudioContext | null = null
  private isInitialized = false
  private userInteracted = false

  private constructor() {
    // Listen for first user interaction
    this.addUserInteractionListeners()
  }

  static getInstance(): AudioContextManager {
    if (!AudioContextManager.instance) {
      AudioContextManager.instance = new AudioContextManager()
    }
    return AudioContextManager.instance
  }

  private addUserInteractionListeners() {
    const events = ['mousedown', 'keydown', 'touchstart']
    
    const handleFirstInteraction = () => {
      this.userInteracted = true
      this.initializeAudioContext()
      
      // Remove listeners after first interaction
      events.forEach(event => {
        document.removeEventListener(event, handleFirstInteraction, true)
      })
    }

    events.forEach(event => {
      document.addEventListener(event, handleFirstInteraction, true)
    })
  }

  private initializeAudioContext() {
    if (!this.isInitialized && this.userInteracted) {
      try {
        // Try to create and resume AudioContext
        if (typeof AudioContext !== 'undefined') {
          this.audioContext = new AudioContext()
          
          if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().catch(console.warn)
          }
        } else if (typeof AudioContext !== 'undefined') {
          // @ts-ignore - Safari fallback
          this.audioContext = new webkitAudioContext()
          
          if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().catch(console.warn)
          }
        }
        
        this.isInitialized = true
        console.log('AudioContext initialized after user interaction')
      } catch (error) {
        console.warn('Failed to initialize AudioContext:', error)
      }
    }
  }

  async ensureAudioContext(): Promise<AudioContext | null> {
    if (!this.userInteracted) {
      console.warn('AudioContext requires user interaction to start')
      return null
    }

    if (!this.isInitialized) {
      this.initializeAudioContext()
    }

    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume()
      } catch (error) {
        console.warn('Failed to resume AudioContext:', error)
      }
    }

    return this.audioContext
  }

  getAudioContext(): AudioContext | null {
    return this.audioContext
  }

  isUserInteracted(): boolean {
    return this.userInteracted
  }

  isReady(): boolean {
    return this.isInitialized && this.audioContext?.state === 'running'
  }
}

// Export singleton instance
export const audioManager = AudioContextManager.getInstance()

// Tone.js compatibility patch
if (typeof window !== 'undefined') {
  // Wait for Tone.js to load and then patch it
  const patchToneJS = () => {
    if (typeof window !== 'undefined' && (window as any).Tone) {
      const Tone = (window as any).Tone
      
      // Override Tone.start to use our audio manager
      const originalStart = Tone.start
      Tone.start = async () => {
        const audioContext = await audioManager.ensureAudioContext()
        if (audioContext) {
          return originalStart.call(Tone)
        }
        return Promise.resolve()
      }
      
      console.log('Tone.js patched for autoplay policy compliance')
    }
  }

  // Try to patch immediately if Tone is already loaded
  patchToneJS()
  
  // Also try after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', patchToneJS)
  } else {
    // DOM is already loaded, try in next tick
    setTimeout(patchToneJS, 100)
  }
}
