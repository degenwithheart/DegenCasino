import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

// This hook returns a handler for connecting the wallet, to be used in components
export function useHandleWalletConnect() {
  const wallet = useWallet();
  const walletModal = useWalletModal();
  return () => {
    try {
      if (wallet.wallet) {
        wallet.connect();
      } else {
        walletModal.setVisible(true);
      }
    } catch (e) {
      console.error(e);
    }
  };
}
