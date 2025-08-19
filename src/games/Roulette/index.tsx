import { computed } from '@preact/signals-react'
import { GambaUi, TokenValue, useCurrentPool, useCurrentToken, useSound, useUserBalance } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React, { useState } from 'react'
import styled from 'styled-components'
import { EnhancedButton, EnhancedPlayButton, MobileControls, OptionSelector, DesktopControls } from '../../components'
import GameScreenFrame from '../../components/GameScreenFrame'
import { useGameMeta } from '../useGameMeta'
import { Chip } from './Chip'
import { StyledResults } from './Roulette.styles'
import { StyledRouletteBackground } from './RouletteBackground.enhanced.styles'
import { Table } from './Table'
import { Wheel } from './Wheel'
import { CHIPS, SOUND_LOSE, SOUND_PLAY, SOUND_WIN } from './constants'
import { addResult, bet, clearChips, results, selectedChip, totalChipValue } from './signals'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
  gap: 20px;
  user-select: none;
  -webkit-user-select: none;
  color: white;
  box-sizing: border-box;
  position: relative;
  z-index: 100;
  pointer-events: auto;
  @media (min-width: 600px) {
    max-width: 900px;
    padding: 24px 24px;
  }
  @media (min-width: 1000px) {
    max-width: 1100px;
    padding: 32px 32px;
  }
  @media (max-width: 767px) {
    width: 100vw;
    max-width: 100vw;
    padding: 8px 0;
    margin: 0 auto;
    box-sizing: border-box;
    overflow-x: hidden;
  }
`
function Results() {
  const _results = computed(() => [...results.value].reverse())
  return (
    <StyledResults>
      {_results.value.map((index, i) => {
        return (
          <div key={i}>
            {index + 1}
          </div>
        )
      })}
    </StyledResults>
  )
}

function Stats() {
  const pool = useCurrentPool()
  const token = useCurrentToken()
  const balance = useUserBalance()
  const wager = totalChipValue.value * token.baseWager / 10_000

  const multiplier = Math.max(...bet.value)
  const maxPayout = multiplier * wager
  const maxPayoutExceeded = maxPayout > pool.maxPayout
  const balanceExceeded = wager > (balance.balance + balance.bonusBalance)

  return (
    <div style={{ textAlign: 'center', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <div>
        {balanceExceeded ? (
          <span style={{ color: '#ff0066' }}>
            TOO HIGH
          </span>
        ) : (
          <>
            <TokenValue amount={wager} />
          </>
        )}
        <div>Wager</div>
      </div>
      <div>
        <div>
          {maxPayoutExceeded ? (
            <span style={{ color: '#ff0066' }}>
              TOO HIGH
            </span>
          ) : (
            <>
              <TokenValue amount={maxPayout} />
              ({multiplier.toFixed(2)}x)
            </>
          )}
        </div>
        <div>Potential win</div>
      </div>
    </div>
  )
}

export default function Roulette() {
  const game = GambaUi.useGame()
  const token = useCurrentToken()
  const pool = useCurrentPool()
  const balance = useUserBalance()
  const gamba = useGamba()
  
  // Multi-phase state management
  const [gamePhase, setGamePhase] = useState<'betting' | 'spinning'>('betting')
  const [spinResult, setSpinResult] = useState<number | null>(null)

  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    play: SOUND_PLAY,
  })

  const wager = totalChipValue.value * token.baseWager / 10_000

  const multiplier = Math.max(...bet.value)
  const maxPayout = multiplier * wager
  const maxPayoutExceeded = maxPayout > pool.maxPayout
  const balanceExceeded = wager > (balance.balance + balance.bonusBalance)

  const play = async () => {
    // Phase 1: Transition to wheel
    setGamePhase('spinning')
    sounds.play('play')
    
    try {
      // Start the game
      await game.play({
        bet: bet.value,
        wager,
      })
      
      // Get result
      const result = await game.result()
      setSpinResult(result.resultIndex)
      addResult(result.resultIndex)
      
      // Play win/lose sound after result is known
      if (result.payout > 0) {
        setTimeout(() => sounds.play('win'), 3000)
      } else {
        setTimeout(() => sounds.play('lose'), 3000)
      }
    } catch (error) {
      console.error('Game error:', error)
      setGamePhase('betting')
      setSpinResult(null)
    }
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <StyledRouletteBackground style={{ pointerEvents: 'none' }}>
          {/* Velvet romance background elements */}
          <div className="velvet-bg-elements" />
          <div className="whispers-overlay" />
          <div className="eternal-romance-indicator" />
          
          {/* Themed Header */}
          <div className="roulette-header" style={{ 
            position: 'absolute', 
            top: '20px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            zIndex: 3,
            textAlign: 'center',
            pointerEvents: 'none'
          }}>
            <h2 style={{ 
              color: '#faf5ff', 
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)', 
              margin: 0,
              fontSize: '24px',
              fontWeight: 'bold'
            }}>🎰 ROULETTE</h2>
            <p style={{ 
              color: '#e8c5e8', 
              textShadow: '1px 1px 2px rgba(0,0,0,0.6)', 
              margin: 0,
              fontSize: '14px'
            }}>Where Fortune Flirts in Velvet Rooms</p>
          </div>
          
        <GameScreenFrame 
          {...(useGameMeta('roulette') && { title: useGameMeta('roulette')!.name, description: useGameMeta('roulette')!.description })}
        >
          <GambaUi.Responsive>
            <Wrapper onContextMenu={(e) => e.preventDefault()}>
              {gamePhase === 'betting' ? (
                <>
                  <Stats />
                  <Results />
                  <Table />
                </>
              ) : (
                <Wheel 
                  result={spinResult} 
                  onSpinComplete={() => {
                    // This will be called when wheel animation completes
                    setTimeout(() => {
                      setGamePhase('betting')
                      setSpinResult(null)
                    }, 1000)
                  }}
                />
              )}
            </Wrapper>
          </GambaUi.Responsive>
        </GameScreenFrame>
        </StyledRouletteBackground>
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <MobileControls
          wager={totalChipValue.value}
          setWager={() => {}} // Roulette uses chip betting system
          onPlay={play}
          playDisabled={!wager || balanceExceeded || maxPayoutExceeded}
          playText="Spin"
        >
          <OptionSelector
            label="Chip Value"
            options={CHIPS.map(chip => ({
              value: chip,
              label: `${chip}`
            }))}
            selected={selectedChip.value}
            onSelect={(value) => selectedChip.value = value}
          />
        </MobileControls>
        
        <DesktopControls>
          <OptionSelector
            label="Chip Value"
            options={CHIPS.map(chip => ({
              value: chip,
              label: `${chip}`
            }))}
            selected={selectedChip.value}
            onSelect={(value) => selectedChip.value = value}
          />
          <EnhancedButton
            disabled={!wager || gamba.isPlaying}
            onClick={clearChips}
          >
            Clear
          </EnhancedButton>
          <EnhancedPlayButton disabled={!wager || balanceExceeded || maxPayoutExceeded} onClick={play}>
            Spin
          </EnhancedPlayButton>
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}
