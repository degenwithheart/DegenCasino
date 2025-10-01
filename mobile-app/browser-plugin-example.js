// browser-plugin-example.js
// Example of using Capacitor Browser plugin for fullscreen native navigation in DegenCasino

import { Browser } from '@capacitor/browser';

// DegenCasino Browser Plugin Integration
class DegenCasinoBrowserPlugin {
  
  // Open external links in fullscreen native WebView
  static async openExternalLink(url) {
    await Browser.open({
      url: url,
      presentationStyle: 'fullscreen',
      showTitle: false,
      toolbarColor: '#000000', // DegenCasino brand color
      windowName: '_system'
    });
  }

  // Open Solana transaction explorer
  static async openSolanaTransaction(signature) {
    const explorerUrl = `https://solscan.io/tx/${signature}`;
    await this.openExternalLink(explorerUrl);
  }

  // Open wallet download page
  static async openWalletDownload(wallet = 'phantom') {
    const walletUrls = {
      phantom: 'https://phantom.app/',
      solflare: 'https://solflare.com/',
      backpack: 'https://backpack.app/'
    };
    
    await this.openExternalLink(walletUrls[wallet] || walletUrls.phantom);
  }

  // Open game rules or help
  static async openGameRules(gameId) {
    const rulesUrl = `https://degenheart.casino/rules/${gameId}`;
    await this.openExternalLink(rulesUrl);
  }

  // Close any open browser windows
  static async closeBrowser() {
    await Browser.close();
  }

  // Listen for browser events
  static addBrowserListener() {
    Browser.addListener('browserFinished', () => {
      console.log('Browser window closed');
      // Optional: Refresh wallet connection or game state
    });

    Browser.addListener('browserPageLoaded', () => {
      console.log('Browser page loaded');
    });
  }

  // Remove browser listeners
  static removeBrowserListeners() {
    Browser.removeAllListeners();
  }
}

// Usage in DegenCasino React components
export const useBrowserPlugin = () => {
  
  // Open transaction in explorer
  const openTransaction = (signature) => {
    DegenCasinoBrowserPlugin.openSolanaTransaction(signature);
  };

  // Open wallet download
  const openWallet = (walletName) => {
    DegenCasinoBrowserPlugin.openWalletDownload(walletName);
  };

  // Open external link
  const openExternal = (url) => {
    DegenCasinoBrowserPlugin.openExternalLink(url);
  };

  return {
    openTransaction,
    openWallet,
    openExternal,
    closeBrowser: DegenCasinoBrowserPlugin.closeBrowser
  };
};

// Example React component usage
/*
import { useBrowserPlugin } from './browser-plugin-example';

function TransactionResult({ signature }) {
  const { openTransaction } = useBrowserPlugin();

  return (
    <button onClick={() => openTransaction(signature)}>
      View on Explorer
    </button>
  );
}

function WalletConnectButton() {
  const { openWallet } = useBrowserPlugin();

  return (
    <button onClick={() => openWallet('phantom')}>
      Download Phantom Wallet
    </button>
  );
}
*/

export default DegenCasinoBrowserPlugin;