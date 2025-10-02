import React, { useState, useCallback, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useMultiplayer } from 'gamba-react-v2'
import { useCurrentToken, GambaUi, TokenValue } from 'gamba-react-ui-v2'
import { PublicKey } from '@solana/web3.js'
import styled, { keyframes } from 'styled-components'
import { POKER_COLORS, CONFIG } from '../constants'
import { DrawStrategy } from '../types'
import { PLATFORM_CREATOR_ADDRESS } from '../../../constants'

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(255, 215, 0, 0.6);
  }
`

const CreateGameContainer = styled.div`
  background: linear-gradient(135deg, ${POKER_COLORS.felt} 0%, ${POKER_COLORS.table} 100%);
  border-radius: 20px;
  padding: 30px;
  margin: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 3px solid ${POKER_COLORS.gold};
  color: ${POKER_COLORS.text};
`

const Title = styled.h2`
  color: ${POKER_COLORS.gold};
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
`

const FormSection = styled.div`
  background: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 15px;
  border: 2px solid rgba(255, 215, 0, 0.2);
`

const SectionTitle = styled.h3`
  color: ${POKER_COLORS.gold};
  margin-bottom: 15px;
  font-size: 18px;
`

const InputGroup = styled.div`
  margin-bottom: 15px;
`

const Label = styled.label`
  display: block;
  color: ${POKER_COLORS.text};
  margin-bottom: 5px;
  font-weight: bold;
`

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.4);
  color: ${POKER_COLORS.text};
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: ${POKER_COLORS.gold};
  }
`

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.4);
  color: ${POKER_COLORS.text};
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: ${POKER_COLORS.gold};
  }
  
  option {
    background: ${POKER_COLORS.background};
    color: ${POKER_COLORS.text};
  }
`

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
`

const ActionButton = styled.button<{ $primary?: boolean }>`
  padding: 15px 30px;
  border: 2px solid ${props => props.$primary ? POKER_COLORS.accent : POKER_COLORS.gold};
  background: ${props => props.$primary ? POKER_COLORS.accent : 'transparent'};
  color: ${POKER_COLORS.text};
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: ${props => props.$primary ? POKER_COLORS.accent : POKER_COLORS.gold};
    color: ${props => props.$primary ? POKER_COLORS.text : POKER_COLORS.background};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 215, 0, 0.3);
  border-radius: 50%;
  border-top-color: ${POKER_COLORS.gold};
  animation: spin 1s ease-in-out infinite;
  margin-right: 10px;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`

interface CreateMultiplayerGameModalProps {
  onClose: () => void
  onGameCreated?: (gamePubkey: PublicKey) => void
}

