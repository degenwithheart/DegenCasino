// Simple mobile updater for DegenCasino
// Works with Capacitor apps and Vercel Edge Runtime

class DegenCasinoUpdater {
  static UPDATE_CHECK_URL = 'https://degenheart.casino/api/mobile-update-check';
  static CURRENT_VERSION_KEY = 'degenCasinoMobileVersion';
  
  static async checkForUpdates() { from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { Network } from '@capacitor/network';
import { Filesystem, Directory } from '@capacitor/filesystem';

/**
 * UpdateInfo structure:
 * - version: string
 * - buildTime: string  
 * - downloadUrl: string
 * - size: number
 * - mandatory: boolean
 */

export class DegenCasinoUpdater {
  static UPDATE_CHECK_URL = 'https://degenheart.casino/api/mobile-update-check';
  static CURRENT_VERSION_KEY = 'currentAppVersion';
  static UPDATE_BUNDLE_DIR = 'updates';
  
  static async checkForUpdates(): Promise<UpdateInfo | null> {
    if (!Capacitor.isNativePlatform()) {
      console.log('📱 Hot updates only work on native platforms');
      return null;
    }

    try {
      // Check network connectivity
      const networkStatus = await Network.getStatus();
      if (!networkStatus.connected) {
        console.log('📡 No network connection, skipping update check');
        return null;
      }

      console.log('🔍 Checking for app updates...');
      
      // Get current version
      const currentVersion = await this.getCurrentVersion();
      console.log('📦 Current version:', currentVersion);

      // Check for updates from server
      const response = await fetch(this.UPDATE_CHECK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentVersion,
          platform: Capacitor.getPlatform()
        })
      });

      if (!response.ok) {
        console.warn('⚠️ Update check failed:', response.statusText);
        return null;
      }

      const updateInfo: UpdateInfo = await response.json();
      
      if (updateInfo.version !== currentVersion) {
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

  static async downloadAndInstallUpdate(updateInfo: UpdateInfo): Promise<boolean> {
    try {
      console.log('⬇️ Downloading update:', updateInfo.version);

      // Download the update bundle
      const response = await fetch(updateInfo.downloadUrl);
      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      const updateBundle = await response.text();
      
      // Save to filesystem
      const fileName = `update-${updateInfo.version}.html`;
      await Filesystem.writeFile({
        path: `${this.UPDATE_BUNDLE_DIR}/${fileName}`,
        data: updateBundle,
        directory: Directory.Data
      });

      // Update the current version
      await this.setCurrentVersion(updateInfo.version);
      
      console.log('✅ Update installed successfully');
      return true;

    } catch (error) {
      console.error('❌ Update installation failed:', error);
      return false;
    }
  }

  static async getCurrentVersion(): Promise<string> {
    try {
      const result = await Preferences.get({ key: this.CURRENT_VERSION_KEY });
      return result.value || '1.0.0';
    } catch (error) {
      console.warn('Failed to get current version:', error);
      return '1.0.0';
    }
  }

  static async setCurrentVersion(version: string): Promise<void> {
    try {
      await Preferences.set({
        key: this.CURRENT_VERSION_KEY,
        value: version
      });
    } catch (error) {
      console.error('Failed to set current version:', error);
    }
  }

  static async initializeUpdater(): Promise<void> {
    try {
      // Create updates directory
      await Filesystem.mkdir({
        path: this.UPDATE_BUNDLE_DIR,
        directory: Directory.Data,
        recursive: true
      });

      console.log('🚀 DegenCasino Updater initialized');
    } catch (error) {
      console.error('Failed to initialize updater:', error);
    }
  }

  static async checkAndUpdate(showUI: boolean = true): Promise<boolean> {
    const updateInfo = await this.checkForUpdates();
    
    if (!updateInfo) {
      return false;
    }

    if (showUI) {
      const shouldUpdate = confirm(
        `🎰 New DegenCasino update available!\n\n` +
        `Version: ${updateInfo.version}\n` +
        `Size: ${(updateInfo.size / 1024 / 1024).toFixed(2)} MB\n\n` +
        `Update now?`
      );

      if (!shouldUpdate && !updateInfo.mandatory) {
        return false;
      }
    }

    const success = await this.downloadAndInstallUpdate(updateInfo);
    
    if (success) {
      if (showUI) {
        alert('🎉 Update installed! The app will reload with the latest version.');
      }
      // Reload the app
      window.location.reload();
    }

    return success;
  }
}

// Auto-initialize when the script loads
if (Capacitor.isNativePlatform()) {
  document.addEventListener('DOMContentLoaded', () => {
    DegenCasinoUpdater.initializeUpdater();
    
    // Check for updates on app start (silent)
    setTimeout(() => {
      DegenCasinoUpdater.checkAndUpdate(false);
    }, 2000);
  });
}