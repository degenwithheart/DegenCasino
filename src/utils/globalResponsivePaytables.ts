/**
 * Global Mobile Responsive Paytable Hider
 * Automatically hides paytables on mobile for all games
 * Just import this once in App.tsx and it works everywhere
 */

const MOBILE_BREAKPOINT = 1000

/**
 * Inject responsive CSS that hides paytables on mobile
 */
function injectResponsiveCSS() {
  // Check if styles already injected
  if (document.getElementById('responsive-paytable-styles')) {
    return
  }

  const style = document.createElement('style')
  style.id = 'responsive-paytable-styles'
  style.textContent = `
    @media (max-width: ${MOBILE_BREAKPOINT}px) {
      /* Target specific game paytable classes that we know exist */
      .mines-paytable,
      .slots-paytable,
      .dice-paytable,
      .poker-paytable,
      [class*="-paytable"],
      [class*="paytable" i] {
        display: none !important;
      }
      
      /* Target flex layouts - hide second child (typically paytable) */
      [data-gamba-ui-portal="screen"] div[style*="display: flex"] > div:nth-child(2):last-child,
      div[style*="display: flex"][style*="gap"] > div:nth-child(2):last-child {
        display: none !important;
      }
      
      /* Adjust flex layout when paytable is hidden */
      [data-gamba-ui-portal="screen"] div[style*="display: flex"],
      div[style*="display: flex"][style*="gap"] {
        gap: 0 !important;
      }
      
      /* Make game area expand */
      [data-gamba-ui-portal="screen"] div[style*="display: flex"] > div:first-child,
      div[style*="display: flex"][style*="gap"] > div:first-child {
        flex: 1 !important;
        width: 100% !important;
      }
    }
  `
  
  document.head.appendChild(style)
}

/**
 * Initialize responsive paytable hiding
 */
export function initResponsivePaytables() {
  // Inject CSS immediately
  injectResponsiveCSS()
  
  // Also inject when DOM changes (for dynamically loaded content)
  if (typeof window !== 'undefined' && 'MutationObserver' in window) {
    const observer = new MutationObserver(() => {
      injectResponsiveCSS()
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }
}

// Auto-initialize
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initResponsivePaytables)
  } else {
    initResponsivePaytables()
  }
}
