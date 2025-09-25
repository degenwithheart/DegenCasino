import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useColorScheme } from '../../../ColorSchemeContext'
import { ALL_GAMES } from '../../../../games/allGames'
import { media, spacing, typography } from '../breakpoints'

// Filter by meta.tag for 'Singleplayer' and 'Multiplayer'
const SINGLEPLAYER_GAMES = ALL_GAMES.filter(game => game.meta.tag === 'Singleplayer')
const MULTIPLAYER_GAMES = ALL_GAMES.filter(game => game.meta.tag === 'Multiplayer')

const ModalContent = styled.div<{ $colorScheme: any }>`
  padding: 0.5rem;
  width: 600px;
  height: 500px;
  overflow-y: auto;
  color: ${props => props.$colorScheme.colors.text};
  
  ${media.maxMobile} {
    width: 500px;
    height: 400px;
    padding: 0.25rem;
  }
`

const HeaderSection = styled.div<{ $colorScheme: any }>`
  text-align: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid ${props => props.$colorScheme.colors.accent}30;
`

const Title = styled.h1<{ $colorScheme: any }>`
  font-size: 1.8rem;
  font-weight: 900;
  color: ${props => props.$colorScheme.colors.accent};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-shadow: 0 0 20px ${props => props.$colorScheme.colors.accent}80;
  
  ${media.maxMobile} {
    font-size: 1.5rem;
  }
`

const SectionTitle = styled.h2<{ $colorScheme: any }>`
  color: ${props => props.$colorScheme.colors.accent};
  font-size: 1.2rem;
  margin: 1.5rem 0 0.75rem 0;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-shadow: 0 0 8px ${props => props.$colorScheme.colors.accent}60;
  
  &:first-of-type {
    margin-top: 0;
  }
  
  ${media.maxMobile} {
    font-size: 1rem;
  }
`

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  ${media.maxMobile} {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
`

const GameCard = styled.div<{ $colorScheme: any }>`
  background: ${props => props.$colorScheme.colors.surface};
  border: 2px solid ${props => props.$colorScheme.colors.border};
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    border-color: ${props => props.$colorScheme.colors.accent};
    box-shadow: 0 15px 40px ${props => props.$colorScheme.colors.accent}30;
  }
`

const GameImage = styled.div<{ $backgroundImage: string }>`
  height: 80px;
  background-image: url(${props => props.$backgroundImage});
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(transparent, rgba(0,0,0,0.7));
  }
`

const GameStatus = styled.div<{ $colorScheme: any; $status: string }>`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  ${props => {
    switch (props.$status) {
      case 'up':
        return `
          background: rgba(34, 197, 94, 0.9);
          color: white;
        `;
      case 'new':
        return `
          background: rgba(251, 191, 36, 0.9);
          color: white;
        `;
      case 'down':
        return `
          background: rgba(239, 68, 68, 0.9);
          color: white;
        `;
      default:
        return `
          background: ${props.$colorScheme.colors.surface};
          color: ${props.$colorScheme.colors.text};
        `;
    }
  }}
`

const GameInfo = styled.div`
  padding: 0.5rem;
`

const GameName = styled.h3<{ $colorScheme: any }>`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${props => props.$colorScheme.colors.text};
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`

const GameDescription = styled.p<{ $colorScheme: any }>`
  color: ${props => props.$colorScheme.colors.text}80;
  font-size: 0.7rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

type AllGamesContentModalProps = {
  onGameClick?: () => void;
}

const AllGamesContentModal: React.FC<AllGamesContentModalProps> = ({ onGameClick }) => {
  const { currentColorScheme } = useColorScheme()
  const navigate = useNavigate()

  const handleGameClick = (gameId: string, gameStatus: string) => {
    if (gameStatus === 'down') {
      return // Don't navigate to games that are down
    }
    
    navigate(`/${gameId}`)
    onGameClick?.() // Close the modal
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'up': return 'Live'
      case 'new': return 'New'
      case 'down': return 'Maintenance'
      default: return ''
    }
  }

  return (
    <ModalContent $colorScheme={currentColorScheme}>
      <HeaderSection $colorScheme={currentColorScheme}>
        <Title $colorScheme={currentColorScheme}>ALL GAMES</Title>
      </HeaderSection>

      {SINGLEPLAYER_GAMES.length > 0 && (
        <>
          <SectionTitle $colorScheme={currentColorScheme}>
            Singleplayer Games
          </SectionTitle>
          <GamesGrid>
            {SINGLEPLAYER_GAMES.map(game => (
              <GameCard
                key={game.id}
                $colorScheme={currentColorScheme}
                onClick={() => handleGameClick(game.id, game.live)}
              >
                <GameImage $backgroundImage={game.meta.image}>
                  <GameStatus $colorScheme={currentColorScheme} $status={game.live}>
                    {getStatusText(game.live)}
                  </GameStatus>
                </GameImage>
                
                <GameInfo>
                  <GameName $colorScheme={currentColorScheme}>
                    {game.meta.name}
                  </GameName>
                  <GameDescription $colorScheme={currentColorScheme}>
                    {game.meta.description}
                  </GameDescription>
                </GameInfo>
              </GameCard>
            ))}
          </GamesGrid>
        </>
      )}

      {MULTIPLAYER_GAMES.length > 0 && (
        <>
          <SectionTitle $colorScheme={currentColorScheme}>
            Multiplayer Games
          </SectionTitle>
          <GamesGrid>
            {MULTIPLAYER_GAMES.map(game => (
              <GameCard
                key={game.id}
                $colorScheme={currentColorScheme}
                onClick={() => handleGameClick(game.id, game.live)}
              >
                <GameImage $backgroundImage={game.meta.image}>
                  <GameStatus $colorScheme={currentColorScheme} $status={game.live}>
                    {getStatusText(game.live)}
                  </GameStatus>
                </GameImage>
                
                <GameInfo>
                  <GameName $colorScheme={currentColorScheme}>
                    {game.meta.name}
                  </GameName>
                  <GameDescription $colorScheme={currentColorScheme}>
                    {game.meta.description}
                  </GameDescription>
                </GameInfo>
              </GameCard>
            ))}
          </GamesGrid>
        </>
      )}
    </ModalContent>
  )
}

export default AllGamesContentModal