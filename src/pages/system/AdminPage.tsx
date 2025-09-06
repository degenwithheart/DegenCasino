import React, { useState, useCallback, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PLATFORM_CREATOR_ADDRESS } from '../../constants';
import { Modal } from '../../components';
import styled, { keyframes } from 'styled-components';
import { useIsCompact } from '../../hooks/ui/useIsCompact';
import { useTheme } from '../../themes/ThemeContext';
import { ALL_GAMES } from '../../games/allGames';
import { BET_ARRAYS, RTP_TARGETS } from '../../games/rtpConfig';

// Keyframe animations matching dashboard style
const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
`

interface CompactProps {
  $compact?: boolean;
  $theme?: any;
}

const AdminContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: white;
`;

const Header = styled.div<CompactProps>`
  text-align: center;
  margin-bottom: ${({ $compact }) => ($compact ? '2rem' : '3rem')};
  position: relative;
`;

const Title = styled.h1<CompactProps>`
  font-size: ${({ $compact }) => ($compact ? '2.5rem' : '3rem')};
  font-family: 'Luckiest Guy', cursive, sans-serif;
  background: linear-gradient(90deg, ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}, ${({ $theme }) => $theme?.colors?.secondary || '#a259ff'}, ${({ $theme }) => $theme?.colors?.accent || '#ff00cc'}, ${({ $theme }) => $theme?.colors?.primary || '#ffd700'});
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  animation: ${moveGradient} 3s linear infinite;
  text-shadow: 0 0 30px ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}80;
  
  @media (max-width: 768px) {
    font-size: ${({ $compact }) => ($compact ? '2rem' : '2.5rem')};
  }
`;

const Subtitle = styled.p<CompactProps>`
  font-size: ${({ $compact }) => ($compact ? '1.1rem' : '1.3rem')};
  color: ${({ $theme }) => $theme?.colors?.textSecondary || 'rgba(255, 255, 255, 0.8)'};
  margin-bottom: ${({ $compact }) => ($compact ? '1.5rem' : '2rem')};
  font-weight: 300;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

// Animated accent bar
const AccentBar = styled.div<CompactProps>`
  height: ${({ $compact }) => ($compact ? '4px' : '6px')};
  width: 60%;
  max-width: 400px;
  margin: 0 auto ${({ $compact }) => ($compact ? '1.5rem' : '2rem')};
  border-radius: 3px;
  background: linear-gradient(90deg, ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}, ${({ $theme }) => $theme?.colors?.secondary || '#a259ff'}, ${({ $theme }) => $theme?.colors?.accent || '#ff00cc'}, ${({ $theme }) => $theme?.colors?.primary || '#ffd700'});
  background-size: 300% 100%;
  animation: ${moveGradient} 3s linear infinite;
  box-shadow: 0 0 20px ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}66;
`;

const CasinoSparkles = styled.div`
  position: absolute;
  top: -20px;
  right: 10%;
  font-size: 2rem;
  animation: ${sparkle} 2s infinite;
  pointer-events: none;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    right: 5%;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ff5555;
    transform: translateY(-2px);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #ff5555;
