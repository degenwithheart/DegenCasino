import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useColorScheme } from '../../../ColorSchemeContext'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { useUserStore } from '../../../../hooks/data/useUserStore'
import { ALL_GAMES } from '../../../../games/allGames'
import { FEATURED_GAMES } from '../../../../games/featuredGames'
import { GameCard } from '../../../../sections/Dashboard/GameCard'
import { FeaturedGameCard } from '../../../../sections/Dashboard/FeaturedGameCard/FeaturedGameCard'
import GameInfoModal from './GameInfoModal'
import { spacing, media, animations } from '../breakpoints'

const FeedContainer = styled.div<{ $colorScheme: any }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
  padding: ${spacing.lg};
  background: linear-gradient(135deg,
    rgba(24, 24, 24, 0.95),
    rgba(15, 15, 35, 0.98)
  );
  border-radius: 24px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;

  ${media.maxMobile} {
    padding: ${spacing.base};
    border-radius: 16px;
    gap: ${spacing.base};
  }
`

const FeedItem = styled.div<{ $colorScheme: any }>`
  width: 100%;
  background: linear-gradient(135deg,
    ${props => props.$colorScheme.colors.surface}95,
    ${props => props.$colorScheme.colors.background}90
  );
  border-radius: 20px;
  border: 1px solid ${props => props.$colorScheme.colors.primary}20;
  backdrop-filter: blur(15px);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
  position: relative;

  transition: all ${animations.duration.normal} ${animations.easing.easeOut};

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 16px 40px rgba(0, 0, 0, 0.4),
      0 0 0 1px ${props => props.$colorScheme.colors.primary}30;
  }

  ${media.maxMobile} {
    border-radius: 16px;
  }
`

const FeedHeader = styled.div<{ $colorScheme: any }>`
  padding: ${spacing.base};
  border-bottom: 1px solid ${props => props.$colorScheme.colors.accent}10;
  background: linear-gradient(135deg,
    ${props => props.$colorScheme.colors.surface} 0%,
    ${props => props.$colorScheme.colors.background} 100%
  );
`

const FeedTitle = styled.h3<{ $colorScheme: any }>`
  color: ${props => props.$colorScheme.colors.text};
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  text-align: center;
`

const FeedContent = styled.div`
  padding: ${spacing.base};
`

const HorizontalScroller = styled.div`
  display: flex;
  gap: ${spacing.base};
  overflow-x: auto;
  padding: 0 ${spacing.sm};
  -webkit-overflow-scrolling: touch;

  /* Hide scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }

  /* Snap scrolling */
  scroll-snap-type: x mandatory;
`

const GameTile = styled.div`
  flex-shrink: 0;
  width: 200px;
  scroll-snap-align: start;
`

const GameTileSmall = styled.div`
  flex-shrink: 0;
  width: 160px;
  scroll-snap-align: start;
`

const VerticalGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing.base};
`

const GameTileLarge = styled.div`
  width: 100%;
`

// Stories section styles
const StoriesScroller = styled.div`
  display: flex;
  gap: ${spacing.sm};
  overflow-x: auto;
  padding: 0 ${spacing.sm};
  -webkit-overflow-scrolling: touch;

  /* Hide scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }

  /* Snap to story items */
  scroll-snap-type: x mandatory;
`

const StoryItem = styled.div<{ $colorScheme: any; $hasPlayed?: boolean }>`
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  scroll-snap-align: start;

  background: linear-gradient(135deg,
    ${props => props.$colorScheme.colors.primary} 0%,
    ${props => props.$colorScheme.colors.accent} 100%
  );

  border: 3px solid ${props =>
    props.$hasPlayed
      ? `${props.$colorScheme.colors.text}40`
      : props.$colorScheme.colors.primary
  };

  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${animations.duration.fast} ease;

  &:active {
    transform: scale(0.95);
  }

  ${media.mouse} {
    &:hover {
      transform: scale(1.05);
    }
  }
`

const StoryImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
`

const StoryIcon = styled.div`
  font-size: 24px;
`

const StoryLabel = styled.div<{ $colorScheme: any }>`
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: ${props => props.$colorScheme.colors.text};
  text-align: center;
  white-space: nowrap;
  max-width: 64px;
  overflow: hidden;
  text-overflow: ellipsis;
