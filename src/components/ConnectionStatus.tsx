import { useEffect, useState, useCallback, useRef } from "react";

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
import { useCurrentPool, useCurrentToken } from "gamba-react-ui-v2";
import ReactDOM from "react-dom";
import { FAKE_TOKEN_MINT } from "gamba-react-ui-v2";
import styled, { keyframes } from 'styled-components';

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

const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: rotate(0deg) scale(0.8); }
  50% { opacity: 1; transform: rotate(180deg) scale(1.2); }
`;

const StatusButton = styled.button<{ $hovered: boolean }>`
  background: rgba(255, 215, 0, 0.1);
  border: 2px solid rgba(255, 215, 0, 0.3);
  color: #ffd700;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  cursor: pointer;
  font-family: 'Luckiest Guy', cursive;
  font-size: 0.9rem;
  @media (max-width: 600px) {
    padding: 0.6rem 0.9rem;
    font-size: 1rem;
    border-radius: 10px;
    min-width: 110px;
  }
  font-weight: bold;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    border-color: #ffd700;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
    transform: translateY(-2px);

    &::before {
      left: 100%;
    }
  }

  ${({ $hovered }) => $hovered && `
    border-color: #ffd700;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
    transform: translateY(-2px);
  `}
`;

const StatusModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  z-index: 9999;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 30% 30%, rgba(255, 215, 0, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 70% 70%, rgba(162, 89, 255, 0.03) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
`;

const ModalContentStyled = styled.div`
  position: absolute;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  background: rgba(24, 24, 24, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 0;
  border: none;
  padding: 2rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 1rem 0.75rem;
    top: 70px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:
      radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(162, 89, 255, 0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ffd700, #a259ff, #ff00cc, #ffd700);
    background-size: 300% 100%;
    animation: ${moveGradient} 4s linear infinite;
    z-index: 1;
  }
`;

const ModalHeader = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background: rgba(24, 24, 24, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h2`
  font-family: 'Luckiest Guy', cursive;
  font-size: 1.5rem;
  color: #ffd700;
  margin: 0;
  text-shadow: 
    0 0 10px #ffd700,
    0 0 20px #ffd700,
    2px 2px 4px rgba(0, 0, 0, 0.8);
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '🔌';
    font-size: 1.2rem;
    animation: ${sparkle} 2s ease-in-out infinite;
  }

  &::after {
    content: '⚡';
    font-size: 1.2rem;
    animation: ${sparkle} 2s ease-in-out infinite 0.5s;
  }

  @media (max-width: 600px) {
    font-size: 1.2rem;
  }
`;

const StatusItem = styled.div<{ status: 'Online' | 'Issues' | 'Offline' | 'Secured' | 'Unsecured' | 'Loading' }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1rem;
  background: rgba(255, 215, 0, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);

  .label {
    font-weight: bold;
    color: #ffd700;
    text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  }

  .status {
    padding: 0.25rem 0.75rem;
    border-radius: 8px;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.8rem;
    
    ${({ status }) => {
      switch(status) {
        case 'Online':
        case 'Secured':
          return `
            background: rgba(34, 197, 94, 0.2);
            color: #22c55e;
            border: 1px solid rgba(34, 197, 94, 0.3);
            box-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
          `;
        case 'Issues':
        case 'Loading':
          return `
            background: rgba(234, 179, 8, 0.2);
            color: #eab308;
            border: 1px solid rgba(234, 179, 8, 0.3);
            box-shadow: 0 0 10px rgba(234, 179, 8, 0.3);
          `;
        case 'Offline':
        case 'Unsecured':
          return `
            background: rgba(239, 68, 68, 0.2);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.3);
            box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
          `;
      }
    }}
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 215, 0, 0.1);
  border: 2px solid rgba(255, 215, 0, 0.3);
  color: #ffd700;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 215, 0, 0.2);
    border-color: #ffd700;
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 215, 0, 0.3);
  color: #ffd700;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 215, 0, 0.5);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 600px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
  }
