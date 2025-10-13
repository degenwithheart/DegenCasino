/**
 * Mobile-First Responsive Breakpoints for DegenHeart Theme
 * 
 * Following mobile-first approach with min-width media queries
 * All components should be designed for mobile by default,
 * then progressively enhanced for larger screens
 */

// Breakpoint values (mobile-first approach)
export const breakpoints = {
  // Mobile (default) - no media query needed
  mobile: '0px',

  // Small mobile (landscape phones)
  mobileLg: '480px',

  // Tablets (portrait)
  tablet: '768px',

  // Small laptops / large tablets
  tabletLg: '1024px',

  // Medium desktops
  desktop: '1280px',

  // Large desktop / External monitors
  desktopLg: '1440px',

  // Ultra-wide / 4K monitors
  ultraWide: '1920px'
} as const;

// Mobile-first media query helpers
export const media = {
  // Mobile-first (min-width) queries
  mobileLg: `@media (min-width: ${breakpoints.mobileLg})`,
  tablet: `@media (min-width: ${breakpoints.tablet})`,
  tabletLg: `@media (min-width: ${breakpoints.tabletLg})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  desktopLg: `@media (min-width: ${breakpoints.desktopLg})`,
  ultraWide: `@media (min-width: ${breakpoints.ultraWide})`,

  // Max-width queries (for specific overrides)
  maxMobile: `@media (max-width: ${parseInt(breakpoints.mobileLg) - 1}px)`,
  maxMobileLg: `@media (max-width: ${parseInt(breakpoints.tablet) - 1}px)`,
  maxTablet: `@media (max-width: ${parseInt(breakpoints.tabletLg) - 1}px)`,
  maxTabletLg: `@media (max-width: ${parseInt(breakpoints.desktop) - 1}px)`,
  maxDesktop: `@media (max-width: ${parseInt(breakpoints.desktopLg) - 1}px)`,

  // Range queries (between breakpoints)
  mobileOnly: `@media (max-width: ${parseInt(breakpoints.mobileLg) - 1}px)`,
  mobileLgOnly: `@media (min-width: ${breakpoints.mobileLg}) and (max-width: ${parseInt(breakpoints.tablet) - 1}px)`,
  tabletOnly: `@media (min-width: ${breakpoints.tablet}) and (max-width: ${parseInt(breakpoints.tabletLg) - 1}px)`,
  tabletLgOnly: `@media (min-width: ${breakpoints.tabletLg}) and (max-width: ${parseInt(breakpoints.desktop) - 1}px)`,

  // Orientation queries
  landscape: '@media (orientation: landscape)',
  portrait: '@media (orientation: portrait)',

  // High DPI displays
  retina: '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',

  // Touch devices
  touch: '@media (hover: none) and (pointer: coarse)',
  mouse: '@media (hover: hover) and (pointer: fine)',

  // Accessibility - reduced motion
  reduceMotion: '@media (prefers-reduced-motion: reduce)',

  // Dark mode preference
  darkMode: '@media (prefers-color-scheme: dark)',
  lightMode: '@media (prefers-color-scheme: light)'
} as const;

// Grid layout breakpoints for DegenHeart theme
export const gridBreakpoints = {
  // Mobile: Single column layout (never used due to mobile theme auto-switch)
  mobile: {
    areas: `"header" "main" "footer"`,
    rows: '80px 1fr 65px',
    columns: '1fr'
  },

  // Tablet: Single column layout (hide both sidebars for better content focus)
  tablet: {
    areas: `"header" "main" "footer"`,
    rows: '80px 1fr 60px',
    columns: '1fr'
  },

  // Small Desktop: Two column layout (main + right sidebar only)
  smallDesktop: {
    // Use a compact three-column layout for tablet-large / small-desktop
    // This ensures left/right sidebars display consistently at >= tabletLg
    areas: `"header header header" "left main right" "footer footer footer"`,
    rows: '80px 1fr 60px',
    columns: '200px 1fr 200px'
  },

  // Desktop: Three column layout (full layout)
  desktop: {
    areas: `"header header header" "left main right" "footer footer footer"`,
    rows: '80px 1fr 60px',
    columns: '250px 1fr 250px'
  }
} as const;

// Typography scale (mobile-first)
export const typography = {
  mobile: {
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem'  // 36px
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  },

  tablet: {
    fontSize: {
      xs: '0.8125rem',  // 13px
      sm: '0.9375rem',  // 15px
      base: '1.0625rem', // 17px
      lg: '1.1875rem',  // 19px
      xl: '1.375rem',   // 22px
      '2xl': '1.625rem', // 26px
      '3xl': '2rem',    // 32px
      '4xl': '2.5rem'   // 40px
    }
  },

  desktop: {
    fontSize: {
      xs: '0.875rem',   // 14px
      sm: '1rem',       // 16px
      base: '1.125rem', // 18px
      lg: '1.25rem',    // 20px
      xl: '1.5rem',     // 24px
      '2xl': '1.75rem', // 28px
      '3xl': '2.25rem', // 36px
      '4xl': '3rem'     // 48px
    }
  }
} as const;

// Spacing scale (mobile-first)
export const spacing = {
  mobile: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    base: '1rem',    // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '2.5rem', // 40px
    '3xl': '3rem'    // 48px
  },

  tablet: {
    xs: '0.375rem',  // 6px
    sm: '0.625rem',  // 10px
    base: '1.25rem', // 20px
    lg: '1.875rem',  // 30px
    xl: '2.5rem',    // 40px
    '2xl': '3rem',   // 48px
    '3xl': '4rem'    // 64px
  },

  desktop: {
    xs: '0.5rem',    // 8px
    sm: '0.75rem',   // 12px
    base: '1.5rem',  // 24px
    lg: '2rem',      // 32px
    xl: '3rem',      // 48px
    '2xl': '4rem',   // 64px
    '3xl': '5rem'    // 80px
  }
} as const;

// Component size variants (mobile-first)
export const components = {
  button: {
    mobile: {
      height: '44px',  // Touch-friendly minimum
      padding: '0.75rem 1rem',
      fontSize: '0.875rem'
    },
    tablet: {
      height: '48px',
      padding: '0.875rem 1.25rem',
      fontSize: '1rem'
    },
    desktop: {
      height: '52px',
      padding: '1rem 1.5rem',
      fontSize: '1rem'
    }
  },

  input: {
    mobile: {
      height: '44px',
      padding: '0.75rem 1rem',
      fontSize: '1rem' // Prevent zoom on iOS
    },
    tablet: {
      height: '48px',
      padding: '0.875rem 1.25rem',
      fontSize: '1rem'
    },
    desktop: {
      height: '52px',
      padding: '1rem 1.5rem',
      fontSize: '1rem'
    }
  },

  modal: {
    mobile: {
      margin: '1rem',
      padding: '1rem',
      borderRadius: '12px',
      maxHeight: 'calc(100vh - 2rem)'
    },
    tablet: {
      margin: '2rem',
      padding: '1.5rem',
      borderRadius: '16px',
      maxHeight: 'calc(100vh - 4rem)'
    },
    desktop: {
      margin: '3rem',
      padding: '2rem',
      borderRadius: '20px',
      maxHeight: 'calc(100vh - 6rem)'
    }
  }
} as const;

// Utility functions
export const getBreakpointValue = (breakpoint: keyof typeof breakpoints): string => {
  return breakpoints[breakpoint];
};

export const createMediaQuery = (breakpoint: keyof typeof breakpoints): string => {
  return `@media (min-width: ${breakpoints[breakpoint]})`;
};

// CSS-in-JS helper for styled-components
export const respondTo = (breakpoint: keyof typeof media) => {
  return media[breakpoint];
};

// Export for backwards compatibility (gradually migrate away from these)
export const LEGACY_BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280
} as const;