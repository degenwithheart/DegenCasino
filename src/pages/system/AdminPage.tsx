import React, { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PLATFORM_CREATOR_ADDRESS } from '../../constants';
import { Modal } from '../../components';
import styled, { keyframes } from 'styled-components';
import { useTheme } from '../../themes/ThemeContext';
import { CloseButton } from '@/components/Modal/Modal.styles';

// Keyframe animations matching dashboard style
const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
`

const AdminContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: white;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  position: relative;
`;

const Title = styled.h1<{ $theme?: any }>`
  font-size: 3rem;
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
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p<{ $theme?: any }>`
  font-size: 1.3rem;
  color: ${({ $theme }) => $theme?.colors?.textSecondary || 'rgba(255, 255, 255, 0.8)'};
  margin-bottom: 2rem;
  font-weight: 300;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
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

const DocsSection = styled.div`
  margin-top: 60px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
`;

const DocsTitle = styled.h2<{ $theme?: any }>`
  font-size: 2rem;
  margin-bottom: 20px;
  color: ${({ $theme }) => $theme?.colors?.primary || '#ffd700'};
`;

const DocsContent = styled.div`
  color: #ccc;
  line-height: 1.6;

  h3 {
    color: #ff5555;
    margin-top: 30px;
    margin-bottom: 15px;
    font-size: 1.4rem;
  }

  h4 {
    color: #ff8844;
    margin-top: 25px;
    margin-bottom: 10px;
    font-size: 1.2rem;
  }

  p {
    margin-bottom: 15px;
  }

  code {
    background: rgba(255, 255, 255, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }

  pre {
    background: rgba(0, 0, 0, 0.3);
    padding: 15px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 15px 0;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  ul, ol {
    margin: 15px 0;
    padding-left: 30px;
  }

  li {
    margin-bottom: 8px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
  }

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  th {
    background: rgba(255, 255, 255, 0.1);
    color: #ffd700;
  }

  blockquote {
    border-left: 4px solid #ff5555;
    padding-left: 20px;
    margin: 20px 0;
    color: #aaa;
    font-style: italic;
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
  }
];

const AdminPage: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const { currentTheme } = useTheme();
  const [selectedCommand, setSelectedCommand] = useState<AdminCommand | null>(null);
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Check if connected wallet is the creator
  const isCreator = connected && publicKey?.equals(PLATFORM_CREATOR_ADDRESS);

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
      <Header>
        <Title $theme={currentTheme}>🛠️ Admin Control Panel</Title>
        <Subtitle $theme={currentTheme}>Manage and monitor your DegenCasino platform</Subtitle>
        <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '10px' }}>
          💡 Also accessible from the sidebar menu when creator wallet is connected
        </div>
      </Header>

      <TokenInfo>
        <TokenTitle>🔐 Admin Token Setup</TokenTitle>
        <TokenText>• <strong>Local:</strong> Check your .env file for ADMIN_TOKEN</TokenText>
        <TokenText>• <strong>Production:</strong> Set ADMIN_TOKEN in Vercel environment variables</TokenText>
        <TokenText>• <strong>Current:</strong> REDACTED_ADMIN_TOKEN</TokenText>
      </TokenInfo>

      <Grid>
        {ADMIN_COMMANDS.map((command) => (
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

      <DocsSection>
        <DocsTitle $theme={currentTheme}>📚 Admin Documentation</DocsTitle>
        <DocsContent>
          <h3>Direct Browser URLs</h3>
          
          <h4>Admin Control Panel</h4>
          <pre>https://degenheart.casino/admin</pre>
          <p><em>Creator wallet only - Also accessible via sidebar menu when connected</em></p>

          <h4>RTP Audit Testing</h4>
          <pre>https://degenheart.casino/api/audit/edgeCases
https://degenheart.casino/api/audit/edgeCases?plays=50000</pre>

          <h4>Cache Management</h4>
          <pre>https://degenheart.casino/api/cache/cache-admin?action=stats
https://degenheart.casino/api/cache/cache-admin?action=cleanup</pre>

          <h4>Cache Warmup</h4>
          <pre>https://degenheart.casino/api/cache/cache-warmup</pre>

          <h4>DNS Health Check</h4>
          <pre>https://degenheart.casino/api/dns/check-dns
https://degenheart.casino/api/dns/check-dns?domain=degenheart.casino</pre>

          <h4>Price Data</h4>
          <pre>https://degenheart.casino/api/services/coingecko
https://degenheart.casino/api/services/coingecko?ids=solana,bonk
https://degenheart.casino/api/services/coingecko?ids=solana,usd-coin,jupiter-exchange,bonk&vs_currencies=usd</pre>

          <h4>Chat System</h4>
          <pre>https://degenheart.casino/api/chat/chat</pre>

          <h3>Admin Control Panel</h3>
          <p>The admin control panel provides a user-friendly interface for executing admin commands:</p>
          <ul>
            <li><strong>URL:</strong> <code>https://degenheart.casino/admin</code></li>
            <li><strong>Access:</strong> Creator wallet only</li>
            <li><strong>Navigation:</strong> Available in sidebar menu when creator wallet is connected</li>
            <li><strong>Features:</strong>
              <ul>
                <li>One-click execution of all admin commands</li>
                <li>Real-time results in modal popups</li>
                <li>Secure authentication with admin tokens</li>
                <li>Visual feedback and loading states</li>
              </ul>
            </li>
          </ul>

          <h3>Curl Commands for Admin Operations</h3>

          <h4>Cache Configuration (POST)</h4>
          <pre>{`curl -X POST "https://degenheart.casino/api/cache/cache-admin?action=configure" \\
  -H "Content-Type: application/json" \\
  -H "X-Admin-Token: YOUR_ADMIN_TOKEN" \\
  -d '{"maxSize": 100, "ttl": 3600}'`}</pre>

          <h4>Admin Authentication</h4>
          <pre>{`curl -X POST "https://degenheart.casino/api/auth/auth" \\
  -H "Content-Type: application/json" \\
  -H "X-Admin-Token: YOUR_ADMIN_TOKEN" \\
  -d '{"password": "YOUR_ADMIN_PASSWORD"}'`}</pre>

          <h4>Helius API Proxy</h4>
          <pre>{`curl -X POST "https://degenheart.casino/api/services/helius" \\
  -H "Content-Type: application/json" \\
  -d '{"method": "getBalance", "params": ["YOUR_WALLET_ADDRESS"]}'`}</pre>

          <h3>Local Development URLs</h3>
          <p>If running locally on <code>http://localhost:4001</code>:</p>
          <pre>http://localhost:4001/api/audit/edgeCases
http://localhost:4001/api/cache/cache-admin?action=stats
http://localhost:4001/api/services/coingecko
http://localhost:4001/api/dns/check-dns</pre>

          <h3>Quick Admin Commands</h3>

          <h4>Health Check Combo</h4>
          <pre>{`# Check everything at once
