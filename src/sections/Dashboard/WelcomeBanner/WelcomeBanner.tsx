import { useWallet } from "@solana/wallet-adapter-react";
import { POOLS } from "../../../constants";
import { useTokenMeta } from "gamba-react-ui-v2";
import { Connection } from '@solana/web3.js';
import { RPC_ENDPOINT } from '../../../constants';
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useColorScheme } from "../../../themes/ColorSchemeContext";
import { QUOTES } from "../../../constants/QuotesVault";
import { 
  UnifiedSection,
  UnifiedPageTitle 
} from '../../../components/UI/UnifiedDesign';
import styled, { keyframes } from 'styled-components';

// Animated gradient line keyframes
const loveLetterGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Romantic animated accent bar (gradient line)
const AccentBar = styled.div`
  height: 4px;
  width: 100%;
  border-radius: 8px;
  margin: 0.5rem 0 1.5rem;
  background: linear-gradient(90deg, 
    rgba(212, 165, 116, 0.8) 0%, 
    rgba(184, 51, 106, 0.6) 25%, 
    rgba(139, 90, 158, 0.7) 50%, 
    rgba(184, 51, 106, 0.6) 75%, 
    rgba(212, 165, 116, 0.8) 100%
  );
  background-size: 300% 100%;
  animation: ${loveLetterGradient} 6s ease-in-out infinite;
  box-shadow: 0 0 12px rgba(212, 165, 116, 0.3);
`;

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
    <UnifiedSection title="🎰 Welcome to the Casino of Chaos 🎰">
      {/* Gradient Line */}
      <AccentBar />
      
      <div style={{
        width: '100%',
        minHeight: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: '1.2rem',
        fontWeight: 500,
        color: 'var(--text-primary)',
        background: 'var(--slate-2)',
        borderRadius: 12,
        padding: '1.5rem 2rem',
        border: '1px solid var(--slate-6)',
        margin: '1rem 0',
        fontStyle: 'italic'
      }}>
        {quote}
      </div>
      
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        gap: '1rem',
        marginTop: '2rem',
        paddingBottom: '0.5rem',
        scrollSnapType: 'x mandatory'
      }}>
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
          <div key={title} style={{
            background: 'var(--slate-2)',
            border: '1px solid var(--slate-6)',
            borderRadius: 8,
            padding: '1rem',
            textAlign: 'center',
            minWidth: '250px',
            flexShrink: 0,
            scrollSnapAlign: 'start'
          }}>
            <h3 style={{ 
              color: 'var(--text-primary)', 
              fontSize: '1.1rem', 
              margin: '0 0 0.5rem 0' 
            }}>
              {title}
            </h3>
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '0.9rem', 
              margin: 0 
            }}>
              {text}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom Gradient Line */}
      <AccentBar style={{ margin: '1.5rem 0 0.5rem' }} />
    </UnifiedSection>
  );
}
