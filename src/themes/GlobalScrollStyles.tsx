import React from 'react';
import { createGlobalStyle } from 'styled-components';

export const GlobalScrollStyles = createGlobalStyle<{ colorScheme: any }>`
  /* Global scroll behavior and gesture support */
  * {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }

  /* Enhanced scrollbar styling with theme integration */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background: transparent;
  }

  ::-webkit-scrollbar-track {
    background: ${({ colorScheme }) => colorScheme.colors.background}15;
    border-radius: 4px;
    margin: 2px;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, 
      ${({ colorScheme }) => colorScheme.colors.primary}60, 
      ${({ colorScheme }) => colorScheme.colors.secondary}40
    );
    border-radius: 4px;
    transition: all 0.3s ease;
    border: 1px solid ${({ colorScheme }) => colorScheme.colors.border}30;
    box-shadow: ${({ colorScheme }) => colorScheme.effects.shadow};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, 
      ${({ colorScheme }) => colorScheme.colors.primary}80, 
      ${({ colorScheme }) => colorScheme.colors.accent}60
    );
    box-shadow: ${({ colorScheme }) => colorScheme.effects.glow};
    transform: scale(1.1);
  }

  ::-webkit-scrollbar-thumb:active {
    background: linear-gradient(135deg, 
      ${({ colorScheme }) => colorScheme.colors.accent}, 
      ${({ colorScheme }) => colorScheme.colors.primary}
    );
  }

  ::-webkit-scrollbar-corner {
    background: ${({ colorScheme }) => colorScheme.colors.background}15;
  }

  /* Firefox scrollbar styling */
  html {
    scrollbar-width: thin;
    scrollbar-color: ${({ colorScheme }) => colorScheme.colors.primary}60 ${({ colorScheme }) => colorScheme.colors.background}15;
  }

  /* Casino-specific scroll containers */
  .game-container,
  .game-grid,
  .token-list,
  .transaction-history,
  .all-games-modal {
    scroll-snap-type: y proximity;
    
    /* Enhanced touch gestures for mobile casino games */
    touch-action: pan-y;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;

    /* Custom scrollbar for game containers */
    &::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, 
        ${({ colorScheme }) => colorScheme.colors.accent}70, 
        ${({ colorScheme }) => colorScheme.colors.primary}50
      );
      border-radius: 6px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, 
        ${({ colorScheme }) => colorScheme.colors.accent}, 
        ${({ colorScheme }) => colorScheme.colors.primary}80
      );
      box-shadow: 0 0 12px ${({ colorScheme }) => colorScheme.colors.accent}40;
    }
  }

  /* Smooth scrolling for navigation */
  .navbar,
  .sidebar,
  .header-nav {
    scroll-behavior: smooth;
    overscroll-behavior: none;
  }

  /* Game-specific scroll optimizations */
  .dice-results,
  .slot-reels,
  .card-deck,
  .roulette-history {
    scroll-snap-type: x mandatory;
    scroll-snap-align: center;
    
    &::-webkit-scrollbar {
      height: 6px;
    }
  }

  /* Token select and dropdown scrolling */
  .token-select-dropdown,
  .dropdown-menu {
    scroll-snap-type: y mandatory;
    scroll-snap-align: start;
    max-height: 300px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: ${({ colorScheme }) => colorScheme.colors.primary}80;
      border-radius: 3px;
    }
  }

  /* Mobile-first gesture support */
  @media (max-width: 768px) {
    * {
      -webkit-overflow-scrolling: touch;
      overscroll-behavior-y: contain;
    }
    
    /* Prevent pull-to-refresh on games */
    .game-area,
    .game-container {
      overscroll-behavior-y: none;
      touch-action: pan-x pan-y;
    }

    /* Larger scrollbars on mobile */
    ::-webkit-scrollbar {
      width: 12px;
      height: 12px;
    }

    .game-container::-webkit-scrollbar {
      width: 10px;
    }
  }

  /* Enhanced theming for different color schemes */
  ${({ colorScheme }) => {
    // Special handling for neon/cyberpunk themes
    if (colorScheme.colors.primary.includes('#a259ff') || colorScheme.colors.primary.includes('#00ff')) {
      return `
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, 
            ${colorScheme.colors.primary}80, 
            ${colorScheme.colors.accent}60
          );
          border: 1px solid ${colorScheme.colors.primary}40;
          box-shadow: inset 0 0 6px ${colorScheme.colors.accent}30;
        }

        ::-webkit-scrollbar-thumb:hover {
          box-shadow: 
            inset 0 0 6px ${colorScheme.colors.accent}50,
            0 0 12px ${colorScheme.colors.primary}60;
          border-color: ${colorScheme.colors.accent}60;
        }

        .game-container::-webkit-scrollbar-thumb {
          animation: ${colorScheme.effects.glow ? 'pulse 2s infinite' : 'none'};
        }
      `;
    }
    
    // Special handling for gold/luxury themes
    if (colorScheme.colors.accent.includes('#ffd700') || colorScheme.colors.accent.includes('#gold')) {
      return `
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, 
            ${colorScheme.colors.accent}90, 
            ${colorScheme.colors.primary}70
          );
          border: 1px solid ${colorScheme.colors.accent}50;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, 
            ${colorScheme.colors.accent}, 
            ${colorScheme.colors.primary}90
          );
          box-shadow: 0 0 16px ${colorScheme.colors.accent}40;
        }
      `;
    }
    
    return '';
  }}

  /* Smooth scroll animations */
  @media (prefers-reduced-motion: no-preference) {
    * {
      scroll-behavior: smooth;
    }

    ::-webkit-scrollbar-thumb {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }

  /* Respect reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    * {
      scroll-behavior: auto;
    }

    ::-webkit-scrollbar-thumb {
      transition: none;
    }
  }

  /* High contrast mode adjustments */
  @media (prefers-contrast: high) {
    ::-webkit-scrollbar-thumb {
      background: ${({ colorScheme }) => colorScheme.colors.text}80;
      border: 2px solid ${({ colorScheme }) => colorScheme.colors.background};
    }

    ::-webkit-scrollbar-track {
      background: ${({ colorScheme }) => colorScheme.colors.background};
      border: 1px solid ${({ colorScheme }) => colorScheme.colors.text}30;
    }
  }
`;

// HOC component that provides color scheme to GlobalScrollStyles
export const GlobalScrollStylesProvider: React.FC = () => {
  // This component will be updated to work with the unified theme system
  // For now, we'll use a placeholder that can be integrated later
  return <GlobalScrollStyles colorScheme={{ 
    colors: {
      primary: '#a259ff',
      secondary: '#7e22ce', 
      accent: '#ffd700',
      background: '#1a1a2e',
      surface: '#16213e',
      border: '#0f3460',
      text: '#ffffff',
      textSecondary: '#94a3b8'
    },
    effects: {
      glow: '0 0 20px rgba(162, 89, 255, 0.5)',
      shadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
    }
  }} />;
};