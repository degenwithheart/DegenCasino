import React, { useState } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { motion } from 'framer-motion'
import { PublicKey } from '@solana/web3.js'
import { useSpecificGames } from 'gamba-react-v2'
import { useCurrentToken, GambaUi } from 'gamba-react-ui-v2'
import { CONFIG } from '../constants'
import { MobileControls, DesktopControls } from '../../../components'
import CreateSingleplayerGameModal, { SingleplayerGameConfig } from './CreateSingleplayerGameModal'
import CreateMultiplayerGameModal from './CreateMultiplayerGameModal'

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
  }
`

const LobbyContainer = styled.div`
  padding: 10px;
  width: 100%;
  height: 100%;
  color: white;
  overflow-y: auto;
  box-sizing: border-box;
  
  @media (min-width: 768px) {
    padding: 20px;
  }
`

const Header = styled.div`
  text-align: center;
  padding: 10px 0;
`

const Title = styled.h1`
  color: #ffd700;
  font-size: 2.5rem;
  margin-bottom: 10px;
`

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin-bottom: 30px;
`

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  
  @media (min-width: 768px) {
    gap: 15px;
    padding: 15px;
  }
`

const ActionButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['variant'].includes(prop)
})<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 80px;
  max-width: 140px;
  
  @media (min-width: 768px) {
    padding: 10px 16px;
    font-size: 0.9rem;
    border-radius: 8px;
    flex: none;
    min-width: auto;
    max-width: none;
  }
  
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
`

const TablesSection = styled.div`
  margin-bottom: 20px;
  
  @media (min-width: 768px) {
    margin-bottom: 30px;
  }
`

const SectionTitle = styled.h2`
  color: #ffd700;
  font-size: 1.4rem;
  margin-bottom: 15px;
  text-align: center;
  
  @media (min-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 20px;
  }
`

const TablesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  width: 100%;
  
  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }
`

const TableCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(139, 69, 19, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  @media (min-width: 768px) {
    padding: 20px;
    border-radius: 15px;
    
    &:hover {
      border-color: #ffd700;
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
  }
`

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`

const TableTitle = styled.h3`
  color: #ffd700;
  margin: 0;
  font-size: 1rem;
  
  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`

const TableStatus = styled.span.withConfig({
  shouldForwardProp: (prop) => !['available'].includes(prop)
})<{ available?: boolean }>`
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
  background: ${props => props.available ? 'rgba(40, 167, 69, 0.3)' : 'rgba(220, 53, 69, 0.3)'};
  color: ${props => props.available ? '#28a745' : '#dc3545'};
  border: 1px solid ${props => props.available ? '#28a745' : '#dc3545'};
  
  @media (min-width: 768px) {
    padding: 4px 10px;
    font-size: 0.8rem;
    border-radius: 16px;
  }
`

const TableDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const TableDetail = styled.div`
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8rem;
  
  @media (min-width: 768px) {
    font-size: 0.9rem;
  }
`

const JoinButton = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 12px;
  background: linear-gradient(45deg, #28a745, #20c997);
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  @media (min-width: 768px) {
    padding: 12px;
    margin-top: 15px;
    font-size: 0.9rem;
    border-radius: 8px;
    
    &:hover {
      transform: scale(1.02);
      background: linear-gradient(45deg, #218838, #17a2b8);
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
`

const InfoContainer = styled.div`
  padding: 15px;
  width: 100%;
  height: 100%;
  color: white;
  background: linear-gradient(135deg, rgba(139, 69, 19, 0.3) 0%, rgba(0, 0, 0, 0.7) 100%);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  box-sizing: border-box;
  
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 2px 1fr;
    gap: 30px;
    padding: 25px;
  }
`

const InfoSection = styled.div`
  text-align: left;
`

const InfoDivider = styled.div`
  background: linear-gradient(to bottom, transparent, rgba(255, 215, 0, 0.3), transparent);
  width: 100%;
  
  @media (max-width: 768px) {
    display: none;
  }
`

const InfoTitle = styled.h2`
  color: #ffd700;
  font-size: 1.3rem;
  margin-bottom: 10px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  @media (min-width: 768px) {
    font-size: 1.6rem;
    margin-bottom: 15px;
  }
`

const InfoDescription = styled.p`
  font-size: 0.9rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 15px;
  text-align: center;
  
  @media (min-width: 768px) {
    font-size: 1.05rem;
    line-height: 1.6;
    margin-bottom: 20px;
  }
`

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  color: rgba(255, 255, 255, 0.8);
  
  li {
    margin-bottom: 8px;
    padding: 5px 0;
    font-size: 0.85rem;
    border-bottom: 1px solid rgba(255, 215, 0, 0.1);
    
    &:last-child {
      border-bottom: none;
    }
    
    @media (min-width: 768px) {
      margin-bottom: 10px;
      padding: 6px 0;
      font-size: 0.9rem;
    }
  }
