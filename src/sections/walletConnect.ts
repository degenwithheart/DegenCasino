import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

// This hook returns a handler for connecting the wallet, to be used in components
export function useHandleWalletConnect() {
  const wallet = useWallet();
  const walletModal = useWalletModal();
  return () => {
    try {
      if (wallet.wallet) {
        console.log('[Wallet] Attempting to connect:', wallet.wallet.adapter?.name);
        wallet.connect()
          .then(() => {
            console.log('[Wallet] Connected successfully:', wallet.publicKey?.toBase58());
          })
          .catch((err) => {
            console.error('[Wallet] Connection failed:', err);
          });
      } else {
        console.log('[Wallet] No wallet selected, opening wallet modal.');
        walletModal.setVisible(true);
      }
    } catch (e) {
      console.error('[Wallet] Unexpected error during connect:', e);
    }
  };
}
