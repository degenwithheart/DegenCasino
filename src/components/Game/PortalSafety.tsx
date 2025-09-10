import React, { useState, useEffect, useCallback, useRef } from 'react'

interface SafetyStatus {
  isSafe: boolean
  widthStatus: 'safe' | 'unsafe'
  heightStatus: 'safe' | 'unsafe'
  portalSize: { width: number; height: number }
  gameContentSize: { width: number; height: number; scrollWidth: number; scrollHeight: number }
  requiredSize: { width: number; height: number }
  reasons: string[]
}

interface PortalSafetyMonitorProps {
  onSafetyChange?: (status: SafetyStatus) => void
  enforceSafety?: boolean
  debugMode?: boolean
}

/**
 * Real-time portal safety monitor that prevents the portal from becoming smaller
 * than the game content requires
 */
export const PortalSafetyMonitor: React.FC<PortalSafetyMonitorProps> = ({
  onSafetyChange,
  enforceSafety = true,
  debugMode = false
}) => {
  const [safetyStatus, setSafetyStatus] = useState<SafetyStatus | null>(null)
  const portalRef = useRef<HTMLElement | null>(null)
  const gameContentRef = useRef<HTMLElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout>()

  const detectGameContent = useCallback((): HTMLElement | null => {
    // Find portal first
    const portal = document.querySelector('[data-portal-target="screen"]') as HTMLElement ||
                  document.querySelector('.game-screen, .portal-screen, [class*="portal"][class*="screen"]') as HTMLElement ||
                  document.querySelector('[style*="--game-screen-width"]')?.parentElement as HTMLElement

    if (!portal) return null

    // Find game content using comprehensive selectors
    const gameSelectors = [
      'canvas', '.dice-redesign', '.flip-redesign', '.slots-content', '.slots', '.slots-reels',
      '.mines-content', '.hilo-content', '.game-status', '.result-content',
      '[class*="styled" i]', '[class*="Styled" i]', '[class*="wrapper" i]', 
      '[class*="container" i]', '[class*="background" i]', '[class*="Background" i]'
    ]

    for (const selector of gameSelectors) {
      const element = portal.querySelector(selector) as HTMLElement
      if (element) return element
    }

    // Fallback: find largest child
    let largestElement: HTMLElement | null = null
    let largestArea = 0
    
    const walkElements = (element: Element) => {
      if (element instanceof HTMLElement) {
        const rect = element.getBoundingClientRect()
        const area = rect.width * rect.height
        if (area > largestArea && area > 1000) {
          largestArea = area
          largestElement = element
        }
      }
      Array.from(element.children).forEach(walkElements)
    }
    
    walkElements(portal)
    return largestElement
  }, [])

  const checkSafety = useCallback(() => {
    const portal = document.querySelector('[data-portal-target="screen"]') as HTMLElement ||
                   document.querySelector('.game-screen, .portal-screen, [class*="portal"][class*="screen"]') as HTMLElement ||
                   document.querySelector('[style*="--game-screen-width"]')?.parentElement as HTMLElement

    const gameContent = detectGameContent()

    if (!portal || !gameContent) {
      setSafetyStatus(null)
      return
    }

    const portalRect = portal.getBoundingClientRect()
    const gameRect = gameContent.getBoundingClientRect()

    // The true size requirement is the scroll size (what the game actually needs)
    const requiredWidth = Math.max(gameContent.scrollWidth, gameRect.width)
    const requiredHeight = Math.max(gameContent.scrollHeight, gameRect.height)

    const widthSafe = portalRect.width >= requiredWidth
    const heightSafe = portalRect.height >= requiredHeight

    const reasons: string[] = []
    if (!widthSafe) {
      reasons.push(`Portal width (${Math.round(portalRect.width)}px) < required width (${requiredWidth}px)`)
    }
    if (!heightSafe) {
      reasons.push(`Portal height (${Math.round(portalRect.height)}px) < required height (${requiredHeight}px)`)
    }

    const status: SafetyStatus = {
      isSafe: widthSafe && heightSafe,
      widthStatus: widthSafe ? 'safe' : 'unsafe',
      heightStatus: heightSafe ? 'safe' : 'unsafe',
      portalSize: {
        width: Math.round(portalRect.width),
        height: Math.round(portalRect.height)
      },
      gameContentSize: {
        width: Math.round(gameRect.width),
        height: Math.round(gameRect.height),
        scrollWidth: gameContent.scrollWidth,
        scrollHeight: gameContent.scrollHeight
      },
      requiredSize: {
        width: requiredWidth,
        height: requiredHeight
      },
      reasons
    }

    setSafetyStatus(status)
    onSafetyChange?.(status)

    // Enforce safety by applying minimum sizes
    if (enforceSafety && !status.isSafe) {
      if (!widthSafe) {
        portal.style.minWidth = `${requiredWidth}px`
        portal.style.width = `${Math.max(portalRect.width, requiredWidth)}px`
      }
      if (!heightSafe) {
        portal.style.minHeight = `${requiredHeight}px`
        portal.style.height = `${Math.max(portalRect.height, requiredHeight)}px`
      }
      
      if (debugMode) {
        console.warn('🚨 PORTAL SAFETY ENFORCEMENT:', {
          required: { width: requiredWidth, height: requiredHeight },
          portal: { width: portalRect.width, height: portalRect.height },
          enforced: {
            width: !widthSafe ? requiredWidth : portalRect.width,
            height: !heightSafe ? requiredHeight : portalRect.height
          }
        })
      }
    }
  }, [detectGameContent, onSafetyChange, enforceSafety, debugMode])

  useEffect(() => {
    // Initial check
    checkSafety()

    // Set up continuous monitoring
    intervalRef.current = setInterval(checkSafety, 500) // Check every 500ms

    // Also check on resize events
    const handleResize = () => {
      setTimeout(checkSafety, 100) // Debounce
    }

    window.addEventListener('resize', handleResize)
    
    // Listen to visual viewport changes for mobile browsers
    if ('visualViewport' in window && window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      window.removeEventListener('resize', handleResize)
      if ('visualViewport' in window && window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize)
      }
    }
  }, [checkSafety])

  // Debug overlay
  if (debugMode && safetyStatus) {
    return (
      <div style={{
        position: 'fixed',
        top: 10,
        right: 10,
        background: safetyStatus.isSafe ? 'rgba(0,200,0,0.9)' : 'rgba(200,0,0,0.9)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '8px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 10000,
        maxWidth: '300px',
        border: `2px solid ${safetyStatus.isSafe ? '#00ff00' : '#ff0000'}`
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
          🛡️ Portal Safety: {safetyStatus.isSafe ? 'SAFE' : 'UNSAFE'}
        </div>
        <div>Portal: {safetyStatus.portalSize.width}×{safetyStatus.portalSize.height}</div>
        <div>Required: {safetyStatus.requiredSize.width}×{safetyStatus.requiredSize.height}</div>
        <div>Content: {safetyStatus.gameContentSize.width}×{safetyStatus.gameContentSize.height}</div>
        <div>Scroll: {safetyStatus.gameContentSize.scrollWidth}×{safetyStatus.gameContentSize.scrollHeight}</div>
        {safetyStatus.reasons.length > 0 && (
          <div style={{ marginTop: '4px', fontSize: '10px', opacity: 0.9 }}>
            {safetyStatus.reasons.map((reason, i) => (
              <div key={i}>⚠️ {reason}</div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return null
}

/**
 * Hook that provides real-time portal safety monitoring
 */
export const usePortalSafety = (options: { enforceSafety?: boolean; debugMode?: boolean } = {}) => {
  const [safetyStatus, setSafetyStatus] = useState<SafetyStatus | null>(null)

  const handleSafetyChange = useCallback((status: SafetyStatus) => {
    setSafetyStatus(status)
  }, [])

  return {
    safetyStatus,
    SafetyMonitor: () => (
      <PortalSafetyMonitor
        onSafetyChange={handleSafetyChange}
        enforceSafety={options.enforceSafety}
        debugMode={options.debugMode}
      />
    )
  }
}
