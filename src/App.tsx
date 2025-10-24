/**
 * @fileoverview Main Application Component for DegenCasino
 *
 * This is the root component that orchestrates the entire DegenCasino platform.
 * It handles routing, theming, wallet integration, error boundaries, and progressive loading.
 *
 * Key Features:
 * - Multi-theme support (default, degenheart, degen-mobile layouts)
 * - Progressive loading and performance optimization
 * - Comprehensive error handling and boundaries
 * - Wallet integration with Solana
 * - Lazy loading for optimal bundle splitting
 * - PWA support and service worker integration
 * - Access override system for maintenance mode
 *
 * Architecture:
 * - Theme-aware component resolution
 * - Provider composition for global state
 * - Route-based code splitting
 * - Error boundary hierarchy (app -> route -> component)
 */

// ===================================
// CORE REACT & ROUTING DEPENDENCIES
// ===================================

/**
 * React core imports for component lifecycle and state management.
 * - useEffect: Handles side effects, subscriptions, and cleanup
 * - useState: Local component state management
 * - Suspense: Handles lazy loading boundaries and fallbacks
 * - lazy: Code splitting for route-based components
 */
import React, { useEffect, useState, Suspense, lazy } from 'react';

/**
 * React Router imports for client-side navigation and routing.
 * - Route/Routes: Declarative route configuration and matching
 * - useLocation: Access current location/pathname for conditional logic
 */
import { Route, Routes, useLocation } from 'react-router-dom';
// ===================================
// SOLANA WALLET INTEGRATION
// ===================================

/**
 * Solana wallet adapter hooks for wallet connection and state management.
 * - useWallet: Access wallet connection state, public key, and methods
 * - useWalletModal: Control wallet selection modal visibility
 */
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

/**
 * Gamba v2 transaction error handling hook.
 * Provides centralized error handling for all gambling transactions
 * with user-friendly error messages and recovery options.
 */
import { useTransactionError } from 'gamba-react-v2';
// ===================================
// UI COMPONENTS & MODALS
// ===================================

/**
 * Core UI components for modals and overlays.
 * - Modal: Generic modal container for various content
 * - TOSModal: Terms of Service acceptance modal for new users
 */
import { Modal, TOSModal } from './components';

/**
 * Error boundary specifically for route-level error isolation.
 * Prevents route navigation errors from crashing the entire app.
 */
import RouterErrorBoundary from './components/RouterErrorBoundary';

/**
 * Route transition utilities for smooth page navigation.
 * - RouteTransitionWrapper: Handles transition animations between routes
 * - RouteLoadingSpinner: Loading indicator during route transitions
 */
import { RouteTransitionWrapper, RouteLoadingSpinner } from './components/RouteTransitionWrapper';

/**
 * Advanced error boundary components for different levels of error isolation.
 * - SafeSuspense: Suspense wrapper with error boundaries and fallbacks
 * - WindowErrorHandler: Global error handler for unhandled JavaScript errors
 */
import { SafeSuspense, WindowErrorHandler } from './components/ErrorBoundaries';

/**
 * Error boundary wrapper utility for consistent error handling across components.
 * Provides standardized error reporting and recovery mechanisms.
 */
import { ErrorBoundaryWrapper } from './utils/errorBoundaryUtils';
// ===================================
// CONFIGURATION & CONSTANTS
// ===================================

/**
 * Feature flags and configuration constants from the centralized config file.
 * - ENABLE_TROLLBOX: Controls chat/messaging feature availability
 * - FEATURE_FLAGS: Object containing various feature toggles
 * - ENABLE_MOBILE_APP: Mobile app feature toggle
 */
import { ENABLE_TROLLBOX, FEATURE_FLAGS, ENABLE_MOBILE_APP } from './constants';

// ===================================
// CUSTOM HOOKS & UTILITIES
// ===================================

/**
 * Wallet toast notifications for transaction feedback.
 * Provides user-friendly success/error messages for wallet operations.
 */
import { useWalletToast } from './utils/wallet/solanaWalletToast';

/**
 * User state management store using Zustand.
 * Handles user preferences, newcomer status, and persistent state.
 */
import { useUserStore } from './hooks/data/useUserStore';

/**
 * Service worker and asset preloading hooks for PWA functionality.
 * - useServiceWorker: Manages service worker registration and updates
 * - preloadCriticalAssets: Preloads essential assets for better performance
 */