`

interface FeedProps {}

const Feed: React.FC<FeedProps> = () => {
  const { currentColorScheme } = useColorScheme()
  const navigate = useNavigate()
  const { publicKey } = useWallet()
  const { gamesPlayed } = useUserStore()
  const [visible, setVisible] = useState(false)
  const [selectedGame, setSelectedGame] = useState<any>(null)
  const [gameInfoModalOpen, setGameInfoModalOpen] = useState(false)

    // Filter games
  const singleplayerGames = ALL_GAMES.filter(g => g.meta?.tag?.toLowerCase() === 'singleplayer' && g.live !== 'new')
  const multiplayerGames = ALL_GAMES.filter(g => g.meta?.tag?.toLowerCase() === 'multiplayer' && g.live !== 'new')
  const featuredGames = FEATURED_GAMES

  useEffect(() => {
    setVisible(true)
  }, [])

  const handleGameClick = (game: any) => {
    setSelectedGame(game)
    setGameInfoModalOpen(true)
  }

  const handlePlayGame = (game: any) => {
    if (!publicKey) return
    const wallet = publicKey.toBase58()
    navigate(`/game/${wallet}/${game.id}`)
  }

  const handleCloseGameInfo = () => {
    setGameInfoModalOpen(false)
    setSelectedGame(null)
  }

  const handleStoryClick = (gameId: string) => {
    if (!publicKey) return
    const wallet = publicKey.toBase58()
    navigate(`/game/${wallet}/${gameId}`)
  }

  // Get played games for stories
  const playedGames = gamesPlayed
    .map(gameId => ALL_GAMES.find(game => game.id === gameId))
    .filter(Boolean)
    .slice(0, 8) // Limit to 8 stories

  const storyItems = playedGames.map(game => ({
    id: game!.id,
    name: game!.meta.name,
    image: game!.meta.image,
    hasPlayed: true
  }))

  return (
    <>
      <FeedContainer $colorScheme={currentColorScheme}>
        {/* Welcome Section */}
        <FeedItem $colorScheme={currentColorScheme}>
          <FeedContent>
            <div style={{
              textAlign: 'center',
              padding: spacing.lg,
              background: `linear-gradient(135deg,
                ${currentColorScheme.colors.primary}10,
                ${currentColorScheme.colors.secondary}10
              )`,
              borderRadius: '12px'
            }}>
              <h1 style={{
                color: currentColorScheme.colors.text,
                fontSize: '1.8rem',
                fontWeight: 700,
                margin: `0 0 ${spacing.sm} 0`
              }}>
                🎰 Degen Casino
              </h1>
              <p style={{
                color: `${currentColorScheme.colors.text}80`,
                fontSize: '1rem',
                margin: 0,
                lineHeight: 1.5
              }}>
                Discover amazing games and start winning!
              </p>
            </div>
          </FeedContent>
        </FeedItem>

        {/* Play Again Section - Only show if user has game history */}
        {gamesPlayed.length > 0 && (
          <FeedItem $colorScheme={currentColorScheme}>
            <FeedHeader $colorScheme={currentColorScheme}>
              <FeedTitle $colorScheme={currentColorScheme}>
                🎮 Play Again
              </FeedTitle>
            </FeedHeader>
            <FeedContent>
              <StoriesScroller>
                {storyItems.map((story) => (
                  <StoryItem
                    key={story.id}
                    $colorScheme={currentColorScheme}
                    $hasPlayed={story.hasPlayed}
                    onClick={() => handleStoryClick(story.id)}
                  >
                    {story.image ? (
                      <StoryImage src={story.image} alt={story.name} />
                    ) : (
                      <StoryIcon>🎰</StoryIcon>
                    )}
                    <StoryLabel $colorScheme={currentColorScheme}>
                      {story.name}
                    </StoryLabel>
                  </StoryItem>
                ))}
              </StoriesScroller>
            </FeedContent>
          </FeedItem>
        )}

        {/* Featured Games Horizontal Scroller */}
        <FeedItem $colorScheme={currentColorScheme}>
          <FeedHeader $colorScheme={currentColorScheme}>
            <FeedTitle $colorScheme={currentColorScheme}>
              ⭐ Featured Games
            </FeedTitle>
          </FeedHeader>
          <FeedContent>
            <HorizontalScroller>
              {featuredGames.slice(0, 10).map((game) => (
                <GameTile key={game.id}>
                  <FeaturedGameCard
                    game={game}
                    onClick={() => handleGameClick(game)}
                  />
                </GameTile>
              ))}
            </HorizontalScroller>
          </FeedContent>
        </FeedItem>

        {/* Singleplayer Games Horizontal Scroller */}
        <FeedItem $colorScheme={currentColorScheme}>
          <FeedHeader $colorScheme={currentColorScheme}>
            <FeedTitle $colorScheme={currentColorScheme}>
              🎯 Singleplayer
            </FeedTitle>
          </FeedHeader>
          <FeedContent>
            <HorizontalScroller>
              {singleplayerGames.slice(0, 8).map((game) => (
                <GameTileSmall key={game.id}>
                  <FeaturedGameCard
                    game={game}
                    onClick={() => handleGameClick(game)}
                  />
                </GameTileSmall>
              ))}
            </HorizontalScroller>
          </FeedContent>
        </FeedItem>

        {/* Multiplayer Games Horizontal Scroller */}
        <FeedItem $colorScheme={currentColorScheme}>
          <FeedHeader $colorScheme={currentColorScheme}>
            <FeedTitle $colorScheme={currentColorScheme}>
              👥 Multiplayer
            </FeedTitle>
          </FeedHeader>
          <FeedContent>
            <HorizontalScroller>
              {multiplayerGames.slice(0, 8).map((game) => (
                <GameTileSmall key={game.id}>
                  <FeaturedGameCard
                    game={game}
                    onClick={() => handleGameClick(game)}
                  />
                </GameTileSmall>
              ))}
            </HorizontalScroller>
          </FeedContent>
        </FeedItem>
      </FeedContainer>

      <GameInfoModal
        game={selectedGame}
        isOpen={gameInfoModalOpen}
        onClose={handleCloseGameInfo}
        onPlay={handlePlayGame}
      />
    </>
  )
}

export default Feed