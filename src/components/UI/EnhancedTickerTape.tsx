import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTokenPrices } from '../../hooks/useTokenPrices';
import styled, { keyframes, css } from 'styled-components';
import { useTokenPriceService } from '../../hooks/useTokenPriceService';

// Ticker animation
const tickerMove = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

// Pulse animation for significant changes
const pricePulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
`;

// Glow animation for hot tokens
const priceGlow = keyframes`
  0%, 100% { box-shadow: 0 0 8px #ffd70033; }
  50% { box-shadow: 0 0 16px #ffd700aa, 0 0 24px #ffd70066; }
`;

export function EnhancedTickerTape() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [shouldScroll, setShouldScroll] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Use the existing Gamba hook for basic token data
  const tokenMetadata = useTokenPrices();
  
  // Use our enhanced service for source information
  const { getTokenPriceData } = useTokenPriceService();
  
  // Track price history for change detection
  const [priceHistory, setPriceHistory] = useState<Record<string, { 
    price: number; 
    timestamp: number; 
    previousPrice?: number; // Add previous price for comparison
  }>>({});

  // Update price history when tokenMetadata changes
  useEffect(() => {
    if (!tokenMetadata) return;

    tokenMetadata.forEach((token: any) => {
      const mintAddress = token.mint.toBase58();
      const currentPrice = token.usdPrice || 0;
      
      setPriceHistory(prev => {
        const existing = prev[mintAddress];
        if (!existing || existing.price !== currentPrice) {
          return {
            ...prev,
            [mintAddress]: {
              price: currentPrice,
              timestamp: Date.now(),
              previousPrice: existing?.price || currentPrice // Store previous for comparison
            }
          };
        }
        return prev;
      });
    });
  }, [tokenMetadata]);

  // Handle resize and check if scrolling is needed
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      checkIfScrollNeeded();
    };
    
    const checkIfScrollNeeded = () => {
      if (!contentRef.current || !wrapperRef.current || isMobile) {
        setShouldScroll(false);
        return;
      }
      
      const contentWidth = contentRef.current.scrollWidth;
      const wrapperWidth = wrapperRef.current.clientWidth;
      setShouldScroll(contentWidth > wrapperWidth);
    };
    
    // Check on mount and when tokens change
    checkIfScrollNeeded();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [tokenMetadata, isMobile]);

  // Check if scrolling is needed when token data changes
  useEffect(() => {
    const checkIfScrollNeeded = () => {
      if (!contentRef.current || !wrapperRef.current || isMobile) {
        setShouldScroll(false);
        return;
      }
      
      const contentWidth = contentRef.current.scrollWidth;
      const wrapperWidth = wrapperRef.current.clientWidth;
      setShouldScroll(contentWidth > wrapperWidth);
    };
    
    // Delay check to ensure content is rendered
    setTimeout(checkIfScrollNeeded, 100);
  }, [tokenMetadata, isMobile]);

  const renderTokenItem = (token: any, key: string) => {
    const mintAddress = token.mint.toBase58();
    const currentPrice = token.usdPrice || 0;
    // Get enhanced price data from our service
    const priceData = getTokenPriceData(mintAddress);
    const isLiveData = priceData?.isLivePrice || false;
    const dataSource = priceData?.source || 'fallback';
    // Check price history for change detection
    const priceEntry = priceHistory[mintAddress];
    const hasRecentChange = priceEntry && (Date.now() - priceEntry.timestamp) < 5 * 60 * 1000; // 5 minutes
    // Calculate price change using stored previous price
    let priceChange = 0;
    let isIncreasing = false;
    if (priceEntry && priceEntry.previousPrice && priceEntry.previousPrice > 0 && currentPrice > 0) {
      priceChange = ((currentPrice - priceEntry.previousPrice) / priceEntry.previousPrice) * 100;
      isIncreasing = priceChange > 0;
    }
    const isSignificantChange = Math.abs(priceChange) > 2; // 2% or more
    const isTrending = currentPrice > 1; // Simple trending logic

    // Dexscreener URL for Solana tokens
    const dexscreenerUrl = `https://dexscreener.com/solana/${mintAddress}`;
    const isComingSoon = token.minted === false;

    const tokenContent = (
      <TokenItem 
        key={key}
        $hasChange={!!hasRecentChange && Math.abs(priceChange) > 0.1}
        $isIncreasing={!!isIncreasing}
        $isSignificant={!!isSignificantChange}
        $isLiveData={!!isLiveData}
        title={`${token.symbol} - ${isLiveData ? 'Live API data' : 'Fallback data'} | Change: ${priceChange.toFixed(2)}%`}
        style={isComingSoon ? { cursor: 'not-allowed', opacity: 0.7 } : { cursor: 'pointer' }}
      >
        <TokenImage src={token.image} alt={token.symbol} />
        {!isMobile && <span>{token.symbol}</span>}
        <PriceDisplay 
          $isIncreasing={!!isIncreasing} 
          $hasChange={!!hasRecentChange && Math.abs(priceChange) > 0.1}
        >
          {isComingSoon
            ? 'Coming Soon'
            : currentPrice > 0
              ? `$${currentPrice.toLocaleString(undefined, { maximumFractionDigits: 6 })}`
              : 'N/A'}
        </PriceDisplay>
        {/* Show price change arrows and percentage */}
        {hasRecentChange && Math.abs(priceChange) > 0.1 && (
          <ChangeIndicator $isIncreasing={!!isIncreasing}>
            {isIncreasing ? '↗' : '↘'} {Math.abs(priceChange).toFixed(1)}%
          </ChangeIndicator>
        )}
        {/* Small data source indicator in corner */}
        {isLiveData && (
          <DataSourceBadge $isLive={true} style={{ fontSize: '10px', padding: '1px 3px' }}>LIVE</DataSourceBadge>
        )}
        {/* Show trending fire for "hot" tokens */}
        {isTrending && <TrendingBadge>🔥</TrendingBadge>}
      </TokenItem>
    );

    // Only wrap in <a> if not Coming Soon
    return isComingSoon ? tokenContent : (
      <a
        key={key}
        href={dexscreenerUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none' }}
      >
        {tokenContent}
      </a>
    );
  };

  return (
    <TickerTapeWrapper ref={wrapperRef} style={isMobile ? { overflowX: 'auto', overflowY: 'hidden' } : {}}>
      {isMobile ? (
        <TickerContentMobile>
          {tokenMetadata?.map((token: any) => 
            renderTokenItem(token, token.mint.toBase58())
          )}
        </TickerContentMobile>
      ) : (
        <TickerContent ref={contentRef} $shouldScroll={shouldScroll}>
          {tokenMetadata?.map((token: any) => 
            renderTokenItem(token, token.mint.toBase58())
          )}
        </TickerContent>
      )}
    </TickerTapeWrapper>
  );
}

// Styled Components

const TickerTapeWrapper = styled.div`
  padding: 20px;
  overflow: hidden;
  background: rgba(34, 34, 34, 0.85);
  border-radius: 0.7rem;
  border: 1px solid #ffd70044;
  margin-bottom: 1.2rem;
  position: relative;
  box-shadow: 0 0 16px #ffd70022;
  
  @media (max-width: 600px) {
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: #ffd700 #222;
  }
  
  &::-webkit-scrollbar {
    height: 6px;
    background: #222;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ffd700;
    border-radius: 4px;
  }
`;

const TickerContent = styled.div<{ $shouldScroll: boolean }>`
  display: flex;
  align-items: center;
  gap: 3.5rem;
  white-space: nowrap;
  will-change: transform;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  font-size: 1.1rem;
  color: #ffd700;
  
  ${props => props.$shouldScroll ? css`
    animation: ${tickerMove} 18s linear infinite;
  ` : css`
    justify-content: center;
    width: 100%;
  `}
`;

const TickerContentMobile = styled.div`
  display: flex;
  align-items: center;
  gap: 1.1rem;
  white-space: nowrap;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  font-size: 1.1rem;
  color: #ffd700;
  min-width: max-content;
  width: fit-content;
  padding: 0.2rem 0.2rem 0.2rem 0.4rem;
`;

const TokenItem = styled.span<{ 
  $hasChange?: boolean; 
  $isIncreasing?: boolean; 
  $isSignificant?: boolean;
  $isLiveData?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.2rem 1.2rem 0.2rem 0.2rem;
  border-radius: 1.2rem;
  background: rgba(24,24,24,0.5);
  position: relative;
  transition: all 0.3s ease;
  
  ${props => props.$hasChange && css`
    animation: ${pricePulse} 2s ease-in-out;
  `}
  
  ${props => props.$isSignificant && css`
    animation: ${priceGlow} 2s infinite, ${pricePulse} 2s ease-in-out;
    border: 1px solid ${props.$isIncreasing ? '#22c55e' : '#ef4444'};
  `}
  
  ${props => !props.$isLiveData && css`
    border: 1px solid rgba(255, 165, 0, 0.3);
  `}
  
  box-shadow: 0 0 8px #ffd70033;
  
  @media (max-width: 600px) {
    gap: 0.2rem;
    padding: 0.2rem 0.7rem 0.2rem 0.2rem;
  }
`;

const TokenImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fff;
  margin-right: 0.4rem;
`;

const PriceDisplay = styled.span<{ $isIncreasing?: boolean; $hasChange?: boolean }>`
  margin-left: 6px;
  font-weight: 700;
  color: ${props => 
    props.$hasChange 
      ? props.$isIncreasing 
        ? '#22c55e' 
        : '#ef4444'
      : '#fff'
  };
  transition: color 2s ease;
`;

const ChangeIndicator = styled.span<{ $isIncreasing: boolean }>`
  font-size: 0.8rem;
  margin-left: 4px;
  color: ${props => props.$isIncreasing ? '#22c55e' : '#ef4444'};
  font-weight: 600;
`;

const DataSourceBadge = styled.span<{ $isLive: boolean }>`
  position: absolute;
  top: -2px;
  right: -2px;
  font-size: 8px;
  background: ${props => props.$isLive ? '#22c55e' : '#ff9500'};
  color: #fff;
  border-radius: 6px;
  padding: 1px 3px;
  font-weight: 700;
  opacity: 0.8;
`;

const TrendingBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  font-size: 12px;
  background: linear-gradient(45deg, #ffd700, #ff6b35);
  color: #000;
  border-radius: 8px;
  padding: 1px 4px;
  font-weight: 700;
  animation: ${pricePulse} 1.5s infinite;
`;

export default EnhancedTickerTape;
