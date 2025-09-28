/**
 * Mobile-First Breakpoints for Degen Mobile Theme
 * 
 * Dedicated mobile theme with bottom navigation and single-column layout
 * Optimized for touch devices with native app-like experience
 */

// Mobile-focused breakpoint values
export const breakpoints = {
  // Mobile (default) - primary target
  mobile: '0px',
  
  // Large mobile (landscape phones)
  mobileLg: '480px',
  
  // Small tablets (fallback support)
  tablet: '768px',
  
  // Large tablets (minimal desktop support)
  tabletLg: '1024px'
} as const;

// Mobile-first media query helpers
export const media = {
  // Mobile-first (min-width) queries
  mobileLg: `@media (min-width: ${breakpoints.mobileLg})`,
  tablet: `@media (min-width: ${breakpoints.tablet})`,
  tabletLg: `@media (min-width: ${breakpoints.tabletLg})`,
  
  // Max-width queries for mobile-specific styles
  maxMobile: `@media (max-width: ${parseInt(breakpoints.mobileLg) - 1}px)`,
  maxMobileLg: `@media (max-width: ${parseInt(breakpoints.tablet) - 1}px)`,
  
  // Device-specific queries
  landscape: '@media (orientation: landscape)',
  portrait: '@media (orientation: portrait)',
  
  // Touch device optimization
  touch: '@media (hover: none) and (pointer: coarse)',
  mouse: '@media (hover: hover) and (pointer: fine)',
  
  // Accessibility
  reduceMotion: '@media (prefers-reduced-motion: reduce)',
  
  // High DPI displays (common on mobile)
  retina: '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
  
  // Safe area (iPhone X+ notch support)
  safeArea: '@supports (padding: max(0px))'
} as const;

// Grid layout for mobile theme (single column + bottom nav)
export const gridBreakpoints = {
  // Mobile: Single column with bottom navigation
  mobile: {
    areas: `"header" "main" "bottomnav"`,
    rows: '60px 1fr 70px', // Header, flexible main, bottom nav
    columns: '1fr'
  },
  
  // Large mobile: Slightly taller header
  mobileLg: {
    areas: `"header" "main" "bottomnav"`,
    rows: '65px 1fr 70px',
    columns: '1fr'
  },
  
  // Tablet fallback: Keep mobile layout but larger
  tablet: {
    areas: `"header" "main" "bottomnav"`,
    rows: '70px 1fr 75px',
    columns: '1fr'
  }
} as const;

// Typography scale optimized for mobile readability
export const typography = {
  // Base sizes for mobile
  base: {
    fontSize: '16px',
    lineHeight: 1.5
  },
  
  // Mobile-friendly scale
  scale: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '28px',
    '4xl': '32px'
  },
  
  // Font weights
  weight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  }
} as const;

// Spacing system for mobile touch targets
export const spacing = {
  // Touch-friendly spacing
  touchTarget: '44px', // Minimum iOS/Android touch target
  
  // Standard spacing scale
  xs: '4px',
  sm: '8px',
  base: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  
  // Mobile-specific spacing
  mobile: {
    padding: '16px',
    margin: '12px',
    gap: '16px'
  },
  
  // Safe area constants for notched devices
  safeArea: {
    top: 'env(safe-area-inset-top)',
    right: 'env(safe-area-inset-right)',
    bottom: 'env(safe-area-inset-bottom)',
    left: 'env(safe-area-inset-left)'
  }
} as const;

// Animation constants for mobile performance
export const animations = {
  // Fast animations for mobile
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '400ms'
  },
  
  // Easing functions
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },
  
  // Transform constants
  transform: {
    slideUp: 'translateY(100%)',
    slideDown: 'translateY(-100%)',
    scale: 'scale(0.95)'
  }
} as const;

// Component-specific constants
export const components = {
  header: {
    height: '60px',
    heightLg: '70px',
    zIndex: 1000
  },
  
  bottomNav: {
    height: '70px',
    zIndex: 999,
    blur: 'blur(20px)'
  },
  
  modal: {
    zIndex: 2000,
    backdropBlur: 'blur(8px)',
    borderRadius: '20px 20px 0 0' // iOS-style rounded top corners
  },
  
  button: {
    minHeight: spacing.touchTarget,
    borderRadius: '12px',
    fontSize: typography.scale.base
  }
} as const;