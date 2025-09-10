import React, { useState, useEffect, useRef } from 'react'
import { useGameScaling } from '../../contexts/GameScalingContext'

interface GameDimensions {
  portal: {
    width: number
    height: number
  }
  gameUI: {
    width: number
    height: number
    scrollWidth: number
    scrollHeight: number
    elementInfo?: string
  }
  viewport: {
    width: number
    height: number
  }
  debug?: {
    portalChildren: number
    foundSelector?: string
    portalStructure: string
  }
}

export const GameDimensionsDebug: React.FC = () => {
  const [showDebug, setShowDebug] = useState(false)
  const [dimensions, setDimensions] = useState<GameDimensions | null>(null)
  
  // Try to get game scaling context, but don't fail if not available
  let gameScaling = null
  try {
    gameScaling = useGameScaling()
  } catch (error) {
    // GameScalingProvider not available, we'll handle this gracefully
    console.log('GameScaling context not available, using fallback measurements')
  }

  const measureDimensions = () => {
    // Find the portal target screen element - try multiple selectors
    let portalTarget = document.querySelector('[data-portal-target="screen"]') as HTMLElement
    
    // Fallback: Look for GambaUi portal containers or game containers
    if (!portalTarget) {
      portalTarget = document.querySelector('.game-screen, .portal-screen, [class*="portal"][class*="screen"]') as HTMLElement
    }
    
    // Final fallback: Look inside the GameScalingProvider container
    if (!portalTarget) {
      const scalingContainer = document.querySelector('[style*="--game-screen-width"]') as HTMLElement
      portalTarget = scalingContainer?.parentElement as HTMLElement || scalingContainer
    }
    
    // DEBUG: Log what's actually inside the portal
    let debugInfo = ''
    if (portalTarget) {
      const children = Array.from(portalTarget.children)
      debugInfo = `Portal has ${children.length} children:\n`
      children.forEach((child, i) => {
        const element = child as HTMLElement
        debugInfo += `  ${i + 1}. <${element.tagName.toLowerCase()}${element.className ? ` class="${element.className}"` : ''}${element.id ? ` id="${element.id}"` : ''}>\n`
        if (element.children.length > 0) {
          Array.from(element.children).slice(0, 3).forEach((grandchild, j) => {
            const gc = grandchild as HTMLElement
            debugInfo += `     ${j + 1}. <${gc.tagName.toLowerCase()}${gc.className ? ` class="${gc.className}"` : ''}>\n`
          })
          if (element.children.length > 3) {
            debugInfo += `     ... and ${element.children.length - 3} more\n`
          }
        }
      })
      console.log('🔍 Portal Content Debug:', debugInfo)
    }
    
    // Try to find the largest/most significant element in the portal
    let gameContent: HTMLElement | null = null
    
    if (portalTarget) {
      // Strategy 1: Look for specific game class names
      const gameSelectors = [
        'canvas', '.dice-redesign', '.flip-redesign', '.slots-content', '.slots', '.slots-reels',
        '.mines-content', '.hilo-content', '.game-status', '.result-content'
      ]
      
      for (const selector of gameSelectors) {
        gameContent = portalTarget.querySelector(selector) as HTMLElement
        if (gameContent) {
          console.log('🎯 Found game content with selector:', selector)
          break
        }
      }
      
      // Strategy 2: Look for any styled components or containers
      if (!gameContent) {
        const styledSelectors = [
          '[class*="styled" i]', '[class*="Styled" i]', '[class*="wrapper" i]', 
          '[class*="container" i]', '[class*="background" i]', '[class*="Background" i]'
        ]
        
        for (const selector of styledSelectors) {
          gameContent = portalTarget.querySelector(selector) as HTMLElement
          if (gameContent) {
            console.log('🎯 Found game content with styled selector:', selector, gameContent.className)
            break
          }
        }
      }
      
      // Strategy 3: Find the largest child element by area
      if (!gameContent) {
        let largestElement: HTMLElement | null = null
        let largestArea = 0
        
        const walkElements = (element: Element) => {
          if (element instanceof HTMLElement) {
            const rect = element.getBoundingClientRect()
            const area = rect.width * rect.height
            if (area > largestArea && area > 1000) { // Minimum 1000px² to be considered
              largestArea = area
              largestElement = element
            }
          }
          Array.from(element.children).forEach(walkElements)
        }
        
        walkElements(portalTarget)
        
        if (largestElement) {
          gameContent = largestElement
          console.log('🎯 Found game content by size:', (largestElement as HTMLElement).tagName, (largestElement as HTMLElement).className || 'no-class', `${Math.round(largestArea)}px²`)
        }
      }
      
      // Strategy 4: Just use the first substantial child
      if (!gameContent) {
        const children = Array.from(portalTarget.children) as HTMLElement[]
        gameContent = children.find(child => {
          const rect = child.getBoundingClientRect()
          return rect.width > 100 && rect.height > 100
        }) || children[0] as HTMLElement
        
        if (gameContent) {
          console.log('🎯 Using first substantial child:', gameContent.tagName, gameContent.className)
        }
      }
    }
    
    if (portalTarget) {
      const portalRect = portalTarget.getBoundingClientRect()
      const gameRect = gameContent?.getBoundingClientRect()
      
      const elementInfo = gameContent 
        ? `${gameContent.tagName.toLowerCase()}${gameContent.className ? `.${gameContent.className.split(' ').join('.')}` : ''}${gameContent.id ? `#${gameContent.id}` : ''}`
        : 'none'
      
      setDimensions({
        portal: {
          width: Math.round(portalRect.width),
          height: Math.round(portalRect.height)
        },
        gameUI: {
          width: gameRect ? Math.round(gameRect.width) : 0,
          height: gameRect ? Math.round(gameRect.height) : 0,
          scrollWidth: gameContent?.scrollWidth || 0,
          scrollHeight: gameContent?.scrollHeight || 0,
          elementInfo
        },
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        debug: {
          portalChildren: portalTarget.children.length,
          portalStructure: debugInfo
        }
      })
    } else {
      // No portal found, set error state
      setDimensions({
        portal: { width: 0, height: 0 },
        gameUI: { width: 0, height: 0, scrollWidth: 0, scrollHeight: 0, elementInfo: 'no portal' },
        viewport: { width: window.innerWidth, height: window.innerHeight },
        debug: { portalChildren: 0, portalStructure: 'Portal not found' }
      })
    }
  }

  useEffect(() => {
    if (showDebug) {
      measureDimensions()
      const interval = setInterval(measureDimensions, 1000) // Update every second
      return () => clearInterval(interval)
    }
  }, [showDebug])

  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.3)',
          background: 'linear-gradient(135deg, #4ade80, #22d3ee)',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: 'bold'
        }}
        title="Show Game Dimensions Debug"
      >
        📏
      </button>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(4px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        border: '2px solid rgba(255,255,255,0.2)',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'auto',
        color: 'white'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ 
            margin: 0, 
            background: 'linear-gradient(90deg, #4ade80, #22d3ee)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            🎮 Game Dimensions Debug
          </h2>
          <button
            onClick={() => setShowDebug(false)}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,0,100,0.8)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '18px'
            }}
          >
            ×
          </button>
        </div>

        <button
          onClick={measureDimensions}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '20px',
            border: '1px solid rgba(255,255,255,0.3)',
            background: 'linear-gradient(135deg, #4ade80, #22d3ee)',
            color: 'white',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🔄 Refresh Measurements
        </button>

        {dimensions && (
          <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
            {/* Game Scaling Context */}
            <div style={{
              background: gameScaling ? 'rgba(0,200,100,0.1)' : 'rgba(255,200,0,0.1)',
              border: gameScaling ? '1px solid rgba(0,200,100,0.3)' : '1px solid rgba(255,200,0,0.3)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <h3 style={{ margin: '0 0 12px 0', color: gameScaling ? '#4ade80' : '#ffa500' }}>📊 Game Scaling Context</h3>
              {gameScaling ? (
                <>
                  <div>Width: <strong>{gameScaling.width}px</strong></div>
                  <div>Height: <strong>{gameScaling.height}px</strong></div>
                  <div>Scale: <strong>{gameScaling.scale}</strong></div>
                  <div>Breakpoint: <strong>{gameScaling.breakpoint}</strong></div>
                  <div>Aspect Ratio: <strong>{gameScaling.aspectRatio}</strong></div>
                  <div>Is Portrait: <strong>{gameScaling.isPortrait ? 'Yes' : 'No'}</strong></div>
                  <div>Is Constrained: <strong>{gameScaling.isConstrained ? 'Yes' : 'No'}</strong></div>
                </>
              ) : (
                <div style={{ color: '#ffa500', fontWeight: 'bold' }}>
                  ⚠️ GameScalingProvider not available. Component is outside of game context.
                </div>
              )}
            </div>

            {/* Portal Target Dimensions */}
            <div style={{
              background: dimensions.portal.width === 0 ? 'rgba(255,0,0,0.1)' : 'rgba(0,100,200,0.1)',
              border: dimensions.portal.width === 0 ? '1px solid rgba(255,0,0,0.3)' : '1px solid rgba(0,100,200,0.3)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <h3 style={{ margin: '0 0 12px 0', color: dimensions.portal.width === 0 ? '#ff4444' : '#22d3ee' }}>🖼️ Portal Target (target="screen")</h3>
              {dimensions.portal.width === 0 ? (
                <div style={{ color: '#ff4444', fontWeight: 'bold' }}>
                  ⚠️ Portal target not found! Tried selectors: [data-portal-target="screen"], .game-screen, .portal-screen, [style*="--game-screen-width"]
                </div>
              ) : (
                <>
                  <div>Width: <strong>{dimensions.portal.width}px</strong></div>
                  <div>Height: <strong>{dimensions.portal.height}px</strong></div>
                </>
              )}
            </div>

            {/* Game UI Dimensions */}
            <div style={{
              background: 'rgba(200,100,0,0.1)',
              border: `1px solid ${dimensions.gameUI.width === 0 ? 'rgba(255,0,0,0.5)' : 'rgba(200,100,0,0.3)'}`,
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <h3 style={{ margin: '0 0 12px 0', color: dimensions.gameUI.width === 0 ? '#ff4444' : '#ffa500' }}>
                🎯 Actual Game UI Content
              </h3>
              {dimensions.gameUI.width === 0 ? (
                <div style={{ color: '#ff4444', fontWeight: 'bold' }}>
                  ⚠️ No game content detected!
                  <br />Element Info: <code>{dimensions.gameUI.elementInfo}</code>
                  <br />Portal has {dimensions.debug?.portalChildren || 0} children
                  <br />Check browser console for detailed structure
                </div>
              ) : (
                <>
                  <div>Content Width: <strong>{dimensions.gameUI.width}px</strong></div>
                  <div>Content Height: <strong>{dimensions.gameUI.height}px</strong></div>
                  <div>Scroll Width: <strong>{dimensions.gameUI.scrollWidth}px</strong></div>
                  <div>Scroll Height: <strong>{dimensions.gameUI.scrollHeight}px</strong></div>
                  <div style={{ fontSize: '12px', color: '#aaa', marginTop: '8px' }}>
                    Element: <code>{dimensions.gameUI.elementInfo}</code>
                  </div>
                </>
              )}
            </div>

            {/* Viewport */}
            <div style={{
              background: 'rgba(100,0,200,0.1)',
              border: '1px solid rgba(100,0,200,0.3)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#a855f7' }}>📱 Browser Viewport</h3>
              <div>Width: <strong>{dimensions.viewport.width}px</strong></div>
              <div>Height: <strong>{dimensions.viewport.height}px</strong></div>
            </div>

            {/* Analysis */}
            <div style={{
              background: dimensions.gameUI.scrollWidth > dimensions.portal.width || dimensions.gameUI.scrollHeight > dimensions.portal.height
                ? 'rgba(255,0,0,0.1)'
                : 'rgba(0,255,0,0.1)',
              border: dimensions.gameUI.scrollWidth > dimensions.portal.width || dimensions.gameUI.scrollHeight > dimensions.portal.height
                ? '1px solid rgba(255,0,0,0.3)'
                : '1px solid rgba(0,255,0,0.3)',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <h3 style={{ 
                margin: '0 0 12px 0', 
                color: dimensions.gameUI.scrollWidth > dimensions.portal.width || dimensions.gameUI.scrollHeight > dimensions.portal.height
                  ? '#ff4444'
                  : '#44ff44'
              }}>
                🔍 Size Analysis {dimensions.gameUI.scrollWidth > dimensions.portal.width || dimensions.gameUI.scrollHeight > dimensions.portal.height ? '(UNSAFE)' : '(SAFE)'}
              </h3>
              
              {dimensions.gameUI.width === 0 ? (
                <div style={{ color: '#ff4444' }}>
                  <strong>❌ Cannot analyze - no game UI detected</strong>
                  <br />
                  The game content might use different class names or elements.
                </div>
              ) : (
                <>
                  <div>
                    Width Status: <strong style={{
                      color: dimensions.gameUI.scrollWidth > dimensions.portal.width ? '#ff4444' : '#44ff44'
                    }}>
                      {dimensions.gameUI.scrollWidth > dimensions.portal.width 
                        ? `❌ Required width (${dimensions.gameUI.scrollWidth}px) > Portal (${dimensions.portal.width}px)!`
                        : `✅ Portal is ${dimensions.portal.width - dimensions.gameUI.scrollWidth}px wider than required`
                      }
                    </strong>
                  </div>
                  
                  <div>
                    Height Status: <strong style={{
                      color: dimensions.gameUI.scrollHeight > dimensions.portal.height ? '#ff4444' : '#44ff44'
                    }}>
                      {dimensions.gameUI.scrollHeight > dimensions.portal.height
                        ? `❌ Required height (${dimensions.gameUI.scrollHeight}px) > Portal (${dimensions.portal.height}px)!`
                        : `✅ Portal is ${dimensions.portal.height - dimensions.gameUI.scrollHeight}px taller than required`
                      }
                    </strong>
                  </div>

                  {dimensions.gameUI.scrollWidth > dimensions.gameUI.width && (
                    <div style={{ color: '#ffa500', marginTop: '8px' }}>
                      ⚠️ Game has horizontal scroll content (+{dimensions.gameUI.scrollWidth - dimensions.gameUI.width}px)
                    </div>
                  )}

                  {dimensions.gameUI.scrollHeight > dimensions.gameUI.height && (
                    <div style={{ color: '#ffa500', marginTop: '8px' }}>
                      ⚠️ Game has vertical scroll content (+{dimensions.gameUI.scrollHeight - dimensions.gameUI.height}px)
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
