
import React from 'react';
import { ALL_GAMES } from '../../games/allGames';
import { FeaturedGameCard } from '../../sections/Dashboard/FeaturedGameCard/FeaturedGameCard';
import { 
  ModalContent, 
  HeaderSection, 
  Title, 
  HorizontalScroll, 
  MenuCardWrapper 
} from './AllGamesModal.styles';

// Filter by meta.tag for 'Singleplayer' and 'Multiplayer'
const SINGLEPLAYER_GAMES = ALL_GAMES.filter(game => game.meta.tag === 'Singleplayer');
const MULTIPLAYER_GAMES = ALL_GAMES.filter(game => game.meta.tag === 'Multiplayer');


type AllGamesModalContentProps = {
  onGameClick?: (game: typeof ALL_GAMES[0]) => void;
};


const AllGamesModalContent: React.FC<AllGamesModalContentProps> = ({ onGameClick }) => {
  return (
    <ModalContent>
      <HeaderSection>
        <Title>ALL GAMES</Title>
      </HeaderSection>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ 
          color: '#6ffaff', 
          fontSize: '1.2rem', 
          margin: '0 0 0.5rem 0', 
          fontWeight: 600,
          fontFamily: "'JetBrains Mono', monospace",
          textShadow: '0 0 8px #6ffaff88'
        }}>Singleplayer</h2>
        <HorizontalScroll>
          {SINGLEPLAYER_GAMES.map(game => (
            <MenuCardWrapper key={game.id}>
              <FeaturedGameCard game={game} onClick={() => onGameClick?.(game)} />
            </MenuCardWrapper>
          ))}
        </HorizontalScroll>
      </div>
      <div>
        <h2 style={{ 
          color: '#a259ff', 
          fontSize: '1.2rem', 
          margin: '0 0 0.5rem 0', 
          fontWeight: 600,
          fontFamily: "'JetBrains Mono', monospace",
          textShadow: '0 0 8px #a259ff88'
        }}>Multiplayer</h2>
        <HorizontalScroll>
          {MULTIPLAYER_GAMES.map(game => (
            <MenuCardWrapper key={game.id}>
              <FeaturedGameCard game={game} onClick={() => onGameClick?.(game)} />
            </MenuCardWrapper>
          ))}
        </HorizontalScroll>
      </div>
    </ModalContent>
  );
};

export default AllGamesModalContent;