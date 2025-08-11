import React, { useState, useEffect, useRef, useCallback } from 'react'
// Throttle hook
function useThrottle(callback: (...args: any[]) => void, delay: number) {
  const lastCall = useRef(0);
  return useCallback((...args: any[]) => {
    const now = Date.now();
    if (now - lastCall.current > delay) {
      lastCall.current = now;
      callback(...args);
    }
  }, [callback, delay]);
}
import { useWallet } from '@solana/wallet-adapter-react'
import styled, { keyframes } from 'styled-components'

// Casino animations

const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
  const [solTicker, setSolTicker] = useState('') // will be set to correct SOL ticker
`;

    // Find the correct ticker for Solana in the coins list
    const findSolTicker = (coins: Coin[]): string => {
      const solCandidates = ['sol', 'solana']
      const found = coins.find(c => solCandidates.includes(c.ticker.toLowerCase()) || c.name.toLowerCase().includes('solana'))
      return found ? found.ticker : 'sol'
    }
const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: rotate(0deg) scale(0.8); }
  50% { opacity: 1; transform: rotate(180deg) scale(1.2); }
`;

interface Coin {
  name: string;
  ticker: string;
}

interface EstimationResult {
  estimatedAmount: string;
  rate: string;
  error?: string;
}

interface SwapDetails {
  payinAddress: string;
  amountExpectedFrom: string;
        // const solTicker = findSolTicker(mockCoins)
        // setSolTicker(solTicker)
  payinExtraId?: string;
  trackUrl: string;
}

// Casino-style selector for To Coin (SOL)
          // setTo(solTicker); // Removed because setTo is not defined in this scope


const Container = styled.main<{ $visible: boolean }>`
  max-width: 100%;
  min-height: 400px;
  margin: auto;
  padding: 2rem 2.5rem;
  border-radius: 24px;
  background: rgba(24, 24, 24, 0.8);
  backdrop-filter: blur(20px);
  box-shadow: 0 0 32px rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(255, 215, 0, 0.2);
  color: white;
  max-height: 85vh;
  overflow-y: auto;
  transition: opacity 1s ease, transform 1s ease;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) =>
    $visible ? 'translateY(0)' : 'translateY(20px)'};
  display: block;
  position: relative;

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
    border-radius: 24px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ffd700, #a259ff, #ff00cc, #ffd700);
    background-size: 300% 100%;
    animation: ${moveGradient} 4s linear infinite;
    border-radius: 24px 24px 0 0;
  }

  @media (max-width: 600px) {
    padding: 1.1rem 0.4rem;
    border-radius: 12px;
    min-height: 320px;
  }
  @media (max-width: 400px) {
    padding: 0.5rem 0.1rem;
    border-radius: 7px;
  }
`



const Selector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.1rem;
  }
