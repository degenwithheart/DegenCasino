import React from 'react'
import styled from 'styled-components'
import { useColorScheme } from '../../../../themes/ColorSchemeContext'
import { useUserStore } from '../../../../hooks/data/useUserStore'
import { ALL_GAMES } from '../../../../games/allGames'
import { spacing, media, components, animations } from '../breakpoints'

const StoriesContainer = styled.div<{ $colorScheme: any }>`
  width: 100%;
  padding: ${spacing.sm} 0;
  background: ${props => props.$colorScheme.colors.background};
  border-bottom: 1px solid ${props => props.$colorScheme.colors.accent}10;
`

const StoriesScroller = styled.div`
  display: flex;
  gap: ${spacing.sm};
  overflow-x: auto;
  padding: 0 ${spacing.lg};
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

  transition: all ${animations.duration.normal} ${animations.easing.bounce};
  scroll-snap-align: start;

  &:active {
    transform: scale(0.9);
  }

  ${media.mouse} {
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 16px ${props => props.$colorScheme.colors.primary}40;
    }
  }
`

const StoryImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`

const StoryIcon = styled.div`
  font-size: 24px;
  color: white;
`

const StoryLabel = styled.div<{ $colorScheme: any }>`
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: ${props => props.$colorScheme.colors.text}80;
  white-space: nowrap;
  max-width: 64px;
  overflow: hidden;
  text-overflow: ellipsis;
`

interface StoriesProps {}

const Stories: React.FC<StoriesProps> = () => {
  const { currentColorScheme } = useColorScheme()
  const { gamesPlayed } = useUserStore()

  // Only show stories if user has played games
  if (gamesPlayed.length === 0) {
    return null
  }

  // Get played games from the games registry
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

  const handleStoryClick = (gameId: string) => {
    // Navigate to game or show preview
    console.log('Story clicked:', gameId)
  }

  return (
    <StoriesContainer $colorScheme={currentColorScheme}>
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
    </StoriesContainer>
  )
}

export default Stories