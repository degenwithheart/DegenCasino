import React, { useState } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'

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

const InfoText = styled.p`
  text-align: center;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
`

const FormGroup = styled.div`
  margin-bottom: 20px;
`

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #ffd700;
  font-weight: bold;
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
    border-color: #ffd700;
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
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
    border-color: #ffd700;
  }
  
  option {
    background: #000;
    color: white;
  }
`

const Checkbox = styled.input`
  margin-right: 8px;
  transform: scale(1.2);
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  
  &:hover {
    color: #ffd700;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 25px;
`

const Button = styled.button.withConfig({
  shouldForwardProp: (prop) => !['variant'].includes(prop)
})<{ variant?: 'primary' | 'secondary' }>`
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

const RangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const RangeInput = styled.input`
  flex: 1;
`

const RangeValue = styled.span`
  min-width: 30px;
  color: #ffd700;
  font-weight: bold;
`

export interface SingleplayerGameConfig {
  wagerMode: 'fixed' | 'random'
  fixedWager: number
  minWager?: number
  maxWager?: number
  gameDuration: number
  autoStart: boolean
  showBotActions: boolean
}

interface CreateSingleplayerGameModalProps {
  onClose: () => void
  onConfigureGame: (config: SingleplayerGameConfig) => void
}

export default function CreateSingleplayerGameModal({ onClose, onConfigureGame }: CreateSingleplayerGameModalProps) {
  const [wagerMode, setWagerMode] = useState<'fixed' | 'random'>('fixed')
  const [fixedWager, setFixedWager] = useState(1000000) // 1 SOL in lamports
  const [minWager, setMinWager] = useState(500000) // 0.5 SOL
  const [maxWager, setMaxWager] = useState(2000000) // 2 SOL
  const [gameDuration, setGameDuration] = useState(30)
  const [autoStart, setAutoStart] = useState(true)
  const [showBotActions, setShowBotActions] = useState(true)

  const handleStartGame = () => {
    const config: SingleplayerGameConfig = {
      wagerMode,
      fixedWager,
      minWager: wagerMode === 'random' ? minWager : undefined,
      maxWager: wagerMode === 'random' ? maxWager : undefined,
      gameDuration,
      autoStart,
      showBotActions
    }
    
    onConfigureGame(config)
    onClose()
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
          
          <Title>🎰 Singleplayer Game Setup</Title>
          
          <InfoText>
            Configure your singleplayer roulette game. You'll play against the house with 3 AI opponents at your table!
          </InfoText>

          <FormGroup>
            <Label>Wager Mode</Label>
            <Select
              value={wagerMode}
              onChange={(e) => setWagerMode(e.target.value as 'fixed' | 'random')}
            >
              <option value="fixed">Fixed Wager (All players bet same amount)</option>
              <option value="random">Random Wagers (Players bet different amounts)</option>
            </Select>
          </FormGroup>

          {wagerMode === 'fixed' ? (
            <FormGroup>
              <Label>Fixed Wager Amount (SOL)</Label>
              <Input
                type="number"
                value={fixedWager / 1000000000}
                onChange={(e) => setFixedWager(Number(e.target.value) * 1000000000)}
                step="0.001"
                min="0.001"
                placeholder="1.0"
              />
            </FormGroup>
          ) : (
            <>
              <FormGroup>
                <Label>Minimum Wager (SOL)</Label>
                <Input
                  type="number"
                  value={minWager / 1000000000}
                  onChange={(e) => setMinWager(Number(e.target.value) * 1000000000)}
                  step="0.001"
                  min="0.001"
                  placeholder="0.5"
                />
              </FormGroup>
              <FormGroup>
                <Label>Maximum Wager (SOL)</Label>
                <Input
                  type="number"
                  value={maxWager / 1000000000}
                  onChange={(e) => setMaxWager(Number(e.target.value) * 1000000000)}
                  step="0.001"
                  min="0.001"
                  placeholder="2.0"
                />
              </FormGroup>
            </>
          )}

          <FormGroup>
            <Label>Betting Phase Duration (seconds)</Label>
            <RangeContainer>
              <RangeInput
                type="range"
                min="10"
                max="60"
                value={gameDuration}
                onChange={(e) => setGameDuration(Number(e.target.value))}
              />
              <RangeValue>{gameDuration}s</RangeValue>
            </RangeContainer>
          </FormGroup>

          <FormGroup>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={autoStart}
                onChange={(e) => setAutoStart(e.target.checked)}
              />
              Auto-start next round after results
            </CheckboxLabel>
          </FormGroup>

          <ButtonGroup>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleStartGame}>
              🎮 Start Singleplayer Game
            </Button>
          </ButtonGroup>
        </ModalContent>
      </ModalOverlay>
    </AnimatePresence>
  )
}