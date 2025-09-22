import React, { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { useColorScheme } from '../../themes/ColorSchemeContext'
import { usePageSEO } from '../../hooks/ui/useGameSEO'
import { PLATFORM_CREATOR_ADDRESS, RPC_ENDPOINT } from '../../constants'
import { useNetwork } from '../../contexts/NetworkContext'
import {
  UnifiedPageContainer,
  UnifiedPageTitle,
  UnifiedSubtitle,
  UnifiedSection,
  UnifiedSectionTitle,
  UnifiedContent,
  UnifiedGrid,
  UnifiedButton,
  UnifiedHighlightSection
} from '../../components/UI/UnifiedDesign'
import {
  Header,
  WalletSection,
  PaymentTokenSection,
  AmountSection,
  QuickAmountButton,
  ReceiveSection,
  StatusMessage
} from './DGHRTPresale.styles'

/**
 * DGHRT Presale Page with Blockchain Tracking
 * 
 * This component provides real-time blockchain tracking of:
 * 1. SOL presale progress by monitoring creator wallet balance
 * 2. Token supply, sales, and remaining tokens via SPL token mint
 * 3. Real-time updates every 30 seconds
 * 
 * Features:
 * - Tracks total token supply from mint
 * - Monitors creator's remaining token balance
 * - Calculates tokens sold (total - remaining)
 * - Shows token mint status (minted vs not minted)
 * - SOL presale progress tracking
 * 
 * When ready to go live:
 * 1. Set DGHRT_MINT_ADDRESS to actual token mint address
 * 2. Set PRESALE_START_BALANCE to current wallet SOL balance
 * 3. Uncomment SOL transfer code in handlePurchase()
 * 4. Page will show real-time supply and sales data
 */
const DGHRTPresalePage: React.FC = () => {
  // SEO for DGHRT Presale page
  const seoHelmet = usePageSEO(
    "DGHRT Presale", 
    "Participate in the DGHRT Token presale! Get early access to our native casino token with exclusive pricing and bonuses"
  )

  const [visible, setVisible] = useState(false)
  const [solAmount, setSolAmount] = useState('')
  const [dghrtAmount, setDghrtAmount] = useState(0)
  const [presaleRaised, setPresaleRaised] = useState(0)
  const [tokenSupply, setTokenSupply] = useState({
    total: 0,
    remaining: 0,
    sold: 0
  })
  const [tokenMintAddress, setTokenMintAddress] = useState<PublicKey | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info'
    message: string
  } | null>(null)

  const { connected, publicKey, connect } = useWallet()
  const { setVisible: setWalletModalVisible } = useWalletModal()
  const { currentColorScheme } = useColorScheme()
  const { connection } = useNetwork()

  // Presale configuration
  const DGHRT_PRICE_PER_SOL = 1000000 // 1,000,000 DGHRT per 1 SOL
  const MIN_SOL_AMOUNT = 0.1
  const MAX_SOL_AMOUNT = 10
  const PRESALE_GOAL = 1000 // SOL
  const PRESALE_START_BALANCE = 0 // Initial SOL balance to subtract from current balance
  
  // DGHRT Token mint address - will be set when token is minted
  // For now using FAKE_TOKEN_MINT from constants as placeholder
  const DGHRT_MINT_ADDRESS = 'DGHRTMintAddressWillBeSetWhenMinted' // Replace with actual mint address

  // Function to fetch token supply data from blockchain
  const fetchTokenSupply = async () => {
    try {
      
      // Try to fetch token mint info if address is valid
      if (DGHRT_MINT_ADDRESS !== 'DGHRTMintAddressWillBeSetWhenMinted') {
        try {
          const mintAddress = new PublicKey(DGHRT_MINT_ADDRESS)
          const mintInfo = await connection.getTokenSupply(mintAddress)
          
          if (mintInfo && mintInfo.value) {
            const totalSupply = mintInfo.value.uiAmount || 0
            
            // Get creator's token balance (remaining tokens)
            const creatorTokenAccount = await connection.getTokenAccountsByOwner(
              PLATFORM_CREATOR_ADDRESS,
              { mint: mintAddress }
            )
            
            let remaining = 0
            if (creatorTokenAccount.value.length > 0) {
              const accountInfo = await connection.getTokenAccountBalance(
                creatorTokenAccount.value[0].pubkey
              )
              remaining = accountInfo.value.uiAmount || 0
            }
            
            const sold = totalSupply - remaining
            
            setTokenSupply({
              total: totalSupply,
              remaining: remaining,
              sold: sold
            })
            setTokenMintAddress(mintAddress)
          }
        } catch (mintError) {
          console.log('Token not yet minted or invalid address')
          setTokenSupply({ total: 0, remaining: 0, sold: 0 })
          setTokenMintAddress(null)
        }
      } else {
        // Token not yet minted
        setTokenSupply({ total: 0, remaining: 0, sold: 0 })
        setTokenMintAddress(null)
      }
      
    } catch (error) {
      console.error('Failed to fetch token supply:', error)
      setTokenSupply({ total: 0, remaining: 0, sold: 0 })
    }
  }

  // Function to fetch creator wallet balance and calculate presale raised
  const fetchPresaleProgress = async () => {
    try {
      const balance = await connection.getBalance(PLATFORM_CREATOR_ADDRESS)
      const solBalance = balance / LAMPORTS_PER_SOL
      
      // Calculate presale raised (current balance minus starting balance)
      const raised = Math.max(0, solBalance - PRESALE_START_BALANCE)
      setPresaleRaised(raised)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch presale progress:', error)
      setPresaleRaised(0)
      setLoading(false)
    }
  }

  // Combined function to fetch all data
  const fetchAllData = async () => {
    await Promise.all([
      fetchPresaleProgress(),
      fetchTokenSupply()
    ])
  }

  useEffect(() => {
    setVisible(true)
    fetchAllData()
    
    // Refresh all data every 30 seconds
    const interval = setInterval(fetchAllData, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Calculate DGHRT amount based on SOL input
    const sol = parseFloat(solAmount) || 0
    setDghrtAmount(sol * DGHRT_PRICE_PER_SOL)
  }, [solAmount])

  const handleQuickAmount = (amount: number) => {
    setSolAmount(amount.toString())
  }

  const handlePurchase = async () => {
    if (!connected) {
      setWalletModalVisible(true)
      return
    }

    const sol = parseFloat(solAmount)
    
    if (!sol || sol < MIN_SOL_AMOUNT) {
      setStatusMessage({
        type: 'error',
        message: `Minimum purchase is ${MIN_SOL_AMOUNT} SOL`
      })
      return
    }

    if (sol > MAX_SOL_AMOUNT) {
      setStatusMessage({
        type: 'error',
        message: `Maximum purchase is ${MAX_SOL_AMOUNT} SOL`
      })
      return
    }

    setStatusMessage({
      type: 'info',
      message: 'Processing purchase...'
    })

    try {
      // TODO: Implement actual SOL transfer when ready to go live
      /*
      // connection is already available from useNetwork() hook
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey!,
          toPubkey: PLATFORM_CREATOR_ADDRESS,
          lamports: sol * LAMPORTS_PER_SOL,
        })
      )
      
      const signature = await sendTransaction(transaction, connection)
      await connection.confirmTransaction(signature)
      
      // Refresh all data after successful purchase
      await fetchAllData()
      */
      
      // For now, just show a success message after a delay
      setTimeout(() => {
        setStatusMessage({
          type: 'success',
          message: `Ready to purchase ${dghrtAmount.toLocaleString()} DGHRT tokens for ${sol} SOL! (Enable actual transfers when token is minted)`
        })
        setSolAmount('') // Clear the input
      }, 1500)
      
    } catch (error) {
      console.error('Purchase failed:', error)
      setStatusMessage({
        type: 'error',
        message: 'Purchase failed. Please try again.'
      })
    }
  }

  const progressPercentage = (presaleRaised / PRESALE_GOAL) * 100

  return (
    <>
      {seoHelmet}
      <UnifiedPageContainer $colorScheme={currentColorScheme}>
        <UnifiedPageTitle $colorScheme={currentColorScheme}>💎 $DGHRT Presale 💎</UnifiedPageTitle>
        <UnifiedSubtitle $colorScheme={currentColorScheme}>
          Get your Heart Tokens before public launch
        </UnifiedSubtitle>

        <UnifiedSection $colorScheme={currentColorScheme}>
          <Header>
            <img 
              src="/png/images/$DGHRT.png" 
              alt="DGHRT Token" 
              className="logo"
              style={{
                width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '3px solid #ffd700',
              marginBottom: '2rem'
            }}
            onError={(e) => {
              // Fallback if image doesn't exist
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiByeD0iNjAiIGZpbGw9InVybCgjZ3JhZGllbnQwX2xpbmVhcl8xXzEpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MF9saW5lYXJfMV8xIiB4MT0iMCIgeTE9IjAiIHgyPSIxMjAiIHkyPSIxMjAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI2Q0YTU3NCIvPgo8c3RvcCBvZmZzZXQ9IjAuNSIgc3RvcC1jb2xvcj0iI2I4MzY2YSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNkNGE1NzQiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8dGV4dCB4PSI2MCIgeT0iNzAiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5KOPC90ZXh0Pgo8L3N2Zz4K'
            }}
          />
          </Header>

          <WalletSection>
            <label>Select Wallet</label>
            {connected ? (
              <div style={{ 
                padding: '1rem', 
                background: 'rgba(34, 197, 94, 0.1)', 
                borderRadius: '12px',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                color: '#22c55e'
              }}>
                ✅ Wallet Connected: {publicKey?.toBase58().slice(0, 8)}...
              </div>
            ) : (
              <UnifiedButton 
                $colorScheme={currentColorScheme}
                onClick={() => setWalletModalVisible(true)}
                style={{ width: '100%' }}
              >
                Connect Wallet
              </UnifiedButton>
            )}
          </WalletSection>

          <PaymentTokenSection>
            <label>Select payment token</label>
            <div className="token-info">
              <img 
                src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png" 
                alt="Solana" 
              />
              <span className="token-name">Solana</span>
            </div>
            <div className="token-note">
              At the moment, payments are only available with Solana (SOL)
            </div>
          </PaymentTokenSection>

          <AmountSection>
            <label>Amount</label>
            <div className="amount-input-container">
              <input
                type="number"
                value={solAmount}
                onChange={(e) => setSolAmount(e.target.value)}
                placeholder="0.0"
                min={MIN_SOL_AMOUNT}
                max={MAX_SOL_AMOUNT}
                step="0.1"
              />
              <img 
                src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png" 
                alt="SOL" 
                style={{ width: '24px', height: '24px' }}
              />
              <span className="token-symbol">SOL</span>
            </div>
            
            <div className="quick-amounts">
              <QuickAmountButton onClick={() => handleQuickAmount(0.1)}>
                +0.1 SOL
              </QuickAmountButton>
              <QuickAmountButton onClick={() => handleQuickAmount(0.5)}>
                +0.5 SOL
              </QuickAmountButton>
              <QuickAmountButton onClick={() => handleQuickAmount(1)}>
                +1 SOL
              </QuickAmountButton>
              <QuickAmountButton onClick={() => handleQuickAmount(10)}>
                +10 SOL
              </QuickAmountButton>
            </div>
          </AmountSection>

          <ReceiveSection>
            <label>You will receive</label>
            <div className="receive-amount">
              {dghrtAmount.toLocaleString()} DGHRT
            </div>
          </ReceiveSection>

          <UnifiedButton 
            $colorScheme={currentColorScheme}
            onClick={handlePurchase}
            disabled={!solAmount || parseFloat(solAmount) < MIN_SOL_AMOUNT}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {connected ? 'Purchase DGHRT' : 'Connect Wallet'}
          </UnifiedButton>

          {statusMessage && (
            <StatusMessage type={statusMessage.type}>
              {statusMessage.message}
            </StatusMessage>
          )}
        </UnifiedSection>

        <UnifiedSection $colorScheme={currentColorScheme}>
          <UnifiedSectionTitle $colorScheme={currentColorScheme}>🚀 Presale Information</UnifiedSectionTitle>
          <UnifiedContent $colorScheme={currentColorScheme}>
            <UnifiedHighlightSection $colorScheme={currentColorScheme}>
              <UnifiedGrid>
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ color: '#ffd700', marginBottom: '0.5rem' }}>Total Supply</h4>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {loading ? 'Loading...' : tokenSupply.total > 0 ? tokenSupply.total.toLocaleString() : '0'} DGHRT
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ color: '#ffd700', marginBottom: '0.5rem' }}>Tokens Sold</h4>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {loading ? 'Loading...' : tokenSupply.sold.toLocaleString()} DGHRT
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ color: '#ffd700', marginBottom: '0.5rem' }}>SOL Raised</h4>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {loading ? 'Loading...' : `${presaleRaised.toFixed(2)}/${PRESALE_GOAL}`}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    {progressPercentage.toFixed(1)}% Complete
                  </div>
                </div>
              </UnifiedGrid>
            </UnifiedHighlightSection>
            
            <UnifiedGrid>
              <div>
                <h4 style={{ color: '#ffd700', marginBottom: '0.5rem' }}>Price per SOL</h4>
                <p>{DGHRT_PRICE_PER_SOL.toLocaleString()} DGHRT</p>
              </div>
              
              <div>
                <h4 style={{ color: '#ffd700', marginBottom: '0.5rem' }}>Min/Max Purchase</h4>
                <p>{MIN_SOL_AMOUNT} - {MAX_SOL_AMOUNT} SOL</p>
              </div>
              
              <div>
                <h4 style={{ color: '#ffd700', marginBottom: '0.5rem' }}>Token Status</h4>
                <p>
                  {tokenMintAddress ? (
                    <span style={{ color: '#22c55e' }}>✅ Minted</span>
                  ) : (
                    <span style={{ color: '#f59e0b' }}>🔜 Not Yet Minted</span>
                  )}
                </p>
              </div>
              
              <div>
                <h4 style={{ color: '#ffd700', marginBottom: '0.5rem' }}>Network</h4>
                <p>Solana (SPL Token)</p>
              </div>
            </UnifiedGrid>
            
            <div style={{ 
              marginTop: '2rem', 
              textAlign: 'center', 
              fontSize: '0.9rem', 
              opacity: 0.8,
              fontStyle: 'italic'
            }}>
              Remember: DYOR. NFA. This is not financial advice.<br/>
              Presale will begin when $DGHRT token is officially minted.
            </div>
          </UnifiedContent>
        </UnifiedSection>
      </UnifiedPageContainer>
    </>
  )
}

export default DGHRTPresalePage
