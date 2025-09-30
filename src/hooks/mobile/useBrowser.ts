import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { useWalletToast } from '../../utils/wallet/solanaWalletToast';
import { useNetwork } from '../../contexts/NetworkContext';

/**
 * DegenCasino Browser Hook
 * Provides fullscreen native browser functionality for mobile apps
 * Integrates with Solana transactions, wallet connections, and external links
 * Uses existing DegenCasino wallet toast system and network configuration
 */
export const useBrowser = () => {
  const [isNativePlatform, setIsNativePlatform] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { showWalletToast } = useWalletToast();
  const { network: currentNetwork } = useNetwork();

  useEffect(() => {
    const checkNativePlatform = () => {
      const isNative = Capacitor.isNativePlatform();
      setIsNativePlatform(isNative);
      
      // Additional checks for Capacitor environment
      if (isNative || window.location.protocol === 'capacitor:' || window.location.hostname === 'localhost') {
        console.log('🎰 DegenCasino Mobile Browser initialized - Native Platform Detected');
        console.log('Platform details:', {
          isNativePlatform: isNative,
          protocol: window.location.protocol,
          hostname: window.location.hostname,
          userAgent: navigator.userAgent.includes('Capacitor')
        });
      }
      
      return isNative;
    };
    
    checkNativePlatform();
    
    if (Capacitor.isNativePlatform()) {
      
      // Listen for browser events
      let finishedListener: any;
      let pageLoadedListener: any;
      
      const setupListeners = async () => {
        finishedListener = await Browser.addListener('browserFinished', () => {
          setIsOpen(false);
          console.log('🌐 Browser closed - returning to DegenCasino');
        });

        pageLoadedListener = await Browser.addListener('browserPageLoaded', () => {
          console.log('🌐 External page loaded in native browser');
        });
      };
      
      setupListeners();

      return () => {
        if (finishedListener) finishedListener.remove();
        if (pageLoadedListener) pageLoadedListener.remove();
      };
    }
  }, []);

  /**
   * Open URL in fullscreen native browser with DegenCasino styling
   */
  const openUrl = async (url: string, options?: {
    title?: string;
    showTitle?: boolean;
    toolbarColor?: string;
    presentationStyle?: 'fullscreen' | 'popover';
  }) => {
    if (!isNativePlatform) {
      // Fallback for web - open in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    try {
      setIsOpen(true);
      await Browser.open({
        url,
        presentationStyle: options?.presentationStyle || 'fullscreen',
        toolbarColor: options?.toolbarColor || '#000000' // DegenCasino black
      });
      
      // Show success toast using existing system
      showWalletToast('COPY_SUCCESS', {
        title: '🌐 Browser Opened',
        description: 'External page opened in native browser'
      });
    } catch (error) {
      console.error('Failed to open browser:', error);
      setIsOpen(false);
      
      // Show error using existing wallet toast system
      showWalletToast('NETWORK_ERROR', {
        title: '❌ Browser Error',
        description: 'Failed to open native browser. Opening in new tab.'
      });
      
      // Fallback to window.open
      window.open(url, '_blank');
    }
  };

  /**
   * Open Solana transaction in explorer (network-aware)
   */
  const openTransaction = async (signature: string, cluster?: 'mainnet-beta' | 'devnet') => {
    const network = cluster || currentNetwork;
    const baseUrl = 'https://solscan.io/tx/';
    
    const url = network === 'devnet' 
      ? `${baseUrl}${signature}?cluster=devnet`
      : `${baseUrl}${signature}`;
    
    console.log(`🔗 Opening transaction ${signature.slice(0, 8)}... on ${network}`);
    
    await openUrl(url, {
      title: 'Transaction Details',
      showTitle: false,
      toolbarColor: '#1a1a1a'
    });
  };

  /**
   * Open wallet download page
   */
  const openWalletDownload = async (wallet: 'phantom' | 'solflare' | 'backpack' | 'coinbase' = 'phantom') => {
    const walletUrls = {
      phantom: 'https://phantom.app/',
      solflare: 'https://solflare.com/',
      backpack: 'https://backpack.app/',
      coinbase: 'https://www.coinbase.com/wallet'
    };
    
    await openUrl(walletUrls[wallet], {
      title: `Download ${wallet.charAt(0).toUpperCase() + wallet.slice(1)}`,
      showTitle: false
    });
  };

  /**
   * Open DegenCasino game rules or help
   */
  const openGameHelp = async (gameId?: string) => {
    const baseUrl = 'https://degenheart.casino';
    const url = gameId ? `${baseUrl}/rules/${gameId}` : `${baseUrl}/help`;
    
    await openUrl(url, {
      title: 'Game Help',
      showTitle: true,
      toolbarColor: '#1a1a1a'
    });
  };

  /**
   * Open external casino/DeFi links
   */
  const openExternal = async (url: string, title?: string) => {
    await openUrl(url, {
      title: title || 'External Link',
      showTitle: Boolean(title)
    });
  };

  /**
   * Close the browser window
   */
  const closeBrowser = async () => {
    if (isNativePlatform && isOpen) {
      try {
        await Browser.close();
        setIsOpen(false);
      } catch (error) {
        console.error('Failed to close browser:', error);
      }
    }
  };

  return {
    // State
    isNativePlatform,
    isOpen,
    
    // Methods
    openUrl,
    openTransaction,
    openWalletDownload,
    openGameHelp,
    openExternal,
    closeBrowser
  };
};