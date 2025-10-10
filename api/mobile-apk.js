// Vercel API for APK building and download with smart caching
export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    // Mobile app functionality is disabled
    return new Response('Mobile app functionality has been disabled.', {
        status: 503,
        headers: {
            'Content-Type': 'text/plain'
        }
    });

    /* Disabled mobile app code:
    try {
        // Edge runtime uses different request object
        const headers = req.headers || new Headers();
        const isBuildTrigger = headers.get('x-build-trigger') === 'true' || headers.get('user-agent')?.includes('Vercel-Build-Agent');
    
        console.log('📱 APK request -', isBuildTrigger ? 'Build trigger' : 'User download');
    
        // First, try to serve existing APK from Vercel's file system
        const existingAPK = await checkExistingAPK();
    
        if (existingAPK.exists && !isBuildTrigger) {
            console.log('✅ Serving existing APK from cache');
    
            return new Response(existingAPK.content, {
                status: 200,
                headers: {
                    'Content-Type': 'application/vnd.android.package-archive',
                    'Content-Disposition': 'attachment; filename="DegenCasino.apk"',
                    'Content-Length': existingAPK.size.toString(),
                    'Cache-Control': 'public, max-age=3600',
                    'X-Served-From': 'edge-cache',
                    'X-Build-Time': existingAPK.buildTime
                }
            });
        }
    
        // APK not found or build trigger, build it once and cache
        console.log('🔨 Building APK...', isBuildTrigger ? '(triggered by build)' : '(on demand)');
        console.log('🔍 Host header:', headers.get('host'));
        console.log('🔍 User-Agent:', headers.get('user-agent'));
        const buildResult = await buildAndCacheAPK(req);
    
        if (buildResult.success) {
            console.log('✅ APK built and cached successfully');
    
            // If this is a build trigger, just return success status
            if (isBuildTrigger) {
                return new Response(JSON.stringify({
                    success: true,
                    message: 'APK built and cached',
                    size: buildResult.size,
                    buildTime: new Date().toISOString()
                }), {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
    
            return new Response(buildResult.content, {
                status: 200,
                headers: {
                    'Content-Type': 'application/vnd.android.package-archive',
                    'Content-Disposition': 'attachment; filename="DegenCasino.apk"',
                    'Content-Length': buildResult.size.toString(),
                    'Cache-Control': 'public, max-age=3600',
                    'X-Built-On': 'edge',
                    'X-Build-Time': new Date().toISOString()
                }
            });
        }
    
        // If this was a build trigger that failed, return error status
        if (isBuildTrigger) {
            return new Response(JSON.stringify({
                success: false,
                message: 'APK build failed during deployment',
                error: buildResult.error || 'Unknown error'
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    
        // Fallback instructions for user requests
        const instructions = `
    # DegenCasino Mobile App
    
    🔨 Building PWA installer...
    
    ## Quick Install:
    Visit: ${headers.get('host') || 'www.degenheart.casino'}/api/mobile-apk
    
    ## Manual Build:
    \`\`\`bash
    git clone https://github.com/degenwithheart/DegenCasino.git
    cd DegenCasino/mobile-app
    ./build-signed-apk.sh
    \`\`\`
    
    ## Features:
    ✅ Hot updates every 2 minutes
    ✅ Offline support with local fallback  
    ✅ All games and features included
    
    Refresh to try the installer again.
    `;
    
        return new Response(instructions, {
            status: 202,
            headers: {
                'Content-Type': 'text/plain',
                'Retry-After': '180'
            }
        });
    
    } catch (error) {
        console.error('❌ Mobile app service failed:', error);
    
        // Check if this was a build trigger
        const headers = req.headers || new Headers();
        const isBuildTrigger = headers.get('x-build-trigger') === 'true' || headers.get('user-agent')?.includes('Vercel-Build-Agent');
    
        if (isBuildTrigger) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Mobile app service failed during build',
                error: error.message
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    
        return new Response('Mobile app service temporarily unavailable.', {
            status: 503,
            headers: {
                'Content-Type': 'text/plain',
                'Retry-After': '300'
            }
        });
    }
    }
    
    // Simple in-memory cache for Edge runtime (rebuilds every deployment)
    let apkCache = null;
    
    async function checkExistingAPK() {
    try {
        // In Edge runtime, we'll use simple in-memory caching
        // APK will be rebuilt on each new deployment, cached for that deployment session
    
        if (apkCache && apkCache.content) {
            console.log('📦 Found APK in memory cache');
            return {
                exists: true,
                content: apkCache.content,
                size: apkCache.size,
                buildTime: apkCache.buildTime
            };
        }
    
        console.log('💭 No APK in memory cache');
        return { exists: false };
    
    } catch (error) {
        console.log('No existing APK found:', error.message);
        return { exists: false };
    }
    }
    
    async function buildAndCacheAPK(req) {
    try {
        console.log('🔨 Building APK for the first time...');
    
        // Get the web app content - handle Edge runtime request properly
        const headers = req.headers || new Headers();
        const host = headers.get('host') || 'www.degenheart.casino';
        const webAppUrl = `https://${host}`;
        console.log('📱 Fetching web app from:', webAppUrl);
    
        console.log('🌐 Attempting to fetch:', webAppUrl);
        const webAppResponse = await fetch(webAppUrl);
    
        console.log('📡 Fetch response status:', webAppResponse.status);
        if (!webAppResponse.ok) {
            throw new Error(`Failed to fetch web app: ${webAppResponse.status} ${webAppResponse.statusText}`);
        }
    
        const htmlContent = await webAppResponse.text();
    
        // Create a comprehensive mobile app bundle
        const apkContent = await createMobileAppBundle(htmlContent, webAppUrl);
    
        // Cache in memory for this deployment session
        const metadata = {
            buildTime: new Date().toISOString(),
            size: apkContent.length,
            webAppUrl: webAppUrl,
            version: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown'
        };
    
        // Store in memory cache
        apkCache = {
            content: apkContent,
            size: apkContent.length,
            buildTime: metadata.buildTime,
            metadata: metadata
        };
    
        console.log('✅ APK built and cached in memory');
        console.log(`📦 Size: ${(apkContent.length / 1024 / 1024).toFixed(2)} MB`);
    
        return {
            success: true,
            content: apkContent,
            size: apkContent.length,
            metadata: metadata
        };
    
    } catch (error) {
        console.error('❌ APK build failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
    }
    
    async function createMobileAppBundle(htmlContent, webAppUrl) {
    console.log('📱 Creating comprehensive mobile app bundle...');
    
    // Create a sophisticated PWA that acts like a native app
    const mobileApp = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>DegenCasino Mobile</title>
     
    <!-- PWA Manifest -->
    <link rel="manifest" href="data:application/json;base64,${Buffer.from(JSON.stringify({
        name: "DegenCasino",
        short_name: "DegenCasino",
        description: "Solana's premier on-chain casino with provably fair games",
        start_url: webAppUrl,
        display: "standalone",
        orientation: "portrait",
        background_color: "#000000",
        theme_color: "#4CAF50",
        categories: ["games", "entertainment"],
        icons: [
            {
                src: "data:image/svg+xml;base64," + Buffer.from(`
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
                        <rect width="192" height="192" fill="#4CAF50"/>
                        <text x="96" y="120" text-anchor="middle" font-size="80" fill="white">🎰</text>
                    </svg>
                `).toString('base64'),
                sizes: "192x192",
                type: "image/svg+xml"
            }
        ]
    })).toString('base64')}">
     
    <!-- iOS PWA Meta Tags -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="DegenCasino">
     
    <style>
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
        
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            overflow-x: hidden;
        }
        
        .container {
            text-align: center;
            max-width: 400px;
            background: rgba(255,255,255,0.15);
            padding: 2.5rem;
            border-radius: 25px;
            backdrop-filter: blur(15px);
            box-shadow: 0 25px 50px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.2);
        }
        
        .logo {
            font-size: 4rem;
            margin-bottom: 1rem;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        h1 { 
            margin-bottom: 0.5rem;
            font-size: 1.8rem;
            font-weight: 700;
        }
        
        .subtitle {
            margin-bottom: 2rem;
            opacity: 0.9;
            font-size: 1rem;
        }
        
        .launch-btn {
            background: linear-gradient(45deg, #4CAF50, #45a049);
            color: white;
            border: none;
            padding: 1.2rem 2rem;
            border-radius: 15px;
            font-size: 1.2rem;
            font-weight: bold;
            cursor: pointer;
            width: 100%;
            margin: 1rem 0;
            transition: all 0.3s ease;
            box-shadow: 0 8px 20px rgba(76, 175, 80, 0.4);
        }
        
        .launch-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 25px rgba(76, 175, 80, 0.6);
        }
        
        .install-btn {
            background: rgba(255,255,255,0.2);
            color: white;
            border: 2px solid rgba(255,255,255,0.3);
            padding: 1rem 2rem;
            border-radius: 15px;
            font-size: 1rem;
            cursor: pointer;
            width: 100%;
            margin: 0.5rem 0;
            transition: all 0.3s ease;
        }
        
        .install-btn:hover {
            background: rgba(255,255,255,0.3);
            border-color: rgba(255,255,255,0.5);
        }
        
        .features {
            text-align: left;
            margin: 2rem 0;
            background: rgba(0,0,0,0.2);
            padding: 1.5rem;
            border-radius: 15px;
        }
        
        .features h3 {
            margin-bottom: 1rem;
            text-align: center;
        }
        
        .features li {
            margin: 0.8rem 0;
            padding-left: 0.5rem;
            font-size: 0.95rem;
        }
        
        .status {
            margin: 1rem 0;
            padding: 1rem;
            background: rgba(76, 175, 80, 0.2);
            border-radius: 10px;
            border-left: 4px solid #4CAF50;
        }
        
        .loading {
            display: none;
            margin: 1rem 0;
        }
        
        .spinner {
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top: 2px solid white;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
    </head>
    <body>
    <div class="container">
        <div class="logo">🎰</div>
        <h1>DegenCasino</h1>
        <p class="subtitle">Solana's Premier On-Chain Casino</p>
        
        <div class="status">
            ✅ Ready to launch with hot updates!
        </div>
        
        <button class="launch-btn" onclick="launchCasino()">
            🚀 Launch Casino
        </button>
        
        <button class="install-btn" onclick="installApp()" id="installBtn">
            📱 Add to Home Screen
        </button>
        
        <div class="loading" id="loading">
            <div class="spinner"></div>
            <p>Launching casino...</p>
        </div>
        
        <div class="features">
            <h3>🎮 Features</h3>
            <ul>
                <li>🔄 Auto-updates every 2 minutes</li>
                <li>📱 Full offline support</li>
                <li>🎲 All provably fair games</li>
                <li>⚡ Instant Solana payouts</li>
                <li>🎰 Dice, Slots, Crash & more</li>
                <li>🏆 Leaderboards & jackpots</li>
            </ul>
        </div>
    </div>
     
    <script>
        let deferredPrompt;
        let installButton = document.getElementById('installBtn');
        
        // PWA install prompt handling
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            installButton.style.display = 'block';
        });
        
        function installApp() {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('PWA installed successfully');
                        installButton.textContent = '✅ Installed!';
                        installButton.disabled = true;
                    }
                    deferredPrompt = null;
                });
            } else {
                // Fallback: Show manual install instructions
                alert('To install: Open browser menu → "Add to Home Screen" or "Install App"');
            }
        }
        
        function launchCasino() {
            document.getElementById('loading').style.display = 'block';
            
            // Open casino with fallback handling
            try {
                window.location.href = '${webAppUrl}';
            } catch (error) {
                // Fallback for environments where redirect might fail
                window.open('${webAppUrl}', '_blank');
            }
        }
        
        // Auto-launch after 5 seconds if no interaction
        let autoLaunchTimer = setTimeout(() => {
            if (!document.hidden) {
                launchCasino();
            }
        }, 5000);
        
        // Cancel auto-launch if user interacts
        document.addEventListener('click', () => {
            clearTimeout(autoLaunchTimer);
        });
        
        // Service Worker registration for PWA features
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('data:application/javascript;base64,${Buffer.from(`
                const CACHE_NAME = 'degencasino-mobile-v1';
                
                self.addEventListener('install', (event) => {
                    console.log('DegenCasino Mobile SW installed');
                });
                
                self.addEventListener('fetch', (event) => {
                    // Simple pass-through for now
                    event.respondWith(fetch(event.request));
                });
            `).toString('base64')}')
            .then((registration) => {
                console.log('SW registered successfully');
            })
            .catch((error) => {
                console.log('SW registration failed');
            });
        }
        
        console.log('🎰 DegenCasino Mobile App Ready');
        console.log('🔗 Casino URL: ${webAppUrl}');
        console.log('📱 Built: ${new Date().toISOString()}');
    </script>
    </body>
    </html>`;
    
        return Buffer.from(mobileApp);
    }
    */
}