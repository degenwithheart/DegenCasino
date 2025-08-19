import React, { useState } from 'react'
import styled from 'styled-components'
import { PublicKey } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { useMultiplayer } from 'gamba-react-v2'
import { useCurrentToken, TokenValue, useWagerInput, FAKE_TOKEN_MINT } from 'gamba-react-ui-v2'

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`

const Modal = styled.div`
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95));
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  border: 1px solid rgba(79, 70, 229, 0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
`

const Title = styled.h2`
  color: #f0f0ff;
  margin: 0 0 24px 0;
  font-size: 28px;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
`

const Subtitle = styled.p`
  color: #d0d0ea;
  margin: 0 0 32px 0;
  text-align: center;
  opacity: 0.9;
  font-size: 16px;
`

const FormGroup = styled.div`
  margin-bottom: 24px;
`

const Label = styled.label`
  display: block;
  color: #e5e5ff;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid rgba(79, 70, 229, 0.3);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  font-size: 16px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 12px rgba(79, 70, 229, 0.3);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid rgba(79, 70, 229, 0.3);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  font-size: 16px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 12px rgba(79, 70, 229, 0.3);
  }
  
  option {
    background: #1f2937;
    color: #fff;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;
`

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 14px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-size: 16px;
  transition: all 0.2s ease;
  
  ${({ variant = 'primary' }) => variant === 'primary' ? `
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
    }
  ` : `
    background: rgba(107, 114, 128, 0.2);
    color: #d1d5db;
    border: 1px solid rgba(107, 114, 128, 0.3);
    
    &:hover {
      background: rgba(107, 114, 128, 0.3);
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

const InfoBox = styled.div`
  background: rgba(79, 70, 229, 0.1);
  border: 1px solid rgba(79, 70, 229, 0.3);
  border-radius: 8px;
  padding: 16px;
  margin: 20px 0;
  
  h4 {
    color: #e5e5ff;
    margin: 0 0 8px 0;
    font-size: 14px;
    text-transform: uppercase;
  }
  
  p {
    color: #d0d0ea;
    margin: 0;
    font-size: 13px;
    line-height: 1.4;
  }
`

interface CreateGameModalProps {
  onClose: () => void
  onGameCreated: (pk: PublicKey) => void
}

export default function CreateGameModal({ onClose, onGameCreated }: CreateGameModalProps) {
  const { publicKey } = useWallet()
  const { createGame } = useMultiplayer()
  const token = useCurrentToken()
  const [wager, setWager] = useWagerInput()
  const [wagerType, setWagerType] = useState<'same' | 'range'>('same')
  const [minBet, setMinBet] = useState('')
  const [maxBet, setMaxBet] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isFreeToken = token.mint.equals(FAKE_TOKEN_MINT)

  const handleCreate = async () => {
    if (creating) return
    if (!publicKey) {
      setError('Connect wallet first')
      return
    }
    if (isFreeToken) {
      setError('Multiplayer games require real tokens. Please select a live token.')
      return
    }
    
    try {
      setCreating(true)
      setError(null)
      
      const opts: any = {
        mint: token.mint,
        creatorAddress: publicKey,
        maxPlayers: 2, // 1v1 duel
        softDuration: 300, // 5 minutes
        preAllocPlayers: 2,
        winnersTarget: 1,
        wagerType: wagerType === 'same' ? 0 : 2, // 0 = sameWager, 2 = betRange
        payoutType: 0,
      }

      if (wagerType === 'same') {
        const lam = Math.floor(wager)
        opts.wager = lam
        opts.minBet = lam
        opts.maxBet = lam
      } else {
        const minLam = Math.floor(parseFloat(minBet) * token.baseWager)
        const maxLam = Math.floor(parseFloat(maxBet) * token.baseWager)
        opts.wager = minLam
        opts.minBet = minLam
        opts.maxBet = maxLam
      }

      const gamePublicKey = await createGame(opts)
      onGameCreated(new PublicKey(gamePublicKey))
    } catch (error: any) {
      console.error('Failed to create game:', error)
      setError(error.message || 'Failed to create game')
    } finally {
      setCreating(false)
    }
  }

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>⚔️ Create Flip Duel</Title>
        <Subtitle>Challenge someone to a 1v1 coin flip battle where destiny decides the victor</Subtitle>
        
        <FormGroup>
          <Label>Wager Type</Label>
          <Select 
            value={wagerType} 
            onChange={(e) => setWagerType(e.target.value as 'same' | 'range')}
          >
            <option value="same">Fixed Wager (both players bet the same)</option>
            <option value="range">Custom Range (players choose within range)</option>
          </Select>
        </FormGroup>

        {wagerType === 'same' ? (
          <FormGroup>
            <Label>Wager Amount</Label>
            <Input
              type="number"
              value={wager / (10 ** token.decimals)}
              onChange={(e) => setWager(parseFloat(e.target.value || '0') * (10 ** token.decimals))}
              placeholder="Enter amount to wager"
              step="0.001"
              min="0"
            />
          </FormGroup>
        ) : (
          <>
            <FormGroup>
              <Label>Minimum Bet</Label>
              <Input
                type="number"
                value={minBet}
                onChange={(e) => setMinBet(e.target.value)}
                placeholder="Minimum bet amount"
                step="0.001"
                min="0"
              />
            </FormGroup>
            <FormGroup>
              <Label>Maximum Bet</Label>
              <Input
                type="number"
                value={maxBet}
                onChange={(e) => setMaxBet(e.target.value)}
                placeholder="Maximum bet amount"
                step="0.001"
                min="0"
              />
            </FormGroup>
          </>
        )}

        <InfoBox>
          <h4>🪙 How Flip Duels Work</h4>
          <p>
            Two players enter, both choose heads or tails, then fate decides. 
            The winner takes the pot (minus platform fees). 
            If both players choose the same side, the game resolves based on the coin flip result.
          </p>
        </InfoBox>

        {isFreeToken && (
          <InfoBox style={{ borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.1)' }}>
            <h4>⚠️ Real Tokens Required</h4>
            <p>
              Multiplayer games require real tokens, not fake money. Please select a live token from the dropdown.
            </p>
          </InfoBox>
        )}

        {error && (
          <InfoBox style={{ borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.1)' }}>
            <h4>❌ Error</h4>
            <p>{error}</p>
          </InfoBox>
        )}

        <ButtonGroup>
          <Button variant="secondary" onClick={onClose} disabled={creating}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={creating || wager <= 0 || isFreeToken}>
            {creating ? 'Creating...' : 'Create Duel'}
          </Button>
        </ButtonGroup>
      </Modal>
    </Overlay>
  )
}