import { useServiceWorker, preloadCriticalAssets } from './hooks/system/useServiceWorker';

/**
 * Component preloading system for performance optimization.
 * Preloads components that are likely to be needed soon.
 */
import { useComponentPreloader } from './hooks/system/useComponentPreloader';

/**
 * Progressive loading manager for games and heavy components.
 * Handles intelligent loading of game assets and components.
 */
import { useProgressiveLoadingManager } from './hooks/system/useProgressiveLoadingManager';

/**
 * Progressive loading context provider for global loading state.
 * Shares loading state and performance metrics across the app.
 */
import { ProgressiveLoadingProvider } from './hooks/system/useProgressiveLoading';

/**
 * Route change handling utilities for navigation optimization.
 * - useRouteChangeHandler: Manages route transition logic
 * - addRouteTransitionCSS: Injects CSS for smooth transitions
 */
import { useRouteChangeHandler, addRouteTransitionCSS } from './hooks/system/useRouteChangeHandler';
// ===================================
// CORE SECTIONS & COMPONENTS
// ===================================

/**
 * Main dashboard component - the primary landing page of the application.
 * Displays featured games, recent activity, and navigation options.
 */
import { Dashboard } from './sections/Dashboard/Dashboard';

/**
 * Context providers for global application state.
 * - GamesModalContext: Controls the all-games modal visibility
 * - ChatNotificationProvider: Manages chat notifications and state
 */
import { GamesModalContext } from './contexts/GamesModalContext';
import { ChatNotificationProvider } from './contexts/ChatNotificationContext';
// ===================================
// LAZY-LOADED NON-CRITICAL PAGES
// ===================================

/**
 * Lazy-loaded dashboard pages for better initial bundle size.
 * These pages are not immediately needed on app load.
 */
const AboutMe = lazy(() => import('./sections/Dashboard/AboutMe/AboutMe'));
const TermsPage = lazy(() => import('./sections/Dashboard/Terms/Terms'));
const Whitepaper = lazy(() => import('./sections/Dashboard/Whitepaper/Whitepaper'));
const Credits = lazy(() => import('./sections/Dashboard/Credits/Credits'));

/**
 * Token-related pages with lazy loading for performance.
 * - DGHRTToken: Token information and utility page
 * - DGHRTPresale: Token presale participation page
 */
const DGHRTToken = lazy(() => import('./sections/DGHRTToken/DGHRTToken'));
const DGHRTPresale = lazy(() => import('./sections/DGHRTPresale/DGHRTPresale'));

/**
 * User profile components for different themes.
 * - UserProfile: Standard user profile page
 * - DegenMobileUserProfile: Mobile-optimized profile for degen-mobile theme
 */
const UserProfile = lazy(() => import('./sections/UserProfile/UserProfile'));
const DegenMobileUserProfile = lazy(() => import('./themes/layouts/degen-mobile/components/UserProfile'));
import Header from './sections/Header';
import { AllGamesModal, TrollBox, Sidebar, Transaction, PlayerView, CacheDebugWrapper, PlatformView, ExplorerIndex, GraphicsProvider } from './components';
import { ProgressiveLoadingMonitor } from './components/Debug/ProgressiveLoadingMonitor';
import Toasts from './sections/Toasts';
import Footer from './sections/Footer';
import styled from 'styled-components';
import DevnetWarning from './components/Network/DevnetWarning';
// Lazy load pages and components
const Propagation = lazy(() => import('./pages/system/propagation'));
const ChangelogPage = lazy(() => import('./pages/system/ChangelogPage'));
const AccessOverridePage = lazy(() => import('./pages/system/AccessOverridePage'));
const BackSoon = lazy(() => import('./pages/system/BackSoon'));
// Lazy load pages
const JackpotPage = lazy(() => import('./pages/features/JackpotPage'));
const LeaderboardPage = lazy(() => import('./pages/features/LeaderboardPage'));
const SelectTokenPage = lazy(() => import('./pages/features/SelectTokenPage'));
const BonusPage = lazy(() => import('./pages/features/BonusPage'));
const MobileAppPage = lazy(() => import('./pages/features/MobileAppPage'));
const AdminPage = lazy(() => import('./pages/system/AdminPage'));
import { useTheme } from './themes/UnifiedThemeContext';
import PWAInstallBanner from './components/PWA/PWAInstallBanner';

