import { GambaUi, useSound, useWagerInput, useCurrentPool } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { makeDeterministicRng } from '../../fairness/deterministicRng'
import { EnhancedWagerInput, EnhancedButton, MobileControls, SwitchControl, DesktopControls } from '../../components'
import GameScreenFrame, { useGraphics } from '../../components/Game/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'
import { StyledPlinkoRaceBackground } from './PlinkoRaceBackground.enhanced.styles'
import { PLINKO_CONFIG, getBucketColor } from '../rtpConfig'
import { BPS_PER_WHOLE } from 'gamba-core-v2'
import { useGameSEO } from '../../hooks/ui/useGameSEO'
import type { PublicKey } from '@solana/web3.js'

// Import PlinkoRace specific components
import Lobby from './components/Lobby'
import GameScreen from './components/GameScreen'
import DebugGameScreen from './components/DebugGameScreen'

// Import sounds
import BUMP from './sounds/action.mp3'
import WIN from '../Plinko/win.mp3'
import FALL from '../Plinko/fall.mp3'

// Use centralized bet arrays from rtpConfig
const BET = PLINKO_CONFIG.normal
const DEGEN_BET = PLINKO_CONFIG.degen
const PEGS = PLINKO_CONFIG.PEGS
const BUCKETS = PLINKO_CONFIG.BUCKETS

