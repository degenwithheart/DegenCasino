import React, { useEffect, useState, useCallback, useRef } from "react";
import { useCurrentPool, useCurrentToken } from "gamba-react-ui-v2";
import { FAKE_TOKEN_MINT } from "gamba-react-ui-v2";
import styled, { keyframes } from 'styled-components';
import { useColorScheme } from '../../../ColorSchemeContext';
import { useNetwork } from '../../../../contexts/NetworkContext'

// Animations
const ping = keyframes`
  75%, 100% {
    transform: scale(1.5);
    opacity: 0;
  }
`;

// Styled Components
const ModalTitle = styled.h2<{ $colorScheme: any }>`
  font-size: 1.8rem;
  color: ${props => props.$colorScheme.colors.accent};
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 700;
`;

const StatusGrid = styled.div`
  display: grid;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StatusItem = styled.div<{ $status: 'Online' | 'Issues' | 'Offline' | 'Secured' | 'Unsecured' | 'Loading'; $colorScheme: any }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${props => props.$colorScheme.colors.surface}40;
  border: 1px solid ${props => props.$colorScheme.colors.accent}20;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  
  .label {
    font-weight: 600;
    color: ${props => props.$colorScheme.colors.text};
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .status {
    padding: 0.25rem 0.75rem;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.8rem;
    text-transform: uppercase;
    
    ${({ $status }) => {
      switch($status) {
        case 'Online':
        case 'Secured':
          return `
            background: rgba(34, 197, 94, 0.2);
            color: #22c55e;
            border: 1px solid rgba(34, 197, 94, 0.3);
          `;
        case 'Issues':
        case 'Loading':
          return `
            background: rgba(234, 179, 8, 0.2);
            color: #eab308;
            border: 1px solid rgba(234, 179, 8, 0.3);
          `;
        case 'Offline':
        case 'Unsecured':
          return `
            background: rgba(239, 68, 68, 0.2);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.3);
          `;
      }
    }}
  }
`;

// Reusable throttle hook
function useThrottle(callback: () => void, delay: number) {
  const lastCall = useRef(0);
  return () => {
    const now = Date.now();
    if (now - lastCall.current > delay) {
      lastCall.current = now;
      callback();
    }
  };
}

const HELIUS_RPC_BACKUP = import.meta.env.HELIUS_API_KEY || "https://mainnet.helius-rpc.com/?api-key=3bda9312-99fc-4ff4-9561-958d62a4a22c";

// DNS Check Hook
function useDnsStatus(shouldCheck = false) {
  const [dnsStatus, setDnsStatus] = useState<"Online" | "Issues" | "Offline" | "Loading">("Loading");

  useEffect(() => {
    if (!shouldCheck) {
      const cachedData = localStorage.getItem('dns-status-cache');
      const cacheTime = localStorage.getItem('dns-status-cache-time');
      const now = Date.now();
      
      if (cachedData && cacheTime && (now - parseInt(cacheTime)) < 300000) {
        setDnsStatus(JSON.parse(cachedData));
      } else {
        setDnsStatus("Loading");
      }
      return;
    }

    let cancelled = false;
    const cachedData = localStorage.getItem('dns-status-cache');
    const cacheTime = localStorage.getItem('dns-status-cache-time');
    const now = Date.now();
    
    if (cachedData && cacheTime && (now - parseInt(cacheTime)) < 300000) {
      setDnsStatus(JSON.parse(cachedData));
      return;
    }
    
    setDnsStatus("Loading");
    const checkDnsStatus = async () => {
      try {
        const res = await fetch("/api/dns/check-dns");
        if (res.status === 429) {
          if (cachedData) {
            setDnsStatus(JSON.parse(cachedData));
          } else {
            setDnsStatus("Issues");
          }
          return;
        }
        
        const data = await res.json();
        if (!cancelled && data && data.status) {
          setDnsStatus(data.status);
          localStorage.setItem('dns-status-cache', JSON.stringify(data.status));
          localStorage.setItem('dns-status-cache-time', now.toString());
        } else if (!cancelled) {
          setDnsStatus("Issues");
        }
      } catch {
        if (!cancelled) setDnsStatus("Offline");
      }
    };
    
    checkDnsStatus();
    return () => { cancelled = true; };
  }, [shouldCheck]);

  return dnsStatus;
}