// Preload components for better UX

// Loading component for lazy-loaded routes
const SIDEBAR_WIDTH = 80;

// Theme-aware content component that renders based on current layout theme
// ===================================
// MAIN APP CONTENT COMPONENT
// ===================================

/**
 * AppContent Component
 *
 * Core application router and layout orchestrator.
 * Handles theme-aware routing, component resolution, and progressive loading.
 *
 * Architecture:
 * - Theme-based component resolution for multi-layout support
 * - Progressive loading with Suspense boundaries
 * - Route-based code splitting for optimal performance
 * - Error boundaries for graceful failure handling
 *
 * @param {Object} props - Component props
 * @param {boolean} props.autoConnectAttempted - Whether wallet auto-connect has been attempted
 * @returns {JSX.Element} The main application content with routing
 */
function AppContent({ autoConnectAttempted }: { autoConnectAttempted: boolean; }) {
  /**
   * Wallet connection state for conditional rendering.
   * Used to determine if user is connected for UI adaptations.
   */
  const { connected } = useWallet();

  /**
   * Current route location for navigation-aware logic.
   * Used for access control and conditional rendering.
   */
  const location = useLocation();

  /**
   * Theme system hooks for layout resolution.
   * - currentLayoutTheme: Current active theme (default/degenheart/degen-mobile)
   * - resolveComponent: Function to get theme-specific component variants
   */
  const {
    currentLayoutTheme,
    resolveComponent
  } = useTheme();

  // ===================================
  // ACCESS OVERRIDE SYSTEM
  // ===================================

  /**
   * Access override system for maintenance mode and admin controls.
   * Allows platform operators to temporarily disable access with custom messages.
   *
   * Configuration sources (in priority order):
   * 1. Local storage override (admin UI)
   * 2. Environment variables (build-time)
   * 3. Feature flags (runtime configuration)
   */
  const envVars = (import.meta as unknown as { env?: Record<string, string>; }).env || {};

  /**
   * Type definition for stored override configuration.
   * Persisted in localStorage for admin control.
   */
  interface StoredOverride {
    enabled?: boolean;
    accessMessage?: string;
    offlineMessage?: string;
  }

  /**
   * Build-time override configuration from environment variables.
   * Set during deployment for scheduled maintenance.
   */
  const buildOverrideEnabled = envVars.VITE_ACCESS_OVERRIDE_ENABLED === 'true';

  /**
   * Runtime override configuration from localStorage.
   * Allows admin users to enable/disable override dynamically.
   */
  let storedOverride: StoredOverride | null = null;
  try {
    storedOverride = JSON.parse(localStorage.getItem('access_override_ui') || 'null');
  } catch {
    storedOverride = null;
  }

  /**
   * Feature flag control for override functionality.
   * Must be enabled for override system to work.
   */
  const featureFlagAllowsOverride = Boolean(FEATURE_FLAGS?.ACCESS_OVERRIDE);

  /**
   * Final override state determination.
   * Combines build-time, runtime, and feature flag settings.
   */
  const overrideEnabled = featureFlagAllowsOverride && (typeof storedOverride?.enabled === 'boolean' ? storedOverride.enabled : buildOverrideEnabled);

  /**
   * Override messages with fallback hierarchy.
   * localStorage > environment variables > empty string
   */
  const overrideAccessMessage = storedOverride?.accessMessage ?? envVars.VITE_ACCESS_OVERRIDE_MESSAGE ?? '';
  const overrideOfflineMessage = storedOverride?.offlineMessage ?? envVars.VITE_OFFLINE_MESSAGE ?? '';

  // ===================================
  // MAINTENANCE MODE RENDERING
  // ===================================

  /**
   * Maintenance mode rendering.
   * Shows full-screen offline message when override is enabled.
   * Admin routes (/admin) are exempt from override.
   */
  if (overrideEnabled && !location.pathname.startsWith('/admin')) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(180deg, #0b0b0b, #121212)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        zIndex: 99999,
      }}>
        <div style={{ maxWidth: 900, textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.2rem', color: '#ff6666', marginBottom: 12 }}>We'll be back soon</h1>
          {overrideAccessMessage ? <p style={{ color: '#ddd', fontSize: '1.05rem', marginBottom: 12 }}>{overrideAccessMessage}</p> : null}
          {overrideOfflineMessage ? <div style={{ color: '#bbb', background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 8 }}>{overrideOfflineMessage}</div> : null}

          <div style={{ marginTop: 18 }}>
            {/* <a href="/admin" style={{ color: 'white', textDecoration: 'underline', fontWeight: 600 }}>Admin / Manage Override</a> */}
          </div>
        </div>
      </div>
    );
  }

  // ===================================
  // THEME-AWARE COMPONENT RESOLUTION
  // ===================================

  /**
   * Theme-aware component resolution system.
   * Dynamically resolves components based on current layout theme.
   * Falls back to default components if theme-specific versions don't exist.
   *
   * This enables multi-layout architecture where different themes
   * can have completely different component implementations.
   */
  const HeaderComponent = resolveComponent('components', 'Header') || Header;
  const FooterComponent = resolveComponent('components', 'Footer') || Footer;
  const DashboardComponent = resolveComponent('sections', 'Dashboard') || Dashboard;

  /**
   * Game component resolution with lazy loading.
   * Game section is heavy and always lazy-loaded for performance.
   */
  const GameComponent = resolveComponent('sections', 'Game') || React.lazy(() => import('./sections/Game/Game'));

  /**
   * Page component resolution for feature pages.
   * Allows themes to override entire page implementations.
   */
  const JackpotPageComponent = resolveComponent('pages', 'JackpotPage') || JackpotPage;
  const BonusPageComponent = resolveComponent('pages', 'BonusPage') || BonusPage;
  const LeaderboardPageComponent = resolveComponent('pages', 'LeaderboardPage') || LeaderboardPage;
  const SelectTokenPageComponent = resolveComponent('pages', 'SelectTokenPage') || SelectTokenPage;
  const MobileAppPageComponent = resolveComponent('pages', 'MobileAppPage') || MobileAppPage;

  // ===================================
  // THEME-BASED LAYOUT RENDERING
  // ===================================

  /**
   * Theme detection for layout-specific rendering logic.
   * Different themes may have completely different layout structures.
   */
  const isDegenHeartTheme = currentLayoutTheme.id === 'degenheart';
  const isDegenMobileTheme = currentLayoutTheme.id === 'degen-mobile';

  // ===================================
  // DEGENHEART THEME LAYOUT
  // ===================================

  /**
   * DegenHeart theme layout wrapper.
   * Uses a completely custom layout structure with its own routing.
   * This theme has a unique navigation and component architecture.
   */
  if (isDegenHeartTheme) {
    // Import the DegenHeart layout dynamically
    const DegenHeartLayout = React.lazy(() => import('./themes/layouts/degenheart/DegenHeartLayout'));

    return (
      <RouterErrorBoundary key={`degenheart-${location.pathname}`}>
        <RouteTransitionWrapper fallback={<RouteLoadingSpinner />}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <DegenHeartLayout>
              <Toasts />
              <DevnetWarning />
              <Routes>
                {/* Core application routes */}
                <Route path="/" element={<DashboardComponent />} />
                <Route path="/jackpot" element={<SafeSuspense level="route" componentName="Jackpot Page"><JackpotPageComponent /></SafeSuspense>} />
                <Route path="/bonus" element={<SafeSuspense level="route" componentName="Bonus Page"><BonusPageComponent /></SafeSuspense>} />
                <Route path="/leaderboard" element={<SafeSuspense level="route" componentName="Leaderboard Page"><LeaderboardPageComponent /></SafeSuspense>} />
                {ENABLE_MOBILE_APP && <Route path="/mobile" element={<SafeSuspense level="route" componentName="Mobile App Page"><MobileAppPageComponent /></SafeSuspense>} />}
                <Route path="/select-token" element={<SafeSuspense level="route" componentName="Select Token Page"><SelectTokenPageComponent /></SafeSuspense>} />

                {/* Legal and informational pages */}
                <Route path="/terms" element={<SafeSuspense level="route" componentName="Terms Page"><TermsPage /></SafeSuspense>} />
                <Route path="/whitepaper" element={<SafeSuspense level="route" componentName="Whitepaper Page"><Whitepaper /></SafeSuspense>} />
                <Route path="/credits" element={<SafeSuspense level="route" componentName="Credits Page"><Credits /></SafeSuspense>} />

                {/* Token ecosystem pages */}
                <Route path="/token" element={<SafeSuspense level="route" componentName="DGHRT Token Page"><DGHRTToken /></SafeSuspense>} />
                <Route path="/presale" element={<SafeSuspense level="route" componentName="DGHRT Presale Page"><DGHRTPresale /></SafeSuspense>} />

                {/* User and system pages */}
                <Route path="/aboutme" element={<SafeSuspense level="route" componentName="About Me Page"><AboutMe /></SafeSuspense>} />
                <Route path="/changelog" element={<SafeSuspense level="route" componentName="Changelog Page"><ChangelogPage /></SafeSuspense>} />
                <Route path="/propagation" element={<SafeSuspense level="route" componentName="Propagation Page"><Propagation /></SafeSuspense>} />

                {/* Admin and maintenance pages */}
                <Route path="/admin" element={<SafeSuspense level="route" componentName="Admin Page"><AdminPage /></SafeSuspense>} />
                <Route path="/admin/override" element={<SafeSuspense level="route" componentName="Access Override Page"><AccessOverridePage /></SafeSuspense>} />
                <Route path="/back-soon" element={<SafeSuspense level="route" componentName="Back Soon Page"><BackSoon /></SafeSuspense>} />

                {/* Explorer and blockchain data pages */}
                <Route path="/explorer" element={<ErrorBoundaryWrapper level="route" componentName="Explorer"><ExplorerIndex /></ErrorBoundaryWrapper>} />
                <Route path="/explorer/platform/:creator" element={<ErrorBoundaryWrapper level="route" componentName="Platform View"><PlatformView /></ErrorBoundaryWrapper>} />
                <Route path="/explorer/player/:address" element={<ErrorBoundaryWrapper level="route" componentName="Player View"><PlayerView /></ErrorBoundaryWrapper>} />
                <Route path="/explorer/transaction/:txId" element={<ErrorBoundaryWrapper level="route" componentName="Transaction View"><Transaction /></ErrorBoundaryWrapper>} />

                {/* Dynamic user and game routes */}
                <Route path="/:wallet/profile" element={<SafeSuspense level="route" componentName="User Profile Page"><UserProfile /></SafeSuspense>} />
                <Route path="/game/:wallet/:gameId" element={<SafeSuspense level="route" componentName="Game Page"><GameComponent /></SafeSuspense>} />
              </Routes>
            </DegenHeartLayout>
          </Suspense>
        </RouteTransitionWrapper>
      </RouterErrorBoundary>
    );
  }

  // ===================================
  // DEGENMOBILE THEME LAYOUT
  // ===================================

  /**
   * DegenMobile theme layout wrapper.
   * Mobile-optimized layout with touch-friendly navigation.
   * Uses the same route structure as DegenHeart but with mobile-specific components.
   */
  if (isDegenMobileTheme) {
    // Import the DegenMobile layout dynamically
    const DegenMobileLayout = React.lazy(() => import('./themes/layouts/degen-mobile/DegenMobileLayout'));

    return (
      <RouterErrorBoundary key={`degen-mobile-${location.pathname}`}>
        <RouteTransitionWrapper fallback={<RouteLoadingSpinner />}>
          <Suspense fallback={<RouteLoadingSpinner />}>
            <DegenMobileLayout>
              <Toasts />
              <DevnetWarning />
              <Routes>
                {/* Core application routes - identical to DegenHeart but with mobile-specific components */}
                <Route path="/" element={<DashboardComponent />} />
                <Route path="/jackpot" element={<SafeSuspense level="route" componentName="Jackpot Page"><JackpotPageComponent /></SafeSuspense>} />
                <Route path="/bonus" element={<SafeSuspense level="route" componentName="Bonus Page"><BonusPageComponent /></SafeSuspense>} />
                <Route path="/leaderboard" element={<SafeSuspense level="route" componentName="Leaderboard Page"><LeaderboardPageComponent /></SafeSuspense>} />
                {ENABLE_MOBILE_APP && <Route path="/mobile" element={<SafeSuspense level="route" componentName="Mobile App Page"><MobileAppPageComponent /></SafeSuspense>} />}
                <Route path="/select-token" element={<SafeSuspense level="route" componentName="Select Token Page"><SelectTokenPageComponent /></SafeSuspense>} />

                {/* Legal and informational pages */}
                <Route path="/terms" element={<SafeSuspense level="route" componentName="Terms Page"><TermsPage /></SafeSuspense>} />
                <Route path="/whitepaper" element={<SafeSuspense level="route" componentName="Whitepaper Page"><Whitepaper /></SafeSuspense>} />
                <Route path="/credits" element={<SafeSuspense level="route" componentName="Credits Page"><Credits /></SafeSuspense>} />

                {/* Token ecosystem pages */}
                <Route path="/token" element={<SafeSuspense level="route" componentName="DGHRT Token Page"><DGHRTToken /></SafeSuspense>} />
                <Route path="/presale" element={<SafeSuspense level="route" componentName="DGHRT Presale Page"><DGHRTPresale /></SafeSuspense>} />

                {/* User and system pages */}
                <Route path="/aboutme" element={<SafeSuspense level="route" componentName="About Me Page"><AboutMe /></SafeSuspense>} />
                <Route path="/changelog" element={<SafeSuspense level="route" componentName="Changelog Page"><ChangelogPage /></SafeSuspense>} />
                <Route path="/propagation" element={<SafeSuspense level="route" componentName="Propagation Page"><Propagation /></SafeSuspense>} />

                {/* Admin and maintenance pages */}
                <Route path="/admin" element={<SafeSuspense level="route" componentName="Admin Page"><AdminPage /></SafeSuspense>} />
                <Route path="/admin/override" element={<SafeSuspense level="route" componentName="Access Override Page"><AccessOverridePage /></SafeSuspense>} />
                <Route path="/back-soon" element={<SafeSuspense level="route" componentName="Back Soon Page"><BackSoon /></SafeSuspense>} />

                {/* Explorer and blockchain data pages */}
                <Route path="/explorer" element={<ErrorBoundaryWrapper level="route" componentName="Explorer"><ExplorerIndex /></ErrorBoundaryWrapper>} />
                <Route path="/explorer/platform/:creator" element={<ErrorBoundaryWrapper level="route" componentName="Platform View"><PlatformView /></ErrorBoundaryWrapper>} />
                <Route path="/explorer/player/:address" element={<ErrorBoundaryWrapper level="route" componentName="Player View"><PlayerView /></ErrorBoundaryWrapper>} />
                <Route path="/explorer/transaction/:txId" element={<ErrorBoundaryWrapper level="route" componentName="Transaction View"><Transaction /></ErrorBoundaryWrapper>} />

                {/* Dynamic user and game routes - uses mobile-specific profile component */}
                <Route path="/:wallet/profile" element={<SafeSuspense level="route" componentName="User Profile Page"><DegenMobileUserProfile /></SafeSuspense>} />
                <Route path="/game/:wallet/:gameId" element={<SafeSuspense level="route" componentName="Game Page"><GameComponent /></SafeSuspense>} />
              </Routes>
            </DegenMobileLayout>
          </Suspense>
        </RouteTransitionWrapper>
      </RouterErrorBoundary>
    );
  }
}

