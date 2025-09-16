import React, { useEffect, useState } from 'react';
import { tokenPriceService } from '../../services/TokenPriceService';
import { useColorScheme } from '../../themes/ColorSchemeContext';

interface PriceIndicatorProps {
  token?: any;
  showRefresh?: boolean;
  amount?: number; // amount in token units (not baseWager)
  compact?: boolean;
  showFullDetails?: boolean; // Show all details directly without collapsible element
}

export const PriceIndicator: React.FC<PriceIndicatorProps> = ({ token, showRefresh = true, amount, compact = false, showFullDetails = false }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [priceAgeMs, setPriceAgeMs] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' ? window.innerWidth <= 800 : false);
  const { currentColorScheme } = useColorScheme();

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 800);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const mint = token?.mint?.toBase58();
    if (!mint) {
      setPriceAgeMs(null);
      return;
    }

    const cached = tokenPriceService.getCachedTokenPrice(mint);
    if (cached) setPriceAgeMs(Date.now() - cached.lastUpdated);
    else setPriceAgeMs(Infinity);

    let cancelled = false;
    const iv = setInterval(() => {
      const age = tokenPriceService.getPriceAge(mint);
      if (!cancelled) setPriceAgeMs(age);
    }, 1000);

    return () => { cancelled = true; clearInterval(iv); };
  }, [token?.mint?.toBase58()]);

  const handleRefresh = async () => {
    if (!token) return;
    setIsFetching(true);
    try {
      await tokenPriceService.forceUpdate();
      const age = tokenPriceService.getPriceAge(token.mint.toBase58());
      setPriceAgeMs(age);
    } catch (err) {
      console.error('Price refresh failed', err);
    } finally {
      setIsFetching(false);
    }
  };

  const renderAge = () => {
    if (isFetching) return (<><SpinnerInline /> Updating...</>);
    if (priceAgeMs === null || priceAgeMs === Infinity) return 'Price unavailable';
    const s = Math.floor(priceAgeMs / 1000);
    if (s < 60) return `Price updated ${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `Price updated ${m}m ago`;
    const h = Math.floor(m / 60);
    return `Price updated ${h}h ago`;
  };

  const SpinnerInline: React.FC = () => (
    <svg width="14" height="14" viewBox="0 0 50 50" style={{ marginRight: 6 }}>
      <path fill="currentColor" d="M43.935,25.145c0-10.318-8.364-18.682-18.682-18.682c-10.318,0-18.682,8.364-18.682,18.682h4.068c0-8.066,6.548-14.614,14.614-14.614c8.066,0,14.614,6.548,14.614,14.614H43.935z">
        <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.9s" repeatCount="indefinite" />
      </path>
    </svg>
  );

  // Amount conversion display
  const renderConversion = () => {
    if (!token) return null;
    const usdPrice = token.usdPrice || 0;
    if (typeof amount !== 'number' || isNaN(amount)) return null;

    // Compact token formatting using significant digits
    const tokenFmt = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 4 });
    const tokenFormatted = tokenFmt.format(amount);

    if (!usdPrice || usdPrice === 0) {
      // If no price, just show compact token amount
      return `${tokenFormatted} ${token.symbol}`;
    }

    const usd = amount * usdPrice;
    const usdFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(usd);
    if (compact) return `${tokenFormatted} ${token.symbol} ≈ ${usdFormatted}`;
    return `${tokenFormatted} ${token.symbol} = ${usdFormatted}`;
  };

  const renderDetails = () => {
    if (!token) return null;
    const usdPrice = token.usdPrice || 0;
    const details: Array<JSX.Element> = [];

    if (typeof amount === 'number' && !isNaN(amount)) {
      // Full precision token amount
      details.push(
        <div key="tok-full" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 8,
          padding: '8px 12px',
          background: 'linear-gradient(135deg, rgba(10, 5, 17, 0.6) 0%, rgba(139, 90, 158, 0.1) 100%)',
          border: '1px solid rgba(212, 165, 116, 0.2)',
          borderRadius: 8,
          backdropFilter: 'blur(8px)'
        }}>
          <span style={{ color: `${currentColorScheme?.colors?.secondary || '#d4a574'}80`, fontSize: 12, fontWeight: 600 }}>Token amount:</span>
          <code style={{ 
            color: currentColorScheme?.colors?.primary || '#d4a574', 
            fontWeight: 700, 
            fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
            background: `${currentColorScheme?.colors?.primary || '#d4a574'}20`,
            padding: '2px 6px',
            borderRadius: 4
          }}>{String(amount)}</code>
        </div>
      );
      
      if (usdPrice && usdPrice > 0) {
        const exactUsd = amount * usdPrice;
        details.push(
          <div key="usd-full" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 8,
            padding: '8px 12px',
            background: 'linear-gradient(135deg, rgba(10, 5, 17, 0.6) 0%, rgba(139, 90, 158, 0.1) 100%)',
            border: '1px solid rgba(212, 165, 116, 0.2)',
            borderRadius: 8,
            backdropFilter: 'blur(8px)'
          }}>
            <span style={{ color: 'rgba(212, 165, 116, 0.8)', fontSize: 12, fontWeight: 600 }}>Exact USD:</span>
            <code style={{ 
              color: 'var(--love-letter-gold)', 
              fontWeight: 700, 
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              background: 'rgba(212, 165, 116, 0.1)',
              padding: '2px 6px',
              borderRadius: 4
            }}>{new Intl.NumberFormat('en-US', { 
              style: 'currency', 
              currency: 'USD', 
              minimumFractionDigits: 2,
              maximumFractionDigits: exactUsd < 1 ? 6 : exactUsd < 10 ? 4 : 2
            }).format(exactUsd)}</code>
          </div>
        );
      }
    }

    // Price source and raw price if available
    const cached = tokenPriceService.getCachedTokenPrice(token.mint.toBase58());
    if (cached) {
      details.push(
        <div key="src" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 8,
          padding: '8px 12px',
          background: 'linear-gradient(135deg, rgba(10, 5, 17, 0.6) 0%, rgba(139, 90, 158, 0.1) 100%)',
          border: '1px solid rgba(212, 165, 116, 0.2)',
          borderRadius: 8,
          backdropFilter: 'blur(8px)'
        }}>
          <span style={{ color: 'rgba(212, 165, 116, 0.8)', fontSize: 12, fontWeight: 600 }}>Source:</span>
          <strong style={{ 
            color: 'var(--love-letter-gold)', 
            fontWeight: 700, 
            fontSize: 13,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>{cached.source}</strong>
        </div>
      );
      
      details.push(
        <div key="raw" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 0,
          padding: '8px 12px',
          background: 'linear-gradient(135deg, rgba(10, 5, 17, 0.6) 0%, rgba(139, 90, 158, 0.1) 100%)',
          border: '1px solid rgba(212, 165, 116, 0.2)',
          borderRadius: 8,
          backdropFilter: 'blur(8px)'
        }}>
          <span style={{ color: 'rgba(212, 165, 116, 0.8)', fontSize: 12, fontWeight: 600 }}>Raw price:</span>
          <code style={{ 
            color: 'var(--love-letter-gold)', 
            fontWeight: 700, 
            fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
            background: 'rgba(212, 165, 116, 0.1)',
            padding: '2px 6px',
            borderRadius: 4
          }}>${cached.currentPrice}</code>
        </div>
      );
    }

    return (
      <div style={{ 
        marginTop: 12, 
        background: 'linear-gradient(135deg, rgba(10, 5, 17, 0.4) 0%, rgba(139, 90, 158, 0.05) 100%)', 
        padding: 12, 
        borderRadius: 12,
        border: '1px solid rgba(212, 165, 116, 0.15)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 16px rgba(10, 5, 17, 0.3)'
      }}>
        {details.length ? details : (
          <div style={{ 
            color: 'rgba(212, 165, 116, 0.6)', 
            fontSize: 12, 
            fontWeight: 500,
            textAlign: 'center',
            fontStyle: 'italic'
          }}>No details available</div>
        )}
      </div>
    );
  };

  return (
  <div style={{ 
    display: 'flex', 
    flexDirection: showFullDetails ? 'column' : 'row',
    alignItems: showFullDetails ? 'stretch' : 'center', 
    gap: showFullDetails ? 12 : 8, 
    flexWrap: 'wrap',
    width: '100%'
  }}>
      <div style={{ 
        color: 'rgba(212, 165, 116, 0.7)', 
        fontSize: 11, 
        fontWeight: 500,
        fontFamily: "'DM Sans', sans-serif"
      }}>{renderAge()}</div>
      
      {showRefresh && (
        <button
          onClick={handleRefresh}
          disabled={isFetching}
          style={{ 
            padding: '6px 12px', 
            borderRadius: 8, 
            background: 'linear-gradient(135deg, rgba(212, 165, 116, 0.1) 0%, rgba(184, 51, 106, 0.05) 100%)', 
            border: '1px solid rgba(212, 165, 116, 0.2)', 
            color: 'var(--love-letter-gold)', 
            fontWeight: 600, 
            fontSize: 11, 
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: "'DM Sans', sans-serif"
          }}
        >
          Refresh
        </button>
      )}
      
      {typeof amount === 'number' && !isNaN(amount) && !showFullDetails && (
        <div style={{ 
          color: 'var(--love-letter-gold)', 
          fontWeight: 700, 
          fontSize: showFullDetails ? 15 : 13,
          fontFamily: "'DM Sans', sans-serif",
          textShadow: '0 1px 2px rgba(10, 5, 17, 0.5)'
        }}>{renderConversion()}</div>
      )}
      
      {/* Show full details directly if showFullDetails is true */}
      {showFullDetails && renderDetails()}
      
      {/* Use native details/summary for accessibility. Hide on mobile. Only show if not showing full details */}
      {!showFullDetails && !isMobile && (
        <details style={{ marginLeft: 8, borderRadius: 8, overflow: 'hidden' }}>
          <summary style={{ 
            listStyle: 'none', 
            cursor: 'pointer', 
            padding: '6px 12px', 
            border: '1px solid rgba(212, 165, 116, 0.2)', 
            borderRadius: 8, 
            background: 'linear-gradient(135deg, rgba(212, 165, 116, 0.1) 0%, rgba(184, 51, 106, 0.05) 100%)', 
            color: 'var(--love-letter-gold)', 
            fontSize: 11,
            fontWeight: 600,
            transition: 'all 0.3s ease',
            fontFamily: "'DM Sans', sans-serif"
          }}>
            Details
          </summary>
          {renderDetails()}
        </details>
      )}
    </div>
  );
};

export default PriceIndicator;
