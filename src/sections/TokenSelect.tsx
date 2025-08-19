import React from 'react'
import { FeesTab } from '../components/FeesTab'
import { PublicKey } from '@solana/web3.js'
import {
  FAKE_TOKEN_MINT,
  GambaPlatformContext,
  GambaUi,
  PoolToken,
  useCurrentToken,
  useTokenMeta,
  useTokenBalance,
} from 'gamba-react-ui-v2'
import styled from 'styled-components'
import { POOLS } from '../constants'

const GridContainer = styled.div<{ isSingleToken: boolean }>`
  display: grid;
  grid-template-columns: ${({ isSingleToken }) => (isSingleToken ? '1fr' : 'repeat(2, 1fr)')};
  gap: 16px;
  background: rgba(24, 24, 24, 0.8);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(255, 215, 0, 0.15);
  border: 1px solid #ffd700;
  padding: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 8px 2px;
    border-radius: 8px;
  }
`

const TokenCard = styled.button<{ selected?: boolean }>`
  width: 100%;
  background: ${({ selected }) => (selected ? 'rgba(255, 215, 0, 0.2)' : 'rgba(24, 24, 24, 0.8)')};
  border: 1px solid ${({ selected }) => (selected ? '#ffd700' : 'rgba(255, 255, 255, 0.2)')};
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  color: #ffd700;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: background 0.3s, border-color 0.3s;

  @media (max-width: 600px) {
    padding: 8px 4px;
    border-radius: 8px;
    font-size: 0.98rem;
    gap: 6px;
  }

  &:hover {
    background: rgba(255, 215, 0, 0.15);
    border-color: #ffd700;
  }
`

const StyledTokenImage = styled.img`
  height: 48px;
  width: 48px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 6px #ffd700aa;

  @media (max-width: 600px) {
    height: 38px;
    width: 38px;
  }
`

const SectionHeading = styled.h2`
  color: #ffd700;
  margin: 24px 0 12px 8px;
  font-size: 1.2rem;
`

const ToggleContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`

const ToggleButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 12px 16px;
  background: ${({ active }) => (active ? '#ffd700' : 'rgba(24, 24, 24, 0.8)')};
  color: ${({ active }) => (active ? '#222' : '#ffd700')};
  border: 1px solid #ffd700;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  transition: background 0.3s, color 0.3s;

  &:hover {
    background: #ffd700cc;
    color: #222;
  }
`

function TokenImage({ mint, ...props }: { mint: PublicKey }) {
  const meta = useTokenMeta(mint)
  return <StyledTokenImage src={meta.image} alt="token" {...props} />
}

function TokenSelectItem({ mint }: { mint: PublicKey }) {
  const meta = useTokenMeta(mint)
  const balance = useTokenBalance(mint)

  const rawBalance = balance.balance ?? 0
  const decimals = meta.decimals ?? 9
  const tokenBalance = rawBalance / 10 ** decimals

  const formattedBalance = tokenBalance.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })

  // Only show USD value if usdPrice exists and is > 0, otherwise show "Free Play"
  const formattedUsdValue =
    meta.usdPrice && meta.usdPrice > 0
      ? `$${(tokenBalance * meta.usdPrice).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} USD`
      : null

  // Check if this is the free token (by mint)
  const isFreeToken = mint.equals(FAKE_TOKEN_MINT)

  if (isFreeToken) {
    // Visually appealing, casino-style free token card
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
          width: '100%',
          padding: '24px 32px',
          background: 'none',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              background: 'radial-gradient(circle, #ffd70055 0%, #181818 70%)',
              borderRadius: '50%',
              padding: 8,
              boxShadow: '0 0 32px 8px #ffd70088, 0 0 0 4px #181818',
              marginBottom: 2,
            }}
          >
            <img
              src={meta.image}
              alt="token"
              style={{
                height: 72,
                width: 72,
                borderRadius: '50%',
                objectFit: 'cover',
                boxShadow: '0 0 24px #ffd700cc',
                border: '2.5px solid #ffd700',
                background: '#181818',
                display: 'block',
              }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', width: '100%' }}>
          <div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 900, letterSpacing: 1.5, textShadow: '0 0 12px #ffd700, 0 0 24px #a259ff', textAlign: 'center', fontFamily: 'Luckiest Guy, cursive, sans-serif' }}>{meta.name}</div>
          <div style={{ fontSize: '1.15rem', color: '#ffd700', fontWeight: 800, display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center', textShadow: '0 0 8px #ffd70088' }}>
            <span>Balance:</span>
            <span style={{ color: '#ffd700', fontWeight: 900 }}>{formattedBalance} {meta.symbol}</span>
          </div>
          <div style={{ fontSize: '1.15rem', color: '#00ff88', fontWeight: 800, display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center', textShadow: '0 0 8px #00ff8899' }}>
            <span>Value:</span>
            <span style={{ color: '#00ff88', fontWeight: 900 }}>Free Play</span>
          </div>
        </div>
      </div>
    )
  }

  // Visually appealing, casino-style vertical card for live tokens (less tall)
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px', // reduced gap
        width: '100%',
        padding: '16px 0 12px 0', // reduced vertical padding
        background: 'none',
      }}
    >
      <div
        style={{
          background: 'radial-gradient(circle, #ffd70044 0%, #181818 70%)',
          borderRadius: '50%',
          padding: 6, // slightly smaller
          boxShadow: '0 0 24px 6px #ffd70066, 0 0 0 3px #181818',
          marginBottom: 0,
        }}
      >
        <img
          src={meta.image}
          alt="token"
          style={{
            height: 54,
            width: 54,
            borderRadius: '50%',
            objectFit: 'cover',
            boxShadow: '0 0 14px #ffd700cc',
            border: '2px solid #ffd700',
            background: '#181818',
            display: 'block',
          }}
        />
      </div>
      <div
        style={{
          textAlign: 'center',
          color: '#fff',
          fontSize: '1.1rem',
          fontWeight: 900,
          letterSpacing: 1.1,
          textShadow: '0 0 8px #ffd700, 0 0 14px #a259ff',
          fontFamily: 'Luckiest Guy, cursive, sans-serif',
        }}
      >
        {meta.name}
      </div>
      <div
        style={{
          textAlign: 'center',
          fontSize: '0.95rem',
          color: '#ffd700',
          fontWeight: 800,
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          justifyContent: 'center',
          textShadow: '0 0 6px #ffd70088',
        }}
      >
        <span>Balance:</span>
        <span style={{ color: '#ffd700', fontWeight: 900 }}>{formattedBalance} {meta.symbol}</span>
      </div>
      {formattedUsdValue !== null ? (
        <div
          style={{
            textAlign: 'center',
            fontSize: '0.95rem',
            color: '#a259ff',
            fontWeight: 800,
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            justifyContent: 'center',
            textShadow: '0 0 6px #a259ff99',
          }}
        >
          <span>Value:</span>
          <span style={{ color: '#a259ff', fontWeight: 900 }}>{formattedUsdValue}</span>
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            fontSize: '0.95rem',
            color: '#00ff88',
            fontWeight: 800,
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            justifyContent: 'center',
            textShadow: '0 0 6px #00ff8899',
          }}
        >
          <span>Value:</span>
          <span style={{ color: '#00ff88', fontWeight: 900 }}>Free Play</span>
        </div>
      )}
    </div>
  )
}

