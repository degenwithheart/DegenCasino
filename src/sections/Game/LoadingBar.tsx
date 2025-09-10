import { decodeGame, getGameAddress } from 'gamba-core-v2'
import { useAccount, useTransactionStore, useWalletAddress } from 'gamba-react-v2'
import React, { useMemo } from 'react'
import styled, { css, keyframes } from 'styled-components'

// Container that holds all the progress bars in a row
const Container = styled.div`
  display: flex;
  width: 100%;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(212, 165, 116, 0.04);
  border-radius: 16px;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(212, 165, 116, 0.15);
  box-shadow: 
    0 0 20px rgba(212, 165, 116, 0.1),
    0 4px 16px rgba(139, 90, 158, 0.08);
`

// Romantic glowing pulse animation - like a gentle heartbeat
const romanticPulse = keyframes`
  0%, 100% { 
    opacity: 0.3;
    box-shadow: 
      0 0 8px rgba(212, 165, 116, 0.2),
      0 0 16px rgba(184, 51, 106, 0.1);
  }
  50% { 
    opacity: 0.8;
    box-shadow: 
      0 0 16px rgba(212, 165, 116, 0.4),
      0 0 32px rgba(184, 51, 106, 0.2),
      0 0 48px rgba(139, 90, 158, 0.1);
  }
`

// Dreamy floating animation - like love letters in the wind
const dreamyFloat = keyframes`
  0%, 100% { 
    transform: translateY(0px);
    filter: brightness(1);
  }
  25% { 
    transform: translateY(-2px);
    filter: brightness(1.1);
  }
  75% { 
    transform: translateY(1px);
    filter: brightness(0.95);
  }
`

// Individual progress bar with romantic styling
const Bar = styled.div<{$state: 'none' | 'loading' | 'finished'}>`
  flex-grow: 1;
  height: 8px;
  border-radius: 12px;
  background: rgba(212, 165, 116, 0.12);
  border: 1px solid rgba(212, 165, 116, 0.08);
  backdrop-filter: blur(4px);
  position: relative;
  overflow: hidden;

  /* Add a subtle inner glow */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, 
      rgba(212, 165, 116, 0.2) 0%, 
      rgba(184, 51, 106, 0.15) 50%, 
      rgba(139, 90, 158, 0.1) 100%
    );
    border-radius: 12px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  /* When the step is waiting (not started yet) */
  ${({ $state }) =>
    $state === 'none' &&
    css`
      opacity: 0.3;
    `}

  /* When the step is currently loading (active) */
  ${({ $state }) =>
    $state === 'loading' &&
    css`
      background: linear-gradient(90deg, 
        #d4a574 0%, 
        #b8336a 50%, 
        #8b5a9e 100%
      );
      opacity: 1;
      animation: ${romanticPulse} 1.5s ease-in-out infinite;
      
      &::before {
        opacity: 1;
        animation: ${dreamyFloat} 2s ease-in-out infinite;
      }
    `}

  /* When the step is completed (finished) */
  ${({ $state }) =>
    $state === 'finished' &&
    css`
      background: linear-gradient(90deg, 
        #d4a574 0%, 
        #e8c49a 100%
      );
      opacity: 1;
      box-shadow: 
        0 0 12px rgba(212, 165, 116, 0.3),
        0 2px 8px rgba(139, 90, 158, 0.1);
      
      &::before {
        opacity: 0.8;
      }
    `}
`

// These are the 3 steps that happen when you place a bet
// Think of it like ordering food: Sign -> Pay -> Get your meal
const steps = ['🖋️ Signing', '🚀 Sending', '🎲 Playing'] as const

/**
 * This hook tracks what stage your bet is in
 * Returns an array of 3 states: one for each step above
 * Each state can be: 'none' (waiting), 'loading' (happening now), or 'finished' (done)
 */
export function useLoadingState(): Array<'none' | 'loading' | 'finished'> {
  // Get your wallet address (who you are)
  const user = useWalletAddress()
  
  // Get info about your current transaction (your bet)
  const tx = useTransactionStore()
  
  // Get info about the game state on the blockchain
  const game = useAccount(getGameAddress(user), decodeGame)

  // Figure out what the game is currently doing
  const status = useMemo<string | null>(
    () => (game?.status ? Object.keys(game.status)[0] : null),
    [game?.status]
  )

  // Start with all steps as 'none' (not started yet)
  const states: Array<'none' | 'loading' | 'finished'> = ['none', 'none', 'none']

  // Only show progress if you're actually placing a bet
  if (tx.label !== 'play') return states

  // STEP 1: Signing your bet (like signing a receipt)
  if (tx.state === 'simulating' || tx.state === 'signing') {
    states[0] = 'loading' // First bar glows - you're signing
    return states
  }

  // STEP 2: Sending your bet to the blockchain (like mailing a letter)
  if (tx.state === 'processing' || tx.state === 'sending') {
    states[0] = 'finished' // First bar is solid - signing done
    states[1] = 'loading'  // Second bar glows - sending now
    return states
  }

  // STEP 3: Getting your result (like waiting for your lottery numbers)
  if (tx.state === 'confirming' || status === 'ResultRequested') {
    states[0] = 'finished' // First bar solid - signing done
    states[1] = 'finished' // Second bar solid - sending done
    states[2] = 'loading'  // Third bar glows - getting result
    return states
  }

  // All done! Game is ready for next bet
  if (status === 'Ready') {
    return states
  }

  return states
}

// Label that shows above the progress bars
const ProgressLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #f4e9e1;
  text-align: center;
  margin-bottom: 8px;
  text-shadow: 0 0 8px rgba(212, 165, 116, 0.3);
  font-family: 'DM Sans', sans-serif;
  letter-spacing: 0.5px;
`

// Wrapper for the whole loading component
const LoadingWrapper = styled.div`
  width: 100%;
`

/**
 * The main loading bar component
 * Shows a beautiful progress indicator when you place bets
 * Has 3 steps: Sign your bet -> Send to blockchain -> Get your result
 */
export function LoadingBar() {
  const states = useLoadingState()
  
  // Figure out what step we're currently on
  const currentStep = states.findIndex(state => state === 'loading')
  const isActive = states.some(state => state === 'loading')
  
  // Get a nice message to show the user
  const getMessage = () => {
    if (!isActive) return 'Ready to play! 🎮'
    
    switch (currentStep) {
      case 0: return 'Please sign your bet... 🖋️'
      case 1: return 'Sending to blockchain... 🚀'
      case 2: return 'Getting your result... 🎯'
      default: return 'Processing your bet... ✨'
    }
  }

  return (
    <LoadingWrapper>
      <ProgressLabel>{getMessage()}</ProgressLabel>
      <Container>
        {states.map((state, i) => (
          <Bar key={i} $state={state} />
        ))}
      </Container>
    </LoadingWrapper>
  )
}
