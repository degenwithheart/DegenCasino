import React, { createContext, useContext, useEffect, useState } from 'react';
import { useBrowser } from '../hooks/mobile/useBrowser';

interface MobileBrowserContextType {
  isNativePlatform: boolean;
  isMobile: boolean;
  openTransaction: (signature: string, cluster?: 'mainnet-beta' | 'devnet') => Promise<void>;
  openWalletDownload: (wallet: 'phantom' | 'solflare' | 'backpack' | 'coinbase') => Promise<void>;
  openExternal: (url: string, title?: string) => Promise<void>;
  openGameHelp: (gameId?: string) => Promise<void>;
  closeBrowser: () => Promise<void>;
}

const MobileBrowserContext = createContext<MobileBrowserContextType | undefined>(undefined);

interface MobileBrowserProviderProps {
  children: React.ReactNode;
}

/**
 * MobileBrowserProvider - Integrates with DegenCasino's provider hierarchy
 * Place this after GambaProvider and before App component
 */
export const MobileBrowserProvider: React.FC<MobileBrowserProviderProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const browser = useBrowser();

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsMobile(mobileRegex.test(userAgent) || window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Log platform info for debugging
  useEffect(() => {
    console.log('DegenCasino Mobile Browser Provider initialized:', {
      isNativePlatform: browser.isNativePlatform,
      isMobile,
      platform: 'web',
      isCapacitor: false
    });
  }, [browser.isNativePlatform, isMobile]);

  const contextValue: MobileBrowserContextType = {
    isNativePlatform: browser.isNativePlatform,
    isMobile,
    openTransaction: browser.openTransaction,
    openWalletDownload: browser.openWalletDownload,
    openExternal: browser.openExternal,
    openGameHelp: browser.openGameHelp,
    closeBrowser: browser.closeBrowser
  };

  return (
    <MobileBrowserContext.Provider value={contextValue}>
      {children}
    </MobileBrowserContext.Provider>
  );
};

/**
 * Hook to use the mobile browser context
 * Provides access to browser functionality throughout the app
 */
export const useMobileBrowser = (): MobileBrowserContextType => {
  const context = useContext(MobileBrowserContext);
  if (context === undefined) {
    throw new Error('useMobileBrowser must be used within a MobileBrowserProvider');
  }
  return context;
};

/**
 * HOC to inject mobile browser functionality into existing components
 */
export const withMobileBrowser = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return (props: P) => {
    const mobileBrowser = useMobileBrowser();
    return <Component {...props} mobileBrowser={mobileBrowser} />;
  };
};

export default MobileBrowserProvider;