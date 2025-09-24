import React, { useState, useEffect, useContext } from "react";
// Context to allow opening the games modal from anywhere
export const GamesModalContext = React.createContext<{ openGamesModal: () => void }>({ openGamesModal: () => {} });
import { usePageSEO } from '../../hooks/ui/useGameSEO';
import { SlideSection, EnhancedTickerTape, FullReferralLeaderboard } from "../../components";
import { FEATURED_GAMES } from "../../games/featuredGames";
import { GAMES } from "../../games";
import { GameCard } from "./GameCard";
import { FeaturedGameCard } from "./FeaturedGameCard/FeaturedGameCard";
import { WelcomeBanner } from "./WelcomeBanner/WelcomeBanner";
import RecentPlays from "../RecentPlays/RecentPlays";
import { useWallet } from "@solana/wallet-adapter-react";
import { useHandleWalletConnect } from "../walletConnect";
import { TOKEN_METADATA, updateTokenPrices, ENABLE_LEADERBOARD, DASHBOARD_SHOW_RECENT_PLAYS, DASHBOARD_SHOW_LEADERBOARD } from "../../constants";
import { useIsCompact } from "../../hooks/ui/useIsCompact";
import { useColorScheme } from "../../themes/ColorSchemeContext";
import { TotalBetsTopBar } from "../../components/TopBar/TotalBetsTopBar";
import { usePlatformStats } from "../../hooks/data/usePlatformStats";
import { 
  UnifiedPageContainer, 
  UnifiedSection, 
  UnifiedPageTitle
} from "../../components/UI/UnifiedDesign";
import {
  GameSliderWrapper,
  GameCardWrapper,
  Grid,
  SectionWrapper,
  ConnectButton,
  ToggleButton
} from "./Dashboard.styles";
import styled, { keyframes } from 'styled-components';

// Animated gradient line keyframes
const loveLetterGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Romantic animated accent bar (gradient line)
const AccentBar = styled.div`
  height: 3px;
  background: linear-gradient(
    45deg,
    #d4a574, #b8336a, #e07d91, #d4a574
  );
  background-size: 400% 400%;
  animation: ${loveLetterGradient} 6s ease infinite;
  margin: 1.2rem 0;
  border-radius: 2px;
  box-shadow: 0 0 15px rgba(212, 165, 116, 0.4);
`;

// Dashboard stats section container
const DashboardStatsSection = styled.div<{ $colorScheme?: any }>`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1.5rem 0 2rem 0;
  padding: 0 1rem;

  @media (max-width: 768px) {
    margin: 1rem 0 1.5rem 0;
  }
`;

export function GameSlider({ compact }: { compact?: boolean }) {
  return (
    <GameSliderWrapper>
      {FEATURED_GAMES.map((game) => (
        <GameCardWrapper key={game.id} $compact={compact}>
          <FeaturedGameCard game={game} />
        </GameCardWrapper>
      ))}
    </GameSliderWrapper>
  );
}