// ===================================
// STYLED COMPONENTS
// ===================================

/**
 * MainContent styled component for the default layout.
 *
 * Responsive layout container that adapts to different screen sizes:
 * - Desktop: Includes sidebar padding and full viewport height
 * - Tablet/Mobile: Removes sidebar, adjusts padding and height
 * - Progressive enhancement with dynamic viewport units (dvh)
 *
 * Uses mobile-first responsive design with breakpoints at 900px, 700px, and 479px.
 */
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

// ===================================
// UTILITY COMPONENTS
// ===================================

/**
 * ScrollToTop component.
 *
 * Automatically scrolls to the top of the page whenever the route changes.
 * Essential for single-page applications to provide expected navigation behavior.
 *
 * @returns {null} This component doesn't render anything visible
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

/**
 * ErrorHandler component.
 *
 * Global error handler for wallet and transaction errors.
 * Automatically shows wallet modal for connection errors or transaction error toasts.
 *
 * @returns {null} This component doesn't render anything visible
 */
function ErrorHandler() {
  const walletModal = useWalletModal();
  const { showTransactionError } = useWalletToast();

  useTransactionError((err) => {
    if (err.message === 'NOT_CONNECTED') {
      walletModal.setVisible(true);
    } else {
      showTransactionError(err);
    }
  });
  return null;
}

