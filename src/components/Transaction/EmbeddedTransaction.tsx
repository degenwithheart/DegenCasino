import React from 'react'
import { Connection } from '@solana/web3.js'
import styled, { css } from 'styled-components'
import { GambaTransaction } from 'gamba-core-v2'
import { useColorScheme } from '../../themes/ColorSchemeContext'
import { RPC_ENDPOINT } from '../../constants'
import { useNetwork } from '../../contexts/NetworkContext'

/**
 * Embedded Transaction Component for displaying transaction details inline
 */

const StyledOutcome = styled.div<{$rank: number, $active: boolean, $colorScheme?: any}>`
  background-color: ${({ $colorScheme }) => $colorScheme?.colors?.surface || 'var(--slate-2)'};

  padding: 5px 10px;
  min-width: 2em;
  text-align: center;
  position: relative;
  border-radius: max(var(--radius-1), var(--radius-full));
  overflow: hidden;

  &:before {
    content: '';
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    position: absolute;
    opacity: .05;
  }

  ${props => props.$active && css`
    box-shadow: 0 0 0 1px currentColor;
    &:before {
      opacity: .15;
    }
  `}

  ${props => {
    const rankColors = [
      props.$colorScheme?.colors?.error || '#ff293b',
      props.$colorScheme?.colors?.warning || '#ff7142', 
      props.$colorScheme?.colors?.warning || '#ffa557',
      props.$colorScheme?.colors?.warning || '#ffa557',
      props.$colorScheme?.colors?.primary || '#ffd166',
      props.$colorScheme?.colors?.primary || '#fff875',
      props.$colorScheme?.colors?.success || '#e1ff80',
      props.$colorScheme?.colors?.success || '#60ff9b'
    ];
    return css`
      color: ${rankColors[props.$rank] || props.$colorScheme?.colors?.text || '#666'};
      &:before {
        background-color: ${rankColors[props.$rank] || props.$colorScheme?.colors?.text || '#666'};
      }
    `;
  }}
`

function Outcomes({bet, resultIndex, colorScheme}: {bet: number[], resultIndex: number, colorScheme?: any}) {
  const uniqueOutcomes = Array.from(new Set(bet)).sort((a, b) => a > b ? 1 : -1)
  return (
    <div style={{display: 'flex', gap: '2px', flexWrap: 'wrap'}}>
      {bet.map((multiplier, index) => {
        const rank = uniqueOutcomes.indexOf(multiplier)
        const isWinning = index === resultIndex
        return (
          <StyledOutcome
            key={index}
            $rank={rank}
            $active={isWinning}
            $colorScheme={colorScheme}
          >
            {multiplier}x
          </StyledOutcome>
        )
      })}
    </div>
  )
}

function VerificationSection({ parsed, colorScheme }: { parsed: GambaTransaction<"GameSettled">; colorScheme?: any }) {
  const data = parsed.data
  
  return (
    <div style={{fontSize: '12px', color: colorScheme?.colors?.textSecondary || '#666'}}>
      <span>Verified</span>
    </div>
  )
}

function TransactionDetails({ parsed, colorScheme }: {parsed: GambaTransaction<"GameSettled">; colorScheme?: any}) {
  const data = parsed.data

  return (
    <div style={{padding: '10px', border: `1px solid ${colorScheme?.colors?.border || '#333'}`, borderRadius: '8px', fontSize: '14px'}}>
      <div style={{marginBottom: '8px'}}>
        <strong>Player:</strong> {data.user.toString().slice(0, 8)}...
      </div>
      <div style={{marginBottom: '8px'}}>
        <strong>Wager:</strong> {data.wager.toString()}
      </div>
      <div style={{marginBottom: '8px'}}>
        <strong>Payout:</strong> {data.payout.toString()}
      </div>
      <div>
        <Outcomes bet={data.bet} resultIndex={data.resultIndex} colorScheme={colorScheme} />
      </div>
      <VerificationSection parsed={parsed} colorScheme={colorScheme} />
    </div>
  )
}

async function fetchGambaTransaction(connection: Connection, txId: string) {
  try {
    const response = await fetch(`https://api.gamba.so/transaction/${txId}`)
    if (!response.ok) throw new Error('Transaction not found')
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch transaction:', error)
    return null
  }
}

interface EmbeddedTransactionProps {
  txId: string
  onLoad?: (transaction: GambaTransaction<"GameSettled"> | null) => void
}

export default function EmbeddedTransactionView({ txId, onLoad }: EmbeddedTransactionProps) {
  const [transaction, setTransaction] = React.useState<GambaTransaction<"GameSettled"> | null>(null)
  const [loading, setLoading] = React.useState(true)
  const { currentColorScheme } = useColorScheme()
  const { connection } = useNetwork()

  React.useEffect(() => {
    if (txId) {
      fetchGambaTransaction(connection, txId)
        .then(result => {
          setTransaction(result)
          onLoad?.(result)
        })
        .finally(() => setLoading(false))
    }
  }, [txId, onLoad])

  if (loading) {
    return <div style={{padding: '10px'}}>Loading...</div>
  }

  if (!transaction) {
    return <div style={{padding: '10px', color: currentColorScheme?.colors?.textSecondary || '#666'}}>Transaction not found</div>
  }

  return <TransactionDetails parsed={transaction} colorScheme={currentColorScheme} />
}
