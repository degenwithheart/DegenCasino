import React, { useState, useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useColorScheme } from '../../ColorSchemeContext';
import { useHandleWalletConnect } from '../../../sections/walletConnect';
import { ALL_GAMES } from '../../../games/allGames';
import { TOKEN_METADATA } from '../../../constants';
import { media, spacing, typography } from './breakpoints';

// Romantic animations for the DegenHeart Casino dashboard
const heartGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
    transform: translateY(0px);
  }
  50% {
    box-shadow: 0 0 40px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.2);
    transform: translateY(-2px);
  }
`;

const heartFloat = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-8px) rotate(1deg);
  }
  66% {
    transform: translateY(-4px) rotate(-1deg);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const DashboardContainer = styled.div<{ $colorScheme: any; }>`
  /* Mobile-first: Consistent even padding on all sides - 0.75rem */
  padding: 0.75rem;
  background: ${props => props.$colorScheme.colors.background};
  min-height: 100%;
  overflow-y: auto;
  overflow-x: hidden; /* Prevent horizontal scroll */
  position: relative; /* Contain modal overlays within this component */
  box-sizing: border-box;
  
  /* Tablet: More generous even spacing */
  ${media.tablet} {
    padding: 1.5rem;
  }
  
  /* Desktop: Full spacing for comfortable viewing */
  ${media.desktop} {
    padding: 2rem;
  }
`;

const WelcomeSection = styled.section<{ $colorScheme: any; }>`
  text-align: center;
  margin-bottom: 2rem;
  /* Mobile-first: Even padding on all sides */
  padding: 1.5rem 1rem;
  background: linear-gradient(135deg, 
    ${props => props.$colorScheme.colors.surface}90,
    ${props => props.$colorScheme.colors.background}50
  );
  border-radius: 20px;
  border: 2px solid ${props => props.$colorScheme.colors.accent}30;
  position: relative;
  overflow: hidden;
  
  /* Tablet and up: More generous padding */
  ${media.tablet} {
    padding: 2rem 1.5rem;
    margin-bottom: 2.5rem;
  }
  
  ${media.desktop} {
    padding: 3rem 2rem;
    margin-bottom: 3rem;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      ${props => props.$colorScheme.colors.accent}10,
      transparent
    );
    ${css`animation: ${shimmer} 3s ease-in-out infinite;`}
  }
