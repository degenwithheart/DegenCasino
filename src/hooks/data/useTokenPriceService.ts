import { useState, useEffect } from 'react';
import { tokenPriceService, TokenPrice } from '../../services/TokenPriceService';

export const useTokenPriceService = () => {
  const [tokenPrices, setTokenPrices] = useState<TokenPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    const fetchPrices = async () => {
      try {
        const prices = await tokenPriceService.getAllTokenPrices();
        if (isMounted) {
          setTokenPrices(prices);
          setLastUpdate(Date.now());
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch token prices:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Fetch immediately
    fetchPrices();

    // Set up interval for updates
    const interval = setInterval(fetchPrices, 60000); // Update every minute

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const getTokenPriceData = (mintAddress: string): TokenPrice | null => {
    return tokenPrices.find(price => price.mintAddress === mintAddress) || null;
  };

  return {
    tokenPrices,
    getTokenPriceData,
    isLoading,
    lastUpdate
  };
};