export function Dashboard() {
  // SEO for Dashboard
  const seoHelmet = usePageSEO(
    "DegenHeart.casino - Solana On-chain Web3 Casino", 
    "Welcome to the Casino of Chaos 🔥 No sign-ups, no BS. Just connect and dive in. Non-custodial, provably fair Solana casino with instant payouts."
  )

  const { connected, connect, publicKey } = useWallet();
  const { compact, screenTooSmall } = useIsCompact();
  const handleWalletConnect = useHandleWalletConnect();
  const { openGamesModal } = useContext(GamesModalContext);
  const { currentColorScheme } = useColorScheme();
  const [visible, setVisible] = useState(false);

  const [activeSection, setActiveSection] = useState<'games' | 'plays' | 'referrals'>('games');

  // Platform stats for Total Bets display
  const { stats, loading, error } = usePlatformStats();

  // Filtered game lists
  const singleplayerGames = GAMES().filter(g => g.meta?.tag?.toLowerCase() === 'singleplayer' && g.live !== 'new');
  const multiplayerGames = GAMES().filter(g => g.meta?.tag?.toLowerCase() === 'multiplayer' && g.live !== 'new');
  const liveNewGames = GAMES().filter(g => g.live === 'new');

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <>
      {seoHelmet}
      <UnifiedPageContainer>
        <WelcomeBanner />
        <AccentBar />
        <EnhancedTickerTape />

        {connected && (
          <>
            {/* Toggle Buttons */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: compact ? '0.8rem' : '1.5rem', 
              margin: '2rem 0',
              flexWrap: 'wrap'
            }}>
              <ToggleButton
                $active={activeSection === 'games'}
                $compact={compact}
                $colorScheme={currentColorScheme}
                onClick={() => setActiveSection('games')}
              >
                🃏 All Games
              </ToggleButton>
              {DASHBOARD_SHOW_RECENT_PLAYS && (
                <ToggleButton
                  $active={activeSection === 'plays'}
                  $compact={compact}
                  $colorScheme={currentColorScheme}
                  onClick={() => setActiveSection('plays')}
                >
                  🕹️ Recent Plays
                </ToggleButton>
              )}
              {DASHBOARD_SHOW_LEADERBOARD && ENABLE_LEADERBOARD && (
                <ToggleButton
                  $active={activeSection === 'referrals'}
                  $compact={compact}
                  $colorScheme={currentColorScheme}
                  onClick={() => setActiveSection('referrals')}
                >
                  🏆 Referral Leaders
                </ToggleButton>
              )}
            </div>

            {/* Dashboard Stats Section - Total Bets */}
            <DashboardStatsSection $colorScheme={currentColorScheme}>
              <TotalBetsTopBar 
                stats={stats} 
                loading={loading} 
                error={error} 
                colorScheme={currentColorScheme} 
              />
            </DashboardStatsSection>

            {/* Toggle Content */}
            {activeSection === 'games' && (
              <>
                <UnifiedSection title="🎰 Featured Games">
                  <AccentBar />
                  <GameSlider compact={compact} />
                </UnifiedSection>
                
                <UnifiedSection title="🎮 Singleplayer Games">
                  <AccentBar />
                  <GameSliderWrapper>
                    {singleplayerGames.map((game) => (
                      <GameCardWrapper key={game.id} $compact={compact}>
                        <FeaturedGameCard game={game} />
                      </GameCardWrapper>
                    ))}
                  </GameSliderWrapper>
                </UnifiedSection>
                
                <UnifiedSection title="🎲 Multiplayer Games">
                  <AccentBar />
                  <GameSliderWrapper>
                    {multiplayerGames.map((game) => (
                      <GameCardWrapper key={game.id} $compact={compact}>
                        <FeaturedGameCard game={game} />
                      </GameCardWrapper>
                    ))}
                  </GameSliderWrapper>
                </UnifiedSection>
                
                <UnifiedSection title="🚀 Coming Soon">
                  <AccentBar />
                  <GameSliderWrapper>
                    {liveNewGames.map((game) => (
                      <GameCardWrapper key={game.id} $compact={compact}>
                        <FeaturedGameCard game={game} />
                      </GameCardWrapper>
                    ))}
                  </GameSliderWrapper>
                </UnifiedSection>
              </>
            )}

            {activeSection === 'plays' && DASHBOARD_SHOW_RECENT_PLAYS && (
              <UnifiedSection title="🕹️ Recent Plays">
                <AccentBar />
                <RecentPlays showAllPlatforms={false} />
              </UnifiedSection>
            )}

            {activeSection === 'referrals' && DASHBOARD_SHOW_LEADERBOARD && ENABLE_LEADERBOARD && (
              <UnifiedSection title="🏆 Referral Leaders">
                <AccentBar />
                <FullReferralLeaderboard />
              </UnifiedSection>
            )}
          </>
        )}

      </UnifiedPageContainer>
    </>
  );
}

export default Dashboard;
