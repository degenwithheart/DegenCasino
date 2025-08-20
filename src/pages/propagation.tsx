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

type Status = {
  location: string
  country: string
  code: string
  status: 'online' | 'offline'
}

// Casino animations
const neonPulse = keyframes`
  0% { 
    box-shadow: 0 0 24px #a259ff88, 0 0 48px #ffd70044;
    border-color: #ffd70044;
  }
  100% { 
    box-shadow: 0 0 48px #ffd700cc, 0 0 96px #a259ff88;
    border-color: #ffd700aa;
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

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(24, 24, 24, 0.95), rgba(47, 32, 82, 0.9), rgba(66, 32, 66, 0.85));
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
      radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(162, 89, 255, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(255, 0, 204, 0.05) 0%, transparent 70%);
    pointer-events: none;
    z-index: -1;
  }
`

const ContentWrapper = styled.div`
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
    background: linear-gradient(90deg, #ffd700, #a259ff, #ff00cc, #ffd700);
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

const MainTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 1rem;
  text-shadow: 0 0 16px #ffd700, 0 0 32px #a259ff;
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
    background: linear-gradient(90deg, transparent, #ffd700, #a259ff, #ffd700, transparent);
    background-size: 200% 100%;
    animation: ${moveGradient} 3s linear infinite;
    border-radius: 2px;
  }
`

const DomainBox = styled.div`
  font-size: 1.25rem;
  color: #ffd700;
  background: rgba(24, 24, 24, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 1rem 2rem;
  display: inline-block;
  border: 2px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 0 24px rgba(255, 215, 0, 0.2);
  transition: all 0.3s ease;
  animation: ${neonPulse} 2s ease-in-out infinite alternate;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 32px rgba(255, 215, 0, 0.4);
    border-color: rgba(255, 215, 0, 0.6);
  }
  
  code {
    color: #a259ff;
    font-weight: 600;
    text-shadow: 0 0 8px #a259ff;
  }
`

const LoadingSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
`

const LoadingBox = styled.div`
  background: rgba(24, 24, 24, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 2.5rem;
  border: 2px solid rgba(255, 215, 0, 0.2);
  box-shadow: 0 0 32px rgba(0, 0, 0, 0.4);
  animation: ${neonPulse} 2s ease-in-out infinite alternate;
`

const LoadingContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  
  .spinner {
    width: 3rem;
    height: 3rem;
    border: 3px solid rgba(255, 215, 0, 0.2);
    border-top: 3px solid #ffd700;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    box-shadow: 0 0 16px rgba(255, 215, 0, 0.3);
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  p {
    color: #ffd700;
    font-size: 1.125rem;
    font-weight: 600;
    text-shadow: 0 0 8px #ffd700;
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

const StatusCard = styled.div<{ $isOnline: boolean }>`
  position: relative;
  padding: 2rem;
  border-radius: 16px;
  border: 2px solid;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px);
  cursor: pointer;
  overflow: hidden;
  
  background: ${props => props.$isOnline 
    ? 'rgba(24, 24, 24, 0.8)'
    : 'rgba(24, 24, 24, 0.8)'
  };
  
  border-color: ${props => props.$isOnline 
    ? 'rgba(16, 185, 129, 0.4)'
    : 'rgba(220, 38, 127, 0.4)'
  };

  box-shadow: ${props => props.$isOnline 
    ? '0 0 24px rgba(16, 185, 129, 0.2)'
    : '0 0 24px rgba(220, 38, 127, 0.2)'
  };

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => props.$isOnline 
      ? 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 70%)'
      : 'radial-gradient(circle at 50% 50%, rgba(220, 38, 127, 0.1) 0%, transparent 70%)'
    };
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
    background: ${props => props.$isOnline 
      ? 'linear-gradient(90deg, #10b981, #34d399, #10b981)'
      : 'linear-gradient(90deg, #dc2626, #f87171, #dc2626)'
    };
    background-size: 200% 100%;
    animation: ${moveGradient} 3s linear infinite;
    z-index: 1;
  }
  
  &:hover {
    transform: scale(1.05) rotate(1deg);
    box-shadow: ${props => props.$isOnline 
      ? '0 0 48px rgba(16, 185, 129, 0.4)'
      : '0 0 48px rgba(220, 38, 127, 0.4)'
    };
    border-color: ${props => props.$isOnline ? '#10b981' : '#dc2626'};
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

export default function PropagationPage() {
  const [domain, setDomain] = useState('')
  const [statusList, setStatusList] = useState<Status[]>([])
  const [loading, setLoading] = useState(false)

  // Throttle DNS API call to once per 10 seconds, singular, only when page is mounted
  const THROTTLE_MS = 10000;
  const throttledDnsCheck = useThrottle(() => {
    const params = new URLSearchParams(window.location.search)
    const domainParam = params.get('domain')
    if (!domainParam) return

    setDomain(domainParam)
    setLoading(true)

    // Use mock data in development
    if (import.meta.env.DEV) {
      console.log('Using mock DNS propagation data for development')
      const mockLocations = [
        { location: "Atlanta", country: "United States", code: "US", status: 'online' as const },
        { location: "New York", country: "United States", code: "US", status: 'online' as const },
        { location: "London", country: "United Kingdom", code: "GB", status: 'online' as const },
        { location: "Frankfurt", country: "Germany", code: "DE", status: 'online' as const },
        { location: "Tokyo", country: "Japan", code: "JP", status: 'offline' as const },
        { location: "Sydney", country: "Australia", code: "AU", status: 'online' as const },
        { location: "Singapore", country: "Singapore", code: "SG", status: 'online' as const },
        { location: "São Paulo", country: "Brazil", code: "BR", status: 'offline' as const },
        { location: "Mumbai", country: "India", code: "IN", status: 'online' as const },
        { location: "Toronto", country: "Canada", code: "CA", status: 'online' as const }
      ]
      setTimeout(() => {
        setStatusList(mockLocations)
        setLoading(false)
      }, 1000)
      return
    }

    // Use relative path for both Vercel and localhost (works with Vercel dev and Vite proxy)
    fetch(`/api/check-dns?domain=${domainParam}`)
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
    <PageContainer>
      <ContentWrapper>
        <HeaderSection>
          <MainTitle>
            🌍 Server Status
          </MainTitle>
        </HeaderSection>

        {loading && (
          <LoadingSection>
            <LoadingBox>
              <LoadingContent>
                <div className="spinner"></div>
                <p>Checking server status...</p>
              </LoadingContent>
            </LoadingBox>
          </LoadingSection>
        )}

        {!loading && (
          <CardsGrid>
            {statusList.map(({ location, country, code, status }) => (
              <StatusCard key={`${location}-${code}`} $isOnline={status === 'online'}>
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
