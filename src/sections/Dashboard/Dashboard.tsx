import React, { useState, useEffect, useContext } from "react";
// Context to allow opening the games modal from anywhere
export const GamesModalContext = React.createContext<{ openGamesModal: () => void }>({ openGamesModal: () => {} });
import { SlideSection, EnhancedTickerTape, FullReferralLeaderboard } from "../../components";
import { FEATURED_GAMES } from "../../games/featuredGames";
import { GAMES } from "../../games";
import { GameCard } from "./GameCard";
import { FeaturedGameCard } from "./FeaturedGameCard/FeaturedGameCard";
import { WelcomeBanner } from "./WelcomeBanner/WelcomeBanner";
import RecentPlays from "../RecentPlays/RecentPlays";
import { useWallet } from "@solana/wallet-adapter-react";
import { useHandleWalletConnect } from "../walletConnect";
import { TOKEN_METADATA, updateTokenPrices, ENABLE_LEADERBOARD } from "../../constants";
import { useIsCompact } from "../../hooks/useIsCompact";
import { useTheme } from "../../themes/ThemeContext";
import { useUserStore } from "../../hooks/useUserStore";
import {
  neonPulse,
  moveGradient,
  sparkle,
  AccentBar,
  CasinoSparkles,
  DashboardWrapper,
  CompactProps,
  GameSliderWrapper,
  GameCardWrapper,
  Grid,
  SectionWrapper,
  ConnectButton,
  ToggleButton
} from "./Dashboard.styles";

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
  const { connected, connect, publicKey } = useWallet();
  const { compact, screenTooSmall } = useIsCompact();
  const handleWalletConnect = useHandleWalletConnect();
  const { openGamesModal } = useContext(GamesModalContext);
  const { currentTheme } = useTheme();
  const particlesEnabled = useUserStore(s => s.particlesEnabled !== false)

  const [activeSection, setActiveSection] = useState<'games' | 'plays' | 'referrals'>('games');

  // Filtered game lists
  const singleplayerGames = GAMES().filter(g => g.meta?.tag?.toLowerCase() === 'singleplayer' && g.live !== 'new');
  const multiplayerGames = GAMES().filter(g => g.meta?.tag?.toLowerCase() === 'multiplayer' && g.live !== 'new');
  const liveNewGames = GAMES().filter(g => g.live === 'new');

  return (
    <DashboardWrapper $compact={compact} $theme={currentTheme}>
  {particlesEnabled && <CasinoSparkles>✨</CasinoSparkles>}
      <WelcomeBanner />
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
              $theme={currentTheme}
              onClick={() => setActiveSection('games')}
            >
              🃏 All Games
            </ToggleButton>
            <ToggleButton
              $active={activeSection === 'plays'}
              $compact={compact}
              $theme={currentTheme}
              onClick={() => setActiveSection('plays')}
            >
              🕹️ Recent Plays
            </ToggleButton>
            {ENABLE_LEADERBOARD && (
              <ToggleButton
                $active={activeSection === 'referrals'}
                $compact={compact}
                $theme={currentTheme}
                onClick={() => setActiveSection('referrals')}
              >
                🏆 Referral Leaders
              </ToggleButton>
            )}
          </div>

          {/* Toggle Content */}
          {activeSection === 'games' && (
            <>
              <AccentBar />
              <SectionWrapper $compact={compact}>
                <h2>Featured Games</h2>
                <GameSlider compact={compact} />
              </SectionWrapper>
              
              <AccentBar />
              <SectionWrapper $compact={compact}>
                <h2>Singleplayer Games</h2>
                <GameSliderWrapper>
                  {singleplayerGames.map((game) => (
                    <GameCardWrapper key={game.id} $compact={compact}>
                      <GameCard game={game} />
                    </GameCardWrapper>
                  ))}
                </GameSliderWrapper>
              </SectionWrapper>
              <AccentBar />
              <SectionWrapper $compact={compact}>
                <h2>Multiplayer Games</h2>
                <GameSliderWrapper>
                  {multiplayerGames.map((game) => (
                    <GameCardWrapper key={game.id} $compact={compact}>
                      <GameCard game={game} />
                    </GameCardWrapper>
                  ))}
                </GameSliderWrapper>
              </SectionWrapper>
              <AccentBar />
              <SectionWrapper $compact={compact}>
                <h2>Coming Soon</h2>
                <GameSliderWrapper>
                  {liveNewGames.map((game) => (
                    <GameCardWrapper key={game.id} $compact={compact}>
                      <GameCard game={game} />
                    </GameCardWrapper>
                  ))}
                </GameSliderWrapper>
              </SectionWrapper>
              <AccentBar />
            </>
          )}

          {activeSection === 'plays' && (
            <SectionWrapper $compact={compact}>
              <RecentPlays showAllPlatforms={false} />
            </SectionWrapper>
          )}

          {activeSection === 'referrals' && ENABLE_LEADERBOARD && (
            <>
              <AccentBar />
              <SectionWrapper $compact={compact}>
                <FullReferralLeaderboard />
              </SectionWrapper>
              <AccentBar />
            </>
          )}
        </>
      )}

    </DashboardWrapper>
  );
}
