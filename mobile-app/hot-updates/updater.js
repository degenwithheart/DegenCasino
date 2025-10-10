// Plain-JS mobile updater for DegenCasino (no TypeScript, no imports)
// This file is intended to run inside the Capacitor webview. It uses
// Capacitor's global `Capacitor` and the available plugin globals when present.

 
(function () {
  const UPDATE_CHECK_URL = 'https://degenheart.casino/api/mobile-update-check';
  const CURRENT_VERSION_KEY = 'degenCasinoMobileVersion';
  const UPDATE_BUNDLE_DIR = 'updates';

  const isNative = typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();

  async function getCurrentVersion() {
    try {
      // Try Capacitor Preferences if available
      if (isNative && window.Capacitor.Plugins && window.Capacitor.Plugins.Preferences) {
        const { Preferences } = window.Capacitor.Plugins;
        const res = await Preferences.get({ key: CURRENT_VERSION_KEY });
        return (res && res.value) || '1.0.0';
      }

      // Fallback to localStorage for browser
      return localStorage.getItem(CURRENT_VERSION_KEY) || '1.0.0';
    } catch (e) {
      console.warn('getCurrentVersion failed', e);
      return '1.0.0';
    }
  }

  async function setCurrentVersion(version) {
    try {
      if (isNative && window.Capacitor.Plugins && window.Capacitor.Plugins.Preferences) {
        const { Preferences } = window.Capacitor.Plugins;
        await Preferences.set({ key: CURRENT_VERSION_KEY, value: version });
        return;
      }
      localStorage.setItem(CURRENT_VERSION_KEY, version);
    } catch (e) {
      console.warn('setCurrentVersion failed', e);
    }
  }

  async function checkForUpdates() {
    if (!isNative) {
      // Only run on native platforms (Capacitor)
      return null;
    }

    try {
      // Basic network check if Capacitor Network plugin exists
      if (window.Capacitor.Plugins && window.Capacitor.Plugins.Network) {
        const { Network } = window.Capacitor.Plugins;
        const status = await Network.getStatus();
        if (!status.connected) return null;
      }

      const currentVersion = await getCurrentVersion();

      const resp = await fetch(UPDATE_CHECK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentVersion, platform: window.Capacitor.getPlatform() })
      });

      if (!resp.ok) return null;
      const info = await resp.json();
      if (!info || !info.version) return null;
      if (info.version !== currentVersion) return info;
      return null;
    } catch (e) {
      console.warn('checkForUpdates error', e);
      return null;
    }
  }

  async function downloadAndInstallUpdate(info) {
    try {
      const resp = await fetch(info.downloadUrl);
      if (!resp.ok) throw new Error('download failed');
      const bundle = await resp.text();

      // Attempt to save with Filesystem plugin if available
      if (isNative && window.Capacitor.Plugins && window.Capacitor.Plugins.Filesystem) {
        const { Filesystem } = window.Capacitor.Plugins;
        try {
          await Filesystem.writeFile({ path: `${UPDATE_BUNDLE_DIR}/update-${info.version}.html`, data: bundle, directory: 'DATA' });
        } catch (e) {
          console.warn('Filesystem write failed', e);
        }
      }

      await setCurrentVersion(info.version);
      return true;
    } catch (e) {
      console.warn('downloadAndInstallUpdate failed', e);
      return false;
    }
  }

  async function checkAndUpdate(showUI) {
    const info = await checkForUpdates();
    if (!info) return false;

    if (showUI !== false) {
      const ok = confirm(`New update ${info.version} available. Install now?`);
      if (!ok && !info.mandatory) return false;
    }

    const ok = await downloadAndInstallUpdate(info);
    if (ok && showUI !== false) {
      alert('Update installed. Reloading.');
      window.location.reload();
    }
    return ok;
  }

  // Initialize on DOM ready for native platforms
  if (isNative) {
    document.addEventListener('DOMContentLoaded', function () {
      // Run silently after short delay
      setTimeout(() => { checkAndUpdate(false).catch(() => { }); }, 2000);
    });
  }

  // Expose API on window for integration code
  window.DegenCasinoUpdater = {
    checkForUpdates,
    downloadAndInstallUpdate,
    getCurrentVersion,
    setCurrentVersion,
    checkAndUpdate
  };

})();