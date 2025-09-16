import { useWallet } from "@solana/wallet-adapter-react";
import { POOLS } from "../../../constants";
import { useTokenMeta } from "gamba-react-ui-v2";
import { Connection } from '@solana/web3.js';
import { RPC_ENDPOINT } from '../../../constants';
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useColorScheme } from "../../../themes/ColorSchemeContext";
import { QUOTES } from "../../../constants/QuotesVault";
import { Container, Banner, BannerBottomBar, Heading, JackpotTicker, HeroOverlay, FeatureGrid, FeatureCard, QuotesSection, QuotesTicker } from './WelcomeBanner.styles';

// Throttle hook for future-proofing (matches ConnectionStatus pattern)
function useThrottle(callback: (...args: any[]) => void, delay: number) {
  const lastCall = useRef(0);
  return useCallback((...args: any[]) => {
    const now = Date.now();
    if (now - lastCall.current > delay) {
      lastCall.current = now;
      callback(...args);
    }
  }, [callback, delay]);
}

type JackpotInfo = {
  icon?: string;
  name: string;
  symbol: string;
  jackpot: number | string;
};

// Custom hook to cycle through random Degen/web3/Trench/casino quotes every 3 seconds
function useRandomQuote(): string {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * QUOTES.length));
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % QUOTES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);
  return `"${QUOTES[index]}" #DegenSerenade`;
}

export function WelcomeBanner() {
  const wallet = useWallet();
  const quote = useRandomQuote();
  const { currentColorScheme } = useColorScheme();

  // Track if wallet auto-connect attempt has finished to prevent flash
  const [autoConnectAttempted, setAutoConnectAttempted] = useState(false);

  useEffect(() => {
    // If wallet.connecting just transitioned to false, mark auto-connect as attempted
    if (!wallet.connecting) {
      setAutoConnectAttempted(true);
    }
  }, [wallet.connecting]);

  // Show welcome banner only when:
  // 1. Auto-connect has been attempted (to prevent flash)
  // 2. Wallet is not connected
  // 3. Wallet is not currently connecting
  const shouldShow = autoConnectAttempted && !wallet.connected && !wallet.connecting;

  // Only render the DOM if the banner should be visible
  if (!shouldShow) return null;

  return (
    <Container $isVisible={true} $isLoading={false} $colorScheme={currentColorScheme}>
      <Banner $colorScheme={currentColorScheme}>
        <HeroOverlay $colorScheme={currentColorScheme}>
          <Heading $colorScheme={currentColorScheme}>Welcome to the casino of chaos</Heading>
        </HeroOverlay>
      </Banner>
      <QuotesSection $colorScheme={currentColorScheme} style={{
        width: '100%',
        minHeight: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: '1.35rem',
        fontWeight: 600,
        color: currentColorScheme?.colors?.primary || '#ffd700',
        background: currentColorScheme?.colors?.surface
          ? `linear-gradient(135deg, ${currentColorScheme.colors.surface}60 0%, ${currentColorScheme.colors.background}80 100%)`
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(15, 15, 35, 0.6) 100%)',
        borderRadius: 16,
        padding: '1.5rem 2rem',
        boxShadow: currentColorScheme?.effects?.shadow || '0 8px 24px rgba(0, 0, 0, 0.3)',
        border: `2px solid ${currentColorScheme?.colors?.border || 'rgba(255, 215, 0, 0.2)'}`,
        transition: 'all 0.4s ease',
        gap: '1.2rem',
        textShadow: currentColorScheme?.effects?.textGlow || '0 0 12px #ffd700',
        fontFamily: currentColorScheme?.typography?.fontFamily || "'Arial', sans-serif",
        letterSpacing: '0.8px',
        backdropFilter: 'blur(12px)',
        position: 'relative',
        overflow: 'hidden',
      }}
        key={quote}
      >
        {quote}
      </QuotesSection>
      <FeatureGrid $colorScheme={currentColorScheme}>
        {[
          {
            title: "🔒 No Registration",
            text: "Just connect and start playing.",
          },
          {
            title: "🛡️ Non‑Custodial",
            text: "You always control your wallet.",
          },
          {
            title: "✅ Provably Fair",
            text: "On‑chain randomness, transparent.",
          },
          {
            title: "⚡ Instant Payouts",
            text: "Winnings go straight to wallet.",
          },
        ].map(({ title, text }) => (
          <FeatureCard $colorScheme={currentColorScheme} key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </FeatureCard>
        ))}
      </FeatureGrid>
    </Container>
  );
}