export default function PlinkoRace() {
  // SEO for PlinkoRace game
  const seoHelmet = useGameSEO({
    gameName: "Plinko Race",
    description: "Multiplayer Plinko racing! Compete with other players as balls race down through pegs to the finish",
    rtp: 98,
    maxWin: "1000x"
  })

  console.log('🎯 PLINKO RACE COMPONENT LOADING...')
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const pool = useCurrentPool()
  const [wager, setWager] = useWagerInput()
  const [debug, setDebug] = React.useState(false)
  const [degen, setDegen] = React.useState(false)

  // Pool restrictions
  const maxMultiplier = React.useMemo(() => {
    const normalMax = Math.max(...PLINKO_CONFIG.normal)
    const degenMax = Math.max(...PLINKO_CONFIG.degen)
    return Math.max(normalMax, degenMax)
  }, [])

  const maxWagerForPool = React.useMemo(() => {
    return pool.maxPayout / maxMultiplier
  }, [pool.maxPayout, maxMultiplier])

  const maxPayout = wager * maxMultiplier
  const poolExceeded = maxPayout > pool.maxPayout

  // useEffect to clamp wager like Plinko
  React.useEffect(() => {
    if (wager > maxWagerForPool) {
      setWager(maxWagerForPool)
    }
  }, [maxWagerForPool, wager, setWager])
  
  // Get graphics settings to check if effects are enabled
  const { settings } = useGraphics()

  // PlinkoRace specific state
  const [selectedGame, setSelectedGame] = useState<PublicKey | null>(null)
  const [debugMode, setDebugMode] = useState(false)

  // Sound effects
  const sounds = useSound({
    bump: BUMP,
    win: WIN,
    fall: FALL,
  })

  // Enhanced accessibility effects functions for GameScreenFrame
  const triggerWinFlash = useCallback((color: string, intensity: number) => {
    // Only run enhanced visual feedback if accessibility setting is enabled
    if (!settings.enableEffects) {
      console.log('♿ Flash effect skipped - accessibility visual feedback disabled')
      return
    }
    
    console.log('♿ ACCESSIBILITY FLASH triggered:', { color, intensity })
    
    // Enhanced intensity for accessibility - make it more noticeable
    const accessibilityIntensity = Math.min(intensity * 1.5, 0.8) // Boost but cap at 80%
    
    // Try multiple ways to find the effects container
    const methods = [
      () => document.querySelector('[data-game-effects-container="true"]') as HTMLElement,
      () => document.querySelector('[data-quality]') as HTMLElement,
      () => document.querySelector('[class*="EffectsContainer"]') as HTMLElement,
      () => document.querySelector('div[style*="--flash-color"]') as HTMLElement,
      () => document.querySelector('div[style*="position: relative"][style*="width: 100%"]') as HTMLElement,
      () => {
        // Find by checking for the ::before pseudo element capability
        const divs = document.querySelectorAll('div')
        for (const div of Array.from(divs)) {
          const styles = window.getComputedStyle(div, '::before')
          if (styles.content !== 'none' && styles.position === 'absolute') {
            return div as HTMLElement
          }
        }
        return null
      },
      () => {
        // Find the container that wraps the game content
        const gameContent = document.querySelector('canvas') || document.querySelector('[data-testid="plinko-race-game"]')
        return gameContent?.closest('div[class*="motion"]') as HTMLElement || 
               gameContent?.parentElement?.parentElement as HTMLElement
      }
    ]
    
    let effectsContainer: HTMLElement | null = null
    
    for (let i = 0; i < methods.length; i++) {
      try {
        effectsContainer = methods[i]()
        if (effectsContainer) {
          console.log(`🎯 Found container using method ${i + 1}:`, effectsContainer)
          break
        }
      } catch (e) {
        console.log(`❌ Method ${i + 1} failed:`, e)
      }
    }

    if (!effectsContainer) {
      console.log('❌ No effects container found with any method')
      return
    }

    console.log('♿ Adding enhanced accessibility flash overlay')
    
    // Create enhanced flash overlay for accessibility
    const flashOverlay = document.createElement('div')
    flashOverlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: ${color};
      opacity: ${accessibilityIntensity};
      z-index: 9999;
      pointer-events: none;
      border-radius: 8px;
      border: 6px solid ${color};
      box-shadow: inset 0 0 30px ${color}, 0 0 50px ${color}, 0 0 100px ${color}80;
      transition: opacity 0.3s ease;
    `
    effectsContainer.appendChild(flashOverlay)
    
    // Add text indicator for screen readers/accessibility
    const textIndicator = document.createElement('div')
    textIndicator.setAttribute('aria-live', 'polite')
    textIndicator.setAttribute('role', 'status')
    textIndicator.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 18px;
      font-weight: bold;
      z-index: 10000;
      pointer-events: none;
      text-align: center;
      border: 2px solid ${color};
    `
    const isWin = color.includes('00ff') || color.includes('ffff')
    textIndicator.textContent = isWin ? '🏆 WIN!' : '❌ LOSE'
    effectsContainer.appendChild(textIndicator)
    
    console.log('♿ Added enhanced accessibility flash overlay with text indicator')
    
    // Remove flash effects after longer duration for accessibility
    setTimeout(() => {
      effectsContainer.classList.remove('flashing')
      if (flashOverlay.parentNode) {
        flashOverlay.style.opacity = '0'
        setTimeout(() => {
          if (flashOverlay.parentNode) {
            flashOverlay.parentNode.removeChild(flashOverlay)
          }
        }, 300)
      }
      if (textIndicator.parentNode) {
        textIndicator.style.opacity = '0'
        setTimeout(() => {
          if (textIndicator.parentNode) {
            textIndicator.parentNode.removeChild(textIndicator)
          }
        }, 300)
      }
    }, 2000) // Longer duration for accessibility
  }, [settings.enableEffects])

  const handleBack = useCallback(() => {
    setSelectedGame(null)
    setDebugMode(false)
  }, [])

  const bet = degen ? DEGEN_BET : BET
  const rows = degen ? PEGS.degen : PEGS.normal
  const buckets = degen ? BUCKETS.degen : BUCKETS.normal
  const multipliers = bet // Use exact bet array

  return (
    <>
      {seoHelmet}
      <GambaUi.Portal target="screen">
        <StyledPlinkoRaceBackground>
          {/* Velocity vortex background elements */}
          <div className="velocity-bg-elements" />
          <div className="race-whispers-overlay" />
          <div className="lightning-speed-indicator" />
          
          <GameScreenFrame
            title="⚡ PLINKO RACE"
            description="Where Lightning Strikes the Fastest"
          >
            <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
              <div style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10, width: '100%', height: '100%' }}>
                {debugMode ? (
                  <DebugGameScreen onBack={() => setDebugMode(false)} />
                ) : selectedGame ? (
                  <GameScreen 
                    pk={selectedGame} 
                    onBack={handleBack}
                  />
                ) : (
                  <Lobby
                    onSelect={setSelectedGame}
                    onDebug={() => setDebugMode(true)}
                  />
                )}
              </div>
            </div>
          </GameScreenFrame>
        </StyledPlinkoRaceBackground>
      </GambaUi.Portal>
      
      <GambaUi.Portal target="controls">
        <MobileControls
          wager={wager}
          setWager={setWager}
          onPlay={() => {/* PlinkoRace uses multiplayer, no direct play */}}
          hideWager={true}
          hideMessage="Join a Game Above! 🎯"
        >
          <SwitchControl
            label="Degen Mode"
            checked={degen}
            onChange={setDegen}
            disabled={gamba.isPlaying}
          />
          <SwitchControl
            label="Debug Mode"
            checked={debugMode}
            onChange={setDebugMode}
            disabled={false}
          />
        </MobileControls>
        
        <DesktopControls> {/* PlinkoRace uses multiplayer, no direct play */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            padding: '20px',
            color: '#ffd700',
            fontSize: '18px',
            fontWeight: '700',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
          }}>
            Join a Game Above! 🎯
          </div>
          <div>Degen:</div>
          <GambaUi.Switch
            disabled={gamba.isPlaying}
            checked={degen}
            onChange={setDegen}
          />
          <div>Debug:</div>
          <GambaUi.Switch
            disabled={false}
            checked={debugMode}
            onChange={setDebugMode}
          />
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}