import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { TokenMeta } from 'gamba-react-ui-v2';
import { PublicKey } from '@solana/web3.js';
import { TOKEN_METADATA } from '../constants';
import { MilestoneType, TokenMilestone } from '../components/TokenMilestoneModal';
import { tokenPriceService, TokenPrice } from '../services/TokenPriceService';

// Use our local token type that matches TOKEN_METADATA
type TokenMetaLocal = {
  mint: { toBase58(): string };
  name?: string;
  symbol?: string;
  image?: string;
  usdPrice?: number;
};

// Convert local token to TokenMeta for milestone
const toTokenMeta = (token: TokenMetaLocal): TokenMeta => ({
  mint: new PublicKey(token.mint.toBase58()),
  name: token.name || 'Unknown',
  symbol: token.symbol || 'UNK',
  image: token.image || '',
  decimals: 9, // Default decimals
  baseWager: 0, // Default base wager
  usdPrice: token.usdPrice,
});

interface PriceHistory {
  price: number;
  timestamp: number;
}

interface TokenPriceData {
  [mintAddress: string]: {
    currentPrice: number;
    previousPrice: number;
    ath: number;
    history: PriceHistory[];
    lastMilestoneTime: number;
    isLiveData: boolean; // Track if using live API data or fallback
    priceSource: 'api' | 'fallback' | 'unavailable';
  };
}

interface MilestoneContextType {
  showMilestone: (milestone: TokenMilestone) => void;
  currentMilestone: TokenMilestone | null;
  isModalOpen: boolean;
  closeMilestone: () => void;
}

const MilestoneContext = createContext<MilestoneContextType | null>(null);

// Milestone detection settings
const MILESTONE_SETTINGS = {
  ATH_COOLDOWN: 5 * 60 * 1000, // 5 minutes cooldown between ATH notifications for same token
  MIN_PERCENTAGE_GAIN: 10, // Minimum 10% gain to trigger milestone
  MIN_PRICE_THRESHOLD: 0.0001, // Minimum price to avoid micro-movements
  PRICE_TARGET_THRESHOLDS: [0.001, 0.01, 0.1, 1, 10, 100, 1000], // Price targets that trigger milestones
};

