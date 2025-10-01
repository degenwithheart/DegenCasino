declare module '@capacitor/device' {
  export const Device: any;
}

declare module '@capacitor/preferences' {
  export const Preferences: any;
}

declare module '@capacitor/app' {
  export const App: any;
}

// Allow importing Capacitor types in services without full dependencies in this environment
declare module '@capacitor/core' {
  export const Capacitor: any;
}
