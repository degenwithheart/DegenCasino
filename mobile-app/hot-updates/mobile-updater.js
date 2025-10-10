// DegenCasino Mobile Hot Update System
// Hybrid approach: Local fallback + App storage updates

class DegenCasinoUpdater {
  static UPDATE_CHECK_URL = 'https://degenheart.casino/api/mobile-update-check';
  static DOWNLOAD_URL = 'https://degenheart.casino/api/mobile-update-download';
  static CURRENT_VERSION_KEY = 'degenCasinoMobileVersion';
  static CACHED_CONTENT_KEY = 'degenCasinoCachedApp';
  static LAST_UPDATE_KEY = 'degenCasinoLastUpdate';

  static async checkForUpdates() {
    try {
      console.log('🔍 Checking for app updates...');

      const currentVersion = this.getCurrentVersion();
      console.log('📦 Current version:', currentVersion);

      const response = await fetch(this.UPDATE_CHECK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentVersion,
          platform: 'capacitor-mobile'
        })
      });

      if (!response.ok) {
        console.warn('⚠️ Update check failed:', response.statusText);
        return null;
      }

      const updateInfo = await response.json();

      if (updateInfo.hasUpdate) {
        console.log('🎉 New update available:', updateInfo.version);
        return updateInfo;
      }

      console.log('✅ App is up to date');
      return null;

    } catch (error) {
      console.error('❌ Update check failed:', error);
      return null;
    }
  }

  static async downloadAndCacheUpdate(updateInfo) {
    try {
      console.log('⬇️ Downloading update:', updateInfo.version);

      const response = await fetch(this.DOWNLOAD_URL);
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const updateContent = await response.text();

      // Cache the update content
      localStorage.setItem(this.CACHED_CONTENT_KEY, updateContent);
      localStorage.setItem(this.LAST_UPDATE_KEY, Date.now().toString());

      console.log('✅ Update cached successfully');
      return true;
    } catch (error) {
      console.error('❌ Update download failed:', error);
      return false;
    }
  }

  static async applyUpdate(updateInfo) {
    try {
      if (updateInfo.hasUpdate) {
        // Download and cache the update
        const downloadSuccess = await this.downloadAndCacheUpdate(updateInfo);

        if (downloadSuccess) {
          // Store new version
          this.setCurrentVersion(updateInfo.version);

          // Clear browser caches
          if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
          }

          // Reload to apply cached update
          window.location.reload(true);
          return true;
        } else {
          console.warn('Failed to download update, continuing with current version');
          return false;
        }
      }

      return false;
    } catch (error) {
      console.error('❌ Update failed:', error);
      return false;
    }
  }

  static getCurrentVersion() {
    try {
      return localStorage.getItem(this.CURRENT_VERSION_KEY) || '1.0.0';
    } catch (error) {
      console.warn('Failed to get current version:', error);
      return '1.0.0';
    }
  }

  static setCurrentVersion(version) {
    try {
      localStorage.setItem(this.CURRENT_VERSION_KEY, version);
      console.log('📱 Version updated to:', version);
    } catch (error) {
      console.error('Failed to set current version:', error);
    }
  }

  static async checkAndUpdate(showUI = true) {
    const updateInfo = await this.checkForUpdates();

    if (!updateInfo) {
      return false;
    }

    if (showUI) {
      const shouldUpdate = confirm(
        `🎰 DegenCasino Update Available!\n\n` +
        `Version: ${updateInfo.version}\n` +
        `Size: ${(updateInfo.size / 1024 / 1024).toFixed(2)} MB\n\n` +
        `Update now? The app will restart.`
      );

      if (!shouldUpdate && !updateInfo.mandatory) {
        return false;
      }
    }

    return await this.applyUpdate(updateInfo);
  }

  // Load cached content if available
  static loadCachedContent() {
    try {
      const cachedContent = localStorage.getItem(this.CACHED_CONTENT_KEY);
      const lastUpdate = localStorage.getItem(this.LAST_UPDATE_KEY);

      if (cachedContent && lastUpdate) {
        const updateAge = Date.now() - parseInt(lastUpdate);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        if (updateAge < maxAge) {
          console.log('� Loading cached update content');

          // Create a blob from cached content and inject it
          const blob = new Blob([cachedContent], { type: 'text/html' });
          const url = URL.createObjectURL(blob);

          // Create iframe to load cached content
          const iframe = document.createElement('iframe');
          iframe.src = url;
          iframe.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;border:none;z-index:999999;';
          iframe.onload = () => URL.revokeObjectURL(url);

          document.body.appendChild(iframe);
          return true;
        } else {
          // Cached content expired
          localStorage.removeItem(this.CACHED_CONTENT_KEY);
          localStorage.removeItem(this.LAST_UPDATE_KEY);
        }
      }

      console.log('📱 Using local bundled content (no valid cache)');
      return false;
    } catch (error) {
      console.error('❌ Error loading cached content:', error);
      return false;
    }
  }

  static init() {
    console.log('🚀 DegenCasino Hybrid Update System initialized');

    // First, try to load cached content
    const loadedFromCache = this.loadCachedContent();

    if (!loadedFromCache) {
      console.log('📱 Fallback: Using local bundled content');
    }

    // Check for updates on app start (silent)
    setTimeout(() => {
      this.checkAndUpdate(false);
    }, 2000);

    // Check for updates every 2 minutes for faster updates
    setInterval(() => {
      this.checkAndUpdate(false);
    }, 2 * 60 * 1000);

    // Add manual update button to UI
    this.addUpdateButton();
  }

  static addUpdateButton() {
    // Add a floating update button
    const updateButton = document.createElement('button');
    updateButton.innerHTML = '🔄';
    updateButton.title = 'Check for updates';
    updateButton.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 50%;
      font-size: 20px;
      cursor: pointer;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
    `;

    updateButton.onmouseover = () => {
      updateButton.style.transform = 'scale(1.1)';
      updateButton.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
    };

    updateButton.onmouseout = () => {
      updateButton.style.transform = 'scale(1)';
      updateButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    };

    updateButton.onclick = () => {
      updateButton.innerHTML = '⏳';
      this.checkAndUpdate(true).finally(() => {
        updateButton.innerHTML = '🔄';
      });
    };

    document.body.appendChild(updateButton);
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => DegenCasinoUpdater.init());
} else {
  DegenCasinoUpdater.init();
}

// Export for manual use
window.DegenCasinoUpdater = DegenCasinoUpdater;