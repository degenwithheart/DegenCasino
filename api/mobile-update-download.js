// Vercel Edge API for mobile app update downloads
export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    console.log('📦 Mobile update download requested');
    
    // Get the current web app bundle
    const webAppUrl = `${new URL(req.url).origin}`;
    const indexResponse = await fetch(`${webAppUrl}/`);
    
    if (!indexResponse.ok) {
      throw new Error('Failed to fetch web app');
    }
    
    const webAppContent = await indexResponse.text();
    
    // Create a mobile-optimized bundle
    const mobileBundle = createMobileBundle(webAppContent, webAppUrl);
    
    console.log('✅ Mobile update bundle created');
    
    return new Response(mobileBundle, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': 'attachment; filename="mobile-update.html"',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
    
  } catch (error) {
    console.error('❌ Mobile update download failed:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

function createMobileBundle(htmlContent, baseUrl) {
  // Inject mobile update detection script
  const updateScript = `
    <script>
      // DegenCasino Mobile Update System
      window.DEGEN_MOBILE_VERSION = '${Date.now()}';
      
      // Store version in localStorage
      try {
        localStorage.setItem('degenCasinoMobileVersion', window.DEGEN_MOBILE_VERSION);
        console.log('📱 Mobile version updated:', window.DEGEN_MOBILE_VERSION);
      } catch (e) {
        console.warn('Failed to store mobile version');
      }
      
      // Auto-check for updates every 5 minutes
      setInterval(async () => {
        try {
          const response = await fetch('${baseUrl}/api/mobile-update-check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              currentVersion: window.DEGEN_MOBILE_VERSION,
              platform: 'mobile'
            })
          });
          
          const updateInfo = await response.json();
          
          if (updateInfo.hasUpdate) {
            console.log('🎉 New update available!');
            
            // Show subtle notification
            const notification = document.createElement('div');
            notification.innerHTML = '🎰 New update available! Tap to refresh';
            notification.style.cssText = \`
              position: fixed; top: 10px; right: 10px; z-index: 10000;
              background: #4CAF50; color: white; padding: 10px;
              border-radius: 5px; cursor: pointer; font-size: 12px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            \`;
            
            notification.onclick = () => window.location.reload();
            document.body.appendChild(notification);
            
            // Auto-reload after 30 seconds if user doesn't click
            setTimeout(() => window.location.reload(), 30000);
          }
        } catch (error) {
          console.warn('Update check failed:', error);
        }
      }, 5 * 60 * 1000); // 5 minutes
    </script>
  `;
  
  // Inject the update script before closing </head> tag
  return htmlContent.replace('</head>', `${updateScript}</head>`);
}