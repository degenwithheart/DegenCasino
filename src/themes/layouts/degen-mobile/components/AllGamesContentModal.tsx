import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { useColorScheme } from '../../../../themes/ColorSchemeContext';
import { ALL_GAMES } from '../../../../games/allGames';
import { spacing, typography, media, components } from '../breakpoints';
import {
  ModalOverlay,
  ModalContainer,
  Header,
  Title,
  CloseButton,
  Content
} from './ModalComponents';

// Filter games by tag and mobile availability
const SINGLEPLAYER_GAMES = ALL_GAMES.filter(game =>
  game.meta.tag === 'Singleplayer' && game.mobileAvailable === 'yes'
);
const MULTIPLAYER_GAMES = ALL_GAMES.filter(game =>
  game.meta.tag === 'Multiplayer' && game.mobileAvailable === 'yes'
);

const ModalContent = styled.div<{ $colorScheme: any; }>`
  color: ${props => props.$colorScheme.colors.text};
  
  /* Mobile-first layout */
  padding: 0;
  max-height: 70vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: ${spacing.base};
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 4px;
`;

const TabButton = styled.button<{ $colorScheme: any; $active: boolean; }>`
  flex: 1;
  padding: ${spacing.sm} ${spacing.base};
  
  background: ${props => props.$active
    ? props.$colorScheme.colors.accent
    : 'transparent'
  };
  
  color: ${props => props.$active
    ? 'white'
    : props.$colorScheme.colors.text
  };
  
  border: none;
  border-radius: 8px;
  
  font-size: ${typography.scale.sm};
  font-weight: ${typography.weight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.98);
  }
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing.base};
  
  ${media.mobileLg} {
    grid-template-columns: repeat(3, 1fr);
  }
  
  ${media.tablet} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const GameCard = styled.div<{ $colorScheme: any; }>`
  background: ${props => props.$colorScheme.colors.surface}60;
  border: 1px solid ${props => props.$colorScheme.colors.accent}30;
  border-radius: ${components.button.borderRadius};
  
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  
  /* Touch-friendly */
  min-height: ${spacing.touchTarget};
  
  &:active {
    transform: scale(0.98);
    background: ${props => props.$colorScheme.colors.accent}20;
  }
  
  ${media.mouse} {
    &:hover {
      transform: translateY(-4px);
      border-color: ${props => props.$colorScheme.colors.accent};
      box-shadow: 0 8px 20px ${props => props.$colorScheme.colors.accent}30;
    }
  }
`;

const GameImage = styled.div<{ $backgroundImage: string; $colorScheme: any; }>`
  height: 60px;
  background-image: url(${props => props.$backgroundImage});
  background-size: cover;
  background-position: center;
  position: relative;
  
  /* Overlay for better text readability */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, 
      transparent 0%, 
      rgba(0, 0, 0, 0.7) 100%
    );
  }
  
  ${media.mobileLg} {
    height: 80px;
  }
`;

const GameInfo = styled.div`
  padding: ${spacing.sm};
`;

const GameName = styled.h3<{ $colorScheme: any; }>`
  margin: 0;
  color: ${props => props.$colorScheme.colors.text};
  font-size: ${typography.scale.sm};
  font-weight: ${typography.weight.semibold};
  line-height: 1.2;
  
  /* Truncate long names */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const GameStatus = styled.div<{ $status: 'online' | 'offline' | 'coming-soon'; $colorScheme: any; }>`
  display: inline-block;
  margin-top: ${spacing.xs};
  padding: 2px 6px;
  
  background: ${props => {
    switch (props.$status) {
      case 'online': return '#10B98140';
      case 'offline': return '#EF444440';
      case 'coming-soon': return '#F59E0B40';
      default: return props.$colorScheme.colors.accent + '40';
    }
  }};
  
  color: ${props => {
    switch (props.$status) {
      case 'online': return '#10B981';
      case 'offline': return '#EF4444';
      case 'coming-soon': return '#F59E0B';
      default: return props.$colorScheme.colors.accent;
    }
  }};
  
  border-radius: 4px;
  font-size: 10px;
  font-weight: ${typography.weight.medium};
  text-transform: uppercase;
`;

const EmptyState = styled.div<{ $colorScheme: any; }>`
  text-align: center;
  padding: ${spacing.xl};
  color: ${props => props.$colorScheme.colors.text}80;
  
  font-size: ${typography.scale.base};
  line-height: 1.5;
`;

interface AllGamesContentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AllGamesContentModal: React.FC<AllGamesContentModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { connected, publicKey } = useWallet();
  const { currentColorScheme } = useColorScheme();
  const [activeTab, setActiveTab] = useState<'single' | 'multi'>('single');

  const currentGames = useMemo(() => {
    return activeTab === 'single' ? SINGLEPLAYER_GAMES : MULTIPLAYER_GAMES;
  }, [activeTab]);

  const handleGameClick = (gameId: string) => {
    if (connected && publicKey) {
      navigate(`/game/${publicKey.toString()}/${gameId}`);
      onClose(); // Close modal after navigation
    } else {
      // If wallet not connected, prompt user to connect wallet
      console.warn('No wallet connected - cannot navigate to game');
      // Could add wallet modal trigger here if needed
      return;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <ModalOverlay onClick={onClose}>
        <ModalContainer
          $variant="allgames"
          onClick={(e) => e.stopPropagation()}
        >
          <Header $variant="allgames">
            <Title $variant="allgames" $icon="🎮">
              All Games
            </Title>
            <CloseButton $variant="allgames" onClick={onClose} />
          </Header>

          <Content>
            <TabContainer>
              <TabButton
                $colorScheme={currentColorScheme}
                $active={activeTab === 'single'}
                onClick={() => setActiveTab('single')}
              >
                🎯 Singleplayer ({SINGLEPLAYER_GAMES.length})
              </TabButton>
              <TabButton
                $colorScheme={currentColorScheme}
                $active={activeTab === 'multi'}
                onClick={() => setActiveTab('multi')}
              >
                👥 Multiplayer ({MULTIPLAYER_GAMES.length})
              </TabButton>
            </TabContainer>

            {currentGames.length > 0 ? (
              <GamesGrid>
                {currentGames.map((game) => (
                  <GameCard
                    key={game.id}
                    $colorScheme={currentColorScheme}
                    onClick={() => handleGameClick(game.id)}
                  >
                    <GameImage
                      $backgroundImage={game.meta.image}
                      $colorScheme={currentColorScheme}
                    />

                    <GameInfo>
                      <GameName $colorScheme={currentColorScheme}>
                        {game.meta.name}
                      </GameName>

                      <GameStatus $status={game.live} $colorScheme={currentColorScheme}>
                        {game.live}
                      </GameStatus>
                    </GameInfo>
                  </GameCard>
                ))}
              </GamesGrid>
            ) : (
              <EmptyState $colorScheme={currentColorScheme}>
                <div>🎮</div>
                <div>No {activeTab === 'single' ? 'singleplayer' : 'multiplayer'} games available</div>
              </EmptyState>
            )}
          </Content>
        </ModalContainer>
      </ModalOverlay>
    </>
  );
};

export default AllGamesContentModal;