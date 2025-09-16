import React, { useEffect, useState, useRef, useCallback } from 'react'
// Reusable throttle hook
function useThrottle(callback: () => void, delay: number) {
  const lastCall = useRef(0);
  return useCallback(() => {
    const now = Date.now();
    if (now - lastCall.current > delay) {
      lastCall.current = now;
      callback();
    }
  }, [callback, delay]);
}
import styled, { keyframes } from 'styled-components'
import { useColorScheme } from '../../themes/ColorSchemeContext'

type ProviderResult = {
  provider: string;
  status: 'online' | 'offline';
  responseTimeMs?: number;
  checkedAt: string;
  ip?: string;
  error?: string;
};

type Status = {
  location: string;
  country: string;
  code: string;
  status: 'online' | 'offline';
  providers: ProviderResult[];
};

// Casino animations
const neonPulse = keyframes`
  0% { 
    box-shadow: 0 0 24px var(--secondary-color, #a259ff88), 0 0 48px var(--primary-color, #ffd70044);
    border-color: var(--primary-color, #ffd70044);
  }
  100% { 
    box-shadow: 0 0 48px var(--primary-color, #ffd700cc), 0 0 96px var(--secondary-color, #a259ff88);
    border-color: var(--primary-color, #ffd700aa);
  }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: rotate(0deg) scale(0.8); }
  50% { opacity: 1; transform: rotate(180deg) scale(1.2); }
`;

const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const PageContainer = styled.div<{ $colorScheme?: any }>`
  min-height: 100vh;
  background: linear-gradient(135deg, ${({ $colorScheme }) => $colorScheme?.colors?.background || 'rgba(24, 24, 24, 0.95)'}, ${({ $colorScheme }) => $colorScheme?.colors?.surface || 'rgba(47, 32, 82, 0.9)'}, ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(66, 32, 66, 0.85)'});
  padding: 1.5rem;
  position: relative;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 20%, ${({ $colorScheme }) => $colorScheme?.colors?.primary || 'rgba(255, 215, 0, 0.08)'} 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, ${({ $colorScheme }) => $colorScheme?.colors?.secondary || 'rgba(162, 89, 255, 0.08)'} 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, ${({ $colorScheme }) => $colorScheme?.colors?.accent || 'rgba(255, 0, 204, 0.05)'} 0%, transparent 70%);
    pointer-events: none;
    z-index: -1;
  }
`

const ContentWrapper = styled.div<{ $colorScheme?: any }>`
  max-width: 112rem;
  margin: 0 auto;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: -20px;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'}, ${({ $colorScheme }) => $colorScheme?.colors?.secondary || '#a259ff'}, ${({ $colorScheme }) => $colorScheme?.colors?.accent || '#ff00cc'}, ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'});
    background-size: 300% 100%;
    animation: ${moveGradient} 4s linear infinite;
    border-radius: 2px;
    z-index: 1;
  }
`

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;

  &::before {
    content: '🌟';
    position: absolute;
    top: -20px;
    right: 20%;
    font-size: 2rem;
    animation: ${sparkle} 3s infinite;
  }

  &::after {
    content: '✨';
    position: absolute;
    top: 20px;
    left: 15%;
    font-size: 1.5rem;
    animation: ${sparkle} 2s infinite reverse;
  }
`

const MainTitle = styled.h1<{ $colorScheme?: any }>`
  font-size: 2.25rem;
  font-weight: 700;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
  margin-bottom: 1rem;
  text-shadow: 0 0 16px ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'}, 0 0 32px ${({ $colorScheme }) => $colorScheme?.colors?.secondary || '#a259ff'};
  font-family: 'Luckiest Guy', cursive, sans-serif;
  letter-spacing: 2px;
  position: relative;
  
  @media (min-width: 768px) {
    font-size: 3rem;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 3px;
    background: linear-gradient(90deg, transparent, ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'}, ${({ $colorScheme }) => $colorScheme?.colors?.secondary || '#a259ff'}, ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'}, transparent);
    background-size: 200% 100%;
    animation: ${moveGradient} 3s linear infinite;
    border-radius: 2px;
  }
`

const DomainBox = styled.div<{ $colorScheme?: any }>`
  font-size: 1.25rem;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
  background: ${({ $colorScheme }) => $colorScheme?.colors?.surface || 'rgba(24, 24, 24, 0.8)'};
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 1rem 2rem;
  display: inline-block;
  border: 2px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(255, 215, 0, 0.3)'};
  box-shadow: 0 0 24px ${({ $colorScheme }) => $colorScheme?.colors?.primary || 'rgba(255, 215, 0, 0.2)'};
  transition: all 0.3s ease;
  animation: ${neonPulse} 2s ease-in-out infinite alternate;
  --primary-color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
  --secondary-color: ${({ $colorScheme }) => $colorScheme?.colors?.secondary || '#a259ff'};
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 32px ${({ $colorScheme }) => $colorScheme?.colors?.primary || 'rgba(255, 215, 0, 0.4)'};
    border-color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || 'rgba(255, 215, 0, 0.6)'};
  }
  
  code {
    color: ${({ $colorScheme }) => $colorScheme?.colors?.secondary || '#a259ff'};
    font-weight: 600;
    text-shadow: 0 0 8px ${({ $colorScheme }) => $colorScheme?.colors?.secondary || '#a259ff'};
  }