/**
 * WelcomeBanner component.
 *
 * Shows a loading state during wallet auto-connection attempts.
 * Provides visual feedback while the app attempts to reconnect the user's wallet.
 *
 * @returns {JSX.Element | null} Loading banner or null when connection is established
 */
function WelcomeBanner() {
  const wallet = useWallet();
  const [autoConnectAttempted, setAutoConnectAttempted] = useState(false);

  useEffect(() => {
    if (!wallet.connecting) {
      setAutoConnectAttempted(true);
    }
  }, [wallet.connecting]);

  const isLoading = !autoConnectAttempted || wallet.connecting;

  if (!isLoading) return null;

}

// ===================================
// MAIN APP COMPONENT
// ===================================

/**
 * App Component - Main Application Entry Point
 *
 * The root component that orchestrates the entire DegenHeart Casino application.
 * Manages global state, providers, modals, and the main application lifecycle.
 *
 * Architecture:
 * - Progressive loading system initialization
 * - Global state management (user store, games modal)
 * - Error boundaries and comprehensive error handling
 * - Anti-debugging protection in production
 * - PWA and service worker integration
 * - Theme-aware component rendering through AppContent
 *
 * Key Responsibilities:
 * 1. Initialize performance optimization systems
 * 2. Handle global modals (games, TOS, PWA install)
 * 3. Manage wallet auto-connection and user onboarding
 * 4. Provide context providers for the entire application
 * 5. Render the main application content with theme resolution
 *
 * @returns {JSX.Element} The complete application with all providers and content
 */
