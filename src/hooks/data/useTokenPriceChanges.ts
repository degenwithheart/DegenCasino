import { useEffect, useState } from 'react';
import { TOKEN_METADATA } from '../../constants';
import { tokenPriceService } from '../../services/TokenPriceService';

export interface TokenPriceChange {
  mintAddress: string;
  symbol: string;
  currentPrice: number;
  previousPrice: number;
  percentageChange: number;
  isIncreasing: boolean;
  isSignificant: boolean; // Change > 5%
  isLiveData: boolean; // From API vs fallback
  timestamp: number;
}

/**
 * Hook to track real-time token price changes for visual indicators
 * Returns price change data for all tracked tokens
 */
export function useTokenPriceChanges() {
  const [priceChanges, setPriceChanges] = useState<{ [mintAddress: string]: TokenPriceChange }>({});
  const [lastSnapshot, setLastSnapshot] = useState<{ [mintAddress: string]: number }>({});

  useEffect(() => {
    const checkPriceChanges = async () => {
      const newChanges: { [mintAddress: string]: TokenPriceChange } = {};
      
      try {
        // Get all current prices from the service
        const allPrices = await tokenPriceService.getAllTokenPrices();
        
        allPrices.forEach(priceData => {
          const { mintAddress, symbol, currentPrice, isLivePrice } = priceData;
          const previousPrice = lastSnapshot[mintAddress] || currentPrice;
          
          if (currentPrice > 0 && previousPrice > 0 && currentPrice !== previousPrice) {
            const priceChange = currentPrice - previousPrice;
            const percentageChange = (priceChange / previousPrice) * 100;
            const isIncreasing = priceChange > 0;
            const isSignificant = Math.abs(percentageChange) >= 5;

            newChanges[mintAddress] = {
              mintAddress,
              symbol,
              currentPrice,
              previousPrice,
              percentageChange,
              isIncreasing,
              isSignificant,
              isLiveData: isLivePrice,
              timestamp: Date.now(),
            };
          }
        });

        if (Object.keys(newChanges).length > 0) {
          setPriceChanges(prev => ({ ...prev, ...newChanges }));
        }

        // Update snapshot for next comparison
        const newSnapshot: { [mintAddress: string]: number } = {};
        allPrices.forEach(priceData => {
          newSnapshot[priceData.mintAddress] = priceData.currentPrice;
        });
        setLastSnapshot(newSnapshot);
        
      } catch (error) {
        console.error('Error checking price changes:', error);
        
        // Fallback to constants data if service fails
        TOKEN_METADATA.forEach(token => {
          const mintAddress = token.mint.toBase58();
          const currentPrice = token.usdPrice || 0;
          const previousPrice = lastSnapshot[mintAddress] || currentPrice;
          
          if (currentPrice > 0 && previousPrice > 0 && currentPrice !== previousPrice) {
            const priceChange = currentPrice - previousPrice;
            const percentageChange = (priceChange / previousPrice) * 100;
            const isIncreasing = priceChange > 0;
            const isSignificant = Math.abs(percentageChange) >= 5;

            newChanges[mintAddress] = {
              mintAddress,
              symbol: token.symbol || 'UNK',
              currentPrice,
              previousPrice,
              percentageChange,
              isIncreasing,
              isSignificant,
              isLiveData: false, // Fallback data
              timestamp: Date.now(),
            };
          }
        });
        
        if (Object.keys(newChanges).length > 0) {
          setPriceChanges(prev => ({ ...prev, ...newChanges }));
        }
      }
    };

    // Check immediately and then every 30 seconds
    checkPriceChanges();
    const interval = setInterval(checkPriceChanges, 30000);
    
    return () => clearInterval(interval);
  }, [lastSnapshot]);

  // Clean up old price changes (older than 5 minutes)
  useEffect(() => {
    const cleanup = () => {
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      setPriceChanges(prev => {
        const cleaned = { ...prev };
        Object.keys(cleaned).forEach(key => {
          if (cleaned[key].timestamp < fiveMinutesAgo) {
            delete cleaned[key];
          }
        });
        return cleaned;
      });
    };

    const cleanupInterval = setInterval(cleanup, 60000); // Clean every minute
    return () => clearInterval(cleanupInterval);
  }, []);

  const getTokenChange = (mintAddress: string): TokenPriceChange | null => {
    return priceChanges[mintAddress] || null;
  };

  const getRecentSignificantChanges = (): TokenPriceChange[] => {
    return Object.values(priceChanges)
      .filter(change => change.isSignificant)
      .sort((a, b) => Math.abs(b.percentageChange) - Math.abs(a.percentageChange));
  };

  return {
    priceChanges,
    getTokenChange,
    getRecentSignificantChanges,
  };
}