export const ConnectionStatusContent: React.FC = () => {
  const [rpcHealth, setRpcHealth] = useState({ isHealthy: false });
  const [rpcPing, setRpcPing] = useState<number | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<
    "Secured" | "Unsecured" | "Loading" | "Issues" | "Offline" | null
  >("Loading");
  const [lastTxTime, setLastTxTime] = useState<string | null>(null);
  
  const { currentColorScheme } = useColorScheme();
  const pool = useCurrentPool();
  const token = useCurrentToken();
  const { networkConfig } = useNetwork()
  const SYNDICA_RPC = networkConfig.rpcEndpoint
  
  const dnsStatus = useDnsStatus(true); // Always check when modal is open
  
  const THROTTLE_MS = 10000;

  // Health check function
  const throttledHealthCheck = useThrottle(async () => {
    const primaryEndpoints = [SYNDICA_RPC, HELIUS_RPC_BACKUP];
    const lastResortEndpoints = ["https://rpc.ankr.com/solana", "https://api.mainnet-beta.solana.com"];
    
    for (const endpoint of primaryEndpoints) {
      const start = performance.now();
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getHealth" }),
        });
        const elapsed = performance.now() - start;
        const data = await res.json();
        
        if (data.result === "ok") {
          setRpcPing(Math.round(elapsed));
          setRpcHealth({ isHealthy: true });
          return;
        }
      } catch {
        continue;
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    for (const endpoint of lastResortEndpoints) {
      const start = performance.now();
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getHealth" }),
        });
        const elapsed = performance.now() - start;
        const data = await res.json();
        
        if (data.result === "ok") {
          setRpcPing(Math.round(elapsed));
          setRpcHealth({ isHealthy: true });
          return;
        }
      } catch {
        continue;
      }
    }
    
    setRpcHealth({ isHealthy: false });
    setRpcPing(null);
  }, THROTTLE_MS);

  // Transaction check function
  const throttledTxCheck = useThrottle(async () => {
    try {
      const res = await fetch("/api/monitoring/comprehensive-test");
      if (res.status === 429) {
        setTransactionStatus("Issues");
        return;
      }
      
      const data = await res.json();
      
      if (data.rpcHealth?.isHealthy && data.transactionSecurity?.isSecured) {
        setTransactionStatus("Secured");
        if (data.transactionSecurity?.lastTxTime) {
          setLastTxTime(data.transactionSecurity.lastTxTime);
        }
      } else {
        setTransactionStatus("Unsecured");
      }
    } catch {
      setTransactionStatus("Offline");
    }
  }, THROTTLE_MS);

  useEffect(() => {
    throttledHealthCheck();
    throttledTxCheck();
    
    const interval = setInterval(() => {
      throttledHealthCheck();
      throttledTxCheck();
    }, THROTTLE_MS);
    
    return () => clearInterval(interval);
  }, [throttledHealthCheck, throttledTxCheck]);

  const sessionType = token?.mint && token.mint.equals(FAKE_TOKEN_MINT) ? "Free Play" : "Live";

  return (
    <>
      <ModalTitle $colorScheme={currentColorScheme}>
        🔌 Connection Status
      </ModalTitle>

      <StatusGrid>
        <StatusItem $status={transactionStatus || "Loading"} $colorScheme={currentColorScheme}>
          <span className="label">🔒 Transactions:</span>
          <span className="status">{transactionStatus}</span>
        </StatusItem>

        {lastTxTime && (
          <StatusItem $status="Online" $colorScheme={currentColorScheme}>
            <span className="label">⏰ Recent Transaction:</span>
            <span style={{ fontSize: '0.8rem', color: currentColorScheme.colors.text + '70' }}>
              {lastTxTime}
            </span>
          </StatusItem>
        )}

        <StatusItem $status={rpcHealth.isHealthy ? "Online" : "Offline"} $colorScheme={currentColorScheme}>
          <span className="label">🌐 RPC Health:</span>
          <span className="status">
            {rpcHealth.isHealthy ? "Healthy" : "Unhealthy"}
          </span>
        </StatusItem>

        {rpcPing !== null && (
          <StatusItem $status={rpcPing < 500 ? "Online" : "Issues"} $colorScheme={currentColorScheme}>
            <span className="label">⚡ RPC Ping:</span>
            <span className="status">{rpcPing}ms</span>
          </StatusItem>
        )}

        <StatusItem 
          $status={dnsStatus} 
          $colorScheme={currentColorScheme}
        >
          <span className="label">📡 DNS Status:</span>
          <span className="status">{dnsStatus}</span>
        </StatusItem>

        <StatusItem $status="Online" $colorScheme={currentColorScheme}>
          <span className="label">🎮 Session Type:</span>
          <span className="status">{sessionType}</span>
        </StatusItem>

        {pool && (
          <StatusItem $status="Online" $colorScheme={currentColorScheme}>
            <span className="label">🏊 Pool:</span>
            <span style={{ 
              fontSize: '0.7rem', 
              color: currentColorScheme.colors.text + '70', 
              fontFamily: 'monospace' 
            }}>
              {pool.publicKey?.toBase58().slice(0, 8)}...
            </span>
          </StatusItem>
        )}

        {token && (
          <StatusItem $status="Online" $colorScheme={currentColorScheme}>
            <span className="label">💰 Token:</span>
            <span className="status">{token.name}</span>
          </StatusItem>
        )}
      </StatusGrid>
    </>
  );
};

export default ConnectionStatusContent;