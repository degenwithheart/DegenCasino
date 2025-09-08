import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTokenPrices } from '../../hooks/data/useTokenPrices';
import styled, { keyframes, css } from 'styled-components';
import { useTokenPriceService } from '../../hooks/data/useTokenPriceService';
import { useTheme } from '../../themes/ThemeContext';

// Romantic Serenade Animations
const loveLetterFloat = keyframes`
  0%, 100% { transform: translateX(100%) translateY(0px); }
  50% { transform: translateX(0%) translateY(-3px); }
  100% { transform: translateX(-100%) translateY(0px); }
`;

const romanticPulse = keyframes`
  0%, 100% { 
    opacity: 1; 
    transform: scale(1);
    box-shadow: 0 0 15px rgba(212, 165, 116, 0.3);
  }
  50% { 
    opacity: 0.9; 
    transform: scale(1.05);
    box-shadow: 0 0 25px rgba(212, 165, 116, 0.6), 0 0 40px rgba(184, 54, 106, 0.3);
  }
`;

const candlestickGlow = keyframes`
  0%, 100% { box-shadow: 0 0 12px rgba(212, 165, 116, 0.4); }
  50% { box-shadow: 0 0 24px rgba(212, 165, 116, 0.8), 0 0 36px rgba(184, 54, 106, 0.5); }
`;

const heartbeatPulse = keyframes`
  0%, 100% { transform: scale(1); }
  14% { transform: scale(1.1); }
  28% { transform: scale(1); }
  42% { transform: scale(1.1); }
  70% { transform: scale(1); }
`;

export function EnhancedTickerTape() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [shouldScroll, setShouldScroll] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { currentTheme } = useTheme();
  
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
        $theme={currentTheme}
        title={`${token.symbol} - ${isLiveData ? 'Live API data' : 'Fallback data'} | Change: ${priceChange.toFixed(2)}%`}
        style={isComingSoon ? { cursor: 'not-allowed', opacity: 0.7 } : { cursor: 'pointer' }}
      >
        <TokenImage src={token.image} alt={token.symbol} />
        {!isMobile && <TokenSymbol $theme={currentTheme}>{token.symbol}</TokenSymbol>}
        <PriceDisplay 
          $isIncreasing={!!isIncreasing} 
          $hasChange={!!hasRecentChange && Math.abs(priceChange) > 0.1}
          $theme={currentTheme}
        >
          {isComingSoon
            ? '💕 Coming Soon 💕'
            : currentPrice > 0
              ? `$${currentPrice.toLocaleString(undefined, { maximumFractionDigits: 6 })}`
              : 'N/A'}
        </PriceDisplay>
        {/* Show price change arrows and percentage */}
        {hasRecentChange && Math.abs(priceChange) > 0.1 && (
          <ChangeIndicator $isIncreasing={!!isIncreasing} $theme={currentTheme}>
            {isIncreasing ? '💗↗' : '💔↘'} {Math.abs(priceChange).toFixed(1)}%
          </ChangeIndicator>
        )}
        {/* Small data source indicator in corner */}
        {isLiveData && (
          <DataSourceBadge $isLive={true} $theme={currentTheme} style={{ fontSize: '10px', padding: '1px 3px' }}>💖 LIVE</DataSourceBadge>
        )}
        {/* Show trending fire for "hot" tokens */}
        {isTrending && <TrendingBadge $theme={currentTheme}>🔥💕</TrendingBadge>}
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
    <TickerTapeWrapper 
      ref={wrapperRef} 
      $theme={currentTheme}
      style={isMobile ? { overflowX: 'auto', overflowY: 'hidden' } : {}}
    >
      {isMobile ? (
        <TickerContentMobile $theme={currentTheme}>
          {tokenMetadata?.map((token: any) => 
            renderTokenItem(token, token.mint.toBase58())
          )}
        </TickerContentMobile>
      ) : (
        <TickerContent ref={contentRef} $shouldScroll={shouldScroll} $theme={currentTheme}>
          {tokenMetadata?.map((token: any) => 
            renderTokenItem(token, token.mint.toBase58())
          )}
        </TickerContent>
      )}
    </TickerTapeWrapper>
  );
}

