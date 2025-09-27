import React, { useState } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { useMultiplayer } from 'gamba-react-v2'
import { useCurrentToken, GambaUi, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'
import { PublicKey } from '@solana/web3.js'
import { CONFIG } from '../constants'
import { MULTIPLAYER_SHARED } from '../../rtpConfigMultiplayer'

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2);
  }
`

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`

const ModalContent = styled(motion.div)`
  background: linear-gradient(135deg, rgba(139, 69, 19, 0.9) 0%, rgba(0, 0, 0, 0.95) 100%);
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 16px;
  padding: 30px;
  max-width: 500px;
  width: 100%;
  color: white;
  position: relative;
`

const Title = styled.h2`
  text-align: center;
  margin-bottom: 25px;
  color: #ffd700;
  font-size: 1.5rem;
`

const FormGroup = styled.div`
  margin-bottom: 20px;
`

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #ffd700;
`

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 215, 0, 0.6);
  }
`

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 215, 0, 0.6);
  }

  option {
    background: rgba(0, 0, 0, 0.9);
    color: white;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 25px;
`

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.variant === 'primary' ? css`
    background: linear-gradient(45deg, #ff6b6b, #ffd700);
    color: white;
    animation: ${glowPulse} 3s ease-in-out infinite;
    
    &:hover {
      transform: scale(1.05);
    }
  ` : css`
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    animation: none;
  }
`

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`

const ErrorMessage = styled.div`
  color: #ff6b6b;
  text-align: center;
  margin-top: 15px;
  font-size: 0.9rem;
`

const InfoText = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 15px;
  line-height: 1.4;
`

interface CreateGameModalProps {
  onClose: () => void
}

export default function CreateGameModal({ onClose }: CreateGameModalProps) {
  const { publicKey } = useWallet()
  const { createGame } = useMultiplayer()
  const token = useCurrentToken()
  const isFreeToken = token.mint.equals(FAKE_TOKEN_MINT)

  const [maxPlayers, setMaxPlayers] = useState<number>(CONFIG.MAX_PLAYERS)
  const [wagerType, setWagerType] = useState<'sameWager' | 'customWager' | 'betRange'>('sameWager')
  const [fixedWager, setFixedWager] = useState<number>(1)
  const [minBet, setMinBet] = useState<number>(0.1)
  const [maxBet, setMaxBet] = useState<number>(5)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!publicKey) return setError('Connect wallet first')
    if (isFreeToken) return setError('Multiplayer games require real tokens. Please select a live token.')
    
    setSubmitting(true)
    setError(null)

    const softDuration = CONFIG.BETTING_TIME_SECONDS
    const preAlloc = Math.min(maxPlayers, 5)
    const winnersTarget = 1 // Winner takes all

    const opts: any = {
      mint: token.mint,
      creatorAddress: publicKey,
      maxPlayers,
      softDuration,
      preAllocPlayers: preAlloc,
      winnersTarget,
      wagerType: ['sameWager', 'customWager', 'betRange'].indexOf(wagerType),
      payoutType: 0, // Winner takes all
    }

    if (wagerType === 'sameWager') {
      opts.wager = Math.floor(fixedWager * token.baseWager)
    } else if (wagerType === 'betRange') {
      opts.minBet = Math.floor(minBet * token.baseWager)
      opts.maxBet = Math.floor(maxBet * token.baseWager)
    }

    try {
      await createGame(opts)
      onClose() // Close modal after successful creation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create game')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <ModalContent
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <CloseButton onClick={onClose}>×</CloseButton>
          
          <Title>🎰 Create New Roulette Table</Title>
          
          <InfoText>
            Create your own roulette table and invite other players to join. 
            Winner takes the entire prize pool!
          </InfoText>

          <FormGroup>
            <Label>Maximum Players (2-{CONFIG.MAX_PLAYERS})</Label>
            <Input
              type="number"
              min="2"
              max={CONFIG.MAX_PLAYERS}
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(Math.max(2, Math.min(CONFIG.MAX_PLAYERS, parseInt(e.target.value) || 2)))}
            />
          </FormGroup>

          <FormGroup>
            <Label>Betting Type</Label>
            <Select
              value={wagerType}
              onChange={(e) => setWagerType(e.target.value as any)}
            >
              <option value="sameWager">Fixed Wager (All players bet same amount)</option>
              <option value="betRange">Bet Range (Players choose within range)</option>
            </Select>
          </FormGroup>

          {wagerType === 'sameWager' && (
            <FormGroup>
              <Label>Fixed Wager Amount ({token.symbol})</Label>
              <Input
                type="number"
                min={CONFIG.MIN_WAGER}
                max={CONFIG.MAX_WAGER_MULTIPLIER * CONFIG.MIN_WAGER}
                step="0.01"
                value={fixedWager}
                onChange={(e) => setFixedWager(parseFloat(e.target.value) || CONFIG.MIN_WAGER)}
              />
            </FormGroup>
          )}

          {wagerType === 'betRange' && (
            <>
              <FormGroup>
                <Label>Minimum Bet ({token.symbol})</Label>
                <Input
                  type="number"
                  min={CONFIG.MIN_WAGER}
                  step="0.01"
                  value={minBet}
                  onChange={(e) => setMinBet(parseFloat(e.target.value) || CONFIG.MIN_WAGER)}
                />
              </FormGroup>
              <FormGroup>
                <Label>Maximum Bet ({token.symbol})</Label>
                <Input
                  type="number"
                  min={minBet}
                  step="0.01"
                  value={maxBet}
                  onChange={(e) => setMaxBet(Math.max(minBet, parseFloat(e.target.value) || minBet))}
                />
              </FormGroup>
            </>
          )}

          <ButtonGroup>
            <Button variant="secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmit} 
              disabled={submitting || isFreeToken || !publicKey}
            >
              {submitting ? 'Creating...' : 'Create Table'}
            </Button>
          </ButtonGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}
        </ModalContent>
      </ModalOverlay>
    </AnimatePresence>
  )
}
