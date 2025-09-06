// Analytics utilities for frontend-only app
// Sends events to external analytics services

interface AnalyticsEvent {
  type: string;
  game?: string;
  amount?: number;
  wallet?: string;
  outcome?: 'win' | 'loss';
  timestamp?: string;
  [key: string]: any;
}

/**
 * Track analytics events
 * Sends events to external analytics service and admin API
 */
export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  const fullEvent = {
    ...event,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  // Log to console for development
  console.log('[Analytics]', fullEvent);

  // Send to admin analytics API (if admin token is available)
  try {
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      await fetch('/api/admin/analytics?action=events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken
        },
        body: JSON.stringify(fullEvent)
      });
    }
  } catch (error) {
    console.error('Failed to send analytics event:', error);
  }
}

/**
 * Track game start
 */
export async function trackGameStart(gameId: string, walletAddress?: string): Promise<void> {
  await trackEvent({
    type: 'game_start',
    game: gameId,
    wallet: walletAddress?.slice(0, 8) + '...' // Truncate for privacy
  });
}

/**
 * Track bet placement
 */
export async function trackBetPlaced(gameId: string, amount: number, walletAddress?: string): Promise<void> {
  await trackEvent({
    type: 'bet_placed',
    game: gameId,
    amount,
    wallet: walletAddress?.slice(0, 8) + '...'
  });
}

/**
 * Track game outcome
 */
export async function trackGameOutcome(gameId: string, amount: number, outcome: 'win' | 'loss', walletAddress?: string): Promise<void> {
  await trackEvent({
    type: 'game_outcome',
    game: gameId,
    amount,
    outcome,
    wallet: walletAddress?.slice(0, 8) + '...'
  });
}

/**
 * Track page views
 */
export async function trackPageView(page: string): Promise<void> {
  await trackEvent({
    type: 'page_view',
    page
  });
}

/**
 * Track user engagement
 */
export async function trackEngagement(action: string, details?: any): Promise<void> {
  await trackEvent({
    type: 'engagement',
    action,
    ...details
  });
}
