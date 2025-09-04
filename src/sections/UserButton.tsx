import { SmartImage } from '../components/UI/SmartImage'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useHandleWalletConnect } from './walletConnect';
import { PublicKey } from '@solana/web3.js'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import * as S from './UserButton.styles'
import { Modal } from '../components'
import {
  POOLS,
  PLATFORM_ALLOW_REFERRER_REMOVAL,
  PLATFORM_REFERRAL_FEE,
} from '../constants'
import TokenSelect from './TokenSelect'
import { useIsCompact } from '../hooks/useIsCompact'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../hooks/useUserStore'
import { useToast } from '../hooks/useToast'
import { truncateString } from '../utils'
import {
  GambaUi,
  useTokenBalance,
  useCurrentToken,
  useTokenMeta,
  TokenValue,
  useReferral,
} from 'gamba-react-ui-v2'

  const TokenSelectionModal = () => {
    const user = useUserStore()
    const referral = useReferral()
    const toast = useToast()
    const walletModal = useWalletModal()
    const [removing, setRemoving] = useState(false)

    const [selectedMint, setSelectedMint] = useState<PublicKey>(POOLS[0].token)
    const selectedToken = POOLS.find((t) => t.token.equals(selectedMint))
    const isFreeToken = selectedMint && POOLS[0].token && selectedMint.equals(POOLS[0].token)

    return (
      <Modal onClose={() => user.set({ userModal: false, userModalInitialTab: undefined })}>
        <S.Container>
          <S.Header>Select a Token</S.Header>
          <TokenSelect 
            setSelectedMint={setSelectedMint} 
            selectedMint={selectedMint} 
            initialTab={user.userModalInitialTab}
          />
          {/* ✅ Invite section removed — now handled inside Invite tab */}
        </S.Container>
      </Modal>
    )
  }

const TokenIconAndBalance = () => {
  const selectedToken = useCurrentToken()
  const balance = useTokenBalance()
  const meta = useTokenMeta(selectedToken.mint)

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      padding: '0.25rem',
      backdropFilter: 'blur(10px)'
    }}>
      <SmartImage
        src={meta.image}
        alt="token-icon"
        style={{ 
          width: 24,
          height: 24,
          borderRadius: '50%', 
          boxShadow: '0 0 8px #ffd700aa',
          filter: 'drop-shadow(0 0 4px #ffd700)'
        }}
      />
      <TokenValue mint={selectedToken.mint} amount={balance.balance} />
    </div>
  )
}


export function UserButton() {
  const walletModal = useWalletModal()
  const wallet = useWallet()
  const user = useUserStore()
  const handleWalletConnect = useHandleWalletConnect();
  const { mobile } = useIsCompact()
  const navigate = useNavigate()



  return (
    <>
      {wallet.connected && user.userModal &&
        ReactDOM.createPortal(<TokenSelectionModal />, document.body)
      }

      {wallet.connected ? (
        <S.WalletButtonWrapper>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <GambaUi.Button onClick={() => (mobile ? navigate('/select-token') : user.set({ userModal: true }))}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TokenIconAndBalance />
              </div>
            </GambaUi.Button>
          </div>
        </S.WalletButtonWrapper>
      ) : (
        <GambaUi.Button onClick={handleWalletConnect}>
          {wallet.connecting ? 'Connecting...' : 'Connect'}
        </GambaUi.Button>
      )}
    </>
  )
}