`;

const HeartTitle = styled.h1<{ $colorScheme: any; }>`
  font-size: 3.5rem;
  font-weight: 900;
  color: ${props => props.$colorScheme.colors.accent};
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  position: relative;
  z-index: 2;
  
  background: linear-gradient(45deg, 
    ${props => props.$colorScheme.colors.accent},
    ${props => props.$colorScheme.colors.text}
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  text-shadow: 0 0 30px ${props => props.$colorScheme.colors.accent}60;
  ${css`animation: ${heartFloat} 6s ease-in-out infinite;`}
  
  /* Mobile font size adjustment */
  ${media.maxMobileLg} {
    font-size: 2.5rem;
  }
`;

const WelcomeText = styled.p<{ $colorScheme: any; }>`
  font-size: 1.3rem;
  color: ${props => props.$colorScheme.colors.text}90;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  font-style: italic;
  
  /* Mobile font size adjustment */
  ${media.maxMobileLg} {
    font-size: 1.1rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  /* Mobile-first: Smaller min-width for better mobile fit */
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
  margin-bottom: 2rem;
  
  ${media.tablet} {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2.5rem;
  }
  
  ${media.desktop} {
    margin-bottom: 3rem;
  }
`;

const StatCard = styled.div<{ $colorScheme: any; }>`
  background: ${props => props.$colorScheme.colors.surface};
  border: 1px solid ${props => props.$colorScheme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    border-color: ${props => props.$colorScheme.colors.accent};
    ${css`animation: ${heartGlow} 2s ease-in-out infinite;`}
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      ${props => props.$colorScheme.colors.accent},
      transparent
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const StatValue = styled.div<{ $colorScheme: any; }>`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.$colorScheme.colors.accent};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div<{ $colorScheme: any; }>`
  font-size: 0.9rem;
  color: ${props => props.$colorScheme.colors.text}70;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const GamesSection = styled.section`
  /* Mobile-first: Smaller bottom margin */
  margin-bottom: 2rem;
  
  ${media.tablet} {
    margin-bottom: 2.5rem;
  }
  
  ${media.desktop} {
    margin-bottom: 3rem;
  }
`;

const SectionTitle = styled.h2<{ $colorScheme: any; }>`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.$colorScheme.colors.text};
  margin-bottom: 1.5rem;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, 
      transparent,
      ${props => props.$colorScheme.colors.accent},
      transparent
    );
  }
`;

const GameFilters = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $colorScheme: any; $active: boolean; }>`
  padding: 0.75rem 1.5rem;
  border: 1px solid ${props => props.$active ? props.$colorScheme.colors.accent : props.$colorScheme.colors.border};
  background: ${props => props.$active ? props.$colorScheme.colors.accent + '20' : props.$colorScheme.colors.surface};
  color: ${props => props.$active ? props.$colorScheme.colors.accent : props.$colorScheme.colors.text};
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  &:hover {
    background: ${props => props.$colorScheme.colors.accent}30;
    border-color: ${props => props.$colorScheme.colors.accent};
    transform: translateY(-2px);
  }
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  
  /* Mobile grid adjustments */
  ${media.maxMobileLg} {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }
`;

const GameCard = styled.div<{ $colorScheme: any; }>`
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
`;

const GameImage = styled.div<{ $backgroundImage: string; }>`
  height: 200px;
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
`;

const GameStatus = styled.div<{ $colorScheme: any; $status: string; }>`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  ${props => {
    switch (props.$status) {
      case 'online':
        return `
          background: rgba(34, 197, 94, 0.9);
          color: white;
        `;
      case 'coming-soon':
        return `
          background: rgba(251, 191, 36, 0.9);
          color: white;
        `;
      case 'offline':
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
`;

const GameInfo = styled.div`
  padding: 1.5rem;
`;

const GameName = styled.h3<{ $colorScheme: any; }>`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${props => props.$colorScheme.colors.text};
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;

const GameDescription = styled.p<{ $colorScheme: any; }>`
  color: ${props => props.$colorScheme.colors.text}80;
  font-size: 0.9rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ConnectPrompt = styled.div<{ $colorScheme: any; }>`
  text-align: center;
  padding: 3rem 2rem;
  background: ${props => props.$colorScheme.colors.surface};
  border-radius: 16px;
  border: 2px dashed ${props => props.$colorScheme.colors.border};
  margin: 2rem 0;
`;

const ConnectButton = styled.button<{ $colorScheme: any; }>`
  padding: 1rem 2rem;
  background: ${props => props.$colorScheme.colors.accent};
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  &:hover {
    background: ${props => props.$colorScheme.colors.accent}dd;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px ${props => props.$colorScheme.colors.accent}40;
  }
`;

const MainContent: React.FC = () => {
  const { currentColorScheme } = useColorScheme();
  const navigate = useNavigate();
  const { connected, publicKey } = useWallet();
  const handleWalletConnect = useHandleWalletConnect();
  const [gameFilter, setGameFilter] = useState<'all' | 'online' | 'coming-soon'>('all');

  // Filter games based on status
  const filteredGames = useMemo(() => {
    if (gameFilter === 'all') {
      return ALL_GAMES.filter(game => game.live !== 'offline');
    }
    return ALL_GAMES.filter(game => game.live === gameFilter);
  }, [gameFilter]);

  // Get game statistics
  const gameStats = useMemo(() => {
    const total = ALL_GAMES.length;
    const live = ALL_GAMES.filter(game => game.live === 'online').length;
    const newGames = ALL_GAMES.filter(game => game.live === 'coming-soon').length;
    const maintenance = ALL_GAMES.filter(game => game.live === 'offline').length;

    return { total, live, newGames, maintenance };
  }, []);

  const handleGameClick = (gameId: string, status: string) => {
    if (status === 'offline') return;
    if (!connected) {
      handleWalletConnect();
      return;
    }
    const wallet = publicKey?.toBase58();
    navigate(`/game/${wallet}/${gameId}`);
  };

  const handleConnectWallet = () => {
    handleWalletConnect();
  };

  return (
    <DashboardContainer $colorScheme={currentColorScheme}>
      <WelcomeSection $colorScheme={currentColorScheme}>
        <HeartTitle $colorScheme={currentColorScheme}>
          DegenHeart Casino
        </HeartTitle>
        <WelcomeText $colorScheme={currentColorScheme}>
          Welcome to the Casino of Chaos where romance meets risk in a jazz-at-midnight atmosphere.
          Experience provably fair gaming in the most elegant of all casino layouts.
        </WelcomeText>
      </WelcomeSection>

      <StatsGrid>
        <StatCard $colorScheme={currentColorScheme}>
          <StatValue $colorScheme={currentColorScheme}>{gameStats.total}</StatValue>
          <StatLabel $colorScheme={currentColorScheme}>Total Games</StatLabel>
        </StatCard>
        <StatCard $colorScheme={currentColorScheme}>
          <StatValue $colorScheme={currentColorScheme}>{gameStats.live}</StatValue>
          <StatLabel $colorScheme={currentColorScheme}>Live Games</StatLabel>
        </StatCard>
        <StatCard $colorScheme={currentColorScheme}>
          <StatValue $colorScheme={currentColorScheme}>{gameStats.newGames}</StatValue>
          <StatLabel $colorScheme={currentColorScheme}>New Games</StatLabel>
        </StatCard>
        <StatCard $colorScheme={currentColorScheme}>
          <StatValue $colorScheme={currentColorScheme}>{TOKEN_METADATA.length}</StatValue>
          <StatLabel $colorScheme={currentColorScheme}>Supported Tokens</StatLabel>
        </StatCard>
      </StatsGrid>

      <GamesSection>
        <SectionTitle $colorScheme={currentColorScheme}>
          Romantic Degen Games Collection
        </SectionTitle>

        <GameFilters>
          <FilterButton
            $colorScheme={currentColorScheme}
            $active={gameFilter === 'all'}
            onClick={() => setGameFilter('all')}
          >
            All Games
          </FilterButton>
          <FilterButton
            $colorScheme={currentColorScheme}
            $active={gameFilter === 'online'}
            onClick={() => setGameFilter('online')}
          >
            Live
          </FilterButton>
          <FilterButton
            $colorScheme={currentColorScheme}
            $active={gameFilter === 'coming-soon'}
            onClick={() => setGameFilter('coming-soon')}
          >
            New
          </FilterButton>
        </GameFilters>

        {!connected && (
          <ConnectPrompt $colorScheme={currentColorScheme}>
            <h3 style={{ marginBottom: '1rem', color: currentColorScheme.colors.text }}>
              Connect Your Wallet to Play
            </h3>
            <p style={{ marginBottom: '1.5rem', color: currentColorScheme.colors.text + '80' }}>
              Join the DegenHeart Casino experience with provably fair gaming
            </p>
            <ConnectButton $colorScheme={currentColorScheme} onClick={handleConnectWallet}>
              Connect Wallet
            </ConnectButton>
          </ConnectPrompt>
        )}

        <GamesGrid>
          {filteredGames.map(game => (
            <GameCard
              key={game.id}
              $colorScheme={currentColorScheme}
              onClick={() => handleGameClick(game.id, game.live)}
            >
              <GameImage $backgroundImage={game.meta.image}>
                <GameStatus $colorScheme={currentColorScheme} $status={game.live}>
                  {game.live === 'online' ? 'Live' : game.live === 'coming-soon' ? 'New' : 'Maintenance'}
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
      </GamesSection>
    </DashboardContainer>
  );
};

export default MainContent;