export default function App() {
  /**
   * User store state for newcomer status and global settings.
   * Used to show/hide Terms of Service modal for new users.
   */
  const newcomer = useUserStore((s) => s.newcomer);
  const set = useUserStore((s) => s.set);

  // Settings for global app behavior
  const reduceMotion = useUserStore((s) => !!s.reduceMotion);
  const lessGlow = useUserStore((s) => !!s.lessGlow);
  const particlesEnabled = useUserStore((s) => s.particlesEnabled !== false);
  const fontSlim = useUserStore((s) => !!s.fontSlim);
  const autoAdapt = useUserStore((s) => !!s.autoAdapt);
  const cacheWarmup = useUserStore((s) => !!s.cacheWarmup);

  /**
   * Apply user settings to document body for global CSS targeting
   */
  useEffect(() => {
    document.body.setAttribute('data-reduce-motion', reduceMotion ? 'true' : 'false');
    document.body.setAttribute('data-less-glow', lessGlow ? 'true' : 'false');
    document.body.setAttribute('data-particles-enabled', particlesEnabled ? 'true' : 'false');
    document.body.setAttribute('data-font-slim', fontSlim ? 'true' : 'false');
    document.body.setAttribute('data-auto-adapt', autoAdapt ? 'true' : 'false');
  }, [reduceMotion, lessGlow, particlesEnabled, fontSlim, autoAdapt]);

  /**
   * Cache warmup: preload core files on idle
   */
  useEffect(() => {
    if (cacheWarmup) {
      const warmup = () => {
        // Preload critical assets
        const criticalAssets = [
          '/src/games/Plinko/index.tsx',
          '/src/games/Dice/index.tsx',
          '/src/games/Flip/index.tsx',
          // Add more critical game components
        ];
        criticalAssets.forEach(asset => {
          fetch(asset, { priority: 'low' }).catch(() => { });
        });
      };
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(warmup, { timeout: 5000 });
      } else {
        setTimeout(warmup, 1000);
      }
    }
  }, [cacheWarmup]);

  /**
   * Auto adaptation: monitor performance and auto-adjust settings
   */
  useEffect(() => {
    if (!autoAdapt) return;

    let longTaskCount = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) { // Long task > 50ms
          longTaskCount++;
          if (longTaskCount > 5) { // Multiple long tasks
            console.log('🚨 Performance degradation detected, auto-adapting settings');
            set({ reduceMotion: true, lessGlow: true });
            observer.disconnect();
            break;
          }
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // Fallback for browsers without longtask support
      let frameCount = 0;
      const checkPerformance = () => {
        frameCount++;
        if (performance.now() > frameCount * 16.67 * 2) { // Behind by 2 frames
          console.log('🚨 Frame drops detected, auto-adapting settings');
          set({ reduceMotion: true, lessGlow: true });
        } else {
          requestAnimationFrame(checkPerformance);
        }
      };
      requestAnimationFrame(checkPerformance);
    }

    return () => observer.disconnect();
  }, [autoAdapt, set]);

  /**
   * Wallet connection state for auto-connect logic.
   */
  const { connecting } = useWallet();

  /**
   * Local state for tracking auto-connect attempts and games modal visibility.
   */
  const [autoConnectAttempted, setAutoConnectAttempted] = useState(false);
  const [showGamesModal, setShowGamesModal] = useState(false);

  // ===================================
  // ANTI-DEBUGGING PROTECTION
  // ===================================

  /**
   * Production anti-debugging protection.
   * Detects developer tools and clears console when opened.
   * This code gets obfuscated in production builds.
   */
  useEffect(() => {
    if (import.meta.env.MODE === 'production') {
      const devtools = { open: false, orientation: null };
      setInterval(() => {
        if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
          if (!devtools.open) {
            devtools.open = true;
            console.clear();
          }
        } else {
          devtools.open = false;
        }
      }, 500);
    }
  }, []);

  // ===================================
  // WALLET AUTO-CONNECTION
  // ===================================

  /**
   * Auto-connection attempt tracking.
   * Ensures welcome banner shows during initial connection attempts.
   */
  useEffect(() => {
    if (!connecting) {
      setAutoConnectAttempted(true);
    }
  }, [connecting]);

  // ===================================
  // GAMES MODAL EVENT HANDLING
  // ===================================

  /**
   * Global games modal event listener.
   * Allows any component to trigger the games modal via custom events.
   */
  useEffect(() => {
    const handler = () => setShowGamesModal(true);
    window.addEventListener('openGamesModal', handler);
    return () => window.removeEventListener('openGamesModal', handler);
  }, []);

  // ===================================
  // PROGRESSIVE LOADING SYSTEM
  // ===================================

  /**
   * Initialize performance optimization systems.
   * - Service worker for caching and offline support
   * - Component preloader for critical assets
   * - Route change handler for navigation optimization
   * - Progressive loading manager for intelligent asset loading
   */
  useServiceWorker();
  useComponentPreloader();
  useRouteChangeHandler();
  const { preloadGameOnHover, getPerformanceStats, isProgressiveLoadingActive } = useProgressiveLoadingManager();

  /**
   * Initialize critical assets and route transitions.
   * Called once on app startup for optimal performance.
   */
  useEffect(() => {
    // Preload critical assets for better performance
    preloadCriticalAssets();

    // Add route transition CSS
    addRouteTransitionCSS();
  }, []);

  // ===================================
  // APP RENDER
  // ===================================

  return (
    <ErrorBoundaryWrapper level="app" componentName="DegenHeart Casino App">
      <ProgressiveLoadingProvider value={{ preloadGameOnHover, getPerformanceStats, isProgressiveLoadingActive }}>
        <GraphicsProvider>
          <ChatNotificationProvider>
            <GamesModalContext.Provider value={{ openGamesModal: () => setShowGamesModal(true) }}>
              {/* Games Modal - triggered by global events or context */}
              {showGamesModal && (
                <Modal onClose={() => setShowGamesModal(false)}>
                  <AllGamesModal onGameClick={() => setShowGamesModal(false)} />
                </Modal>
              )}

              {/* Terms of Service Modal - shown for new users */}
              {newcomer && (
                <TOSModal
                  onClose={() => set({ newcomer: false })}
                  onAccept={() => set({ newcomer: false })}
                />
              )}

              {/* Utility components for global functionality */}
              <ScrollToTop />
              <ErrorHandler />

              {/* Advanced error handling system */}
              {FEATURE_FLAGS.USE_COMPREHENSIVE_ERROR_SYSTEM && <WindowErrorHandler />}

              {/* Main application content with theme resolution */}
              <AppContent autoConnectAttempted={autoConnectAttempted} />

              {/* Development and debugging tools */}
              <CacheDebugWrapper />
              <ProgressiveLoadingMonitor />

              {/* PWA installation prompt */}
              <PWAInstallBanner />
            </GamesModalContext.Provider>
          </ChatNotificationProvider>
        </GraphicsProvider>
      </ProgressiveLoadingProvider>
    </ErrorBoundaryWrapper>
  );
}