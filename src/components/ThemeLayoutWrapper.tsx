import React, { Suspense, useMemo, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTheme } from '../themes/UnifiedThemeContext';
import { themeUsesCustomLayout, getThemeConfig } from '../themes/themeConfig';
import { Modal } from '../components';
import { ENABLE_TROLLBOX } from '../constants';
import Header from '../sections/Header';
import Footer from '../sections/Footer';
import { Sidebar, TrollBox } from '../components';
import Toasts from '../sections/Toasts';
import DevnetWarning from '../components/Network/DevnetWarning';
import styled from 'styled-components';

const SIDEBAR_WIDTH = 80;

const MainContent = styled.main`
  /* Mobile-first approach with dynamic viewport height */
  min-height: calc(100vh - 120px);
  min-height: calc(100dvh - 120px);
  padding-top: 1rem;
  padding-left: ${SIDEBAR_WIDTH}px;
  padding-right: 0;
  padding-bottom: 80px;
  transition: padding 0.3s ease;
  
  /* Mobile devices - no sidebar, adjusted padding */
  @media (max-width: 900px) {
    padding-left: 0;
    padding-bottom: 60px;
    min-height: calc(100vh - 100px);
    min-height: calc(100dvh - 100px);
  }
  
  /* Small mobile devices - even less padding */
  @media (max-width: 700px) {
    padding-left: 0;
    padding-bottom: 60px;
    padding-top: 0.5rem;
    min-height: calc(100vh - 80px);
    min-height: calc(100dvh - 80px);
  }
  
  /* Very small mobile devices */
  @media (max-width: 479px) {
    padding-bottom: 50px;
    padding-top: 0.25rem;
    min-height: calc(100vh - 60px);
    min-height: calc(100dvh - 60px);
  }
`;

const LoadingSpinner = () => {
  const [showSlowLoading, setShowSlowLoading] = useState(false);
  const [showReturnHome, setShowReturnHome] = useState(false);

  // Show "Slow Loading" after 5 seconds
  useEffect(() => {
    const slowLoadingTimeout = setTimeout(() => {
      setShowSlowLoading(true); // Show "Slow Loading" message after 5 seconds
    }, 5000);

    const returnHomeTimeout = setTimeout(() => {
      setShowReturnHome(true); // Show "Return Home" button after 15 seconds
    }, 15000);

    return () => {
      clearTimeout(slowLoadingTimeout);
      clearTimeout(returnHomeTimeout);
    };
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'fixed', // Fix the loader on the screen
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark semi-transparent background
      zIndex: 1000, // Make sure it's on top
      backdropFilter: 'blur(10px)', // Blur the background
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column', // Stack logo and text vertically
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
      }}>
        <img src="/png/images/logo.png" alt="Logo" style={{
          width: '150px', // Adjust size for better balance
          height: '150px', // Adjust size for better balance
          borderRadius: '50%',
          animation: 'pulse 1.5s infinite ease-in-out', // Apply pulse animation to the logo
        }} />
        
        <div style={{
          marginTop: '20px', // Add space between the logo and text
          fontSize: '16px',
          fontWeight: '600',
          color: '#FF4081',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          opacity: 0.8, // Slightly transparent for elegance
          textShadow: '0 0 10px rgba(255, 64, 129, 0.7)', // Glow effect on the text
        }}>
          Loading<span className="dots">...</span>
        </div>

        {/* Show Slow Loading message after 5 seconds */}
        {showSlowLoading && (
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#FF4081',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            opacity: 0.8,
          }}>
            Slow Loading...
          </div>
        )}

        {/* Show Return Home button after 15 seconds */}
        {showReturnHome && (
          <div style={{
            position: 'absolute',
            bottom: '60px',
            right: '20px',
            backgroundColor: '#FF4081',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }} onClick={() => window.location.href = '/'}>
            Return Home
          </div>
        )}
      </div>
    </div>
  );
};

const styles = `
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes dotAnimation {
  0% {
    content: '.';
  }
  33% {
    content: '..';
  }
  66% {
    content: '...';
  }
  100% {
    content: '.';
  }
}

.dots {
  animation: dotAnimation 1.5s steps(4, end) infinite; /* Animate the dots */
}
`;

// Inject styles into the head
document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);

function WelcomeBanner() {
  // This component is currently empty in the original App.tsx
  // Keeping it as placeholder for future implementation
  return null;
}

interface ThemeLayoutWrapperProps {
  children: React.ReactNode;
  autoConnectAttempted: boolean;
}

export function ThemeLayoutWrapper({ children, autoConnectAttempted }: ThemeLayoutWrapperProps) {
  const { connected } = useWallet();
  const { currentLayoutTheme, resolveComponent } = useTheme();
  
  // Check if current theme uses custom layout
  const usesCustomLayout = themeUsesCustomLayout(currentLayoutTheme.id);
  const themeConfig = getThemeConfig(currentLayoutTheme.id);
  
  // Resolve theme-specific components or fall back to defaults
  const HeaderComponent = resolveComponent('components', 'Header') || Header;
  const FooterComponent = resolveComponent('components', 'Footer') || Footer;
  
  // Memoize the custom layout component to avoid re-creating it
  const CustomLayoutComponent = useMemo(() => {
    if (!usesCustomLayout || !themeConfig.layoutComponent) return null;
    return React.lazy(themeConfig.layoutComponent);
  }, [usesCustomLayout, themeConfig.layoutComponent]);

  // For themes with custom layouts (like DegenHeart)
  if (usesCustomLayout && CustomLayoutComponent) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <CustomLayoutComponent>
          <Toasts />
          <DevnetWarning />
          {children}
          {ENABLE_TROLLBOX && connected && <TrollBox />}
        </CustomLayoutComponent>
      </Suspense>
    );
  }

  // For default theme layout (header/sidebar/footer structure)
  return (
    <>
      <HeaderComponent />
      <Sidebar />
      <MainContent>
        <Toasts />
        <DevnetWarning />
        {/* Only show WelcomeBanner after auto-connect attempt */}
        {autoConnectAttempted && !connected && <WelcomeBanner />}
        <Suspense fallback={<LoadingSpinner />}>
          {children}
        </Suspense>
      </MainContent>
      <FooterComponent />
      {ENABLE_TROLLBOX && connected && <TrollBox />}
    </>
  );
}

/**
 * Hook to get the appropriate Modal component for the current theme
 */
export function useThemeModal() {
  const { currentLayoutTheme } = useTheme();
  const themeConfig = getThemeConfig(currentLayoutTheme.id);
  
  return useMemo(() => {
    if (themeConfig.modalComponent) {
      return React.lazy(themeConfig.modalComponent);
    }
    return Modal;
  }, [themeConfig.modalComponent]);
}
