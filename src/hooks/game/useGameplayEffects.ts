import { useEffect, useRef, useState } from 'react'
import { useGraphics } from '../../components'

export interface GameplayEffects {
  // Screen shake with intensity and duration
  screenShake: (intensity?: number, duration?: number) => void
  
  // Win flash with color and intensity
  winFlash: (color?: string, intensity?: number) => void
  
  // Lose flash with color and intensity  
  loseFlash: (color?: string, intensity?: number) => void
  
  // Particle burst at specific location
  particleBurst: (x?: number, y?: number, color?: string, count?: number) => void
  
  // Generic flash effect
  flash: (color?: string, duration?: number) => void
  
  // Pulse effect for elements
  pulse: (intensity?: number) => void
  
  // Current active effects state
  isShaking: boolean
  isFlashing: boolean
  flashColor: string
  shakeIntensity: number
}

export function useGameplayEffects(): GameplayEffects {
  const { settings } = useGraphics()
  const [isShaking, setIsShaking] = useState(false)
  const [isFlashing, setIsFlashing] = useState(false)
  const [flashColor, setFlashColor] = useState('#ffffff')
  const [shakeIntensity, setShakeIntensity] = useState(0)
  
  const shakeTimeoutRef = useRef<NodeJS.Timeout>()
  const flashTimeoutRef = useRef<NodeJS.Timeout>()
  
  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current)
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current)
    }
  }, [])
  
  const screenShake = (intensity = 1, duration = 800) => { // Longer default duration for accessibility
    // Only trigger if accessibility visual feedback is enabled
    if (!settings.enableEffects) {
      console.log('♿ Screen shake disabled (accessibility visual feedback off)')
      return
    }
    
    console.log('♿ Accessibility screen shake triggered:', { intensity, duration })
    
    // Clear existing shake
    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current)
    
    setIsShaking(true)
    setShakeIntensity(intensity)
    
    // Stop shaking after duration
    shakeTimeoutRef.current = setTimeout(() => {
      setIsShaking(false)
      setShakeIntensity(0)
    }, duration)
  }
  
  const winFlash = (color?: string, intensity = 1.2) => { // Higher default intensity for accessibility
    // Use theme's winGlow color if no color specified
    const effectColor = color || settings.customTheme?.winGlow || '#00ff00'
    flash(effectColor, 1000 * intensity) // Longer duration for accessibility
  }
  
  const loseFlash = (color?: string, intensity = 1.2) => { // Higher default intensity for accessibility
    // Use theme's loseGlow color if no color specified
    const effectColor = color || settings.customTheme?.loseGlow || '#ff0040'
    flash(effectColor, 800 * intensity) // Longer duration for accessibility
  }
  
  const flash = (color = '#ffffff', duration = 500) => { // Longer default duration for accessibility
    // Only trigger if accessibility visual feedback is enabled
    if (!settings.enableEffects) {
      console.log('♿ Flash disabled (accessibility visual feedback off)')
      return
    }
    
    console.log('♿ Accessibility flash triggered:', { color, duration })
    
    // Clear existing flash
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current)
    
    setIsFlashing(true)
    setFlashColor(color)
    
    // Stop flashing after duration
    flashTimeoutRef.current = setTimeout(() => {
      setIsFlashing(false)
    }, duration)
  }
  
  const particleBurst = (x = 50, y = 50, color?: string, count = 10) => {
    // Only trigger if accessibility visual feedback is enabled
    if (!settings.enableEffects) {
      console.log('♿ Particle burst disabled (accessibility visual feedback off)')
      return
    }
    
    // Use theme's particleWin color if no color specified
    const effectColor = color || settings.customTheme?.particleWin || '#ffd700'
    
    console.log('♿ Accessibility particle burst triggered:', { x, y, color: effectColor, count })
    
    // Create temporary particles that self-destruct
    const container = document.createElement('div')
    container.style.position = 'fixed'
    container.style.top = '0'
    container.style.left = '0'
    container.style.width = '100%'
    container.style.height = '100%'
    container.style.pointerEvents = 'none'
    container.style.zIndex = '9999'
    
    document.body.appendChild(container)
    
    // Create particles
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div')
      particle.style.position = 'absolute'
      particle.style.width = '4px'
      particle.style.height = '4px'
      particle.style.backgroundColor = effectColor
      particle.style.borderRadius = '50%'
      particle.style.left = `${x}%`
      particle.style.top = `${y}%`
      
      // Random direction and speed
      const angle = (Math.PI * 2 * i) / count
      const speed = 100 + Math.random() * 100
      const vx = Math.cos(angle) * speed
      const vy = Math.sin(angle) * speed
      
      container.appendChild(particle)
      
      // Animate particle
      let startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        const t = elapsed / 1000
        
        if (t > 2) {
          container.removeChild(particle)
          return
        }
        
        const newX = x + (vx * t)
        const newY = y + (vy * t) + (50 * t * t) // gravity
        const opacity = 1 - (t / 2)
        
        particle.style.left = `${newX}%`
        particle.style.top = `${newY}%`
        particle.style.opacity = opacity.toString()
        
        requestAnimationFrame(animate)
      }
      
      requestAnimationFrame(animate)
    }
    
    // Clean up container after particles are done
    setTimeout(() => {
      if (document.body.contains(container)) {
        document.body.removeChild(container)
      }
    }, 3000)
  }
  
  const pulse = (intensity = 1) => {
    // This can be implemented as needed by individual games
    console.log('💫 Pulse triggered:', { intensity })
  }
  
  return {
    screenShake,
    winFlash,
    loseFlash,
    particleBurst,
    flash,
    pulse,
    isShaking,
    isFlashing,
    flashColor,
    shakeIntensity
  }
}