export default function TokenSelect({ setSelectedMint, selectedMint }: {
  setSelectedMint?: (mint: PublicKey) => void,
  selectedMint?: PublicKey,
}) {
  const context = React.useContext(GambaPlatformContext)
  const selectedToken = useCurrentToken()

  const [mode, setMode] = React.useState<'free' | 'live' | 'fees'>('live')

  // Priority fee state, persisted in localStorage
  const [priorityFee, setPriorityFee] = React.useState<number>(() => {
    const saved = localStorage.getItem('priorityFee')
    return saved ? Number(saved) : 400201
  })

  React.useEffect(() => {
    localStorage.setItem('priorityFee', String(priorityFee))
  }, [priorityFee])

  // Helper to get pools for each mode

  const getPools = (mode: 'free' | 'live' | 'fees') =>
    mode === 'free'
      ? POOLS.filter((p) => p.token.equals(FAKE_TOKEN_MINT))
      : mode === 'live'
        ? POOLS.filter((p) => !p.token.equals(FAKE_TOKEN_MINT))
        : []

  const tokensToShow = getPools(mode)
  const isSingleToken = tokensToShow.length === 1

  // When switching mode, update selectedMint to first token in that mode

  const handleModeChange = (newMode: 'free' | 'live' | 'fees') => {
    setMode(newMode)
    if (newMode === 'fees') return
    const pools = getPools(newMode)
    if (setSelectedMint && pools.length > 0) {
      setSelectedMint(pools[0].token)
    }
  }

  const selectPool = (pool: PoolToken) => {
    context.setPool(pool.token, pool.authority)
    if (setSelectedMint) {
      setSelectedMint(pool.token)
    }
  }

  return (
    <>
      <ToggleContainer>
        <ToggleButton active={mode === 'free'} onClick={() => handleModeChange('free')}>
          Free Play
        </ToggleButton>
        <ToggleButton active={mode === 'live'} onClick={() => handleModeChange('live')}>
          Live Play
        </ToggleButton>
        <ToggleButton active={mode === 'fees'} onClick={() => handleModeChange('fees')}>
          Fees
        </ToggleButton>
      </ToggleContainer>

      {mode === 'fees' ? (
        <div>
          <SectionHeading>Transaction Fees</SectionHeading>
          <div style={{ margin: '16px 0' }}>
            <FeesTab value={priorityFee} onChange={setPriorityFee} />
          </div>
        </div>
      ) : (
        <>
          <SectionHeading>{mode === 'free' ? 'Free Play Tokens' : 'Live Play Tokens'}</SectionHeading>
          <GridContainer isSingleToken={isSingleToken}>
            {tokensToShow.map((pool, i) => (
              <TokenCard
                key={i}
                onClick={() => selectPool(pool)}
                selected={selectedMint ? selectedMint.equals(pool.token) : selectedToken?.mint.equals(pool.token)}
                aria-label={`Select token ${pool.token.toBase58()}`}
              >
                <TokenSelectItem mint={pool.token} />
              </TokenCard>
            ))}
          </GridContainer>
        </>
      )}
    </>
  )
}