`;

const CUSTOM_RPC =
  "REDACTED_SYNDICA_KEY";
const PLATFORM_CREATOR = import.meta.env.VITE_PLATFORM_CREATOR;

// --- DNS Check Hook with caching (only when triggered) ---
function useDnsStatus(shouldCheck = false) {
  const [dnsStatus, setDnsStatus] = useState<"Online" | "Issues" | "Offline" | "Loading">("Loading");

  useEffect(() => {
    if (!shouldCheck) {
      // If not checking, try to use cached data
      const cachedData = localStorage.getItem('dns-status-cache');
      const cacheTime = localStorage.getItem('dns-status-cache-time');
      const now = Date.now();
      
      if (cachedData && cacheTime && (now - parseInt(cacheTime)) < 300000) { // 5 min cache
        setDnsStatus(JSON.parse(cachedData));
      } else {
        setDnsStatus("Loading"); // Default to loading if no cache
      }
      return;
    }

    let cancelled = false;
    
    // Check if we have cached status (5 minutes cache)
    const cachedData = localStorage.getItem('dns-status-cache');
    const cacheTime = localStorage.getItem('dns-status-cache-time');
    const now = Date.now();
    
    if (cachedData && cacheTime && (now - parseInt(cacheTime)) < 300000) { // 5 min cache
      setDnsStatus(JSON.parse(cachedData));
      return;
    }
    
    console.log('🌐 Checking DNS status on-demand');
    setDnsStatus("Loading");
    const checkDnsStatus = async () => {
      try {
        const res = await fetch("/api/check-dns");
        if (res.status === 429) {
          // Rate limited - use cached data or default to Issues
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
          // Cache the result
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


export default function ConnectionStatus() {
  const [showModal, setShowModal] = useState(false);
  const [rpcHealth, setRpcHealth] = useState({ isHealthy: false });
  const [rpcPing, setRpcPing] = useState<number | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<
    "Secured" | "Unsecured" | "Loading" | null
  >("Loading");
  const [lastTxTime, setLastTxTime] = useState<string | null>(null);
  const [buttonHovered, setButtonHovered] = useState(false);

  const pool = useCurrentPool();
  const token = useCurrentToken();

  // Use DNS hook - only check when modal is open
  const dnsStatus = useDnsStatus(showModal);

  // --- Throttle delay ---
  const THROTTLE_MS = 10000; // 10 seconds

  // Ping + Health check (only when modal is open, singular, throttled)
  const throttledHealthCheck = useThrottle(async () => {
    const start = performance.now();
    try {
      const res = await fetch(CUSTOM_RPC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getHealth" }),
      });
      const elapsed = performance.now() - start;
      setRpcPing(Math.round(elapsed));
      const data = await res.json();
      setRpcHealth({ isHealthy: data.result === "ok" });
    } catch {
      setRpcPing(null);
      setRpcHealth({ isHealthy: false });
    }
  }, THROTTLE_MS);

  // Last transaction + status check (only when modal is open, singular, throttled)
  const throttledTxCheck = useThrottle(async () => {
    if (!PLATFORM_CREATOR) return;
    try {
      const res = await fetch(
        `https://api.helius.xyz/v0/addresses/${PLATFORM_CREATOR}/transactions?api-key=REDACTED_HELIUS_KEY_SHORT&limit=1`
      );
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const tx = data[0];
        setTransactionStatus("Secured");
        const date = new Date(tx.timestamp * 1000);
        setLastTxTime(date.toLocaleString());
      } else {
        setTransactionStatus("Unsecured");
        setLastTxTime(null);
      }
    } catch (err) {
      console.error("Transaction fetch failed:", err);
      setTransactionStatus("Unsecured");
      setLastTxTime(null);
    }
  }, THROTTLE_MS);

  useEffect(() => {
    if (!showModal) return;
    throttledHealthCheck();
    throttledTxCheck();
    // Optionally, set up polling if you want repeated checks while modal is open:
    const interval = setInterval(() => {
      throttledHealthCheck();
      throttledTxCheck();
    }, THROTTLE_MS);
    return () => clearInterval(interval);
  }, [showModal, throttledHealthCheck, throttledTxCheck]);

  const escFunction = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && showModal) {
        setShowModal(false);
      }
    },
    [showModal]
  );

  useEffect(() => {
    document.addEventListener("keydown", escFunction);
    return () => document.removeEventListener("keydown", escFunction);
  }, [escFunction]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const sessionType =
    token?.mint && token.mint.equals(FAKE_TOKEN_MINT) ? "Free Play" : "Live";

  // Determine status light color based on all checks
  let statusLightColor = "#ff4d4f"; // default red
  const isLoading =
    transactionStatus === "Loading" ||
    rpcHealth.isHealthy === undefined;
  const isIssues =
    dnsStatus === "Issues" ||
    transactionStatus === "Unsecured";
  const isAllGood =
    rpcHealth.isHealthy && transactionStatus === "Secured" && dnsStatus === "Online";

  if (isAllGood) {
    statusLightColor = "#00ff88"; // green
  } else if (isLoading || isIssues) {
    statusLightColor = "#eab308"; // yellow/orange
  }

  useEffect(() => {
    console.log(`✅ RPC Health Status: ${rpcHealth.isHealthy ? "Healthy" : "Unhealthy"}`);
    console.log(`📶 RPC Ping Time: ${rpcPing !== null ? rpcPing + " ms" : "Unavailable"}`);
    console.log(`🔄 Transaction Status: ${transactionStatus || "Unknown"}`);
    console.log(`🕒 Recent Transaction: ${lastTxTime ?? "No recent transactions"}`);
    console.log(`🏊 Pool Address: ${pool?.publicKey?.toBase58() ?? "Not connected"}`);
    console.log(`💰 Token Name: ${token?.name ?? "N/A"}`);
    console.log(`🎮 Session Type: ${sessionType}`);
    console.log(`🌐 DNS Status: ${dnsStatus}`);
  }, [rpcHealth, rpcPing, transactionStatus, lastTxTime, pool, token, sessionType, dnsStatus]);

  const ModalContent = (
    <StatusModal
      onClick={() => setShowModal(false)}
      role="dialog"
      aria-modal="true"
    >
      <ModalHeader>
        <BackButton onClick={() => setShowModal(false)}>
          ← Back
        </BackButton>
        <ModalTitle>Connection Status</ModalTitle>
        <CloseButton
          onClick={() => setShowModal(false)}
        >
          ×
        </CloseButton>
      </ModalHeader>

      <ModalContentStyled
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <StatusItem status={transactionStatus || "Loading"}>
          <span className="label">🔒 Transactions:</span>
          <span className="status">{transactionStatus}</span>
        </StatusItem>

        {lastTxTime && (
          <StatusItem status="Online">
            <span className="label">⏰ Recent Transaction:</span>
            <span style={{ fontSize: '0.8rem', color: '#ccc' }}>
              {lastTxTime}
            </span>
          </StatusItem>
        )}

        <StatusItem status={rpcHealth.isHealthy ? "Online" : "Offline"}>
          <span className="label">🌐 RPC Health:</span>
          <span className="status">
            {rpcHealth.isHealthy ? "Healthy" : "Unhealthy"}
          </span>
        </StatusItem>

        {rpcPing !== null && (
          <StatusItem status={rpcPing < 500 ? "Online" : "Issues"}>
            <span className="label">⚡ RPC Ping:</span>
            <span className="status">{rpcPing}ms</span>
          </StatusItem>
        )}

        <StatusItem 
          status={dnsStatus}
          onClick={() => (window.location.href = "/propagation?domain=degenheart.casino")}
          title="View DNS propagation status"
          style={{ cursor: 'pointer' }}
        >
          <span className="label">📡 DNS Status:</span>
          <span className="status">{dnsStatus}</span>
        </StatusItem>

        <StatusItem status="Online">
          <span className="label">🎮 Session Type:</span>
          <span className="status">{sessionType}</span>
        </StatusItem>

        {pool && (
          <StatusItem status="Online">
            <span className="label">🏊 Pool:</span>
            <span style={{ fontSize: '0.7rem', color: '#ccc', fontFamily: 'monospace' }}>
              {pool.publicKey?.toBase58().slice(0, 8)}...
            </span>
          </StatusItem>
        )}

        {token && (
          <StatusItem status="Online">
            <span className="label">💰 Token:</span>
            <span className="status">{token.name}</span>
          </StatusItem>
        )}
      </ModalContentStyled>
    </StatusModal>
  );

  return (
    <div style={{ display: "inline-block" }}>
      <StatusButton
        onClick={() => setShowModal(true)}
        onMouseEnter={() => setButtonHovered(true)}
        onMouseLeave={() => setButtonHovered(false)}
        $hovered={buttonHovered}
      >
        🔌 Status
      </StatusButton>

      {showModal && ReactDOM.createPortal(ModalContent, document.body)}
    </div>
  );
}
