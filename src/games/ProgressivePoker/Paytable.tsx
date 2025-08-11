

import React from 'react'
import { JACKS_OR_BETTER_BET_ARRAY } from './betArray'

const HANDS = [
  { label: 'Jackpot (Royal Flush)', payout: JACKS_OR_BETTER_BET_ARRAY[9], type: 'Jackpot' },
  { label: 'Four of a Kind', payout: JACKS_OR_BETTER_BET_ARRAY[6], type: 'Four of a Kind' },
  { label: 'Full House', payout: JACKS_OR_BETTER_BET_ARRAY[5], type: 'Full House' },
  { label: 'Straight', payout: JACKS_OR_BETTER_BET_ARRAY[4], type: 'Straight' },
  { label: 'Three of a Kind', payout: JACKS_OR_BETTER_BET_ARRAY[3], type: 'Three of a Kind' },
  { label: 'Pair', payout: JACKS_OR_BETTER_BET_ARRAY[1], type: 'Pair' },
]

interface PaytableProps {
  currentHandType?: string
}

export const Paytable: React.FC<PaytableProps> = ({ currentHandType }) => (
  <div
    style={{
      background: 'rgba(24, 24, 42, 0.92)',
      borderRadius: 12,
      padding: '18px 18px 12px 18px',
      boxShadow: '0 1px 8px 0 #0003',
      color: '#ffe082',
      minWidth: 220,
      fontSize: 16,
      margin: '24px auto',
    }}
  >
    <h4 style={{ margin: '0 0 10px 0', fontWeight: 700, fontSize: 20, color: '#ffe082', letterSpacing: 1 }}>
      Paytable
    </h4>
    <table style={{ width: '100%', color: '#fff', fontSize: 16 }}>
      <tbody>
        {HANDS.map((hand, i) => {
          const isActive = currentHandType && hand.type === currentHandType
          return (
            <tr key={i}>
              <td style={{ padding: '4px 0', textAlign: 'left', color: isActive ? '#ffe082' : undefined }}>{hand.label}</td>
              <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: 700, color: isActive ? '#ffe082' : '#ffe082' }}>
                {hand.payout}x
              </td>
            </tr>
          )
        })}
        <tr>
          <td style={{ padding: '4px 0', textAlign: 'left', color: currentHandType === 'Bust' ? '#ff7f7f' : '#ff7f7f' }}>Bust / No Win</td>
          <td style={{ padding: '4px 0', textAlign: 'right', color: currentHandType === 'Bust' ? '#ff7f7f' : '#ff7f7f' }}>0x</td>
        </tr>
      </tbody>
    </table>
  </div>
)
