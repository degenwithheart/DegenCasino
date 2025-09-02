import { useEffect, useState, useCallback, useRef } from "react";
import { useCurrentPool, useCurrentToken } from "gamba-react-ui-v2";
import ReactDOM from "react-dom";
import { FAKE_TOKEN_MINT } from "gamba-react-ui-v2";
import {
  StatusButton,
  StatusModal,
  ModalContentStyled,
  ModalTitle,
  StatusItem,
  CloseButton
} from './Connection.styles'

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
      <ModalContentStyled
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <CloseButton
          onClick={() => setShowModal(false)}
        >
          ×
        </CloseButton>
        
        <ModalTitle>
          Connection Status
        </ModalTitle>

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