// Styled Components

const TickerTapeWrapper = styled.div<{ $theme?: any }>`
  padding: 20px;
  overflow: hidden;
  background: ${({ $theme }) => $theme?.patterns?.glassmorphism || 'rgba(26, 11, 46, 0.8)'};
  backdrop-filter: blur(15px);
  border-radius: 16px;
  border: 2px solid ${({ $theme }) => $theme?.colors?.primary || '#d4a574'};
  margin-bottom: 1.2rem;
  position: relative;
  box-shadow: ${({ $theme }) => $theme?.effects?.glow || '0 0 20px rgba(212, 165, 116, 0.4), 0 0 40px rgba(184, 54, 106, 0.2)'};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ $theme }) => $theme?.patterns?.overlay || 'radial-gradient(circle at 30% 20%, rgba(212, 165, 116, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(184, 54, 106, 0.1) 0%, transparent 50%)'};
    pointer-events: none;
    border-radius: 14px;
  }
  
  @media (max-width: 600px) {
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: ${({ $theme }) => $theme?.colors?.primary || '#d4a574'} rgba(26, 11, 46, 0.5);
  }
  
  &::-webkit-scrollbar {
    height: 6px;
    background: rgba(26, 11, 46, 0.5);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ $theme }) => $theme?.colors?.primary || '#d4a574'};
    border-radius: 4px;
    box-shadow: 0 0 6px rgba(212, 165, 116, 0.5);
  }
`;

const TickerContent = styled.div<{ $shouldScroll: boolean; $theme?: any }>`
  display: flex;
  align-items: center;
  gap: 3.5rem;
  white-space: nowrap;
  will-change: transform;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  font-size: 1.1rem;
  color: ${({ $theme }) => $theme?.colors?.primary || '#d4a574'};
  position: relative;
  z-index: 2;
  
  ${props => props.$shouldScroll ? css`
    animation: ${loveLetterFloat} 20s ease-in-out infinite;
  ` : css`
    justify-content: center;
    width: 100%;
  `}
`;

const TickerContentMobile = styled.div<{ $theme?: any }>`
  display: flex;
  align-items: center;
  gap: 1.1rem;
  white-space: nowrap;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  font-size: 1.1rem;
  color: ${({ $theme }) => $theme?.colors?.primary || '#d4a574'};
  min-width: max-content;
  width: fit-content;
  padding: 0.2rem 0.2rem 0.2rem 0.4rem;
  position: relative;
  z-index: 2;
`;

const TokenItem = styled.span<{ 
  $hasChange?: boolean; 
  $isIncreasing?: boolean; 
  $isSignificant?: boolean;
  $isLiveData?: boolean;
  $theme?: any;
}>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1.2rem 0.4rem 0.4rem;
  border-radius: 20px;
  background: ${({ $theme }) => $theme?.patterns?.glassmorphism || 'rgba(26, 11, 46, 0.6)'};
  backdrop-filter: blur(10px);
  border: 1px solid ${({ $theme }) => $theme?.colors?.accent || '#8b5a9e'};
  position: relative;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ $theme }) => $theme?.patterns?.overlay || 'radial-gradient(circle at 50% 50%, rgba(212, 165, 116, 0.1) 0%, transparent 70%)'};
    pointer-events: none;
    border-radius: 19px;
  }
  
  ${props => props.$hasChange && css`
    animation: ${romanticPulse} 3s ease-in-out;
  `}
  
  ${props => props.$isSignificant && css`
    animation: ${candlestickGlow} 2s infinite, ${romanticPulse} 3s ease-in-out;
    border-color: ${props.$isIncreasing ? '#22c55e' : '#ef4444'};
    box-shadow: 0 0 20px ${props.$isIncreasing ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'};
  `}
  
  ${props => !props.$isLiveData && css`
    border: 1px solid rgba(255, 165, 0, 0.5);
  `}
  
  box-shadow: ${({ $theme }) => $theme?.effects?.glow || '0 0 12px rgba(212, 165, 116, 0.3)'};
  
  &:hover {
    transform: translateY(-2px) scale(1.02);
    border-color: ${({ $theme }) => $theme?.colors?.primary || '#d4a574'};
    box-shadow: ${({ $theme }) => $theme?.effects?.glow || '0 0 20px rgba(212, 165, 116, 0.5), 0 0 40px rgba(184, 54, 106, 0.3)'};
  }
  
  @media (max-width: 600px) {
    gap: 0.2rem;
    padding: 0.3rem 0.7rem 0.3rem 0.3rem;
  }
