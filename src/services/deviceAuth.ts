import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import { App } from '@capacitor/app';

const AUTH_ENABLED_KEY = 'device_auth_enabled';

export class DeviceAuthService {
  private static instance: DeviceAuthService;
  private isEnabled: boolean = false;

  private constructor() {}

  static getInstance(): DeviceAuthService {
    if (!DeviceAuthService.instance) {
      DeviceAuthService.instance = new DeviceAuthService();
    }
    return DeviceAuthService.instance;
  }

  async init() {
    // Load saved preference
    const { value } = await Preferences.get({ key: AUTH_ENABLED_KEY });
    this.isEnabled = value === 'true';

    if (this.isEnabled) {
      // Register app pause listener for auth
      App.addListener('appStateChange', async ({ isActive }: { isActive: boolean }) => {
        if (isActive) {
          await this.authenticate();
        }
      });
    }
  }

  async authenticate(): Promise<boolean> {
    try {
      // Check if device has biometric/security capabilities
      const { isSecureAuthAvailable } = await Device.isSecureAuthAvailable();
      
      if (!isSecureAuthAvailable) {
        return true; // Allow if no secure auth available
      }

      const result = await Device.secureAuth({
        reason: 'Please authenticate to access DegenCasino',
        title: 'Authentication Required',
        cancelTitle: 'Cancel',
        biometricTitle: 'Biometric Authentication',
        biometricSubtitle: 'Use your biometric data to unlock',
        passcodeTitle: 'Passcode Authentication',
        passcodeSubtitle: 'Enter your device passcode'
      });

      return result.authenticated;
    } catch (error) {
      console.error('Auth error:', error);
      return false;
    }
  }

  async enableAuth(enable: boolean) {
    this.isEnabled = enable;
    await Preferences.set({
      key: AUTH_ENABLED_KEY,
      value: enable.toString()
    });

    if (enable) {
      // Immediate authentication when enabling
      return this.authenticate();
    }
    return true;
  }

  async isAuthEnabled(): Promise<boolean> {
    return this.isEnabled;
  }
}