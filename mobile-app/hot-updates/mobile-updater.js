// DegenCasino Mobile Hot Update System
// Simple JavaScript implementation for Capacitor + Vercel Edge

class DegenCasinoUpdater {
  static UPDATE_CHECK_URL = 'https://degenheart.casino/api/mobile-update-check';
  static CURRENT_VERSION_KEY = 'degenCasinoMobileVersion';
  
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

  static async applyUpdate(updateInfo) {
    try {
      console.log('⬇️ Downloading update:', updateInfo.version);

      // For web-based Capacitor apps, we can simply reload with cache bypass
      if (updateInfo.hasUpdate) {
        // Store new version
        this.setCurrentVersion(updateInfo.version);
        
        // Clear caches and reload
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map(name => caches.delete(name)));
        }
        
        // Force reload with cache bypass
        window.location.reload(true);
        return true;
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

  static init() {
    console.log('🚀 DegenCasino Mobile Updater initialized');
    
    // Check for updates on app start (silent)
    setTimeout(() => {
      this.checkAndUpdate(false);
    }, 3000);
    
    // Check for updates every 10 minutes
    setInterval(() => {
      this.checkAndUpdate(false);
    }, 10 * 60 * 1000);
    
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