`

const LoadingSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
`

const LoadingBox = styled.div<{ $colorScheme?: any }>`
  background: ${({ $colorScheme }) => $colorScheme?.colors?.surface || 'rgba(24, 24, 24, 0.8)'};
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 2.5rem;
  border: 2px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(255, 215, 0, 0.2)'};
  box-shadow: 0 0 32px ${({ $colorScheme }) => $colorScheme?.colors?.shadow || 'rgba(0, 0, 0, 0.4)'};
  animation: ${neonPulse} 2s ease-in-out infinite alternate;
  --primary-color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
  --secondary-color: ${({ $colorScheme }) => $colorScheme?.colors?.secondary || '#a259ff'};
`

const LoadingContent = styled.div<{ $colorScheme?: any }>`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  
  .spinner {
    width: 3rem;
    height: 3rem;
    border: 3px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(255, 215, 0, 0.2)'};
    border-top: 3px solid ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
    border-radius: 50%;
    animation: spin 1s linear infinite;
    box-shadow: 0 0 16px ${({ $colorScheme }) => $colorScheme?.colors?.primary || 'rgba(255, 215, 0, 0.3)'};
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  p {
    color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
    font-size: 1.125rem;
    font-weight: 600;
    text-shadow: 0 0 8px ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
  }
`

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
`

const StatusCard = styled.div<{ $isOnline: boolean; $colorScheme?: any }>`
  position: relative;
  padding: 2rem;
  border-radius: 16px;
  border: 2px solid;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px);
  cursor: pointer;
  overflow: hidden;
  
  background: ${({ $colorScheme }) => $colorScheme?.colors?.surface || 'rgba(24, 24, 24, 0.8)'};
  
  border-color: ${({ $isOnline, $colorScheme }) => $isOnline 
    ? $colorScheme?.colors?.success || 'rgba(16, 185, 129, 0.4)'
    : $colorScheme?.colors?.error || 'rgba(220, 38, 127, 0.4)'};

  box-shadow: ${({ $isOnline, $colorScheme }) => $isOnline 
    ? `0 0 24px ${$colorScheme?.colors?.success || 'rgba(16, 185, 129, 0.2)'}`
    : `0 0 24px ${$colorScheme?.colors?.error || 'rgba(220, 38, 127, 0.2)'}`};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ $isOnline, $colorScheme }) => $isOnline 
      ? `radial-gradient(circle at 50% 50%, ${$colorScheme?.colors?.success || 'rgba(16, 185, 129, 0.1)'} 0%, transparent 70%)`
      : `radial-gradient(circle at 50% 50%, ${$colorScheme?.colors?.error || 'rgba(220, 38, 127, 0.1)'} 0%, transparent 70%)`};
    pointer-events: none;
    z-index: -1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ $isOnline, $colorScheme }) => $isOnline 
      ? `linear-gradient(90deg, ${$colorScheme?.colors?.success || '#10b981'}, ${$colorScheme?.colors?.primary || '#34d399'}, ${$colorScheme?.colors?.success || '#10b981'})`
      : `linear-gradient(90deg, ${$colorScheme?.colors?.error || '#dc2626'}, ${$colorScheme?.colors?.secondary || '#f87171'}, ${$colorScheme?.colors?.error || '#dc2626'})`};
    background-size: 200% 100%;
    animation: ${moveGradient} 3s linear infinite;
    z-index: 1;
  }
  
  &:hover {
    transform: scale(1.05) rotate(1deg);
    box-shadow: ${({ $isOnline, $colorScheme }) => $isOnline 
      ? `0 0 48px ${$colorScheme?.colors?.success || 'rgba(16, 185, 129, 0.4)'}`
      : `0 0 48px ${$colorScheme?.colors?.error || 'rgba(220, 38, 127, 0.4)'}`};
    border-color: ${({ $isOnline, $colorScheme }) => $isOnline ? ($colorScheme?.colors?.success || '#10b981') : ($colorScheme?.colors?.error || '#dc2626')};
  }