curl "https://degenheart.casino/api/cache/cache-admin?action=stats"
curl "https://degenheart.casino/api/dns/check-dns"
curl "https://degenheart.casino/api/services/coingecko"`}</pre>

          <h4>Emergency Cache Clear</h4>
          <pre>{`curl "https://degenheart.casino/api/cache/cache-admin?action=cleanup" \\
  -H "X-Admin-Token: YOUR_ADMIN_TOKEN"`}</pre>

          <h4>RTP Verification</h4>
          <pre>curl "https://degenheart.casino/api/audit/edgeCases?plays=100000"</pre>

          <h3>Browser Bookmarks</h3>
          <p>For quick access, bookmark these URLs:</p>
          <ul>
            <li><strong>Cache Stats:</strong> <code>https://degenheart.casino/api/cache/cache-admin?action=stats</code></li>
            <li><strong>DNS Check:</strong> <code>https://degenheart.casino/api/dns/check-dns</code></li>
            <li><strong>Price Feed:</strong> <code>https://degenheart.casino/api/services/coingecko</code></li>
            <li><strong>RTP Audit:</strong> <code>https://degenheart.casino/api/audit/edgeCases</code></li>
          </ul>

          <h3>API Endpoints Summary</h3>
          <table>
            <thead>
              <tr>
                <th>Endpoint</th>
                <th>Method</th>
                <th>Purpose</th>
                <th>Auth Required</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>/api/audit/edgeCases</code></td>
                <td>GET</td>
                <td>RTP validation tests</td>
                <td>No</td>
              </tr>
              <tr>
                <td><code>/api/auth/auth</code></td>
                <td>POST</td>
                <td>Admin authentication</td>
                <td>Admin Token</td>
              </tr>
              <tr>
                <td><code>/api/cache/cache-admin</code></td>
                <td>GET/POST</td>
                <td>Cache management</td>
                <td>Token for actions</td>
              </tr>
              <tr>
                <td><code>/api/cache/cache-warmup</code></td>
                <td>GET</td>
                <td>Cache warmup</td>
                <td>No</td>
              </tr>
              <tr>
                <td><code>/api/chat/chat</code></td>
                <td>GET/POST/DELETE</td>
                <td>Chat system</td>
                <td>No (DELETE needs signature)</td>
              </tr>
              <tr>
                <td><code>/api/dns/check-dns</code></td>
                <td>GET</td>
                <td>DNS health check</td>
                <td>No</td>
              </tr>
              <tr>
                <td><code>/api/services/coingecko</code></td>
                <td>GET</td>
                <td>Price data proxy</td>
                <td>No</td>
              </tr>
              <tr>
                <td><code>/api/services/helius</code></td>
                <td>POST</td>
                <td>Helius API proxy</td>
                <td>No</td>
              </tr>
            </tbody>
          </table>

          <h3>Environment Variables Required</h3>
          <ul>
            <li><code>ADMIN_TOKEN</code>: For admin operations (set in Vercel environment variables)</li>
            <li><code>HELIUS_API_KEY</code>: For Helius API proxy</li>
            <li><code>ACCESS_OVERRIDE_PASSWORD</code>: For admin authentication</li>
          </ul>

          <h4>Setting up Admin Token</h4>
          <ol>
            <li><strong>Local Development:</strong> Add to <code>.env</code> file:
              <pre>ADMIN_TOKEN=your_secure_random_token_here</pre>
            </li>
            <li><strong>Production (Vercel):</strong> Set in Vercel dashboard:
              <ul>
                <li>Go to Project Settings → Environment Variables</li>
                <li>Add <code>ADMIN_TOKEN</code> with a secure random value</li>
                <li>Redeploy the application</li>
              </ul>
            </li>
            <li><strong>Generate Secure Token:</strong>
              <pre>{`# Generate a secure random token
