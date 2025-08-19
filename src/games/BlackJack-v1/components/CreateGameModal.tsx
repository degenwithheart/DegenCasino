import React, { useState } from 'react'
import styled from 'styled-components'
import { PublicKey } from '@solana/web3.js'
import { TokenValue } from 'gamba-react-ui-v2'
import { useCurrentToken } from 'gamba-react-ui-v2'

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`

const ModalContent = styled.div`
  padding: 24px;
  max-width: 500px;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 16px;
  border: 1px solid #333;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`

const Title = styled.h2`
  color: #f0f0ff;
  margin: 0 0 20px 0;
  font-size: 24px;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Label = styled.label`
  color: #d0d0ea;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #444;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  color: #e5e5e5;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  }
  
  &::placeholder {
    color: #666;
  }
`

const Select = styled.select`
  padding: 12px 16px;
  border: 1px solid #444;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  color: #e5e5e5;
  font-size: 16px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  }
  
  option {
    background: #1a1a2e;
    color: #e5e5e5;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 14px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  
  ${({ variant = 'primary' }) =>
    variant === 'primary'
      ? `
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
          }
        `
      : `
          background: rgba(107, 114, 128, 0.2);
          color: #d1d5db;
          border: 1px solid #374151;
          
          &:hover {
            background: rgba(107, 114, 128, 0.3);
          }
        `
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

const HelpText = styled.p`
  color: #9ca3af;
  font-size: 12px;
  margin: 4px 0 0 0;
  line-height: 1.4;
`

const PresetButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

const PresetButton = styled.button<{ selected?: boolean }>`
  padding: 8px 12px;
  border: 1px solid ${({ selected }) => (selected ? '#4f46e5' : '#444')};
  border-radius: 6px;
  background: ${({ selected }) => (selected ? 'rgba(79, 70, 229, 0.2)' : 'rgba(0, 0, 0, 0.3)')};
  color: ${({ selected }) => (selected ? '#a5b4fc' : '#d1d5db')};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #4f46e5;
  }
`

export default function CreateGameModal({
  onClose,
  onGameCreated,
}: {
  onClose: () => void
  onGameCreated: (gameId: PublicKey) => void
}) {
  const token = useCurrentToken()
  
  const [wagerType, setWagerType] = useState<'fixed' | 'range'>('fixed')
  const [betAmount, setBetAmount] = useState('')
  const [minBet, setMinBet] = useState('')
  const [maxBet, setMaxBet] = useState('')
  const [maxPlayers] = useState(2) // Always 2 for 1v1
  const [timeLimit, setTimeLimit] = useState('300') // 5 minutes default
  const [creating, setCreating] = useState(false)

  // Preset bet amounts (in lamports for SOL, adjust for other tokens)
  const presets = [
    { label: '0.01', value: '0.01' },
    { label: '0.05', value: '0.05' },
    { label: '0.1', value: '0.1' },
    { label: '0.5', value: '0.5' },
    { label: '1.0', value: '1.0' },
    { label: '5.0', value: '5.0' },
  ]

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (creating) return
    
    try {
      setCreating(true)
      
      const wagerAmount = parseFloat(wagerType === 'fixed' ? betAmount : minBet)
      const maxWagerAmount = parseFloat(wagerType === 'range' ? maxBet : betAmount)
      
      if (isNaN(wagerAmount) || wagerAmount <= 0) {
        throw new Error('Please enter a valid bet amount')
      }
      
      if (wagerType === 'range' && (isNaN(maxWagerAmount) || maxWagerAmount <= wagerAmount)) {
        throw new Error('Max bet must be greater than min bet')
      }

      // This is a placeholder - in a real implementation, you'd use the actual multiplayer API
      // to create a game. For now, we'll generate a fake game ID
      const fakeGameId = new PublicKey('11111111111111111111111111111111')
      onGameCreated(fakeGameId)
      
    } catch (error) {
      console.error('Failed to create game:', error)
      // Handle error (you might want to add toast notifications)
    } finally {
      setCreating(false)
    }
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Title>🃏 Create BlackJack Duel</Title>
        
        <Form onSubmit={handleCreate}>
          <FormGroup>
            <Label>Betting Structure</Label>
            <Select
              value={wagerType}
              onChange={(e) => setWagerType(e.target.value as 'fixed' | 'range')}
            >
              <option value="fixed">Fixed Bet Amount</option>
              <option value="range">Betting Range</option>
            </Select>
            <HelpText>
              {wagerType === 'fixed' 
                ? 'Both players bet the same fixed amount'
                : 'Players can bet within a range you specify'
              }
            </HelpText>
          </FormGroup>

          {wagerType === 'fixed' ? (
            <FormGroup>
              <Label>Bet Amount ({token.symbol})</Label>
              <Input
                type="number"
                step="0.001"
                min="0"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder={`Enter amount in ${token.symbol}`}
                required
              />
              <PresetButtons>
                {presets.map((preset) => (
                  <PresetButton
                    key={preset.value}
                    type="button"
                    selected={betAmount === preset.value}
                    onClick={() => setBetAmount(preset.value)}
                  >
                    {preset.label} {token.symbol}
                  </PresetButton>
                ))}
              </PresetButtons>
            </FormGroup>
          ) : (
            <>
              <FormGroup>
                <Label>Minimum Bet ({token.symbol})</Label>
                <Input
                  type="number"
                  step="0.001"
                  min="0"
                  value={minBet}
                  onChange={(e) => setMinBet(e.target.value)}
                  placeholder={`Min amount in ${token.symbol}`}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Maximum Bet ({token.symbol})</Label>
                <Input
                  type="number"
                  step="0.001"
                  min="0"
                  value={maxBet}
                  onChange={(e) => setMaxBet(e.target.value)}
                  placeholder={`Max amount in ${token.symbol}`}
                  required
                />
              </FormGroup>
            </>
          )}

          <FormGroup>
            <Label>Time Limit</Label>
            <Select
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
            >
              <option value="180">3 minutes</option>
              <option value="300">5 minutes</option>
              <option value="600">10 minutes</option>
              <option value="900">15 minutes</option>
              <option value="1800">30 minutes</option>
              <option value="0">No limit</option>
            </Select>
            <HelpText>
              How long the game can remain open before it automatically closes
            </HelpText>
          </FormGroup>

          <ButtonGroup>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={creating}>
              {creating ? 'Creating...' : 'Create Duel'}
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  )
}