`;

const Content = styled.div`
  line-height: 1.6;
  font-size: 1rem;
  margin-top: 1rem;

  input,
  select {
    padding: 0.5rem;
    margin-top: 0.25rem;
    width: 100%;
    border-radius: 8px;
    border: none;
    font-size: 1rem;
  }

  button.swap {
    margin-top: 1.5rem;
    padding: 1rem 2rem;
    font-weight: bold;
    background: linear-gradient(135deg, #ffd700, #a259ff);
    color: #222;
    border-radius: 12px;
    cursor: pointer;
    border: 2px solid rgba(255, 215, 0, 0.3);
    font-size: 1.1rem;
    font-family: 'Luckiest Guy', cursive, sans-serif;
    letter-spacing: 1px;
    transition: all 0.3s ease;
    box-shadow: 0 0 16px rgba(255, 215, 0, 0.3);

    &:hover {
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 0 32px rgba(255, 215, 0, 0.6);
      border-color: rgba(255, 215, 0, 0.6);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
  }

  .output {
    margin-top: 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    padding: 1rem;
    border-radius: 8px;
  }

  @media (max-width: 600px) {
    font-size: 0.97rem;
    line-height: 1.4;
    margin-top: 0.5rem;
    input, select {
      font-size: 0.97rem;
      padding: 0.4rem;
      border-radius: 6px;
    }
    button.swap {
      padding: 0.7rem 1.1rem;
      font-size: 0.97rem;
      border-radius: 8px;
    }
    .output {
      padding: 0.7rem;
      border-radius: 6px;
    }
  }
`;

const FromCoinSelector = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;

  @media (max-width: 600px) {
    gap: 0.3rem;
  }
`;

const FromCoinLabel = styled.label`
  color: #ffd700;
  font-weight: 800;
  font-size: 1.08rem;
  letter-spacing: 0.5px;
  text-shadow: 0 0 8px #ffd70088, 0 0 12px #a259ff44;
  margin-bottom: 0.1rem;
  font-family: 'Luckiest Guy', cursive, sans-serif;

  @media (max-width: 600px) {
    font-size: 0.97rem;
    letter-spacing: 0.2px;
  }
`;

const ToCoinBox = styled.div`
  background: linear-gradient(90deg, #ffd700 0%, #a259ff 100%);
  color: #222;
  font-weight: bold;
  font-size: 1.1rem;
  border-radius: 10px;
  padding: 0.7rem 1.2rem;
  box-shadow: 0 0 12px #ffd70055, 0 0 8px #a259ff33;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  letter-spacing: 1px;

  @media (max-width: 600px) {
    font-size: 0.97rem;
    border-radius: 7px;
    padding: 0.5rem 0.7rem;
  }
`;


const ExchangePage: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const [coins, setCoins] = useState<Coin[]>([])
  const [supportedFromTickers, setSupportedFromTickers] = useState<string[]>([])
  const [coinError, setCoinError] = useState('')
  const [from, setFrom] = useState('btc')
  const [to, setTo] = useState('eth')
  const [amount, setAmount] = useState('0.1')
  const [walletAddress, setWalletAddress] = useState('')
  const wallet = useWallet()
  const [result, setResult] = useState<EstimationResult | null>(null)
  const [swapDetails, setSwapDetails] = useState<SwapDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  // Fetch all coins and filter to only those that can be exchanged to SOL
  const fetchCoins = async (retryAttempt = 0) => {
    try {
      setCoinError('')
      setRetryCount(retryAttempt)
      console.log('Fetching coins from API...')

      // Use mock data in development when API is not available
      if (import.meta.env.DEV) {
        // In dev, mock only coins that can be exchanged to SOL
        const mockPairs = [
          { from: 'btc', to: 'sol' },
          { from: 'eth', to: 'sol' },
          { from: 'usdt', to: 'sol' },
          { from: 'usdc', to: 'sol' },
          { from: 'bnb', to: 'sol' },
        ];
        const mockCoins = [
          { ticker: 'btc', name: 'Bitcoin' },
          { ticker: 'eth', name: 'Ethereum' },
          { ticker: 'usdt', name: 'Tether' },
          { ticker: 'usdc', name: 'USD Coin' },
          { ticker: 'bnb', name: 'BNB' },
        ];
        await new Promise(resolve => setTimeout(resolve, 500));
        setCoins(mockCoins);
        setSupportedFromTickers(mockPairs.map(p => p.from));
        setCoinError('');
        if (mockCoins.length > 0) {
          setFrom(mockCoins[0].ticker);
          setTo('sol');
        }
        return;
      }

      // Fetch all coins
      const coinsRes = await fetch('/api/changenow-coins', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!coinsRes.ok) throw new Error(`Server error: ${coinsRes.status} ${coinsRes.statusText}`);
      const coinsText = await coinsRes.text();
      let coinsData;
      try {
        coinsData = JSON.parse(coinsText);
      } catch (parseError) {
        throw new Error('Invalid JSON response from server');
      }
      if (!Array.isArray(coinsData)) throw new Error('Invalid response format - expected array');

      // Try to fetch supported pairs, but fallback to all coins if it fails
      let allowedFromTickers: string[] = [];
      let filteredCoins: Coin[] = [];
      let pairsFailed = false;
      try {
        const pairsRes = await fetch('/api/changenow-pairs?to=sol', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!pairsRes.ok) throw new Error(`Server error: ${pairsRes.status} ${pairsRes.statusText}`);
        const pairsText = await pairsRes.text();
        let pairsData;
        try {
          pairsData = JSON.parse(pairsText);
        } catch (parseError) {
          throw new Error('Invalid JSON response from server (pairs)');
        }
        // pairsData should be an array of objects with {from, to}
        const solPairs = Array.isArray(pairsData) ? pairsData.filter((p: any) => p.to === 'sol') : [];
        allowedFromTickers = solPairs.map((p: any) => p.from);
        filteredCoins = coinsData.filter((coin: Coin) => allowedFromTickers.includes(coin.ticker));
        setSupportedFromTickers(allowedFromTickers);
      } catch (pairErr: any) {
        // Fallback: show all coins, warn user
        console.warn('Could not fetch supported pairs, showing all coins as fallback:', pairErr);
        pairsFailed = true;
        allowedFromTickers = coinsData.map((coin: Coin) => coin.ticker);
        filteredCoins = coinsData;
        setSupportedFromTickers(allowedFromTickers);
      }
      setCoins(filteredCoins);
      if (filteredCoins.length > 0) {
        setFrom(filteredCoins[0].ticker);
        setTo('sol');
      }
      if (pairsFailed) {
        setCoinError('Could not verify which coins are supported for SOL swaps. Showing all coins. Some swaps may fail.');
      } else {
        setCoinError('');
      }
    } catch (err: any) {
      console.error('Error fetching coins:', err)
      const errorMessage = err?.message || 'Failed to load coins'

      // Retry logic - try up to 2 more times with delay
      if (retryAttempt < 2) {
        console.log(`Retrying fetch coins... attempt ${retryAttempt + 2}`)
        setTimeout(() => fetchCoins(retryAttempt + 1), 2000 * (retryAttempt + 1))
        setCoinError(`${errorMessage}. Retrying in ${2 * (retryAttempt + 1)} seconds...`)
      } else {
        setCoinError(`${errorMessage}. Please check the browser console for more details.`)
      }

      setCoins([])
    }
  }

  // Throttled fetchCoins
  const throttledFetchCoins = useThrottle(fetchCoins, 10000);
  useEffect(() => {
    setVisible(true)
    throttledFetchCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Throttled estimation and swap
  const doExchangeEstimation = useThrottle(async () => {
    setLoading(true)
    setResult(null)
    try {
      // Use GET for estimation
      const params = new URLSearchParams({ amount, from, to: 'sol' })
      const res = await fetch(`/api/changenow-estimate?${params.toString()}`)
      const data = await res.json()
      if (!res.ok || data.error) {
        setResult({ estimatedAmount: '', rate: '', error: data.error || 'Estimation failed' })
      } else {
        setResult({
          estimatedAmount: data.estimatedAmount || data.estimated_amount || '',
          rate: data.rate || '',
        })
      }
    } catch (err: any) {
      setResult({ estimatedAmount: '', rate: '', error: err.message || 'Estimation failed' })
    } finally {
      setLoading(false)
    }
  }, 10000);

  const createSwap = useThrottle(async () => {
    if (!from || !to || !amount || !walletAddress || coins.length === 0) {
      setErrorMessage('Please select coins, enter amount, and provide your wallet address.')
      return
    }
    setErrorMessage('')
    setLoading(true)
    try {
      // Use mock data in development
      if (import.meta.env.DEV) {
        console.log('Using mock swap creation for development')
        await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API delay
        
        const mockSwapDetails = {
          payinAddress: `mock-${from}-address-${Math.random().toString(36).substr(2, 9)}`,
          amountExpectedFrom: amount,
          payinExtraId: Math.random() > 0.5 ? `memo-${Math.random().toString(36).substr(2, 6)}` : undefined,
          trackUrl: `https://changenow.io/exchange/txs/mock-${Math.random().toString(36).substr(2, 12)}`
        }
        setSwapDetails(mockSwapDetails)
        setLoading(false)
        return
      }

      const res = await fetch('/api/changenow-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, from, to, address: walletAddress }),
      })
      const text = await res.text()
      const data = JSON.parse(text)
      // handle data as needed
    } catch (error: any) {
      setErrorMessage(error?.message || 'Failed to create swap')
    } finally {
      setLoading(false)
    }
  }, 10000);

  return (
    <Container $visible={visible}>
      <Selector>
        <FromCoinSelector>
          <FromCoinLabel htmlFor="from">From</FromCoinLabel>
          <select
            id="from"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            disabled={loading}
          >
            {coins.map((coin) => (
              <option key={coin.ticker} value={coin.ticker}>
                {coin.name} ({coin.ticker.toUpperCase()})
              </option>
            ))}
          </select>
          {coinError && (
            <div style={{ color: '#ff4d4f', marginTop: '0.5rem', fontWeight: 600, fontSize: '0.98rem' }}>
              ⚠️ {coinError}
            </div>
          )}
        </FromCoinSelector>
        <FromCoinSelector>
          <FromCoinLabel htmlFor="to">To Solana (SOL)</FromCoinLabel>
          <ToCoinBox>
            🔥 Solana (SOL) 🔥
          </ToCoinBox>
        </FromCoinSelector>
      </Selector>
      <Content>
        <label htmlFor="amount">Amount ({from.toUpperCase()}):</label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button className="swap" onClick={doExchangeEstimation} disabled={loading}>
          {loading ? 'Estimating...' : '💎 Estimate SOL Swap'}
        </button>

        {result && (
          <div className="output">
            {result.error ? (
              <p>Error: {result.error}</p>
            ) : (
              <>
                <p>
                  🔥 You'll receive approximately <strong>{result.estimatedAmount}</strong> SOL
                </p>
                <p>
                  Rate: 1 {from.toUpperCase()} ≈ {result.rate} SOL
                </p>
              </>
            )}
          </div>
        )}


        <label htmlFor="wallet">Your Solana (SOL) Wallet Address:</label>
        {/* Show the connected wallet address if available */}
        {wallet?.publicKey ? (
          <div style={{
            margin: '0.5rem 0 1rem 0',
            fontWeight: 700,
            color: '#ffd700',
            wordBreak: 'break-all',
            fontFamily: 'monospace',
            fontSize: '1.1rem',
            letterSpacing: '0.5px',
          }}>
            {wallet.publicKey.toBase58()}
          </div>
        ) : (
          <div style={{ margin: '0.5rem 0 1rem 0', color: '#ff4d4f', fontWeight: 600 }}>
            No wallet connected
          </div>
        )}
        <input
          id="wallet"
          type="text"
          value={wallet?.publicKey ? wallet.publicKey.toBase58() : walletAddress}
          disabled
          placeholder="Enter your SOL wallet address..."
        />

        <button className="swap" onClick={createSwap} disabled={loading}>
          {loading ? 'Creating Swap...' : '🚀 Swap to SOL Now'}
        </button>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        {swapDetails && (
          <div className="output" style={{ backgroundColor: 'rgba(20, 241, 149, 0.1)', border: '1px solid #14f195' }}>
            <h4 style={{ color: '#14f195', marginBottom: '1rem' }}>🎯 SOL Swap Created!</h4>
            <p><strong>📍 Deposit to:</strong> {swapDetails.payinAddress}</p>
            <p><strong>💰 Send exactly:</strong> {swapDetails.amountExpectedFrom} {from.toUpperCase()}</p>
            {swapDetails.payinExtraId && <p><strong>🏷️ Extra ID:</strong> {swapDetails.payinExtraId}</p>}
            <p><strong>📊 Track Status:</strong> <a href={swapDetails.trackUrl} target="_blank" rel="noreferrer" style={{ color: '#14f195' }}>View Swap Progress</a></p>
            <p style={{ marginTop: '1rem', fontStyle: 'italic', color: '#9945ff' }}>
              🎰 Once confirmed, your SOL will be ready for casino gaming!
            </p>
          </div>
        )}
      </Content>
    </Container>
  )
}

export default ExchangePage