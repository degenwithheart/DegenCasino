import { useWallet } from "@solana/wallet-adapter-react";
import { POOLS } from "../../../constants";
import { useTokenMeta } from "gamba-react-ui-v2";
import { Connection } from '@solana/web3.js';
import { RPC_ENDPOINT } from '../../../constants';
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useTheme } from "../../../themes/ThemeContext";
import { QUOTES } from "../../../constants/QuotesVault";
import { Container, Banner, BannerBottomBar, Heading, JackpotTicker, HeroOverlay, FeatureGrid, FeatureCard } from './WelcomeBanner.styles';

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
  const { currentTheme } = useTheme();

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
    <Container $isVisible={true} $isLoading={false} $theme={currentTheme}>
      <Banner $theme={currentTheme}>
        <HeroOverlay $theme={currentTheme}>
          <Heading $theme={currentTheme}>Welcome to the casino of chaos</Heading>
        </HeroOverlay>
        <BannerBottomBar $theme={currentTheme}>
          <JackpotTicker $theme={currentTheme} key={quote}>{quote}</JackpotTicker>
        </BannerBottomBar>
      </Banner>
      <FeatureGrid $theme={currentTheme}>
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
          <FeatureCard $theme={currentTheme} key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </FeatureCard>
        ))}
      </FeatureGrid>
    </Container>
  );
}