export function MilestoneProvider({ children }: { children: React.ReactNode }) {
  const [currentMilestone, setCurrentMilestone] = useState<TokenMilestone | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [priceData, setPriceData] = useState<TokenPriceData>({});
  const lastCheckRef = useRef<number>(Date.now());

  // Initialize price data for all tokens
  useEffect(() => {
    const initializeTokenData = async () => {
      const initialData: TokenPriceData = {};
      
      // Get initial prices from the price service
      await tokenPriceService.forceUpdate();
      const allPrices = await tokenPriceService.getAllTokenPrices();
      
      TOKEN_METADATA.forEach(token => {
        const mintAddress = token.mint.toBase58();
        const priceData = allPrices.find(p => p.mintAddress === mintAddress);
        const currentPrice = priceData?.currentPrice || 0;
        
        initialData[mintAddress] = {
          currentPrice,
          previousPrice: currentPrice,
          ath: currentPrice,
          history: [{ price: currentPrice, timestamp: Date.now() }],
          lastMilestoneTime: 0,
          isLiveData: priceData?.isLivePrice || false,
          priceSource: priceData?.source || 'unavailable',
        };
      });
      
      setPriceData(initialData);
    };

    initializeTokenData();
  }, []);

  // Monitor price changes and detect milestones
  useEffect(() => {
    const checkForMilestones = async () => {
      const now = Date.now();
      const timeSinceLastCheck = now - lastCheckRef.current;
      
      // Only check every 30 seconds to avoid spam
      if (timeSinceLastCheck < 30000) return;
      
      lastCheckRef.current = now;

      try {
        // Get fresh prices from the service
        const allPrices = await tokenPriceService.getAllTokenPrices();
        
        allPrices.forEach(priceInfo => {
          const { mintAddress, currentPrice, isLivePrice, source } = priceInfo;
          
          // Skip if price is too low or unavailable
          if (!currentPrice || currentPrice < MILESTONE_SETTINGS.MIN_PRICE_THRESHOLD) return;
          
          const token = TOKEN_METADATA.find(t => t.mint.toBase58() === mintAddress);
          if (!token) return;

          const tokenData = priceData[mintAddress];
          if (!tokenData) return;

          const previousPrice = tokenData.currentPrice;
          const priceChange = currentPrice - previousPrice;
          const percentageChange = previousPrice > 0 ? (priceChange / previousPrice) * 100 : 0;
          
          // Skip if price hasn't changed significantly
          if (Math.abs(percentageChange) < 0.1) return;

          // Update price data
          setPriceData(prev => ({
            ...prev,
            [mintAddress]: {
              ...prev[mintAddress],
              previousPrice: prev[mintAddress].currentPrice,
              currentPrice,
              ath: Math.max(prev[mintAddress].ath, currentPrice),
              isLiveData: isLivePrice,
              priceSource: source,
              history: [
                ...prev[mintAddress].history.slice(-99), // Keep last 100 entries
                { price: currentPrice, timestamp: now }
              ],
            },
          }));

          // Only trigger milestones for live data (not fallback prices)
          if (isLivePrice) {
            // Check for milestones
            const tokenMeta = toTokenMeta(token);
            checkATH(tokenMeta, currentPrice, tokenData, now);
            checkPercentageGain(tokenMeta, currentPrice, percentageChange, tokenData, now);
            checkPriceTargets(tokenMeta, currentPrice, previousPrice, tokenData, now);
          }
        });
      } catch (error) {
        console.error('Error checking for milestones:', error);
      }
    };

    const interval = setInterval(checkForMilestones, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [priceData]);

  const checkATH = (token: TokenMeta, currentPrice: number, tokenData: any, now: number) => {
    const isNewATH = currentPrice > tokenData.ath;
    const cooldownPassed = now - tokenData.lastMilestoneTime > MILESTONE_SETTINGS.ATH_COOLDOWN;
    
    if (isNewATH && cooldownPassed) {
      const dataSource = tokenData.isLiveData ? '📡 Live' : '📊 Fallback';
      const milestone: TokenMilestone = {
        type: 'ath',
        token,
        currentPrice,
        previousPrice: tokenData.ath,
        message: `${token.symbol} just broke through to a new all-time high! The bulls are charging! 🐂 (${dataSource} data)`,
        emoji: '🚀🌙✨🎯💎',
      };
      
      showMilestone(milestone);
      updateLastMilestoneTime(token.mint.toBase58(), now);
    }
  };

  const checkPercentageGain = (token: TokenMeta, currentPrice: number, percentageChange: number, tokenData: any, now: number) => {
    const significantGain = percentageChange >= MILESTONE_SETTINGS.MIN_PERCENTAGE_GAIN;
    const cooldownPassed = now - tokenData.lastMilestoneTime > MILESTONE_SETTINGS.ATH_COOLDOWN;
    
    if (significantGain && cooldownPassed) {
      const dataSource = tokenData.isLiveData ? '📡 Live' : '📊 Fallback';
      const milestone: TokenMilestone = {
        type: 'percentage_gain',
        token,
        currentPrice,
        previousPrice: tokenData.previousPrice,
        percentageChange,
        message: `${token.symbol} is absolutely pumping! This is the kind of action degens live for! 💪 (${dataSource} data)`,
        emoji: '📈🔥💰🚀🌕',
      };
      
      showMilestone(milestone);
      updateLastMilestoneTime(token.mint.toBase58(), now);
    }
  };

  const checkPriceTargets = (token: TokenMeta, currentPrice: number, previousPrice: number, tokenData: any, now: number) => {
    const cooldownPassed = now - tokenData.lastMilestoneTime > MILESTONE_SETTINGS.ATH_COOLDOWN;
    if (!cooldownPassed) return;

    for (const target of MILESTONE_SETTINGS.PRICE_TARGET_THRESHOLDS) {
      if (previousPrice < target && currentPrice >= target) {
        const dataSource = tokenData.isLiveData ? '📡 Live' : '📊 Fallback';
        const milestone: TokenMilestone = {
          type: 'price_target',
          token,
          currentPrice,
          previousPrice,
          targetPrice: target,
          message: `${token.symbol} just crossed the $${target} milestone! Next stop, the moon! 🌙 (${dataSource} data)`,
          emoji: '🎯🎉💎🚀⭐',
        };
        
        showMilestone(milestone);
        updateLastMilestoneTime(token.mint.toBase58(), now);
        break; // Only trigger one target per check
      }
    }
  };

  const updateLastMilestoneTime = (mintAddress: string, timestamp: number) => {
    setPriceData(prev => ({
      ...prev,
      [mintAddress]: {
        ...prev[mintAddress],
        lastMilestoneTime: timestamp,
      },
    }));
  };

  const showMilestone = (milestone: TokenMilestone) => {
    setCurrentMilestone(milestone);
    setIsModalOpen(true);
  };

  const closeMilestone = () => {
    setIsModalOpen(false);
    // Clear milestone after animation completes
    setTimeout(() => setCurrentMilestone(null), 300);
  };

  const contextValue: MilestoneContextType = {
    showMilestone,
    currentMilestone,
    isModalOpen,
    closeMilestone,
  };

  return (
    <MilestoneContext.Provider value={contextValue}>
      {children}
    </MilestoneContext.Provider>
  );
}

export function useMilestone() {
  const context = useContext(MilestoneContext);
  if (!context) {
    throw new Error('useMilestone must be used within a MilestoneProvider');
  }
  return context;
}

// Utility hook for manually triggering milestones (for testing or special events)
export function useManualMilestone() {
  const { showMilestone } = useMilestone();
  
  const triggerTestMilestone = (tokenSymbol: string = 'SOL') => {
    const token = TOKEN_METADATA.find(t => t.symbol === tokenSymbol);
    if (!token) return;
    
    const testMilestone: TokenMilestone = {
      type: 'ath',
      token: toTokenMeta(token),
      currentPrice: token.usdPrice || 100,
      previousPrice: (token.usdPrice || 100) * 0.9,
      percentageChange: 15.67,
      message: `Test milestone for ${token.symbol}! This is what happens when your bags moon! 🌙`,
      emoji: '🚀💎🌙⭐🎉',
    };
    
    showMilestone(testMilestone);
  };

  return { triggerTestMilestone };
}