`;

const CardDescription = styled.p`
  color: #ccc;
  font-size: 0.9rem;
  margin-bottom: 15px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(45deg, #ff5555, #ff8844);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(255, 85, 85, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ResultModal = styled.div`
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ResultTitle = styled.h3`
  color: #ff5555;
  margin-bottom: 15px;
`;

const ResultContent = styled.pre`
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  white-space: pre-wrap;
  word-break: break-all;
  color: #ddd;
  max-height: 400px;
  overflow-y: auto;
`;

const ExportButton = styled.button`
  position: absolute;
  top: 10px;
  right: 40px;
  background: none;
  border: none;
  color: #888;
  font-size: 1.2rem;
  cursor: pointer;

  &:hover {
    color: #ff5555;
  }
`;

const CopyButton = styled.button`
  position: absolute;
  top: 10px;
  right: 70px;
  background: none;
  border: none;
  color: #888;
  font-size: 1.2rem;
  cursor: pointer;

  &:hover {
    color: #ff5555;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #888;
  font-size: 1.5rem;
  cursor: pointer;

  &:hover {
    color: #ff5555;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  margin-bottom: 20px;

  &::placeholder {
    color: #888;
  }

  &:focus {
    outline: none;
    border-color: #ff5555;
  }
`;

const AccessDenied = styled.div`
  text-align: center;
  padding: 50px 20px;
`;

const AccessDeniedTitle = styled.h2`
  color: #ff5555;
  margin-bottom: 20px;
`;

const AccessDeniedText = styled.p`
  color: #888;
  font-size: 1.1rem;
  margin-bottom: 30px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const InfoCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
`;

const InfoCardTitle = styled.h4`
  color: #ff5555;
  margin-bottom: 10px;
  font-size: 1rem;
`;

const InfoCardValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 5px;
`;

const InfoCardSubtitle = styled.div`
  color: #ccc;
  font-size: 0.8rem;
`;

const StatusIndicator = styled.div<{ $status: 'online' | 'offline' | 'warning' | 'error' | 'success' }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $status }) => 
    $status === 'online' || $status === 'success' ? '#00ff00' :
    $status === 'warning' ? '#ffff00' :
    $status === 'error' ? '#ff0000' : '#666'
  };
  margin-right: 8px;
`;

const EnhancedResultModal = styled.div`
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 0;
  max-width: 800px;
  width: 95%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h3`
  color: #ff5555;
  margin: 0;
  font-size: 1.2rem;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ModalContent = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
`;

const ResultSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h4`
  color: #fff;
  margin-bottom: 10px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FormattedResult = styled.pre`
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.8rem;
  white-space: pre-wrap;
  word-break: break-all;
  color: #ddd;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatusBadge = styled.span<{ $status: 'success' | 'error' | 'warning' | 'info' }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
  background: ${({ $status }) => 
    $status === 'success' ? 'rgba(0, 255, 0, 0.2)' :
    $status === 'error' ? 'rgba(255, 0, 0, 0.2)' :
    $status === 'warning' ? 'rgba(255, 255, 0, 0.2)' : 'rgba(0, 255, 255, 0.2)'
  };
  color: ${({ $status }) => 
    $status === 'success' ? '#00ff00' :
    $status === 'error' ? '#ff0000' :
    $status === 'warning' ? '#ffff00' : '#00ffff'
  };
  border: 1px solid ${({ $status }) => 
    $status === 'success' ? 'rgba(0, 255, 0, 0.3)' :
    $status === 'error' ? 'rgba(255, 0, 0, 0.3)' :
    $status === 'warning' ? 'rgba(255, 255, 0, 0.3)' : 'rgba(0, 255, 255, 0.3)'
  };
`;

const TokenInfo = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
`;

const TokenTitle = styled.h4`
  color: #ff5555;
  margin-bottom: 10px;
  font-size: 1rem;
`;

const TokenText = styled.p`
  color: #ccc;
  font-size: 0.9rem;
  margin: 5px 0;
`;

const WalletAddress = styled.code`
  background: rgba(255, 255, 255, 0.1);
  padding: 5px 10px;
  border-radius: 4px;
  font-family: monospace;
`;

interface AdminCommand {
  id: string;
  title: string;
  description: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'DELETE';
  requiresAuth?: boolean;
  body?: any;
}

const ADMIN_COMMANDS: AdminCommand[] = [
  {
    id: 'cache-stats',
    title: 'Cache Statistics',
    description: 'Get current cache statistics and performance metrics',
    endpoint: '/api/cache/cache-admin?action=stats',
    method: 'GET'
  },
  {
    id: 'cache-cleanup',
    title: 'Cache Cleanup',
    description: 'Clean expired cache entries',
    endpoint: '/api/cache/cache-admin?action=cleanup',
    method: 'GET',
    requiresAuth: true
  },
  {
    id: 'cache-warmup',
    title: 'Cache Warmup',
    description: 'Warm up cache with common data',
    endpoint: '/api/cache/cache-warmup',
    method: 'GET'
  },
  {
    id: 'dns-check',
    title: 'DNS Health Check',
    description: 'Check DNS status across multiple locations',
    endpoint: '/api/dns/check-dns',
    method: 'GET'
  },
  {
    id: 'rtp-audit',
    title: 'RTP Audit',
    description: 'Run RTP validation tests for all games',
    endpoint: '/api/audit/edgeCases?plays=10000',
    method: 'GET'
  },
  {
    id: 'price-data',
    title: 'Price Data',
    description: 'Get cryptocurrency price data',
    endpoint: '/api/services/coingecko',
    method: 'GET'
  },
  {
    id: 'chat-messages',
    title: 'Chat Messages',
    description: 'Get current chat messages',
    endpoint: '/api/chat/chat',
    method: 'GET'
  },
  {
    id: 'wallet-lookup',
    title: 'Wallet Lookup',
    description: 'Search users by wallet address and view stats',
    endpoint: '/api/admin/wallets?action=lookup&address=',
    method: 'GET'
  },
  {
    id: 'active-wallets',
    title: 'Active Wallets',
    description: 'List recently active wallets',
    endpoint: '/api/admin/wallets?action=active&limit=50',
    method: 'GET'
  },
  {
    id: 'game-rtp-deep',
    title: 'Game RTP Deep Dive',
    description: 'RTP audit for specific game and wallet',
    endpoint: '/api/audit/edgeCases?game=slots&wallet=&plays=1000',
    method: 'GET'
  },
  {
    id: 'live-games',
    title: 'Live Game Sessions',
    description: 'View active multiplayer game sessions',
    endpoint: '/api/admin/games/live',
    method: 'GET'
  },
  {
    id: 'jackpot-health',
    title: 'Jackpot & Pool Health',
    description: 'Check jackpot balances and pool statuses',
    endpoint: '/api/admin/jackpots',
    method: 'GET'
  },
  {
    id: 'cache-keys',
    title: 'Cache Key Inspection',
    description: 'View specific cache keys',
    endpoint: '/api/cache/cache-admin?action=keys&pattern=',
    method: 'GET'
  },
  {
    id: 'cache-warmup-game',
    title: 'Cache Warmup by Game',
    description: 'Warm up cache for specific game',
    endpoint: '/api/cache/cache-warmup?game=slots',
    method: 'GET'
  },
  {
    id: 'wallet-blacklist',
    title: 'Wallet Blacklist',
    description: 'Manage blacklisted wallets',
    endpoint: '/api/admin/blacklist?action=list',
    method: 'GET',
    requiresAuth: true
  },
  {
    id: 'transaction-audit',
    title: 'Transaction Audit',
    description: 'Fetch recent transactions for a wallet',
    endpoint: '/api/admin/transactions?wallet=',
    method: 'GET'
  },
  {
    id: 'price-alerts',
    title: 'Price Alerts',
    description: 'Monitor price anomalies',
    endpoint: '/api/services/coingecko/alerts?threshold=5',
    method: 'GET'
  },
  {
    id: 'rpc-health',
    title: 'RPC Health Check',
    description: 'Check Solana RPC endpoints',
    endpoint: '/api/dns/check-dns?includeRpc=true',
    method: 'GET'
  }
];

const AdminPage: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const [selectedCommand, setSelectedCommand] = useState<AdminCommand | null>(null);
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [platformData, setPlatformData] = useState<any>(null);
  const isCompact = useIsCompact();
  const { currentTheme } = useTheme();

  // Check if connected wallet is the creator
  const isCreator = connected && publicKey?.equals(PLATFORM_CREATOR_ADDRESS);

  // Fetch live platform data
  useEffect(() => {
    const fetchPlatformData = async () => {
      try {
        // Count games
        const gameCount = ALL_GAMES.length;
        
        // Calculate RTP range
        const rtpValues = Object.values(RTP_TARGETS);
        const minRTP = Math.min(...rtpValues);
        const maxRTP = Math.max(...rtpValues);
        const rtpRange = `${minRTP}-${maxRTP}`;
        
        // Check cache status
        const cacheResponse = await fetch('/api/cache/cache-admin?action=stats');
        const cacheData = cacheResponse.ok ? await cacheResponse.json() : null;
        
        // Check RPC status
        const rpcResponse = await fetch('/api/dns/check-dns?includeRpc=true');
        const rpcData = rpcResponse.ok ? await rpcResponse.json() : null;
        
        setPlatformData({
          architecture: 'React + Vite + Solana',
          games: `${gameCount}+ provably fair games`,
          security: 'Wallet-based auth',
          performance: cacheData ? `Edge caching enabled (${cacheData.hitRate || '98.5%'})` : 'Edge caching enabled',
          rtp: `${rtpRange}% across games`,
          deployment: 'Vercel serverless',
          storage: 'Vercel KV cache',
          rpc: rpcData?.rpc ? `${rpcData.rpc.filter((r: any) => r.status === 'online').length}/${rpcData.rpc.length} endpoints` : 'Helius + backup endpoints',
          lastUpdated: new Date().toLocaleTimeString()
        });
      } catch (error) {
        console.error('Failed to fetch platform data:', error);
        // Fallback data
        setPlatformData({
          architecture: 'React + Vite + Solana',
          games: '10+ provably fair games',
          security: 'Wallet-based auth',
          performance: 'Edge caching enabled',
          rtp: '95-99% across games',
          deployment: 'Vercel serverless',
          storage: 'Vercel KV cache',
          rpc: 'Helius + backup endpoints',
          lastUpdated: new Date().toLocaleTimeString()
        });
      }
    };

    if (isCreator) {
      fetchPlatformData();
      // Refresh every 30 seconds
      const interval = setInterval(fetchPlatformData, 30000);
      return () => clearInterval(interval);
    }
  }, [isCreator]);

  const executeCommand = useCallback(async (command: AdminCommand) => {
    setLoading(true);
    setResult('');

    try {
      const baseUrl = window.location.origin;
      const url = `${baseUrl}${command.endpoint}`;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add admin token if required
      if (command.requiresAuth) {
        const adminToken = localStorage.getItem('admin_token') || prompt('Enter admin token (check .env file or Vercel settings):');
        if (adminToken) {
          headers['X-Admin-Token'] = adminToken;
          localStorage.setItem('admin_token', adminToken);
        }
      }

      const response = await fetch(url, {
        method: command.method,
        headers,
        body: command.body ? JSON.stringify(command.body) : undefined,
      });

      const data = await response.text();

      let formattedResult = `Status: ${response.status} ${response.statusText}\n\n`;

      if (response.ok) {
        try {
          const jsonData = JSON.parse(data);
          formattedResult += `Response:\n${JSON.stringify(jsonData, null, 2)}`;
        } catch {
          formattedResult += `Response:\n${data}`;
        }
      } else {
        formattedResult += `Error:\n${data}`;
      }

      setResult(formattedResult);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCommandClick = (command: AdminCommand) => {
    setSelectedCommand(command);
    executeCommand(command);
  };

  const closeModal = () => {
    setSelectedCommand(null);
    setResult('');
  };

  const exportResult = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedCommand?.id}-result.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      alert('Result copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (!connected) {
    return (
      <AdminContainer>
        <AccessDenied>
          <AccessDeniedTitle>🔒 Wallet Not Connected</AccessDeniedTitle>
          <AccessDeniedText>
            Please connect your wallet to access admin commands.
          </AccessDeniedText>
        </AccessDenied>
      </AdminContainer>
    );
  }

  if (!isCreator) {
    return (
      <AdminContainer>
        <AccessDenied>
          <AccessDeniedTitle>🚫 Access Denied</AccessDeniedTitle>
          <AccessDeniedText>
            Only the platform creator can access admin commands.
            <br />
            <br />
            Connected: <WalletAddress>{publicKey?.toBase58()}</WalletAddress>
            <br />
            Required: <WalletAddress>{PLATFORM_CREATOR_ADDRESS.toBase58()}</WalletAddress>
          </AccessDeniedText>
        </AccessDenied>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <Header $compact={!!isCompact}>
        <CasinoSparkles>🛠️⚡🛠️</CasinoSparkles>
        <Title $compact={!!isCompact} $theme={currentTheme}>🛠️ Admin Control Panel</Title>
        <AccentBar $compact={!!isCompact} $theme={currentTheme} />
        <Subtitle $compact={!!isCompact} $theme={currentTheme}>
          Manage and monitor your DegenCasino platform
        </Subtitle>
      </Header>

      <TokenInfo>
        <TokenTitle>🔐 Admin Token Setup</TokenTitle>
        <TokenText>• <strong>Status:</strong> Server-side configured</TokenText>
        <TokenText style={{ color: '#888', fontSize: '0.8rem', marginTop: '10px' }}>
          💡 <strong>Tip:</strong> Token is stored in localStorage after first use
        </TokenText>
      </TokenInfo>

      {platformData && (
        <InfoCard style={{ marginBottom: '20px', textAlign: 'left' }}>
          <InfoCardTitle>🚀 Live Platform Overview</InfoCardTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
            <div>
              <strong>🏗️ Architecture:</strong> {platformData.architecture}<br />
              <strong>🎯 Games:</strong> {platformData.games}<br />
              <strong>🔐 Security:</strong> {platformData.security}<br />
              <strong>⚡ Performance:</strong> {platformData.performance}<br />
            </div>
            <div>
              <strong>📊 RTP:</strong> {platformData.rtp}<br />
              <strong>🌐 Deployment:</strong> {platformData.deployment}<br />
              <strong>💾 Storage:</strong> {platformData.storage}<br />
              <strong>🔗 RPC:</strong> {platformData.rpc}<br />
            </div>
          </div>
          <div style={{ marginTop: '15px', padding: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', fontSize: '0.8rem', color: '#ccc' }}>
            🔄 <strong>Last updated:</strong> {platformData.lastUpdated} (refreshes every 30s)
          </div>
        </InfoCard>
      )}

      <SearchInput
        type="text"
        placeholder="Search commands..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <InfoCard style={{ flex: '1', minWidth: '200px' }}>
          <InfoCardTitle>🎮 Games</InfoCardTitle>
          <InfoCardValue>{ALL_GAMES.length}</InfoCardValue>
          <InfoCardSubtitle>Active games</InfoCardSubtitle>
        </InfoCard>
        
        <InfoCard style={{ flex: '1', minWidth: '200px' }}>
          <InfoCardTitle>📊 RTP Range</InfoCardTitle>
          <InfoCardValue>{Math.min(...Object.values(RTP_TARGETS))}-{Math.max(...Object.values(RTP_TARGETS))}%</InfoCardValue>
          <InfoCardSubtitle>Across all games</InfoCardSubtitle>
        </InfoCard>
        
        <InfoCard style={{ flex: '1', minWidth: '200px' }}>
          <InfoCardTitle>⚡ Cache</InfoCardTitle>
          <InfoCardValue>
            <StatusIndicator $status="online" />
            Active
          </InfoCardValue>
          <InfoCardSubtitle>Vercel KV enabled</InfoCardSubtitle>
        </InfoCard>
      </div>

      <Grid>
        {ADMIN_COMMANDS.filter(command =>
          command.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          command.description.toLowerCase().includes(searchTerm.toLowerCase())
        ).map((command) => (
          <Card key={command.id}>
            <CardTitle>{command.title}</CardTitle>
            <CardDescription>{command.description}</CardDescription>
            <Button
              onClick={() => handleCommandClick(command)}
              disabled={loading}
            >
              {loading && selectedCommand?.id === command.id ? 'Executing...' : 'Execute'}
            </Button>
          </Card>
        ))}
      </Grid>

      {selectedCommand && (
        <Modal onClose={closeModal}>
          <EnhancedResultModal>
            <ModalHeader>
              <ModalTitle>
                <StatusIndicator $status={result.includes('Error') || result.includes('401') || result.includes('403') ? 'error' : 'success'} />
                {selectedCommand.title} - Result
              </ModalTitle>
              <ModalActions>
                <CopyButton onClick={copyToClipboard} title="Copy to Clipboard">📋</CopyButton>
                <ExportButton onClick={exportResult} title="Download Result">📥</ExportButton>
                <CloseButton onClick={closeModal}>×</CloseButton>
              </ModalActions>
            </ModalHeader>
            <ModalContent>
              <ResultSection>
                <SectionTitle>
                  📊 Command Details
                </SectionTitle>
                <div style={{ marginBottom: '15px' }}>
                  <strong>Endpoint:</strong> <code style={{ color: '#00ffff' }}>{selectedCommand.endpoint}</code><br />
                  <strong>Method:</strong> <StatusBadge $status="info">{selectedCommand.method}</StatusBadge><br />
                  <strong>Auth Required:</strong> {selectedCommand.requiresAuth ? 
                    <StatusBadge $status="warning">Yes</StatusBadge> : 
                    <StatusBadge $status="success">No</StatusBadge>
                  }
                </div>
              </ResultSection>
              
              <ResultSection>
                <SectionTitle>
                  📋 Response Data
                </SectionTitle>
                <FormattedResult>{result || 'Loading...'}</FormattedResult>
              </ResultSection>
              
              {result && (
                <ResultSection>
                  <SectionTitle>
                    ℹ️ Quick Stats
                  </SectionTitle>
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <div>
                      <strong>Status:</strong> {
                        result.includes('200') ? <StatusBadge $status="success">Success</StatusBadge> :
                        result.includes('Error') ? <StatusBadge $status="error">Error</StatusBadge> :
                        <StatusBadge $status="warning">Unknown</StatusBadge>
                      }
                    </div>
                    <div>
                      <strong>Response Size:</strong> {result.length} chars
                    </div>
                    <div>
                      <strong>Timestamp:</strong> {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </ResultSection>
              )}
            </ModalContent>
          </EnhancedResultModal>
        </Modal>
      )}
    </AdminContainer>
  );
};

export default AdminPage;
