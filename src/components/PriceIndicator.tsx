import React, { useEffect, useState } from 'react';
import { tokenPriceService } from '../services/TokenPriceService';

interface PriceIndicatorProps {
  token?: any;
  showRefresh?: boolean;
  amount?: number; // amount in token units (not baseWager)
  compact?: boolean;
}

export const PriceIndicator: React.FC<PriceIndicatorProps> = ({ token, showRefresh = true, amount, compact = false }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [priceAgeMs, setPriceAgeMs] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' ? window.innerWidth <= 800 : false);

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
      details.push(<div key="tok-full">Token amount: <code style={{ color: '#fff' }}>{String(amount)}</code></div>);
      if (usdPrice && usdPrice > 0) {
        const exactUsd = amount * usdPrice;
        details.push(<div key="usd-full">Exact USD: <code style={{ color: '#fff' }}>{exactUsd.toFixed(8)}</code></div>);
      }
    }

    // Price source and raw price if available
    const cached = tokenPriceService.getCachedTokenPrice(token.mint.toBase58());
    if (cached) {
      details.push(<div key="src">Source: <strong style={{ color: '#ffd700' }}>{cached.source}</strong></div>);
      details.push(<div key="raw">Raw price: <code style={{ color: '#fff' }}>{cached.currentPrice}</code></div>);
    }

    return (
      <div style={{ marginTop: 8, background: 'rgba(0,0,0,0.2)', padding: 8, borderRadius: 8 }}>
        {details.length ? details : <div style={{ color: 'rgba(255,255,255,0.7)' }}>No details available</div>}
      </div>
    );
  };

  return (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12 }}>{renderAge()}</div>
      {showRefresh && (
        <button
          onClick={handleRefresh}
          disabled={isFetching}
          style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)', color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
        >
          Refresh
        </button>
      )}
      {typeof amount === 'number' && !isNaN(amount) && (
        <div style={{ color: 'rgba(255,215,0,0.95)', fontWeight: 800, fontSize: 13 }}>{renderConversion()}</div>
      )}
      {/* Use native details/summary for accessibility. Hide on mobile. */}
      {!isMobile && (
        <details style={{ marginLeft: 8, borderRadius: 6, overflow: 'hidden' }}>
          <summary style={{ listStyle: 'none', cursor: 'pointer', padding: '4px 8px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, background: 'transparent', color: '#fff', fontSize: 12 }}>
            Details
          </summary>
          {renderDetails()}
        </details>
      )}
    </div>
  );
};

export default PriceIndicator;