`

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`

const FlagEmoji = styled.div<{ $isOnline: boolean }>`
  font-size: 2rem;
  ${props => props.$isOnline && 'animation: sparkle 3s infinite;'}
  
  @keyframes sparkle {
    0%, 100% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.1) rotate(5deg); }
  }
`

const StatusEmoji = styled.div<{ $isOnline: boolean }>`
  font-size: 1.75rem;
  ${props => props.$isOnline && 'animation: bounce 2s infinite;'}
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
`

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const LocationTitle = styled.h3`
  font-weight: 700;
  color: #ffd700;
  font-size: 1.25rem;
  transition: all 0.3s ease;
  text-shadow: 0 0 8px #ffd700;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  letter-spacing: 1px;
  
  ${StatusCard}:hover & {
    color: #ffffff;
    text-shadow: 0 0 16px #ffd700;
  }
`

const CountryText = styled.p<{ $isOnline: boolean }>`
  font-size: 0.95rem;
  font-weight: 500;
  color: ${props => props.$isOnline ? '#6ee7b7' : '#fca5a5'};
  text-shadow: ${props => props.$isOnline 
    ? '0 0 4px rgba(110, 231, 183, 0.5)' 
    : '0 0 4px rgba(252, 165, 165, 0.5)'
  };
`

