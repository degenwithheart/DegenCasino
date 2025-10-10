import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.degenheart.casino',
  appName: 'DegenCasino',
  webDir: 'www',
  plugins: {
    // Fix zoom and viewport issues
    App: {
      launchShowDuration: 0,
    },
    // Configure WebView for proper mobile scaling
    WebView: {
      allowMixedContent: true,
    },
  },
  android: {
    // Android-specific WebView configuration
    zoomEnabled: false,
    allowMixedContent: true,
    // Configure WebView for better mobile experience
    webContentsDebuggingEnabled: true,
  },
  // Configure for local content with hot updates
  server: {
    androidScheme: 'https',
    // Ensure proper HTTPS handling for Solana wallet connections
    allowNavigation: ['https://*'],
  }
};

export default config;
