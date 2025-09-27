import React, { useState } from 'react'
import { GambaUi } from 'gamba-react-ui-v2'
import styled, { keyframes, css } from 'styled-components'
import CreateMultiplayerGameModal from './CreateMultiplayerGameModal'

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.3); }
  50% { box-shadow: 0 0 25px rgba(255, 215, 0, 0.6), 0 0 35px rgba(255, 215, 0, 0.3); }
`

// Mobile-first responsive container
const LobbyContainer = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0f1419 100%);
  color: white;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto;
  padding: 15px;
  
  @media (min-width: 768px) {
    padding: 25px;
  }
`

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 25px;
  animation: ${fadeIn} 0.6s ease-out;
  
  @media (min-width: 768px) {
    margin-bottom: 35px;
  }
`

const Title = styled.h1`
  color: #ffd700;
  margin: 0 0 10px 0;
  font-size: 28px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  
  @media (min-width: 768px) {
    font-size: 36px;
    margin-bottom: 15px;
  }
`

const Subtitle = styled.p`
  font-size: 14px;
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
  max-width: 500px;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    font-size: 16px;
    line-height: 1.5;
    max-width: 600px;
  }
`

const GameModeGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    flex-direction: row;
    gap: 20px;
    max-width: 700px;
  }
`

const ModeCard = styled.div<{ $primary?: boolean }>`
  background: ${props => props.$primary ? 
    'linear-gradient(135deg, rgba(26, 107, 58, 0.9) 0%, rgba(13, 90, 45, 1) 100%)' :
    'linear-gradient(135deg, rgba(45, 45, 70, 0.9) 0%, rgba(25, 25, 50, 1) 100%)'
  };
  border: 2px solid ${props => props.$primary ? '#ffd700' : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 15px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  flex: 1;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  animation: ${fadeIn} 0.6s ease-out;
  
  &:hover {
    transform: translateY(-3px);
    border-color: #ffd700;
    ${props => props.$primary && css`
      animation: ${glow} 2s infinite;
    `}
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  @media (min-width: 768px) {
    padding: 25px;
    min-height: 160px;
  }
`

const ModeIcon = styled.div`
  font-size: 36px;
  margin-bottom: 12px;
  
  @media (min-width: 768px) {
    font-size: 42px;
    margin-bottom: 15px;
  }
`

const ModeTitle = styled.h3`
  color: #ffd700;
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 8px 0;
  
  @media (min-width: 768px) {
    font-size: 22px;
    margin-bottom: 10px;
  }
`

const ModeDescription = styled.p`
  font-size: 12px;
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.3;
  
  @media (min-width: 768px) {
    font-size: 14px;
    line-height: 1.4;
  }
`

const ComingSoonBadge = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4444;
  color: white;
  font-size: 10px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 12px;
  border: 2px solid white;
  animation: ${pulse} 2s infinite;
  
  @media (min-width: 768px) {
    font-size: 11px;
    padding: 5px 10px;
  }
`

const PokerTable = styled.div`
  width: 100px;
  height: 60px;
  background: radial-gradient(ellipse at center, #1a5d1a 0%, #0d2818 70%);
  border: 2px solid #ffd700;
  border-radius: 50px;
  margin: 15px auto;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 40%;
    border: 1px solid rgba(255, 215, 0, 0.3);
    border-radius: inherit;
  }
  
  @media (min-width: 768px) {
    width: 120px;
    height: 75px;
    margin: 20px auto;
  }
`

interface GameLobbyProps {
  onJoinSingleplayer: () => void
  onJoinMultiplayer: (gameId: string) => void
  onCreateMultiplayer: () => void
}

export default function GameLobby({
  onJoinSingleplayer,
  onJoinMultiplayer,
  onCreateMultiplayer
}: GameLobbyProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleCreateMultiplayer = () => {
    setShowCreateModal(true)
  }

  const handleGameCreated = (gamePubkey: any) => {
    setShowCreateModal(false)
    onJoinMultiplayer(gamePubkey.toString())
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <LobbyContainer>
          <HeaderSection>
            <Title>🃏 Poker Showdown</Title>
            <Subtitle>
              Choose your cards wisely. Strategy determines destiny in this high-stakes poker arena.
            </Subtitle>
            <PokerTable />
          </HeaderSection>

          <GameModeGrid>
            <ModeCard $primary onClick={onJoinSingleplayer}>
              <ModeIcon>🎯</ModeIcon>
              <ModeTitle>Singleplayer</ModeTitle>
              <ModeDescription>
                Face the AI in strategic poker combat. Perfect your skills against computer opponents.
              </ModeDescription>
            </ModeCard>

            <ModeCard onClick={handleCreateMultiplayer}>
              <ComingSoonBadge>SOON</ComingSoonBadge>
              <ModeIcon>👥</ModeIcon>
              <ModeTitle>Multiplayer</ModeTitle>
              <ModeDescription>
                Challenge real players in live poker battles. Winner takes the entire pot.
              </ModeDescription>
            </ModeCard>
          </GameModeGrid>
        </LobbyContainer>
      </GambaUi.Portal>

      {showCreateModal && (
        <CreateMultiplayerGameModal
          onClose={() => setShowCreateModal(false)}
          onGameCreated={handleGameCreated}
        />
      )}
    </>
  )
}