const StatusBadge = styled.div<{ $isOnline: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 2px solid;
  transition: all 0.3s ease;
  
  background: ${props => props.$isOnline 
    ? 'rgba(16, 185, 129, 0.2)'
    : 'rgba(220, 38, 127, 0.2)'
  };
  
  color: ${props => props.$isOnline ? '#6ee7b7' : '#fca5a5'};
  border-color: ${props => props.$isOnline ? 'rgba(16, 185, 129, 0.5)' : 'rgba(220, 38, 127, 0.5)'};
  
  box-shadow: ${props => props.$isOnline 
    ? '0 0 8px rgba(16, 185, 129, 0.3)'
    : '0 0 8px rgba(220, 38, 127, 0.3)'
  };

  ${StatusCard}:hover & {
    transform: scale(1.05);
    box-shadow: ${props => props.$isOnline 
      ? '0 0 16px rgba(16, 185, 129, 0.5)'
      : '0 0 16px rgba(220, 38, 127, 0.5)'
    };
  }
`

const StatsSection = styled.div`
  margin-top: 4rem;
  text-align: center;
  position: relative;

  &::before {
    content: '📊';
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 2rem;
    animation: ${sparkle} 3s infinite;
  }
`

const StatsContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 2rem;
  background: rgba(24, 24, 24, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem 3rem;
  border: 2px solid rgba(255, 215, 0, 0.2);
  box-shadow: 0 0 32px rgba(0, 0, 0, 0.4);
  animation: ${neonPulse} 3s ease-in-out infinite alternate;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 48px rgba(255, 215, 0, 0.3);
    border-color: rgba(255, 215, 0, 0.4);
  }
`

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const StatDot = styled.div<{ $color: string }>`
  width: 1rem;
  height: 1rem;
  background: ${props => props.$color};
  border-radius: 50%;
  box-shadow: 0 0 8px ${props => props.$color}66;
  ${props => props.$color === '#10b981' && 'animation: pulse 2s infinite;'}
  
  @keyframes pulse {
    0%, 100% { 
      opacity: 1; 
      transform: scale(1);
      box-shadow: 0 0 8px ${props => props.$color}66;
    }
    50% { 
      opacity: 0.7; 
      transform: scale(1.1);
      box-shadow: 0 0 16px ${props => props.$color}88;
    }
  }
`

const StatText = styled.span<{ $color: string }>`
  color: ${props => props.$color};
  font-weight: 600;
  font-size: 1.1rem;
  text-shadow: 0 0 8px ${props => props.$color}44;
`

const Divider = styled.div`
  width: 2px;
  height: 2rem;
  background: linear-gradient(to bottom, transparent, #ffd700, #a259ff, transparent);
  border-radius: 1px;
`

const getFlag = (countryCode: string) =>
  String.fromCodePoint(...[...countryCode.toUpperCase()].map(c => 127397 + c.charCodeAt(0)))

function getProviderIcon(provider: string) {
  const iconMap: Record<string, string> = {
    Google: 'https://cdn-icons-png.flaticon.com/512/300/300221.png',
    Cloudflare: 'https://cdn-icons-png.flaticon.com/512/4144/4144716.png',
    Quad9: 'https://cdn-icons-png.flaticon.com/512/1048/1048953.png',
    NextDNS: 'https://cdn-icons-png.flaticon.com/512/1048/1048953.png',
    OpenDNS: 'https://cdn-icons-png.flaticon.com/512/1048/1048953.png',
    CleanBrowsing: 'https://cdn-icons-png.flaticon.com/512/1048/1048953.png',
    AdGuard: 'https://cdn-icons-png.flaticon.com/512/1048/1048953.png',
    Neustar: 'https://cdn-icons-png.flaticon.com/512/1048/1048953.png',
    Yandex: 'https://cdn-icons-png.flaticon.com/512/5968/5968705.png',
    PowerDNS: 'https://cdn-icons-png.flaticon.com/512/1048/1048953.png',
  };
  const src = iconMap[provider] || 'https://cdn-icons-png.flaticon.com/512/44/44948.png';
  return (
    <img
      src={src}
      alt={provider + ' icon'}
      style={{ width: 20, height: 20, objectFit: 'contain', marginRight: 6, verticalAlign: 'middle', filter: 'drop-shadow(0 0 2px #0008)' }}
      onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/44/44948.png'; }}
    />
  );
}

export default function PropagationPage() {
  const [domain, setDomain] = useState('')
  const [statusList, setStatusList] = useState<Status[]>([])
  const [loading, setLoading] = useState(false)
  const colorScheme = useColorScheme()

  // Throttle DNS API call to once per 60 seconds, singular, only when page is mounted
  const THROTTLE_MS = 60000; // 60 seconds
  const throttledDnsCheck = useThrottle(() => {
    const params = new URLSearchParams(window.location.search)
    const domainParam = params.get('domain')
    if (!domainParam) return

    setDomain(domainParam)
    setLoading(true)

    // Use mock data in development
    if (import.meta.env.DEV) {
      console.log('Using mock DNS propagation data for development')
      const mockProviders: ProviderResult[] = [
        {
          provider: "Google",
          status: "online",
          responseTimeMs: 42,
          checkedAt: new Date().toISOString(),
          ip: "8.8.8.8",
        },
        {
          provider: "Cloudflare",
          status: "online",
          responseTimeMs: 37,
          checkedAt: new Date().toISOString(),
          ip: "1.1.1.1",
        },
      ];
      const mockLocations = [
        { location: "Atlanta", country: "United States", code: "US", status: 'online' as const, providers: mockProviders },
        { location: "New York", country: "United States", code: "US", status: 'online' as const, providers: mockProviders },
        { location: "London", country: "United Kingdom", code: "GB", status: 'online' as const, providers: mockProviders },
        { location: "Frankfurt", country: "Germany", code: "DE", status: 'online' as const, providers: mockProviders },
        { location: "Tokyo", country: "Japan", code: "JP", status: 'offline' as const, providers: mockProviders.map(p => ({ ...p, status: "offline" as const, error: "Timeout" })) },
        { location: "Sydney", country: "Australia", code: "AU", status: 'online' as const, providers: mockProviders },
        { location: "Singapore", country: "Singapore", code: "SG", status: 'online' as const, providers: mockProviders },
        { location: "São Paulo", country: "Brazil", code: "BR", status: 'offline' as const, providers: mockProviders.map(p => ({ ...p, status: "offline" as const, error: "Timeout" })) },
        { location: "Mumbai", country: "India", code: "IN", status: 'online' as const, providers: mockProviders },
        { location: "Toronto", country: "Canada", code: "CA", status: 'online' as const, providers: mockProviders }
      ];
      setTimeout(() => {
        setStatusList(mockLocations)
        setLoading(false)
      }, 1000)
      return
    }

    // Use relative path for both Vercel and localhost (works with Vercel dev and Vite proxy)
    fetch(`/api/dns/check-dns?domain=${domainParam}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch DNS status')
        return res.json()
      })
      .then(data => {
        if (Array.isArray(data)) {
          setStatusList(data)
        } else if (data && Array.isArray(data.results)) {
          setStatusList(data.results)
        } else {
          setStatusList([])
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, THROTTLE_MS);

  useEffect(() => {
    throttledDnsCheck();
    // Optionally, set up polling if you want repeated checks while page is mounted:
    const interval = setInterval(() => {
      throttledDnsCheck();
    }, THROTTLE_MS);
    return () => clearInterval(interval);
  }, [throttledDnsCheck]);

  if (!domain) {
    return (
      <PageContainer>
        <ContentWrapper>
          <div style={{ padding: '1rem', textAlign: 'center', color: '#dc2626' }}>
            Missing domain query parameter
          </div>
        </ContentWrapper>
      </PageContainer>
    )
  }

  return (
    <PageContainer $colorScheme={colorScheme}>
      <ContentWrapper $colorScheme={colorScheme}>
        <HeaderSection>
          <MainTitle $colorScheme={colorScheme}>
            🌍 Server Status
          </MainTitle>
        </HeaderSection>

        {loading && (
          <LoadingSection>
            <LoadingBox $colorScheme={colorScheme}>
              <LoadingContent $colorScheme={colorScheme}>
                <div className="spinner"></div>
                <p>Checking server status...</p>
              </LoadingContent>
            </LoadingBox>
          </LoadingSection>
        )}

        {!loading && (
          <CardsGrid>
            {statusList.map(({ location, country, code, status, providers }) => (
              <StatusCard key={`${location}-${code}`} $isOnline={status === 'online'} $colorScheme={colorScheme}>
                <CardHeader>
                  <FlagEmoji $isOnline={status === 'online'}>
                    {getFlag(code)}
                  </FlagEmoji>
                  <StatusEmoji $isOnline={status === 'online'}>
                    {status === 'online' ? '✅' : '❌'}
                  </StatusEmoji>
                </CardHeader>
                <CardContent>
                  <LocationTitle>{location}</LocationTitle>
                  <CountryText $isOnline={status === 'online'}>{country}</CountryText>
                  <StatusBadge $isOnline={status === 'online'}>
                    {status === 'online' ? '🟢 Online' : '🔴 Offline'}
                  </StatusBadge>
                  <div style={{marginTop: '0.75rem'}}>
                    <table style={{width: '100%', fontSize: '0.95rem', background: 'rgba(0,0,0,0.15)', borderRadius: 8, overflow: 'hidden'}}>
                      <thead>
                        <tr style={{color: '#ffd700', background: 'rgba(162,89,255,0.08)'}}>
                          <th style={{padding: '0.25rem 0.5rem'}}>Provider</th>
                          <th style={{padding: '0.25rem 0.5rem'}}>Status</th>
                          <th style={{padding: '0.25rem 0.5rem'}}>Time</th>
                          <th style={{padding: '0.25rem 0.5rem'}}>Checked</th>
                        </tr>
                      </thead>
                      <tbody>
                        {providers
                          .slice()
                          .filter(p => typeof p.responseTimeMs === 'number')
                          .sort((a, b) => (a.responseTimeMs! - b.responseTimeMs!))
                          .concat(providers.filter(p => typeof p.responseTimeMs !== 'number'))
                          .slice(0, 2)
                          .map((p, idx) => (
                            <tr key={p.provider + idx} style={{color: p.status === 'online' ? '#6ee7b7' : '#fca5a5'}}>
                              <td style={{padding: '0.25rem 0.5rem', fontWeight: 600}}>
                                {getProviderIcon(p.provider)}
                                {p.provider}
                              </td>
                              <td style={{padding: '0.25rem 0.5rem'}}>
                                {p.status === 'online' ? '🟢 Online' : '🔴 Offline'}
                                {p.error && (
                                  <span style={{color: '#fca5a5', marginLeft: 6, fontSize: '0.9em'}}>({p.error})</span>
                                )}
                              </td>
                              <td style={{padding: '0.25rem 0.5rem'}}>
                                {typeof p.responseTimeMs === 'number' ? `${p.responseTimeMs} ms` : '--'}
                              </td>
                              <td style={{padding: '0.25rem 0.5rem'}}>
                                {p.checkedAt ? new Date(p.checkedAt).toLocaleTimeString() : '--'}
                              </td>
                            </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </StatusCard>
            ))}
          </CardsGrid>
        )}

        {!loading && statusList.length > 0 && (
          <StatsSection>
            <StatsContainer>
              <StatItem>
                <StatDot $color="#10b981" />
                <StatText $color="#6ee7b7">
                  {statusList.filter(s => s.status === 'online').length} Online
                </StatText>
              </StatItem>
              <Divider />
              <StatItem>
                <StatDot $color="#dc2626" />
                <StatText $color="#fca5a5">
                  {statusList.filter(s => s.status === 'offline').length} Offline
                </StatText>
              </StatItem>
            </StatsContainer>
          </StatsSection>
        )}
      </ContentWrapper>
    </PageContainer>
  )
}