export default function CreateMultiplayerGameModal({
  onClose,
  onGameCreated
}: CreateMultiplayerGameModalProps) {
  const { publicKey } = useWallet()
  const token = useCurrentToken()
  
  // Game configuration state
  const [maxPlayers, setMaxPlayers] = useState(6)
  const [wager, setWager] = useState(1000000) // 0.001 SOL in lamports
  const [timeLimit, setTimeLimit] = useState(60) // seconds for strategy selection
  const [isPrivate, setIsPrivate] = useState(false)
  const [gameName, setGameName] = useState('')
  
  // UI state
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Validation
  const minWagerLamports = CONFIG.MIN_WAGER * 1000000000 // Convert SOL to lamports
  const maxWagerLamports = minWagerLamports * CONFIG.MAX_WAGER_MULTIPLIER
  const isValidWager = wager >= minWagerLamports && wager <= maxWagerLamports
  const isValidPlayers = maxPlayers >= CONFIG.MIN_PLAYERS && maxPlayers <= CONFIG.MAX_PLAYERS
  const canCreate = publicKey && isValidWager && isValidPlayers && !isCreating

  const handleCreateGame = useCallback(async () => {
    if (!canCreate) return
    
    setIsCreating(true)
    setError(null)
    
    try {
      // Create multiplayer game using Gamba SDK
      // This would integrate with @gamba-labs/multiplayer-sdk
      console.log('🎯 Creating Poker Showdown game:', {
        creator: publicKey.toBase58(),
        maxPlayers,
        wager: wager / 1000000000, // Convert back to SOL for display
        timeLimit,
        isPrivate,
        gameName
      })
      
      // For now, simulate game creation
      // In real implementation, this would call the multiplayer SDK
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock game ID - in real implementation, this would come from the SDK
      const mockGameId = new PublicKey('11111111111111111111111111111111')
      
      console.log('✅ Game created successfully!')
      onGameCreated?.(mockGameId)
      onClose()
      
    } catch (err) {
      console.error('❌ Failed to create game:', err)
      setError(err instanceof Error ? err.message : 'Failed to create game')
    } finally {
      setIsCreating(false)
    }
  }, [canCreate, publicKey, maxPlayers, wager, timeLimit, isPrivate, gameName, onGameCreated, onClose])

  const formatSOL = (lamports: number) => {
    return (lamports / 1000000000).toFixed(4)
  }

  return (
    <CreateGameContainer>
      <Title>Create Poker Showdown Game</Title>
      
      <FormGrid>
        <FormSection>
          <SectionTitle>Game Settings</SectionTitle>
          
          <InputGroup>
            <Label>Game Name (Optional)</Label>
            <Input
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Enter a name for your game"
              maxLength={50}
            />
          </InputGroup>
          
          <InputGroup>
            <Label>Max Players: {maxPlayers}</Label>
            <Input
              type="range"
              min={CONFIG.MIN_PLAYERS}
              max={CONFIG.MAX_PLAYERS}
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(Number(e.target.value))}
            />
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginTop: '5px' }}>
              {CONFIG.MIN_PLAYERS} - {CONFIG.MAX_PLAYERS} players
            </div>
          </InputGroup>
          
          <InputGroup>
            <Label>Strategy Time Limit</Label>
            <Select 
              value={timeLimit} 
              onChange={(e) => setTimeLimit(Number(e.target.value))}
            >
              <option value={30}>30 seconds</option>
              <option value={60}>60 seconds</option>
              <option value={90}>90 seconds</option>
              <option value={120}>2 minutes</option>
            </Select>
          </InputGroup>
          
          <InputGroup>
            <Label>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Private Game (invite only)
            </Label>
          </InputGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>Wager Settings</SectionTitle>
          
          <InputGroup>
            <Label>Entry Wager: <TokenValue exact amount={wager} mint={token?.mint} /></Label>
            <Input
              type="range"
              min={minWagerLamports}
              max={Math.min(maxWagerLamports, 100000000)} // Cap at 0.1 SOL for demo
              step={1000000} // 0.001 SOL steps
              value={wager}
              onChange={(e) => setWager(Number(e.target.value))}
            />
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginTop: '5px' }}>
              Min: <TokenValue exact amount={minWagerLamports} mint={token?.mint} /> | Max: <TokenValue exact amount={maxWagerLamports} mint={token?.mint} />
            </div>
          </InputGroup>
          
          <div style={{ 
            background: 'rgba(255, 215, 0, 0.1)', 
            padding: '15px', 
            borderRadius: '8px',
            border: '1px solid rgba(255, 215, 0, 0.3)'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Prize Pool:</div>
            <div>Total Pot: <strong>{formatSOL(wager * maxPlayers)} SOL</strong></div>
            <div style={{ fontSize: '14px', marginTop: '5px', color: 'rgba(255,255,255,0.8)' }}>
              Winner takes all! Platform fee: {CONFIG.PLATFORM_FEE_BPS / 100}%
            </div>
          </div>
        </FormSection>
      </FormGrid>
      
      {error && (
        <div style={{
          background: 'rgba(244, 67, 54, 0.2)',
          border: '1px solid rgba(244, 67, 54, 0.5)',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          color: '#f44336'
        }}>
          {error}
        </div>
      )}
      
      <ActionButtons>
        <ActionButton onClick={onClose} disabled={isCreating}>
          Cancel
        </ActionButton>
        <ActionButton $primary onClick={handleCreateGame} disabled={!canCreate}>
          {isCreating && <LoadingSpinner />}
          {isCreating ? 'Creating Game...' : 'Create Game'}
        </ActionButton>
      </ActionButtons>
    </CreateGameContainer>
  )
}