`

interface GameLobbyProps {
  onJoinSingleplayer: (wager: number) => void
  onJoinMultiplayer: (gameId: string) => void
  onCreateSingleplayer: () => void
  onCreateMultiplayer: () => void
}

const SINGLEPLAYER_TABLES = [
  { id: 'sp_001', wager: 0.01, name: 'Penny Table' },
  { id: 'sp_010', wager: 0.1, name: 'Dime Table' },
  { id: 'sp_050', wager: 0.5, name: 'Half Dollar Table' },
  { id: 'sp_100', wager: 1.0, name: 'Dollar Table' }
]

export default function GameLobby({ onJoinSingleplayer, onJoinMultiplayer, onCreateSingleplayer, onCreateMultiplayer }: GameLobbyProps) {
  const token = useCurrentToken()
  
  // Navigation state
  const [viewMode, setViewMode] = useState<'info' | 'browsing'>('info')
  const [tableType, setTableType] = useState<'singleplayer' | 'multiplayer'>('singleplayer')
  
  const { games } = useSpecificGames({
    creator: new PublicKey('DP1uxUKbZPhFh1BTPfAHgBLsRc8gNPj3DhBNXQbdxuFM') // Use same creator as other games
  })
  
  // Filter multiplayer games with available spots
  const availableMultiplayerGames = games
    .filter((game: any) => game.players.length < CONFIG.MAX_PLAYERS && game.state.waiting)
    .slice(0, 4) // Max 4 games shown

  const formatSOL = (amount: number) => {
    return `${amount.toFixed(amount < 1 ? 3 : 1)} SOL`
  }

  const formatWager = (wager: number) => {
    return formatSOL(wager / token.baseWager)
  }

  const renderInfoScreen = () => (
    <InfoContainer>
      <InfoSection>
        <InfoTitle>🤖 Singleplayer Mode</InfoTitle>
        <InfoDescription>
          Play against the house with AI opponents. Perfect for practice and learning roulette strategies.
        </InfoDescription>
        <FeatureList>
          <li>🎯 Play against AI opponents with balanced difficulty</li>
          <li>💰 Fixed wager tables from 0.01 to 1.0 SOL</li>
          <li>⚡ Instant games - no waiting for other players</li>
          <li>📈 Practice your betting strategies risk-free</li>
          <li>⚙️ Configurable game settings and AI behavior</li>
        </FeatureList>
      </InfoSection>
      
      <InfoDivider />
      
      <InfoSection>
        <InfoTitle>👥 Multiplayer Mode</InfoTitle>
        <InfoDescription>
          Compete against real players in live roulette games. Winner takes the entire prize pool!
        </InfoDescription>
        <FeatureList>
          <li>🌍 Play against real players worldwide</li>
          <li>🎮 Create custom tables with your own wager rules</li>
          <li>🪑 Join existing games with available spots</li>
          <li>🏆 Winner-takes-all prize pool system</li>
          <li>💎 Live betting with real SOL stakes</li>
        </FeatureList>
      </InfoSection>
    </InfoContainer>
  )

  const renderSingleplayerTables = () => (
    <LobbyContainer>
      <TablesSection>
        <SectionTitle>🤖 Singleplayer Tables (vs House)</SectionTitle>
        <TablesGrid>
          {SINGLEPLAYER_TABLES.map(table => (
            <TableCard
              key={table.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <TableHeader>
                <TableTitle>{table.name}</TableTitle>
                <TableStatus available={true}>Available</TableStatus>
              </TableHeader>
              
              <TableDetails>
                <TableDetail>
                  <span>Wager:</span>
                  <span>{formatSOL(table.wager)}</span>
                </TableDetail>
                <TableDetail>
                  <span>Players:</span>
                  <span>1/1 (You vs House)</span>
                </TableDetail>
                <TableDetail>
                  <span>Type:</span>
                  <span>AI Opponents</span>
                </TableDetail>
                <TableDetail>
                  <span>Difficulty:</span>
                  <span>Balanced</span>
                </TableDetail>
              </TableDetails>
              
              <JoinButton onClick={() => onJoinSingleplayer(table.wager * token.baseWager)}>
                🎯 Join Table
              </JoinButton>
            </TableCard>
          ))}
        </TablesGrid>
      </TablesSection>
    </LobbyContainer>
  )

  const renderMultiplayerTables = () => (
    <LobbyContainer>
      <TablesSection>
        <SectionTitle>👥 Multiplayer Tables (vs Real Players)</SectionTitle>
        <TablesGrid>
          {availableMultiplayerGames.length > 0 ? (
            availableMultiplayerGames.map((game: any) => (
              <TableCard
                key={game.gameId}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <TableHeader>
                  <TableTitle>Table #{game.gameId.slice(0, 8)}...</TableTitle>
                  <TableStatus available={true}>Joining</TableStatus>
                </TableHeader>
                
                <TableDetails>
                  <TableDetail>
                    <span>Wager:</span>
                    <span>{formatWager(game.wager || 0)}</span>
                  </TableDetail>
                  <TableDetail>
                    <span>Players:</span>
                    <span>{game.players.length}/8</span>
                  </TableDetail>
                  <TableDetail>
                    <span>Type:</span>
                    <span>Real Players</span>
                  </TableDetail>
                  <TableDetail>
                    <span>Creator:</span>
                    <span>{game.creator?.toBase58().slice(0, 6)}...</span>
                  </TableDetail>
                </TableDetails>
                
                <JoinButton onClick={() => onJoinMultiplayer(game.gameId)}>
                  🚀 Join Game
                </JoinButton>
              </TableCard>
            ))
          ) : (
            <EmptyState style={{ gridColumn: '1 / -1' }}>
              <h3>No multiplayer games available</h3>
              <p>Be the first to create a multiplayer table!</p>
            </EmptyState>
          )}
        </TablesGrid>
      </TablesSection>
    </LobbyContainer>
  )

  return (
    <>
      <GambaUi.Portal target="stats">
        <Header>
          <Title>🎰 Roulette Royale Lobby</Title>
          <Subtitle>
            {viewMode === 'info' 
              ? 'Choose your game mode and join a table'
              : `Browse ${tableType === 'singleplayer' ? 'Singleplayer' : 'Multiplayer'} Tables`
            }
          </Subtitle>
        </Header>
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        {viewMode === 'info' && renderInfoScreen()}
        {viewMode === 'browsing' && tableType === 'singleplayer' && renderSingleplayerTables()}
        {viewMode === 'browsing' && tableType === 'multiplayer' && renderMultiplayerTables()}
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        {/* Mobile Controls - Hidden wager section with message and action buttons */}
        <MobileControls
          wager={0}
          setWager={() => {}}
          onPlay={() => {}}
          hideWager={true}
          hideMessage="Choose Your Table! 🎲"
        >
          {/* Action buttons for mobile */}
          {viewMode === 'info' ? (
            <ActionButtons>
              <ActionButton variant="primary" onClick={() => setViewMode('browsing')}>
                🎮 Join
              </ActionButton>
              <ActionButton variant="secondary" onClick={onCreateSingleplayer}>
                🤖 + Create Singleplayer
              </ActionButton>
              <ActionButton variant="secondary" onClick={onCreateMultiplayer}>
                👥 + Create Multiplayer
              </ActionButton>
            </ActionButtons>
          ) : (
            <ActionButtons>
              <ActionButton variant="secondary" onClick={() => setViewMode('info')}>
                ← Go Back
              </ActionButton>
              <ActionButton 
                variant={tableType === 'singleplayer' ? 'primary' : 'secondary'}
                onClick={() => setTableType('singleplayer')}
              >
                🤖 SP Tables
              </ActionButton>
              <ActionButton 
                variant={tableType === 'multiplayer' ? 'primary' : 'secondary'}
                onClick={() => setTableType('multiplayer')}
              >
                👥 MP Tables
              </ActionButton>
            </ActionButtons>
          )}
        </MobileControls>
        
        {/* Desktop Controls - Wrap action buttons */}
        <DesktopControls>
          {viewMode === 'info' ? (
            <ActionButtons>
              <ActionButton variant="primary" onClick={() => setViewMode('browsing')}>
                🎮 Join
              </ActionButton>
              <ActionButton variant="secondary" onClick={onCreateSingleplayer}>
                🤖 + Create Singleplayer
              </ActionButton>
              <ActionButton variant="secondary" onClick={onCreateMultiplayer}>
                👥 + Create Multiplayer
              </ActionButton>
            </ActionButtons>
          ) : (
            <ActionButtons>
              <ActionButton variant="secondary" onClick={() => setViewMode('info')}>
                ← Go Back
              </ActionButton>
              <ActionButton 
                variant={tableType === 'singleplayer' ? 'primary' : 'secondary'}
                onClick={() => setTableType('singleplayer')}
              >
                🤖 SP Tables
              </ActionButton>
              <ActionButton 
                variant={tableType === 'multiplayer' ? 'primary' : 'secondary'}
                onClick={() => setTableType('multiplayer')}
              >
                👥 MP Tables
              </ActionButton>
            </ActionButtons>
          )}
        </DesktopControls>
      </GambaUi.Portal>
    </>
  )
}