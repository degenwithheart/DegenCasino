import { TOKEN_METADATA, updateTokenPrices } from '../constants';

export interface TokenPrice {
  mintAddress: string;
  symbol: string;
  currentPrice: number;
  isLivePrice: boolean; // true if from API, false if fallback
  lastUpdated: number;
  source: 'api' | 'fallback' | 'unavailable';
}

class TokenPriceService {
  private priceCache = new Map<string, TokenPrice>();
  private lastFetchTime = 0;
  private fetchInterval = 60000; // 1 minute
  private isUpdating = false;

  /**
   * Get current price for a token
   * Returns live API price if available, otherwise fallback to constants
   */
  async getTokenPrice(mintAddress: string): Promise<TokenPrice | null> {
    // Check if we need to update prices
    const now = Date.now();
    if (now - this.lastFetchTime > this.fetchInterval && !this.isUpdating) {
      await this.updatePrices();
    }

    return this.priceCache.get(mintAddress) || null;
  }

  /**
   * Get all current token prices
   */
  async getAllTokenPrices(): Promise<TokenPrice[]> {
    const now = Date.now();
    if (now - this.lastFetchTime > this.fetchInterval && !this.isUpdating) {
      await this.updatePrices();
    }

    return Array.from(this.priceCache.values());
  }

  /**
   * Update prices from API sources with fallback to constants
   */
  async updatePrices(): Promise<void> {
    if (this.isUpdating) return;
    this.isUpdating = true;
    const now = Date.now();
    try {
      // Store original prices for comparison
      const originalPrices = new Map<string, number>();
      TOKEN_METADATA.forEach(token => {
        const mintAddress = token.mint.toBase58();
        if (token.usdPrice) {
          originalPrices.set(mintAddress, token.usdPrice);
        }
      });

      // Directly update from API sources (no server cache in client code)
      await updateTokenPrices();

      // Check what we got and create price objects
      TOKEN_METADATA.forEach(token => {
        const mintAddress = token.mint.toBase58();
        const symbol = token.symbol || 'UNK';
        const originalPrice = originalPrices.get(mintAddress);
        const currentApiPrice = token.usdPrice;

        let priceData: TokenPrice;

        if (currentApiPrice && currentApiPrice !== originalPrice) {
          // We got a fresh price from API
          priceData = {
            mintAddress,
            symbol,
            currentPrice: currentApiPrice,
            isLivePrice: true,
            lastUpdated: now,
            source: 'api',
          };
        } else if (originalPrice) {
          // Fallback to constants price
          priceData = {
            mintAddress,
            symbol,
            currentPrice: originalPrice,
            isLivePrice: false,
            lastUpdated: now,
            source: 'fallback',
          };
        } else {
          // No price available
          priceData = {
            mintAddress,
            symbol,
            currentPrice: 0,
            isLivePrice: false,
            lastUpdated: now,
            source: 'unavailable',
          };
        }

        this.priceCache.set(mintAddress, priceData);
      });

      this.lastFetchTime = now;
      console.log('🔄 Price service updated:', this.priceCache.size, 'tokens');
    } catch (error) {
      console.error('💥 Failed to update token prices:', error);
      // If API fails completely, use fallback prices from constants
      TOKEN_METADATA.forEach(token => {
        const mintAddress = token.mint.toBase58();
        const symbol = token.symbol || 'UNK';
        const fallbackPrice = this.getFallbackPrice(mintAddress);
        if (fallbackPrice > 0) {
          const priceData: TokenPrice = {
            mintAddress,
            symbol,
            currentPrice: fallbackPrice,
            isLivePrice: false,
            lastUpdated: now,
            source: 'fallback',
          };
          this.priceCache.set(mintAddress, priceData);
        }
      });
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * Get fallback price from constants
   */
  private getFallbackPrice(mintAddress: string): number {
    const token = TOKEN_METADATA.find(t => t.mint.toBase58() === mintAddress);
    return token?.usdPrice || 0;
  }

  /**
   * Get price change between current and previous
   */
  getPriceChange(mintAddress: string, previousPrice: number): {
    currentPrice: number;
    change: number;
    percentageChange: number;
    isLiveData: boolean;
  } | null {
    const priceData = this.priceCache.get(mintAddress);
    if (!priceData || priceData.currentPrice <= 0) return null;

    const change = priceData.currentPrice - previousPrice;
    const percentageChange = previousPrice > 0 ? (change / previousPrice) * 100 : 0;

    return {
      currentPrice: priceData.currentPrice,
      change,
      percentageChange,
      isLiveData: priceData.isLivePrice,
    };
  }

  /**
   * Check if we have live data for a token
   */
  hasLiveData(mintAddress: string): boolean {
    const priceData = this.priceCache.get(mintAddress);
    return priceData?.isLivePrice || false;
  }

  /**
   * Get the data source for a token price
   */
  getPriceSource(mintAddress: string): 'api' | 'fallback' | 'unavailable' {
    const priceData = this.priceCache.get(mintAddress);
    return priceData?.source || 'unavailable';
  }

  /**
   * Force immediate price update
   */
  async forceUpdate(): Promise<void> {
    this.lastFetchTime = 0; // Reset timer
    await this.updatePrices();
  }

  /**
   * Get price age in milliseconds
   */
  getPriceAge(mintAddress: string): number {
    const priceData = this.priceCache.get(mintAddress);
    if (!priceData) return Infinity;
    return Date.now() - priceData.lastUpdated;
  }
}

// Export singleton instance
export const tokenPriceService = new TokenPriceService();