openssl rand -hex 32
# or
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`}</pre>
            </li>
          </ol>

          <h3>Notes</h3>
          <ul>
            <li>All endpoints support CORS for <code>degenheart.casino</code> and <code>localhost:4001</code></li>
            <li>Rate limiting is implemented on most endpoints</li>
            <li>Cache TTL varies by endpoint (1 minute to 5 minutes)</li>
            <li>Admin operations require <code>X-Admin-Token</code> header</li>
            <li>Local development typically runs on port 4001</li>
          </ul>

          <h3>Quick Reference</h3>

          <h4>Most Used Commands:</h4>
          <ol>
            <li><code>https://degenheart.casino/admin</code> - <strong>NEW</strong>: Admin control panel (creator only, sidebar access)</li>
            <li><code>https://degenheart.casino/api/cache/cache-admin?action=stats</code> - Check cache health</li>
            <li><code>https://degenheart.casino/api/dns/check-dns</code> - DNS status</li>
            <li><code>https://degenheart.casino/api/services/coingecko</code> - Price data</li>
            <li><code>https://degenheart.casino/api/audit/edgeCases</code> - RTP verification</li>
          </ol>

          <h4>Emergency Commands:</h4>
          <ol>
            <li>Cache cleanup: <code>https://degenheart.casino/api/cache/cache-admin?action=cleanup</code></li>
            <li>Full system check: Run all health check URLs</li>
            <li>Chat clear: DELETE to <code>/api/chat/chat</code> with signature</li>
          </ol>
        </DocsContent>
      </DocsSection>

      {selectedCommand && (
        <Modal onClose={closeModal}>
          <ResultModal>
            <CloseButton onClick={closeModal}>×</CloseButton>
            <ResultTitle>{selectedCommand.title} - Result</ResultTitle>
            <ResultContent>{result || 'Loading...'}</ResultContent>
          </ResultModal>
        </Modal>
      )}
    </AdminContainer>
  );
};

export default AdminPage;