`;

const TokenImage = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #fff;
  margin-right: 0.4rem;
  border: 2px solid rgba(212, 165, 116, 0.3);
  box-shadow: 0 0 8px rgba(212, 165, 116, 0.4);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(212, 165, 116, 0.6);
    box-shadow: 0 0 15px rgba(212, 165, 116, 0.6);
    animation: ${heartbeatPulse} 1.5s ease-in-out;
  }
`;

const TokenSymbol = styled.span<{ $theme?: any }>`
  color: ${({ $theme }) => $theme?.colors?.textPrimary || '#e8d5c4'};
  font-weight: 600;
  text-shadow: ${({ $theme }) => $theme?.effects?.textGlow || '0 0 8px rgba(212, 165, 116, 0.4)'};
  position: relative;
  z-index: 2;
`;

const PriceDisplay = styled.span<{ $isIncreasing?: boolean; $hasChange?: boolean; $theme?: any }>`
  margin-left: 6px;
  font-weight: 700;
  color: ${props => 
    props.$hasChange 
      ? props.$isIncreasing 
        ? '#22c55e' 
        : '#ef4444'
      : props.$theme?.colors?.textPrimary || '#e8d5c4'
  };
  transition: color 2s ease;
  text-shadow: ${({ $theme }) => $theme?.effects?.textGlow || '0 0 6px rgba(212, 165, 116, 0.3)'};
  position: relative;
  z-index: 2;
`;

const ChangeIndicator = styled.span<{ $isIncreasing: boolean; $theme?: any }>`
  font-size: 0.8rem;
  margin-left: 4px;
  color: ${props => props.$isIncreasing ? '#22c55e' : '#ef4444'};
  font-weight: 600;
  text-shadow: 0 0 8px ${props => props.$isIncreasing ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'};
  animation: ${heartbeatPulse} 2s ease-in-out infinite;
  position: relative;
  z-index: 2;
`;

const DataSourceBadge = styled.span<{ $isLive: boolean; $theme?: any }>`
  position: absolute;
  top: -2px;
  right: -2px;
  font-size: 8px;
  background: ${props => props.$isLive ? 
    props.$theme?.patterns?.gradient || 'linear-gradient(135deg, #22c55e, #16a34a)' : 
    'linear-gradient(135deg, #ff9500, #f97316)'
  };
  color: #fff;
  border-radius: 8px;
  padding: 1px 3px;
  font-weight: 700;
  opacity: 0.9;
  box-shadow: ${({ $theme }) => $theme?.effects?.glow || '0 0 6px rgba(212, 165, 116, 0.4)'};
  animation: ${romanticPulse} 3s ease-in-out infinite;
`;

const TrendingBadge = styled.span<{ $theme?: any }>`
  position: absolute;
  top: -4px;
  right: -4px;
  font-size: 12px;
  background: ${({ $theme }) => $theme?.patterns?.gradient || 'linear-gradient(135deg, #d4a574, #b8336a)'};
  color: ${({ $theme }) => $theme?.colors?.background || '#0a0511'};
  border-radius: 12px;
  padding: 1px 4px;
  font-weight: 700;
  animation: ${heartbeatPulse} 2s infinite;
  box-shadow: ${({ $theme }) => $theme?.effects?.glow || '0 0 12px rgba(212, 165, 116, 0.6)'};
`;

export default EnhancedTickerTape;
